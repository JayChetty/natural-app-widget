canvasClock = require('./canvas_clock');
NaturalCalendar = require('natural_calendar');
window.onload = function(){
  console.log('in the house yo');
  var canvas = document.getElementById('main');
  console.log('canvas', canvas)
  var clock = canvasClock({
    center: { x: canvas.width/2, y: canvas.height/2 },
    canvas: canvas,
    radius:50
  });
  clock.drawOutline();
  clock.drawLineForTime(new Date());
};