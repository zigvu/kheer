var ZIGVU = ZIGVU || {};
ZIGVU.VideoHandler = ZIGVU.VideoHandler || {};

/*
  This class handles extracting frames from multiple videos.
*/

ZIGVU.VideoHandler.MultiVideoExtractor = function(renderCTX) {
  var _this = this;

  // ----------------------------------------------
  // Load/unload videos and construct objects
  this.videoFrameObjects = {};

  this.loadVideosPromise = function(videoDataMap){
    var loadPromises = [], prevVideoId = undefined;
    _.each(videoDataMap, function(videoData){
      var videoId = videoData.video_id;
      if (prevVideoId !== undefined){
        _this.videoFrameObjects[prevVideoId].next_video_id = videoId;
      }

      var videoFrameExtractor = new ZIGVU.VideoHandler.VideoFrameExtractor(renderCTX);
      var videoLoadPromise = videoFrameExtractor.loadVideoPromise(videoData.video_URL);
      _this.videoFrameObjects[videoId] = {
        vfe: videoFrameExtractor,
        frame_rate: videoData.frame_rate,
        previous_video_id: prevVideoId
      };
      prevVideoId = videoId;

      // push promises
      loadPromises.push(videoLoadPromise);
    });
    _this.videoFrameObjects[prevVideoId].next_video_id = undefined;
    currentVideoId = Object.keys(this.videoFrameObjects)[0];
  
    // return a promise that consolidates all load promises
    return Q.all(loadPromises);
  };

  // unload old videos
  this.unloadVideos = function(){
    this.videoFrameObjects = {};
  };
  // ----------------------------------------------


  // ----------------------------------------------
  // playback of frames
  var currentVideoId, currentFrameNumber, currentFrameTime = 0;
  var videoPaused = false;
  var currentlySeekingState = 'playing'; // 'seeking', 'seeked'

  this.setVideoPaused = function(vp){ 
    videoPaused = vp;

    var vfo = this.videoFrameObjects[currentVideoId];
    if(vfo.vfe.isPlaying() && videoPaused){
      currentlySeekingState = 'seeking';
      vfo.vfe.pausePromise()
        .then(function(){ currentlySeekingState = 'seeked'; })
        .catch(function (errorReason) { _this.err(errorReason); });
    } else if(!vfo.vfe.isPlaying() && !videoPaused){
      currentlySeekingState = 'seeking';
      vfo.vfe.playPromise()
        .then(function(){ currentlySeekingState = 'playing'; })
        .catch(function (errorReason) { _this.err(errorReason); });
    }
  };

  this.isVideoPaused = function(){ return videoPaused; };

  this.paintFrame = function(){
    var result = this.playNextFrame();
    if(result === 'ended'){
      return { status: 'ended' };
    } 
    var vfo = this.videoFrameObjects[currentVideoId];
    currentFrameTime = vfo.vfe.paintFrame();
    currentFrameNumber = Math.round(currentFrameTime * vfo.frame_rate);
    return {
      status: result,
      video_id: currentVideoId,
      frame_time: currentFrameTime,
      frame_number: currentFrameNumber
    };
  };

  this.playNextFrame = function(){
    if(currentlySeekingState !== 'playing'){ return currentlySeekingState; }

    var vfo = this.videoFrameObjects[currentVideoId];
    // if current video has ended
    if(vfo.vfe.hasEnded()){
      var nextVideoId = vfo.next_video_id
      // if there are no more videos, we are done playing
      if(nextVideoId === undefined){ return 'ended'; }
      // else, we can go to next video
      this.setVideo(nextVideoId);
    }

    // seeking video
    if(currentlySeekingState !== 'playing'){ return currentlySeekingState; }
    return 'ok';
  };

  this.setVideo = function(videoId){
    currentVideoId = videoId;
    currentFrameTime = 0;

    currentlySeekingState = 'seeking';
    var vfe = this.videoFrameObjects[currentVideoId].vfe;
    vfe.seekFramePromise(currentFrameTime)
      .then(function(){ return vfe.playbackRatePromise(playBackSpeed) })
      .then(function(){ currentlySeekingState = 'seeked'; })
      .catch(function (errorReason) { _this.err(errorReason); });
  };

  // numOfFrames is positive for forward play and negative for backwards
  this.setTimeForNumFrames = function(numOfFrames){
    var vfo = this.videoFrameObjects[currentVideoId];
    currentFrameTime += (numOfFrames/vfo.frame_rate);
    if(currentFrameTime < 0){ currentFrameTime = 0; }

    // seek
    currentlySeekingState = 'seeking';
    vfo.vfe.seekFramePromise(currentFrameTime)
      .then(function(ct){ 
        currentFrameTime = ct;
        currentlySeekingState = 'seeked';
      })
      .catch(function (errorReason) { _this.err(errorReason); });
  };

  // this.seekFramePromise = function(videoId, frameNumber){
  //   var vfo = this.videoFrameObjects[videoId];
  //   // conversion to frame time
  //   var frameTime = frameNumber / vfo.frame_rate;
  //   var framePromise = vfo.vfe.seekFramePromise(frameTime);
  //   return framePromise;
  // };

  // ----------------------------------------------
  // playback rate settings
  var playBackSpeed = 1.0;
  var playbackRateMax = 4.0, playbackRateMin = 0.0;

  this.setPlaybackNormal = function(){
    playBackSpeed = 1.0;
    this.setPlaybackRate(playBackSpeed);
  };

  this.reducePlaybackRate = function(){
    var newPlaybackSpeed = playBackSpeed - this.getPlaybackRateStep();
    if(newPlaybackSpeed >= playbackRateMin){ this.setPlaybackRate(newPlaybackSpeed); }
  };

  this.increasePlaybackRate = function(){
    var newPlaybackSpeed = playBackSpeed + this.getPlaybackRateStep();
    if(newPlaybackSpeed <= playbackRateMax){ this.setPlaybackRate(newPlaybackSpeed); }
  };

  this.setPlaybackRate = function(newPlaybackSpeed){
    currentlySeekingState = 'seeking';
    var vfe = this.videoFrameObjects[currentVideoId].vfe;
    vfe.playbackRatePromise(newPlaybackSpeed)
      .then(function(pbr){ 
        playBackSpeed = pbr;
        console.log("Playback speed: " + playBackSpeed);
        currentlySeekingState = 'seeked';
      })
      .catch(function (errorReason) { _this.err(errorReason); });
  };

  this.getPlaybackRateStep = function(){
    var playbackRateStep = 0.2;
    if (playBackSpeed >= 2){
      playbackRateStep = 0.4;
    } else if (playBackSpeed >= 1 && playBackSpeed < 2){
      playbackRateStep = 0.2;
    } else if (playBackSpeed >= 0.4 && playBackSpeed < 1.0){
      playbackRateStep = 0.1;
    } else {
      playbackRateStep = 0.05;
    }
    return playbackRateStep;
  };


  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.VideoHandler.MultiVideoExtractor -> ' + errorReason);
  };

};