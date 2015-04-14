var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};

/*
  Display and run filter.
*/

ZIGVU.ChartManager.FilterDisplayAndRun = function(htmlGenerator) {
  var _this = this;
  var divId = '#filter-display-and-run';

  var submitButtonId_FilterReset = '#submit-filter-display-reset-filter';
  var submitButtonId_LoadData = '#submit-filter-display-load-data';


  this.display = function(data, deferrer){
    // convert data to a tabular form
    var headerArr = ['Data Type', 'Count'];
    var bodyArr = _.map(data, function(v, k){
      return [k, v];
    });
    $(divId).append(htmlGenerator.table(headerArr, bodyArr));

    $(submitButtonId_FilterReset).click(function(){ deferrer.resolve(_this.action_FilterReset); });
    $(submitButtonId_LoadData).click(function(){ deferrer.resolve(_this.action_LoadData); });

    return _this;
  };

  this.empty = function(){ 
    $(divId).empty(); 

    return _this;
  };

  this.disable = function(){
    $(submitButtonId_FilterReset).addClass('disabled');
    $(submitButtonId_LoadData).addClass('disabled');

    return _this;
  };

  this.enable = function(){
    $(submitButtonId_FilterReset).removeClass('disabled');
    $(submitButtonId_LoadData).removeClass('disabled');

    return _this;
  };
};

ZIGVU.ChartManager.FilterDisplayAndRun.prototype.action_FilterReset = 'action_filter_reset';
ZIGVU.ChartManager.FilterDisplayAndRun.prototype.action_LoadData = 'action_load_data';
