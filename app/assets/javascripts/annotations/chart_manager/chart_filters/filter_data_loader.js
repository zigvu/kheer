var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};
ZIGVU.ChartManager.ChartFilters = ZIGVU.ChartManager.ChartFilters || {};

/*
  Display summary data based on filter.
*/

ZIGVU.ChartManager.ChartFilters.FilterDataLoader = function(htmlGenerator) {
  var _this = this;

  var divId_filterContainer = "#filter-data-loader-container";
  var divId_filterTable = "#filter-data-loader-table";


  this.displayInput = function(dataCounts){
    this.empty();
    var requestDefer = Q.defer();

    var submitButtonId = 'filter-data-loader-submit';
    var cancelButtonId = 'filter-data-loader-cancel';

    // convert data to a tabular form
    var headerArr = ['Data Type', 'Count'];
    var bodyArr = _.map(dataCounts, function(v, k){
      return [k, v];
    });

    var submitButton = htmlGenerator.newButton(submitButtonId, 'Submit');
    var cancelButton = htmlGenerator.newButton(cancelButtonId, 'Cancel');
    bodyArr.push([cancelButton, submitButton]);

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));

    // resolve promise on button clicks
    $('#' + submitButtonId).click(function(){
      requestDefer.resolve({ status: true, data: undefined });
    });
    $('#' + cancelButtonId).click(function(){
      requestDefer.resolve({ status: false, data: undefined });
    });

    return requestDefer.promise;
  };

  this.displayInfo = function(dataCounts, deferrer){
    this.empty();

    var resetButtonId = 'filter-data-loader-reset';

    // convert data to a tabular form
    var headerArr = ['Data Type', 'Count'];
    var bodyArr = _.map(dataCounts, function(v, k){
      return [k, v];
    });

    var resetButton = htmlGenerator.newButton(resetButtonId, 'Reset');
    bodyArr.push(['', resetButton]);

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));

    // resolve promise on button clicks
    $('#' + resetButtonId).click(function(){
      deferrer.resolve(true);
    });
  };

  this.empty = function(){ $(divId_filterTable).empty(); };

  this.show = function(){ $(divId_filterContainer).show(); };
  this.hide = function(){ $(divId_filterContainer).hide(); };
};
