var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.DataManager = Mining.DataManager || {};
Mining.DataManager.Accessors = Mining.DataManager.Accessors || {};

/*
  This class accesses data needed for timeline charts.
*/

Mining.DataManager.Accessors.TimelineChartDataAccessor = function() {
  var self = this;

  this.dataStore = undefined;
  this.filterStore = undefined;

  // first and last counter
  this.firstCounter = undefined;
  this.lastCounter = undefined;

  this.getNumOfSelectedDetIds = function(){
    return self.dataStore.miningData.selectedDetIds.length;
  };

  this.createChartDataLoc = function(localizationDataAccessor){
    // initialize
    self.dataStore.tChartDataLoc = [];
    self.dataStore.toCounterMap = {};
    self.dataStore.fromCounterMap = {};

    // short hand
    var vf2cm = self.dataStore.toCounterMap;
    var cm2vf = self.dataStore.fromCounterMap;

    var detectableIds = self.dataStore.miningData.selectedDetIds;
    var sortedClipIds = self.dataStore.videoClipMap.sortedClipIds;
    
    // loop through all filtered detectables
    _.each(detectableIds, function(detId, idx, list){
      var name = self.dataStore.detectables.decorations[detId].pretty_name;
      var color = self.dataStore.detectables.decorations[detId].chart_color;

      // d3 chart data expectations
      var values = [], counter = 0;
      var clipNumOfFrames, score;
      _.each(sortedClipIds, function(clipId){
        var clip = self.dataStore.videoClipMap.clipMap[clipId];
        clipNumOfFrames = clip.clip_fn_end - clip.clip_fn_start;

        // _.range is not inclusive
        _.each(_.range(0, clipNumOfFrames + 1), function(clipFN){

          // max scores
          score = localizationDataAccessor.getMaxScore(clipId, clipFN, detId);
          values.push({counter: counter++, score: score, det_idx: idx});

          // create maps beteween clipId/clipFN and counter
          if(!vf2cm[clipId]){ vf2cm[clipId] = {}; }
          if(!vf2cm[clipId][clipFN]){ vf2cm[clipId][clipFN] = counter - 1; }
          if(!cm2vf[counter - 1]){ cm2vf[counter - 1] = {clip_id: clipId, clip_fn: clipFN}; }
        });
      });
      self.dataStore.tChartDataLoc.push({name: name, color: color, values: values});
    });

    self.firstCounter = _.first(self.dataStore.tChartDataLoc[0].values).counter;
    self.lastCounter = _.last(self.dataStore.tChartDataLoc[0].values).counter;
  };

  this.createChartDataAnno = function(annotationDataAccessor){
    // initialize
    self.dataStore.tChartDataAnno = [];

    // short hand
    var cm2vf = self.dataStore.fromCounterMap;

    var name = "Annotations";
    var color = "rgb(0,0,0)";

    // d3 chart data expectations
    var values = [], score, annos;
    // loop through all counters
    _.each(cm2vf, function(clipIdClipFn, counter){
      score = 0;
      annos = annotationDataAccessor.getAnnotations(clipIdClipFn.clip_id, clipIdClipFn.clip_fn);
      _.find(annos, function(anno, detectableId){
        if(anno.length > 0){ score = 1; return true; }
      });
      values.push({counter: +counter, score: score, det_idx: 0});
    });

    self.dataStore.tChartDataAnno.push({name: name, color: color, values: values});    
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

  this.getHitLocPlayPosition = function(clipId, clipFN, direction){
    // direction == true if forward direction search

    var curCounter = self.getCounter(clipId, clipFN);
    // each class will have next hit at different positions - get the min/max
    // position by traversing data for all classes
    var differentCounters = [];
    _.each(self.dataStore.tChartDataLoc, function(clsData){
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

  this.getHitAnnoPlayPosition = function(clipId, clipFN, direction){
    // direction == true if forward direction search

    var curCounter = self.getCounter(clipId, clipFN);
    var values = self.dataStore.tChartDataAnno[0].values;

    if(direction){
      for(var i = curCounter + 1; i < values.length; i++){
        if(values[i].score > 0){ curCounter = i; break; }
      }
    } else {
      for(var i = curCounter - 1; i >= 0; i--){
        if(values[i].score > 0){ curCounter = i; break; }
      }
    }

    return self.getClipIdClipFN(curCounter);
  };

  this.getCounter = function(clipId, clipFN){
    var counter = self.dataStore.toCounterMap[clipId][clipFN];
    if(!counter){ counter = self.firstCounter; }
    return counter;
  };

  this.isValidClipIdClipFn = function(clipId, clipFN){
    if(self.dataStore.toCounterMap[clipId] !== undefined && 
      self.dataStore.toCounterMap[clipId][clipFN] !== undefined){ return true; }
    return false;
  };

  this.getClipIdClipFN = function(counter){
    return self.dataStore.fromCounterMap[counter];
  };

  this.getTimelineChartDataLoc = function(){
    return self.dataStore.tChartDataLoc;
  };

  this.getTimelineChartDataAnno = function(){
    return self.dataStore.tChartDataAnno;
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