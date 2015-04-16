var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};
ZIGVU.ChartManager.ChartFilters = ZIGVU.ChartManager.ChartFilters || {};

/*
  This class handles creating and updating all visual elements of filters
*/

ZIGVU.ChartManager.ChartFilters.FilterManager = function() {
  var self = this;
  this.videoLoadDefer = undefined;
  this.filterResetDefer = undefined;
  this.dataManager = undefined;
  this.htmlGenerator = new ZIGVU.ChartManager.HtmlGenerator();

  this.filterStartButton = new ZIGVU.ChartManager.ChartFilters.FilterStartButton(self.htmlGenerator);
  this.filterChiaVersions = new ZIGVU.ChartManager.ChartFilters.FilterChiaVersions(self.htmlGenerator);
  this.filterDetectables = new ZIGVU.ChartManager.ChartFilters.FilterDetectables(self.htmlGenerator);
  this.filterLocalizations = new ZIGVU.ChartManager.ChartFilters.FilterLocalizations(self.htmlGenerator);
  this.filterDataLoader = new ZIGVU.ChartManager.ChartFilters.FilterDataLoader(self.htmlGenerator);

  this.startFilter = function(){
    self.filterStartButton.displayInput(undefined)
      .then(function(data){ self.getChiaVersions(); })
      .catch(function (errorReason) { self.err(errorReason); });
  };

  this.getChiaVersions = function(){
    self.dataManager.ajaxHandler.getChiaVersionsPromise()
      .then(function(chiaVersions){
        self.filterStartButton.hide();
        self.filterChiaVersions.show();
        return self.filterChiaVersions.displayInput(chiaVersions);
      })
      .then(function(response){
        if(response.status){
          self.dataManager.filterStore.chiaVersionId = response.data;
          var selectedChiaVersion = self.dataManager.getFilteredChiaVersion();
          self.filterChiaVersions.displayInfo(selectedChiaVersion);
          self.getDetectables();
        } else {
          self.reset();
          self.startFilter();
        }
      })
      .catch(function (errorReason) { self.err(errorReason); });    
  };

  this.getDetectables = function(){
    self.dataManager.ajaxHandler.getDetectablesPromise()
      .then(function(detectables){
        self.filterDetectables.show();
        return self.filterDetectables.displayInput(detectables);
      })
      .then(function(response){
        if(response.status){
          self.dataManager.filterStore.detectableIds = response.data;
          var selectedDetectables = self.dataManager.getFilteredDetectables();
          self.filterDetectables.displayInfo(selectedDetectables);
          self.getLocalizations();
        } else {
          self.reset();
          self.startFilter();
        }
      })
      .catch(function (errorReason) { self.err(errorReason); });    
  };

  this.getLocalizations = function(){
    self.dataManager.ajaxHandler.getLocalizationPromise()
      .then(function(localizations){
        self.filterLocalizations.show();
        return self.filterLocalizations.displayInput(localizations);
      })
      .then(function(response){
        if(response.status){
          self.dataManager.filterStore.localizations = response.data;
          var selectedLocalizations = self.dataManager.getFilteredLocalization();
          self.filterLocalizations.displayInfo(selectedLocalizations);
          self.getDataLoader();
        } else {
          self.reset();
          self.startFilter();
        }
      })
      .catch(function (errorReason) { self.err(errorReason); }); 
  };

  this.getDataLoader = function(){
    self.dataManager.ajaxHandler.getDataSummaryPromise()
      .then(function(dataSummary){
        self.filterDataLoader.show();
        return self.filterDataLoader.displayInput(dataSummary);
      })
      .then(function(response){
        if(response.status){
          var dataSummary = self.dataManager.dataStore.dataSummary;
          self.filterDataLoader.displayInfo(dataSummary, self.filterResetDefer);
          self.videoLoadDefer.resolve(true);
        } else {
          self.reset();
          self.startFilter();
        }
      })
      .catch(function (errorReason) { self.err(errorReason); }); 
  };

  this.reset = function(){
    self.filterStartButton.show();
    self.filterChiaVersions.hide();
    self.filterDetectables.hide();
    self.filterLocalizations.hide();
    self.filterDataLoader.hide();

    self.dataManager.resetFilters();
  };

  this.setDefers = function(vld, frd){
    self.videoLoadDefer = vld;
    self.filterResetDefer = frd;
  };

  this.setDataManager = function(dm){
    self.dataManager = dm;
    return self;
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.ChartManager.ChartFilters.FilterManager -> ' + errorReason);
  };
};