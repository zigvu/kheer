var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};

/*
  This class handles all display elements except video/frame.
*/

ZIGVU.ChartManager.ChartManager = function() {
  var _this = this;
  this.annotationController = undefined;
  this.filterHandler = undefined;
  this.dataManager = undefined;

  this.chartPopulator = new ZIGVU.ChartManager.ChartPopulator();
  this.annotationList = new ZIGVU.ChartManager.AnnotationList();

  // step through filter creation
  this.createNewFilter = function(){
    var tempDetectableList;
    // add chia version filters
    _this.chartPopulator.addFilterChiaVersionIds()
      .then(function(chiaInfo){
        _this.filterHandler.addChiaVersionId(chiaInfo.chia_id);
        _this.dataManager.setChiaSettings(chiaInfo.settings);
        // add detectable filters
        return _this.chartPopulator.addFilterDetectableIds(chiaInfo.chia_id);
      })
      .then(function(detectables){
        _this.filterHandler.addDetectableIds(detectables.detectable_ids);
        tempDetectableList = detectables.detectable_list;
        // add localization score filters
        var zDistValues = _this.dataManager.getZdistThresh();
        return _this.chartPopulator.addFilterLocalizationScores(zDistValues);
      })
      .then(function(localizationScores){
        _this.filterHandler.addLocalizationScores(localizationScores);
        // ready to run filter
        return _this.chartPopulator.addFilterDisplayAndRun(_this.filterHandler.getFilters());
      })
      .then(function(buttonClicked){
        if(buttonClicked === ZIGVU.ChartManager.FilterDisplayAndRun.prototype.action_FilterReset){
          _this.reset();
        } else if(buttonClicked === ZIGVU.ChartManager.FilterDisplayAndRun.prototype.action_LoadData){
          // _this.annotationList.display(_this.dataManager.getDetectableList());
          tempDetectableList = _this.annotationList.display(tempDetectableList);
          _this.dataManager.setDetectableList(tempDetectableList);
          _this.annotationController.loadData();
          // done
        } else {
          return Q.reject('Unknown button: ' + buttonClicked);
        }
      })
      .catch(function (errorReason) {
        displayJavascriptError('ZIGVU.ChartManager.ChartManager -> ' + errorReason);
      });
  };

  // reset all filters
  this.reset = function(){
    // invalidate current filter
    _this.filterHandler.reset();
    _this.chartPopulator.resetAll();
    _this.chartPopulator.startFilter()
      .then(function(truthiness){
        _this.createNewFilter();
      })
      .catch(function (errorReason) {
        displayJavascriptError('ZIGVU.ChartManager.ChartManager -> ' + errorReason);
      });
    displayJavascriptMessage("ZIGVU.ChartManager.ChartManager -> Reset all filters");
  };

  this.annotationController = function(annotationController){
    this.annotationController = annotationController;
    this.dataManager = this.annotationController.dataManager;
    this.filterHandler = this.annotationController.filterHandler;

    this.chartPopulator.ajaxHandler(this.dataManager.ajaxHandler);
    this.chartPopulator.setupCharts();
    this.annotationList.dataManager(this.dataManager);
    return this;
  };
};