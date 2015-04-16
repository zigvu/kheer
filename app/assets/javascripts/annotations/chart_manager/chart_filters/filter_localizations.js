var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};
ZIGVU.ChartManager.ChartFilters = ZIGVU.ChartManager.ChartFilters || {};

/*
  Localization filter.
*/

ZIGVU.ChartManager.ChartFilters.FilterLocalizations = function(htmlGenerator) {
  var self = this;

  var divId_filterContainer = "#filter-localization-container";
  var divId_filterTable = "#filter-localization-table";


  this.displayInput = function(localizationInput){
    self.empty();
    var requestDefer = Q.defer();

    var submitButtonId = 'filter-localization-submit';
    var cancelButtonId = 'filter-localization-cancel';

    // create table for prob scores
    var probHeaderArr = ['Min Value', 'Max Value'];
    var probMinValueId = 'filter-localization-prob-score-min';
    var probMaxValueId = 'filter-localization-prob-score-max';
    var probMinValueInput = htmlGenerator.newTextInput(probMinValueId, 0.8);
    var probMaxValueInput = htmlGenerator.newTextInput(probMaxValueId, 1.0);
    var probBodyArr = [[probMinValueInput, probMaxValueInput]];

    var zdistInputName = "zdistValues";
    var zdistHeaderArr = ['ZDist value', 'Select'];
    var zdistBodyArr = _.map(localizationInput.zdistThresh, function(zdist){
      return [
        zdist, 
        '<input type="checkbox" name="' + zdistInputName + '" value="' 
        + zdist + '" id="input-zdist-values">'
      ];
    });

    // combine tables
    var headerArr = ['Filter type', 'Filter'];
    var bodyArr = [];
    bodyArr.push(['Prob Scores', htmlGenerator.table(probHeaderArr, probBodyArr)]);
    bodyArr.push(['ZDist Threshold', htmlGenerator.table(zdistHeaderArr, zdistBodyArr)]);

    var submitButton = htmlGenerator.newButton(submitButtonId, 'Submit');
    var cancelButton = htmlGenerator.newButton(cancelButtonId, 'Cancel');
    bodyArr.push([cancelButton, submitButton]);

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));

    // resolve promise on button clicks
    $('#' + submitButtonId).click(function(){
      var zDistValues = $('input[name="' + zdistInputName + '"]:checked', divId_filterTable)
        .map(function() { return parseFloat(this.value); }).get();

      var probMinValue = parseFloat($('#' + probMinValueId).val());
      var probMaxValue = parseFloat($('#' + probMaxValueId).val());

      if((zDistValues.length > 0) && (probMaxValue > probMinValue)){
        var localizationScores = {
          prob_scores: [_.max([0, probMinValue]), _.min([probMaxValue, 1.0])],
          zdist_thresh: zDistValues
        };
        requestDefer.resolve({ status: true, data: localizationScores });
      }
    });
    $('#' + cancelButtonId).click(function(){
      requestDefer.resolve({ status: false, data: undefined });
    });

    return requestDefer.promise;
  };

  this.displayInfo = function(filteredLocalization){
    self.empty();
    // convert data to a tabular form
    var headerArr = ['Filter type', 'Filter'];
    var bodyArr = [];
    bodyArr.push(['Prob Scores', htmlGenerator.formatArray(filteredLocalization.prob_scores)]);
    bodyArr.push(['ZDist Threshold', htmlGenerator.formatArray(filteredLocalization.zdist_thresh)]);

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));
  };

  this.empty = function(){ $(divId_filterTable).empty(); };

  this.show = function(){ $(divId_filterContainer).show(); };
  this.hide = function(){ $(divId_filterContainer).hide(); };
};
