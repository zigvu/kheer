var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};

/*
  This class handles all display elements except video/frame.
*/

ZIGVU.ChartManager.ChartManager = function() {
  var self = this;
  this.dataManager = undefined;

  this.filterManager = new ZIGVU.ChartManager.ChartFilters.FilterManager();
  this.annotationList = new ZIGVU.ChartManager.AnnotationList();

  this.showAnnotationList = function(){
    self.annotationList.display();
    // set the selected to first item in list
    self.annotationList.setToFirstButton();
  };

  this.startFilter = function(){
    var videoLoadDefer = Q.defer();
    var filterResetDefer = Q.defer();

    self.filterManager.setDefers(videoLoadDefer, filterResetDefer);
    self.filterManager.reset();
    self.filterManager.startFilter();

    var filterPromises = {
      video_load: videoLoadDefer.promise,
      filter_reset: filterResetDefer.promise
    }
    return filterPromises;
  };

  this.reset = function(){
    self.filterManager.reset();
    self.annotationList.empty();
  };

  this.setDataManager = function(dm){
    self.dataManager = dm;
    self.filterManager.setDataManager(self.dataManager);
    self.annotationList.setDataManager(self.dataManager);
    return self;
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.ChartManager.ChartManager -> ' + errorReason);
  };
};