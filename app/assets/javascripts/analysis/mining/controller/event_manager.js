var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.Controller = Mining.Controller || {};

/*
  This class manages JQuery callbacks across all classes.
*/

Mining.Controller.EventManager = function() {
  var self = this;

  // define callbacks
  //------------------------------------------------
  var paintFrameCallbacks = $.Callbacks("unique");
  this.addPaintFrameCallback = function(callback){ paintFrameCallbacks.add(callback); };
  this.firePaintFrameCallback = function(args){ paintFrameCallbacks.fire(args); };

  var frameNavigateCallbacks = $.Callbacks("unique");
  this.addFrameNavigateCallback = function(callback){ frameNavigateCallbacks.add(callback); };
  this.fireFrameNavigateCallback = function(args){ frameNavigateCallbacks.fire(args); };

  var annoListSelectedCallbacks = $.Callbacks("unique");
  this.addAnnoListSelectedCallback = function(callback){ annoListSelectedCallbacks.add(callback); };
  this.fireAnnoListSelectedCallback = function(args){ annoListSelectedCallbacks.fire(args); };

  var statusFrameCallbacks = $.Callbacks("unique");
  this.addStatusFrameCallback = function(callback){ statusFrameCallbacks.add(callback); };
  this.fireStatusFrameCallback = function(args){ statusFrameCallbacks.fire(args); };

  var updateAnnoChartCallback = $.Callbacks("unique");
  this.addUpdateAnnoChartCallback = function(callback){ updateAnnoChartCallback.add(callback); };
  this.fireUpdateAnnoChartCallback = function(args){ updateAnnoChartCallback.fire(args); };

  //------------------------------------------------


  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('Mining.Controller.EventManager -> ' + errorReason);
  };
};


