
$(".analysis_annotations.index").ready(function() {

  annotationController = new ZIGVU.Controller.AnnotationController();
  annotationController.register();
  annotationController.startFilter();
  // annotationController.loadDataTest();
});

$(".analysis_annotations.temp").ready(function() {
	// annotationController = new ZIGVU.Controller.AnnotationController();
	// annotationController.register();
	// annotationController.startFilter();
	// annotationController.loadDataTest();

  // videoFrameCanvas = document.getElementById("videoFrameCanvas");
  // new ZIGVU.FrameDisplay.CanvasExtender(videoFrameCanvas);
  // renderCTX = videoFrameCanvas.getContext("2d");

  // var image = new Image();
  // image.src = '/data/test_img.png';

  // p1 = new ZIGVU.FrameDisplay.Shapes.Point(50,50);
  // p2 = new ZIGVU.FrameDisplay.Shapes.Point(100,50);
  // p3 = new ZIGVU.FrameDisplay.Shapes.Point(100,100);
  // p4 = new ZIGVU.FrameDisplay.Shapes.Point(50,100);

  // poly = new ZIGVU.FrameDisplay.Shapes.Polygon(1, 'Adidas', 'rgba(0,255,255,0.8)');
  // poly.addPoint(p1);
  // poly.addPoint(p2);
  // poly.addPoint(p3);
  // poly.addPoint(p4);

  // bboxShape = new ZIGVU.FrameDisplay.Shapes.Bbox();
  // bbox = {x: 200, y: 100, w: 100, h: 40, prob_score: 0.98, scale: 1.0, zdist_thresh: 1.5};

  // image.addEventListener("load", function() {
  // 	renderCTX.drawImage(image,0,0);
  // 	bboxShape.draw(renderCTX, bbox, 'Adidas', 'rgba(0,255,255,0.8)');
	 //  poly.draw(renderCTX);
  // }, false);
});
