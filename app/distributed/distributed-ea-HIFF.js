#!/usr/bin/env node

var nodeo = require('nodeo'),
    utils= nodeo.utils,
    winston = require('winston'),
    HIFF = nodeo.HIFF,
    fluxeo = nodeo.FluxEO,
    fs= require('fs'),
    rest = require('restler');

require('winston-papertrail').Papertrail;
require('winston-logstash');

var Population = fluxeo.Population,
Selection = fluxeo.Selection,
Tournament = Selection.Tournament;

// Load conf file
var conf_file = process.argv[2] || 'hiff.json';
var conf = JSON.parse(fs.readFileSync( conf_file, 'utf8' ));

// Set up log
var logger = new (winston.Logger)({
    transports: [
	new (winston.transports.Console)(),
	new (winston.transports.File)({ filename: conf.output_preffix+"-hiff.log" })
    ]
  });

if ( typeof process.env.PAPERTRAIL_PORT !== 'undefined' && typeof process.env.PAPERTRAIL_HOST !== 'undefined' ) { 
    logger.add(winston.transports.Papertrail, 
	       {
		   host: process.env.PAPERTRAIL_HOST,
		   port: process.env.PAPERTRAIL_PORT
	       }
	      )
}

if ( typeof process.env.LOGSTASH_PORT !== 'undefined' && typeof process.env.LOGSTASH_IP !== 'undefined' ) { 
    logger.add( winston.transports.Logstash, 
		{
		    port: process.env.LOGSTASH_PORT,
		    node_name: 'Cloudy GA',
		    host: process.env.LOGSTASH_IP
		}
	      );
};


if ( !conf ) {
    throw "Problems with conf file";
}

logger.info( conf );
var chromosome_size = conf.chromosome_size;
var population_size = conf.population_size;
var tournament_size = conf.tournament_size;
var total_generations = 0;

var hiff = new HIFF.HIFF();

var this_fitness = function( individual ) {
    return hiff.apply( individual );
};

var random_chromosome = function() {
    return utils.random( chromosome_size );
};

var population = new Population();

population.initialize( population_size, random_chromosome);

// Set up global variables
var generation_count = 0;
var UUID= process.env.LOGNAME+"-"+process.pid;

// Checks termination conditions
var check = function( population ) {

    if ( (population.fitness( population.best()) < conf.fitness_max ) && (generation_count*conf.population_size < conf.max_evaluations )) {
	generation_count++;
	logger.info( { 
	    "chromosome": population.best(),
	    "fitness" : population.fitness( population.best() )
	} );

	// Perform immigration
	if ( generation_count % conf.generation_gap === 0 ) { // do migration stuff
	    console.log("Do it");
	    // Put chromosome
	    // put in pool
	    var this_request = conf.url
		+ 'experiment/0/one/' + population.best() + "/" 
		+ population.fitness(population.best()) + "/"
		+ UUID;
	    console.log( this_request );
	    rest.put( this_request ).on("complete", function( result, response ) {
		if ( response.statusCode == 410 ) {
		    finished = true;
		    experiment_id = result.current_id;
		}
	    });
	}
	return false;
    } else {

	return true;
    }
};

// Create the evolution/evolvable object
var eo = new fluxeo( this_fitness,
		     new Tournament( tournament_size, population_size-2 ),
		     check);

logger.info( { start: process.hrtime() } );



// Start loop
logger.info( "Starting ");
eo.algorithm( population, function ( population ) {

    logger.info( {
	end: { 
	    time: process.hrtime(),
	    generation: total_generations,
	    best : { 
		chromosome : population.best,
		fitness : population.fitness(population.best)
	    }
	}
    });
    logger.info("Finished");
});







