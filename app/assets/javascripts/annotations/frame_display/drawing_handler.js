var ZIGVU = ZIGVU || {};
ZIGVU.FrameDisplay = ZIGVU.FrameDisplay || {};

/*
  Annotation creation
*/

ZIGVU.FrameDisplay.DrawingHandler = function(canvas) {
  var _this = this;
  this.canvas = canvas;
  this.ctx = this.canvas.getContext("2d");

  this.dataManager = undefined;

  var polygons = [], selectedPolyId, polyIdCounter = 0;
  var currentVideoId, currentFrameNumber;

  this.imageData = undefined;
  this.needsRepainting = false;
  this.needsSaving = false;
  this.annotationMode = false;

  this.startAnnotation = function(videoId, frameNumber){
    // if previously was annotating, save that annotation
    if(this.annotationMode){ this.endAnnotation(); }
    // new annotation
    this.annotationMode = true;
    this.saveBackground();
    this.drawAnnotation(videoId, frameNumber);
    this.draw();
  };

  this.endAnnotation = function(){
    this.annotationMode = false;
    this.resetBackground();
    if(this.needsSaving){
      this.dataManager.saveAnnotations(currentVideoId, currentFrameNumber, this.getAllPolygons());
      this.needsSaving = false;
    }
    polygons = [];
    polyIdCounter = 0;
  };

  this.drawAnnotation = function(videoId, frameNumber){
    currentVideoId = videoId;
    currentFrameNumber = frameNumber;

    var annotations = this.dataManager.getAnnotations(currentVideoId, currentFrameNumber);
    _.each(annotations, function(anno, detectableId){
      _.each(anno, function(annoCoords){
        _this.addPointCoords(annoCoords, detectableId);
      });
    });
    this.drawOnce();
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
        this.needsRepainting = true;
        this.needsSaving = true;
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

    var annoDetails = this.dataManager.getAnnotationDetails(detId);
    var poly = new ZIGVU.FrameDisplay.Shapes.Polygon(annoDetails.id, annoDetails.title, annoDetails.color);
    poly.addPoint(p1);
    poly.addPoint(p2);
    poly.addPoint(p3);
    poly.addPoint(p4);

    this.addToPolygons(poly);
  };

  this.handleLeftClick = function(x, y){
    if (this.annotationMode){
      // deselect all
      _.each(polygons, function(poly){ poly.deselect(); });

      // select last poly
      var poly = _.last(polygons);      
      // start a new polygon if no polygon exists or if last polygon is complete
      if(poly === undefined || poly.isClosed()){
        var annoDetails = this.dataManager.getSelectedAnnotationDetails();
        var poly = new ZIGVU.FrameDisplay.Shapes.Polygon(annoDetails.id, annoDetails.title, annoDetails.color);

        this.addToPolygons(poly);
        this.needsSaving = true;
      }
      // add new point
      var point = new ZIGVU.FrameDisplay.Shapes.Point(x,y);
      poly.addPoint(point);
    }
  };

  this.handleRightClick = function(x, y){
    if (this.annotationMode){
      // if was creating new poly, discard
      if((polygons.length > 0) && !(_.last(polygons).isClosed())){ polygons.pop(); }

      // deselect all
      _.each(polygons, function(poly){ poly.deselect(); });
      selectedPolyId = undefined;

      // check to see if any polygon got clicked
      clickedPolygon = this.getClickedPolygon(x, y);
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
    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.needsRepainting = true;
  };

  this.resetBackground = function(){
    this.imageData = undefined;
    this.needsRepainting = true;
  };

  // draw
  // NOTE: because of requestAnimationFrame, all references to this should be _this
  this.draw = function(){
    // if not annotating, no need to redraw
    if (!_this.annotationMode){ return; }

    requestAnimationFrame(_this.draw);
    if(!_this.needsRepainting){ return; }

    _this.drawOnce();
    _this.needsRepainting = false;
  };

  this.drawOnce = function(){
    if(_this.imageData !== undefined){ 
      _this.ctx.putImageData(_this.imageData, 0, 0); 
    }

    _.each(polygons, function(poly){ poly.draw(_this.ctx); });
  };

  // define mouse handlers
  this.canvas.addEventListener('mousedown', function(e) {
    // if not annotating, disable mouse activity
    if (!_this.annotationMode){ return; }

    e = e || window.event;
    mouse = _this.getMouse(e);
    if (e.which == 1){
      _this.handleRightClick(mouse.x, mouse.y);
    } else {
      _this.handleLeftClick(mouse.x, mouse.y);
    }
    _this.needsRepainting = true;
    _this.draw();
  }, false);

  this.getMouse = function(e){
    // get mouse position relative to canvas
    var canvasRect = this.canvas.getBoundingClientRect();
    var canvasRectX = canvasRect.left;
    var canvasRectY = canvasRect.top;
    return {
      x: e.clientX - canvasRectX,
      y: e.clientY - canvasRectY
    };
  }

  // disable context menu on right click in canvas
  this.canvas.addEventListener("contextmenu", function(e){
    e.preventDefault();
  }, false);

  // set relations
  this.setDataManager = function(dm){
    this.dataManager = dm;
    return this;
  };
};
