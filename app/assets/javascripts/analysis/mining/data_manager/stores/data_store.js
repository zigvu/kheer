var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.DataManager = Mining.DataManager || {};
Mining.DataManager.Stores = Mining.DataManager.Stores || {};

/*
  This class stores all server provided data.
*/

/*
  Data structure:
  [Note: Ruby style hash (:keyname => value) implies that raw id are used as keys of objects.
  JS style hash implies that (keyname: value) text are used as keys of objects.]

  firstEvaluatedVideoFn: int

  miningData: {
    chiaVersions: {localization: <chiaVersion>, annotation:<chiaVersion>},
    detectables: {localization: <detectables>, annotation:<detectables>},
    videos: [<video>, ],
    clips: [<clip>, ],
    clipSet: [{video_id:, clip_id:}],
    selectedDetIds: [int, ],
    smartFilter: {spatial_intersection_thresh:,}
  }

  where:
    <chiaVersion>: {
      id:, name:, settings: {zdistThresh: [zdistValue, ], scales: [scale, ]}
    }
    <detectables>: [{id:, name:, pretty_name:, chia_detectable_id:}, ]
    <video>: {video_id:, title:, playback_frame_rate:, detection_frame_rate:}
    <clip>: {clip_id:, clip_url:, clip_fn_start:, clip_fn_end:, length:}

  dataFullLocalizations: {:video_id => {:video_fn => {:detectable_id => [loclz]}}}
    where loclz: {
      chia_version_id:, zdist_thresh:, prob_score:, 
      spatial_intersection:, scale:, x:, y:, w:, h:
    }

  dataFullAnnotations: {:video_id => {:video_fn => {:detectable_id => [anno]}}}
    where anno: {chia_version_id:, x0:, y0:, x1:, y1:, x2:, y2:, x3:, y3}

  colorMap: {:integer => 'rgb', }
  cellMap: {cell_idx: {x0:, y0:, x3:, y3:}, }

  detectables: {decorations: 
        {:detectable_id => 
          { id:, name:, pretty_name:,
            button_color:, button_hover_color:, annotation_color:
          }
        },    }

  videoClipMap: {
    sortedClipIds: [],
    clipMap: {:clip_id => {
      video_id:, title:, playback_frame_rate:, detection_frame_rate:, 
      clip_id:, clip_url:, clip_fn_start:, clip_fn_end:, length:
    }, }
  }

  tChartDataLoc: [{name:, color:, values: [{counter: score:}, ]}, ]
  tChartDataAnno: [{name:, color:, values: [{counter: score:}, ]}, ]
  toCounterMap: {:clip_id => {:clip_fn => counter}}
  fromCounterMap: {:counter => {clip_id: , clip_fn:}}

  videoState = {current:, previous:}
    where current/previous is difned in file: 
    annotations/data_manager/accessors/localization_data_accessor.js -> getVideoState()

*/

Mining.DataManager.Stores.DataStore = function() {
  var self = this;
  this.colorCreator = new Mining.Helpers.ColorCreator();
  this.textFormatters = new Mining.Helpers.TextFormatters();

  // TODO: get from config
  this.firstEvaluatedVideoFn = 1

  // raw data
  this.miningData = undefined;
  this.dataFullLocalizations = undefined;
  this.dataFullAnnotations = undefined;
  this.colorMap = undefined;
  this.cellMap = undefined;

  // massaged data
  this.detectables = { decorations: undefined };
  this.videoClipMap = {
    sortedClipIds: undefined, clipMap: undefined
  };

  // timeline chart data
  this.tChartData = undefined;
  this.toCounterMap = undefined;
  this.fromCounterMap = undefined;

  // current states
  this.videoState = {current: undefined, previous: undefined};

  this.reset = function(){
    self.miningData = undefined;
    self.dataFullLocalizations = undefined;
    self.dataFullAnnotations = undefined;
    self.colorMap = undefined;
    self.cellMap = undefined;
    
    self.detectables = { decorations: undefined };
    self.videoClipMap = {
      sortedClipIds: undefined, clipMap: undefined
    };

    self.tChartData = undefined;
    self.toCounterMap = undefined;
    self.fromCounterMap = undefined;

    self.videoState = {current: undefined, previous: undefined};
  };
};
