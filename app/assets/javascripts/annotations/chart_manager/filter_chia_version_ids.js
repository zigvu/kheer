var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};

/*
  Chia Ids filter.
*/

ZIGVU.ChartManager.FilterChiaVersionIds = function(htmlGenerator) {
  var _this = this;
  var divId = '#filter-chia-version-ids-selection';
  var submitButtonId = 'submit-filter-chia-version-ids';

  this.display = function(data, deferrer){
    var inputName = "chiaVersionIds";
    // convert data to a tabular form
    var headerArr = ['Id', 'Name', 'Description', 'Select'];
    var bodyArr = _.map(data, function(chiaVersion){
      return [
        chiaVersion.id, 
        chiaVersion.name, 
        chiaVersion.description, 
        '<input type="radio" name="' + inputName + '" value="' 
        + chiaVersion.id + '" id="input-filter-chia-version-ids">'
      ];
    });
    var submitButton = htmlGenerator.newButton(submitButtonId, 'Submit');
    bodyArr.push(['', '', '', submitButton]);

    $(divId).append(htmlGenerator.table(headerArr, bodyArr));

    // if submitted, start the next filter
    $('#' + submitButtonId).click(function(){
      var chiaId = $('input[name="' + inputName + '"]:checked', divId).val();
      if(chiaId){
        var settings = _.find(data, function(chiaVersion){return chiaVersion.id == chiaId; }).settings;
        _this.disable();
        deferrer.resolve({chia_id: chiaId, settings: settings});
      }
    });

    return _this;
  };

  this.empty = function(){ 
    $(divId).empty(); 

    return _this;
  };

  this.displayStartFilterButton = function(deferrer){
    var buttonId = 'start-filter-button';
    var button = htmlGenerator.newButton(buttonId, 'Start Filter');
    $(divId).append(button);

    $('#' + buttonId).click(function(){ 
      _this.empty();
      deferrer.resolve(true); 
    });

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