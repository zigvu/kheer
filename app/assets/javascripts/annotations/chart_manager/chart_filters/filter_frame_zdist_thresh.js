var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};
ZIGVU.ChartManager.ChartFilters = ZIGVU.ChartManager.ChartFilters || {};

/*
  Filter to select zdistThresh
*/

ZIGVU.ChartManager.ChartFilters.FilterFrameZdistThresh = function(htmlGenerator) {
  var self = this;
  this.eventManager = undefined;

  var divId_filterContainer = "#filter-frame-zdist-thresh-selection-container";
  var divId_filterTable = "#filter-frame-zdist-thresh-selection-table";


  this.displayInput = function(zdistThreshArr){
    self.empty();

    var inputName = "filterFrameZDistThresh";
  
    // convert data to a tabular form
    var headerArr = ['ZDistThresh', 'Select'];
    var bodyArr = _.map(zdistThreshArr, function(zdistThresh){
      return [
        zdistThresh, 
        '<input type="radio" name="' + inputName + '" value="' 
        + zdistThresh + '" id="input-filter-frame-zdistThresh">'
      ];
    });

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));

    // on value change, inform filter
    $('input[type=radio][name=' + inputName + ']').change(function() {
      self.eventManager.fireZdistThreshSelectedCallback(parseFloat(this.value));
    });

    // set to first zdistThresh
    $('input[type=radio][name=' + inputName + ']:nth(0)').attr('checked', true);
    self.eventManager.fireZdistThreshSelectedCallback(parseFloat(zdistThreshArr[0]));
  };

  this.displayInfo = function(chiaVersion){
    self.empty();
  };

  this.empty = function(){ $(divId_filterTable).empty(); };

  this.show = function(){ $(divId_filterContainer).show(); };
  this.hide = function(){ $(divId_filterContainer).hide(); };

  //------------------------------------------------
  // set relations
  this.setEventManager = function(em){
    self.eventManager = em;
    return self;
  };
};
