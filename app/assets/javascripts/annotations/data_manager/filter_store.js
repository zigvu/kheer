var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};

/*
  This class stores all data.
*/

ZIGVU.DataManager.FilterStore = function() {
  var self = this;
  this.chiaVersionIdLocalization = undefined;
  this.detectableIds = undefined;
  this.localizations = undefined;
  this.videoIds = undefined;
  this.chiaVersionIdAnnotation = undefined;

  // for active filtering
  this.currentAnnotationDetId = undefined;
  
  this.getCurrentFilterParams = function(){
    var currentFilters = {};
    currentFilters['chia_version_id'] = self.chiaVersionIdLocalization;
    currentFilters['detectable_ids'] = self.detectableIds;
    currentFilters['localization_scores'] = self.localizations;
    currentFilters['video_ids'] = self.videoIds;
    return currentFilters;
  };

  this.reset = function(){
    self.chiaVersionIdLocalization = undefined;
    self.detectableIds = undefined;
    self.localizations = undefined;
    self.currentAnnotationDetId = undefined;
    self.videoIds = undefined;
    this.chiaVersionIdAnnotation = undefined;
  };
};