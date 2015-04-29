var ZIGVU = ZIGVU || {};
ZIGVU.Controller = ZIGVU.Controller || {};

/*
  This class coordinates action between all annotation classes.
*/

ZIGVU.Controller.AnnotationController = function() {
  var self = this;

  this.eventManager = new ZIGVU.Controller.EventManager();

  this.chartManager = new ZIGVU.ChartManager.ChartManager();
  this.dataManager = new ZIGVU.DataManager.DataManager();
  this.videoPlayer = new ZIGVU.VideoHandler.VideoPlayer();

  this.startFilter = function(){
    self.videoPlayer.enableControls(false);

    self.dataManager.resetFilters();
    filterPromises = self.chartManager.startFilter();
    filterPromises.video_load.then(function(response){ self.loadVideos(); });
    filterPromises.filter_reset.then(function(response){ self.resetFilters(); });
  };

  this.loadDataTest = function(){

    // TODO: remove
    self.dataManager.filterStore.chiaVersionIdLocalization = 1;
    self.dataManager.filterStore.detectableIds = [1, 48, 49];
    self.dataManager.filterStore.localizations = {prob_scores: [0.9, 1.0], zdist_thresh: 0, scales: [0.7, 1.0]};
    self.dataManager.ajaxHandler.getChiaVersionsPromise()
      .then(function(chiaVersions){ return self.dataManager.ajaxHandler.getDetectablesPromise(); })
      .then(function(detectables){ return self.dataManager.ajaxHandler.getLocalizationPromise(); })
      .then(function(localizations){ return self.dataManager.ajaxHandler.getDataSummaryPromise(); })
      .then(function(dataSummary){ 
        // show annotation list
        self.chartManager.showAnnotationList();

        self.dataManager.ajaxHandler.getFullDataPromise()
          .then(function(videoDataMap){ 
            var videoLoadPromise = self.videoPlayer.loadVideosPromise(videoDataMap);
            self.dataManager.createTimelineChartData();
            return videoLoadPromise;
          })
          .then(function(){ 
            self.videoPlayer.enableControls(true);
            self.chartManager.drawTimelineChart();
            self.videoPlayer.pausePlayback();
          })
          .catch(function (errorReason) { self.err(errorReason); }); 

        console.log('Loading videos');
      })
      .catch(function (errorReason) { self.err(errorReason); }); 
  };

  this.loadVideos = function(){
    // show annotation list
    self.chartManager.showAnnotationList();

    self.dataManager.ajaxHandler.getFullDataPromise()
      .then(function(videoDataMap){ 
        var videoLoadPromise = self.videoPlayer.loadVideosPromise(videoDataMap);
        self.dataManager.createTimelineChartData();
        return videoLoadPromise;
      })
      .then(function(){ 
        self.videoPlayer.enableControls(true);
        self.chartManager.drawTimelineChart();
        self.videoPlayer.pausePlayback();
      })
      .catch(function (errorReason) { self.err(errorReason); }); 
  };

  this.resetFilters = function(){
    console.log('Resetting filters');
  };

  this.register = function(){
    self.chartManager
      .setEventManager(self.eventManager)
      .setDataManager(self.dataManager);

    self.videoPlayer
      .setEventManager(self.eventManager)
      .setDataManager(self.dataManager);
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.Controller.AnnotationController -> ' + errorReason);
  };
};


