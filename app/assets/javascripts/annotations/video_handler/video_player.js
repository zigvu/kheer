var ZIGVU = ZIGVU || {};
ZIGVU.VideoHandler = ZIGVU.VideoHandler || {};

/*
  This class handles all video player interactions.
*/

ZIGVU.VideoHandler.VideoPlayer = function(videoFrameCanvas) {
  var self = this;
  this.renderCTX = videoFrameCanvas.getContext("2d");

  this.dataManager = undefined;
  this.drawLocalizations = new ZIGVU.FrameDisplay.DrawLocalizations(videoFrameCanvas);
  this.drawingHandler = new ZIGVU.FrameDisplay.DrawingHandler(videoFrameCanvas);
  this.multiVideoExtractor = new ZIGVU.VideoHandler.MultiVideoExtractor(self.renderCTX);

  // returns promise that will be resolved once all videos are loaded
  this.loadVideosPromise = function(videoDataMap){ 
    return self.multiVideoExtractor.loadVideosPromise(videoDataMap); 
  }

  this.playContinuous = function(){
    if(self.multiVideoExtractor.isVideoPaused()){ return; }

    var result = self.paintFrame();
    if(result.status === 'ended'){ return; }

    // schedule to run again in a short time
    // Note: requestAnimationFrame tends to skip frames where as setTimeout
    // seems to skip less
    // requestAnimationFrame(self.playContinuous);
    setTimeout(function(){ self.playContinuous(); }, 20);
  };

  this.playUntilSeekEnd = function(){
    if(!self.multiVideoExtractor.isVideoPaused()){ return; }

    var result = self.paintFrame();
    if(result.status === 'seeking'){ 
      // schedule to run again in a short time
      setTimeout(function(){ self.playUntilSeekEnd(); }, 20);
    } else if(result.status === 'seeked'){
      self.drawingHandler.startAnnotation(result.video_id, result.frame_number);

      console.log("Seek ended!");
    }
  };

  // returns status of painting from inner class
  this.paintFrame = function(){
    var result = self.multiVideoExtractor.paintFrame();

    if(result.status !== 'ended'){ 
      self.drawLocalizations.drawBboxes(result.video_id, result.frame_number);
      console.log('Frame number: ' + result.frame_number);
    }
    return result;
  };

  // player button control
  this.firstVideo = function(){
    console.log("firstVideo");
  };

  this.fastPlayBackward = function(){
    self.skipFewFramesBack();
  };

  this.pausePlayback = function(){
    console.log("pausePlayback");
    self.frameNavigate(0);
  };

  this.startPlayback = function(){
    console.log("startPlayback");
    self.drawingHandler.endAnnotation();
    self.multiVideoExtractor.setVideoPaused(false);
    self.playContinuous();
  };

  this.fastPlayForward = function(){
    self.skipFewFramesForward();
  };

  this.lastVideo = function(){
    console.log("lastVideo");
  };

  // key controls
  this.togglePlay = function(){
    console.log("togglePlay");
    if(self.multiVideoExtractor.isVideoPaused()){ 
      self.startPlayback();
    } else {
      self.pausePlayback();
    }
  };

  this.nextFrame = function(){
    console.log("nextFrame");
    self.frameNavigate(1);
  };

  this.previousFrame = function(){
    console.log("previousFrame");
    self.frameNavigate(-1);
  };

  this.skipFewFramesForward = function(){
    console.log("skipFewFramesForward");
    self.frameNavigate(10);
  };

  this.skipFewFramesBack = function(){
    console.log("skipFewFramesBack");
    self.frameNavigate(-10);
  };

  this.frameNavigate = function(numOfFrames){
    if(!self.multiVideoExtractor.isVideoPaused()){ 
      self.multiVideoExtractor.setVideoPaused(true);
    }
    self.multiVideoExtractor.setTimeForNumFrames(numOfFrames);
    self.playUntilSeekEnd();
  };

  // speed
  this.playFaster = function(){
    console.log("playFaster");
    self.multiVideoExtractor.increasePlaybackRate();
  };

  this.playSlower = function(){
    console.log("playSlower");
    self.multiVideoExtractor.reducePlaybackRate();
  };

  this.playNormal = function(){
    console.log("playNormal");
    self.multiVideoExtractor.setPlaybackNormal();
  };

  // annotation
  this.deleteAnnotation = function(){
    self.drawingHandler.deleteAnnotation();
    console.log("deleteAnnotation");
  };


  // set relations
  this.setDataManager = function(dm){
    self.dataManager = dm;
    self.drawLocalizations.setDataManager(self.dataManager);
    self.drawingHandler.setDataManager(self.dataManager);
    return self;
  };
};
