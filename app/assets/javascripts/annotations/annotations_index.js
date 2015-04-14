
$(".analysis_annotations.index").ready(function() {

	annotationController = new ZIGVU.AnnotationController();
	annotationController.register();
	annotationController.chartManager.reset();


  // var dataManager = new ZIGVU.DataManager.DataManager();
  // var filterHandler = new ZIGVU.FilterHandler.FilterHandler();
  // chartManager = new ZIGVU.ChartManager.ChartManager();

  // chartManager
  //   .dataManager(dataManager)
  //   .filterHandler(filterHandler);

  // chartManager.reset();

	// var htmlGenerator = new ZIGVU.ChartManager.HtmlGenerator();
	// var annotationList = new ZIGVU.ChartManager.AnnotationList(htmlGenerator);

	// detectableList = [];
	// for (var i = 0; i < 50; i++) {
	// 	detectableList.push({id: i, name: ("Here we go: " + i)})
	// };

	// annotationList.display(detectableList);

  // var videoDataMap = [
  // 	{'video_id': '1', 'video_URL': '/data/2.mp4', 'frame_rate': 25},
  // 	{'video_id': '2', 'video_URL': '/data/2.mp4', 'frame_rate': 25},
  // 	{'video_id': '3', 'video_URL': '/data/2.mp4', 'frame_rate': 25}
  // ];

  // var videoPlayer = new ZIGVU.VideoHandler.VideoPlayer(videoFrameCanvasCTX);
  // var videoPlayerControls = new ZIGVU.VideoHandler.VideoPlayerControls(videoPlayer);

  // var allVideoLoadPromise = videoPlayer.loadVideosPromise(videoDataMap);
  // allVideoLoadPromise
  //   .then(function(loadValues){
  //     console.log("Loaded all videos");
  //   }, function(errorReason){
  //     console.log(errorReason.toString());
  //   });

});

$(".analysis_annotations.temp").ready(function() {
	var videoFrameCanvas = document.getElementById("videoFrameCanvas");
  videoFrameCanvasCTX = videoFrameCanvas.getContext("2d");

  drawingHandler = new ZIGVU.FrameDisplay.DrawingHandler(videoFrameCanvas);
  drawingHandler.saveBackground();

  drawingHandler.setCurrentDetectable('1', 'Adidas', 'rgba(0,155,15,0.1)');
  drawingHandler.addPointCoords(20,20,100,50,100,100,50,100);

  drawingHandler.draw();
  drawingHandler.setCurrentDetectable('2','Sony', 'rgba(155,15,0,0.1)');
});
