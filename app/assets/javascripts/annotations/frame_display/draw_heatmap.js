var ZIGVU = ZIGVU || {};
ZIGVU.FrameDisplay = ZIGVU.FrameDisplay || {};

/*
  Handler to draw heatmap.
*/

ZIGVU.FrameDisplay.DrawHeatmap = function() {
  var self = this;

  this.canvas = document.getElementById("heatmapCanvas");
  this.ctx = self.canvas.getContext("2d");

  this.dataManager = undefined;
  var heatmapDrawn = false;

  var heatCell = new ZIGVU.FrameDisplay.Shapes.HeatCell();

  this.drawHeatmap = function(videoId, frameNumber){
    self.clear();
    self.dataManager.getData_heatmapDataPromise(videoId, frameNumber)
      .then(function(heatmapData){
        var cellMap = self.dataManager.getData_cellMap();
        var colorMap = self.dataManager.getData_colorMap();

        _.each(heatmapData.scores, function(score, idx, list){
          var cell = cellMap[idx];
          var color = colorMap[score];
          heatCell.draw(self.ctx, cell, color);
        });
        heatmapDrawn = true;
      })
      .catch(function (errorReason) { self.err(errorReason); }); 
  }

  this.clear = function(){
    if(heatmapDrawn){
      // clear existing content
      self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
      heatmapDrawn = false;
    }
  };

  // set relations
  this.setDataManager = function(dm){
    self.dataManager = dm;
    return self;
  };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.FrameDisplay.DrawHeatmap -> ' + errorReason);
  };
};
