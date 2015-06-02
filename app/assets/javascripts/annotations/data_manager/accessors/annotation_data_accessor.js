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
    return self.dataStore.detectables.annotation;
  };

  // ----------------------------------------------
  // video clip mapping
  this.getVideoIdVideoFN = function(clipId, clipFN){
    var clip = self.dataStore.videoClipMap.clipMap[clipId];
    var videoId = clip.video_id;
    var videoFN = clipFN + clip.clip_fn_start;
    return { video_id: videoId, video_fn: videoFN };
  };
  
  // ----------------------------------------------
  // annotaitons raw data

  this.getAnnotations = function(clipId, clipFN){
    var vfn = self.getVideoIdVideoFN(clipId, clipFN);
    var videoId = vfn.video_id;
    var videoFN = vfn.video_fn;

    var anno = self.dataStore.dataFullAnnotations;
    if(anno[videoId] === undefined || anno[videoId][videoFN] === undefined){ return []; }
    return anno[videoId][videoFN];
  };

  this.saveAnnotations = function(clipId, clipFN, annotationObjs){
    var vfn = self.getVideoIdVideoFN(clipId, clipFN);
    var videoId = vfn.video_id;
    var videoFN = vfn.video_fn;

    // put in video_id and video_fn for each object
    _.each(annotationObjs.deleted_polys, function(ao){
      _.extend(ao, { video_id: videoId, video_fn: videoFN });
    });
    _.each(annotationObjs.new_polys, function(ao){
      _.extend(ao, { video_id: videoId, video_fn: videoFN });
    });

    // update internal data structure
    var anno = self.dataStore.dataFullAnnotations;
    if(anno[videoId] === undefined){ anno[videoId] = {}; }
    if(anno[videoId][videoFN] === undefined){ anno[videoId][videoFN] = {}; }

    // update - deleted annotations
    _.each(annotationObjs.deleted_polys, function(ao){
      var idx = -1;
      _.find(anno[videoId][videoFN][ao.detectable_id], function(a, i, l){
        if((a.x0 == ao.x0) && (a.y0 == ao.y0) && (a.x1 == ao.x1) && 
          (a.x2 == ao.x2) && (a.x3 == ao.x3)) { idx = i; return true; }
        return false;
      });
      if(idx != -1){ anno[videoId][videoFN][ao.detectable_id].splice(idx, 1); }
    });

    // update - new annotations
    _.each(annotationObjs.new_polys, function(ao){
      if(anno[videoId][videoFN][ao.detectable_id] === undefined){
        anno[videoId][videoFN][ao.detectable_id] = []; 
      }
      anno[videoId][videoFN][ao.detectable_id].push(ao);
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
      title: self.dataStore.detectables.decorations[detId].pretty_name,
      color: self.dataStore.detectables.decorations[detId].annotation_color
    };
  };

  //------------------------------------------------
  // create decorations
    this.createDetectableDecorations = function(){
    var colorCreator = self.dataStore.colorCreator;
    var textFormatters = self.dataStore.textFormatters;

    self.dataStore.detectables.decorations = {};
    var decorations = self.dataStore.detectables.decorations;
    
    // provide color to annotation list first
    _.each(self.dataStore.detectables.annotation, function(d){
      var decos = {
        pretty_name: textFormatters.ellipsisForAnnotation(d.pretty_name),
        button_color: colorCreator.getColorButton(),
        button_hover_color: colorCreator.getColorButtonHover(),
        annotation_color: colorCreator.getColorAnnotation(),
        chart_color: colorCreator.getColorChart()
      };

      colorCreator.nextColor();
      decorations[d.id] = _.extend(d, decos);
    });

    // provide color to localization list second
    _.each(self.dataStore.detectables.localization, function(d){
      // skip if already in decoration map
      if(_.has(decorations, d.id)){ return; }
      // else, continue
      var decos = {
        pretty_name: textFormatters.ellipsisForAnnotation(d.pretty_name),
        button_color: colorCreator.getColorButton(),
        button_hover_color: colorCreator.getColorButtonHover(),
        annotation_color: colorCreator.getColorAnnotation(),
        chart_color: colorCreator.getColorChart()
      };

      colorCreator.nextColor();
      decorations[d.id] = _.extend(d, decos);
    });

    // finally, provide color to alllist
    _.each(self.dataStore.detectables.alllist, function(d){
      // skip if already in decoration map
      if(_.has(decorations, d.id)){ return; }
      // else, continue
      var decos = {
        pretty_name: textFormatters.ellipsisForAnnotation(d.pretty_name),
        button_color: colorCreator.getColorButton(),
        button_hover_color: colorCreator.getColorButtonHover(),
        annotation_color: colorCreator.getColorAnnotation(),
        chart_color: colorCreator.getColorChart()
      };

      colorCreator.nextColor();
      decorations[d.id] = _.extend(d, decos);
    });
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