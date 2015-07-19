
$(".analysis_minings.mine").ready(function() {
  annotationController = new Mining.Controller.AnnotationController();
  annotationController.register();
  annotationController.loadData(window.miningId, window.setId);
  // annotationController.bindPageUnload();
});

$(".analysis_minings.temp").ready(function() {
  // annotationController = new Mining.Controller.AnnotationController();
  // annotationController.register();
  // annotationController.loadData(window.miningId, window.setId);

  // videoFrameCanvas = document.getElementById("videoFrameCanvas");
  // videoFrameCanvasCTX = videoFrameCanvas.getContext("2d");

  // heatmapCanvas = document.getElementById("heatmapCanvas");
  // new Mining.FrameDisplay.CanvasExtender(heatmapCanvas);
  // heatmapCanvasCTX = heatmapCanvas.getContext("2d");

  // localizationCanvas = document.getElementById("localizationCanvas");
  // new Mining.FrameDisplay.CanvasExtender(localizationCanvas);
  // localizationCanvasCTX = localizationCanvas.getContext("2d");

  // annotationCanvas = document.getElementById("annotationCanvas");
  // new Mining.FrameDisplay.CanvasExtender(annotationCanvas);
  // annotationCanvasCTX = annotationCanvas.getContext("2d");

  // heatmapData = undefined;
  // dataManager = new Mining.DataManager.DataManager();
  // dataManager.filterStore.chiaVersionIdLocalization = 1;
  // dataManager.filterStore.heatmap.detectable_id = 48;
  // dataManager.filterStore.heatmap.scale = 1.3;

  // drawHeatmap = new Mining.FrameDisplay.DrawHeatmap(videoFrameCanvas);
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

  // p1 = new Mining.FrameDisplay.Shapes.Point(50,50);
  // p2 = new Mining.FrameDisplay.Shapes.Point(100,50);
  // p3 = new Mining.FrameDisplay.Shapes.Point(100,100);
  // p4 = new Mining.FrameDisplay.Shapes.Point(50,100);

  // poly = new Mining.FrameDisplay.Shapes.Polygon(1, 'Adidas', 'rgba(0,255,255,0.8)');
  // poly.addPoint(p1);
  // poly.addPoint(p2);
  // poly.addPoint(p3);
  // poly.addPoint(p4);

  // bboxShape = new Mining.FrameDisplay.Shapes.Bbox();
  // bbox = {x: 200, y: 100, w: 100, h: 40, prob_score: 0.98, scale: 1.0, zdist_thresh: 1.5};

  // image.addEventListener("load", function() {
  // 	videoFrameCanvasCTX.drawImage(image,0,0);
  // 	bboxShape.draw(localizationCanvasCTX, bbox, 'Adidas', 'rgba(0,255,255,0.8)');
	 //  poly.draw(annotationCanvasCTX);
  // }, false);

  // var img = new Image();
  // img.src = '/data/test_img_out.png';
  // canvas = document.getElementById('videoFrameCanvas');
  // ctx = canvas.getContext('2d');
  // img.onload = function() {
  //   ctx.drawImage(img, 0, 0);
  //   img.style.display = 'none';
  //   fne = new Mining.VideoHandler.FrameNumberExtractor(ctx);
  //   draw = new Mining.FrameDisplay.DrawInfoOverlay();
  // };

});
