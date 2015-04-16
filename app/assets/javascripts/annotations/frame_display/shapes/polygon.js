var ZIGVU = ZIGVU || {};
ZIGVU.FrameDisplay = ZIGVU.FrameDisplay || {};
ZIGVU.FrameDisplay.Shapes = ZIGVU.FrameDisplay.Shapes || {};

/*
  Polygon (currently only quadrilateral) for new and existing
  annotations.
*/

ZIGVU.FrameDisplay.Shapes.Polygon = function(detId, title, fillColor) {
  var self = this;
  var selected = false, polyId;

  // default decorations
  var strokeColor = '#000000';
  var strokeColorSelected = '#FF0000';
  var fillColorSelected = fillColor;

  var points = [];

  this.setPolyId = function(pid){ polyId = pid; };
  this.getPolyId = function(){ return polyId; };

  this.getPoints = function(){
    if(!self.isClosed()){ return undefined; }
    return {
      detectable_id: detId,
      x0: points[0].getX(), y0: points[0].getY(),
      x1: points[1].getX(), y1: points[1].getY(),
      x2: points[2].getX(), y2: points[2].getY(),
      x3: points[3].getX(), y3: points[3].getY(),
    };
  };

  // currently only supports quadrilateral polygons
  this.addPoint = function(p){
    // if already have 4 points, then reset
    if(points.length == 4){ points = []; } 
    points.push(p);
  };

  this.draw = function(ctx){
    // decoration settings
    var sColor, fColor;
    if(selected){
      sColor = strokeColorSelected;
      fColor = fillColorSelected;
    } else {
      sColor = strokeColor;
      fColor = fillColor;
    }
    ctx.strokeStyle = sColor;
    ctx.fillStyle = fColor;

    if(points.length == 0){
      return;
    } else if (points.length > 1) {
      // draw lines
      ctx.beginPath();
      ctx.moveTo(points[0].getX(), points[0].getY());
      for(var i = 1; i < points.length; i++){
        ctx.lineTo(points[i].getX(), points[i].getY());
      }
      if(points.length < 4){
        // just stroke
        ctx.stroke();
        ctx.closePath();
      } else {
        // also fill area
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    // draw all points
    for(var i = 0; i < points.length; i++){
      points[i].draw(ctx);
    }

    // draw text
    if(self.isClosed()){
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillRect(points[0].getX() + 2, points[0].getY() + 2, ctx.measureText(title).width, 20);

      ctx.textBaseline = "hanging";
      ctx.font = "20px serif";
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillText(title, points[0].getX() + 2, points[0].getY() + 2);
    }
  };

  this.select = function(){
    selected = true;
  };

  this.deselect = function(){
    selected = false;
  };

  this.toggleSelect = function(){
    selected = !selected;
  };

  this.contains = function(mouseX, mouseY){
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    var x = mouseX, y = mouseY;
    var inside = false;
    for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
      var xi = points[i].getX(), yi = points[i].getY();
      var xj = points[j].getX(), yj = points[j].getY();
      var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  this.isClosed = function(){ return points.length == 4; }

  this.setDecorations = function(sColor, sColorSelected, fColor, fColorSelected){
    strokeColor = sColor;
    strokeColorSelected = sColorSelected;
    fillColor = fColor;
    fillColorSelected = fColorSelected;
  };
};
