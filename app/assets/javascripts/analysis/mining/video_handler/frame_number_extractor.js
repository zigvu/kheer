var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.VideoHandler = Mining.VideoHandler || {};

/*
  Extract frame numbers from embedded pixel color
*/

Mining.VideoHandler.FrameNumberExtractor = function(renderCTX) {
  var self = this;

  // NOTE:
  // Explanation of color<->frame_number can be found in kheer issue 
  // https://github.com/zigvu/kheer/issues/10
  var squareWH = 10;
  var sqDem = [
    [[0, 0],                            [squareWH, squareWH]],
    [[1280 - squareWH, 0],              [1280, squareWH]],
    [[0, 720 - squareWH],               [squareWH, 720]],
    [[1280 - squareWH, 720 - squareWH], [1280, 720]],
  ];

  this.getCurrentFrameNumber = function(){
    var colors = this.getColors();
    var binNum = '';

    var i, j;
    for(i = 0; i < colors.length; i++){
      c = colors[i];
      for(j = 0; j < c.length; j++){ 
        if(c[j] > 128){ binNum += '1'; }
        else { binNum += '0'; }
      }
    }
    return parseInt(binNum, 2);
  };

  this.getColors = function(){
    var colors = [];
    for(var i = 0; i < sqDem.length; i++){
      colors.push(self.getColorSq(sqDem[i]));
    }
    return colors;      
  };

  this.getColorSq = function(sq){
    var width = sq[1][0] - sq[0][0],
        height = sq[1][1] - sq[0][1];
    var imageData = renderCTX.getImageData(sq[0][0], sq[0][1], width, height);

    var borderPixel = 2; // pixel border in both axis

    var count = 0;
    var rgbValues = [0, 0, 0];
    var idx, y, x; // row/y is second index, column/x is firxt index
    // leave 1 pixel border in both x and y axis
    for(y = borderPixel; y < height - borderPixel; y++){
      for(x = borderPixel; x < width - borderPixel; x++){
        idx = (y * (width * 4)) + (x * 4);
        for(j = 0; j < 3; j++){ rgbValues[j] += imageData.data[idx + j]; }
        count++;
      }
    }
    if(count > 0){ 
      for(j = 0; j < 3; j++){ 
        rgbValues[j] /= count; 
      }
    }
    return rgbValues;
  };

};
