var ZIGVU = ZIGVU || {};
ZIGVU.VideoHandler = ZIGVU.VideoHandler || {};

/*
  This class handles extracting frames from multiple videos.
*/

ZIGVU.VideoHandler.MultiVideoExtractor = function(renderCTX) {
  var self = this;

  // ----------------------------------------------
  // Load/unload videos and construct objects
  this.videoFrameObjects = {};

  this.loadVideosPromise = function(videoDataMap){
    var loadPromises = [], prevVideoId = undefined;
    var sortedVideoIds = _.map(Object.keys(videoDataMap), function(dId){ return parseInt(dId); });
    sortedVideoIds = _.sortBy(sortedVideoIds, function(dId){ return dId; });

    _.each(sortedVideoIds, function(videoId){
      var videoData = videoDataMap[videoId];
      
      if (prevVideoId !== undefined){
        self.videoFrameObjects[prevVideoId].next_video_id = videoId;
      }

      var videoFrameExtractor = new ZIGVU.VideoHandler.VideoFrameExtractor(renderCTX);
      var videoLoadPromise = videoFrameExtractor.loadVideoPromise(videoData.video_url);
      self.videoFrameObjects[videoId] = {
        vfe: videoFrameExtractor,
        playback_frame_rate: videoData.playback_frame_rate,
        previous_video_id: prevVideoId
      };
      prevVideoId = videoId;

      // push promises
      loadPromises.push(videoLoadPromise);
    });
    self.videoFrameObjects[prevVideoId].next_video_id = undefined;
    firstVideoId = sortedVideoIds[0];
    currentVideoId = sortedVideoIds[0];
  
    // return a promise that consolidates all load promises
    return Q.all(loadPromises);
  };

  // unload old videos
  this.unloadVideos = function(){
    self.videoFrameObjects = {};
  };
  // ----------------------------------------------


  // ----------------------------------------------
  // playback of frames
  var firstVideoId, currentVideoId, currentFrameTime = 0;
  var videoPaused = false;
  var currentPlayState = 'playing'; // 'seeking', 'ended', 'paused'

  this.pauseVideo = function(){
    var vfo = self.videoFrameObjects[currentVideoId];
    if(vfo.vfe.isPlaying()){
      currentPlayState = 'seeking';
      vfo.vfe.pausePromise()
        .then(function(){ currentPlayState = 'paused'; })
        .catch(function (errorReason) { self.err(errorReason); });
    }
  };

  this.playVideo = function(){
    var vfo = self.videoFrameObjects[currentVideoId];
    if(!vfo.vfe.isPlaying()){
      if(currentPlayState === 'ended'){
        // restart from begining
        currentPlayState = 'seeking';
        self.setVideoPromise(firstVideoId, 0)
          .then(function(){ currentPlayState = 'playing'; })
          .catch(function (errorReason) { self.err(errorReason); });
      } else {
        currentPlayState = 'seeking';
        vfo.vfe.playPromise()
          .then(function(){ currentPlayState = 'playing'; })
          .catch(function (errorReason) { self.err(errorReason); });
      }
    }
  };

  this.isVideoPlaying = function(){ return currentPlayState === 'playing'; };

  this.paintFrame = function(){
    self.seekToNextVideoIfNeeded();

    var vfo = self.videoFrameObjects[currentVideoId];
    currentFrameTime = vfo.vfe.paintFrame();
    return self.getCurrentState();
  };

  this.getCurrentState = function(){
    var vfo = self.videoFrameObjects[currentVideoId];
    var currentFrameNumber = Math.round(currentFrameTime * vfo.playback_frame_rate);

    return {
      play_state: currentPlayState,
      video_id: currentVideoId,
      frame_time: currentFrameTime,
      frame_number: currentFrameNumber
    };
  };

  this.seekToNextVideoIfNeeded = function(){
    // only if in playing state
    if(currentPlayState === 'playing'){
      var vfo = self.videoFrameObjects[currentVideoId];
      // if current video has ended
      if(vfo.vfe.hasEnded()){
        var nextVideoId = vfo.next_video_id
        // if there are no more videos, we are done playing
        if(nextVideoId === undefined){ currentPlayState = 'ended'; return; }
        // else, we can go to next video
        currentPlayState = 'seeking';
        self.setVideoPromise(nextVideoId, 0)
          .then(function(){ currentPlayState = 'playing'; })
          .catch(function (errorReason) { self.err(errorReason); });
      }
    }
  };

  this.setVideoPromise = function(videoId, frameTime){
    currentVideoId = videoId;
    currentFrameTime = frameTime;

    var previousPlayState = currentPlayState;
    currentPlayState = 'seeking';
    var vfe = self.videoFrameObjects[currentVideoId].vfe;
    var sfp = vfe.seekFramePromise(currentFrameTime)
      .then(function(){ return vfe.playbackRatePromise(playBackSpeed) });;

    return sfp;
  };

  this.seekToVideoFrameNumber = function(videoId, frameNumber){
    if(videoId != currentVideoId){
      // TBD
    } else {
      var vfo = self.videoFrameObjects[currentVideoId];
      currentFrameTime = frameNumber / vfo.playback_frame_rate;
      if(currentFrameTime < 0){ currentFrameTime = 0; }

      currentPlayState = 'seeking';
      if(vfo.vfe.isPlaying()){
        vfo.vfe.pausePromise()
          .then(function(){ return vfo.vfe.seekFramePromise(currentFrameTime); })
          .then(function(ct){ currentFrameTime = ct; currentPlayState = 'paused'; })
          .catch(function (errorReason) { self.err(errorReason); });
      } else {
        vfo.vfe.seekFramePromise(currentFrameTime)
          .then(function(ct){ currentFrameTime = ct; currentPlayState = 'paused'; })
          .catch(function (errorReason) { self.err(errorReason); });
      }
    }
  };

  // ----------------------------------------------
  // playback rate settings
  var playBackSpeed = 1.0;
  var playbackRateMax = 4.0, playbackRateMin = 0.0;

  this.setPlaybackNormal = function(){
    playBackSpeed = 1.0;
    self.setPlaybackRate(playBackSpeed);
  };

  this.reducePlaybackRate = function(){
    var newPlaybackSpeed = playBackSpeed - self.getPlaybackRateStep();
    if(newPlaybackSpeed >= playbackRateMin){ self.setPlaybackRate(newPlaybackSpeed); }
  };

  this.increasePlaybackRate = function(){
    var newPlaybackSpeed = playBackSpeed + self.getPlaybackRateStep();
    if(newPlaybackSpeed <= playbackRateMax){ self.setPlaybackRate(newPlaybackSpeed); }
  };

  this.setPlaybackRate = function(newPlaybackSpeed){
    // currentPlayState = 'seeking';
    var vfe = self.videoFrameObjects[currentVideoId].vfe;
    vfe.playbackRatePromise(newPlaybackSpeed)
      .then(function(pbr){ 
        playBackSpeed = pbr;
        console.log("Playback speed: " + playBackSpeed);
        // currentPlayState = 'seeked';
      })
      .catch(function (errorReason) { self.err(errorReason); });
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