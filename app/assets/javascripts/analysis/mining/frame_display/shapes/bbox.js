var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.FrameDisplay = Mining.FrameDisplay || {};
Mining.FrameDisplay.Shapes = Mining.FrameDisplay.Shapes || {};

/*
  Lightweight rectangle drawing for localization.
*/

Mining.FrameDisplay.Shapes.Bbox = function() {
  var self = this;

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
  var scaleWidth = 55;

  this.draw = function(ctx, bbox, detName){
    var x = bbox.x, y = bbox.y, w = bbox.w, h = bbox.h;
    var name = detName, score = bbox.prob_score;
    var scaleZDist = bbox.chia_version_id + ' : ' + bbox.scale + ' : ' + bbox.zdist_thresh;

    // all text hang from x,y
    ctx.textBaseline = "hanging";

    // text rendering : name
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.crispFillRect(x + borderOffset, y + borderOffset, w - 2 * borderOffset, nameHeight);
    ctx.font = "20px serif";
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillText(name, x + borderOffset + textLeftOffset, y + borderOffset + textTopOffset);

    // text rendering : score
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.crispFillRect(x + borderOffset, y + borderOffset + nameHeight + 1, scoreWidth, scoreHeight);
    ctx.font = "12px serif";
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillText(score, x + borderOffset + textLeftOffset + 2, y + borderOffset + textTopOffset + nameHeight);

    // text rendering : scale
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.crispFillRect(x + borderOffset, y + borderOffset + nameHeight + scoreHeight + 2, scaleWidth, scaleHeight);
    ctx.font = "10px serif";
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillText(scaleZDist, x + borderOffset + textLeftOffset + 2, y + borderOffset + textTopOffset + nameHeight + scoreHeight);

    // border rendering
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.crispStrokeRect(x, y, w, h);
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.crispStrokeRect(x + 1, y + 1, w - 2, h - 2);
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.crispStrokeRect(x + 2, y + 2, w - 4, h - 4);
  };
};

