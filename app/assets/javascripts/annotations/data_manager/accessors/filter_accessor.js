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
    // create videoDataMap in dataStore
    self.dataStore.videoDataMap = {}
    _.each(self.dataStore.videoList, function(video){
      if(_.contains(self.filterStore.videoIds, video.video_id)){
        self.dataStore.videoDataMap[video.video_id] = video;
      }
    });
  };
  this.getVideoSelections = function(){
    return _.filter(self.dataStore.videoList, function(video){
      return _.contains(self.filterStore.videoIds, video.video_id);
    });
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