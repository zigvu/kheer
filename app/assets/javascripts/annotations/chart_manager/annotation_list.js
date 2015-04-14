var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};

/*
  List for annotation
*/

ZIGVU.ChartManager.AnnotationList = function() {
  var _this = this;
  this.dataManager = undefined;

  var divId = '#annotation-list';
  var buttonIdPrefix = "annotation-list-button-";
  var selectedButtonId, detectableMap = {};
  var colorCreator = new ZIGVU.Helpers.ColorCreator();
  var textFormatters = new ZIGVU.Helpers.TextFormatters();
  var ellipsisMaxChars = 30;

  var buttonTransparency = 0.6,
    buttonHoverTransparency = 1.0,
    annotationPolygonTransparency = 0.5;

  this.display = function(detectableList){
    var newdetectableList = {};
    _.each(detectableList, function(dl){
      buttonId = buttonIdPrefix + dl.id;

      dm = {
        id: dl.id, 
        name: textFormatters.ellipsis(dl.name, ellipsisMaxChars), 
        button_color: colorCreator.getRGBAColor(buttonTransparency),
        button_hover_color: colorCreator.getRGBAColor(buttonHoverTransparency),
        annotation_polygon_color: colorCreator.getRGBAColor(annotationPolygonTransparency)
      };
      newdetectableList[dm.id] = {
        id: dm.id, 
        name: dm.name, 
        color: dm.annotation_polygon_color.replace(/'/g, "")
      };

      $(divId).append('<li><div class="button tiny" id="' + buttonId + '">' + dm.name + '</div></li>');
      $("#" + buttonId).css('background-color', dm.button_color);
      $("#" + buttonId)
        .mouseover(function(){ $(this).css("background-color", detectableMap[$(this).attr('id')].button_hover_color); })
        .mouseout(function(){ $(this).css("background-color", detectableMap[$(this).attr('id')].button_color); })
        .click(function(){ _this.setButtonSelected($(this).attr('id')); });

      detectableMap[buttonId] = dm;
      colorCreator.nextColor();
    });
    return newdetectableList;
  };

  this.setButtonSelected = function(buttonId){
    // un select any previous buttons
    if(selectedButtonId !== undefined){
      $("#" + selectedButtonId).css('border', 'none');
      $("#" + selectedButtonId).css('color', 'black');
    }
    selectedButtonId = buttonId;
    $("#" + selectedButtonId).css('border', '5px solid black');
      $("#" + selectedButtonId).css('color', 'red');

    this.dataManager.setAnnotationDetectableId(detectableMap[selectedButtonId].id);
  };

  this.getSelectedId = function(){
    if(selectedButtonId === undefined){
      selectedButtonId = keys(detectableMap)[0];
    }
    return detectableMap[selectedButtonId].id;
  };

  this.getAnnotationColor = function(detId){
    buttonId = buttonIdPrefix + detId;
    return detectableMap[buttonId].annotation_polygon_color;
  };

  this.selectFirstButton = function(){
    var buttonId = this.getSelectedId();
    this.setButtonSelected(buttonId);
  };

  this.dataManager = function(dataManager){
    this.dataManager = dataManager;
  };
};
