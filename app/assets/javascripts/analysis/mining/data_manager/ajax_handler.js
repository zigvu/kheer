var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.DataManager = Mining.DataManager || {};

/*
  This class handles talking with rails server.
*/

Mining.DataManager.AjaxHandler = function() {
  var self = this;

  this.dataStore = undefined;
  this.filterStore = undefined;

  this.getMiningDataPromise = function(miningId, setId){
    var dataURL = '/api/v1/minings/show';
    var dataParam = {mining_id: miningId, set_id: setId};

    var requestDefer = Q.defer();
    self.getGETRequestPromise(dataURL, dataParam)
      .then(function(data){
        self.dataStore.miningData = data;
        // get full localizations
        dataURL = '/api/v1/minings/full_localizations';
        return self.getGETRequestPromise(dataURL, dataParam)
      })
      .then(function(data){
        self.dataStore.dataFullLocalizations = data;
        // get full annotations
        dataURL = '/api/v1/minings/full_annotations';
        return self.getGETRequestPromise(dataURL, dataParam)
      })
      .then(function(data){
        self.dataStore.dataFullAnnotations = data;
        // get color map
        dataURL = '/api/v1/minings/color_map';
        return self.getGETRequestPromise(dataURL, dataParam)
      })
      .then(function(data){
        self.dataStore.colorMap = data;
        // get cell map
        dataURL = '/api/v1/minings/cell_map';
        return self.getGETRequestPromise(dataURL, dataParam)
      })
      .then(function(data){
        self.dataStore.cellMap = data;

        requestDefer.resolve();
      })
      .catch(function (errorReason) {
        requestDefer.reject('Mining.DataManager.AjaxHandler ->' + errorReason);
      });

    return requestDefer.promise;
  };

  this.getAnnotationSavePromise = function(annotationsData){
    var dataURL = '/api/v1/frames/update_annotations';
    var dataParam = {annotations: annotationsData};

    return self.getPOSTRequestPromise(dataURL, dataParam);
  };

  this.getHeatmapDataPromise = function(videoId, videoFN){
    var chiaVersionId = self.dataStore.miningData.chiaVersions.localization.id;
    var detectableId = self.filterStore.heatmap.detectable_id;
    var scale = self.filterStore.heatmap.scale;

    var dataURL = '/api/v1/frames/heatmap_data';
    var dataParam = {
      heatmap: {
        chia_version_id: chiaVersionId,
        video_id: videoId,
        video_fn: videoFN,
        scale: scale,
        detectable_id: detectableId
      }
    };

    return self.getGETRequestPromise(dataURL, dataParam);
  };

  this.getAllLocalizationsPromise = function(videoId, videoFN){
    var requestDefer = Q.defer();

    var chiaVersionId = self.dataStore.miningData.chiaVersions.localization.id;
    var zdistThresh = self.filterStore.heatmap.zdist_thresh;

    var dataURL = '/api/v1/frames/localization_data';
    var dataParam = {
      localization: {
        chia_version_id: chiaVersionId,
        video_id: videoId,
        video_fn: videoFN,
        zdist_thresh: zdistThresh
      }
    };
    self.getGETRequestPromise(dataURL, dataParam)
      .then(function(data){
        var localizations = [];
        if((data.localizations[videoId] !== undefined) && 
          (data.localizations[videoId][videoFN] !== undefined)){ 
          localizations = data.localizations[videoId][videoFN];
        }
        requestDefer.resolve(localizations);
      })
      .catch(function (errorReason) {
        requestDefer.reject('Mining.DataManager.AjaxHandler ->' + errorReason);
      });

    return requestDefer.promise;
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
        requestDefer.reject("Mining.DataManager.AjaxHandler: " + errorThrown);
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
        requestDefer.reject("Mining.DataManager.AjaxHandler: " + errorThrown);
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
    displayJavascriptError('Mining.DataManager.AjaxHandler -> ' + errorReason);
  };
};
