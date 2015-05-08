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
  this.eventManager = undefined;
  this.htmlGenerator = new ZIGVU.ChartManager.HtmlGenerator();

  this.filterStartButton = new ZIGVU.ChartManager.ChartFilters.FilterStartButton(self.htmlGenerator);
  this.filterChiaVersionsLocalization = new ZIGVU.ChartManager.ChartFilters.FilterChiaVersionsLocalization(self.htmlGenerator);
  this.filterDetectables = new ZIGVU.ChartManager.ChartFilters.FilterDetectables(self.htmlGenerator);
  this.filterLocalizationSettings = new ZIGVU.ChartManager.ChartFilters.FilterLocalizationSettings(self.htmlGenerator);
  this.filterChiaVersionsAnnotation = new ZIGVU.ChartManager.ChartFilters.FilterChiaVersionsAnnotation(self.htmlGenerator);
  this.filterDataLoader = new ZIGVU.ChartManager.ChartFilters.FilterDataLoader(self.htmlGenerator);

  this.filterFrameScales = new ZIGVU.ChartManager.ChartFilters.FilterFrameScales(self.htmlGenerator);
  this.filterFrameZdistThresh = new ZIGVU.ChartManager.ChartFilters.FilterFrameZdistThresh(self.htmlGenerator);

  this.filterStatusVideo = new ZIGVU.ChartManager.ChartFilters.FilterStatusVideo(self.htmlGenerator);

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
          self.dataManager.setFilter_chiaVersionIdLocalization(response.data);
          var selectedChiaVersion = self.dataManager.getFilter_chiaVersionLocalization();

          self.filterChiaVersionsLocalization.displayInfo(selectedChiaVersion);
          self.filterFrameScales.displayInput(selectedChiaVersion.settings.scales);
          self.filterFrameZdistThresh.displayInput(selectedChiaVersion.settings.zdistThresh);

          self.getLocalizationDetectables();
        } else {
          self.reset();
          self.startFilter();
        }
      })
      .catch(function (errorReason) { self.err(errorReason); });    
  };

  this.getLocalizationDetectables = function(){
    self.dataManager.ajaxHandler.getLocalizationDetectablesPromise()
      .then(function(detectables){
        self.filterDetectables.show();
        return self.filterDetectables.displayInput(detectables);
      })
      .then(function(response){
        if(response.status){
          self.dataManager.setFilter_localizationDetectableIds(response.data);
          var selectedDetectables = self.dataManager.getFilter_localizationSelectedDetectables();
          self.filterDetectables.displayInfo(selectedDetectables);
          self.getLocalizationSettings();
        } else {
          self.reset();
          self.startFilter();
        }
      })
      .catch(function (errorReason) { self.err(errorReason); });    
  };

  this.getLocalizationSettings = function(){
    self.dataManager.ajaxHandler.getLocalizationSettingsPromise()
      .then(function(localizationSettings){
        self.filterLocalizationSettings.show();
        return self.filterLocalizationSettings.displayInput(localizationSettings);
      })
      .then(function(response){
        if(response.status){
          self.dataManager.setFilter_localizationSettings(response.data);
          var selectedLocalizationSettings = self.dataManager.getFilter_localizationSettings();

          self.filterLocalizationSettings.displayInfo(selectedLocalizationSettings);
          self.getChiaVersionsAnnotation();
        } else {
          self.reset();
          self.startFilter();
        }
      })
      .catch(function (errorReason) { self.err(errorReason); }); 
  };

  this.getChiaVersionsAnnotation = function(){
    var chiaVersions = self.dataManager.getData_chiaVersions();
    self.filterChiaVersionsAnnotation.show();
    self.filterChiaVersionsAnnotation.displayInput(chiaVersions)
      .then(function(response){
        if(response.status){
          self.dataManager.setFilter_chiaVersionIdAnnotation(response.data);
          var selectedChiaVersion = self.dataManager.getFilter_chiaVersionAnnotation();

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
          var dataSummary = self.dataManager.getData_dataSummary();
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
    self.filterLocalizationSettings.hide();
    self.filterChiaVersionsAnnotation.hide();
    self.filterDataLoader.hide();

    self.dataManager.resetFilters();
  };

  this.setDefers = function(vld, frd){
    self.videoLoadDefer = vld;
    self.filterResetDefer = frd;
  };

  //------------------------------------------------
  // set relations
  this.setEventManager = function(em){
    self.eventManager = em;
    self.filterFrameScales.setEventManager(self.eventManager);
    self.filterFrameZdistThresh.setEventManager(self.eventManager);
    self.filterStatusVideo.setEventManager(self.eventManager);
    return self;
  };

  this.setDataManager = function(dm){
    self.dataManager = dm;
    self.filterStatusVideo.setDataManager(self.dataManager);
    return self;
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.ChartManager.ChartFilters.FilterManager -> ' + errorReason);
  };
};