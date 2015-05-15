var ZIGVU = ZIGVU || {};
ZIGVU.ChartManager = ZIGVU.ChartManager || {};
ZIGVU.ChartManager.ChartFilters = ZIGVU.ChartManager.ChartFilters || {};

/*
  Video ids filter
*/

ZIGVU.ChartManager.ChartFilters.FilterVideoSelection = function(htmlGenerator) {
  var self = this;

  var divId_filterContainer = "#filter-videos-container";
  var divId_filterTable = "#filter-videos-table";


  this.displayInput = function(allVideoList){
    self.empty();
    var requestDefer = Q.defer();

    var submitButtonId = 'filter-video-list-submit';
    var cancelButtonId = 'filter-video-list-cancel';
    var inputName = "filterVideoListIds";
    // convert data to a tabular form
    var headerArr = ['Video Id', 'Video Collection Id', 'Length (h:m:s)', 'Select'];
    var bodyArr = _.map(allVideoList, function(video){
      return [
        video.video_id, 
        video.video_collection_id, 
        video.pretty_length, 
        '<input type="radio" name="' + inputName + '" value="' 
        + video.video_id + '" id="input-filter-video-ids">'
      ];
    });
    var submitButton = htmlGenerator.newButton(submitButtonId, 'Submit');
    var cancelButton = htmlGenerator.newButton(cancelButtonId, 'Cancel');
    bodyArr.push([cancelButton, '', '', submitButton]);

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));

    // resolve promise on button clicks
    $('#' + submitButtonId).click(function(){
      var videoId = $('input[name="' + inputName + '"]:checked', divId_filterTable).val();
      // TODO: remove once we allow multiple selection - currently convert to array
      if(videoId){ requestDefer.resolve({ status: true, data: [parseInt(videoId)] }); }
    });
    $('#' + cancelButtonId).click(function(){
      requestDefer.resolve({ status: false, data: undefined });
    });

    return requestDefer.promise;
  };

  this.displayInfo = function(videoList){
    self.empty();
    // convert data to a tabular form
    var headerArr = ['Video Id', 'Video Collection Id', 'Length (h:m:s)'];
    var bodyArr = _.map(videoList, function(video){
      return [video.video_id, video.video_collection_id, video.pretty_length];
    });

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));
  };

  this.empty = function(){ $(divId_filterTable).empty(); };

  this.show = function(){ $(divId_filterContainer).show(); };
  this.hide = function(){ $(divId_filterContainer).hide(); };
};
