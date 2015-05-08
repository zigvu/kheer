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

  this.drawLocalizations = function(videoId, frameNumber){
    var localizations = self.dataManager.getData_localizationsData(videoId, frameNumber);
    self.drawBboxes(localizations);
  };

  this.drawAllLocalizations = function(videoId, frameNumber){
    self.dataManager.getData_allLocalizationsDataPromise(videoId, frameNumber)
      .then(function(localizations){
        self.drawBboxes(localizations);
      })
      .catch(function (errorReason) { self.err(errorReason); }); 
  };

  this.drawBboxes = function(localizations){
    self.clear();
    _.each(localizations, function(locs, detectableId){
      _.each(locs, function(bb){
        var annoDetails = self.dataManager.getData_localizationDetails(detectableId);
        bbox.draw(self.ctx, bb, annoDetails.title);
      });
    });
    localizationDrawn = true;    
  };

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

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.FrameDisplay.DrawLocalizations -> ' + errorReason);
  };
};
