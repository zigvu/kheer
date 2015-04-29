var ZIGVU = ZIGVU || {};
ZIGVU.VideoHandler = ZIGVU.VideoHandler || {};

/*
  This class manages the display associated with video control containers
*/

ZIGVU.VideoHandler.VideoControlsContainer = function(videoPlayer) {
  var self = this;

  var divId_videoTimelineContainer = '#video-controls-timeline-container';
  var divId_videoControlsPlayerContainer = '#video-controls-player-container';
  var divId_toggleVideoControlsContainer = '#toggle-video-controls-container';

  var divId_toggleHeatmap = '#toggle-heatmap';
  var divId_videoPlaybackSpeed = '#video-playback-speed';

  $(divId_toggleVideoControlsContainer).click(function(){ 
    if($(divId_videoControlsPlayerContainer).is(":visible")){
      $(divId_videoTimelineContainer).show();
      $(divId_videoControlsPlayerContainer).hide();
    } else {
      $(divId_videoTimelineContainer).hide();
      $(divId_videoControlsPlayerContainer).show();      
    }
  });

  $(divId_toggleHeatmap).click(function(){
    if(videoPlayer.isHeatmapEnabled()){
      videoPlayer.enableHeatmap(false);
      $(divId_toggleHeatmap).removeClass('alert');
    } else {
      videoPlayer.enableHeatmap(true);
      $(divId_toggleHeatmap).addClass('alert');
    }
  });

  this.setVideoPlaybackSpeed = function(speed){
    var s = Math.round(speed * 10)/10;
    $(divId_videoPlaybackSpeed).text(s);
  };
  
};
