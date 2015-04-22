
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

	

});
