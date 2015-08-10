var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.MiningSetup = ZIGVU.Analysis.MiningSetup || {};

var MiningSetup = ZIGVU.Analysis.MiningSetup;
MiningSetup.Confusion = MiningSetup.Confusion || {};

/*
  This class manages data.
*/

/*
  Data structure:
  [Note: Ruby style hash (:keyname => value) implies that raw id are used as keys of objects.
  JS style hash implies that (keyname: value) text are used as keys of objects.]

  fullData: [{name:, row:, col:, value: count:}, ]
  shadowedData: {row: {col: count}, }
  detectableMap: {detectable_id: detectable_name, }
  detectableIds: [:detectable_id, ]
  currentFilters: {pri_zdist:, pri_scales:, sec_zdist:, sec_scales:, int_threshs: }
  selectedFilters: [{ 
    pri_det_id:, sec_det_id:, row:, col:, 
    number_of_localizations:, selected_filters:currentFilters 
    }, ]
*/

MiningSetup.Confusion.DataManager = function() {
  var self = this;

  this.eventManager = undefined;

  this.fullData = undefined;
  this.shadowedData = undefined;
  this.detectableMap = undefined;
  this.detectableIds = undefined;
  this.currentFilters = {
    pri_zdist: undefined,
    pri_scales: undefined,

    sec_zdist: undefined,
    sec_scales: undefined,

    int_threshs: undefined
  };
  this.selectedFilters = [];

  this.setZeroDiagonal = function(){
    // shadow diagonal and recompute percentage
    _.each(self.fullData, function(d){
      if(d.row === d.col){
        self.shadowedData[d.row][d.col] = d.count;
        d.count = 0;
      }
    });
    self.repaintHeatmap();
  };

  this.updateFilters = function(priZdist, priScales, secZdist, secScales, intThreshs){
    self.currentFilters.pri_zdist = priZdist;
    self.currentFilters.pri_scales = priScales;
    self.currentFilters.sec_zdist = secZdist;
    self.currentFilters.sec_scales = secScales;
    self.currentFilters.int_threshs = intThreshs;
  };

  this.handleCellClick = function(rowId, colId){
    var numLocs = self.getNumOfLocalizations(rowId, colId);
    if(numLocs <= 0){ return; }

    var cellFilters = {
      pri_det_id: parseInt(self.detectableIds[rowId]),
      sec_det_id: parseInt(self.detectableIds[colId]),
      row: rowId,
      col: colId,
      number_of_localizations: numLocs,
      selected_filters: _.clone(self.currentFilters)
    };

    // return if already included
    var alreadyIncluded = false;
    _.find(self.selectedFilters, function(selectedFilter){
      if(_.isEqual(cellFilters, selectedFilter)){ alreadyIncluded = true; }
      return alreadyIncluded;
    });
    if(alreadyIncluded){ return; }

    // add filters and update
    self.selectedFilters.push(cellFilters);
    self.updateSelectedFiltersHTML();

    // remove from heatmap value
    self.shadowData(rowId, colId);
    self.repaintHeatmap();
  };

  this.getSelectedFilters = function(){
    return self.selectedFilters;
  };

  this.getDetectableName = function(detId){
    return self.detectableMap[detId];
  };

  this.getHeatmapData = function(){
    return self.fullData;
  };

  this.getNumOfLocalizations = function(rowId, colId){
    return _.find(self.fullData, function(d){ 
      return (d.row == rowId) && (d.col == colId);
    }).count;
  };

  this.getMaxNumOfLocalizations = function(){
    return _.max(self.fullData, function(d){ return d.count; }).count;
  };

  this.getHeatmapRowLabels = function(){
    return self.detectableIds;
  };
  this.getHeatmapColLabels = function(){
    return self.detectableIds;
  };

  this.getNumRowsCols = function(){
    return self.detectableIds.length;
  };

  this.getFullDataPromise = function(){
    var dataURL = '/api/v1/minings/confusion';
    var dataParam = {
      mining_id: window.miningId,
      current_filters: self.currentFilters
    };

    var requestDefer = Q.defer();
    self.getGETRequestPromise(dataURL, dataParam)
      .then(function(data){
        self.fullData = data.intersections;
        self.detectableMap = data.detectable_map;
        self.detectableIds = Object.keys(self.detectableMap);
        // empty selected data
        self.shadowedData = {}
        _.each(self.fullData, function(d){
          if(!self.shadowedData[d.row]){ self.shadowedData[d.row] = {}; }
          self.shadowedData[d.row][d.col] = 0;
        });
        self.repaintHeatmap();
        requestDefer.resolve(true);
      })
      .catch(function (errorReason) {
        requestDefer.reject('MiningSetup.Confusion.DataManager ->' + errorReason);
      });

    return requestDefer.promise;    
  };

  // NOTE: Duplicate of Mining.DataManager.AjaxHandler
  // TODO: refactor
  this.getGETRequestPromise = function(url, params){
    var requestDefer = Q.defer();
    $.ajax({
      url: url,
      data: params,
      type: "GET",
      success: function(json){ requestDefer.resolve(json) },
      error: function( xhr, status, errorThrown ) {
        requestDefer.reject("MiningSetup.Confusion.DataManager: " + errorThrown);
      }
    });
    return requestDefer.promise;
  };

  this.updateSelectedFiltersHTML = function(){
    var filtersHTMLTbody = $("#heatmap-cell-selected-details");
    filtersHTMLTbody.empty();
    _.each(self.selectedFilters, function(sf, idx, list){
      // HTML table rows:
      var rowDet = self.getDetectableName(sf.pri_det_id) + " [" + sf.pri_det_id + "]";
      var colDet = self.getDetectableName(sf.sec_det_id) + " [" + sf.sec_det_id + "]";
      var numLocs = sf.number_of_localizations;
      var rowZd = sf.selected_filters.pri_zdist;
      var rowScl = sf.selected_filters.pri_scales;
      var colZd = sf.selected_filters.sec_zdist;
      var colScl = sf.selected_filters.sec_scales;
      var intThreshs = sf.selected_filters.int_threshs;

      filtersHTMLTbody
        .append($('<tr>')
          .append($('<td>').text(rowDet))
          .append($('<td>').text(rowZd))
          .append($('<td>').text(rowScl))
          .append($('<td>').text(colDet))
          .append($('<td>').text(colZd))
          .append($('<td>').text(colScl))
          .append($('<td>').text(intThreshs))
          .append($('<td>').text(numLocs))
          .append($('<td>')
            .append($('<div>')
              .addClass('button success').attr('id', idx)
              .text('Remove')
              .click(function(){ self.removeSelectedFilter(idx); })
            )
          )
        );
    });
    jj = JSON.stringify(self.selectedFilters);
    $('#current_filters').val(jj);
  };

  this.removeSelectedFilter = function(selectedFilterIdx){
    var selFilter = self.selectedFilters[selectedFilterIdx];

    if(_.isEqual(selFilter.selected_filters, self.currentFilters)){
      var rowId = selFilter.row, colId = selFilter.col;
      _.find(self.fullData, function(d){
        if((d.row == rowId) && (d.col == colId)){
          d.count = self.shadowedData[d.row][d.col];
          self.shadowedData[d.row][d.col] = 0;
          return true;
        }
        return false;
      });
      self.repaintHeatmap();
    }

    self.selectedFilters.splice(selectedFilterIdx, 1);
    self.updateSelectedFiltersHTML();
  };

  this.shadowData = function(rowId, colId){
    _.find(self.fullData, function(d){
      if((d.row == rowId) && (d.col == colId)){
        self.shadowedData[d.row][d.col] = d.count;
        d.count = 0;
        return true;
      }
      return false;
    });
  };

  this.recomputePercentage = function(){
    var maxCount = self.getMaxNumOfLocalizations();
    if(maxCount > 0){
      _.each(self.fullData, function(d){
        d.value = parseInt(100.0 * d.count / maxCount)/100;
      });      
    }
  };

  // ----------------------------------------------
  // event handling
  this.repaintHeatmap = function(){
    self.recomputePercentage();
    self.eventManager.fireRedrawHeatmapCallback({});
  };

  //------------------------------------------------
  // set relations
  this.setEventManager = function(em){
    self.eventManager = em;
    return self;
  };

  //------------------------------------------------
  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('MiningSetup.Confusion.DataManager -> ' + errorReason);
  };
};