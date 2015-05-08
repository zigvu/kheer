var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};
ZIGVU.DataManager.Accessors = ZIGVU.DataManager.Accessors || {};

/*
  This class accesses data related to localization.
*/

ZIGVU.DataManager.Accessors.LocalizationDataAccessor = function() {
  var self = this;

  this.filterStore = undefined;
  this.dataStore = undefined;

  // ----------------------------------------------
  // chia data
  this.getChiaVersions = function(){
    return self.dataStore.chiaVersions;
  };

  // ----------------------------------------------
  // video data mapping
  this.sortedVideoIds = undefined;
  this.getSortedVideoIds = function(){
    if(self.sortedVideoIds === undefined){
      var sIds = _.map(Object.keys(self.dataStore.videoDataMap), function(id){ return parseInt(id); });
      self.sortedVideoIds = _.sortBy(sIds, function(id){ return id; });
    }
    return self.sortedVideoIds;
  };
  this.getFrameNumberStart = function(videoId){ 
    return self.dataStore.videoDataMap[videoId].frame_number_start; 
  };
  this.getFrameNumberEnd = function(videoId){ 
    return self.dataStore.videoDataMap[videoId].frame_number_end; 
  };

  this.getVideoDataMap = function(){
    return self.dataStore.videoDataMap;
  };

  // ----------------------------------------------
  // detectable mapping
  this.getLocalizationDetails = function(detId){
    return {
      id: detId,
      title: self.dataStore.detectables.decorations[detId].pretty_name,
      color: self.dataStore.detectables.decorations[detId].annotation_color
    };
  };


  // ----------------------------------------------
  // localization raw data
  this.getMaxProbScore = function(videoId, frameNumber, detId){
    var score = 0;
    if((self.dataStore.dataFullLocalizations[videoId]) &&
      (self.dataStore.dataFullLocalizations[videoId][frameNumber]) &&
      (self.dataStore.dataFullLocalizations[videoId][frameNumber][detId])){
      var detScores = self.dataStore.dataFullLocalizations[videoId][frameNumber][detId];
      score = _.max(detScores, function(ds){ return ds.prob_score; }).prob_score;
    }
    return score;
  };

  this.getDataSummary = function(){
    return self.dataStore.dataSummary;
  };

  this.getLocalizations = function(videoId, frameNumber){
    var loc = self.dataStore.dataFullLocalizations;
    if(loc[videoId] === undefined || loc[videoId][frameNumber] === undefined){ return []; }
    return loc[videoId][frameNumber];
  };

  //------------------------------------------------
  // for heatmap

  this.getCellMap = function(){
    return self.dataStore.cellMap;
  };
  this.getColorMap = function(){
    return self.dataStore.colorMap;
  };
  //------------------------------------------------
  // for video status
  this.getCurrentVideoState = function(videoId, frameNumber){
    var collectionId = self.dataStore.videoDataMap[videoId].video_collection_id;

    // compute quanta frame time
    var quantaFrameNumber = frameNumber;
    var quantaFrameTime = self.dataStore.textFormatters.getReadableTime(
      1000.0 * quantaFrameNumber / self.dataStore.videoDataMap[videoId].playback_frame_rate);

    // TODO:
    var collectionFrameNumber = quantaFrameNumber;
    var collectionFrameTime = quantaFrameTime;

    // return in format usable by display JS
    return {
      video_collection_id: collectionId,
      video_collection_frame_number: collectionFrameNumber,
      video_collection_frame_time: collectionFrameTime,
      video_quanta_id: videoId,
      video_quanta_frame_number: quantaFrameNumber,
      video_quanta_frame_time: quantaFrameTime
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
};