var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};

/*
  This class manages data.
*/

ZIGVU.DataManager.DataManager = function() {
  var _this = this;
  var chiaId, zdistThresh;
  var detectableList, localizations, annotations, videoDataMap;
  var annotationDetectableId;

  this.ajaxHandler = new ZIGVU.DataManager.AjaxHandler();

  this.setChiaId = function(cId){ chiaId = cId; };
  this.getChiaId = function(){ return chiaId; };
  this.setChiaSettings = function(cSettings){ 
    zdistThresh = cSettings.zdistThresh; 
  };
  this.getZdistThresh = function(){ return zdistThresh; }

  this.setAnnotationDetectableId = function(detId){ annotationDetectableId = detId; };
  this.getAnnotationDetectableId = function(){ return annotationDetectableId; };

  this.setDetectableList = function(dl){ detectableList = dl; };
  this.getDetectableList = function(){ return detectableList; };
  this.getDetectableName = function(detId){ return detectableList[detId].name;}
  this.getDetectableColor = function(detId){ return detectableList[detId].color;}

  this.getVideoDataMap = function(){ return videoDataMap; };
  this.getVideoIds = function(){ return Object.keys(localizations); };

  this.getLocalizations = function(videoId, frameNumber){
    if(localizations[videoId] === undefined || localizations[videoId][frameNumber] === undefined){
      return [];
    }
    return localizations[videoId][frameNumber];
  };

  
  this.loadLocalizationPromise = function(filterObject){
    var dataURL = '/api/v1/filters/filtered_data';
    var dataParam = {filter: filterObject.getFilters()};

    var requestDefer = Q.defer();
    var requestPromise = this.ajaxHandler.getRequestPromise(dataURL, dataParam);
    requestPromise.then(function(loc){
      localizations = loc.localizations;
      // annotations = loc.annotations;
      requestDefer.resolve(_this.getVideoIds());
    }, function(errorReason){
      requestDefer.reject('ZIGVU.ChartManager.DataManager ->' + errorReason);
    });

    return requestDefer.promise;
  };

  this.loadVideoDataMapPromise = function(videoIds){
    var dataURL = '/api/v1/filters/video_data_map';
    var dataParam = {video_ids: videoIds};

    var requestDefer = Q.defer();
    var requestPromise = this.ajaxHandler.getRequestPromise(dataURL, dataParam);
    requestPromise.then(function(vmap){
      videoDataMap = vmap.video_data_map;
      requestDefer.resolve(videoDataMap);
    }, function(errorReason){
      requestDefer.reject('ZIGVU.ChartManager.DataManager ->' + errorReason);
    });

    return requestDefer.promise;
  };


};