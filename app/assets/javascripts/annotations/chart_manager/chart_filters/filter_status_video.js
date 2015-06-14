var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};
ZIGVU.ChartManager.ChartFilters = ZIGVU.ChartManager.ChartFilters || {};

/*
  Filter to display current video position
*/

ZIGVU.ChartManager.ChartFilters.FilterStatusVideo = function(htmlGenerator) {
  var self = this;
  this.dataManager = undefined;
  this.eventManager = undefined;

  var divId_filterContainer = "#filter-status-video-container";

  var divId_filterStatusVideoId = "#filter-status-video-id";
  var divId_filterStatusVideoTitle = "#filter-status-video-title";
  var divId_filterStatusVideoFrameNumber = "#filter-status-video-fn";
  var divId_filterStatusVideoFrameTime = "#filter-status-video-time";
  var divId_filterStatusClipId = "#filter-status-clip-id";
  var divId_filterStatusClipFrameNumber = "#filter-status-clip-fn";
  var divId_filterStatusClipFrameTime = "#filter-status-clip-time";


  function updateStatusFromVideoPlayer(args){
    var vs = self.dataManager.getData_videoState(args).current;

    $(divId_filterStatusVideoId).text(vs.video_id);
    $(divId_filterStatusVideoTitle).text(vs.video_title);
    $(divId_filterStatusVideoFrameNumber).text(vs.video_fn  + ' / ' + vs.extracted_video_fn);
    $(divId_filterStatusVideoFrameTime).text(vs.video_time);
    $(divId_filterStatusClipId).text(vs.clip_id);
    $(divId_filterStatusClipFrameNumber).text(vs.clip_fn + ' / ' + vs.extracted_clip_fn);
    $(divId_filterStatusClipFrameTime).text(vs.clip_time);
  };

  this.empty = function(){ };

  this.show = function(){ $(divId_filterContainer).show(); };
  this.hide = function(){ $(divId_filterContainer).hide(); };

  //------------------------------------------------
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
};
