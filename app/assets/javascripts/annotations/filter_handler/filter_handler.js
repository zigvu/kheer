var ZIGVU = ZIGVU || {};
ZIGVU.FilterHandler = ZIGVU.FilterHandler || {};

/*
  This class handles all filters.
*/

ZIGVU.FilterHandler.FilterHandler = function() {
  var _this = this;
  var currentFilters = {};

  this.addChiaVersionId = function(chiaVersionId){
    currentFilters['chia_version_id'] = chiaVersionId;
  };
  this.addDetectableIds = function(detectableIds){
    currentFilters['detectable_ids'] = detectableIds;
  };
  this.addLocalizationScores = function(localizationScores){
    currentFilters['localization_scores'] = localizationScores;
  };

  this.getFilters = function(){
    return currentFilters;
  };

  this.reset = function(){
  	currentFilters = {};
  };

  //------------------------------------------------  
  // let jquery manage call backs to update all charts
  var callbacks = $.Callbacks("unique");
  this.addCallback = function(callback){ callbacks.add(callback); };
  this.fire = function(){ callbacks.fire(); };
  //------------------------------------------------  
};

// ZIGVU.FilterHandler.FilterHandler.prototype.chia_version_id = 'chia_version_id';
// ZIGVU.FilterHandler.FilterHandler.prototype.detectable_ids = 'detectable_ids';
// ZIGVU.FilterHandler.FilterHandler.prototype.localization_scores = 'localization_scores';

