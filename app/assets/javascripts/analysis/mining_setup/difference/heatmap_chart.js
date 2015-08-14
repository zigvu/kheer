var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.MiningSetup = ZIGVU.Analysis.MiningSetup || {};

var MiningSetup = ZIGVU.Analysis.MiningSetup;
MiningSetup.Difference = MiningSetup.Difference || {};

/*
  D3 Heatmap chart for plotting Difference
*/

MiningSetup.Difference.HeatmapChart = function(dataManager) {
  var self = this;

  this.eventManager = undefined;

  //------------------------------------------------
  // set up

  // div for chart
  var heatmap_div = '#d3-heatmap-chart';
  var divWidth = $(heatmap_div).parent().width();
  var numOfRows = dataManager.getNumRows();
  var numOfCols = dataManager.getNumCols();

  var heatmapData = dataManager.getHeatmapData();
  var heatmapRowLabel = dataManager.getHeatmapRowLabels();
  var heatmapColLabel = dataManager.getHeatmapColLabels();

  // python command: matplotlib.colors.rgb2hex(pylab.cm.jet(0.1))
  var heatmapColors = [
    '#000080', '#0000f1', '#004dff', '#00b1ff', '#29ffce',
    '#7dff7a', '#ceff29', '#ffc400', '#ff6800', '#f10800'
  ];
  var heatmapColorsDomain = $.map(heatmapColors, function(val, i){
    return Math.round(10 * i / (heatmapColors.length))/10;
  });
  var heatmapColorScale = d3.scale.linear().domain(heatmapColorsDomain).range(heatmapColors);
  //------------------------------------------------


  //------------------------------------------------
  // set gemoetry
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
      width = divWidth - margin.left - margin.right,
      gridWidth = Math.floor(width / numOfCols),
      gridHeight = gridWidth,
      height = gridHeight * numOfRows;

  var legendStartX = width + 5,
      legendTotalHeight = height,
      legendWidth = 15,
      legendHeight = Math.round(height/(heatmapColors.length));
  //------------------------------------------------

  //------------------------------------------------
  // start drawing
  var heatmapSVG = d3.select(heatmap_div).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("class", "heatmap-chart")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var heatmap = heatmapSVG.selectAll(".heatmap")
      .data(heatmapData, function(d){ return d.row + ':' + d.col; })
    .enter().append("rect")
      .attr("x", function(d) { return d.col * gridWidth; })
      .attr("y", function(d) { return d.row * gridHeight; })
      .attr("rx", 2).attr("ry", 2)
      .attr("class", "heatmap bordered")
      .attr("width", gridWidth)
      .attr("height", gridHeight)
      .style("fill", "blue")
      .on("click", function(d){ self.handleCellClick(d); });

  heatmap.append("title")
    .text(function(d) { 
      return "" + d.name + 
        "\n Count: " + d.count + 
        "\n Value: " + d3.format(',%')(d.value); 
    });

  heatmap
    .transition()
      .duration(750)
      .style("fill", function(d) { return heatmapColorScale(d.value); });

  var colLabelSVG = heatmapSVG.selectAll(".heatmap-col-label")
      .data(heatmapColLabel)
    .enter().append("text")
      .text(function(d) { return d; })
      .attr("x", function(d, i) { return i * gridWidth; })
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + gridWidth / 2 + ", -10)")
      .attr("class","mono");

  var rowLabelSVG = heatmapSVG.selectAll(".heatmap-row-label")
      .data(heatmapRowLabel)
    .enter().append("text")
      .text(function(d) { return d; })
      .attr("x", 0)
      .attr("y", function(d, i) { return i * gridHeight; })
      .style("text-anchor", "middle")
      .attr("transform", "translate(-10," + gridHeight / 2 + ")")
      .attr("class","mono");

  var legend = heatmapSVG.selectAll(".legend")
      .data([].concat(heatmapColorScale.domain()), function(d) { return d; })
    .enter().append("g")
      .attr("class", "legend");

  legend.append("rect")
      .attr("class", "legend")
      .attr("x", legendStartX)
      .attr("y", function(d, i) { return legendTotalHeight - legendHeight * (i+1); })
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", function(d, i) { return heatmapColors[i]; });

  legend.append("text")
      .attr("class", "legend")
      .text(function(d) { 
        if ((d * 10) % 2 == 0){ return d3.format(',%')(d); } 
        else { return ""; }
      })
      .attr("x", legendStartX + legendWidth + 2)
      .attr("y", function(d, i) { 
        return legendTotalHeight - legendHeight * i; 
      });

  // manually push 100% label
  legend.append("text")
      .attr("class", "legend")
      .text(d3.format(',%')(1))
      .attr("x", legendStartX + legendWidth + 2)
      .attr("y", legendTotalHeight - legendHeight * heatmapColors.length + 10);
  //------------------------------------------------
  
  //------------------------------------------------
  // repainting and loading new data
  this.repaint = function(){
    heatmapData = dataManager.getHeatmapData();

    heatmap.data(heatmapData, function(d){ return d.row + ':' + d.col; });
    heatmap.select("title")
      .text(function(d) { 
        return "" + d.name + 
          "\n Count: " + d.count + 
          "\n Value: " + d3.format(',%')(d.value); 
      });

    heatmap
      .transition()
        .duration(750)
        .style("fill", function(d) { return heatmapColorScale(d.value); });
  };

  this.handleCellClick = function(d){
    dataManager.handleCellClick(d.row, d.col);
  };
  //------------------------------------------------

  //------------------------------------------------
  // set relations
  this.setEventManager = function(em){
    self.eventManager = em;
    self.eventManager.addRedrawHeatmapCallback(self.repaint);
    return self;
  };
};

