var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};
ZIGVU.ChartManager.ChartFilters = ZIGVU.ChartManager.ChartFilters || {};

/*
  Filter to select scales
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
    var fs = self.dataManager.getData_currentVideoState(args.clip_id, args.clip_fn);

    $(divId_filterStatusVideoId).text(fs.video_id);
    $(divId_filterStatusVideoTitle).text(fs.video_title);
    $(divId_filterStatusVideoFrameNumber).text(fs.video_fn);
    $(divId_filterStatusVideoFrameTime).text(fs.video_time);
    $(divId_filterStatusClipId).text(fs.clip_id);
    $(divId_filterStatusClipFrameNumber).text(fs.clip_fn);
    $(divId_filterStatusClipFrameTime).text(fs.clip_time);
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
