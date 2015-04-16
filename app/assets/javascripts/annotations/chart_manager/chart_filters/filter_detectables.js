var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};
ZIGVU.ChartManager.ChartFilters = ZIGVU.ChartManager.ChartFilters || {};

/*
  Detectable Ids filter.
*/

ZIGVU.ChartManager.ChartFilters.FilterDetectables = function(htmlGenerator) {
  var self = this;

  var divId_filterContainer = "#filter-detectables-container";
  var divId_filterTable = "#filter-detectables-table";


  this.displayInput = function(detectables){
    self.empty();
    var requestDefer = Q.defer();

    var submitButtonId = 'filter-detectables-submit';
    var cancelButtonId = 'filter-detectables-cancel';
    var inputName = "filterDetectablesIds";
    // convert data to a tabular form
    var headerArr = ['Chia DetId', 'Name', 'Pretty Name', 'Select'];
    var bodyArr = _.map(detectables, function(detectable){
      return [
        detectable.chia_detectable_id, 
        detectable.name, 
        detectable.pretty_name, 
        '<input type="checkbox" name="' + inputName + '" value="' 
        + detectable.id + '" id="input-filter-detectable-ids">'
      ];
    });

    var submitButton = htmlGenerator.newButton(submitButtonId, 'Submit');
    var cancelButton = htmlGenerator.newButton(cancelButtonId, 'Cancel');
    bodyArr.push([cancelButton, '', '', submitButton]);

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));

    // resolve promise on button clicks
    $('#' + submitButtonId).click(function(){
      var detectableIds = $('input[name="' + inputName + '"]:checked', divId_filterTable)
        .map(function() { return parseInt(this.value); }).get();

      if(detectableIds.length > 0){ requestDefer.resolve({ status: true, data: detectableIds }); }
    });
    $('#' + cancelButtonId).click(function(){
      requestDefer.resolve({ status: false, data: undefined });
    });

    return requestDefer.promise;
  };

  this.displayInfo = function(detectables){
    self.empty();
    // convert data to a tabular form
    var headerArr = ['Chia DetId', 'Name', 'Pretty Name'];
    var bodyArr = _.map(detectables, function(detectable){
      return [
        detectable.chia_detectable_id, 
        detectable.name, 
        detectable.pretty_name
      ];
    });

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));
  };

  this.empty = function(){ $(divId_filterTable).empty(); };

  this.show = function(){ $(divId_filterContainer).show(); };
  this.hide = function(){ $(divId_filterContainer).hide(); };
};
