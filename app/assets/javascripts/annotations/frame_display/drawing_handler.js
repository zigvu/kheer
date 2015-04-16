var ZIGVU = ZIGVU || {};
ZIGVU.FrameDisplay = ZIGVU.FrameDisplay || {};

/*
  Annotation creation
*/

ZIGVU.FrameDisplay.DrawingHandler = function(canvas) {
  var self = this;
  this.canvas = canvas;
  this.ctx = self.canvas.getContext("2d");

  this.dataManager = undefined;

  var polygons = [], selectedPolyId, polyIdCounter = 0;
  var currentVideoId, currentFrameNumber;

  this.imageData = undefined;
  this.needsRepainting = false;
  this.needsSaving = false;
  this.annotationMode = false;

  this.startAnnotation = function(videoId, frameNumber){
    // if previously was annotating, save that annotation
    if(self.annotationMode){ self.endAnnotation(); }
    // new annotation
    self.annotationMode = true;
    self.saveBackground();
    self.drawAnnotation(videoId, frameNumber);
    self.draw();
  };

  this.endAnnotation = function(){
    self.annotationMode = false;
    self.resetBackground();
    if(self.needsSaving){
      self.dataManager.saveAnnotations(currentVideoId, currentFrameNumber, self.getAllPolygons());
      self.needsSaving = false;
    }
    polygons = [];
    polyIdCounter = 0;
  };

  this.drawAnnotation = function(videoId, frameNumber){
    currentVideoId = videoId;
    currentFrameNumber = frameNumber;

    var annotations = self.dataManager.getAnnotations(currentVideoId, currentFrameNumber);
    _.each(annotations, function(anno, detectableId){
      _.each(anno, function(annoCoords){
        self.addPointCoords(annoCoords, detectableId);
      });
    });
    self.drawOnce();
  };

  this.deleteAnnotation = function(){
    if (selectedPolyId !== undefined){
      var idx = -1;
      _.find(polygons, function(p, i, l){ 
        if(p.getPolyId() == selectedPolyId){ idx = i; return true; }
        return false;
      });
      if(idx >= 0){
        polygons.splice(idx, 1);
        selectedPolyId = undefined
        self.needsRepainting = true;
        self.needsSaving = true;
      }
    }
  };

  this.getselectedPolyId = function(){ return selectedPolyId; };

  this.getAllPolygons = function(){
    var polyObjs = [];
    _.map(polygons, function(poly){
      if(poly.isClosed()){ polyObjs.push(poly.getPoints()); }
    });
    return polyObjs;
  };
  this.addToPolygons = function(poly){
    poly.setPolyId(polyIdCounter++);
    polygons.push(poly);    
  };

  this.addPointCoords = function(annoCoords, detId){ 
    var p1 = new ZIGVU.FrameDisplay.Shapes.Point(annoCoords.x0, annoCoords.y0);
    var p2 = new ZIGVU.FrameDisplay.Shapes.Point(annoCoords.x1, annoCoords.y1);
    var p3 = new ZIGVU.FrameDisplay.Shapes.Point(annoCoords.x2, annoCoords.y2);
    var p4 = new ZIGVU.FrameDisplay.Shapes.Point(annoCoords.x3, annoCoords.y3);

    var annoDetails = self.dataManager.getAnnotationDetails(detId);
    var poly = new ZIGVU.FrameDisplay.Shapes.Polygon(annoDetails.id, annoDetails.title, annoDetails.color);
    poly.addPoint(p1);
    poly.addPoint(p2);
    poly.addPoint(p3);
    poly.addPoint(p4);

    self.addToPolygons(poly);
  };

  this.handleLeftClick = function(x, y){
    if (self.annotationMode){
      // deselect all
      _.each(polygons, function(poly){ poly.deselect(); });

      // select last poly
      var poly = _.last(polygons);      
      // start a new polygon if no polygon exists or if last polygon is complete
      if(poly === undefined || poly.isClosed()){
        var annoDetails = self.dataManager.getSelectedAnnotationDetails();
        var poly = new ZIGVU.FrameDisplay.Shapes.Polygon(annoDetails.id, annoDetails.title, annoDetails.color);

        self.addToPolygons(poly);
        self.needsSaving = true;
      }
      // add new point
      var point = new ZIGVU.FrameDisplay.Shapes.Point(x,y);
      poly.addPoint(point);
    }
  };

  this.handleRightClick = function(x, y){
    if (self.annotationMode){
      // if was creating new poly, discard
      if((polygons.length > 0) && !(_.last(polygons).isClosed())){ polygons.pop(); }

      // deselect all
      _.each(polygons, function(poly){ poly.deselect(); });
      selectedPolyId = undefined;

      // check to see if any polygon got clicked
      clickedPolygon = self.getClickedPolygon(x, y);
      if(clickedPolygon !== undefined){
        selectedPolyId = clickedPolygon.getPolyId();
        clickedPolygon.select();
      } else {
        // do nothing
      }
    } else {
      // pause playback
    }
  };

  this.getClickedPolygon = function(x, y){
    return _.find(polygons, function(poly){ return poly.contains(x, y); });
  };

  this.saveBackground = function(){
    self.imageData = self.ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);
    self.needsRepainting = true;
  };

  this.resetBackground = function(){
    self.imageData = undefined;
    self.needsRepainting = true;
  };

  // draw
  this.draw = function(){
    // if not annotating, no need to redraw
    if (!self.annotationMode){ return; }

    requestAnimationFrame(self.draw);
    if(!self.needsRepainting){ return; }

    self.drawOnce();
    self.needsRepainting = false;
  };

  this.drawOnce = function(){
    if(self.imageData !== undefined){ 
      self.ctx.putImageData(self.imageData, 0, 0); 
    }

    _.each(polygons, function(poly){ poly.draw(self.ctx); });
  };

  // define mouse handlers
  self.canvas.addEventListener('mousedown', function(e) {
    // if not annotating, disable mouse activity
    if (!self.annotationMode){ return; }

    e = e || window.event;
    mouse = self.getMouse(e);
    if (e.which == 1){
      self.handleRightClick(mouse.x, mouse.y);
    } else {
      self.handleLeftClick(mouse.x, mouse.y);
    }
    self.needsRepainting = true;
    self.draw();
  }, false);

  this.getMouse = function(e){
    // get mouse position relative to canvas
    var canvasRect = self.canvas.getBoundingClientRect();
    var canvasRectX = canvasRect.left;
    var canvasRectY = canvasRect.top;
    return {
      x: e.clientX - canvasRectX,
      y: e.clientY - canvasRectY
    };
  }

  // disable context menu on right click in canvas
  self.canvas.addEventListener("contextmenu", function(e){
    e.preventDefault();
  }, false);

  // set relations
  this.setDataManager = function(dm){
    self.dataManager = dm;
    return self;
  };
};
