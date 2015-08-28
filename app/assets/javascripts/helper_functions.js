/*------------------------------------------------
	Begin: Helper functions
	------------------------------------------------*/


//------------------------------------------------
/* Display error and message */
displayJavascriptError = function(error) {
	$('#javascript-error').html(
		'<div data-alert class="alert-box alert">' + 
			'<div>' + error + '</div>' +
			'<a href="#" class="close" id="javascript-error-close">&times;</a>' +
		'</div>'
	);

	$('#javascript-error-close').click(function(){
		$('#javascript-error').empty();
	});
};

displayJavascriptMessage = function(message) {
	$('#javascript-message').html(
		'<div data-alert class="alert-box success">' + 
			'<div>' + message + '</div>' +
			'<a href="#" class="close" id="javascript-message-close">&times;</a>' +
		'</div>'
	);

	$('#javascript-message-close').click(function(){
		$('#javascript-message').empty();
	});

	// hide after 10 seconds
	Q.delay(10000).then($('#javascript-message-close').click());
};

//------------------------------------------------


//------------------------------------------------
/* Chart elements debounce time */
// do not call the functions (those decorated by underscore.js)
// more than once in the time below
chartDebounceTime = 500; // milliseconds


//------------------------------------------------
/* To show/hide wait spinners */
showSpinner = function() {
  $("#spinner-overlay").center();
  $("#spinner-popup").center();
  $("#spinner-overlay").show();
  $("#spinner-popup").show();
  $("#spinner-popup").spin("large", "white");
}
hideSpinner = function() {
  $("#spinner-overlay").hide();
  $("#spinner-popup").hide();
  $("#spinner-popup").spin(false);
};


// when clicking the next button in a wizard, show spinner
// note: no need to hide spinner since there will be a page change anyways
$("#wizard-setup-next").click(function(){
  showSpinner();
});
//------------------------------------------------

//------------------------------------------------
/* Decorate top-bar navigation li items with "active" class */
function decorateNavigationList(){
	// for each page, we set class to controller name
	var bodyClass = $('body').attr('class').split(" ");
	for (var i = 0, l = bodyClass.length; i < l; ++i) {
		// get the right element - assume id is set for each li
		var navElem = $("li#" + bodyClass[i]);
		// set active class
		$("nav.top-bar").find(navElem).attr('class', 'active');
	}
}
//------------------------------------------------

//------------------------------------------------
/* Sort objects with IDs */
function sortById(a, b){
  var aId = a.id;
  var bId = b.id; 
  return ((aId < bId) ? -1 : ((aId > bId) ? 1 : 0));
};
//------------------------------------------------

//------------------------------------------------
/* Log time */
var timeLogEnabled = true;
var timeLogs = {};
function timeLogStart(logId){
	if (timeLogEnabled){
		timeLogs[logId] = new Date();
	}
};
function timeLogEnd(logId, message){
	if (timeLogEnabled){
		console.log("Time: " + message + ": " + ((new Date()).getTime() - timeLogs[logId].getTime())/1000);
	}
};
//------------------------------------------------

//------------------------------------------------
/* Debugging print tool for filters */
function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {} else {}
		if (typeof(f.top) != "undefined") {
			f = f.top(Infinity);
		} else {}
		if (typeof(f.dimension) != "undefined") {
			f = f.dimension(function(d) { return "";}).top(Infinity);
		} else {}
		console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
	}
//print_filter("brandCrowdingGroup");
//------------------------------------------------  
