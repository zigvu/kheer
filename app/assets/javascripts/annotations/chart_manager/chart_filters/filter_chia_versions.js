var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};
ZIGVU.ChartManager.ChartFilters = ZIGVU.ChartManager.ChartFilters || {};

/*
  Chia Ids filter.
*/

ZIGVU.ChartManager.ChartFilters.FilterChiaVersions = function(htmlGenerator) {
  var self = this;

  var divId_filterContainer = "#filter-chai-versions-container";
  var divId_filterTable = "#filter-chai-versions-table";


  this.displayInput = function(chiaVersions){
    self.empty();
    var requestDefer = Q.defer();

    var submitButtonId = 'filter-chia-versions-submit';
    var cancelButtonId = 'filter-chia-versions-cancel';
    var inputName = "filterChiaVersionIds";
    // convert data to a tabular form
    var headerArr = ['Id', 'Name', 'Description', 'Select'];
    var bodyArr = _.map(chiaVersions, function(chiaVersion){
      return [
        chiaVersion.id, 
        chiaVersion.name, 
        chiaVersion.description, 
        '<input type="radio" name="' + inputName + '" value="' 
        + chiaVersion.id + '" id="input-filter-chia-version-ids">'
      ];
    });
    var submitButton = htmlGenerator.newButton(submitButtonId, 'Submit');
    var cancelButton = htmlGenerator.newButton(cancelButtonId, 'Cancel');
    bodyArr.push([cancelButton, '', '', submitButton]);

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));

    // resolve promise on button clicks
    $('#' + submitButtonId).click(function(){
      var chiaId = $('input[name="' + inputName + '"]:checked', divId_filterTable).val();
      if(chiaId){ requestDefer.resolve({ status: true, data: parseInt(chiaId) }); }
    });
    $('#' + cancelButtonId).click(function(){
      requestDefer.resolve({ status: false, data: undefined });
    });

    return requestDefer.promise;
  };

  this.displayInfo = function(chiaVersion){
    self.empty();
    // convert data to a tabular form
    var headerArr = ['Id', 'Name', 'Description'];
    var bodyArr = [[chiaVersion.id, chiaVersion.name, chiaVersion.description]];

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));
  };

  this.empty = function(){ $(divId_filterTable).empty(); };

  this.show = function(){ $(divId_filterContainer).show(); };
  this.hide = function(){ $(divId_filterContainer).hide(); };
};
