var ZIGVU = ZIGVU || {};
ZIGVU.FrameDisplay = ZIGVU.FrameDisplay || {};
ZIGVU.FrameDisplay.Shapes = ZIGVU.FrameDisplay.Shapes || {};

/*
  Rectangle drawing for drawing one cell of heatmap.
*/

ZIGVU.FrameDisplay.Shapes.HeatCell = function() {
  var self = this;

  this.draw = function(ctx, cell, fillColor){
    var x = cell.x0, 
        y = cell.y0, 
        w = cell.x3 - cell.x0, 
        h = cell.y3 - cell.y0;
    
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, w, h);
  };
};

