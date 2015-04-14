var ZIGVU = ZIGVU || {};
ZIGVU.VideoHandler = ZIGVU.VideoHandler || {};

/*
  This class handles all video player interactions.
*/

ZIGVU.VideoHandler.VideoPlayer = function(renderCTX) {
  var _this = this;
  var videoFrameCanvasId = "videoFrameCanvas";
  this.annotationController = undefined;
  this.dataManager = undefined;
  this.drawLocalizations = undefined;
  this.drawingHandler = undefined;
  this.multiVideoExtractor = new ZIGVU.VideoHandler.MultiVideoExtractor(renderCTX);

  // returns promise that will be resolved once all videos are loaded
  this.loadVideosPromise = function(videoDataMap){ 
    return this.multiVideoExtractor.loadVideosPromise(videoDataMap); 
  }

  this.playContinuous = function(){
    if(this.multiVideoExtractor.isVideoPaused()){ return; }

    var result = _this.paintFrame();
    if(result.status === 'ended'){ return; }

    // schedule to run again in a short time
    setTimeout(function(){ _this.playContinuous(); }, 20);
  };

  this.playUntilSeekEnd = function(){
    if(!this.multiVideoExtractor.isVideoPaused()){ return; }

    var result = _this.paintFrame();
    if(result.status === 'seeking'){ 
      // schedule to run again in a short time
      setTimeout(function(){ _this.playUntilSeekEnd(); }, 100);
    }
  };

  // returns status of painting from inner class
  this.paintFrame = function(){
    var result = this.multiVideoExtractor.paintFrame();

    if(result.status !== 'ended'){ 
      var localizations = this.dataManager.getLocalizations(result.video_id, result.frame_number);
      this.drawLocalizations.drawBboxes(localizations);
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
    this.multiVideoExtractor.setVideoPaused(true);
    this.drawingHandler.setAnnotationMode(true);
  };

  this.startPlayback = function(){
    console.log("startPlayback");
    this.drawingHandler.setAnnotationMode(false);
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
    if(!this.multiVideoExtractor.isVideoPaused()){ this.pausePlayback(); }
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
  this.startAnnotation = function(){
    console.log("startAnnotation");
  };

  this.saveAnnotation = function(){
    console.log("saveAnnotation");
  };

  this.deleteAnnotation = function(){
    console.log("deleteAnnotation");
  };

  this.annotationController = function(annotationController){
    _this.annotationController = annotationController;
    _this.dataManager = _this.annotationController.dataManager;
    _this.drawLocalizations = _this.annotationController.drawLocalizations;
    _this.drawingHandler = _this.annotationController.drawingHandler;

    return _this;
  };
};
