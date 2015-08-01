var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.ChartManager = Mining.ChartManager || {};

/*
  This class handles all display elements except video/frame.
*/

Mining.ChartManager.ChartManager = function() {
  var self = this;
  this.eventManager = undefined;
  this.dataManager = undefined;

  this.filterManager = new Mining.ChartManager.ChartFilters.FilterManager();
  this.annotationList = new Mining.ChartManager.AnnotationList();
  this.timelineChart = new Mining.ChartManager.D3Charts.TimelineChart();

  this.showAnnotationList = function(){
    self.annotationList.display();
    // set the selected to first item in list
    self.annotationList.setToFirstButton();
  };

  this.drawTimelineChart = function(){
    self.timelineChart.drawLoc();
    self.timelineChart.drawAnno();
  };

  //------------------------------------------------
  // set relations
  this.setEventManager = function(em){
    self.eventManager = em;
    self.filterManager.setEventManager(self.eventManager);
    self.annotationList.setEventManager(self.eventManager);
    self.timelineChart.setEventManager(self.eventManager);
    return self;
  };

  this.setDataManager = function(dm){
    self.dataManager = dm;
    self.filterManager.setDataManager(self.dataManager);
    self.annotationList.setDataManager(self.dataManager);
    self.timelineChart.setDataManager(self.dataManager);
    return self;
  };


  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('Mining.ChartManager.ChartManager -> ' + errorReason);
  };
};