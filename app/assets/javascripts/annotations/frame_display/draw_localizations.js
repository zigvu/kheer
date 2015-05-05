var ZIGVU = ZIGVU || {};
ZIGVU.FrameDisplay = ZIGVU.FrameDisplay || {};

/*
  Lightweight handler to draw only localization.
*/

ZIGVU.FrameDisplay.DrawLocalizations = function() {
  var self = this;

  this.canvas = document.getElementById("localizationCanvas");
  new ZIGVU.FrameDisplay.CanvasExtender(self.canvas);
  this.ctx = self.canvas.getContext("2d");

  this.dataManager = undefined;
  var localizationDrawn = false;

  var bbox = new ZIGVU.FrameDisplay.Shapes.Bbox();

  this.drawBboxes = function(videoId, frameNumber){
    self.clear();
    var localizations = self.dataManager.getData_localizations(videoId, frameNumber);
    _.each(localizations, function(locs, detectableId){
      _.each(locs, function(bb){
        var annoDetails = self.dataManager.getData_localizationDetails(detectableId);
        bbox.draw(self.ctx, bb, annoDetails.title, annoDetails.color);
      });
    });
    localizationDrawn = true;
  }

  this.clear = function(){
    if(localizationDrawn){
      // clear existing content
      self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
      localizationDrawn = false;
    }
  };

  // set relations
  this.setDataManager = function(dm){
    self.dataManager = dm;
    return self;
  };
};
