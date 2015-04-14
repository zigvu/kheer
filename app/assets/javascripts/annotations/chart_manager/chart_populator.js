var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};

/*
  Container for all charts.
*/

ZIGVU.ChartManager.ChartPopulator = function() {
  var _this = this;
  var containers = {}, _ajaxHandler;
  this.htmlGenerator = new ZIGVU.ChartManager.HtmlGenerator();

  this.ajaxHandler = function(ajaxHandler){ _ajaxHandler = ajaxHandler; };

  this.setupCharts = function(){
    containers['ZIGVU.ChartManager.FilterChiaVersionIds'] = {
      dataURL: '/api/v1/filters/chia_versions',
      classObj: new ZIGVU.ChartManager.FilterChiaVersionIds(_this.htmlGenerator)
    };
    
    containers['ZIGVU.ChartManager.FilterDetectableIds'] = {
      dataURL: '/api/v1/filters/detectables',
      classObj: new ZIGVU.ChartManager.FilterDetectableIds(_this.htmlGenerator)
    };

    containers['ZIGVU.ChartManager.FilterLocalizationScores'] = {
      dataURL: '',
      classObj: new ZIGVU.ChartManager.FilterLocalizationScores(_this.htmlGenerator)
    };

    containers['ZIGVU.ChartManager.FilterDisplayAndRun'] = {
      dataURL: '/api/v1/filters/filtered_summary',
      classObj: new ZIGVU.ChartManager.FilterDisplayAndRun(_this.htmlGenerator)
    };

    this.resetAll();
  };

  this.startFilter = function(){
    var className = 'ZIGVU.ChartManager.FilterChiaVersionIds';
    var classObj = containers[className].classObj;

    var requestDefer = Q.defer();
    classObj.displayStartFilterButton(requestDefer);
    return requestDefer.promise;
  }

  this.resetAll = function(){
    _.each(containers, function(obj, className){ 
      obj.classObj.empty(); 
      obj.classObj.disable(); 
    });
  };

  this.addFilterChiaVersionIds = function(){
    var className = 'ZIGVU.ChartManager.FilterChiaVersionIds';
    var dataURL = containers[className].dataURL;
    var dataParam = {};

    var requestDefer = Q.defer();
    var classObj = containers[className].classObj;
    var requestPromise = _ajaxHandler.getRequestPromise(dataURL, dataParam);
    requestPromise.then(function(data){
      classObj.display(data, requestDefer);
    }, function(errorReason){
      requestDefer.reject('ZIGVU.ChartManager.ChartPopulator ->' + errorReason);
    });

    return requestDefer.promise;
  };

  this.addFilterDetectableIds = function(chiaId){
    var className = 'ZIGVU.ChartManager.FilterDetectableIds';
    var dataURL = containers[className].dataURL;
    var dataParam = {chia_version_id: chiaId};

    var requestDefer = Q.defer();
    var classObj = containers[className].classObj;
    var requestPromise = _ajaxHandler.getRequestPromise(dataURL, dataParam);
    requestPromise.then(function(data){
      classObj.display(data, requestDefer);
    }, function(errorReason){
      requestDefer.reject('ZIGVU.ChartManager.ChartPopulator ->' + errorReason);
    });

    return requestDefer.promise;
  };

  this.addFilterLocalizationScores = function(zDistValues){
    var className = 'ZIGVU.ChartManager.FilterLocalizationScores';

    var requestDefer = Q.defer();
    var classObj = containers[className].classObj;
    
    classObj.display(zDistValues, requestDefer);

    return requestDefer.promise;
  };

  this.addFilterDisplayAndRun = function(currentFilter){
    var className = 'ZIGVU.ChartManager.FilterDisplayAndRun';
    var dataURL = containers[className].dataURL;
    var dataParam = {filter: currentFilter};

    var requestDefer = Q.defer();
    var classObj = containers[className].classObj;
    var requestPromise = _ajaxHandler.getRequestPromise(dataURL, dataParam);
    requestPromise.then(function(data){
      classObj.display(data, requestDefer).enable();
    }, function(errorReason){
      requestDefer.reject('ZIGVU.ChartManager.ChartPopulator ->' + errorReason);
    });

    return requestDefer.promise;
  };

};