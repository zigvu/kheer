var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};
ZIGVU.DataManager.Accessors = ZIGVU.DataManager.Accessors || {};

/*
  This class accesses data needed for timeline charts.
*/

ZIGVU.DataManager.Accessors.TimelineChartDataAccessor = function() {
  var self = this;

  this.dataStore = undefined;
  this.filterStore = undefined;

  this.createChartData = function(localizationDataAccessor, filterAccessor){
    // initialize
    self.dataStore.tChartData = [];
    self.dataStore.toCounterMap = {};
    self.dataStore.fromCounterMap = {};

    // short hand
    var vfcm = self.dataStore.toCounterMap;
    var cvfm = self.dataStore.fromCounterMap;

    var detectableIds = filterAccessor.getLocalizationDetectableIds();
    var sortedVideoIds = localizationDataAccessor.getSortedVideoIds();
    
    // loop through all filtered detectables
    _.each(detectableIds, function(detId){
      var name = self.dataStore.detectablesMap[detId].pretty_name;
      var color = self.dataStore.detectablesMap[detId].annotation_color;

      // d3 chart data expectations
      var values = [], counter = 0;
      var frameNumberStart, frameNumberEnd, maxProbScore;
      _.each(sortedVideoIds, function(videoId){
        frameNumberStart = localizationDataAccessor.getFrameNumberStart(videoId);
        frameNumberEnd = localizationDataAccessor.getFrameNumberEnd(videoId);

        _.each(_.range(frameNumberStart, frameNumberEnd + 1), function(frameNumber){

          // max prob scores
          maxProbScore = localizationDataAccessor.getMaxProbScore(videoId, frameNumber, detId);
          values.push({counter: counter++, score: maxProbScore});

          // create maps beteween videoId/frameNumber and counter
          if(!vfcm[videoId]){ vfcm[videoId] = {}; }
          if(!vfcm[videoId][frameNumber]){ vfcm[videoId][frameNumber] = counter - 1; }
          if(!cvfm[counter - 1]){ cvfm[counter - 1] = {video_id: videoId, frame_number: frameNumber}; }
        });
      });
      self.dataStore.tChartData.push({name: name, color: color, values: values});
    });
  };

  this.getNewPlayPosition = function(videoId, frameNumber, numOfFrames){
    var counter = self.getCounter(videoId, frameNumber);
    var newCounter = counter + numOfFrames;
    if(newCounter < _.first(self.dataStore.tChartData[0].values).counter){
      newCounter = _.first(self.dataStore.tChartData[0].values).counter;
    }
    return self.getVideoIdFrameNumber(newCounter);
  };

  this.getHitPlayPosition = function(videoId, frameNumber, direction){
    // direction == true if forward direction search

    var curCounter = self.getCounter(videoId, frameNumber);
    var differentCounters = [];
    _.each(self.dataStore.tChartData, function(clsData){
      var values = clsData.values;
      if(direction){
        for(var i = curCounter + 1; i < values.length; i++){
          if(values[i].score > 0){ differentCounters.push(values[i].counter); break; }
        }
      } else {
        for(var i = curCounter - 1; i >= 0; i--){
          if(values[i].score > 0){ differentCounters.push(values[i].counter); break; }
        }
      }
    });
    var minMaxCounter = 0;
    if(differentCounters.length > 0){ 
      minMaxCounter = direction ? _.min(differentCounters) : _.max(differentCounters);
    } else {
      var v = self.dataStore.tChartData[0].values;
      minMaxCounter = direction ? _.last(v).counter : _.first(v).counter;
    }
    return self.getVideoIdFrameNumber(minMaxCounter);
  };

  this.getCounter = function(videoId, frameNumber){
    var counter = self.dataStore.toCounterMap[videoId][frameNumber];
    if(!counter){ counter = _.first(self.dataStore.tChartData[0].values).counter; }
    return counter;
  };

  this.getVideoIdFrameNumber = function(counter){
    return self.dataStore.fromCounterMap[counter];
  };

  this.getTimelineChartData = function(){
    return self.dataStore.tChartData;
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