var ZIGVU = ZIGVU || {};
ZIGVU.VideoHandler = ZIGVU.VideoHandler || {};

/*
  This class handles all video player interactions.
*/

ZIGVU.VideoHandler.VideoPlayer = function(videoFrameCanvas) {
  var _this = this;
  this.renderCTX = videoFrameCanvas.getContext("2d");

  this.dataManager = undefined;
  this.drawLocalizations = new ZIGVU.FrameDisplay.DrawLocalizations(videoFrameCanvas);
  this.drawingHandler = new ZIGVU.FrameDisplay.DrawingHandler(videoFrameCanvas);
  this.multiVideoExtractor = new ZIGVU.VideoHandler.MultiVideoExtractor(this.renderCTX);

  // returns promise that will be resolved once all videos are loaded
  this.loadVideosPromise = function(videoDataMap){ 
    return this.multiVideoExtractor.loadVideosPromise(videoDataMap); 
  }

  this.playContinuous = function(){
    if(_this.multiVideoExtractor.isVideoPaused()){ return; }

    var result = _this.paintFrame();
    if(result.status === 'ended'){ return; }

    // schedule to run again in a short time
    // Note: requestAnimationFrame tends to skip frames where as setTimeout
    // seems to skip less
    // requestAnimationFrame(_this.playContinuous);
    setTimeout(function(){ _this.playContinuous(); }, 20);
  };

  this.playUntilSeekEnd = function(){
    if(!_this.multiVideoExtractor.isVideoPaused()){ return; }

    var result = _this.paintFrame();
    if(result.status === 'seeking'){ 
      // schedule to run again in a short time
      setTimeout(function(){ _this.playUntilSeekEnd(); }, 100);
    } else if(result.status === 'seeked'){
      _this.drawingHandler.startAnnotation(result.video_id, result.frame_number);

      console.log("Seek ended!");
    }
  };

  // returns status of painting from inner class
  this.paintFrame = function(){
    var result = this.multiVideoExtractor.paintFrame();

    if(result.status !== 'ended'){ 
      this.drawLocalizations.drawBboxes(result.video_id, result.frame_number);
      console.log('Frame number: ' + result.frame_number);
    }
    return result;
  };

  // player button control
  this.firstVideo = function(){
    console.log("firstVideo");
  };

  this.fastPlayBackward = function(){
    _this.skipFewFramesBack();
  };

  this.pausePlayback = function(){
    console.log("pausePlayback");
    this.frameNavigate(0);
  };

  this.startPlayback = function(){
    console.log("startPlayback");
    this.drawingHandler.endAnnotation();
    this.multiVideoExtractor.setVideoPaused(false);
    this.playContinuous();
  };

  this.fastPlayForward = function(){
    _this.skipFewFramesForward();
  };

  this.lastVideo = function(){
    console.log("lastVideo");
  };

  // key controls
  this.togglePlay = function(){
    console.log("togglePlay");
    if(this.multiVideoExtractor.isVideoPaused()){ 
      this.startPlayback();
    } else {
      this.pausePlayback();
    }
  };

  this.nextFrame = function(){
    console.log("nextFrame");
    this.frameNavigate(1);
  };

  this.previousFrame = function(){
    console.log("previousFrame");
    this.frameNavigate(-1);
  };

  this.skipFewFramesForward = function(){
    console.log("skipFewFramesForward");
    this.frameNavigate(10);
  };

  this.skipFewFramesBack = function(){
    console.log("skipFewFramesBack");
    this.frameNavigate(-10);
  };

  this.frameNavigate = function(numOfFrames){
    if(!this.multiVideoExtractor.isVideoPaused()){ 
      this.multiVideoExtractor.setVideoPaused(true);
    }
    this.multiVideoExtractor.setTimeForNumFrames(numOfFrames);
    this.playUntilSeekEnd();
  };

  // speed
  this.playFaster = function(){
    console.log("playFaster");
    this.multiVideoExtractor.increasePlaybackRate();
  };

  this.playSlower = function(){
    console.log("playSlower");
    this.multiVideoExtractor.reducePlaybackRate();
  };

  this.playNormal = function(){
    console.log("playNormal");
    this.multiVideoExtractor.setPlaybackNormal();
  };

  // annotation
  this.deleteAnnotation = function(){
    this.drawingHandler.deleteAnnotation();
    console.log("deleteAnnotation");
  };


  // set relations
  this.setDataManager = function(dm){
    this.dataManager = dm;
    this.drawLocalizations.setDataManager(this.dataManager);
    this.drawingHandler.setDataManager(this.dataManager);
    return this;
  };
};
