
$(".analysis_annotations.index").ready(function() {

  annotationController = new ZIGVU.Controller.AnnotationController();
  annotationController.register();
  annotationController.startFilter();
  //annotationController.loadDataTest();
});

$(".analysis_annotations.temp").ready(function() {
	// annotationController = new ZIGVU.Controller.AnnotationController();
	// annotationController.register();
	// annotationController.startFilter();
	// annotationController.loadDataTest();

  // videoFrameCanvas = document.getElementById("videoFrameCanvas");
  // videoFrameCanvasCTX = videoFrameCanvas.getContext("2d");

  // heatmapCanvas = document.getElementById("heatmapCanvas");
  // new ZIGVU.FrameDisplay.CanvasExtender(heatmapCanvas);
  // heatmapCanvasCTX = heatmapCanvas.getContext("2d");

  // localizationCanvas = document.getElementById("localizationCanvas");
  // new ZIGVU.FrameDisplay.CanvasExtender(localizationCanvas);
  // localizationCanvasCTX = localizationCanvas.getContext("2d");

  // annotationCanvas = document.getElementById("annotationCanvas");
  // new ZIGVU.FrameDisplay.CanvasExtender(annotationCanvas);
  // annotationCanvasCTX = annotationCanvas.getContext("2d");

  // heatmapData = undefined;
  // dataManager = new ZIGVU.DataManager.DataManager();
  // dataManager.filterStore.chiaVersionIdLocalization = 1;
  // dataManager.filterStore.heatmap.detectable_id = 48;
  // dataManager.filterStore.heatmap.scale = 1.3;

  // drawHeatmap = new ZIGVU.FrameDisplay.DrawHeatmap(videoFrameCanvas);
  // drawHeatmap.setDataManager(dataManager);

  // // get color map
  // dataURL = '/api/v1/filters/color_map';
  // dataParam = {chia_version_id: 1};

  // dataManager.ajaxHandler.getGETRequestPromise(dataURL, dataParam)
  //   .then(function(data){
  //     dataManager.dataStore.colorMap = data.color_map;

  //     // get cell map
  //     dataURL = '/api/v1/filters/cell_map';
  //     dataParam = {chia_version_id: 1};
  //     return dataManager.ajaxHandler.getGETRequestPromise(dataURL, dataParam)
  //   })
  //   .then(function(data){
  //     dataManager.dataStore.cellMap = data.cell_map;
  //     drawHeatmap.drawHeatmap(1, 31);
  //   })
  //   .catch(function (errorReason) { console.log(errorReason); }); 


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
  // 	videoFrameCanvasCTX.drawImage(image,0,0);
  // 	bboxShape.draw(localizationCanvasCTX, bbox, 'Adidas', 'rgba(0,255,255,0.8)');
	 //  poly.draw(annotationCanvasCTX);
  // }, false);
});
