var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};

/*
  This class handles all display elements except video/frame.
*/

ZIGVU.ChartManager.ChartManager = function() {
  var _this = this;
  this.dataManager = undefined;

  this.filterManager = new ZIGVU.ChartManager.ChartFilters.FilterManager();
  this.annotationList = new ZIGVU.ChartManager.AnnotationList();

  this.showAnnotationList = function(){
    this.annotationList.display();
    // set the selected to first item in list
    this.annotationList.setToFirstButton();
  };

  this.startFilter = function(){
    var videoLoadDefer = Q.defer();
    var filterResetDefer = Q.defer();

    this.filterManager.setDefers(videoLoadDefer, filterResetDefer);
    this.filterManager.reset();
    this.filterManager.startFilter();

    var filterPromises = {
      video_load: videoLoadDefer.promise,
      filter_reset: filterResetDefer.promise
    }
    return filterPromises;
  };

  this.reset = function(){
    this.filterManager.reset();
    this.annotationList.empty();
  };

  this.setDataManager = function(dm){
    this.dataManager = dm;
    this.filterManager.setDataManager(this.dataManager);
    this.annotationList.setDataManager(this.dataManager);
    return this;
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.ChartManager.ChartManager -> ' + errorReason);
  };
};