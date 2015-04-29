var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};

/*
  This class stores all data.
*/

/*
  Data structure:
  [Note: Ruby style hash (:keyname => value) implies that raw id are used as keys of objects.
  JS style hash implies that (keyname: value) text are used as keys of objects.]

  chiaVersionIdLocalization: integer

  chiaVersionIdAnnotation: integer

  detectableIds: [integers]

  localizations: [{prob_scores: [float, float], zdist_thresh: float, scales: [floats]}]

  videoIds: [integers]

  currentAnnotationDetId: integer
*/

ZIGVU.DataManager.FilterStore = function() {
  var self = this;
  this.chiaVersionIdLocalization = undefined;
  this.chiaVersionIdAnnotation = undefined;
  this.detectableIds = undefined;
  this.localizations = undefined;
  this.videoIds = undefined;

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
    this.chiaVersionIdAnnotation = undefined;
    self.detectableIds = undefined;
    self.localizations = undefined;
    self.currentAnnotationDetId = undefined;
    self.videoIds = undefined;
  };
};