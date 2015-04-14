var ZIGVU = ZIGVU || {};
ZIGVU.FrameDisplay = ZIGVU.FrameDisplay || {};
ZIGVU.FrameDisplay.Shapes = ZIGVU.FrameDisplay.Shapes || {};

/*
  Point that can be decorated and displayed
*/

ZIGVU.FrameDisplay.Shapes.Point = function(px, py) {
  var _this = this;
  var selected = false;
  var x = px || 0;
  var y = py || 0;
  
  // default decorations
  var strokeColor = '#000000';
  var strokeColorSelected = '#FF0000';
  var fillColor = '#FFFFFF';
  var fillColorSelected = '#F0F000';
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
    ctx.strokeStyle = sColor;
    ctx.fillStyle = fColor;

    // fill and stroke
    ctx.fillRect(x - pointSquareWH/2, y - pointSquareWH/2, pointSquareWH, pointSquareWH);
    ctx.strokeRect(x - pointSquareWH/2, y - pointSquareWH/2, pointSquareWH, pointSquareWH);
  };

  this.select = function(){
    selected = true;
  };

  this.deselect = function(){
    selected = false;
  };

  this.toggleSelect = function(){
    selected = !selected;
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
