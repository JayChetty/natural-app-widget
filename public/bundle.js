/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	SunClockFactory = __webpack_require__(1);
	NaturalCalendar = __webpack_require__(2);
	window.onload = function(){
	  console.log('in the house');
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	var sunClockFactory = {
	  createSunClock: function(spec){

	    var angleForFraction = function(fraction){
	      return( Math.PI*2 * fraction );
	    };

	    var fractionOfDay = function(hours, mins){
	      var minutesInDay = 24 * 60;
	      var timeInMinutes = (hours* 60) + mins;
	      return(timeInMinutes / minutesInDay);
	    };

	    var polarToCartesian = function(radius, angle){
	      return { 
	        x:radius*Math.cos(angle),
	        y:radius*Math.sin(angle)
	      }
	    };

	    var clockPrototype = {
	      angleForTime: function(hours, mins){
	        return angleForFraction( fractionOfDay(hours, mins) );
	      },
	      pointForTime: function(hours,mins){
	        return this.pointOnOutline( fractionOfDay(hours, mins));
	      },
	      pointOnOutline: function(fraction){
	        var angle = angleForFraction(fraction);
	        var unadjustedCenterPoint = polarToCartesian(this.radius, angle);
	        return {
	          x: unadjustedCenterPoint.x + this.center.x,
	          y: unadjustedCenterPoint.y + this.center.y
	        }
	      }
	    };

	    var clock = Object.create( clockPrototype );
	    clock.center = spec.center;
	    clock.radius = spec.radius;
	    return clock;
	  }
	}

	module.exports = sunClockFactory;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Cycle = __webpack_require__(3)

	var EarthCycles = function(pointInTime){
	  //Constants for Setup
	  this.DAY_IN_MILLISECONDS = 24 * 60 * 60 *1000;
	  this.AN_AXIS_MAX_N = new Date(2012,11,21,11,12);
	  this.YEAR_IN_DAYS = 365.24219;
	  this.YEAR_IN_MILLISECONDS = this.YEAR_IN_DAYS * this.DAY_IN_MILLISECONDS;

	  this.A_NEW_MOON = new Date(2012,10,13,22,8);
	  this.MOONTH_IN_DAYS = 29.53059;
	  this.MOONTH_IN_MILLISECONDS = this.MOONTH_IN_DAYS * this.DAY_IN_MILLISECONDS;

	  this.YEAR_IN_MOONTHS = (this.YEAR_IN_SECONDS/this.MOONTH_IN_SECONDS);

	  this.year = new Cycle(this.AN_AXIS_MAX_N.valueOf(),this.YEAR_IN_MILLISECONDS, pointInTime, true);
	  this.moonth = new Cycle(this.A_NEW_MOON.valueOf(), this.MOONTH_IN_MILLISECONDS, pointInTime, true);

	  this.moonths = this.moonthsOfYear();

	}

	EarthCycles.prototype = {
	  yearsPassed:function(){
	    return (this.year.cyclesSinceAnchor());
	  },

	  dayOfYear:function(){
	    return (this.year.dayOfCycle());
	  },

	  firstNewDayOfYear:function(){
	    return (this.year.firstDayStartOfCurrentCycle());
	  },

	  lastEndDayOfYear:function(){
	    return (this.year.lastDayEndOfCurrentCycle());
	  },

	  daysInYear:function(){
	    return(this.year.daysInCycle());
	  },

	  msToDays:function(ms){
	    return(ms/this.DAY_IN_MILLISECONDS);
	  },

	  moonthsOfYear:function(){
	    moonths = [];
	    point = this.firstNewDayOfYear();
	    sum = 0;

	    while (point < this.lastEndDayOfYear()) {
	      moonth = new Cycle(this.A_NEW_MOON.valueOf(), this.MOONTH_IN_MILLISECONDS, point, true);
	      startDayMoonth = moonth.firstDayStartOfCurrentCycle();
	      endDayMoonth = moonth.lastDayEndOfCurrentCycle();

	      if (moonths.length === 0) {
	        daysInMoonth =  this.msToDays(endDayMoonth - point);
	      }
	      else {
	        if (endDayMoonth > this.lastEndDayOfYear()){
	          daysInMoonth = this.msToDays(this.lastEndDayOfYear() - startDayMoonth);
	        }
	        else {
	          daysInMoonth =  moonth.daysInCycle();
	        }
	      }

	      moonths.push(daysInMoonth);
	      sum = sum + daysInMoonth;

	      point = endDayMoonth + this.DAY_IN_MILLISECONDS;
	    }

	    return(moonths);

	  },


	  dayOfMoonth:function(){
	    return (this.moonth.dayOfCycle());
	  },

	  firstNewMoonOfYear:function(){
	    var startOfYear = this.year.firstDayStartOfCurrentCycle();
	    moonth = new Cycle(this.A_NEW_MOON.valueOf(), this.MOONTH_IN_MILLISECONDS, startOfYear , true);
	    return (moonth.lastDayEndOfCurrentCycle(startOfYear));
	  },

	  moonthOfYear:function(){
	    var found = false;
	    var index = 0;
	    var sum = 0;
	    while (!found) {
	      sum = sum + this.moonths[index];
	      if ( this.dayOfYear() < sum) {
	        found = true;
	      }
	      else {
	        index = index + 1;
	      }
	    }

	    return (index + 1);
	  },


	  daysInMoonth:function(){
	    return(this.moonth.daysInCycle());
	  },


	  displayString:function(){
	    return "The " + this.dayOfMoonth() + "/" +this.daysInMoonth() + " day of the " + this.moonthOfYear() + "/" + this.moonthsInYear() + " Moonth of Year "
	  },

	}

	module.exports = EarthCycles;

/***/ },
/* 3 */
/***/ function(module, exports) {

	var Cycle = function(anchor, lengthInMilliseconds, pointInTime, adjust){
	  this.pointInTime = pointInTime
	  this.anchor = anchor;
	  this.lengthInMilliseconds = lengthInMilliseconds;
	  if (this.dayOfCycle() === 0 && adjust) {
	    this.pointInTime = this.pointInTime - (60*60*24*1000)
	  }
	}

	Cycle.prototype = {
	    millisecondsIntoCycle: function(){
	      return ((this.pointInTime - this.anchor) % this.lengthInMilliseconds );
	    },
	    fractionOfCycle: function(){
	      return( this.millisecondsIntoCycle()/this.lengthInMilliseconds );
	    },
	    cyclesSinceAnchor: function(){
	      return( Math.floor((this.pointInTime - this.anchor)/this.lengthInMilliseconds));
	    },
	    startOfCurrentCycle: function(){
	      return (this.anchor + (this.cyclesSinceAnchor()*this.lengthInMilliseconds));
	      var start =  new Date(this.startOfCurrentCycle());
	      start.setDate(start.getDate()+1);
	      start.setHours(0,0,0,0);
	      return (start.valueOf());
	    },
	    endOfCurrentCycle: function(){
	      return (this.anchor + ((this.cyclesSinceAnchor()+1)*this.lengthInMilliseconds));
	    },
	    startOfNextCycle: function(){
	      return (this.startOfCurrentCycle() + this.lengthInMilliseconds);
	    },
	    firstDayStartOfCurrentCycle: function(){
	      var start =  new Date(this.startOfCurrentCycle());
	      start.setDate(start.getDate()+1);
	      start.setHours(0,0,0,0);
	      return (start.valueOf());
	    },

	    lastDayEndOfCurrentCycle: function(){
	      var end =  new Date(this.endOfCurrentCycle());
	      end.setDate(end.getDate()+1);
	      end.setHours(0,0,0,0);
	      return (end.valueOf());
	    },
	    dayOfCycle: function(){
	      var adjustedTime = this.pointInTime - this.firstDayStartOfCurrentCycle();
	      return (Math.ceil(adjustedTime/(60*60*24*1000)));
	    },

	    length: function(){
	      return (this.lastDayEndOfCurrentCycle() - this.firstDayStartOfCurrentCycle())
	    },

	    daysInCycle: function(){
	      return(Math.round(this.length() / (60*60*24*1000)))
	    }
	}

	module.exports = Cycle;

/***/ }
/******/ ]);