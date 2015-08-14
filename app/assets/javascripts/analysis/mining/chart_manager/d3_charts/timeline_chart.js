var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.ChartManager = Mining.ChartManager || {};
Mining.ChartManager.D3Charts = Mining.ChartManager.D3Charts || {};

/*
  D3 timeline chart
*/

Mining.ChartManager.D3Charts.TimelineChart = function() {
  var self = this;

  this.eventManager = undefined;
  this.dataManager = undefined;
  this.seekDisabled = true;

  var brushNumOfCounters = 500;
  var numPixelsForFocusPointer = 20;

  var divId_d3VideoTimelineChart = "#d3-video-timeline-chart";
  var divWidth = $(divId_d3VideoTimelineChart).parent().width();
  var focusBarHeight = 35;
  var contextBarHeight = 120;
  var annoBarHeight = 20;
  var divHeight = focusBarHeight + contextBarHeight + annoBarHeight;

  //------------------------------------------------
  // set up gemoetry
  var focusMargin = {top: 5, right: 5, bottom: 0, left: 5},
    focusWidth = divWidth - focusMargin.left - focusMargin.right,
    focusHeight = focusBarHeight - focusMargin.top - focusMargin.bottom,

    contextMargin = {top: 5, right: 5, bottom: 0, left: 5},
    contextWidth = divWidth - contextMargin.left - contextMargin.right,
    contextHeight = contextBarHeight - contextMargin.top - contextMargin.bottom,

    annoMargin = {top: 5, right: 5, bottom: 5, left: 5},
    annoWidth = divWidth - annoMargin.left - annoMargin.right,
    annoHeight = annoBarHeight - annoMargin.top - annoMargin.bottom;
  //------------------------------------------------

  //------------------------------------------------
  // define ranges

  // note: contextY will need to re-calculated once datamanager has data 
  var focusRangeHeight = focusHeight;
  var contextRangeHeight = contextHeight;
  var annoRangeHeight = annoHeight;

  var focusX = d3.scale.linear().range([0, focusWidth]),
    focusY = d3.scale.linear().range([focusRangeHeight, 0]),

    contextX = d3.scale.linear().range([0, contextWidth]),
    contextY = d3.scale.linear().range([contextRangeHeight, 0]),

    annoX = d3.scale.linear().range([0, annoWidth]),
    annoY = d3.scale.linear().range([annoRangeHeight, 0]);

  //------------------------------------------------

  //------------------------------------------------
  // brushing
  var contextBrush = d3.svg.brush().x(contextX)
      .on("brushstart", contextBrushedStart)
      .on("brushend", contextBrushedEnd)
      .on("brush", contextBrushed);

  function contextBrushedStart(){
    if(self.seekDisabled){ return; }

    focusBrush.clear();
    focusBrush(d3.select(".focusBrush"));
  };

  function contextBrushed(){
    if(self.seekDisabled){ return; }

    focusX.domain(contextBrush.empty() ? contextX.domain() : contextBrush.extent());
    focusChart.selectAll("path").attr("d", function(d) { return focusLine(d.values); });
  };

  function contextBrushedEnd(){
    if(self.seekDisabled){ return; }

    var brushExtent = contextBrush.extent();
    brushExtent[1] = brushExtent[0] + brushNumOfCounters;
    if(brushExtent[1] > contextX.domain()[1]){
      var diff = brushExtent[1] - contextX.domain()[1];
      brushExtent[0] -= diff;
      brushExtent[1] -= diff;
    }
    contextBrush.extent(brushExtent);
    contextBrush(d3.select(".contextBrush"));

    focusX.domain(brushExtent);
    focusChart.selectAll("path").attr("d", function(d) { return focusLine(d.values); });

    var focusBrushMid = brushExtent[0] + (brushExtent[1] - brushExtent[0])/2;
    focusBrush.extent([focusBrushMid, focusBrushMid]);
    focusBrushHandle.attr("transform", "translate(" + focusX(focusBrushMid) + ",0)");

    if(d3.event && d3.event.sourceEvent) { // not a programmatic event
      updateVideoPlayerAfterBrush(Math.round(focusBrush.extent()[0]));
      console.log("Context brush ended: " + Math.round(focusBrush.extent()[0]));
    }
  };


  var focusBrush = d3.svg.brush().x(focusX)
      .extent([0, 0])
      .on("brush", focusBrushed)
      .on("brushend", focusBrushedEnd);

  function focusBrushed(){
    if(self.seekDisabled){ return; }

    var focusBrushMid = focusBrush.extent()[0];

    if(d3.event && d3.event.sourceEvent) { // not a programmatic event
      focusBrushMid = focusX.invert(d3.mouse(this)[0]);
      focusBrush.extent([focusBrushMid, focusBrushMid]);
    }
    focusBrushHandle.attr("transform", "translate(" + focusX(focusBrushMid) + ",0)");
    contextBrushHandlePointer.attr("transform", "translate(" + contextX(focusBrushMid) + ",0)");
  };

  function focusBrushedEnd(){
    if(self.seekDisabled){ return; }

    if(d3.event && d3.event.sourceEvent) { // not a programmatic event
      updateVideoPlayerAfterBrush(Math.round(focusBrush.extent()[0]));
      console.log("Focus brush ended: " + Math.round(focusBrush.extent()[0]));
    }
  };

  this.brushToCounter = function(counter){
    if(self.seekDisabled){ return; }

    var brushExtent = contextBrush.extent();
    // if the focus chart doesn't have the counter then move context chart
    if(counter > brushExtent[1]){
      brushExtent[1] = counter + brushNumOfCounters/2;
      if(brushExtent[1] > contextX.domain()[1]){ brushExtent[1] = contextX.domain()[1]; }
      brushExtent[0] = brushExtent[1] - brushNumOfCounters;
    } else if(counter < brushExtent[0]){
      brushExtent[0] = counter - brushNumOfCounters/2;
      if(brushExtent[0] < contextX.domain()[0]){ brushExtent[0] = contextX.domain()[0]; }
      brushExtent[1] = brushExtent[0] + brushNumOfCounters;
    }

    contextBrush.extent(brushExtent);
    contextBrushedEnd();

    focusBrush.extent([counter, counter]);
    focusBrushed();
  };
  //------------------------------------------------

  //------------------------------------------------
  // lines in charts
  var focusLine = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return focusX(d.counter); })
    .y(function(d) { return focusY(d.score); });

  var contextLine = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return contextX(d.counter); })
    .y(function(d) { return (contextRangeHeight * d.det_idx) + contextY(d.score); });

  var annoLine = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return annoX(d.counter); })
    .y(function(d) { return annoY(d.score); });
  //------------------------------------------------

  //------------------------------------------------
  // start drawing
  var timelineSVG = d3.select(divId_d3VideoTimelineChart).append("svg")
      .attr("width", divWidth)
      .attr("height", divHeight);

  var focusChart = timelineSVG.append("g")
      .attr("class", "timeline-focus-chart")
      .attr("transform", "translate(" + focusMargin.left + "," + focusMargin.top + ")");

  focusChart.append("rect")
      .attr("width", focusWidth)
      .attr("height", focusHeight)
      .attr("class", "bg-rect");

  // clip prevents out-of-bounds flow of data points from chart when brushing
  focusChart.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", focusWidth)
      .attr("height", focusHeight);

  var focusBrushSVG = focusChart.append("g")
      .attr("class", "x focusBrush")
    .call(focusBrush);
  focusBrushSVG
      .selectAll(".extent,.resize")
      .remove();
  focusBrushSVG
      .select(".background")
      .attr("height", focusHeight);

  var focusBrushHandle = focusBrushSVG.append("g").attr("class", "focusBrushHandle");
  focusBrushHandle.append("rect")
      .attr("class", "focusBrushHandleRect")
      .attr("x", (-1 * numPixelsForFocusPointer/2))
      .attr("width", numPixelsForFocusPointer)
      .attr("y", -3)
      .attr("height", focusHeight + 6);
  focusBrushHandle.append("rect")
      .attr("class", "brushHandlePointer")
      .attr("width", 1)
      .attr("y", -3)
      .attr("height", focusHeight + 6);

  var contextChart = timelineSVG.append("g")
      .attr("class", "timeline-context-chart")
      .attr("transform", "translate(" + contextMargin.left + "," + 
        (focusBarHeight + contextMargin.top) + ")");

  contextChart.append("rect")
      .attr("width", contextWidth)
      .attr("height", contextHeight)
      .attr("class", "bg-rect");

  contextChart.append("g")
      .attr("class", "x contextBrush")
    .call(contextBrush)
      .selectAll("rect")
      .attr("y", -3)
      .attr("height", contextHeight + 6);

  var contextBrushHandlePointer = contextChart.append("rect")
      .attr("class", "brushHandlePointer")
      .attr("width", 1)
      .attr("y", -3)
      .attr("height", contextHeight + 6);

  var annoChart = timelineSVG.append("g")
      .attr("class", "timeline-anno-chart")
      .attr("transform", "translate(" + annoMargin.left + "," + 
        (focusBarHeight + contextBarHeight + annoMargin.top) + ")");

  annoChart.append("rect")
      .attr("width", annoWidth)
      .attr("height", annoHeight)
      .attr("class", "bg-rect");
  var annoChartLines = undefined;
  //------------------------------------------------

  //------------------------------------------------
  // draw bars/lines

  this.drawLoc = function(){
    var scoresLoc = self.dataManager.tChart_getTimelineChartDataLoc();
    contextX.domain([
      d3.min(scoresLoc, function(s) { return d3.min(s.values, function(v) { return v.counter; }); }),
      d3.max(scoresLoc, function(s) { return d3.max(s.values, function(v) { return v.counter; }); })
    ]);
    focusX.domain(contextX.domain());

    var numOfDetectables = self.dataManager.tChart_getNumOfSelectedDetIds();
    contextRangeHeight = contextHeight/numOfDetectables;
    contextY.range([contextRangeHeight, 0]).domain([0, 1]);
    focusY.domain(contextY.domain());

    var contextChartLines = contextChart.selectAll("path").data(scoresLoc);
    contextChartLines.enter().append("path")
        .attr("class", "line")
        .attr("d", function(d) { return contextLine(d.values); })
        .style("stroke", function(d) { return d.color; });

    var focusChartLines = focusChart.selectAll("path").data(scoresLoc);
    focusChartLines.enter().append("path")
        .attr("class", "line")
        .attr("clip-path", "url(#clip)")
        .attr("d", function(d) { return focusLine(d.values); })
        .style("stroke", function(d) { return d.color; });


    contextBrushedEnd();

    contextChartLines.exit().remove();
    focusChartLines.exit().remove();

    self.seekDisabled = false;
  };

  this.drawAnno = function(){
    var scoresAnno = self.dataManager.tChart_getTimelineChartDataAnno();
    annoX.domain(contextX.domain());
    annoY.domain([0, 1]);

    annoChartLines = annoChart.selectAll(".anno-lines")
        .data(scoresAnno)
      .enter().append("g")
        .attr("class", "anno-lines");

    annoChartLines.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return annoLine(d.values); })
        .style("stroke", function(d) { return d.color; });
  };

  this.reDrawAnno = function(){
    var scoresAnno = self.dataManager.tChart_getTimelineChartDataAnno();
    annoChartLines.data(scoresAnno);
    annoChartLines.select("path")
        .attr("class", "line")
        .attr("d", function(d) { return annoLine(d.values); })
        .style("stroke", function(d) { return d.color; });
  };

  //------------------------------------------------
  // Event handling
  function updateVideoPlayerAfterBrush(counter){
    if(self.seekDisabled){ return; }

    var clipIdClipFN = self.dataManager.tChart_getClipIdClipFN(counter);
    self.eventManager.fireFrameNavigateCallback(clipIdClipFN);
  };

  // this is triggered from video player
  function updateChartFromVideoPlayer(args){
    if(self.seekDisabled){ return; }

    var counter = self.dataManager.tChart_getCounter(args.clip_id, args.clip_fn);
    self.brushToCounter(counter);

    console.log("Clip ID: " + args.clip_id + ", Clip FN: " + args.clip_fn + ", Counter: " + counter);
  };

  // this is triggered from data manager
  function updateAnnoChart(args){
    if(self.seekDisabled){ return; }
    self.reDrawAnno();
  };

  // change background color
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

  //------------------------------------------------
  // set relations
  this.setEventManager = function(em){
    self.eventManager = em;
    self.eventManager.addPaintFrameCallback(updateChartFromVideoPlayer);
    self.eventManager.addUpdateAnnoChartCallback(updateAnnoChart);
    return self;
  };

  this.setDataManager = function(dm){
    self.dataManager = dm;
    return self;
  };
};
