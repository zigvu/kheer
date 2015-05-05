var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};
ZIGVU.DataManager.Accessors = ZIGVU.DataManager.Accessors || {};

/*
  This class accesses data related to localization.
*/

ZIGVU.DataManager.Accessors.AnnotationDataAccessor = function() {
  var self = this;

  this.filterStore = undefined;
  this.dataStore = undefined;
  this.ajaxHandler = undefined;

  // ----------------------------------------------
  // chia data
  this.getDetectables = function(){
    // TODO: change to annotaiton
    return self.dataStore.detectables;
  };
  

  // ----------------------------------------------
  // annotaitons raw data

  this.getAnnotations = function(videoId, frameNumber){
    var anno = self.dataStore.dataFullAnnotations;
    if(anno[videoId] === undefined || anno[videoId][frameNumber] === undefined){ return []; }
    return anno[videoId][frameNumber];
  };

  this.saveAnnotations = function(videoId, frameNumber, annotationObjs){
    // update internal data structure
    var anno = self.dataStore.dataFullAnnotations;
    if(anno[videoId] === undefined){ anno[videoId] = {}; }
    if(anno[videoId][frameNumber] === undefined){ anno[videoId][frameNumber] = {}; }

    // update - deleted annotations
    _.each(annotationObjs.deleted_polys, function(ao){
      var idx = -1;
      _.find(anno[videoId][frameNumber][ao.detectable_id], function(a, i, l){
        if((a.x0 == ao.x0) && (a.y0 == ao.y0) && (a.x1 == ao.x1) && 
          (a.x2 == ao.x2) && (a.x3 == ao.x3)) { idx = i; return true; }
        return false;
      });
      if(idx != -1){ anno[videoId][frameNumber][ao.detectable_id].splice(idx, 1); }
    });

    // update - deleted annotations
    _.each(annotationObjs.new_polys, function(ao){
      if(anno[videoId][frameNumber][ao.detectable_id] === undefined){
        anno[videoId][frameNumber][ao.detectable_id] = []; 
      }
      anno[videoId][frameNumber][ao.detectable_id].push(ao);
    });

    // save to database
    self.ajaxHandler.getAnnotationSavePromise(annotationObjs)
      .then(function(status){ console.log(status); })
      .catch(function (errorReason) { self.err(errorReason); }); 
  };

  this.getSelectedAnnotationDetails = function(){
    return self.getAnnotationDetails(self.filterStore.currentAnnotationDetId);
  };

  this.getAnnotationDetails = function(detId){
    return {
      id: detId,
      title: self.dataStore.detectablesMap[detId].pretty_name,
      color: self.dataStore.detectablesMap[detId].annotation_color
    };
  };

  //------------------------------------------------
  // set relations
  this.setFilterStore = function(fs){
    self.filterStore = fs;
    return self;
  };

  this.setDataStore = function(ds){
    self.dataStore = ds;
    return self;
  };

  this.setAjaxHandler = function(ah){
    self.ajaxHandler = ah;
    return self;
  };
};