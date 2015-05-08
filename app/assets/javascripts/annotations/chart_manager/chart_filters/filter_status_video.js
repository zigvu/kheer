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

  var divId_filterStatusVideoCollectionId = "#filter-status-video-collection-id";
  var divId_filterStatusVideoCollectionFrameNumber = "#filter-status-video-collection-frame-number";
  var divId_filterStatusVideoCollectionFrameTime = "#filter-status-video-collection-frame-time";
  var divId_filterStatusVideoQuantaId = "#filter-status-video-quanta-id";
  var divId_filterStatusVideoQuantaFrameNumber = "#filter-status-video-quanta-frame-number";
  var divId_filterStatusVideoQuantaFrameTime = "#filter-status-video-quanta-frame-time";


  function updateStatusFromVideoPlayer(args){
    var fs = self.dataManager.getData_currentVideoState(args.video_id, args.frame_number);

    $(divId_filterStatusVideoCollectionId).text(fs.video_collection_id);
    $(divId_filterStatusVideoCollectionFrameNumber).text(fs.video_collection_frame_number);
    $(divId_filterStatusVideoCollectionFrameTime).text(fs.video_collection_frame_time);
    $(divId_filterStatusVideoQuantaId).text(fs.video_quanta_id);
    $(divId_filterStatusVideoQuantaFrameNumber).text(fs.video_quanta_frame_number);
    $(divId_filterStatusVideoQuantaFrameTime).text(fs.video_quanta_frame_time);
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
