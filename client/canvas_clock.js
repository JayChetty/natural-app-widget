module.exports = function(options){
  options = options || {};
  console.log('options', options)
  var canvas = options.canvas;
  var ctx = canvas.getContext("2d");
  var clock = {
    radius: options.radius,
    center: options.center,
    render: function(){
      this.drawOutline();
    },
    drawSweep: function(startTime, endTime, color){
      ctx.beginPath();
      ctx.fillStyle = "rgba(219, 223, 99, 0.2)";
      ctx.moveTo(this.center.x,this.center.y);
      ctx.arc( 
        this.center.x,
        this.center.y,
        this.radius, 
        this.angleForTime(startTime), 
        this.angleForTime(endTime)
      );
      ctx.moveTo(this.center.x,this.center.y);
      ctx.fill();
    },
    drawOutline: function(){     
      ctx.beginPath();
      ctx.arc(this.center.x,this.center.y,this.radius,0, 2*Math.PI);
      ctx.stroke();          
    },
    fractionOfDay:function(time){
      var minutesInDay = 24 * 60;
      var timeInMinutes = (time.getHours() * 60) + time.getMinutes();
      return(timeInMinutes / minutesInDay);
    },
    angleForTime:function(time){
      return this.angleForFraction( this.fractionOfDay(time) );
    },
    angleForFraction:function(fraction){
      return( Math.PI*2 * fraction - Math.PI/2 );
    },
    drawLineForTime:function(time){
      this.drawLineForFraction( this.fractionOfDay(time) );
    },
    drawLineForFraction:function(fraction){
      console.log("draw line for fraction", fraction)
      ctx.beginPath();
      ctx.moveTo(this.center.x,this.center.y);
      var endPoint = this.pointOnOutline(fraction);
      console.log('endpoint', endPoint);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.stroke();
    },
    pointOnOutline:function(fraction){
      var angle = this.angleForFraction(fraction);
      var unadjustedCenterPoint = this.polarToCartesian(this.radius, angle);
      return {
        x: unadjustedCenterPoint.x + this.center.x,
        y: unadjustedCenterPoint.y + this.center.y
      }
    },
    polarToCartesian:function(radius, angle){
      return { 
        x:radius*Math.cos(angle),
        y:radius*Math.sin(angle)
      }
    }

  }
  return clock;
}