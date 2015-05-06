var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};
ZIGVU.ChartManager.ChartFilters = ZIGVU.ChartManager.ChartFilters || {};

/*
  Filter to select scales
*/

ZIGVU.ChartManager.ChartFilters.FilterFrameScales = function(htmlGenerator) {
  var self = this;
  this.eventManager = undefined;

  var divId_filterContainer = "#filter-frame-scale-selection-container";
  var divId_filterTable = "#filter-frame-scale-selection-table";


  this.displayInput = function(scalesArr){
    self.empty();

    var inputName = "filterFrameScales";
  
    // convert data to a tabular form
    var headerArr = ['Scale', 'Select'];
    var bodyArr = _.map(scalesArr, function(scale){
      return [
        scale, 
        '<input type="radio" name="' + inputName + '" value="' 
        + scale + '" id="input-filter-frame-scales">'
      ];
    });

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));

    // on value change, inform filter
    $('input[type=radio][name=' + inputName + ']').change(function() {
      self.eventManager.fireScaleSelectedCallback(parseFloat(this.value));
    });

    // set to first scale
    $('input[type=radio][name=' + inputName + ']:nth(0)').attr('checked', true);
    self.eventManager.fireScaleSelectedCallback(parseFloat(scalesArr[0]));
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
