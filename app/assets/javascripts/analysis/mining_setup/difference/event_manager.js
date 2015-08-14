var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.MiningSetup = ZIGVU.Analysis.MiningSetup || {};

var MiningSetup = ZIGVU.Analysis.MiningSetup;
MiningSetup.Difference = MiningSetup.Difference || {};

/*
  This class manages JQuery callbacks across all classes.
*/

MiningSetup.Difference.EventManager = function() {

  var self = this;

  // define callbacks
  //------------------------------------------------
  var redrawHeatmapCallbacks = $.Callbacks("unique");
  this.addRedrawHeatmapCallback = function(callback){ redrawHeatmapCallbacks.add(callback); };
  this.fireRedrawHeatmapCallback = function(args){ redrawHeatmapCallbacks.fire(args); };

  // shorthand for error printing
  this.err = function(errorReason){
    displayJavascriptError('MiningSetup.Difference.EventManager -> ' + errorReason);
  };
};
