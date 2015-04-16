var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};

/*
  This class stores all data.
*/

ZIGVU.DataManager.DataStore = function() {
  var _this = this;
  var colorCreator = new ZIGVU.Helpers.ColorCreator();
  var textFormatters = new ZIGVU.Helpers.TextFormatters();

  this.chiaVersions = undefined;
  this.detectables = undefined;
  this.detectablesMap = undefined;
  this.dataSummary = undefined;
  this.dataFullLocalizations = undefined;
  this.dataFullAnnotations = undefined;
  this.videoDataMap = undefined;

  // add color information to detectable list
  this.addDetectablesWithColor = function(dets){
    this.detectablesMap = {};
    this.detectables = _.each(dets, function(d){
      d.pretty_name = textFormatters.ellipsisForAnnotation(d.pretty_name);
      d.button_color = colorCreator.getColorButton();
      d.button_hover_color = colorCreator.getColorButtonHover();
      d.annotation_color = colorCreator.getColorAnnotation();

      colorCreator.nextColor();
      _this.detectablesMap[d.id] = d;
      return d;
    });
  };

  this.reset = function(){
    this.chiaVersions = undefined;
    this.detectables = undefined;
    this.detectablesMap = undefined;
    this.dataSummary = undefined;
    this.dataFullLocalizations = undefined;
    this.dataFullAnnotations = undefined;
    this.videoDataMap = undefined;
  };
};