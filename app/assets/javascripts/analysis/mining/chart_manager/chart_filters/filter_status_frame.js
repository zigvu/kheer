var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.ChartManager = Mining.ChartManager || {};
Mining.ChartManager.ChartFilters = Mining.ChartManager.ChartFilters || {};

/*
  Filter to display current frame status
*/

Mining.ChartManager.ChartFilters.FilterStatusFrame = function(htmlGenerator) {
  var self = this;
  this.dataManager = undefined;
  this.eventManager = undefined;

  var divId_filterContainer = "#filter-status-frame-container";

  var divId_filterStatusFrameHeatmapScale = "#filter-status-frame-heatmap-scale";
  var divId_filterStatusFrameLocalizationZDist = "#filter-status-frame-localization-zdist";

  function updateStatusFromFrameSelection(args){
    var heatmap = self.dataManager.getFilter_getFrameFilterState().heatmap;

    $(divId_filterStatusFrameHeatmapScale).text(heatmap.scale);
    $(divId_filterStatusFrameLocalizationZDist).text(heatmap.zdist_thresh);
  };

  this.empty = function(){ };

  this.show = function(){ $(divId_filterContainer).show(); };
  this.hide = function(){ $(divId_filterContainer).hide(); };

  //------------------------------------------------
  // set relations
  this.setEventManager = function(em){
    self.eventManager = em;
    self.eventManager.addStatusFrameCallback(updateStatusFromFrameSelection);
    return self;
  };

  this.setDataManager = function(dm){
    self.dataManager = dm;
    return self;
  };
};
