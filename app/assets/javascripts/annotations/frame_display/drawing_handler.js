var ZIGVU = ZIGVU || {};
ZIGVU.FrameDisplay = ZIGVU.FrameDisplay || {};

/*
  Annotation creation
*/

ZIGVU.FrameDisplay.DrawingHandler = function(canvas) {
  var _this = this;
  this.canvas = canvas;
  this.ctx = this.canvas.getContext("2d");

  var polygons = [], currentDetId, currentTitle, currentFillColor;
  var selectedDetId;

  this.imageData = undefined;
  this.needsRepainting = false;
  this.annotationMode = false;

  this.setAnnotationMode = function(bool){ this.annotationMode = bool; };

  this.getSelectedDetId = function(){ return selectedDetId; };
  this.setCurrentDetectable = function(detId, title, color){
    currentDetId = detId;
    currentTitle = title;
    currentFillColor = color;
  };

  this.getAllPolygons = function(){
    var polyObjs = [];
    _.map(polygons, function(poly){
      if(poly.isClosed()){ polyObjs.push(poly.getPoints()); }
    });
    return polyObjs;
  };

  this.addPointCoords = function(x0, y0, x1, y1, x2, y2, x3, y3){ 
    var p1 = new ZIGVU.FrameDisplay.Shapes.Point(x0, y0);
    var p2 = new ZIGVU.FrameDisplay.Shapes.Point(x1, y1);
    var p3 = new ZIGVU.FrameDisplay.Shapes.Point(x2, y2);
    var p4 = new ZIGVU.FrameDisplay.Shapes.Point(x3, y3);

    var poly = new ZIGVU.FrameDisplay.Shapes.Polygon(currentDetId, currentTitle, currentFillColor);
    poly.addPoint(p1);
    poly.addPoint(p2);
    poly.addPoint(p3);
    poly.addPoint(p4);

    polygons.push(poly);
  };

  this.handleLeftClick = function(x, y){
    if (this.annotationMode){
      // deselect all
      _.each(polygons, function(poly){ poly.deselect(); });

      // select last poly
      var poly = _.last(polygons);      
      // start a new polygon if no polygon exists or if last polygon is complete
      if(poly === undefined || poly.isClosed()){
        poly = new ZIGVU.FrameDisplay.Shapes.Polygon(currentDetId, currentTitle, currentFillColor);
        polygons.push(poly);
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
      selectedDetId = undefined;

      // check to see if any polygon got clicked
      clickedPolygon = this.getClickedPolygon(x, y);
      if(clickedPolygon !== undefined){
        selectedDetId = clickedPolygon.getDetId();
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

  // draw
  // NOTE: because of requestAnimationFrame, all references to this should be _this
  this.draw = function(){
    // if not annotating, no need to redraw
    if (!_this.annotationMode){ return; }

    requestAnimationFrame(_this.draw);
    if(!_this.needsRepainting){ return; }

    if(_this.imageData !== undefined){ 
      _this.ctx.putImageData(_this.imageData, 0, 0); 
    }

    _.each(polygons, function(poly){ poly.draw(_this.ctx); });
    _this.needsRepainting = false;
  };


  // define mouse handlers
  this.canvas.addEventListener('mousedown', function(e) {
    e = e || window.event;
    mouse = _this.getMouse(e);
    if (e.which == 1){
      _this.handleRightClick(mouse.x, mouse.y);
    } else {
      _this.handleLeftClick(mouse.x, mouse.y);
    }
    _this.needsRepainting = true;
  }, false);

  // get mouse position relative to canvas
  var canvasRect = this.canvas.getBoundingClientRect();
  var canvasRectX = canvasRect.left;
  var canvasRectY = canvasRect.top;
  this.getMouse = function(e){
    return {
      x: e.clientX - canvasRectX,
      y: e.clientY - canvasRectY
    };
  }

  // disable context menu on right click in canvas
  this.canvas.addEventListener("contextmenu", function(e){
    e.preventDefault();
  }, false);
};
