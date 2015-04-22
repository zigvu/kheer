var ZIGVU = ZIGVU || {};
ZIGVU.Controller = ZIGVU.Controller || {};

/*
  This class coordinates action between all annotation classes.
*/

ZIGVU.Controller.EventManager = function() {
  var self = this;

  //------------------------------------------------  
  var paintFrameCallbacks = $.Callbacks("unique");
  this.addPaintFrameCallback = function(callback){ paintFrameCallbacks.add(callback); };
  this.firePaintFrameCallback = function(args){ paintFrameCallbacks.fire(args); };

  var frameNavigateCallbacks = $.Callbacks("unique");
  this.addFrameNavigateCallback = function(callback){ frameNavigateCallbacks.add(callback); };
  this.fireFrameNavigateCallback = function(args){ frameNavigateCallbacks.fire(args); };

  //------------------------------------------------  


  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('ZIGVU.Controller.EventManager -> ' + errorReason);
  };
};


