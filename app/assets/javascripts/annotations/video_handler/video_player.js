var ZIGVU = ZIGVU || {};
ZIGVU.VideoHandler = ZIGVU.VideoHandler || {};

/*
  This class handles all video player interactions.
*/

ZIGVU.VideoHandler.VideoPlayer = function() {
  var self = this;

  this.canvas = document.getElementById("videoFrameCanvas");
  this.renderCTX = self.canvas.getContext("2d");

  this.eventManager = undefined;
  this.dataManager = undefined;
  this.drawLocalizations = new ZIGVU.FrameDisplay.DrawLocalizations();
  this.drawAnnotations = new ZIGVU.FrameDisplay.DrawAnnotations();
  this.drawHeatmap = new ZIGVU.FrameDisplay.DrawHeatmap();
  this.multiVideoExtractor = new ZIGVU.VideoHandler.MultiVideoExtractor(self.renderCTX);

  this.videoPlayerControls = new ZIGVU.VideoHandler.VideoPlayerControls(self);

  // pause behavior tracker
  var isVideoPaused = false;

  // returns promise that will be resolved once all videos are loaded
  this.loadVideosPromise = function(videoDataMap){ 
    return self.multiVideoExtractor.loadVideosPromise(videoDataMap); 
  }

  this.enableControls = function(bool){
    var x = bool ? self.videoPlayerControls.enable() : self.videoPlayerControls.disable();
  };

  //------------------------------------------------
  // painting in different modes

  // frequency of update to timeline chart
  var updateTimelineChartCounter = 0, maxUpdateTimelineChartCounter = 10;


  // paint in continuous play mode
  this.paintContinuous = function(){
    if(isVideoPaused){ return; }

    var currentPlayState = self.paintFrameWithLocalization();

    // update timeline chart every so often
    if(updateTimelineChartCounter >= maxUpdateTimelineChartCounter){
      self.eventManager.firePaintFrameCallback(currentPlayState);
      updateTimelineChartCounter = 0;
    }
    updateTimelineChartCounter++;

    if(currentPlayState.play_state === 'ended'){ return; }

    // schedule to run again in a short time
    // Note: requestAnimationFrame tends to skip frames where as setTimeout
    // seems to skip less
    // requestAnimationFrame(self.paintContinuous);
    setTimeout(function(){ self.paintContinuous(); }, 20);
  };

  // paint in continuous pause mode
  this.paintUntilPaused = function(){
    if(!isVideoPaused){ return; }

    var currentPlayState = self.paintFrameWithLocalization();
    if(currentPlayState.play_state === 'seeking'){ 
      // schedule to run again in a short time
      setTimeout(function(){ self.paintUntilPaused(); }, 20);
    } else if(currentPlayState.play_state === 'paused'){
      self.drawAnnotations.startAnnotation(currentPlayState.video_id, currentPlayState.frame_number);
      self.eventManager.firePaintFrameCallback(currentPlayState);
      updateTimelineChartCounter = 0;

      console.log("Seek ended!");
    }
  };

  // paint localizations
  this.paintFrameWithLocalization = function(){
    var currentPlayState = self.multiVideoExtractor.paintFrame();
    self.drawLocalizations.drawLocalizations(currentPlayState.video_id, currentPlayState.frame_number);
    // TODO: not working right now
    // self.drawAnnotations.drawAnnotations(currentPlayState.video_id, currentPlayState.frame_number);
    // only clear heatmap here - paint in another function
    self.drawHeatmap.clear();
    return currentPlayState;
  };

  this.paintHeatmap = function(){
    if(!isVideoPaused){ return; }
    var currentPlayState = self.multiVideoExtractor.getCurrentState();
    self.drawHeatmap.drawHeatmap(currentPlayState.video_id, currentPlayState.frame_number);
  };

  this.drawAllLocalizations = function(){
    if(!isVideoPaused){ return; }
    var currentPlayState = self.multiVideoExtractor.getCurrentState();
    self.drawLocalizations.drawAllLocalizations(currentPlayState.video_id, currentPlayState.frame_number);
  };

  //------------------------------------------------
  // player keys and button control
  this.previousHit = function(){ self.playHit(false); };
  this.nextHit = function(){ self.playHit(true); };

  this.fastPlayBackward = function(){ self.skipFewFramesBack(); };
  this.fastPlayForward = function(){ self.skipFewFramesForward(); };

  this.startPlayback = function(){
    isVideoPaused = false;
    self.drawAnnotations.endAnnotation();
    self.multiVideoExtractor.playVideo();
    self.paintContinuous();
  };
  this.pausePlayback = function(){ self.frameNavigate(0); };
  this.togglePlay = function(){
    var toggled = isVideoPaused ? self.startPlayback() : self.pausePlayback();
  };

  this.nextFrame = function(){ self.frameNavigate(1); };
  this.previousFrame = function(){ self.frameNavigate(-1); };

  this.skipFewFramesForward = function(){ self.frameNavigate(10); };
  this.skipFewFramesBack = function(){ self.frameNavigate(-10); };

  // speed
  this.playFaster = function(){ 
    self.multiVideoExtractor.increasePlaybackRatePromise()
      .then(function(newSpeed){
        self.videoPlayerControls.setVideoPlaybackSpeed(newSpeed);
      });
  };
  this.playSlower = function(){ 
    self.multiVideoExtractor.reducePlaybackRatePromise()
      .then(function(newSpeed){
        self.videoPlayerControls.setVideoPlaybackSpeed(newSpeed);
      });
  };
  this.playNormal = function(){ 
    self.multiVideoExtractor.setPlaybackNormalPromise()
      .then(function(newSpeed){
        self.videoPlayerControls.setVideoPlaybackSpeed(newSpeed);
      });
  };

  // annotation
  this.deleteAnnotation = function(){ self.drawAnnotations.deleteAnnotation(); };

  //------------------------------------------------
  // navigation helpers
  this.frameNavigate = function(numOfFrames){
    if(!isVideoPaused){ isVideoPaused = true; }
    var currentPlayState = self.multiVideoExtractor.getCurrentState();
    var newPlayPos = self.dataManager.tChart_getNewPlayPosition(
      currentPlayState.video_id, currentPlayState.frame_number, numOfFrames);

    self.multiVideoExtractor.seekToVideoFrameNumber(newPlayPos.video_id, newPlayPos.frame_number);
    self.paintUntilPaused();
  };

  this.playHit = function(forwardDirection){
    if(!isVideoPaused){ isVideoPaused = true; }
    var currentPlayState = self.multiVideoExtractor.getCurrentState();
    var newPlayPos = self.dataManager.tChart_getHitPlayPosition(
      currentPlayState.video_id, currentPlayState.frame_number, forwardDirection);

    self.multiVideoExtractor.seekToVideoFrameNumber(newPlayPos.video_id, newPlayPos.frame_number);
    self.paintUntilPaused();
  }

  //------------------------------------------------
  // Event handling
  function frameNavigateAfterBrush(args){
    if(!isVideoPaused){ isVideoPaused = true; }

    self.multiVideoExtractor.seekToVideoFrameNumber(args.video_id, args.frame_number);
    self.paintUntilPaused();    
  };

  //------------------------------------------------
  // set relations
  this.setEventManager = function(em){
    self.eventManager = em;
    self.eventManager.addFrameNavigateCallback(frameNavigateAfterBrush);
    return self;
  };

  this.setDataManager = function(dm){
    self.dataManager = dm;

    self.drawLocalizations.setDataManager(self.dataManager);
    self.drawAnnotations.setDataManager(self.dataManager);
    self.drawHeatmap.setDataManager(self.dataManager);

    return self;
  };
};
