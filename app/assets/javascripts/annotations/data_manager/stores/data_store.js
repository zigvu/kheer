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

  firstEvaluatedVideoFn: int
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

  dataFullLocalizations: {:video_id => {:video_fn => {:detectable_id => [loclz]}}}
    where loclz: {zdist_thresh:, prob_score:, scale: , x:, y:, w:, h:}

  dataFullAnnotations: {:video_id => {:video_fn => {:detectable_id => [anno]}}}
    where anno: {chia_version_id:, x0:, y0:, x1:, y1:, x2:, y2:, x3:, y3}

  videoList: [
    { video_id:, title:, playback_frame_rate:, detection_frame_rate:, 
      clips: [{ clip_id:, clip_url:, clip_fn_start:, clip_fn_end:, length: }, ],
      pretty_length:
    },
  ]

  videoClipMap: {
    sortedVideoIds: [], sortedClipIds: [], clipIdToVideoId: {:clip_id => :video_id},
    clipMap: {:clip_id => {
      video_id:, title:, playback_frame_rate:, detection_frame_rate:, 
      clip_id:, clip_url:, clip_fn_start:, clip_fn_end:, length:
    }}
  }

  colorMap: {:integer => 'rgb', }

  cellMap: {cell_idx: {x0:, y0:, x3:, y3:}, }

  tChartData: [{name:, color:, values: [{counter: score:}, ]}, ]
  toCounterMap: {:clip_id => {:clip_fn => counter}}
  fromCounterMap: {:counter => {clip_id: , clip_fn:}}

  videoState = {current:, previous:}
    where current/previous is difned in file: 
    annotations/data_manager/accessors/localization_data_accessor.js -> getVideoState()

  selectedChiaVersionSettings = {zdistThresh: [zdistValues, ], scales: [scale, ]}
*/

ZIGVU.DataManager.Stores.DataStore = function() {
  var self = this;
  this.colorCreator = new ZIGVU.Helpers.ColorCreator();
  this.textFormatters = new ZIGVU.Helpers.TextFormatters();

  // TODO: get from config
  this.firstEvaluatedVideoFn = 1
  this.chiaVersions = undefined;
  this.detectables = { 
    annotation: undefined, localization: undefined, 
    alllist: undefined, decorations: undefined 
  };
  this.videoList = undefined;

  this.dataSummary = undefined;
  this.dataFullLocalizations = undefined;
  this.dataFullAnnotations = undefined;
  this.videoClipMap = {
    sortedVideoIds: undefined, sortedClipIds: undefined, 
    clipIdToVideoId: undefined, clipMap: undefined
  };
  this.colorMap = undefined;
  this.cellMap = undefined;

  // timeline chart data
  this.tChartData = undefined;
  this.toCounterMap = undefined;
  this.fromCounterMap = undefined;
  // current states
  this.videoState = {current: undefined, previous: undefined};

  this.selectedChiaVersionSettings = undefined;

  this.reset = function(){
    self.chiaVersions = undefined;
    self.detectables = { 
      annotation: undefined, localization: undefined, 
      alllist: undefined, decorations: undefined 
    };
    self.videoList = undefined;

    self.dataSummary = undefined;
    self.dataFullLocalizations = undefined;
    self.dataFullAnnotations = undefined;
    
    self.videoClipMap = {
      sortedVideoIds: undefined, sortedClipIds: undefined, 
      clipIdToVideoId: undefined, clipMap: undefined
    };
    self.colorMap = undefined;
    self.cellMap = undefined;

    self.tChartData = undefined;
    self.toCounterMap = undefined;
    self.fromCounterMap = undefined;
    self.videoState = {current: undefined, previous: undefined};

    self.selectedChiaVersionSettings = undefined;
  };
};