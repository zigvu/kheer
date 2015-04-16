var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};

/*
  This class handles talking with rails server.
*/

ZIGVU.DataManager.AjaxHandler = function() {
  var _this = this;

  this.dataStore = undefined;
  this.filterStore = undefined;

  this.getChiaVersionsPromise = function(){
    var dataURL = '/api/v1/filters/chia_versions';
    var dataParam = {};

    var requestDefer = Q.defer();
    if(this.dataStore.chiaVersions !== undefined){
      requestDefer.resolve(_this.dataStore.chiaVersions);
    } else {
      this.getGETRequestPromise(dataURL, dataParam)
        .then(function(data){
          _this.dataStore.chiaVersions = data;
          requestDefer.resolve(_this.dataStore.chiaVersions);
        })
        .catch(function (errorReason) {
          requestDefer.reject('ZIGVU.DataManager.AjaxHandler ->' + errorReason);
        });
    }

    return requestDefer.promise;
  };

  this.getDetectablesPromise = function(){
    var dataURL = '/api/v1/filters/detectables';
    var dataParam = {chia_version_id: this.filterStore.chiaVersionId};

    var requestDefer = Q.defer();
    if(this.filterStore.chiaVersionId === undefined){
      requestDefer.reject('ZIGVU.DataManager.AjaxHandler -> No chia version filter found');
    } else if(this.dataStore.detectables !== undefined){
      requestDefer.resolve(_this.dataStore.detectables);
    } else {
      this.getGETRequestPromise(dataURL, dataParam)
        .then(function(data){
          _this.dataStore.addDetectablesWithColor(data);
          requestDefer.resolve(_this.dataStore.detectables);
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

    if(this.dataStore.chiaVersions === undefined){
      requestDefer.reject('ZIGVU.DataManager.AjaxHandler -> No chia versions data found');
    } else {
      var settings = _.find(this.dataStore.chiaVersions, function(chiaVersion){
        return chiaVersion.id == _this.filterStore.chiaVersionId; 
      }).settings;
      requestDefer.resolve(settings);
    }

    return requestDefer.promise;
  };

  this.getDataSummaryPromise = function(){
    var dataURL = '/api/v1/filters/filtered_summary';
    var dataParam = {filter: this.filterStore.getCurrentFilterParams()};

    var requestDefer = Q.defer();
    if(this.filterStore === undefined){
      requestDefer.reject('ZIGVU.DataManager.AjaxHandler -> Filter could not be constructed');
    } else {
      this.getPOSTRequestPromise(dataURL, dataParam)
        .then(function(data){
          _this.dataStore.dataSummary = data;
          requestDefer.resolve(_this.dataStore.dataSummary);
        })
        .catch(function (errorReason) {
          requestDefer.reject('ZIGVU.DataManager.AjaxHandler ->' + errorReason);
        });
    }

    return requestDefer.promise;
  };

  this.getFullDataPromise = function(){
    var dataURL = '/api/v1/filters/filtered_data';
    var dataParam = {filter: this.filterStore.getCurrentFilterParams()};

    var requestDefer = Q.defer();
    if(this.filterStore === undefined){
      requestDefer.reject('ZIGVU.DataManager.AjaxHandler -> Filter could not be constructed');
    } else {
      this.getPOSTRequestPromise(dataURL, dataParam)
        .then(function(data){
          _this.dataStore.dataFullLocalizations = data.localizations;
          _this.dataStore.dataFullAnnotations = data.annotations;

          // also get video data map
          var videoIds = Object.keys(data.localizations);
          dataURL = '/api/v1/filters/video_data_map';
          dataParam = {video_ids: videoIds};

          return _this.getPOSTRequestPromise(dataURL, dataParam)
        })
        .then(function(data){
          _this.dataStore.videoDataMap = data.video_data_map;
          requestDefer.resolve(_this.dataStore.videoDataMap);
        })
        .catch(function (errorReason) {
          requestDefer.reject('ZIGVU.DataManager.AjaxHandler ->' + errorReason);
        });
    }
    return requestDefer.promise;
  };

  this.getAnnotationSavePromise = function(bboxes){
    var dataURL = '/api/v1/frames/update_annotations';
    var dataParam = {annotations: bboxes};

    return this.getPOSTRequestPromise(dataURL, dataParam);
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
    this.filterStore = fs;
    return this;
  };

  this.setDataStore = function(ds){
    this.dataStore = ds;
    return this;
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.DataManager.DataManager -> ' + errorReason);
  };
};