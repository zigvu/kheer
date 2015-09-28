var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.ChartManager = Mining.ChartManager || {};
Mining.ChartManager.ChartFilters = Mining.ChartManager.ChartFilters || {};

/*
  Filter to display current frame status
*/

Mining.ChartManager.ChartFilters.FilterFrame = function(htmlGenerator) {
  var self = this;
  this.dataManager = undefined;
  this.eventManager = undefined;

  // change background color of timeline chart
  var isBackgroundColorWhite = true;
  $("#d3-video-timeline-chart-background-color-button").click(function(){
    if(isBackgroundColorWhite){
      $('#d3-video-timeline-chart .timeline-context-chart rect.bg-rect').css('fill', 'black');
      $('#d3-video-timeline-chart .timeline-focus-chart rect.bg-rect').css('fill', 'black');
    } else {
      $('#d3-video-timeline-chart .timeline-context-chart rect.bg-rect').css('fill', 'white');
      $('#d3-video-timeline-chart .timeline-focus-chart rect.bg-rect').css('fill', 'white');
    }
    isBackgroundColorWhite = !isBackgroundColorWhite;
  });

  // handle frame jumps
  $("#d3-video-jump-to-frame-button").click(function(){
    var clipId = parseInt($('#jump_clip_id').val());
    var clipFn = parseInt($('#jump_clip_frame_number').val());
    console.log("Jump request to: ClipId:" + clipId + ", ClipFn:" + clipFn);

    if(self.dataManager.tChart_isValidClipIdClipFn(clipId, clipFn)){
      var counter = self.dataManager.tChart_getCounter(clipId, clipFn);
      var clipIdClipFN = self.dataManager.tChart_getClipIdClipFN(counter);
      self.eventManager.fireFrameNavigateCallback(clipIdClipFN);
    } else {
      alert("Jump location not valid!");
    }
  });

  this.empty = function(){ };

  this.show = function(){ };
  this.hide = function(){ };

  //------------------------------------------------
  // set relations
  this.setEventManager = function(em){
    self.eventManager = em;
    return self;
  };

  this.setDataManager = function(dm){
    self.dataManager = dm;
    return self;
  };
};
