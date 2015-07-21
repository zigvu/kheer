var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.DataManager = Mining.DataManager || {};
Mining.DataManager.Accessors = Mining.DataManager.Accessors || {};

/*
  This class accesses data related to localization.
*/

Mining.DataManager.Accessors.LocalizationDataAccessor = function() {
  var self = this;

  this.filterStore = undefined;
  this.dataStore = undefined;

  // ----------------------------------------------
  // video clip mapping
  this.getVideoClipMap = function(){
    return self.dataStore.videoClipMap;
  };

  this.createVideoClipMap = function(){
    var miningData = self.dataStore.miningData;

    // ASSUME: clipSet is already sorted by rails
    self.dataStore.videoClipMap.sortedClipIds = _.pluck(miningData.clipSet, 'clip_id');
    self.dataStore.videoClipMap.clipMap = {};

    var sortedClipIds = self.dataStore.videoClipMap.sortedClipIds;
    var clipMap = self.dataStore.videoClipMap.clipMap;

    _.each(sortedClipIds, function(clipId){
      clipMap[clipId] = {};
      var videoId = _.findWhere(miningData.clipSet, {clip_id: clipId}).video_id;

      var video = _.findWhere(miningData.videos, {video_id: videoId});
      var clip = _.findWhere(miningData.clips, {clip_id: clipId});
      clipMap[clipId] = _.extend(clipMap[clipId], clip);
      clipMap[clipId] = _.extend(clipMap[clipId], video);
    });
  };

  // ----------------------------------------------
  // detectable mapping
  this.getLocalizationDetails = function(detId){
    return {
      id: detId,
      title: self.dataStore.detectables.decorations[detId].pretty_name,
      color: self.dataStore.detectables.decorations[detId].annotation_color
    };
  };

  // ----------------------------------------------
  // video <-> clip translation
  this.getVideoIdVideoFN = function(clipId, clipFN){
    var clip = self.dataStore.videoClipMap.clipMap[clipId];
    var videoId = clip.video_id;
    var videoFN = clipFN + clip.clip_fn_start;
    return { video_id: videoId, video_fn: videoFN };
  };

  // for non-evaluated frames, we need to translate frame numbers
  this.getTranslatedVideoIdVideoFN = function(clipId, clipFN){
    var clip = self.dataStore.videoClipMap.clipMap[clipId];
    var videoId = clip.video_id;
    var videoFN = clipFN + clip.clip_fn_start;

    var detectionRate = clip.detection_frame_rate;
    var efn = self.dataStore.firstEvaluatedVideoFn;
    videoFN = (videoFN - efn) - ((videoFN - efn) % detectionRate) + efn;
    return { video_id: videoId, video_fn: videoFN };
  };

  this.isEvaluatedFrame = function(clipId, videoFN){
    var clip = self.dataStore.videoClipMap.clipMap[clipId];
    var detectionRate = clip.detection_frame_rate;
    var efn = self.dataStore.firstEvaluatedVideoFn;
    return (((videoFN - efn) % detectionRate) == 0);
  };

  // ----------------------------------------------
  // localization raw data
  this.getMaxScore = function(clipId, clipFN, detId){
    var vfn = self.getVideoIdVideoFN(clipId, clipFN);
    var videoId = vfn.video_id;
    var videoFN = vfn.video_fn;
    
    var spatIntThresh = self.dataStore.miningData.smartFilter.spatial_intersection_thresh;
    var loc = self.dataStore.dataFullLocalizations;
    var score = 0, spInterScore = 0;
    if(loc[videoId] && loc[videoId][videoFN] && loc[videoId][videoFN][detId]) {
      // if even one localization is present, it gets a height
      score = 0.7;
      var detDetails = self.dataStore.dataFullLocalizations[videoId][videoFN][detId];
      spInterScore = _.max(detDetails, 
        function(dd){ return dd.spatial_intersection; }).spatial_intersection;
      if (spInterScore > spatIntThresh){ score = 1.0; }
    }
    return score;
  };

  this.getLocalizations = function(clipId, clipFN){
    var vfn = self.getTranslatedVideoIdVideoFN(clipId, clipFN);
    var videoId = vfn.video_id;
    var videoFN = vfn.video_fn;
    var loc = self.dataStore.dataFullLocalizations;
    if(loc[videoId] === undefined || loc[videoId][videoFN] === undefined){ return []; }
    return loc[videoId][videoFN];
  };

  //------------------------------------------------
  // for heatmap

  this.getCellMap = function(){
    return self.dataStore.cellMap;
  };
  this.getColorMap = function(){
    return self.dataStore.colorMap;
  };
  //------------------------------------------------
  // for video status
  this.getVideoState = function(currentPlayState){
    // Note: The return keys here have to match in following files:
    // analysis/mining/chart_manager/chart_filters/filter_status_video.js
    // analysis/mining/frame_display/draw_info_overlay.js

    var clipId = currentPlayState.clip_id;
    var clipFN = currentPlayState.clip_fn;
    var extractedClipFN = currentPlayState.extracted_clip_fn;
    if(extractedClipFN === undefined){ extractedClipFN = clipFN; }

    var clip = self.dataStore.videoClipMap.clipMap[clipId];
    var videoFN = clipFN + clip.clip_fn_start;
    var extractedVideoFN = extractedClipFN + clip.clip_fn_start;

    // prettyfiy times:
    var videoFrameTime = self.dataStore.textFormatters.getReadableTime(
      1000.0 * videoFN / clip.playback_frame_rate);
    var clipFrameTime = self.dataStore.textFormatters.getReadableTime(
      1000.0 * clipFN / clip.playback_frame_rate);

    self.dataStore.videoState.previous = _.clone(self.dataStore.videoState.current);

    // return in format usable by display JS
    self.dataStore.videoState.current = {
      video_id: clip.video_id,
      video_title: clip.title,
      video_fn: videoFN,
      video_time: videoFrameTime,
      clip_id: clipId,
      clip_fn: clipFN,
      clip_time: clipFrameTime,
      extracted_clip_fn: extractedClipFN,
      extracted_video_fn: extractedVideoFN,
      is_evaluated_frame: self.isEvaluatedFrame(clipId, videoFN)
    };
    return self.dataStore.videoState;
  };

  //------------------------------------------------
  // set relations
  this.setFilterStore = function(fs){
    self.filterStore = fs;
    return self;
  };

  this.setDataStore = function(ds){
    self.dataStore = ds;
    return self;
  };
};
