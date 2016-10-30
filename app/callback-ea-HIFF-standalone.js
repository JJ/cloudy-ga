#!/usr/bin/env node

var nodeo = require('nodeo'),
utils= nodeo.utils,
HIFF = nodeo.HIFF,
fluxeo = nodeo.FluxEO;

var Population = fluxeo.Population,
Selection = fluxeo.Selection,
Tournament = Selection.Tournament;

var chromosome_size = 256;
var population_size = 1024;
var tournament_size = 2;
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

// start running the GA
var generation_count = 0;

// Checks termination conditions
var check = function( population ) {
  if ( (population.fitness( population.best()) < 2304 ) && (generation_count*population_size < 1000000 )) {
    generation_count++;
    console.log( { 
      "chromosome": population.best(),
      "fitness" : population.fitness( population.best() )
    } );
    return false;
  } else {
    console.log("Looks like this is it");
    console.log(population.fitness( population.best()))
    console.log(population.fitness( population.best()) < 2304 )
    return true;
  }
};

// Create the evolution/evolvable object
var eo = new fluxeo( this_fitness,
		     new Tournament( tournament_size, population_size-2 ),
		     check);

console.log( { start: process.hrtime() } );

// Start loop
console.log( "Starting ");
eo.algorithm( population, function ( population ) {

    console.log( {
	end: { 
	    time: process.hrtime(),
	    generation: total_generations,
	    best : { 
		chromosome : population.best,
		fitness : population.fitness(population.best)
	    }
	}
    });
    console.log("Finished");
});







