var ZIGVU = ZIGVU || {};
ZIGVU.FrameDisplay = ZIGVU.FrameDisplay || {};

/*
  Lightweight handler to draw only localization.
*/

ZIGVU.FrameDisplay.DrawLocalizations = function(canvas) {
  var self = this;
  this.canvas = canvas;
  this.ctx = self.canvas.getContext("2d");

  this.dataManager = undefined;

  var bbox = new ZIGVU.FrameDisplay.Shapes.Bbox();

  this.drawBboxes = function(videoId, frameNumber){
    // bb = {"zdist_thresh":4.5,"scale":0.7,"prob_score":0.965,"x":20,"y":20,"w":110,"h":80};
      var localizations = self.dataManager.getLocalizations(videoId, frameNumber);
    _.each(localizations, function(locs, detectableId){
      _.each(locs, function(bb){
        var annoDetails = self.dataManager.getAnnotationDetails(detectableId);
        bbox.draw(self.ctx, bb, annoDetails.name, annoDetails.color);
      });
    });
  }

  // set relations
  this.setDataManager = function(dm){
    self.dataManager = dm;
    return self;
  };
};
