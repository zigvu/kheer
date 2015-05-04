var ZIGVU = ZIGVU || {};
ZIGVU.FrameDisplay = ZIGVU.FrameDisplay || {};
ZIGVU.FrameDisplay.Shapes = ZIGVU.FrameDisplay.Shapes || {};

/*
  Rectangle drawing for drawing one cell of heatmap.
*/

ZIGVU.FrameDisplay.Shapes.HeatCell = function() {
  var self = this;

  this.draw = function(ctx, cell, fillColor){
    var x = cell.x, y = cell.y, w = cell.w, h = cell.h;
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, w, h);
  };
};

