#!/usr/bin/env node

var nodeo = require('nodeo'),
winston = require('winston'),
HIFF = nodeo.HIFF,
fs= require('fs');

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

if ( !conf ) {
    throw "Problems with conf file";
}

logger.info( conf );
var chromosome_size = conf.chromosome_size;
var total_generations = 0;

var hiff = new HIFF.HIFF();

var eo = new nodeo.Nodeo( { population_size: conf.population_size,
			    chromosome_size: chromosome_size,
			    fitness_func: hiff } );

logger.info( { start: process.hrtime() } );
console.log( "Starting ");
// start running the GA
var generation_count = 0;

// Start loop
generation();

// ---------------------------------

function generation() {
    generation_count++;
    eo.generation();
    if ( (eo.fitness_of[eo.population[0]] < conf.fitness_max ) && (generation_count*conf.population_size < conf.max_evaluations )) {
	logger.info( { "chromosome": eo.population[0],
		       "fitness" : eo.fitness_of[eo.population[0]]} );
	setImmediate(generation);
    } else {
	logger.info( {end: { 
	    time: process.hrtime(),
	    generation: total_generations,
	    best : { chromosome : eo.population[0],
		     fitness : eo.fitness_of[eo.population[0]]}}} );
	conf.output = conf.output_preffix+".json";
	console.log("Finished");
    }
}
