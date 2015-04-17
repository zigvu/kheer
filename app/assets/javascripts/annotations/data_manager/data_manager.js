var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};

/*
  This class manages data.
*/

ZIGVU.DataManager.DataManager = function() {
  var self = this;
  
  this.dataStore = new ZIGVU.DataManager.DataStore();
  this.filterStore = new ZIGVU.DataManager.FilterStore();
  this.ajaxHandler = new ZIGVU.DataManager.AjaxHandler();
  this.ajaxHandler
    .setDataStore(self.dataStore)
    .setFilterStore(self.filterStore);

  this.getLocalizations = function(videoId, frameNumber){
    var fn = (frameNumber - 1) - ((frameNumber - 1) % 5) + 1;
    var loc = self.dataStore.dataFullLocalizations;
    if(loc[videoId] === undefined || loc[videoId][fn] === undefined){ return []; }
    return loc[videoId][fn];
  };

  this.getAnnotations = function(videoId, frameNumber){
    var anno = self.dataStore.dataFullAnnotations;
    if(anno[videoId] === undefined || anno[videoId][frameNumber] === undefined){ return []; }
    return anno[videoId][frameNumber];
  };

  this.saveAnnotations = function(videoId, frameNumber, annotationObjs){
    var annosToSaveToDb = [];

    var objDecorations = {
      video_id: videoId,
      frame_number: frameNumber,
      chia_version_id: self.filterStore.chiaVersionId
    };

    var anno = self.dataStore.dataFullAnnotations;
    if(anno[videoId] === undefined){ anno[videoId] = {}; }
    // since we get all annotations for the frame, reset original
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
    var annoSave = {
      video_id: videoId,
      frame_number: frameNumber,
      chia_version_id: self.filterStore.chiaVersionId,
      annotations: annosToSaveToDb
    };
    self.ajaxHandler.getAnnotationSavePromise(annoSave)
      .then(function(status){ console.log(status); })
      .catch(function (errorReason) { self.err(errorReason); }); 
  };

  this.getSelectedAnnotationDetails = function(){
    if(self.filterStore.currentAnnotationDetId === undefined){
      err('No annotation class selected');
    } else {
      return self.getAnnotationDetails(self.filterStore.currentAnnotationDetId);
    }
  };

  this.getAnnotationDetails = function(detId){
    return {
      id: detId,
      title: self.dataStore.detectablesMap[detId].pretty_name,
      color: self.dataStore.detectablesMap[detId].annotation_color
    };
  }

  this.getFilteredChiaVersion = function(){
    if(self.filterStore.chiaVersionId === undefined){
      err('No chia version filter found');
    } else if(self.dataStore.chiaVersions === undefined){
      err('No chia versions data found');
    } else {
      return _.find(self.dataStore.chiaVersions, function(chiaVersion){
        return chiaVersion.id == self.filterStore.chiaVersionId; 
      });
    }
    return undefined;
  };

  this.getFilteredDetectables = function(){
    if(self.filterStore.detectableIds === undefined){
      err('No detectable ids filter found');
    } else if(self.dataStore.detectables === undefined){
      err('No detectables data found');
    } else {
      return _.filter(self.dataStore.detectables, function(detectable){
        return _.contains(self.filterStore.detectableIds, detectable.id);
      });
    }
    return undefined;
  };


  this.getFilteredLocalization = function(){
    if(self.filterStore.localizations === undefined){
      err('No localizations filter found');
    } else {
      return self.filterStore.localizations;
    }
    return undefined;
  };

  this.resetFilters = function(){
    self.dataStore.reset();
    self.filterStore.reset();
  }

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.DataManager.DataManager -> ' + errorReason);
  };
};