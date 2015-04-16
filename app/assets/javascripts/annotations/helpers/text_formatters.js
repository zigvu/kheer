var ZIGVU = ZIGVU || {};
ZIGVU.Helpers = ZIGVU.Helpers || {};

/*
  Format text
*/

ZIGVU.Helpers.TextFormatters = function() {
  var _this = this;

  var ellipsisAnnotationMaxChars = 30;
  this.ellipsisForAnnotation = function(label){ return this.ellipsis(label, ellipsisAnnotationMaxChars); };

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
};