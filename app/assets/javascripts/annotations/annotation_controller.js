var ZIGVU = ZIGVU || {};

/*
  This class coordinates action between all annotation classes.
*/

ZIGVU.AnnotationController = function() {
  var _this = this;

  this.videoFrameCanvas = document.getElementById("videoFrameCanvas");
  this.renderCTX = this.videoFrameCanvas.getContext("2d");

  this.chartManager = new ZIGVU.ChartManager.ChartManager();
  this.dataManager = new ZIGVU.DataManager.DataManager();

  this.videoPlayer = new ZIGVU.VideoHandler.VideoPlayer(this.videoFrameCanvas);
  this.videoPlayerControls = new ZIGVU.VideoHandler.VideoPlayerControls(this.videoPlayer);

  this.startFilter = function(){
    this.videoPlayerControls.disable();

    this.dataManager.resetFilters();
    filterPromises = this.chartManager.startFilter();
    filterPromises.video_load.then(function(response){ _this.loadVideos(); });
    filterPromises.filter_reset.then(function(response){ _this.resetFilters(); });
  };

  this.loadVideos = function(){
    // TODO: remove
    this.dataManager.filterStore.chiaVersionId = 1;
    this.dataManager.filterStore.detectableIds = [1, 48, 49];
    this.dataManager.filterStore.localizations = {prob_scores: [0.9, 1.0], zdist_thresh: [0]};
    this.dataManager.ajaxHandler.getChiaVersionsPromise()
      .then(function(chiaVersions){ return _this.dataManager.ajaxHandler.getDetectablesPromise(); })
      .then(function(detectables){ return _this.dataManager.ajaxHandler.getLocalizationPromise(); })
      .then(function(localizations){ return _this.dataManager.ajaxHandler.getDataSummaryPromise(); })
      .then(function(dataSummary){ 
        // show annotation list
        _this.chartManager.showAnnotationList();

        _this.dataManager.ajaxHandler.getFullDataPromise()
          .then(function(videoDataMap){ return _this.videoPlayer.loadVideosPromise(videoDataMap); })
          .then(function(){ _this.videoPlayerControls.enable(); })
          .catch(function (errorReason) { _this.err(errorReason); }); 

        console.log('Loading videos');
      })
      .catch(function (errorReason) { _this.err(errorReason); }); 
  };

  this.resetFilters = function(){
    console.log('Resetting filters');
  };

  this.register = function(){
    this.chartManager.setDataManager(this.dataManager);

    this.videoPlayer.setDataManager(this.dataManager);
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.AnnotationController -> ' + errorReason);
  };
};


