var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};

/*
  This class manages data.
*/

ZIGVU.DataManager.DataManager = function() {
  var self = this;

  this.eventManager = undefined;

  // ----------------------------------------------
  // stores
  this.filterStore = new ZIGVU.DataManager.Stores.FilterStore();
  this.dataStore = new ZIGVU.DataManager.Stores.DataStore();

  this.ajaxHandler = new ZIGVU.DataManager.AjaxHandler();
  self.ajaxHandler
    .setFilterStore(self.filterStore)
    .setDataStore(self.dataStore);

  // ----------------------------------------------
  // accessors
  this.filterAccessor = new ZIGVU.DataManager.Accessors.FilterAccessor();
  self.filterAccessor
    .setFilterStore(self.filterStore)
    .setDataStore(self.dataStore);

  this.annotationDataAccessor = new ZIGVU.DataManager.Accessors.AnnotationDataAccessor();
  self.annotationDataAccessor
    .setFilterStore(self.filterStore)
    .setDataStore(self.dataStore)
    .setAjaxHandler(self.ajaxHandler);
  
  this.localizationDataAccessor = new ZIGVU.DataManager.Accessors.LocalizationDataAccessor();
  self.localizationDataAccessor
    .setFilterStore(self.filterStore)
    .setDataStore(self.dataStore);
  
  this.timelineChartDataAccessor = new ZIGVU.DataManager.Accessors.TimelineChartDataAccessor();
  self.timelineChartDataAccessor
    .setFilterStore(self.filterStore)
    .setDataStore(self.dataStore);


  // ----------------------------------------------
  // General calls

  this.getModifiedFrameNumber = function(videoId, frameNumber){
    var detectionRate = self.dataStore.videoDataMap[videoId].detection_frame_rate;
    var fn = (frameNumber - 1) - ((frameNumber - 1) % detectionRate) + 1;
    return fn;
  };

  this.createDetectableDecorations = function(){
    return self.annotationDataAccessor.createDetectableDecorations();
  };

  // ----------------------------------------------
  // Annotation data
  this.getAnno_annotationDetectables = function(){
    return self.annotationDataAccessor.getDetectables();
  };

  this.getAnno_annotations = function(videoId, frameNumber){
    return self.annotationDataAccessor.getAnnotations(videoId, frameNumber);
  };

  this.setAnno_saveAnnotations = function(videoId, frameNumber, annotationObjs){
    return self.annotationDataAccessor.saveAnnotations(videoId, frameNumber, annotationObjs);
  };

  this.getAnno_selectedAnnotationDetails = function(){
    return self.annotationDataAccessor.getSelectedAnnotationDetails();
  };

  this.getAnno_anotationDetails = function(detId){
    return self.annotationDataAccessor.getAnnotationDetails(detId);
  };

  // ----------------------------------------------
  // Localization data

  this.getData_heatmapDataPromise = function(videoId, frameNumber){
    var fn = self.getModifiedFrameNumber(videoId, frameNumber);
    return self.ajaxHandler.getHeatmapDataPromise(videoId, fn);
  };

  this.getData_localizationsData = function(videoId, frameNumber){
    var fn = self.getModifiedFrameNumber(videoId, frameNumber);
    return self.localizationDataAccessor.getLocalizations(videoId, fn);
  };

  this.getData_allLocalizationsDataPromise = function(videoId, frameNumber){
    var fn = self.getModifiedFrameNumber(videoId, frameNumber);
    return self.ajaxHandler.getAllLocalizationsPromise(videoId, fn);
  };

  this.getData_chiaVersions = function(){
    return self.localizationDataAccessor.getChiaVersions();
  };

  this.getData_videoDataMap = function(){
    return self.localizationDataAccessor.getVideoDataMap();
  };

  this.getData_dataSummary = function(){
    return self.localizationDataAccessor.getDataSummary();
  };
  this.getData_cellMap = function(){
    return self.localizationDataAccessor.getCellMap();
  };
  this.getData_colorMap = function(){
    return self.localizationDataAccessor.getColorMap();
  };

  this.getData_localizationDetails = function(detId){
    return self.localizationDataAccessor.getLocalizationDetails(detId);
  };

  this.getData_currentVideoState = function(videoId, frameNumber){
    return self.localizationDataAccessor.getCurrentVideoState(videoId, frameNumber);
  };

  // ----------------------------------------------
  // Filter data

  this.setFilter_chiaVersionIdLocalization = function(chiaVersionId){
    return self.filterAccessor.setChiaVersionIdLocalization(chiaVersionId);
  };
  this.getFilter_chiaVersionLocalization = function(){
    return self.filterAccessor.getChiaVersionLocalization();
  };

  this.setFilter_chiaVersionIdAnnotation = function(chiaVersionId){
    return self.filterAccessor.setChiaVersionIdAnnotation(chiaVersionId);
  };
  this.getFilter_chiaVersionIdAnnotation = function(chiaVersionId){
    return self.filterAccessor.getChiaVersionIdAnnotation();
  };
  this.getFilter_chiaVersionAnnotation = function(){
    return self.filterAccessor.getChiaVersionAnnotation();
  };

  this.setFilter_localizationDetectableIds = function(detectableIds){
    return self.filterAccessor.setLocalizationDetectableIds(detectableIds);
  };
  this.getFilter_localizationSelectedDetectables = function(){
    return self.filterAccessor.getLocalizationSelectedDetectables();
  };

  this.setFilter_localizationSettings = function(localizationSettings){
    return self.filterAccessor.setLocalizationSettings(localizationSettings);
  };
  this.getFilter_localizationSettings = function(){
    return self.filterAccessor.getLocalizationSettings();
  };

  // ----------------------------------------------
  // Timeline chart
  this.tChart_createData = function(){
    return self.timelineChartDataAccessor.createChartData(
      self.localizationDataAccessor, self.filterAccessor
    );
  };


  this.tChart_getNewPlayPosition = function(videoId, frameNumber, numOfFrames){
    return self.timelineChartDataAccessor.getNewPlayPosition(videoId, frameNumber, numOfFrames);
  };

  this.tChart_getHitPlayPosition = function(videoId, frameNumber, forwardDirection){
    return self.timelineChartDataAccessor.getHitPlayPosition(videoId, frameNumber, forwardDirection);
  };

  this.tChart_getCounter = function(videoId, frameNumber){
    return self.timelineChartDataAccessor.getCounter(videoId, frameNumber);
  };

  this.tChart_getVideoIdFrameNumber = function(counter){
    return self.timelineChartDataAccessor.getVideoIdFrameNumber(counter);
  };

  this.tChart_getTimelineChartData = function(){
    return self.timelineChartDataAccessor.getTimelineChartData();
  };

  // ----------------------------------------------
  // event handling
  function updateAnnoListSelected(detectableId){
    self.filterStore.currentAnnotationDetId = detectableId;
    self.filterStore.heatmap.detectable_id = detectableId;
  };

  function updateScaleSelected(scale){
    self.filterStore.heatmap.scale = scale;
  };

  function updateZdistThreshSelected(zdistThresh){
    self.filterStore.heatmap.zdist_thresh = zdistThresh;
  };

  //------------------------------------------------
  // set relations
  this.setEventManager = function(em){
    self.eventManager = em;
    self.eventManager.addAnnoListSelectedCallback(updateAnnoListSelected);
    self.eventManager.addScaleSelectedCallback(updateScaleSelected);
    self.eventManager.addZdistThreshSelectedCallback(updateZdistThreshSelected);
    return self;
  };

  this.resetFilters = function(){
    self.dataStore.reset();
    self.filterStore.reset();
  }

  //------------------------------------------------
  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.DataManager.DataManager -> ' + errorReason);
  };
};