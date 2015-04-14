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
  this.filterHandler = new ZIGVU.FilterHandler.FilterHandler();

  this.videoPlayer = new ZIGVU.VideoHandler.VideoPlayer(this.renderCTX);
  this.videoPlayerControls = new ZIGVU.VideoHandler.VideoPlayerControls(this.videoPlayer);

  this.drawLocalizations = new ZIGVU.FrameDisplay.DrawLocalizations(videoFrameCanvas);
  this.drawingHandler = new ZIGVU.FrameDisplay.DrawingHandler(videoFrameCanvas);

  this.loadData = function(){
    // this.filterHandler.addChiaVersionId(1);
    // this.filterHandler.addDetectableIds([48, 49]);
    // this.filterHandler.addLocalizationScores({prob_scores: [0.9, 1.0]});

    this.dataManager.loadLocalizationPromise(this.filterHandler)
      .then(function(videoIds){ return _this.dataManager.loadVideoDataMapPromise(videoIds); })
      .then(function(videoDataMap){ return _this.videoPlayer.loadVideosPromise(videoDataMap); })
      .then(function(){ _this.videoPlayerControls.enable(); })
      .catch(function (errorReason) {
        displayJavascriptError('ZIGVU.AnnotationController -> ' + errorReason);
      });
  };

  this.register = function(){
    this.chartManager.annotationController(_this);
    this.videoPlayer.annotationController(_this);
    this.drawLocalizations.annotationController(_this);

    this.videoPlayerControls.disable();
  };
};


