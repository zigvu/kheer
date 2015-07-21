var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.VideoHandler = Mining.VideoHandler || {};

/*
  This class handles all video player interactions.
*/

Mining.VideoHandler.VideoPlayer = function() {
  var self = this;

  this.canvas = document.getElementById("videoFrameCanvas");
  this.renderCTX = self.canvas.getContext("2d");

  this.eventManager = undefined;
  this.dataManager = undefined;
  this.frameNumberExtractor = new Mining.VideoHandler.FrameNumberExtractor(self.renderCTX);
  this.drawLocalizations = new Mining.FrameDisplay.DrawLocalizations();
  this.drawAnnotations = new Mining.FrameDisplay.DrawAnnotations();
  this.drawHeatmap = new Mining.FrameDisplay.DrawHeatmap();
  this.multiVideoExtractor = new Mining.VideoHandler.MultiVideoExtractor(self.renderCTX);

  this.videoPlayerControls = new Mining.VideoHandler.VideoPlayerControls(self);

  // pause behavior tracker
  var isVideoPaused = false;

  // returns promise that will be resolved once all videos are loaded
  this.loadClipsPromise = function(videoClipMap){ 
    return self.multiVideoExtractor.loadClipsPromise(videoClipMap); 
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
      self.drawAnnotations.startAnnotation(currentPlayState.clip_id, currentPlayState.clip_fn);
      currentPlayState.extracted_clip_fn = self.frameNumberExtractor.getCurrentFrameNumber();
      self.eventManager.firePaintFrameCallback(currentPlayState);
    }
  };

  // paint localizations
  this.paintFrameWithLocalization = function(){
    var currentPlayState = self.multiVideoExtractor.paintFrame();
    self.drawLocalizations.drawLocalizations(currentPlayState.clip_id, currentPlayState.clip_fn);
    // TODO: not working right now
    // self.drawAnnotations.drawAnnotations(currentPlayState.clip_id, currentPlayState.clip_fn);
    // only clear heatmap here - paint in another function
    self.drawHeatmap.clear();
    return currentPlayState;
  };

  this.paintHeatmap = function(){
    if(!isVideoPaused){ return; }
    var currentPlayState = self.multiVideoExtractor.getCurrentState();
    self.drawHeatmap.drawHeatmap(currentPlayState.clip_id, currentPlayState.clip_fn);
  };

  this.drawAllLocalizations = function(){
    if(!isVideoPaused){ return; }
    var currentPlayState = self.multiVideoExtractor.getCurrentState();
    self.drawLocalizations.drawAllLocalizations(currentPlayState.clip_id, currentPlayState.clip_fn);
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

  this.skipFewFramesForward = function(){ self.frameNavigate(5); };
  this.skipFewFramesBack = function(){ self.frameNavigate(-5); };

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
      currentPlayState.clip_id, currentPlayState.clip_fn, numOfFrames);

    self.multiVideoExtractor.seekToClipIdClipFN(newPlayPos.clip_id, newPlayPos.clip_fn);
    self.paintUntilPaused();
  };

  this.playHit = function(forwardDirection){
    if(!isVideoPaused){ isVideoPaused = true; }
    var currentPlayState = self.multiVideoExtractor.getCurrentState();
    var newPlayPos = self.dataManager.tChart_getHitPlayPosition(
      currentPlayState.clip_id, currentPlayState.clip_fn, forwardDirection);

    self.multiVideoExtractor.seekToClipIdClipFN(newPlayPos.clip_id, newPlayPos.clip_fn);
    self.paintUntilPaused();
  }

  //------------------------------------------------
  // Event handling
  function frameNavigateAfterBrush(args){
    if(!isVideoPaused){ isVideoPaused = true; }

    self.multiVideoExtractor.seekToClipIdClipFN(args.clip_id, args.clip_fn);
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
