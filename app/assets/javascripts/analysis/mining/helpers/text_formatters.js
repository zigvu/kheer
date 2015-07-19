var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.Helpers = Mining.Helpers || {};

/*
  Format text
*/

Mining.Helpers.TextFormatters = function() {
  var self = this;

  var ellipsisAnnotationMaxChars = 30;
  this.ellipsisForAnnotation = function(label){ return self.ellipsis(label, ellipsisAnnotationMaxChars); };

  this.ellipsis = function(label, maxChars){
    var retLabel = label.substring(0, maxChars);
    // if truncated, show ellipsis
    if (retLabel.length != label.length){
      retLabel = retLabel.substring(0, retLabel.length - 4) + "...";
      // if less than 5 characters, show nothing
      retLabel = retLabel.length <= 5 ? "" : retLabel;
    }
    return retLabel;
  };

  this.getReadableTime = function(timeInMS){
    var seconds = timeInMS/1000;
    var numyears = Math.floor(seconds / 31536000);
    var numdays = Math.floor((seconds % 31536000) / 86400); 
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    numseconds = Math.floor(numseconds * 1000) / 1000;

    return numhours + " : " + numminutes + " : " + numseconds;
  };

};