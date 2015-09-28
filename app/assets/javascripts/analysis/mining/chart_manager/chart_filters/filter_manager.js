var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.ChartManager = Mining.ChartManager || {};
Mining.ChartManager.ChartFilters = Mining.ChartManager.ChartFilters || {};

/*
  This class handles creating and updating all visual elements of filters
*/

Mining.ChartManager.ChartFilters.FilterManager = function() {
  var self = this;
  this.dataManager = undefined;
  this.eventManager = undefined;
  this.htmlGenerator = new Mining.ChartManager.HtmlGenerator();

  this.filterStatusVideo = new Mining.ChartManager.ChartFilters.FilterStatusVideo(self.htmlGenerator);
  this.filterStatusFrame = new Mining.ChartManager.ChartFilters.FilterStatusFrame(self.htmlGenerator);
  this.filterFrame = new Mining.ChartManager.ChartFilters.FilterFrame(self.htmlGenerator);

  //------------------------------------------------
  // set relations
  this.setEventManager = function(em){
    self.eventManager = em;
    self.filterStatusVideo.setEventManager(self.eventManager);
    self.filterStatusFrame.setEventManager(self.eventManager);
    self.filterFrame.setEventManager(self.eventManager);
    return self;
  };

  this.setDataManager = function(dm){
    self.dataManager = dm;
    self.filterStatusVideo.setDataManager(self.dataManager);
    self.filterStatusFrame.setDataManager(self.dataManager);
    self.filterFrame.setDataManager(self.dataManager);
    return self;
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('Mining.ChartManager.ChartFilters.FilterManager -> ' + errorReason);
  };
};