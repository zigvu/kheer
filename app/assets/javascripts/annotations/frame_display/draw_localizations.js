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
      var localizations = self.dataManager.getLocalizations(videoId, frameNumber);
    _.each(localizations, function(locs, detectableId){
      _.each(locs, function(bb){
        var annoDetails = self.dataManager.getAnnotationDetails(detectableId);
        bbox.draw(self.ctx, bb, annoDetails.title, annoDetails.color);
      });
    });
  }

  // set relations
  this.setDataManager = function(dm){
    self.dataManager = dm;
    return self;
  };
};
