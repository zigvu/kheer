var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.DataManager = Mining.DataManager || {};
Mining.DataManager.Stores = Mining.DataManager.Stores || {};

/*
  This class stores all data.
*/

/*
  Data structure:
  [Note: Ruby style hash (:keyname => value) implies that raw id are used as keys of objects.
  JS style hash implies that (keyname: value) text are used as keys of objects.]

  currentAnnotationDetId: integer

  heatmap: {scale:, :detectable_id:, zdist_thresh:}

*/

Mining.DataManager.Stores.FilterStore = function() {
  var self = this;

  // for active filtering
  this.currentAnnotationDetId = undefined;
  this.heatmap = {scale: undefined, detectable_id: undefined, zdist_thresh: undefined};

  this.reset = function(){

    self.currentAnnotationDetId = undefined;
    self.heatmap = {scale: undefined, detectable_id: undefined, zdist_thresh: undefined};
  };
};