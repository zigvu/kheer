var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};
ZIGVU.ChartManager.D3Charts = ZIGVU.ChartManager.D3Charts || {};

/*
  D3 timeline chart
*/

ZIGVU.ChartManager.D3Charts.TimelineChart = function() {
  var self = this;

  this.eventManager = undefined;
  this.dataManager = undefined;
  this.seekDisabled = true;

  var brushNumOfCounters = 500;
  var numPixelsForFocusPointer = 20;

  var divId_d3VideoTimelineChart = "#d3-video-timeline-chart";
  var divWidth = $(divId_d3VideoTimelineChart).parent().width();
  var divHeight = 70;

  //------------------------------------------------
  // set up gemoetry
  var focusMargin = {top: 5, right: 5, bottom: 5, left: 5},
    contextMargin = {top: 0, right: 5, bottom: 5, left: 5},
    focusWidth = divWidth - focusMargin.left - focusMargin.right,
    focusHeight = divHeight/2 - focusMargin.top - focusMargin.bottom,

    contextMargin = {top: 0, right: 5, bottom: 5, left: 5},
    contextWidth = divWidth - contextMargin.left - contextMargin.right,
    contextHeight = divHeight/2 - contextMargin.top - contextMargin.bottom;
  //------------------------------------------------

  //------------------------------------------------
  // define ranges
  var focusX = d3.scale.linear().range([0, focusWidth]),
    focusY = d3.scale.linear().range([focusHeight, 0]),
    contextX = d3.scale.linear().range([0, contextWidth]),
    contextY = d3.scale.linear().range([contextHeight, 0]);

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
    .y(function(d) { return contextY(d.score); });
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
      .attr("class", "focusBrushHandlePointer")
      .attr("width", 1)
      .attr("y", -3)
      .attr("height", focusHeight + 6);

  var contextChart = timelineSVG.append("g")
      .attr("class", "timeline-context-chart")
      .attr("transform", "translate(" + contextMargin.left + "," + 
        (focusHeight + focusMargin.top + focusMargin.bottom + contextMargin.top) + ")");

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
  //------------------------------------------------

  //------------------------------------------------
  // draw bars/lines

  this.draw = function(){
    var scores = self.dataManager.tChart_getTimelineChartData();
    contextX.domain([
      d3.min(scores, function(s) { return d3.min(s.values, function(v) { return v.counter; }); }),
      d3.max(scores, function(s) { return d3.max(s.values, function(v) { return v.counter; }); })
    ]);
    contextY.domain([
      d3.min(scores, function(s) { return d3.min(s.values, function(v) { return v.score; }); }),
      d3.max(scores, function(s) { return d3.max(s.values, function(v) { return v.score; }); })
    ]);

    focusX.domain(contextX.domain());
    focusY.domain(contextY.domain());

    var contextChartLines = contextChart.selectAll("path").data(scores);
    contextChartLines.enter().append("path")
        .attr("class", "line")
        .attr("d", function(d) { return contextLine(d.values); })
        .style("stroke", function(d) { return d.color; });

    var focusChartLines = focusChart.selectAll("path").data(scores);
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

  //------------------------------------------------
  // Event handling
  function updateVideoPlayerAfterBrush(counter){
    if(self.seekDisabled){ return; }

    var videoIdFrameNumber = self.dataManager.tChart_getVideoIdFrameNumber(counter);
    self.eventManager.fireFrameNavigateCallback(videoIdFrameNumber);
  };

  // this is triggered from video player
  function updateChartFromVideoPlayer(args){
    if(self.seekDisabled){ return; }

    var counter = self.dataManager.tChart_getCounter(args.video_id, args.frame_number);
    self.brushToCounter(counter);

    console.log("Frame number: " + args.frame_number + ", counter: " + counter);
  };

  //------------------------------------------------
  // set relations
  this.setEventManager = function(em){
    self.eventManager = em;
    self.eventManager.addPaintFrameCallback(updateChartFromVideoPlayer);
    return self;
  };

  this.setDataManager = function(dm){
    self.dataManager = dm;
    return self;
  };
};
