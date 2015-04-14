var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};

/*
  Detectable Ids filter.
*/

ZIGVU.ChartManager.FilterDetectableIds = function(htmlGenerator) {
  var _this = this;
  var divId = '#filter-detectable-ids-selection';
  var submitButtonId = 'submit-filter-detectable-ids';


  this.display = function(data, deferrer){
    var inputName = "detectableVersionIds";
    // convert data to a tabular form
    var headerArr = ['Chia DetId', 'Name', 'Pretty Name', 'Select'];
    var bodyArr = _.map(data, function(detectableId){
      return [
        detectableId.chia_detectable_id, 
        detectableId.name, 
        detectableId.pretty_name, 
        '<input type="checkbox" name="' + inputName + '" value="' 
        + detectableId.id + '" id="input-filter-detectable-ids">'
      ];
    });
    var submitButton = htmlGenerator.newButton(submitButtonId, 'Submit');
    bodyArr.push(['', '', '', submitButton]);

    $(divId).append(htmlGenerator.table(headerArr, bodyArr));

    // if submitted, start the next filter
    $('#' + submitButtonId).click(function(){
      var detectableIds = $('input[name="' + inputName + '"]:checked', divId)
        .map(function() { return this.value; }).get();

      if(detectableIds.length > 0){
        _this.disable();
        deferrer.resolve({detectable_ids: detectableIds, detectable_list: data});
      }
    });

    return _this;
  };

  this.empty = function(){ 
    $(divId).empty(); 

    return _this;
  };

  this.disable = function(){
    $('#' + submitButtonId).addClass('disabled');

    return _this;
  };

  this.enable = function(){
    $('#' + submitButtonId).removeClass('disabled');

    return _this;
  };

};