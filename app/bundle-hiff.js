(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){


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








}).call(this,require('_process'))
},{"_process":1,"nodeo":4}],3:[function(require,module,exports){
(function (process){
// Evolutionary Algorithm, simplified, for node.js
/*jslint node: true */
'use strict';
// * @license GPL v3
// * @package nodeo
// * @author J. J. Merelo <jjmerelo@gmail.com>


// To avoid uncomprehensible radix complaint at charAt
/*jshint -W065 */
/*jshint smarttabs:true */

module.exports = FluxEO;
FluxEO.Population = require("./nodeo/Population");
FluxEO.Selection = require("./nodeo/Selection");
FluxEO.ops = require('./nodeo/ops');

function FluxEO( fitness_function, selection, found_solution ) {
    this.fitness_function = fitness_function;
    this.selection = selection;
    this.found_solution = found_solution;
}

// Evaluate individuals if needed
FluxEO.prototype.evaluate = function( population, done ) {
    population.evaluate( this.fitness_function );
    done( population );
};

// Create a pool of new individuals
FluxEO.prototype.create_pool = function( population, done ) {
    var selection = this.selection;
    this.evaluate( population, function( population ) {
	population.rank();
	var new_population = selection.select( population );
	done( population, new_population );
    });
};


// Now reproduce them with each other
FluxEO.prototype.reproduce = function( population, done ) {
    this.create_pool( population, function( population, new_population ) {
	var mutants = FluxEO.ops.reproduction( new_population);
	done( population, mutants );
    });
};

// Incorporate using elitism
// var generation = 0;
FluxEO.prototype.generation = function( population ) {
//  console.log( "In " + generation ++ );
  this.reproduce( population, function( population, new_population ) {
    population.cull( new_population.length );
    population.insert( new_population );
  });
};


// Run the algorithm
FluxEO.prototype.algorithm = function( population, done ) {
  this.generation(population);
  if ( this.found_solution( population ) ) {
    console.log( "Found!!!");
    done( population );
  } else {
    process.nextTick( function () {
                         this.algorithm( population, done );
                       }.bind( this ));
  }
};

}).call(this,require('_process'))
},{"./nodeo/Population":8,"./nodeo/Selection":10,"./nodeo/ops":18,"_process":1}],4:[function(require,module,exports){
// Evolutionary Algorithm, simplified, for node.js
/*jslint node: true */
'use strict';
// * @license GPL v3
// * @package nodeo
// * @author J. J. Merelo <jjmerelo@gmail.com>


// To avoid uncomprehensible radix complaint at charAt
/*jshint -W065 */
/*jshint smarttabs:true */

var nodeo = exports;
nodeo.FluxEO = require('./FluxEO.js');
nodeo.utils = require('./nodeo/Utils');
nodeo.Population = require('./nodeo/Population');
nodeo.ops = require('./nodeo/ops');
nodeo.Ackley = require('./nodeo/Ackley');
nodeo.classic = require('./nodeo/classic');
nodeo.classic_float = require('./nodeo/classic-float');
nodeo.MMDP = require('./nodeo/MMDP');
nodeo.HIFF = require('./nodeo/HIFF');
nodeo.chromosome = require('./nodeo/chromosome');
nodeo.chromosome_float = require('./nodeo/chromosome-float.js');
nodeo.trap = require('./nodeo/trap');
nodeo.vector = require('./nodeo/vector');
nodeo.functions = require('./nodeo/functions');
nodeo.Rastrigin = require('./nodeo/Rastrigin');

// Nodeo creates an evolutionary algorithms.
// `options` include
// * `population_size`
// * `fitness_func` that is the fitness used to evaluate all
// individuals. Can be either a function or a fitness object with the
// `apply` method
// * `tournament_size` using tournament selection. This is the number
// of individuals in each one
// * `pool_size` reproductive pool size
// * `chromosome_size` used to generate random chromosomes.
// This function generates randomly a population which is used later
// on to start the evolutionary algorithms. 
function Nodeo( options ) {
/*jshint validthis: true */
    for ( var i in options ) {
	this[i] = options[i];
    }
    if ( ! this.population_size ) {
	return new Error ("0 population size");
    }
    if ( ! this.fitness_func ) {
	return new Error ("No fitness func");
    } else if ( typeof( this.fitness_func) === 'function' ) {
	this.fitness_obj = new Fitness( options.fitness_func );
    } else {
	this.fitness_obj = this.fitness_func;
    }
    if ( !this.tournament_size ) {
	this.tournament_size = 2;
    }
    if ( !this.pool_size ) {
	this.pool_size = this.population_size - 2;
    }

    if ( !this.chromosome_size || isNaN(this.chromosome_size) ) {
	throw "Chromosome size error";
    }
    this.fitness_of = {};
    this.population = [];
//    console.log( this.fitness_obj.apply );
    do {
	var chromosome = nodeo.utils.random( this.chromosome_size );
	if ( ! (chromosome in this.fitness_of) ) {
//	    console.log(this.fitness_obj.apply);
	    this.fitness_of[chromosome] = this.fitness_obj.apply( chromosome );
//	    console.log(this.fitness_of[chromosome]);
	    this.population.push( chromosome );
	}
    } while( this.population.length < this.population_size );

    // Methods
    this.tournament_selection = tournament_selection;
    this.evaluation = evaluation;
    this.generation= generation;
    this.rank=rank;
    this.incorporate=incorporate;
}

// create fitness function object if it does not exist
function Fitness ( f ) {
 /*jshint validthis: true */  
    this.apply = f;  
}

// Selects a new population of size pool_size via comparing tournament_size chromosomes and taking the best
function tournament_selection( tournament_size, pool_size ) {
/*jshint validthis: true */
    var pool = [];
    if ( tournament_size <= 1 ) {
	return new Error ("Tournament size too small");
    }
    do {
//	var joust = [];
	var best =  this.population[ Math.floor(Math.random()*this.population.length) ] ;
	for ( var i = 1; i < tournament_size; i ++) {
	    var another= this.population[ Math.floor(Math.random()*this.population.length) ];
	    if ( this.fitness_of[another] > this.fitness_of[best]) {
		best = another;
	    }
	}
	pool.push( best );
    } while (pool.length < pool_size );
    return pool;
}

// Evaluates all the population not in cache
function evaluation( new_guys ) {
/*jshint validthis: true */
    for (var i in new_guys) {
	if ( !this.fitness_of[new_guys[i]]) {
//	    console.log( "eval " + new_guys[i] );
	    this.fitness_of[new_guys[i]] = this.fitness_obj.apply( new_guys[i]);
	}
    }
}

// sort population
function rank () {
    /*jshint validthis: true */
    var fitness_of = this.fitness_of;
    var sorted_population = this.population.sort( function(a,b){ return fitness_of[b] - fitness_of[a]; } );
    this.population = sorted_population;
}

// Single generation
function generation() {
    /*jshint validthis: true */
    var chosen = this.tournament_selection( this.tournament_size, this.pool_size);
    this.rank(); // to get the best
    var the_best = [this.population[0],this.population[1]];
    var new_population = nodeo.ops.reproduction( chosen);
    this.evaluation(new_population);
    this.population = the_best.concat( new_population );
    this.rank(); // ranking twice????
}

// Population should be sorted, so the worst is the last. Incorporates a new individual, taking out the worst one
function incorporate( chromosome ) {
    /*jshint validthis: true */
    if ( chromosome.length !== this.chromosome_size ) {
	throw "Bad chromosome length" + chromosome.length + "!=" + this.chromosome_size ;
    }
    this.fitness_of[chromosome] = this.fitness_obj.apply( chromosome );
    this.rank();
    this.population.pop(); // extracts the last
    
}

nodeo.Nodeo = Nodeo;

},{"./FluxEO.js":3,"./nodeo/Ackley":5,"./nodeo/HIFF":6,"./nodeo/MMDP":7,"./nodeo/Population":8,"./nodeo/Rastrigin":9,"./nodeo/Utils":12,"./nodeo/chromosome":14,"./nodeo/chromosome-float.js":13,"./nodeo/classic":16,"./nodeo/classic-float":15,"./nodeo/functions":17,"./nodeo/ops":18,"./nodeo/trap":19,"./nodeo/vector":20}],5:[function(require,module,exports){
// Ackley function with Fitness function signature
 
//  * @license GPL v3
//  * @package nodeo
//  * @author J. J. Merelo <jjmerelo@gmail.com>

// To avoid uncomprehensible radix complaint at charAt
/*jshint -W065 */
/*jshint smarttabs:true */

var functions = require('./functions');

// making a function a class, MMDP style
function Ackley() {
    // Methods
    this.apply = apply;
}

// Applies trap function to chromosome using defaults
function apply( chromosome ){
//    console.log( "apply " + chromosome);
//    console.log( this);
    return functions.ackley(chromosome);
    
}

exports.Ackley = Ackley;

},{"./functions":17}],6:[function(require,module,exports){

// Trap function with Fitness function signature
//
// Trap is a deceptive function that is used, concatenated, to test
// evolutionary algorithms. 
// @license GPL v3
// @package nodeo
// @author J. J. Merelo <jjmerelo@gmail.com>

// To avoid uncomprehensible radix complaint at charAt
/*jshint -W065 */
/*jshint smarttabs:true */


// basic transform if and only iff
function t( a, b ) {
    if ( a == b ) {
	if(  a == '0' ) {
	    return '0';
	} else if (  a == '1' ) {
	    return '1';
	}
    } else {
	return '-';
    }
}

function T( ev ) {
//  console.log(ev);
  switch(ev) {
    case '-':
    case '1':
    case '0':
    return ev;
    case '00':
    return '0';
    case '11':
    return '1';
    case '01':
    case '10':
    return '-';
    default:
    if (ev.length == 2 && ev.match(/-/))
      return '-'
    else 
      return t(T(ev.slice(0,ev.length/2)),T(ev.slice(ev.length/2,ev.length)))
  }
}

function f( ev ) {
    if ( ev == '0' || ev == '1' )
	return 1;
    else
	return 0
}

// Class definition
// ```
// var this_HIFF = new HIFF.HIFF
// ```
//
function HIFF( ) {
    this.apply = apply;
}

// Applies trap function to chromosome using instance values
function apply( chromosome ){
    switch( chromosome ) {
    case '0':
    case '1':
	return 1;
    case '00':
    case '11':
	return 4;
    case '01':
    case '10':
	return 2;
    default:
	return chromosome.length*f(T(chromosome))
	    + apply( chromosome.slice(0,chromosome.length/2) )
	    + apply( chromosome.slice(chromosome.length/2,chromosome.length) )
    }
}

exports.HIFF = HIFF;

},{}],7:[function(require,module,exports){
// MMDP function with Fitness function signature
 
//  * @license GPL v3
//  * @package nodeo
//  * @author J. J. Merelo <jjmerelo@gmail.com>

// To avoid uncomprehensible radix complaint at charAt
/*jshint -W065 */
/*jshint smarttabs:true */

var functions = require('./functions');

// making a function a class, MMDP style
function MMDP() {
    // Methods
    this.apply = apply;
}

// Applies trap function to chromosome using defaults
function apply( chromosome ){
//    console.log( "apply " + chromosome);
//    console.log( this);
    return functions.MMDP(chromosome);
    
}

exports.MMDP = MMDP;

},{"./functions":17}],8:[function(require,module,exports){
/**
 * Population class for NodEO
 * 
 * @license GPL v3
 * @package nodeo
 * @author J. J. Merelo <jjmerelo@gmail.com>
 */

// To avoid uncomprehensible radix complaint at charAt
/*jshint -W065 */
/*jshint smarttabs:true */

module.exports = Population;

function Population( individuals, fitness_hash) {
    this.living = individuals || new Array;
    this.fitness_of = fitness_hash || new Object;
};

// Sorts the population and returns it sorted
Population.prototype.rank = function() {
    var fitness_of = this.fitness_of;
    return this.living.sort( function(a,b) {
	return fitness_of[b] - fitness_of[a];
    });
};

// Evaluates population
Population.prototype.evaluate = function( fitness ) {
    var fitness_of =  this.fitness_of;
    this.living.map( function( individual ) {
	if ( ! (individual in fitness_of ) ) {
	    fitness_of[individual] = fitness( individual );
	}
    });
};

// Initialize population
Population.prototype.initialize = function( size, create_individual ) {
    for ( var i = 0; i < size;  i ++ ) {
	this.living.push( create_individual() );
    }
};
	    
// Return population
Population.prototype.chromosomes = function() {
    return this.living;
};

// Returns the cached fitness of a particular individual 
Population.prototype.fitness = function( individual ) {
    return this.fitness_of[ individual ];
};

// Removes last elements
Population.prototype.cull = function( how_many ) {
  if ( how_many < this.living.length ) {
    for ( var i = 0; i < how_many; i++ ) {
      var removed = this.living.pop();
      delete this.fitness_of[ removed ];
    }
  }

};

// Inserts the new population into the old
Population.prototype.insert = function( new_population ) {
    this.living = this.living.concat( new_population );
};

			
// Gets a random one    
Population.prototype.one = function() {
    return this.living[ Math.floor(Math.random()*this.living.length)];
}

// Get first, best if ranked
Population.prototype.best = function() {
    return this.living[0];
}

// Get best n
Population.prototype.best_n = function(n) {
    if ( n < this.living.length ) {
	return this.living.slice(0,n+1);
    }
}

// Population size
Population.prototype.size = function() {
    return this.living.length;
}

/* Incorporates a chromosome, eliminating the worst. Mainly used for immigration purposes
Do not care if it's sorted or not, and it's not evaluated. To be done in the next round */
Population.prototype.addAsLast = function( individual ) {
    this.living.pop();
    this.living.push( individual );
}
    

},{}],9:[function(require,module,exports){
// Rastrigin function with Fitness function signature
 
//  * @license GPL v3
//  * @package nodeo
//  * @author Pablo Garcia <fergunet@gmail.com>

// To avoid uncomprehensible radix complaint at charAt
/*jshint -W065 */
/*jshint smarttabs:true */

var functions = require('./functions');

// making a function a class, MMDP style
function Rastrigin() {
    // Methods
    this.apply = apply;
}

// Applies trap function to chromosome using defaults
function apply( chromosome ){
//    console.log( "apply " + chromosome);
//    console.log( this);
    return functions.Rastrigin(chromosome);
    
}

exports.Rastrigin = Rastrigin;

},{"./functions":17}],10:[function(require,module,exports){
// Selection mechanisms plus common code if needed
/*jslint node: true */
'use strict';
// * @license GPL v3
// * @package nodeo
// * @author J. J. Merelo <jjmerelo@gmail.com>


// To avoid uncomprehensible radix complaint at charAt
/*jshint -W065 */
/*jshint smarttabs:true */

module.exports = Selection;
Selection.Tournament = require("./Selection/Tournament");

// Dummy function
function Selection() {
    return;
}

},{"./Selection/Tournament":11}],11:[function(require,module,exports){
// Selection mechanisms plus common code if needed
/*jslint node: true */
'use strict';
// * @license GPL v3
// * @package nodeo
// * @author J. J. Merelo <jjmerelo@gmail.com>


// To avoid uncomprehensible radix complaint at charAt
/*jshint -W065 */
/*jshint smarttabs:true */

module.exports = Tournament;

// Encapsulates parameters
function Tournament (  tournament_size, pool_size ) {
    /*jshint validthis: true */
    this.tournament_size = tournament_size;
    this.pool_size = pool_size;
}

// Selects a new population of size pool_size via comparing tournament_size chromosomes and taking the best
Tournament.prototype.select = function ( population ) {
/*jshint validthis: true */
    var pool = [];
    var tournament_size = this.tournament_size;
    var pool_size = this.pool_size;
    if ( tournament_size <= 1 ) {
	return new Error ("Tournament size too small");
    }
    do {
	var best =  population.one() ;
	for ( var i = 1; i < tournament_size; i ++) {
	    var another= population.one();
	    if ( population.fitness_of[another]
		 > population.fitness_of[best]) {
		best = another;
	    }
	}
	pool.push( best );
    } while (pool.length < pool_size );
    return pool;
}




},{}],12:[function(require,module,exports){
/**
 * Utility functions for NodEO
 * 
 * @license GPL v3
 * @package nodeo
 * @author J. J. Merelo <jjmerelo@gmail.com>
 */

// To avoid uncomprehensible radix complaint at charAt
/*jshint -W065 */
/*jshint smarttabs:true */

var Utils = exports;

// Create a random chromosome
Utils.random= function (length){
    var chromosome = '';
    for ( var i = 0; i < length; i++ ){
	chromosome = chromosome + ((Math.random() >0.5)? "1": "0") ;
    }
    return chromosome;
};

// Computes maxOnes fitness
Utils.max_ones = function (chromosome){
    var ones = 0;
    for ( var i=0; i < chromosome.length; i++ ){ 
	ones += parseInt(chromosome.charAt(i));
    }
    return ones;
};

// Computes maxOnes fitness
Utils.max_ones_m = function (chromosome){
    return chromosome.string.match(/1/).size;
};

/**
* Sum of the floats contained in chromosome (being a vector of floats)
* @author Víctor Rivas <vrivas@ujaen.es>
* @date 26-Oct-2015
* @params chromosome [vector of floats] The chromosome whose members are going to be summed up.
* @return [float] The sum of the values contained in the vector
*/
Utils.sum_ones = function ( chromosome ) {
    return chromosome.reduce( function( prev, curr ) { return prev+curr; }, 0);
}

},{}],13:[function(require,module,exports){
// Chromosome as a vector of float for Evolutionary Algorithms
'use strict';
// * @license GPL v3
// * @author Víctor Rivas Santos (vrivas@ujaen.es)
// *         from chromosome.js, authored by J.J Merelo.


// Creating namespace
var ChromosomeFloat={
    // Creates a single chromosome. Includes all utility functions
    Chromosome: function (vector,fitness,minvalue,maxvalue){

     if( minvalue>maxvalue) throw new RangeError ("Function ChromosomeFloat: Minvalue is bigger than maxvalue", "chromosome-float.js");
     this.vector = ( typeof vector!=="undefined" )?vector.slice():[]; // Copying the values, not the reference to the vector.
     this.fitness = fitness || 0.0;
     this.minvalue = minvalue || 0.0;
     this.maxvalue = maxvalue || 1.0;

    }


    // Flips the whole chromosome: maps [minvalue,maxvalue] into [maxvalue, minvalue]
    , invert: function (chrom) {
     return  new ChromosomeFloat.Chromosome(
         chrom.vector.map( function(e) {
             return (-e+chrom.minvalue+chrom.maxvalue);
	 }));
    }

    // Changes the value at one point by some other randomly calculated
    , mutate: function (chrom) {
        var toRet=new ChromosomeFloat.Chromosome( chrom.vector );
        toRet.vector[Math.floor(Math.random()*toRet.vector.length)]=toRet.minvalue+Math.random()*(toRet.maxvalue-toRet.minvalue);
        return  toRet;
    }

    // Interchanges a substring between the two parents
    , crossover: function ( chrom1, chrom2 ) {
        var length = chrom1.vector.length;
        var xover_point = Math.floor( Math.random() * length);
        var range = 1 + Math.floor(Math.random() * (length - xover_point) );
        var new_chrom1 = chrom1.vector.slice(0,xover_point)
                       .concat(chrom2.vector.slice(xover_point,xover_point+range))
                       .concat(chrom1.vector.slice(xover_point+range));
        var new_chrom2 = chrom2.vector.slice(0,xover_point)
                        .concat(chrom1.vector.slice(xover_point,xover_point+range))
                        .concat(chrom2.vector.slice(xover_point+range));
        return [new ChromosomeFloat.Chromosome(new_chrom1), new ChromosomeFloat.Chromosome(new_chrom2)];
    }

    // Applies operators to the pool
    , reproduction: function (  pool ) {
        var offspring = [];
        while (pool.length ) {
    	   var first = pool.splice( Math.floor(Math.random()*pool.length), 1 );
	       var second = pool.splice( Math.floor(Math.random()*pool.length), 1 );
	       var crossovers = ChromosomeFloat.crossover( first[0], second[0] );
	       for ( var i in crossovers ) {
	           offspring.push( ChromosomeFloat.mutate(crossovers[i]));
	       }
        }
        return offspring;
    }

} // namespace

module.exports = ChromosomeFloat;

},{}],14:[function(require,module,exports){
// Chromosome for Evolutionary Algorithms
/*jslint node: true */
'use strict';
// * @license GPL v3
// * @package nodeo
// * @author J. J. Merelo <jjmerelo@gmail.com>

/*jshint smarttabs:true */

// Creates a single chromosome. Includes all utility functions
function Chromosome(string,fitness){
    this.string = string;
    this.fitness = fitness;
}


// Bit-flips the whole chromosome
Chromosome.invert = function(chromosome) {
    var inverted='';
    for (var i = 0; i < chromosome.string.length; i ++ ) {
	inverted += chromosome.string.charAt(i).match(/1/)?"0":"1";
    }
    return new Chromosome (inverted);
};

// Bit-flips a single bit
Chromosome.mutate = function(chromosome ) {
    var mutation_point = Math.floor( Math.random() * chromosome.string.length);
    var temp = chromosome.string;
    var flip_bit = temp.charAt(mutation_point).match(/1/)?"0":"1";
    var clone = temp.substring(0,mutation_point) +
	flip_bit + 
	temp.substring(mutation_point+1,temp.length) ;
    return new Chromosome( clone );
};

// Interchanges a substring between the two parents
Chromosome.crossover = function( chrom1, chrom2 ) {
    var length = chrom1.string.length;
    var xover_point = 1+Math.floor( Math.random() * (length-1));
    var range = 1 + Math.floor(Math.random() * (length - xover_point) );
    var new_chrom1 = chrom1.string.substr(0,xover_point);
    var new_chrom2 = chrom2.string.substr(0,xover_point);
    new_chrom1+= chrom2.string.substring(xover_point,xover_point+range) +
	chrom1.string.substring(xover_point+range,length);
    new_chrom2+= chrom1.string.substring(xover_point,xover_point+range) +
	chrom2.string.substring(xover_point+range,length);
    return [new Chromosome(new_chrom1), new Chromosome(new_chrom2)];
};

// Applies operators to the pool
Chromosome.reproduction = function (  pool ) {
/*jshint validthis: true */
    var offspring = [];
    while (pool.length ) {
	var first = pool.splice( Math.floor(Math.random()*pool.length), 1 );
	var second = pool.splice( Math.floor(Math.random()*pool.length), 1 );
	var crossovers = this.crossover( first[0], second[0] );
	for ( var i in crossovers ) {
	    offspring.push( this.mutate(crossovers[i]));
	}
    }
    return offspring;
};

module.exports = Chromosome;


},{}],15:[function(require,module,exports){
// Evolutionary Algorithm, simplified, for node, using `ChromosomeFloat` data structure
'use strict';
// * @license GPL v3
// * @package nodeo
// * @author V. M. Rivas <vrivas@ujaen.es>
// *         From classic.js authored J. J. Merelo <jjmerelo@gmail.com>


// To avoid uncomprehensible radix complaint at charAt
/*jshint -W065 */
/*jshint smarttabs:true */

var utils = require('./Utils'),
    CF = require('./chromosome-float'),
    ops = require('./ops');


// Nodeo creates an evolutionary algorithms.
// `options` include
// * `population_size`
// * `fitness_func` that is the fitness used to evaluate all
// individuals. Can be either a function or a fitness object with `apply`
// * `tournament_size` using tournament selection. This is the number
// of individuals in each one
// * `pool_size` reproductive pool size
// * `chromosome_size` used to generate random chromosomes.
// * `minvalue` minimum value for floats
// * `maxvalue` minimum value for floats
// This function generates randomly a population which is used later
// on to start the evolutionary algorithms. 
module.exports = function( options ) {
/*jshint validthis: true */
    for ( var i in options ) {
	this[i] = options[i];
    }
    if ( ! this.population_size ) {
	return new Error ("0 population size");
    }
    if ( ! this.fitness_func ) {
	return new Error ("No fitness func");
    } else if ( typeof( this.fitness_func) === 'function' ) {
	this.fitness_obj = new Fitness( options.fitness_func );
    } else {
	this.fitness_obj = this.fitness_func;
    }
    if ( !this.tournament_size ) {
	this.tournament_size = 2;
    }
    if ( !this.pool_size ) {
	this.pool_size = this.population_size - 2;
    }

    if ( !this.chromosome_size || isNaN(this.chromosome_size) ) {
	throw "Chromosome size error";
    }

    if ( !this.minvalue || !this.maxvalue ) {
       this.minvalue=0.0;
       this.maxvalue=1.0;
    }

    this.population = [];
//    console.log( this.fitness_obj.apply );
    do {
	var vector=[];
    for( var i=0; i<this.chromosome_size; ++i ) {
        vector[i]=Math.random()*(this.maxvalue-this.minvalue)+this.minvalue;
    }
	var chromosome = new CF.Chromosome( vector,
					 this.fitness_obj.apply( vector ) );
	this.population.push( chromosome );
    } while( this.population.length < this.population_size );

    // Methods
    this.tournament_selection = tournament_selection;
    this.evaluation = evaluation;
    this.generation= generation;
    this.rank=rank;
};

// create fitness function object if it does not exist
function Fitness ( f ) {
 /*jshint validthis: true */  
    this.apply = f;  
}

// Selects a new population of size pool_size via comparing tournament_size chromosomes and taking the best
function tournament_selection( tournament_size, pool_size ) {
/*jshint validthis: true */
    var pool = [];
    if ( tournament_size <= 1 ) {
	return new Error ("Tournament size too small");
    }
    do {
//	var joust = [];
	var best =  this.population[ Math.floor(Math.random()*this.population.length) ] ;
	for ( var i = 1; i < tournament_size; i ++) {
	    var another= this.population[ Math.floor(Math.random()*this.population.length) ];
	    if ( another.fitness > best.fitness) {
		best = another;
	    }
	}
	pool.push( best );
    } while (pool.length < pool_size );
    return pool;
}

// Evaluates all the population not in cache
function evaluation( new_guys ) {
/*jshint validthis: true */
    for (var i in new_guys) {	
	new_guys[i].fitness = this.fitness_obj.apply( new_guys[i].vector );
    }
}

// sort population
function rank () {
    /*jshint validthis: true */
    var sorted_population = this.population.sort( function(a,b){ return b.fitness - a.fitness; } );
    this.population = sorted_population;
}

// Single generation
function generation() {
    /*jshint validthis: true */
    var chosen = this.tournament_selection( this.tournament_size, this.pool_size);
    this.rank(); // to get the best
    var the_best = [this.population[0],this.population[1]];
    var new_population = CF.reproduction( chosen);
    this.evaluation(new_population);
    this.population = the_best.concat( new_population );
    this.rank(); // ranking twice????
}



},{"./Utils":12,"./chromosome-float":13,"./ops":18}],16:[function(require,module,exports){
// Evolutionary Algorithm, simplified, for node, using `Chromosome` data structure
/*jslint node: true */
'use strict';
// * @license GPL v3
// * @package nodeo
// * @author J. J. Merelo <jjmerelo@gmail.com>


// To avoid uncomprehensible radix complaint at charAt
/*jshint -W065 */
/*jshint smarttabs:true */

var utils = require('./Utils'),
    Chromosome = require('./chromosome'),
    ops = require('./ops');


// Nodeo creates an evolutionary algorithms.
// `options` include
// * `population_size`
// * `fitness_func` that is the fitness used to evaluate all
// individuals. Can be either a function or a fitness object with `apply`
// * `tournament_size` using tournament selection. This is the number
// of individuals in each one
// * `pool_size` reproductive pool size
// * `chromosome_size` used to generate random chromosomes.
// This function generates randomly a population which is used later
// on to start the evolutionary algorithms. 
module.exports = function( options ) {
/*jshint validthis: true */
    for ( var i in options ) {
	this[i] = options[i];
    }
    if ( ! this.population_size ) {
	return new Error ("0 population size");
    }
    if ( ! this.fitness_func ) {
	return new Error ("No fitness func");
    } else if ( typeof( this.fitness_func) === 'function' ) {
	this.fitness_obj = new Fitness( options.fitness_func );
    } else {
	this.fitness_obj = this.fitness_func;
    }
    if ( !this.tournament_size ) {
	this.tournament_size = 2;
    }
    if ( !this.pool_size ) {
	this.pool_size = this.population_size - 2;
    }

    if ( !this.chromosome_size || isNaN(this.chromosome_size) ) {
	throw "Chromosome size error";
    }
    this.population = [];
//    console.log( this.fitness_obj.apply );
    do {
	var this_string = utils.random( this.chromosome_size );
	var chromosome = new Chromosome( this_string,
					 this.fitness_obj.apply( this_string ) );
	this.population.push( chromosome );
    } while( this.population.length < this.population_size );

    // Methods
    this.tournament_selection = tournament_selection;
    this.evaluation = evaluation;
    this.generation= generation;
    this.rank=rank;
};

// create fitness function object if it does not exist
function Fitness ( f ) {
 /*jshint validthis: true */  
    this.apply = f;  
}

// Selects a new population of size pool_size via comparing tournament_size chromosomes and taking the best
function tournament_selection( tournament_size, pool_size ) {
/*jshint validthis: true */
    var pool = [];
    if ( tournament_size <= 1 ) {
	return new Error ("Tournament size too small");
    }
    do {
//	var joust = [];
	var best =  this.population[ Math.floor(Math.random()*this.population.length) ] ;
	for ( var i = 1; i < tournament_size; i ++) {
	    var another= this.population[ Math.floor(Math.random()*this.population.length) ];
	    if ( another.fitness > best.fitness) {
		best = another;
	    }
	}
	pool.push( best );
    } while (pool.length < pool_size );
    return pool;
}

// Evaluates all the population not in cache
function evaluation( new_guys ) {
/*jshint validthis: true */
    for (var i in new_guys) {	
	new_guys[i].fitness = this.fitness_obj.apply( new_guys[i].string );
    }
}

// sort population
function rank () {
    /*jshint validthis: true */
    var sorted_population = this.population.sort( function(a,b){ return b.fitness - a.fitness; } );
    this.population = sorted_population;
}

// Single generation
function generation() {
    /*jshint validthis: true */
    var chosen = this.tournament_selection( this.tournament_size, this.pool_size);
    this.rank(); // to get the best
    var the_best = [this.population[0],this.population[1]];
    var new_population = Chromosome.reproduction( chosen);
    this.evaluation(new_population);
    this.population = the_best.concat( new_population );
    this.rank(); // ranking twice????
}



},{"./Utils":12,"./chromosome":14,"./ops":18}],17:[function(require,module,exports){
/**
 * Fitness functions for testing
 *
 * @package nodeo
 * @author J. J. Merelo <jjmerelo@gmail.com>
 * @license GPL v3
 */

// To avoid uncomprehensible radix complaint at charAt
/*jshint -W065 */
/*jshint smarttabs:true */

var functions = exports;

//Ackley description in http://tracer.lcc.uma.es/problems/ackley/ackley.html
functions.ackley = function(x) {
    var result = 0;
    var sum = 0;
    console.log("Working with");
    console.log(x);
    console.log("Checking for " + x.length);
    for ( var i in x ) {
	sum += x[i]*x[i];
    }
    result = 20 - 20*Math.exp(-0.2*Math.sqrt(sum/x.length));
    var cos = 0;
    for (  i in x ) {
	cos += Math.cos(2*Math.PI*x[i]);
    } 
    result += Math.E - Math.exp(cos/x.length); // needed for precision
    console.log("Result = " + result.toPrecision(6));
    return result; // hack for returning 0
};

// L-trap function
functions.ltrap = function(x,l,a,b,z) {
    var total = 0;
    for ( var i = 0;  i < x.length; i+= l ) {
	var this_substr = x.substr(  i, l );
	var num_ones = 0;
	for ( var j = 0;  j < this_substr.length; j++ ) {
	  num_ones += (this_substr.substring(j,j+1) === "1"); 
	}
	var this_result;
	if ( num_ones <= z ) {
	  this_result = a*(z-num_ones)/z;
	} else {
	  this_result = b*(num_ones -z)/(l-z);
	}
	total += this_result;
//	console.log("Total " + i + " :"+total + " num_ones " + num_ones );
    }

    return total;
};

//Masive Multimodal Deceptive Problem, a classic test function
functions.MMDP = function(x) {
    var block_size = 6;
    var unitation = [1,0,0.360384,0.640576,0.360384,0,1];
    var total = 0;
    for ( var i = 0;  i < x.length; i+= block_size ) {
	var this_substr = x.substr(  i, block_size );
	var num_ones = 0;
	for ( var j = 0;  j < this_substr.length; j++ ) {
	  num_ones += (this_substr.substring(j,j+1) === "1"); 
	}
	total += unitation[num_ones];
    }

    return total;
};

//Rastrigin function
functions.Rastrigin = function(x) {

   var total = 0;
   for (var i = 0; i < x.length; i++) {
       var value = x[i];
       total = total + (value*value) - (10.0*Math.cos(2*Math.PI*value));
   }
   return total+10*x.length;


}

},{}],18:[function(require,module,exports){
// A few operators that can be used here and there
/*jslint node: true */
'use strict';
// * @license GPL v3
// * @package nodeo
// * @author J. J. Merelo <jjmerelo@gmail.com>


// To avoid uncomprehensible radix complaint at charAt
/*jshint -W065 */
/*jshint smarttabs:true */

var ops = exports;

// Bit-flips the whole chromosome
ops.invert = function (chromosome) {
    var inverted = '';
    for (var i = 0; i < inverted.length; i ++ ) {
	inverted += chromosome.charAt(i).match(/1/)?"0":"1";
    }
    return inverted;
};

// Bit-flips a single bit. It's mainly used for tests, not a real genetic operator.
ops.mutate = function (chromosome ) {

    var mutation_point = Math.floor( Math.random() * chromosome.length);
    var temp = chromosome;
    var flip_bit = temp.charAt(mutation_point).match(/1/)?"0":"1";
    chromosome = temp.substring(0,mutation_point) +
	flip_bit + 
	temp.substring(mutation_point+1,temp.length) ;
    return chromosome;
};

// Interchanges a substring between the two parents
ops.crossover = function ( chrom1, chrom2 ) {
    // Do nothing if they are the same.
    if (chrom1 === chrom2) {
	return [chrom1,chrom2];
    }
    var length = chrom1.length;
    var xover_point;
    var range;
    var counter = 0;
    do {
	xover_point = Math.floor( Math.random() * length);
	range = 1 + Math.floor(Math.random() * (length - xover_point) );
//	console.log( "Snippets " + chrom1.substring(xover_point+range,length) + "===" + chrom2.substring(xover_point+range,length) ) ; 
	counter++;
    } while ( counter < chrom1.length && (chrom1.substring(xover_point+range,length) === chrom2.substring(xover_point+range,length) ) );
    if ( counter < chrom1.length ) {
	var new_chrom1 = chrom1.substr(0,xover_point);
	var new_chrom2 = chrom2.substr(0,xover_point);
	new_chrom1+= chrom2.substring(xover_point,xover_point+range) +
	    chrom1.substring(xover_point+range,length);
	new_chrom2+= chrom1.substring(xover_point,xover_point+range) +
	    chrom2.substring(xover_point+range,length);
	return [new_chrom1, new_chrom2];
    } else { // must be different, but very little... let's just swap
	return [chrom2, chrom1];
    }
};

  
// Mutate all chromosomes in the population
ops.mutate_population = function  ( pool ) {
    for ( var i in pool ) {
	pool[i] = ops.mutate( pool[i]);
    }
};


// Applies operators to the pool
ops.reproduction = function (  pool ) {
    var offspring = [];
    while (pool.length ) {
	var first = pool.splice( Math.floor(Math.random()*pool.length), 1 );
	var second = pool.splice( Math.floor(Math.random()*pool.length), 1 );
	var crossovers = ops.crossover( first[0], second[0] );
	for ( var i in crossovers ) {
	    offspring.push( ops.mutate(crossovers[i]));
	}
    }
    return offspring;
};

},{}],19:[function(require,module,exports){

// Trap function with Fitness function signature
//
// Trap is a deceptive function that is used, concatenated, to test
// evolutionary algorithms. 
// @license GPL v3
// @package nodeo
// @author J. J. Merelo <jjmerelo@gmail.com>

// To avoid uncomprehensible radix complaint at charAt
/*jshint -W065 */
/*jshint smarttabs:true */

var functions = require('./functions');
var trap = exports;

// Class definition
// ```
// var trap = new Trap.trap( { l: 3, a: 1, b:2, z = 2})
// ```
//
function Trap( options ) {
    for ( var i in options ) {
	this[i] = options[i];
    }
    if ( !this.l ) {
	this.l = 3;
    }
    if ( !this.a ) {
	this.a = 1;
    }
    if ( !this.b ) {
	this.l = 2;
    }
    if ( !this.z ) {
	this.a = this.l-1;
    }

    // Methods
    this.apply = apply;
}

// Applies trap function to chromosome using instance values
function apply( chromosome ){
    return functions.ltrap(chromosome, this.l, this.a, this.b, this.z);    
}

trap.Trap = Trap;

},{"./functions":17}],20:[function(require,module,exports){
// Chromosome for Evolutionary Algorithms that uses floating point vectors
/*jslint node: true */
'use strict';
// * @license GPL v3
// * @package nodeo
// * @author J. J. Merelo <jjmerelo@gmail.com>

/*jshint smarttabs:true */

// Applies operators to the pool
function reproduction(  pool ) {
    var offspring = [];
    while (pool.length ) {
	var first = pool.splice( Math.floor(Math.random()*pool.length), 1 );
	var second = pool.splice( Math.floor(Math.random()*pool.length), 1 );
	var crossovers = crossover( first[0], second[0] );
	for ( var i in crossovers ) {
	    offspring.push( mutate(crossovers[i]));
	}
    }
    return offspring;
}

// Creates a single chromosome. Includes all utility functions
function Vector(vector,fitness){
    /*jshint validthis: true */
    this.vector = vector;
    this.fitness = fitness;
}

// Changes a single element
function mutate (chromosome ) {

    var mutation_point = Math.floor( Math.random() * chromosome.vector.length);
    var temp = [];
    for ( var i in chromosome.vector ) {
	temp[i] = chromosome.vector[i];
    }
    temp[mutation_point] = temp[mutation_point]-0.2+Math.random()*0.1;
    return new Vector( temp );
}

// Interchanges a substring between the two parents
function crossover ( chrom1, chrom2 ) {
    var length = chrom1.vector.length;
    var xover_point = Math.floor( Math.random() * length);
    var range = 1 + Math.floor(Math.random() * (length - xover_point) );
    var new_chrom1 = chrom1.vector.splice(0,xover_point);
    var new_chrom2 = chrom2.vector.splice(0,xover_point);
    new_chrom1.push( chrom2.vector.splice(xover_point,xover_point+range));
    new_chrom1.push( chrom1.vector.splice(xover_point+range,length) );
    new_chrom2.push( chrom1.vector.splice(xover_point,xover_point+range) );
    new_chrom2.push( chrom2.vector.splice(xover_point+range,length));
    return [new Vector(new_chrom1), new Vector(new_chrom2)];
}

// Returns a random vector of `n` components with minimum `min` and range `range`
function random( n, min, range ) {
    var $vector = [];
    for (var i = 0; i < n; i ++ ) {
	$vector.push( min+Math.random()*range );
    }
    return $vector;
}
	

module.exports =  {
    version: '0.0.1',
    Vector : Vector,
    mutate: mutate,
    crossover: crossover, 
    random: random,
    reproduction: reproduction };

},{}]},{},[2]);
