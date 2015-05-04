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
  this.filterChiaVersionsLocalization = new ZIGVU.ChartManager.ChartFilters.FilterChiaVersionsLocalization(self.htmlGenerator);
  this.filterDetectables = new ZIGVU.ChartManager.ChartFilters.FilterDetectables(self.htmlGenerator);
  this.filterLocalizations = new ZIGVU.ChartManager.ChartFilters.FilterLocalizations(self.htmlGenerator);
  this.filterChiaVersionsAnnotation = new ZIGVU.ChartManager.ChartFilters.FilterChiaVersionsAnnotation(self.htmlGenerator);
  this.filterDataLoader = new ZIGVU.ChartManager.ChartFilters.FilterDataLoader(self.htmlGenerator);

  this.filterScales = new ZIGVU.ChartManager.ChartFilters.FilterScales(self.htmlGenerator);

  this.startFilter = function(){
    self.filterStartButton.displayInput(undefined)
      .then(function(data){ self.getChiaVersionsLocalization(); })
      .catch(function (errorReason) { self.err(errorReason); });
  };

  this.getChiaVersionsLocalization = function(){
    self.dataManager.ajaxHandler.getChiaVersionsPromise()
      .then(function(chiaVersions){
        self.filterStartButton.hide();
        self.filterChiaVersionsLocalization.show();
        return self.filterChiaVersionsLocalization.displayInput(chiaVersions);
      })
      .then(function(response){
        if(response.status){
          self.dataManager.filterStore.chiaVersionIdLocalization = response.data;
          var selectedChiaVersion = _.find(self.dataManager.dataStore.chiaVersions, function(cv){
            return cv.id == self.dataManager.filterStore.chiaVersionIdLocalization; 
          });

          self.filterChiaVersionsLocalization.displayInfo(selectedChiaVersion);
          self.filterScales.displayInput(selectedChiaVersion.settings.scales);
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
          self.getChiaVersionsAnnotation();
        } else {
          self.reset();
          self.startFilter();
        }
      })
      .catch(function (errorReason) { self.err(errorReason); }); 
  };

  this.getChiaVersionsAnnotation = function(){
    var chiaVersions = self.dataManager.dataStore.chiaVersions;
    self.filterChiaVersionsAnnotation.show();
    self.filterChiaVersionsAnnotation.displayInput(chiaVersions)
      .then(function(response){
        if(response.status){
          self.dataManager.filterStore.chiaVersionIdAnnotation = response.data;
          var selectedChiaVersion = _.find(self.dataManager.dataStore.chiaVersions, function(cv){
            return cv.id == self.dataManager.filterStore.chiaVersionIdAnnotation; 
          });

          self.filterChiaVersionsAnnotation.displayInfo(selectedChiaVersion);
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
    self.filterChiaVersionsLocalization.hide();
    self.filterDetectables.hide();
    self.filterLocalizations.hide();
    self.filterChiaVersionsAnnotation.hide();
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