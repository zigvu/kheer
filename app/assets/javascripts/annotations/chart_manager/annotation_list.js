var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};

/*
  List for annotation
*/

ZIGVU.ChartManager.AnnotationList = function() {
  var _this = this;
  this.dataManager = undefined;

  var divId_annotationList = "#annotation-list";
  var buttonIdPrefix = "annotation-list-button-";
  var selectedButtonId, detectableMap = {};

  this.display = function(){
    this.empty();
    _.each(this.dataManager.dataStore.detectables, function(dl){
      buttonId = buttonIdPrefix + dl.id;

      $(divId_annotationList).append(
        '<li><div class="button tiny" id="' + buttonId + '">' + dl.pretty_name + '</div></li>'
      );
      $("#" + buttonId).css('background-color', dl.button_color);
      $("#" + buttonId)
        .mouseover(function(){ $(this).css("background-color", detectableMap[$(this).attr('id')].button_hover_color); })
        .mouseout(function(){ $(this).css("background-color", detectableMap[$(this).attr('id')].button_color); })
        .click(function(){ _this.setButtonSelected($(this).attr('id')); });

      detectableMap[buttonId] = dl;
    });
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

    //this.dataManager.setAnnotationDetectableId(detectableMap[selectedButtonId].id);
    this.dataManager.filterStore.currentAnnotationDetId = detectableMap[selectedButtonId].id;
  };

  this.setToFirstButton = function(){ this.setButtonSelected(Object.keys(detectableMap)[0]); };

  this.empty = function(){ $(divId_annotationList).empty(); };

  this.setDataManager = function(dm){
    this.dataManager = dm;
  };
};
