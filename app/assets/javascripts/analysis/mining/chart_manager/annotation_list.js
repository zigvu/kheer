var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.ChartManager = Mining.ChartManager || {};

/*
  List for annotation
*/

Mining.ChartManager.AnnotationList = function() {
  var self = this;
  this.dataManager = undefined;
  this.eventManager = undefined;

  var divId_annotationList = "#annotation-list";
  var buttonIdPrefix = "annotation-list-button-";
  var selectedButtonId, detectableMap = {};

  this.display = function(){
    self.empty();
    var annotationDetectables = self.dataManager.getAnno_annotationDetectables();
    _.each(annotationDetectables, function(dl){
      buttonId = buttonIdPrefix + dl.id;

      $(divId_annotationList).append(
        '<li><div class="button tiny" id="' + buttonId + '">' + dl.pretty_name + '</div></li>'
      );
      $("#" + buttonId).css('background-color', dl.button_color);
      $("#" + buttonId)
        .mouseover(function(){ $(this).css("background-color", detectableMap[$(this).attr('id')].button_hover_color); })
        .mouseout(function(){ $(this).css("background-color", detectableMap[$(this).attr('id')].button_color); })
        .click(function(){ self.setButtonSelected($(this).attr('id')); });

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

    self.eventManager.fireAnnoListSelectedCallback(detectableMap[selectedButtonId].id);
  };

  this.setToFirstButton = function(){ self.setButtonSelected(Object.keys(detectableMap)[0]); };

  this.empty = function(){ $(divId_annotationList).empty(); };

  //------------------------------------------------
  // set relations
  this.setEventManager = function(em){
    self.eventManager = em;
    return self;
  };

  this.setDataManager = function(dm){
    self.dataManager = dm;
    return self;
  };
};
