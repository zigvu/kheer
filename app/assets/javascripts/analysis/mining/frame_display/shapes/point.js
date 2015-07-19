var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.FrameDisplay = Mining.FrameDisplay || {};
Mining.FrameDisplay.Shapes = Mining.FrameDisplay.Shapes || {};

/*
  Point that can be decorated and displayed
*/

Mining.FrameDisplay.Shapes.Point = function(px, py) {
  var self = this;
  var selected = false;
  var x = px || 0;
  var y = py || 0;
  
  // default decorations
  var strokeColor = "rgb(0, 0, 0)";
  var strokeColorSelected = "rgb(255, 0, 0)";
  var fillColor = "rgb(255, 255, 255)";
  var fillColorSelected = "rgb(255, 255, 0)";
  var pointSquareWH = 6;

  this.draw = function(ctx){
    // decoration settings
    var sColor, fColor;
    if(selected){
      sColor = strokeColorSelected;
      fColor = fillColorSelected;
    } else {
      sColor = strokeColor;
      fColor = fillColor;
    }

    // fill first
    ctx.fillStyle = fColor;
    ctx.crispFillRect(x - pointSquareWH/2 - 2, y - pointSquareWH/2 - 2, pointSquareWH + 4, pointSquareWH + 4);

    // double stroke
    ctx.lineWidth = 1;
    ctx.strokeStyle = sColor;
    ctx.crispStrokeRect(x - pointSquareWH/2, y - pointSquareWH/2, pointSquareWH, pointSquareWH);
    ctx.strokeStyle = strokeColorSelected;
    ctx.crispStrokeRect(x - pointSquareWH/2 - 2, y - pointSquareWH/2 - 2, pointSquareWH + 4, pointSquareWH + 4);
  };

  this.select = function(){
    selected = true;
  };

  this.deselect = function(){
    selected = false;
  };

  // return true if mouse is within this rect
  this.contains = function(mouseX, mouseY){
    return (
      (mouseX >= x - pointSquareWH/2) &&
      (mouseX <= x + pointSquareWH/2) &&
      (mouseY >= y - pointSquareWH/2) &&
      (mouseY <= y + pointSquareWH/2)
    );
  };

  this.getX = function(){ return x; }
  this.getY = function(){ return y; }

  this.setDecorations = function(sColor, sColorSelected, fColor, fColorSelected, pSquareWH){
    strokeColor = sColor;
    strokeColorSelected = sColorSelected;
    fillColor = fColor;
    fillColorSelected = fColorSelected;
    pointSquareWH = pSquareWH;
  };
};
