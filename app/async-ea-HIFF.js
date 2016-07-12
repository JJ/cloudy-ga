#!/usr/bin/env node

var nodeo = require('nodeo'),
winston = require('winston'),
HIFF = nodeo.HIFF,
fs= require('fs');
require('winston-papertrail').Papertrail;
require('winston-logstash');

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
var total_generations = 0;

var hiff = new HIFF.HIFF();

// Create the evolution/evolvable object
var eo = new nodeo.Nodeo( { population_size: conf.population_size,
			    chromosome_size: chromosome_size,
			    fitness_func: hiff } );

logger.info( { start: process.hrtime() } );
// start running the GA
var generation_count = 0;

// Checks termination conditions
var check = function( eo, logger, conf,  generation_count ) {

    if ( (eo.fitness_of[eo.population[0]] < conf.fitness_max ) && (generation_count*conf.population_size < conf.max_evaluations )) {
	logger.info( { "chromosome": eo.population[0],
		       "fitness" : eo.fitness_of[eo.population[0]]} );
	evolve( generation_count, eo, logger, conf, check);
    } else {
	logger.info( {end: { 
	    time: process.hrtime(),
	    generation: total_generations,
	    best : { chromosome : eo.population[0],
		     fitness : eo.fitness_of[eo.population[0]]}}} );
	conf.output = conf.output_preffix+".json";
	console.log("Finished");
	process.exit();
    }
};

// Start loop
console.log( "Starting ");
evolve( generation_count, eo, logger, conf, check );

// ---------------------------------


// Evolves population
function evolve( generation_count, eo, logger, conf, check ) {
    generation_count++;
    eo.generation();
    check( eo, logger, conf, generation_count );

}


