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
  var snrPercent;

  // default decorations
  var strokeColor = "rgb(255, 255, 0)";
  var strokeColorSelected = "rgb(255, 0, 0)";
  var fillColorSelected = fillColor;

  // offset because of border
  var borderOffset = 2;

  // text rendering : name
  var nameHeight = 22;

  // text rendering : snr
  var snrHeight = 12;
  var snrWidth = 30;

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
    ctx.lineWidth = 2;
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
      ctx.textBaseline = "hanging";

      // text rendering: name
      ctx.font = "20px serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillRect(points[0].getX() + borderOffset, points[0].getY() + borderOffset, ctx.measureText(title).width, nameHeight);
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillText(title, points[0].getX() + borderOffset, points[0].getY() + borderOffset);

      // text rendering: snr
      ctx.font = "10px serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      var snr = self.getSNR();
      ctx.fillRect(points[0].getX() + borderOffset, points[0].getY() + borderOffset + nameHeight, snrWidth, snrHeight);
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillText(snr, points[0].getX() + borderOffset, points[0].getY() + borderOffset + nameHeight);
    }
  };

  this.select = function(){
    selected = true;
    _.each(points, function(p){ p.select(); });
  };

  this.deselect = function(){
    selected = false;
    _.each(points, function(p){ p.deselect(); });
  };

  this.isClosed = function(){ return points.length == 4; }

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

  this.getSNR = function(){
    // assume poly is closed
    // check cache - if doesn't exist, then compute
    if(snrPercent === undefined){
      var patchArea = 256 * 256;
      var polyArea = self.getArea();
      snrPercent = Math.round(100 * 10 * polyArea/patchArea)/10 + " %";
    }
    return snrPercent;
  };

  this.getArea = function(){
    // area of quadrilateral based on:
    // http://www.geom.uiuc.edu/docs/reference/CRC-formulas/node23.html
    // c = top edge, b = right edge, a = bottom edge, d = left edge
    // p = diagonal from top left to bottom right
    // q = diagonal from top right to bottom left
    // formula:
    // area = 1/4 * sqrt[ (4 * p^2 * q^2) + (b^2 + d^2 - a^2 - c^2)^2 ]
    var area, a, b, c, d, p, q;
    c = self.getLineLength(points[0], points[1]);
    b = self.getLineLength(points[1], points[2]);
    a = self.getLineLength(points[2], points[3]);
    d = self.getLineLength(points[3], points[0]);
    p = self.getLineLength(points[0], points[2]);
    q = self.getLineLength(points[1], points[3]);
    area = 0.25 * Math.sqrt((4 * p*p * q*q) + Math.pow((b*b + d*d - a*a - c*c), 2));
    return area;
  };

  this.getLineLength = function(point0, point1){
    var x0 = point0.getX(), y0 = point0.getY(),
      x1 = point1.getX(), y1 = point1.getY();
    return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
  };

  this.setDecorations = function(sColor, sColorSelected, fColor, fColorSelected){
    strokeColor = sColor;
    strokeColorSelected = sColorSelected;
    fillColor = fColor;
    fillColorSelected = fColorSelected;
  };
};
