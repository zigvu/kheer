var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.FrameDisplay = Mining.FrameDisplay || {};

/*
  Lightweight handler to draw only localization.
*/

Mining.FrameDisplay.DrawLocalizations = function() {
  var self = this;

  this.canvas = document.getElementById("localizationCanvas");
  new Mining.FrameDisplay.CanvasExtender(self.canvas);
  this.ctx = self.canvas.getContext("2d");

  this.dataManager = undefined;
  var localizationDrawn = false;
  var allLocalizationDrawn = false;

  var bbox = new Mining.FrameDisplay.Shapes.Bbox();

  this.drawLocalizations = function(clipId, clipFN){
    var localizations = self.dataManager.getData_localizationsData(clipId, clipFN);
    self.drawBboxes(localizations);
  };

  this.drawAllLocalizations = function(clipId, clipFN){
    // cycle through scales array if all localizations already drawn
    if(allLocalizationDrawn){
      self.dataManager.getFilter_cycleZdists();
    }

    self.dataManager.getData_allLocalizationsDataPromise(clipId, clipFN)
      .then(function(localizations){
        self.drawBboxes(localizations);
        allLocalizationDrawn = true;
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
      allLocalizationDrawn = false;
    }
  };

  // set relations
  this.setDataManager = function(dm){
    self.dataManager = dm;
    return self;
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('Mining.FrameDisplay.DrawLocalizations -> ' + errorReason);
  };
};
