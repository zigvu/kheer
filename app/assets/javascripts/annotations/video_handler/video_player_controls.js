var ZIGVU = ZIGVU || {};
ZIGVU.VideoHandler = ZIGVU.VideoHandler || {};

/*
  This class captures and handles player controls.
*/

ZIGVU.VideoHandler.VideoPlayerControls = function(videoPlayer) {
  var _this = this;
  var disabled = true;

  var divId_firstVideo = '#player-first';
  var divId_fastPlayBackward = '#player-rewind';
  var divId_pausePlayback = '#player-pause';
  var divId_startPlayback = '#player-play';
  var divId_fastPlayForward = '#player-fast-forward';
  var divId_lastVideo = '#player-last';

  // capture clicks
  $(divId_firstVideo).click(function(){ if(disabled){ return; }; videoPlayer.firstVideo(); });
  $(divId_fastPlayBackward).click(function(){ if(disabled){ return; }; videoPlayer.fastPlayBackward(); });
  $(divId_pausePlayback).click(function(){ if(disabled){ return; }; videoPlayer.pausePlayback(); });
  $(divId_startPlayback).click(function(){ if(disabled){ return; }; videoPlayer.startPlayback(); });
  $(divId_fastPlayForward).click(function(){ if(disabled){ return; }; videoPlayer.fastPlayForward(); });
  $(divId_lastVideo).click(function(){ if(disabled){ return; }; videoPlayer.lastVideo(); });

  // capture keycodes
  $(document).keypress(function(e) {
    if(disabled){ return; }; 
    switch(e.which) {
      case 97: // 'a'
        videoPlayer.startAnnotation(); break;
      case 115: // 's'
        videoPlayer.saveAnnotation(); break;
      case 8: // 'BACK_SPACE'
        videoPlayer.deleteAnnotation(); break;
      case 32: // 'SPACE'
        videoPlayer.togglePlay(); break;
      case 101: // 'e'
        videoPlayer.nextFrame(); break;
      case 112: // 'p'
        videoPlayer.previousFrame(); break;
      case 60: // '<'
        videoPlayer.skipFewFramesBack(); break;
      case 62: // '>'
        videoPlayer.skipFewFramesForward(); break;
      case 43: // '+'
        videoPlayer.playFaster(); break;
      case 45: // '-'
        videoPlayer.playSlower(); break;
      case 61: // '='
        videoPlayer.playNormal(); break;
      default:
        //console.log("Unknown key " + e.which);
    }
    e.preventDefault();
    e.stopPropagation();
  });

  this.enable = function(){
    $(divId_firstVideo).removeClass('disabled');
    $(divId_fastPlayBackward).removeClass('disabled');
    $(divId_pausePlayback).removeClass('disabled');
    $(divId_startPlayback).removeClass('disabled');
    $(divId_fastPlayForward).removeClass('disabled');
    $(divId_lastVideo).removeClass('disabled');
    disabled = false;
  };

  this.disable = function(){
    $(divId_firstVideo).addClass('disabled');
    $(divId_fastPlayBackward).addClass('disabled');
    $(divId_pausePlayback).addClass('disabled');
    $(divId_startPlayback).addClass('disabled');
    $(divId_fastPlayForward).addClass('disabled');
    $(divId_lastVideo).addClass('disabled');
    disabled = true;
  };
};
