var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};

/*
  This class manages data.
*/

ZIGVU.DataManager.DataManager = function() {
  var _this = this;
  
  this.dataStore = new ZIGVU.DataManager.DataStore();
  this.filterStore = new ZIGVU.DataManager.FilterStore();
  this.ajaxHandler = new ZIGVU.DataManager.AjaxHandler();
  this.ajaxHandler
    .setDataStore(this.dataStore)
    .setFilterStore(this.filterStore);

  this.getLocalizations = function(videoId, frameNumber){
    var loc = this.dataStore.dataFullLocalizations;
    if(loc[videoId] === undefined || loc[videoId][frameNumber] === undefined){ return []; }
    return loc[videoId][frameNumber];
  };

  this.getAnnotations = function(videoId, frameNumber){
    var anno = this.dataStore.dataFullAnnotations;
    if(anno[videoId] === undefined || anno[videoId][frameNumber] === undefined){ return []; }
    return anno[videoId][frameNumber];
  };

  this.saveAnnotations = function(videoId, frameNumber, annotationObjs){
    var annosToSaveToDb = [];

    var objDecorations = {
      video_id: videoId,
      frame_number: frameNumber,
      chia_version_id: this.filterStore.chiaVersionId
    };

    var anno = this.dataStore.dataFullAnnotations;
    if(anno[videoId] === undefined){
      anno[videoId] = {}; 
    }
    // since we get all annotaitons for the frame, reset original
    anno[videoId][frameNumber] = {}; 
    _.each(annotationObjs, function(annoObj){
      var newAnnotation = _.extend(annoObj, objDecorations);
      if (anno[videoId][frameNumber][annoObj.detectable_id] === undefined){ 
        anno[videoId][frameNumber][annoObj.detectable_id] = [];
      }
      anno[videoId][frameNumber][annoObj.detectable_id].push(newAnnotation);
      annosToSaveToDb.push(newAnnotation);
    });
    // save to database
    this.ajaxHandler.getAnnotationSavePromise(annosToSaveToDb)
      .then(function(status){ console.log(status); })
      .catch(function (errorReason) { _this.err(errorReason); }); 
  };

  this.getSelectedAnnotationDetails = function(){
    if(this.filterStore.currentAnnotationDetId === undefined){
      err('No annotation class selected');
    } else {
      return this.getAnnotationDetails(this.filterStore.currentAnnotationDetId);
    }
  };

  this.getAnnotationDetails = function(detId){
    return {
      id: detId,
      title: this.dataStore.detectablesMap[detId].pretty_name,
      color: this.dataStore.detectablesMap[detId].annotation_color
    };
  }

  this.getFilteredChiaVersion = function(){
    if(this.filterStore.chiaVersionId === undefined){
      err('No chia version filter found');
    } else if(this.dataStore.chiaVersions === undefined){
      err('No chia versions data found');
    } else {
      return _.find(this.dataStore.chiaVersions, function(chiaVersion){
        return chiaVersion.id == _this.filterStore.chiaVersionId; 
      });
    }
    return undefined;
  };

  this.getFilteredDetectables = function(){
    if(this.filterStore.detectableIds === undefined){
      err('No detectable ids filter found');
    } else if(this.dataStore.detectables === undefined){
      err('No detectables data found');
    } else {
      return _.filter(_this.dataStore.detectables, function(detectable){
        return _.contains(_this.filterStore.detectableIds, detectable.id);
      });
    }
    return undefined;
  };


  this.getFilteredLocalization = function(){
    if(this.filterStore.localizations === undefined){
      err('No localizations filter found');
    } else {
      return this.filterStore.localizations;
    }
    return undefined;
  };

  this.resetFilters = function(){
    this.dataStore.reset();
    this.filterStore.reset();
  }

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.DataManager.DataManager -> ' + errorReason);
  };
};