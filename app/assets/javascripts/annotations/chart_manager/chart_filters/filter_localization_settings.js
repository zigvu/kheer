var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};
ZIGVU.ChartManager.ChartFilters = ZIGVU.ChartManager.ChartFilters || {};

/*
  Localization filter.
*/

ZIGVU.ChartManager.ChartFilters.FilterLocalizationSettings = function(htmlGenerator) {
  var self = this;

  var divId_filterContainer = "#filter-localization-container";
  var divId_filterTable = "#filter-localization-table";


  this.displayInput = function(localizationInput){
    self.empty();
    var requestDefer = Q.defer();

    var submitButtonId = 'filter-localization-submit';
    var cancelButtonId = 'filter-localization-cancel';

    // PROB:
    var probHeaderArr = ['Min Value', 'Max Value'];
    var probMinValueId = 'filter-localization-prob-score-min';
    var probMaxValueId = 'filter-localization-prob-score-max';
    var probMinValueInput = htmlGenerator.newTextInput(probMinValueId, 0.8);
    var probMaxValueInput = htmlGenerator.newTextInput(probMaxValueId, 1.0);
    var probBodyArr = [[probMinValueInput, probMaxValueInput]];

    // ZDIST:
    var zdistInputName = "zdistValue";
    var zdistHeaderArr = ['ZDist value', 'Select'];
    var zdistBodyArr = _.map(localizationInput.zdistThresh, function(zdist){
      return [
        zdist, 
        '<input type="radio" name="' + zdistInputName + '" value="' 
        + zdist + '" id="input-zdist-values">'
      ];
    });

    // SCALES:
    var scaleInputName = "scaleValues";
    var scaleHeaderArr = ['Scale value', 'Select'];
    var scaleBodyArr = _.map(localizationInput.scales, function(scale){
      return [
        scale, 
        '<input type="checkbox" name="' + scaleInputName + '" value="' 
        + scale + '" id="input-scale-values" checked>'
      ];
    });

    // combine tables
    var headerArr = ['Filter type', 'Filter'];
    var bodyArr = [];
    bodyArr.push(['Prob Scores', htmlGenerator.table(probHeaderArr, probBodyArr)]);
    bodyArr.push(['ZDist Threshold', htmlGenerator.table(zdistHeaderArr, zdistBodyArr)]);
    bodyArr.push(['Scales', htmlGenerator.table(scaleHeaderArr, scaleBodyArr)]);

    var submitButton = htmlGenerator.newButton(submitButtonId, 'Submit');
    var cancelButton = htmlGenerator.newButton(cancelButtonId, 'Cancel');
    bodyArr.push([cancelButton, submitButton]);

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));

    // select first zdist value
    $('input[type=radio][name="' + zdistInputName + '"]:nth(0)').attr('checked', true);

    // resolve promise on button clicks
    $('#' + submitButtonId).click(function(){
      var probMinValue = parseFloat($('#' + probMinValueId).val());
      var probMaxValue = parseFloat($('#' + probMaxValueId).val());

      var zDistValue = $('input[name="' + zdistInputName + '"]:checked', divId_filterTable).val();

      var scaleValues = $('input[name="' + scaleInputName + '"]:checked', divId_filterTable)
        .map(function() { return parseFloat(this.value); }).get();


      if((probMaxValue > probMinValue) && (zDistValue !== undefined) && (scaleValues.length > 0)){
        var localizationScores = {
          prob_scores: [_.max([0, probMinValue]), _.min([probMaxValue, 1.0])],
          zdist_thresh: zDistValue,
          scales: scaleValues
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
    bodyArr.push(['Scales', htmlGenerator.formatArray(filteredLocalization.scales)]);

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));
  };

  this.empty = function(){ $(divId_filterTable).empty(); };

  this.show = function(){ $(divId_filterContainer).show(); };
  this.hide = function(){ $(divId_filterContainer).hide(); };
};
