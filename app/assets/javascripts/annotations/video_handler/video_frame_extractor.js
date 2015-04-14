var ZIGVU = ZIGVU || {};
ZIGVU.VideoHandler = ZIGVU.VideoHandler || {};

/*
  This class handles extracting a frame from a single video.
*/

ZIGVU.VideoHandler.VideoFrameExtractor = function(renderCTX) {
  var _this = this;
  var seekFrameDefer, playDefer, pauseDefer, playbackRateDefer;

  // Load a video
  this.loadVideoPromise = function(videoSrc){
    // load video and immediately pause it
    var videoElement = $('<video src="' + videoSrc + '" autoplay class="hidden"></video>');
    this.video = videoElement.get(0);
    this.video.pause();

    // we return a promise immediately from this function and resolve
    // it based on event firing on load success/failure
    var videoReadDefer = Q.defer();

    // if error, reject the promise
    this.video.addEventListener('error', function(){
      return videoReadDefer.reject("ZIGVU.VideoHandler.VideoFrameExtractor -> " + 
        "Video can't be loaded. Src: " + videoSrc);
    });

    // notify caller when video is "loaded" and "seekable" by resolving promise
    this.video.addEventListener('canplaythrough', function() {
      _this.width = _this.video.videoWidth;
      _this.height = _this.video.videoHeight;

      return videoReadDefer.resolve(true);
    }, false);

    // send caller a frame when seek has ended
    this.video.addEventListener('seeked', function(){
      renderCTX.drawImage(_this.video, 0, 0, _this.width, _this.height);
      seekFrameDefer.resolve(_this.video.currentTime);
    });

    // notify caller when play has resumed
    this.video.addEventListener('play', function(){
      if(playDefer === undefined){ return; }
      playDefer.resolve(_this.video.currentTime);
    });

    // notify caller when play has paused
    this.video.addEventListener('pause', function(){
      if(pauseDefer === undefined){ return; }
      pauseDefer.resolve(_this.video.currentTime);
    });

    // notify caller when playback rate has changed
    this.video.addEventListener('ratechange', function(){
      if(playbackRateDefer === undefined){ return; }
      playbackRateDefer.resolve(_this.video.playbackRate);
    });

    return videoReadDefer.promise;
  };

  this.hasEnded = function(){ return this.video.ended; };
  this.currentTime = function(){ return this.video.currentTime; };
  this.isPlaying = function(){ return !this.video.paused; }
  
  this.paintFrame = function(){
    renderCTX.drawImage(this.video, 0, 0, this.width, this.height);
    return this.video.currentTime;
  };

  // get a promise that will resolve when seek ends
  this.seekFramePromise = function(ft){
    seekFrameDefer = Q.defer();
    this.video.currentTime = ft;
    return seekFrameDefer.promise;
  };

  // get a promise that will resolve when play begins
  this.playPromise = function(){
    playDefer = Q.defer();
    this.video.play();
    return playDefer.promise;
  };

  // get a promise that will resolve when pause begins
  this.pausePromise = function(){
    pauseDefer = Q.defer();
    this.video.pause();
    return pauseDefer.promise;
  };

  // get a promise that will resolve when seek ends
  this.playbackRatePromise = function(rt){
    playbackRateDefer = Q.defer();
    this.video.playbackRate = rt;
    return playbackRateDefer.promise;
  };

};

