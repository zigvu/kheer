var ZIGVU = ZIGVU || {};

/*
  This class coordinates action between all annotation classes.
*/

ZIGVU.AnnotationController = function() {
  var self = this;

  this.videoFrameCanvas = document.getElementById("videoFrameCanvas");
  this.renderCTX = self.videoFrameCanvas.getContext("2d");

  this.chartManager = new ZIGVU.ChartManager.ChartManager();
  this.dataManager = new ZIGVU.DataManager.DataManager();

  this.videoPlayer = new ZIGVU.VideoHandler.VideoPlayer(self.videoFrameCanvas);
  this.videoPlayerControls = new ZIGVU.VideoHandler.VideoPlayerControls(self.videoPlayer);

  this.startFilter = function(){
    self.videoPlayerControls.disable();

    self.dataManager.resetFilters();
    filterPromises = self.chartManager.startFilter();
    filterPromises.video_load.then(function(response){ self.loadVideos(); });
    filterPromises.filter_reset.then(function(response){ self.resetFilters(); });
  };

  this.loadVideos = function(){
    // TODO: remove
    self.dataManager.filterStore.chiaVersionId = 1;
    self.dataManager.filterStore.detectableIds = [1, 48, 49];
    self.dataManager.filterStore.localizations = {prob_scores: [0.9, 1.0], zdist_thresh: [0]};
    self.dataManager.ajaxHandler.getChiaVersionsPromise()
      .then(function(chiaVersions){ return self.dataManager.ajaxHandler.getDetectablesPromise(); })
      .then(function(detectables){ return self.dataManager.ajaxHandler.getLocalizationPromise(); })
      .then(function(localizations){ return self.dataManager.ajaxHandler.getDataSummaryPromise(); })
      .then(function(dataSummary){ 
        // show annotation list
        self.chartManager.showAnnotationList();

        self.dataManager.ajaxHandler.getFullDataPromise()
          .then(function(videoDataMap){ return self.videoPlayer.loadVideosPromise(videoDataMap); })
          .then(function(){ self.videoPlayerControls.enable(); })
          .catch(function (errorReason) { self.err(errorReason); }); 

        console.log('Loading videos');
      })
      .catch(function (errorReason) { self.err(errorReason); }); 
  };

  this.resetFilters = function(){
    console.log('Resetting filters');
  };

  this.register = function(){
    self.chartManager.setDataManager(self.dataManager);

    self.videoPlayer.setDataManager(self.dataManager);
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.AnnotationController -> ' + errorReason);
  };
};


