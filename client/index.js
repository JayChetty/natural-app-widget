canvasClock = require('./canvas_clock');
NaturalCalendar = require('natural_calendar');
SunCalc = require('suncalc')
window.onload = function(){
  console.log('in the house yo');
  var canvas = document.createElement('canvas');
  canvas.style.width = '200px';
  canvas.style.height = '100px';
  canvas.style.background = '#777777'
  canvas.style.position = 'fixed'
  canvas.style.top = '0px'
  canvas.style.right = '0px'

  document.body.appendChild(canvas)

  console.log('canvas', canvas)
  var clock = canvasClock({
    center: { x: canvas.width/2, y: canvas.height/2 },
    canvas: canvas,
    radius:50
  });
  clock.drawOutline();
  clock.drawLineForTime(new Date());


  var drawSunLines = function(latitude, longitude){
    var sunTimes = SunCalc.getTimes(new Date(), latitude, longitude);
    clock.drawLineForTime(sunTimes.sunrise)
    clock.drawLineForTime(sunTimes.sunset)
    clock.drawSweep(sunTimes.sunrise, sunTimes.sunset)
  };

  var gotLocation = function(location){
    var latitude = location.coords.latitude
    var longitude = location.coords.longitude
    window.localStorage.setItem('latitude', latitude);
    window.localStorage.setItem('longitude', longitude);
    drawSunLines(latitude, longitude);
  }; 

  var noLocation = function(error){
    console.log('cannot get location', error);
    if(localStorage.getItem('latitude')){
      drawSunLines(localStorage.getItem('latitude'), localStorage.getItem('longitude'))
    }
    else{
      alert('Cannot Find Location, enable location on device or enter manually');
    }
  };

  navigator.geolocation.getCurrentPosition( gotLocation, noLocation, { timeout: 60000, enableHighAccuracy: false } );    
};