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
  detectableMap: {detectable_id: detectable_name, }
  detectableIds: [:detectable_id, ]
  currentFilters: {pri_zdist:, pri_scales:, sec_zdist:, sec_scales:, int_threshs: }
  selectedFilters:
    [{
      pri_det_id:, sec_det_id:, 
      number_of_localizations:, selected_filters:currentFilters
    }, ]
*/

MiningSetup.Confusion.DataManager = function() {
  var self = this;

  this.fullData = undefined;
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

  this.updateFilters = function(priZdist, priScales, secZdist, secScales, intThreshs){
    self.currentFilters.pri_zdist = priZdist;
    self.currentFilters.pri_scales = priScales;
    self.currentFilters.sec_zdist = secZdist;
    self.currentFilters.sec_scales = secScales;
    self.currentFilters.int_threshs = intThreshs;
  };

  this.handleCellClick = function(rowId, colId, numLocs){
    var cellFilters = {
      pri_det_id: parseInt(self.detectableIds[rowId]),
      sec_det_id: parseInt(self.detectableIds[colId]),
      number_of_localizations: numLocs,
      selected_filters: _.clone(self.currentFilters)
    };

    var alreadyIncluded = false;
    _.find(self.selectedFilters, function(selectedFilter){
      if(_.isEqual(cellFilters, selectedFilter)){ alreadyIncluded = true; }
      return alreadyIncluded;
    });
    if(!alreadyIncluded){
      self.selectedFilters.push(cellFilters);
    }
    self.updateSelectedFiltersHTML();
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
              .click(function(){ 
                self.selectedFilters.splice(idx, 1);
                self.updateSelectedFiltersHTML();
              })
            )
          )
        );
    });
    jj = JSON.stringify(self.selectedFilters);
    $('#current_filters').val(jj);
  };


  //------------------------------------------------
  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('MiningSetup.Confusion.DataManager -> ' + errorReason);
  };
};