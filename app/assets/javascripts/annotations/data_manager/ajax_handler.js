var ZIGVU = ZIGVU || {};
ZIGVU.DataManager = ZIGVU.DataManager || {};

/*
  This class handles talking with rails server.
*/

ZIGVU.DataManager.AjaxHandler = function() {
  var _this = this;

  // note: while jquery ajax return promises, they are deficient
  // and we need to convert to `q` based promises
  this.getRequestPromise = function(url, params){
    var requestDefer = Q.defer();
    $.ajax({
      url: url,
      data: params,
      type: "GET",
      success: function(json){ requestDefer.resolve(json) },
      error: function( xhr, status, errorThrown ) {
        requestDefer.reject("ZIGVU.DataManager.AjaxHandler: " + errorThrown);
      }
    });
    return requestDefer.promise;
  };


};