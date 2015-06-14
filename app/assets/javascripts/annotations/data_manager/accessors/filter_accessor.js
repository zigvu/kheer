var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};
ZIGVU.DataManager.Accessors = ZIGVU.DataManager.Accessors || {};

/*
  This class accesses data related to filters.
*/

ZIGVU.DataManager.Accessors.FilterAccessor = function() {
  var self = this;

  this.filterStore = undefined;
  this.dataStore = undefined;

  this.setChiaVersionIdLocalization = function(chiaVersionId){
    self.filterStore.chiaVersionIdLocalization = chiaVersionId;
  };
  this.getChiaVersionLocalization = function(){
    var selectedChiaVersion = _.find(self.dataStore.chiaVersions, function(cv){
      return cv.id == self.filterStore.chiaVersionIdLocalization; 
    });
    return selectedChiaVersion;
  };

  this.setChiaVersionIdAnnotation = function(chiaVersionId){
    self.filterStore.chiaVersionIdAnnotation = chiaVersionId;
  };
  this.getChiaVersionIdAnnotation = function(chiaVersionId){
    return self.filterStore.chiaVersionIdAnnotation;
  };
  this.getChiaVersionAnnotation = function(){
    var selectedChiaVersion = _.find(self.dataStore.chiaVersions, function(cv){
      return cv.id == self.filterStore.chiaVersionIdAnnotation; 
    });
    return selectedChiaVersion;
  };

  this.setLocalizationSettings = function(localizationSettings){
    self.filterStore.localizations = localizationSettings;
  };
  this.getLocalizationSettings = function(){
    return self.filterStore.localizations;
  };

  this.setLocalizationDetectableIds = function(detectableIds){
    self.filterStore.detectableIds = detectableIds;
  };
  this.getLocalizationDetectableIds = function(){
    return self.filterStore.detectableIds;
  };

  this.getLocalizationSelectedDetectables = function(){
    return _.filter(self.dataStore.detectables.localization, function(detectable){
      return _.contains(self.filterStore.detectableIds, detectable.id);
    });
  };

  this.setVideoSelectionIds = function(videoIds){
    self.filterStore.videoIds = videoIds;
    // populate videoClipMap
    self.dataStore.videoClipMap.sortedVideoIds = [];
    self.dataStore.videoClipMap.sortedClipIds = [];
    self.dataStore.videoClipMap.clipIdToVideoId = {};
    self.dataStore.videoClipMap.clipMap = {};

    // short hand
    var sortedVideoIds = self.dataStore.videoClipMap.sortedVideoIds;
    var sortedClipIds = self.dataStore.videoClipMap.sortedClipIds;
    var clipIdToVideoId = self.dataStore.videoClipMap.clipIdToVideoId;
    var clipMap = self.dataStore.videoClipMap.clipMap;

    // ASSUME: videoList is already sorted by rails
    _.each(self.dataStore.videoList, function(video){
      var videoId = video.video_id;
      if(_.contains(self.filterStore.videoIds, videoId)){
        sortedVideoIds.push(videoId);
        _.each(video.clips, function(clip){
          var clipId = clip.clip_id;
          sortedClipIds.push(clipId);
          clipIdToVideoId[clipId] = videoId;
          // construct clip map
          clipMap[clipId] = _.omit(video, ['clips', 'pretty_length']);
          clipMap[clipId] = _.extend(clipMap[clipId], clip);
        });
      }
    });
  };
  this.getVideoSelections = function(){
    return _.filter(self.dataStore.videoList, function(video){
      return _.contains(self.filterStore.videoIds, video.video_id);
    });
  };

  this.cycleScales = function(){
    var scales = self.dataStore.selectedChiaVersionSettings.scales;
    var curScale = self.filterStore.heatmap.scale;
    if(curScale === undefined){
      self.filterStore.heatmap.scale = scales[0];
    } else {
      self.filterStore.heatmap.scale = scales[(_.indexOf(scales, curScale) + 1) % scales.length];
    }
    return self.filterStore.heatmap.scale;
  };
  this.cycleZdists = function(){
    var zdists = self.dataStore.selectedChiaVersionSettings.zdistThresh;
    var curZdist = self.filterStore.heatmap.zdist_thresh;
    if(curZdist === undefined){
      self.filterStore.heatmap.zdist_thresh = zdists[0];
    } else {
      self.filterStore.heatmap.zdist_thresh = zdists[(_.indexOf(zdists, curZdist) + 1) % zdists.length];
    }
    return self.filterStore.heatmap.zdist_thresh;
  };

  this.getFrameFilterState = function(){
    // Note: The return keys here have to match in following files:
    // annotations/chart_manager/chart_filters/filter_status_frame.js
    return { 
      heatmap: self.filterStore.heatmap
    };
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