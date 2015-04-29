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
      .then(function(){ return vfe.playbackRatePromise(playbackSpeed); });

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
  var playbackSpeed = 1.0;
  var playbackRatesArr = [0.25,0.33,0.5,0.67, 1.0, 1.5,2.0,3.0,4.0];
  var playbackRatesArrIdx = 4, playbackRatesArrIdx_normal = 4;

  this.setPlaybackNormalPromise = function(){
    playbackRatesArrIdx = playbackRatesArrIdx_normal;
    return self.setPlaybackPromise(playbackRatesArrIdx);
  };

  this.reducePlaybackRatePromise = function(){
    playbackRatesArrIdx--;
    if(playbackRatesArrIdx < 0){ playbackRatesArrIdx = 0; }
    return self.setPlaybackPromise(playbackRatesArrIdx);
  };

  this.increasePlaybackRatePromise = function(){
    playbackRatesArrIdx++;
    if(playbackRatesArrIdx >= playbackRatesArr.length){ 
      playbackRatesArrIdx = playbackRatesArr.length - 1; 
    }
    return self.setPlaybackPromise(playbackRatesArrIdx);
  };

  this.setPlaybackPromise = function(newPlaybackRatesArrIdx){
    var speedChangeDefer = Q.defer();

    var newPlaybackSpeed = playbackRatesArr[newPlaybackRatesArrIdx];
    // note - sometimes, needs consecutive calls to have
    // normal playback speed - so no protection with checking
    // current speed
    var vfe = self.videoFrameObjects[currentVideoId].vfe;
    vfe.playbackRatePromise(newPlaybackSpeed)
      .then(function(pbr){ 
        playbackSpeed = pbr;
        speedChangeDefer.resolve(playbackSpeed);
      })
      .catch(function (errorReason) { self.err(errorReason); });      
    return speedChangeDefer.promise;
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.VideoHandler.MultiVideoExtractor -> ' + errorReason);
  };

};