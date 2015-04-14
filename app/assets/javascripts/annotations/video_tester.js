
$(".annotations.show").ready(function() {
  var c1 = document.getElementById("c1");
  ctx1 = c1.getContext("2d");

  // for(var i = 0; i < 4; i++){
  //   poly = new ZIGVU.FrameDisplay.Shapes.Polygon();
  //   p1 = new ZIGVU.FrameDisplay.Shapes.Point(0 + i * 20, 0 + i * 20);
  //   p2 = new ZIGVU.FrameDisplay.Shapes.Point(100 + i * 20, 0 + i * 20);
  //   p3 = new ZIGVU.FrameDisplay.Shapes.Point(100 + i * 20, 100 + i * 20);
  //   p4 = new ZIGVU.FrameDisplay.Shapes.Point(0 + i * 20, 100 + i * 20);
  //   poly.addPoint(p1);
  //   poly.addPoint(p2);
  //   poly.addPoint(p3);
  //   poly.addPoint(p4);
  //   poly.draw(ctx1);
  // }

  p1 = new ZIGVU.FrameDisplay.Shapes.Point(20,20);
  p2 = new ZIGVU.FrameDisplay.Shapes.Point(100,50);
  p3 = new ZIGVU.FrameDisplay.Shapes.Point(100,100);
  p4 = new ZIGVU.FrameDisplay.Shapes.Point(50,100);

  poly = new ZIGVU.FrameDisplay.Shapes.Polygon();
  poly.addPoint(p1);
  poly.addPoint(p2);
  poly.addPoint(p3);
  poly.addPoint(p4);

  drawingHandler = new ZIGVU.FrameDisplay.DrawingHandler(c1);
  drawingHandler.addPolygon(poly);
  drawingHandler.draw();

  var videoDataMap = {2: {'video_URL': '/data/2.mp4', 'frame_rate': 25}};
  multiVideoExtractor = new ZIGVU.VideoHandler.MultiVideoExtractor();
  var allVideoLoadPromise = multiVideoExtractor.loadVideosPromise(videoDataMap);
  allVideoLoadPromise
    .then(function(loadValues){
      console.log("Loaded all videos");
    }, function(errorReason){
      console.log(errorReason.toString());
    });


  // // var canvas = new fabric.Canvas('c1');
  // // backgroundSetter = new ZIGVU.FrameDisplay.BackgroundSetter();
  // // var blankImagePromise = backgroundSetter.loadBlankImagePromise('/data/blank.png');
  // // blankImagePromise.done(function(){});


  frameNumber = 1;
  $('#buttStart').click(function(){
    var framePromise = multiVideoExtractor.getFramePromise(2, frameNumber);
    framePromise.done(function(frame){
      //ctx1.putImageData(frame.frame, 0, 0);
      drawingHandler.setBackground(frame.frame);

      // backgroundSetter.setNewBackground(canvas, frame.frame);
      // canvas.renderAll();

      console.log("frameNumber: " + frame.frame_number);
      frameNumber += 5;
    });
  });

});
