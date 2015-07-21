var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.Controller = Mining.Controller || {};

/*
  This class coordinates action between all mining classes.
*/

Mining.Controller.AnnotationController = function() {
  var self = this;

  this.eventManager = new Mining.Controller.EventManager();

  this.chartManager = new Mining.ChartManager.ChartManager();
  this.dataManager = new Mining.DataManager.DataManager();
  this.videoPlayer = new Mining.VideoHandler.VideoPlayer();
  this.drawInfoOverlay = new Mining.FrameDisplay.DrawInfoOverlay();

  this.loadData = function(miningId, setId){
    self.videoPlayer.enableControls(false);
    self.dataManager.getMiningDataPromise(miningId, setId)
      .then(function(){
        self.dataManager.massageMiningData();

        var videoClipMap = self.dataManager.getData_videoClipMap();
        var videoLoadPromise = self.videoPlayer.loadClipsPromise(videoClipMap);

        // as video is loading, work some more
        self.chartManager.showAnnotationList();
        self.dataManager.tChart_createData();

        return videoLoadPromise;
      })
      .then(function(){ 
        self.videoPlayer.enableControls(true);
        self.chartManager.drawTimelineChart();
        self.videoPlayer.pausePlayback();
      })
      .catch(function (errorReason) { self.err(errorReason); }); 
  };

  this.bindPageUnload = function(){
    $(window).bind('beforeunload', function(){
      return 'Are you sure you want to leave?';
    });
  };

  this.register = function(){
    self.dataManager
      .setEventManager(self.eventManager);

    self.chartManager
      .setEventManager(self.eventManager)
      .setDataManager(self.dataManager);

    self.videoPlayer
      .setEventManager(self.eventManager)
      .setDataManager(self.dataManager);

    self.drawInfoOverlay
      .setEventManager(self.eventManager)
      .setDataManager(self.dataManager);
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('Mining.Controller.AnnotationController -> ' + errorReason);
  };
};
