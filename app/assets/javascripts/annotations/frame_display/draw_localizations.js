var ZIGVU = ZIGVU || {};
ZIGVU.FrameDisplay = ZIGVU.FrameDisplay || {};

/*
  Lightweight handler to draw only localization.
*/

ZIGVU.FrameDisplay.DrawLocalizations = function(canvas) {
  var _this = this;
  this.canvas = canvas;
  this.ctx = this.canvas.getContext("2d");

  this.annotationController = undefined;
  this.dataManager = undefined;

  var bbox = new ZIGVU.FrameDisplay.Shapes.Bbox();

  this.drawBboxes = function(localizations){
    // bb = {"zdist_thresh":4.5,"scale":0.7,"prob_score":0.965,"x":20,"y":20,"w":110,"h":80};
    var detName, annotationColor;

    _.each(localizations, function(locs, detectableId){
      _.each(locs, function(bb){
        detName = _this.dataManager.getDetectableName(detectableId);
        annotationColor = _this.dataManager.getDetectableColor(detectableId);
        bbox.draw(_this.ctx, bb, detName, annotationColor);
        console.log(bb);
      });
    });
  }

  this.annotationController = function(annotationController){
    _this.annotationController = annotationController;
    _this.dataManager = _this.annotationController.dataManager;
    return _this;
  };
};
