var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};
ZIGVU.DataManager.Stores = ZIGVU.DataManager.Stores || {};

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

  heatmap: {scale:, :detectable_id:, zdist_thresh: }

*/

ZIGVU.DataManager.Stores.FilterStore = function() {
  var self = this;
  this.chiaVersionIdLocalization = undefined;
  this.chiaVersionIdAnnotation = undefined;
  this.detectableIds = undefined;
  this.localizations = undefined;
  this.videoIds = undefined;

  // for active filtering
  this.currentAnnotationDetId = undefined;
  this.heatmap = {scale: undefined, detectable_id: undefined, zdist_thresh: undefined};

  this.reset = function(){
    self.chiaVersionIdLocalization = undefined;
    self.chiaVersionIdAnnotation = undefined;
    self.detectableIds = undefined;
    self.localizations = undefined;
    self.videoIds = undefined;

    self.currentAnnotationDetId = undefined;
    self.heatmap = {scale: undefined, detectable_id: undefined, zdist_thresh: undefined};
  };
};