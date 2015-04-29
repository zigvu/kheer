var ZIGVU = ZIGVU || {};
ZIGVU.FrameDisplay = ZIGVU.FrameDisplay || {};

/*
  Extend canvas to include common helpers
*/

ZIGVU.FrameDisplay.CanvasExtender = function(canvas) {
  var self = this;
  this.canvas = canvas;
  this.ctx = self.canvas.getContext("2d");

  // add crisp stroke to rectangle
  this.ctx.crispStrokeRect = function(x, y, w, h){
    x = parseInt(x) + 0.50;
    y = parseInt(y) + 0.50;
    this.strokeRect(x, y, w, h);
  };

  this.ctx.crispFillRect = function(x, y, w, h){
    x = parseInt(x);
    y = parseInt(y);
    this.fillRect(x, y, w, h);
  };
};
