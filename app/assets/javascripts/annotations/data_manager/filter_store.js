var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};

/*
  This class stores all data.
*/

ZIGVU.DataManager.FilterStore = function() {
  var _this = this;
  this.chiaVersionId = undefined;
  this.detectableIds = undefined;
  this.localizations = undefined;

  // for active filtering
  this.currentAnnotationDetId = undefined;
  
  this.getCurrentFilterParams = function(){
    var currentFilters = {};
    currentFilters['chia_version_id'] = this.chiaVersionId;
    currentFilters['detectable_ids'] = this.detectableIds;
    currentFilters['localization_scores'] = this.localizations;
    return currentFilters;
  };

  this.reset = function(){
    this.chiaVersionId = undefined;
    this.detectableIds = undefined;
    this.localizations = undefined;
    this.currentAnnotationDetId = undefined;
  };
};