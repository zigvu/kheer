var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};

/*
  This class stores all data.
*/

/*
  Data structure:
  [Note: Ruby style hash (:keyname => value) implies that raw id are used as keys of objects.
  JS style hash implies that (keyname: value) text are used as keys of objects.]

  chiaVersions: [{id:, name:, description:, settings: {zdistThresh: [zdistValues, ]}}, ]

  detectables: [
      { id:, name:, pretty_name:, chia_detectable_id:, 
        button_color:, button_hover_color:, annotation_color:
      }, ]

  detectablesMap: {:detectable_id => {detectables_props_from_above}}

  dataSummary: {"Localization Count", "Annotation Count", "Video Count", "Frame Count"}

  dataFullLocalizations: {:video_id => {:frame_number => {:detectable_id => [loclz]}}}
    where loclz: {zdist_thresh:, prob_score:, scale: , x:, y:, w:, h:}

  dataFullAnnotations: {:video_id => {:frame_number => {:detectable_id => [anno]}}}
    where anno: {x0:, y0:, x1:, y1:, x2:, y2:, x3:, y3}

  videoDataMap: {:video_id => 
    {video_URL:, frame_rate:, detection_rate:, frame_number_start:, frame_number_end:}
  }
*/

ZIGVU.DataManager.DataStore = function() {
  var self = this;
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
    self.detectablesMap = {};
    self.detectables = _.each(dets, function(d){
      d.pretty_name = textFormatters.ellipsisForAnnotation(d.pretty_name);
      d.button_color = colorCreator.getColorButton();
      d.button_hover_color = colorCreator.getColorButtonHover();
      d.annotation_color = colorCreator.getColorAnnotation();

      colorCreator.nextColor();
      self.detectablesMap[d.id] = d;
      return d;
    });
  };

  this.reset = function(){
    self.chiaVersions = undefined;
    self.detectables = undefined;
    self.detectablesMap = undefined;
    self.dataSummary = undefined;
    self.dataFullLocalizations = undefined;
    self.dataFullAnnotations = undefined;
    self.videoDataMap = undefined;
  };
};