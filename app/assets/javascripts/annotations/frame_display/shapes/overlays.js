var ZIGVU = ZIGVU || {};
ZIGVU.FrameDisplay = ZIGVU.FrameDisplay || {};
ZIGVU.FrameDisplay.Shapes = ZIGVU.FrameDisplay.Shapes || {};

/*
  Rectangle drawing for drawing various overlays
*/

ZIGVU.FrameDisplay.Shapes.Overylays = function() {
  var self = this;

  this.draw = function(ctx, overlayObj){
    var x = overlayObj.x, 
        y = overlayObj.y, 
        w = overlayObj.w, 
        h = overlayObj.h,
        text = overlayObj.text,
        type = overlayObj.type,
        status = overlayObj.status;


    // text rendering
    if (type === 'text-medium'){
      ctx.textBaseline = "hanging";
      ctx.fillStyle = "rgb(0, 0, 0)";
      if(status === 'ok'){ ctx.strokeStyle = "rgb(255, 255, 255)"; }
      else if(status === 'error') { ctx.strokeStyle = "rgb(255, 0, 0)"; }
      
      ctx.font = '30pt Calibri';
      ctx.lineWidth = 2;

      ctx.fillText(text, x, y);
      ctx.strokeText(text, x, y);
    } else {
      self.err("Unknown type");
    }
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.FrameDisplay.Shapes.DrawText -> ' + errorReason);
  };
};
