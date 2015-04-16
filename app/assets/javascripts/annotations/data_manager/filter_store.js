var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};

/*
  This class stores all data.
*/

ZIGVU.DataManager.FilterStore = function() {
  var self = this;
  this.chiaVersionId = undefined;
  this.detectableIds = undefined;
  this.localizations = undefined;

  // for active filtering
  this.currentAnnotationDetId = undefined;
  
  this.getCurrentFilterParams = function(){
    var currentFilters = {};
    currentFilters['chia_version_id'] = self.chiaVersionId;
    currentFilters['detectable_ids'] = self.detectableIds;
    currentFilters['localization_scores'] = self.localizations;
    return currentFilters;
  };

  this.reset = function(){
    self.chiaVersionId = undefined;
    self.detectableIds = undefined;
    self.localizations = undefined;
    self.currentAnnotationDetId = undefined;
  };
};