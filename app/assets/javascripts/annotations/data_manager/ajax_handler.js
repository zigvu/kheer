var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};

/*
  This class handles talking with rails server.
*/

ZIGVU.DataManager.AjaxHandler = function() {
  var self = this;

  this.dataStore = undefined;
  this.filterStore = undefined;

  this.getChiaVersionsPromise = function(){
    var dataURL = '/api/v1/filters/chia_versions';
    var dataParam = {};

    var requestDefer = Q.defer();
    if(self.dataStore.chiaVersions !== undefined){
      requestDefer.resolve(self.dataStore.chiaVersions);
    } else {
      self.getGETRequestPromise(dataURL, dataParam)
        .then(function(data){
          self.dataStore.chiaVersions = data;
          requestDefer.resolve(self.dataStore.chiaVersions);
        })
        .catch(function (errorReason) {
          requestDefer.reject('ZIGVU.DataManager.AjaxHandler ->' + errorReason);
        });
    }

    return requestDefer.promise;
  };

  this.getDetectablesPromise = function(){
    var dataURL = '/api/v1/filters/detectables';
    var dataParam = {chia_version_id: self.filterStore.chiaVersionId};

    var requestDefer = Q.defer();
    if(self.filterStore.chiaVersionId === undefined){
      requestDefer.reject('ZIGVU.DataManager.AjaxHandler -> No chia version filter found');
    } else if(self.dataStore.detectables !== undefined){
      requestDefer.resolve(self.dataStore.detectables);
    } else {
      self.getGETRequestPromise(dataURL, dataParam)
        .then(function(data){
          self.dataStore.addDetectablesWithColor(data);
          requestDefer.resolve(self.dataStore.detectables);
        })
        .catch(function (errorReason) {
          requestDefer.reject('ZIGVU.DataManager.AjaxHandler ->' + errorReason);
        });
    }

    return requestDefer.promise;
  };

  this.getLocalizationPromise = function(){
    // NOTE: currently all localization information is gotten without AJAX
    // this might change in the future, so need to use promises
    var requestDefer = Q.defer();

    if(self.dataStore.chiaVersions === undefined){
      requestDefer.reject('ZIGVU.DataManager.AjaxHandler -> No chia versions data found');
    } else {
      var settings = _.find(self.dataStore.chiaVersions, function(chiaVersion){
        return chiaVersion.id == self.filterStore.chiaVersionId; 
      }).settings;
      requestDefer.resolve(settings);
    }

    return requestDefer.promise;
  };

  this.getDataSummaryPromise = function(){
    var dataURL = '/api/v1/filters/filtered_summary';
    var dataParam = {filter: self.filterStore.getCurrentFilterParams()};

    var requestDefer = Q.defer();
    if(self.filterStore === undefined){
      requestDefer.reject('ZIGVU.DataManager.AjaxHandler -> Filter could not be constructed');
    } else {
      self.getPOSTRequestPromise(dataURL, dataParam)
        .then(function(data){
          self.dataStore.dataSummary = data;
          requestDefer.resolve(self.dataStore.dataSummary);
        })
        .catch(function (errorReason) {
          requestDefer.reject('ZIGVU.DataManager.AjaxHandler ->' + errorReason);
        });
    }

    return requestDefer.promise;
  };

  this.getFullDataPromise = function(){
    var dataURL = '/api/v1/filters/filtered_data';
    var dataParam = {filter: self.filterStore.getCurrentFilterParams()};

    var requestDefer = Q.defer();
    if(self.filterStore === undefined){
      requestDefer.reject('ZIGVU.DataManager.AjaxHandler -> Filter could not be constructed');
    } else {
      self.getPOSTRequestPromise(dataURL, dataParam)
        .then(function(data){
          self.dataStore.dataFullLocalizations = data.localizations;
          self.dataStore.dataFullAnnotations = data.annotations;

          // also get video data map
          var videoIds = Object.keys(data.localizations);
          dataURL = '/api/v1/filters/video_data_map';
          dataParam = {video_ids: videoIds};

          return self.getPOSTRequestPromise(dataURL, dataParam)
        })
        .then(function(data){
          self.dataStore.videoDataMap = data.video_data_map;
          requestDefer.resolve(self.dataStore.videoDataMap);
        })
        .catch(function (errorReason) {
          requestDefer.reject('ZIGVU.DataManager.AjaxHandler ->' + errorReason);
        });
    }
    return requestDefer.promise;
  };

  this.getAnnotationSavePromise = function(annotationsData){
    var dataURL = '/api/v1/frames/update_annotations';
    var dataParam = {annotations: annotationsData};

    return self.getPOSTRequestPromise(dataURL, dataParam);
  };

  // note: while jquery ajax return promises, they are deficient
  // and we need to convert to `q` based promises
  this.getGETRequestPromise = function(url, params){
    var requestDefer = Q.defer();
    $.ajax({
      url: url,
      data: params,
      type: "GET",
      success: function(json){ requestDefer.resolve(json) },
      error: function( xhr, status, errorThrown ) {
        requestDefer.reject("ZIGVU.DataManager.AjaxHandler: " + errorThrown);
      }
    });
    return requestDefer.promise;
  };

  this.getPOSTRequestPromise = function(url, params){
    var requestDefer = Q.defer();
    $.ajax({
      url: url,
      data: params,
      type: "POST",
      success: function(json){ requestDefer.resolve(json) },
      error: function( xhr, status, errorThrown ) {
        requestDefer.reject("ZIGVU.DataManager.AjaxHandler: " + errorThrown);
      }
    });
    return requestDefer.promise;
  };

  // set relations
  this.setFilterStore = function(fs){
    self.filterStore = fs;
    return self;
  };

  this.setDataStore = function(ds){
    self.dataStore = ds;
    return self;
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.DataManager.AjaxHandler -> ' + errorReason);
  };
};