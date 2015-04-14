var ZIGVU = ZIGVU || {};
ZIGVU.FrameDisplay = ZIGVU.FrameDisplay || {};
ZIGVU.FrameDisplay.Shapes = ZIGVU.FrameDisplay.Shapes || {};

/*
  Lightweight rectangle drawing for localization.
*/

ZIGVU.FrameDisplay.Shapes.Bbox = function() {
  var _this = this;

  // offset because of border
  var borderOffset = 2;
  var textLeftOffset = 2;
  var textTopOffset = 2;

  // text rendering : name
  var nameHeight = 22;

  // text rendering : score
  var scoreHeight = 12;
  var scoreWidth = 40;

  // text rendering : scale
  var scaleHeight = 10;
  var scaleWidth = 40;

  this.draw = function(ctx, bbox, detName, fillColor){
    var x = bbox.x, y = bbox.y, w = bbox.w, h = bbox.h;
    var name = detName, score = bbox.prob_score;
    var scaleZDist = bbox.scale + ' : ' + bbox.zdist_thresh;

    // area rendering
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, w, h);

    // all text hang from x,y
    ctx.textBaseline = "hanging";

    // text rendering : name
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(x + borderOffset, y + borderOffset, w - 2 * borderOffset, nameHeight);
    ctx.font = "20px serif";
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillText(name, x + borderOffset + textLeftOffset, y + borderOffset + textTopOffset);

    // text rendering : score
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(x + borderOffset, y + borderOffset + nameHeight + 1, scoreWidth, scoreHeight);
    ctx.font = "12px serif";
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillText(score, x + borderOffset + textLeftOffset + 2, y + borderOffset + textTopOffset + nameHeight);

    // text rendering : scale
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(x + borderOffset, y + borderOffset + nameHeight + scoreHeight + 2, scaleWidth, scaleHeight);
    ctx.font = "10px serif";
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillText(scaleZDist, x + borderOffset + textLeftOffset + 2, y + borderOffset + textTopOffset + nameHeight + scoreHeight);

    // border rendering
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.strokeRect(x, y, w, h);
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
  };
};

