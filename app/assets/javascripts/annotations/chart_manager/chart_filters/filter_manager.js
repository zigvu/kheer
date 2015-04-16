var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};
ZIGVU.ChartManager.ChartFilters = ZIGVU.ChartManager.ChartFilters || {};

/*
  This class handles creating and updating all visual elements of filters
*/

ZIGVU.ChartManager.ChartFilters.FilterManager = function() {
  var _this = this;
  this.videoLoadDefer = undefined;
  this.filterResetDefer = undefined;
  this.dataManager = undefined;
  this.htmlGenerator = new ZIGVU.ChartManager.HtmlGenerator();

  this.filterStartButton = new ZIGVU.ChartManager.ChartFilters.FilterStartButton(this.htmlGenerator);
  this.filterChiaVersions = new ZIGVU.ChartManager.ChartFilters.FilterChiaVersions(this.htmlGenerator);
  this.filterDetectables = new ZIGVU.ChartManager.ChartFilters.FilterDetectables(this.htmlGenerator);
  this.filterLocalizations = new ZIGVU.ChartManager.ChartFilters.FilterLocalizations(this.htmlGenerator);
  this.filterDataLoader = new ZIGVU.ChartManager.ChartFilters.FilterDataLoader(this.htmlGenerator);

  this.startFilter = function(){
    this.filterStartButton.displayInput(undefined)
      .then(function(data){ _this.getChiaVersions(); })
      .catch(function (errorReason) { _this.err(errorReason); });
  };

  this.getChiaVersions = function(){
    this.dataManager.ajaxHandler.getChiaVersionsPromise()
      .then(function(chiaVersions){
        _this.filterStartButton.hide();
        _this.filterChiaVersions.show();
        return _this.filterChiaVersions.displayInput(chiaVersions);
      })
      .then(function(response){
        if(response.status){
          _this.dataManager.filterStore.chiaVersionId = response.data;
          var selectedChiaVersion = _this.dataManager.getFilteredChiaVersion();
          _this.filterChiaVersions.displayInfo(selectedChiaVersion);
          _this.getDetectables();
        } else {
          _this.reset();
          _this.startFilter();
        }
      })
      .catch(function (errorReason) { _this.err(errorReason); });    
  };

  this.getDetectables = function(){
    this.dataManager.ajaxHandler.getDetectablesPromise()
      .then(function(detectables){
        _this.filterDetectables.show();
        return _this.filterDetectables.displayInput(detectables);
      })
      .then(function(response){
        if(response.status){
          _this.dataManager.filterStore.detectableIds = response.data;
          var selectedDetectables = _this.dataManager.getFilteredDetectables();
          _this.filterDetectables.displayInfo(selectedDetectables);
          _this.getLocalizations();
        } else {
          _this.reset();
          _this.startFilter();
        }
      })
      .catch(function (errorReason) { _this.err(errorReason); });    
  };

  this.getLocalizations = function(){
    this.dataManager.ajaxHandler.getLocalizationPromise()
      .then(function(localizations){
        _this.filterLocalizations.show();
        return _this.filterLocalizations.displayInput(localizations);
      })
      .then(function(response){
        if(response.status){
          _this.dataManager.filterStore.localizations = response.data;
          var selectedLocalizations = _this.dataManager.getFilteredLocalization();
          _this.filterLocalizations.displayInfo(selectedLocalizations);
          _this.getDataLoader();
        } else {
          _this.reset();
          _this.startFilter();
        }
      })
      .catch(function (errorReason) { _this.err(errorReason); }); 
  };

  this.getDataLoader = function(){
    this.dataManager.ajaxHandler.getDataSummaryPromise()
      .then(function(dataSummary){
        _this.filterDataLoader.show();
        return _this.filterDataLoader.displayInput(dataSummary);
      })
      .then(function(response){
        if(response.status){
          var dataSummary = _this.dataManager.dataStore.dataSummary;
          _this.filterDataLoader.displayInfo(dataSummary, _this.filterResetDefer);
          _this.videoLoadDefer.resolve(true);
        } else {
          _this.reset();
          _this.startFilter();
        }
      })
      .catch(function (errorReason) { _this.err(errorReason); }); 
  };

  this.reset = function(){
    this.filterStartButton.show();
    this.filterChiaVersions.hide();
    this.filterDetectables.hide();
    this.filterLocalizations.hide();
    this.filterDataLoader.hide();

    this.dataManager.resetFilters();
  };

  this.setDefers = function(vld, frd){
    this.videoLoadDefer = vld;
    this.filterResetDefer = frd;
  };

  this.setDataManager = function(dm){
    this.dataManager = dm;
    return this;
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.ChartManager.ChartFilters.FilterManager -> ' + errorReason);
  };
};