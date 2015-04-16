var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};
ZIGVU.ChartManager.ChartFilters = ZIGVU.ChartManager.ChartFilters || {};

/*
  Chia Ids filter.
*/

ZIGVU.ChartManager.ChartFilters.FilterStartButton = function(htmlGenerator) {
  var _this = this;

  var divId_filterContainer = "#filter-start-button-container";
  var divId_filterButton = "#filter-start-button";


  this.displayInput = function(startButtonData){
    this.empty();
    var requestDefer = Q.defer();
    var submitButtonId = 'filter-start-button-submit';

    var submitButton = htmlGenerator.newButton(submitButtonId, 'Start');

    $(divId_filterButton).append(submitButton);

    // resolve promise on button clicks
    $('#' + submitButtonId).click(function(){
      requestDefer.resolve({ status: true, data: undefined });
    });

    return requestDefer.promise;
  };

  this.empty = function(){ $(divId_filterButton).empty(); };

  this.show = function(){ $(divId_filterContainer).show(); };
  this.hide = function(){ $(divId_filterContainer).hide(); };
};
