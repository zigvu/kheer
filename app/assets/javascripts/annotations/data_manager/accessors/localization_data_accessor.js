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

  this.getSortedVideoIds = function(){
    var sIds = _.map(Object.keys(self.dataStore.videoDataMap), function(id){ return parseInt(id); });
    sIds = _.sortBy(sIds, function(id){ return id; });
    return sIds;
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
  this.getDetectableName = function(detId){ 
    self.dataStore.detectablesMap[detId].pretty_name;
  };
  this.getDetectableColor = function(detId){ 
    self.dataStore.detectablesMap[detId].annotation_color;
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