var ZIGVU = ZIGVU || {};
ZIGVU.FrameDisplay = ZIGVU.FrameDisplay || {};

/*
  Handler to draw information overlay on top of canvas.
  Note:
    Convention is to use left hand side of canvas to draw persistent
    overlays and right hand side of canvas to draw ephemral overlays
*/

ZIGVU.FrameDisplay.DrawInfoOverlay = function() {
  var self = this;

  this.canvas = document.getElementById("infoOverlayCanvas");
  this.ctx = self.canvas.getContext("2d");

  this.dataManager = undefined;
  this.eventManager = undefined;

  // format of drawn objects in displayed bucket
  // {x:, y:, w:, h:, text:, type:, status:}
  // where: 
  // type = ['text-small', 'text-medium', 'text-large']
  // status = ['ok', 'error']
  this.persistentOverlays = [];
  this.ephemeralOverlays = [];

  var overlays = new ZIGVU.FrameDisplay.Shapes.Overylays();

  function updateStatusFromVideoPlayer(args){
    self.clearPersistentOverlays();

    var videoState = self.dataManager.getData_videoState(args);
    var vsc = videoState.current,
        vsp = videoState.previous;

    var frameNumberText = vsc.extracted_video_fn;
    if(vsc.is_evaluated_frame){ frameNumberText += ' #'; }
    var frameNumbersMatch = (vsc.extracted_video_fn == vsc.video_fn);
    self.add_frameNumber(frameNumberText, frameNumbersMatch)


    self.drawOverlays(self.persistentOverlays);
  };

  this.add_frameNumber = function(frameNumberText, frameNumbersMatch){
    var status = frameNumbersMatch ? 'ok' : 'error';
    this.persistentOverlays.push({
      x: 5, y: 5, w: 200, h: 50,
      text: frameNumberText,
      type: 'text-medium',
      status: status
    });
  };

  this.drawOverlays = function(overlayBucket){
    _.each(overlayBucket, function(d){ overlays.draw(self.ctx, d); });
  };

  this.clearPersistentOverlays = function(){
    self.clearOverlays(self.persistentOverlays);
    self.persistentOverlays = [];
  };

  this.clearEphemeralOverlays = function(){
    self.clearOverlays(self.ephemeralOverlays);
    self.ephemeralOverlays = [];
  };

  this.clearOverlays = function(overlayBucket){
    if(overlayBucket.length > 0){
      // since clearRect is expensive, do in one shot with smallest rect
      var x0 = self.canvas.width, y0 = self.canvas.height, x3 = 0, y3 = 0;
      _.each(overlayBucket, function(d){
        if(d.x < x0){ x0 = d.x; }
        if(d.y < x0){ x0 = d.y; }
        if((d.x + d.w) > x3){ x3 = (d.x + d.w); }
        if((d.y + d.h) > y3){ y3 = (d.y + d.h); }
      });
      self.ctx.clearRect(x0, x0, x3, y3);
      overlayBucket = [];
    }
  };

  // set relations
  this.setEventManager = function(em){
    self.eventManager = em;
    self.eventManager.addPaintFrameCallback(updateStatusFromVideoPlayer);
    return self;
  };

  this.setDataManager = function(dm){
    self.dataManager = dm;
    return self;
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.FrameDisplay.DrawInfoOverlay -> ' + errorReason);
  };
};
