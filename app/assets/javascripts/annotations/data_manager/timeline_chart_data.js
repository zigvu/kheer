var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};

/*
  This class stores data needed for timeline charts.
*/

/*
  Data structure:
  [Note: Ruby style hash (:keyname => value) implies that raw id are used as keys of objects.
  JS style hash implies that (keyname: value) text are used as keys of objects.]

  counterDataMap: [{name:, color:, values: [{counter: score:}, ]}, ]
  videoIdFrameNumberCounterMap: {:video_id => {:frame_number => counter}}
  counterVideoIdFrameNumberMap: {:counter => {video_id: , frame_number:}}
*/

ZIGVU.DataManager.TimelineChartData = function() {
  var self = this;

  this.counterDataMap = undefined;
  this.videoIdFrameNumberCounterMap = undefined;
  this.counterVideoIdFrameNumberMap = undefined;

  this.getNewPlayPosition = function(videoId, frameNumber, numOfFrames){
    var counter = self.getCounter(videoId, frameNumber);
    var newCounter = counter + numOfFrames;
    if(newCounter < _.first(self.counterDataMap[0].values).counter){
      newCounter = _.first(self.counterDataMap[0].values).counter;
    }
    return self.getVideoIdFrameNumber(newCounter);
  };

  this.getHitPlayPosition = function(videoId, frameNumber, forwardDirection){
    var curCounter = self.getCounter(videoId, frameNumber);
    var differentCounters = [];
    _.each(self.counterDataMap, function(clsData){
      var values = clsData.values;
      if(forwardDirection){
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
      minMaxCounter = forwardDirection ? _.min(differentCounters) : _.max(differentCounters);
    } else {
      var v = self.counterDataMap[0].values;
      minMaxCounter = forwardDirection ? _.last(v).counter : _.first(v).counter;
    }
    return self.getVideoIdFrameNumber(minMaxCounter);
  };

  this.getCounter = function(videoId, frameNumber){
    var counter = self.videoIdFrameNumberCounterMap[videoId][frameNumber];
    if(!counter){ counter = _.first(self.counterDataMap[0].values).counter; }
    return counter;
  };
  this.getVideoIdFrameNumber = function(counter){
    return self.counterVideoIdFrameNumberMap[counter];
  };

  this.getTimelineChartData = function(){
    return self.counterDataMap;
  };

  this.reset = function(){
    self.counterDataMap = undefined;
    self.videoIdFrameNumberCounterMap = undefined;
    self.counterVideoIdFrameNumberMap = undefined;
  };
};