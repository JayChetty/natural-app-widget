module.exports = function(options){
  options = options || {};
  var canvas = options.canvas;
  var ctx = canvas.getContext("2d");
  var calendar = {
    radius: options.radius,
    center: options.center,
    render: function(){
      this.drawOutline();
    },
    drawOutline: function(){     
      ctx.beginPath();
      ctx.arc(this.center.x,this.center.y,this.radius,0, 2*Math.PI);
      ctx.stroke();          
    },
  }
  return calendar;
}