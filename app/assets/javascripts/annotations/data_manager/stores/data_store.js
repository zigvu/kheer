var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};
ZIGVU.DataManager.Stores = ZIGVU.DataManager.Stores || {};

/*
  This class stores all server provided data.
*/

/*
  Data structure:
  [Note: Ruby style hash (:keyname => value) implies that raw id are used as keys of objects.
  JS style hash implies that (keyname: value) text are used as keys of objects.]

  chiaVersions: [
    {id:, name:, description:, settings: {zdistThresh: [zdistValues, ], scales: [scale, ]}},
  ]

  detectables: {annotation: det, localization: det, alllist: det, decorations: map}
    where:
      det: [ { id:, name:, pretty_name:, chia_detectable_id: }, ]
      map: {:detectable_id => 
          { id:, name:, pretty_name:,
            button_color:, button_hover_color:, annotation_color:
          }
      }

  dataSummary: {"Localization Count", "Annotation Count", "Video Count", "Frame Count"}

  dataFullLocalizations: {:video_id => {:frame_number => {:detectable_id => [loclz]}}}
    where loclz: {zdist_thresh:, prob_score:, scale: , x:, y:, w:, h:}

  dataFullAnnotations: {:video_id => {:frame_number => {:detectable_id => [anno]}}}
    where anno: {chia_version_id:, x0:, y0:, x1:, y1:, x2:, y2:, x3:, y3}

  videoDataMap: {:video_id => 
    {video_url:, playback_frame_rate:, detection_frame_rate:, frame_number_start:, frame_number_end:}
  }

  colorMap: {:integer => 'rgb', }

  cellMap: {cell_idx: {x:, y:, w:, h:}, }

  tChartData: [{name:, color:, values: [{counter: score:}, ]}, ]
  toCounterMap: {:video_id => {:frame_number => counter}}
  fromCounterMap: {:counter => {video_id: , frame_number:}}

*/

ZIGVU.DataManager.Stores.DataStore = function() {
  var self = this;
  this.colorCreator = new ZIGVU.Helpers.ColorCreator();
  this.textFormatters = new ZIGVU.Helpers.TextFormatters();

  this.chiaVersions = undefined;
  this.detectables = { 
    annotation: undefined, localization: undefined, 
    alllist: undefined, decorations: undefined 
  };

  this.dataSummary = undefined;
  this.dataFullLocalizations = undefined;
  this.dataFullAnnotations = undefined;
  this.videoDataMap = undefined;
  this.colorMap = undefined;
  this.cellMap = undefined;

  // timeline chart data
  this.tChartData = undefined;
  this.toCounterMap = undefined;
  this.fromCounterMap = undefined;

  this.reset = function(){
    self.chiaVersions = undefined;
    self.detectables = { 
      annotation: undefined, localization: undefined, 
      alllist: undefined, decorations: undefined 
    };

    self.dataSummary = undefined;
    self.dataFullLocalizations = undefined;
    self.dataFullAnnotations = undefined;
    
    self.videoDataMap = undefined;
    self.colorMap = undefined;
    self.cellMap = undefined;

    self.tChartData = undefined;
    self.toCounterMap = undefined;
    self.fromCounterMap = undefined;
  };
};