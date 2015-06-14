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
    var headerArr = ['Video Id', 'Video Title', 'Length (h:m:s)', '# Clips', 'Select'];
    var bodyArr = _.map(allVideoList, function(video){
      return [
        video.video_id, 
        video.title, 
        video.pretty_length, 
        video.clips.length, 
        '<input type="checkbox" name="' + inputName + '" value="' 
        + video.video_id + '" id="input-filter-video-ids">'
      ];
    });
    var submitButton = htmlGenerator.newButton(submitButtonId, 'Submit');
    var cancelButton = htmlGenerator.newButton(cancelButtonId, 'Cancel');
    bodyArr.push([cancelButton, '', '', submitButton]);

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));

    // resolve promise on button clicks
    $('#' + submitButtonId).click(function(){
      var videoIds = $('input[name="' + inputName + '"]:checked', divId_filterTable)
        .map(function() { return parseInt(this.value); }).get();

      if(videoIds.length > 0){ requestDefer.resolve({ status: true, data: videoIds }); }
    });
    $('#' + cancelButtonId).click(function(){
      requestDefer.resolve({ status: false, data: undefined });
    });

    return requestDefer.promise;
  };

  this.displayInfo = function(videoList){
    self.empty();
    // convert data to a tabular form
    var headerArr = ['Video Id', 'Video Title', 'Length (h:m:s)', '# Clips'];
    var bodyArr = _.map(videoList, function(video){
      return [video.video_id, video.title, video.pretty_length, video.clips.length];
    });

    $(divId_filterTable).append(htmlGenerator.table(headerArr, bodyArr));
  };

  this.empty = function(){ $(divId_filterTable).empty(); };

  this.show = function(){ $(divId_filterContainer).show(); };
  this.hide = function(){ $(divId_filterContainer).hide(); };
};
