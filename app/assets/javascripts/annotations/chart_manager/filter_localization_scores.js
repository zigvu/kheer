var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};

/*
  Chia Ids filter.
*/

ZIGVU.ChartManager.FilterLocalizationScores = function(htmlGenerator) {
  var _this = this;
  var divIdSlider = '#localization-score-range-slider';
  var divIdValueDisplay = '#localization-score-range-display';
  var divIdZdist = '#zdisth-thresh-range-display';
  var submitButtonId = '#submit-localization-score-range';

  var startRange = 80;
  var endRange = 100;
  var curStartRange, curEndRange;

  $(divIdSlider).slider({
    range: true,
    min: 0,
    max: 100,
    values: [startRange, endRange],
    slide: function(event, ui) {
      curStartRange = ui.values[0]/100;
      curEndRange = ui.values[1]/100;
      $(divIdValueDisplay).val("Max: " + curStartRange + ", Min: " + curEndRange);
    }
  });
  $(divIdValueDisplay).val("Max: " + startRange/100 + ", Min: " + endRange/100);

  this.display = function(data, deferrer){
    // display zdist
    var inputName = "zdistValues";

    // convert data to a tabular form
    var headerArr = ['ZDist value', 'Select'];
    var bodyArr = _.map(data, function(zdist){
      return [
        zdist, 
        '<input type="checkbox" name="' + inputName + '" value="' 
        + zdist + '" id="input-zdist-values">'
      ];
    });

    $(divIdZdist).append(htmlGenerator.table(headerArr, bodyArr));

    _this.enable();
    // if submitted, start the next filter
    $(submitButtonId).click(function(){
      var zDistValues = $('input[name="' + inputName + '"]:checked', divIdZdist)
        .map(function() { return this.value; }).get();

      if(zDistValues.length > 0){
        _this.disable();
        var localizationScores = {
          prob_scores: [curStartRange, curEndRange],
          zdist_thresh: zDistValues
        };
        deferrer.resolve(localizationScores);
      }
    });

    return _this;
  };

  this.empty = function(){ 
    $(divIdSlider).slider({values: [startRange, endRange]});
    $(divIdZdist).empty();

    return _this;
  };

  this.disable = function(){
    $(divIdSlider).slider("disable");
    $(submitButtonId).addClass('disabled');

    return _this;
  };

  this.enable = function(){
    $(divIdSlider).slider("enable");
    $(submitButtonId).removeClass('disabled');

    return _this;
  };

};