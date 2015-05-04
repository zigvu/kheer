var ZIGVU = ZIGVU || {};
ZIGVU.VideoHandler = ZIGVU.VideoHandler || {};

/*
  This class captures and handles player controls.
*/

ZIGVU.VideoHandler.VideoPlayerControls = function(videoPlayer) {
  var self = this;
  var disabled = true;

  var divId_previousHit = '#player-previous-hit';
  var divId_fastPlayBackward = '#player-rewind';
  var divId_pausePlayback = '#player-pause';
  var divId_startPlayback = '#player-play';
  var divId_fastPlayForward = '#player-fast-forward';
  var divId_nextHit = '#player-next-hit';

  var divId_videoTimelineContainer = '#video-controls-timeline-container';
  var divId_videoControlsPlayerContainer = '#video-controls-player-container';
  var divId_toggleVideoControlsContainer = '#toggle-video-controls-container';

  var divId_drawHeatmap = '#draw-heatmap';
  var divId_videoPlaybackSpeed = '#video-playback-speed';


  // capture clicks
  $(divId_previousHit).click(function(){ if(disabled){ return; }; videoPlayer.previousHit(); });
  $(divId_fastPlayBackward).click(function(){ if(disabled){ return; }; videoPlayer.fastPlayBackward(); });
  $(divId_pausePlayback).click(function(){ if(disabled){ return; }; videoPlayer.pausePlayback(); });
  $(divId_startPlayback).click(function(){ if(disabled){ return; }; videoPlayer.startPlayback(); });
  $(divId_fastPlayForward).click(function(){ if(disabled){ return; }; videoPlayer.fastPlayForward(); });
  $(divId_nextHit).click(function(){ if(disabled){ return; }; videoPlayer.nextHit(); });

  $(divId_toggleVideoControlsContainer).click(function(){ toggleVideoControlsContainer(); });
  $(divId_drawHeatmap).click(function(){ videoPlayer.paintHeatmap(); });

  this.setVideoPlaybackSpeed = function(speed){
    var s = Math.round(speed * 10)/10;
    $(divId_videoPlaybackSpeed).text(s);
  };
  

  // capture keycodes
  $(document).keypress(function(e) {
    if(disabled){ return; }; 
    switch(e.which) {
      case 100: // 'd'
        videoPlayer.deleteAnnotation();
        e.preventDefault();
        e.stopPropagation();
        break;

      case 32: // 'SPACE'
        videoPlayer.togglePlay();
        e.preventDefault();
        e.stopPropagation();
        break;

      case 101: // 'e'
        videoPlayer.nextFrame();
        e.preventDefault();
        e.stopPropagation();
        break;

      case 119: // 'w'
        videoPlayer.previousFrame()
        e.preventDefault();
        e.stopPropagation();
        break;

      case 113: // 'q'
        videoPlayer.skipFewFramesBack();
        e.preventDefault();
        e.stopPropagation();
        break;

      case 118: // 'v'
        videoPlayer.skipFewFramesForward();
        e.preventDefault();
        e.stopPropagation();
        break;

      case 102: // 'f'
        videoPlayer.nextHit();
        e.preventDefault();
        e.stopPropagation();
        break;

      case 114: // 'r'
        videoPlayer.previousHit();
        e.preventDefault();
        e.stopPropagation();
        break;

      case 43: // '+'
        videoPlayer.playFaster();
        e.preventDefault();
        e.stopPropagation();
        break;

      case 45: // '-'
        videoPlayer.playSlower();
        e.preventDefault();
        e.stopPropagation();
        break;

      case 61: // '='
        videoPlayer.playNormal();
        e.preventDefault();
        e.stopPropagation();
        break;

      case 116: // 't'
        toggleVideoControlsContainer();
        e.preventDefault();
        e.stopPropagation();
        break;

      case 104: // 'h'
        videoPlayer.paintHeatmap();
        e.preventDefault();
        e.stopPropagation();
        break;

      default:
        //console.log("Unknown key " + e.which);
    }
  });

  this.enable = function(){
    $(divId_previousHit).removeClass('disabled');
    $(divId_fastPlayBackward).removeClass('disabled');
    $(divId_pausePlayback).removeClass('disabled');
    $(divId_startPlayback).removeClass('disabled');
    $(divId_fastPlayForward).removeClass('disabled');
    $(divId_nextHit).removeClass('disabled');
    $(divId_drawHeatmap).removeClass('disabled');
    disabled = false;
  };

  this.disable = function(){
    $(divId_previousHit).addClass('disabled');
    $(divId_fastPlayBackward).addClass('disabled');
    $(divId_pausePlayback).addClass('disabled');
    $(divId_startPlayback).addClass('disabled');
    $(divId_fastPlayForward).addClass('disabled');
    $(divId_nextHit).addClass('disabled');
    $(divId_drawHeatmap).addClass('disabled');
    disabled = true;
  };

  function toggleVideoControlsContainer(){
    if($(divId_videoControlsPlayerContainer).is(":visible")){
      $(divId_videoTimelineContainer).show();
      $(divId_videoControlsPlayerContainer).hide();
    } else {
      $(divId_videoTimelineContainer).hide();
      $(divId_videoControlsPlayerContainer).show();      
    }
  };
};
