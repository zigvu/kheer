var ZIGVU = ZIGVU || {};
ZIGVU.VideoHandler = ZIGVU.VideoHandler || {};

/*
  This class handles extracting a frame from a single video.
*/

ZIGVU.VideoHandler.VideoFrameExtractor = function(renderCTX) {
  var self = this;
  var seekFrameDefer, playDefer, pauseDefer, playbackRateDefer;

  // Load a video
  this.loadVideoPromise = function(videoSrc){
    // load video and immediately pause it
    var videoElement = $('<video src="' + videoSrc + '" autoplay class="hidden"></video>');
    self.video = videoElement.get(0);
    self.video.pause();

    // we return a promise immediately from this function and resolve
    // it based on event firing on load success/failure
    var videoReadDefer = Q.defer();

    // if error, reject the promise
    self.video.addEventListener('error', function(){
      return videoReadDefer.reject("ZIGVU.VideoHandler.VideoFrameExtractor -> " + 
        "Video can't be loaded. Src: " + videoSrc);
    });

    // notify caller when video is "loaded" and "seekable" by resolving promise
    self.video.addEventListener('canplaythrough', function() {
      self.width = self.video.videoWidth;
      self.height = self.video.videoHeight;

      return videoReadDefer.resolve(true);
    }, false);

    // send caller a frame when seek has ended
    self.video.addEventListener('seeked', function(){
      renderCTX.drawImage(self.video, 0, 0, self.width, self.height);
      seekFrameDefer.resolve(self.video.currentTime);
    });

    // notify caller when play has resumed
    self.video.addEventListener('play', function(){
      if(playDefer === undefined){ return; }
      playDefer.resolve(self.video.currentTime);
    });

    // notify caller when play has paused
    self.video.addEventListener('pause', function(){
      if(pauseDefer === undefined){ return; }
      pauseDefer.resolve(self.video.currentTime);
    });

    // notify caller when playback rate has changed
    self.video.addEventListener('ratechange', function(){
      if(playbackRateDefer === undefined){ return; }
      playbackRateDefer.resolve(self.video.playbackRate);
    });

    return videoReadDefer.promise;
  };

  this.hasEnded = function(){ return self.video.ended; };
  this.currentTime = function(){ return self.video.currentTime; };
  this.isPlaying = function(){ return !self.video.paused; }
  
  this.paintFrame = function(){
    renderCTX.drawImage(self.video, 0, 0, self.width, self.height);
    return self.video.currentTime;
  };

  // get a promise that will resolve when seek ends
  this.seekFramePromise = function(ft){
    seekFrameDefer = Q.defer();
    self.video.currentTime = ft;
    return seekFrameDefer.promise;
  };

  // get a promise that will resolve when play begins
  this.playPromise = function(){
    playDefer = Q.defer();
    self.video.play();
    return playDefer.promise;
  };

  // get a promise that will resolve when pause begins
  this.pausePromise = function(){
    pauseDefer = Q.defer();
    self.video.pause();
    return pauseDefer.promise;
  };

  // get a promise that will resolve when seek ends
  this.playbackRatePromise = function(rt){
    playbackRateDefer = Q.defer();
    self.video.playbackRate = rt;
    return playbackRateDefer.promise;
  };

};

