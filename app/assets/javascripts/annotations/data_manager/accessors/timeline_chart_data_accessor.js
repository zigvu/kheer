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

  // first and last counter
  this.firstCounter = undefined;
  this.lastCounter = undefined;

  this.createChartData = function(localizationDataAccessor, filterAccessor){
    // initialize
    self.dataStore.tChartData = [];
    self.dataStore.toCounterMap = {};
    self.dataStore.fromCounterMap = {};

    // short hand
    var vf2cm = self.dataStore.toCounterMap;
    var cm2vf = self.dataStore.fromCounterMap;

    var detectableIds = filterAccessor.getLocalizationDetectableIds();
    var sortedClipIds = self.dataStore.videoClipMap.sortedClipIds;
    
    // loop through all filtered detectables
    _.each(detectableIds, function(detId){
      var name = self.dataStore.detectables.decorations[detId].pretty_name;
      var color = self.dataStore.detectables.decorations[detId].chart_color;

      // d3 chart data expectations
      var values = [], counter = 0;
      var clipNumOfFrames, maxProbScore;
      _.each(sortedClipIds, function(clipId){
        var clip = self.dataStore.videoClipMap.clipMap[clipId];
        clipNumOfFrames = clip.clip_fn_end - clip.clip_fn_start;

        // _.range is not inclusive
        _.each(_.range(0, clipNumOfFrames + 1), function(clipFN){

          // max prob scores
          maxProbScore = localizationDataAccessor.getMaxProbScore(clipId, clipFN, detId);
          values.push({counter: counter++, score: maxProbScore});

          // create maps beteween clipId/clipFN and counter
          if(!vf2cm[clipId]){ vf2cm[clipId] = {}; }
          if(!vf2cm[clipId][clipFN]){ vf2cm[clipId][clipFN] = counter - 1; }
          if(!cm2vf[counter - 1]){ cm2vf[counter - 1] = {clip_id: clipId, clip_fn: clipFN}; }
        });
      });
      self.dataStore.tChartData.push({name: name, color: color, values: values});
    });

    self.firstCounter = _.first(self.dataStore.tChartData[0].values).counter;
    self.lastCounter = _.last(self.dataStore.tChartData[0].values).counter;
  };

  this.getNewPlayPosition = function(clipId, clipFN, numOfFrames){
    var counter = self.getCounter(clipId, clipFN);
    var newCounter = counter + numOfFrames;
    // wrap around - since lastCounter is inclusive and firstCounter is 0,
    // need to change index by 1
    if(newCounter < self.firstCounter){ 
      newCounter = self.lastCounter - (self.firstCounter - newCounter) + 1;
    }
    if(newCounter > self.lastCounter){ 
      newCounter = self.firstCounter + (newCounter - self.lastCounter) - 1;
    }

    return self.getClipIdClipFN(newCounter);
  };

  this.getHitPlayPosition = function(clipId, clipFN, direction){
    // direction == true if forward direction search

    var curCounter = self.getCounter(clipId, clipFN);
    // each class will have next hit at different positions - get the min/max
    // position by traversing data for all classes
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
      minMaxCounter = direction ? self.lastCounter : self.firstCounter;
    }
    return self.getClipIdClipFN(minMaxCounter);
  };

  this.getCounter = function(clipId, clipFN){
    var counter = self.dataStore.toCounterMap[clipId][clipFN];
    if(!counter){ counter = self.firstCounter; }
    return counter;
  };

  this.getClipIdClipFN = function(counter){
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