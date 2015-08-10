
$(".analysis_mining_setup_confusion_finder.show").ready(function() {
  // special case for wicked wizard since it always uses show - disable
  // when not in confusion.html.erb page
  if(!window.isInConfusionPage){ return; }

  var buttonDisabled = false;
  disableButtons();

  heatmapChart = undefined;
  eventManager = new MiningSetup.Confusion.EventManager();
  dataManager = new MiningSetup.Confusion.DataManager();
  dataManager.setEventManager(eventManager);

  populateFilters();

  showSpinner();
  dataManager.getFullDataPromise()
    .then(function(){
      hideSpinner();
      heatmapChart = new MiningSetup.Confusion.HeatmapChart(dataManager);
      heatmapChart.setEventManager(eventManager);

      enableButtons();
    })
    .catch(function (errorReason) {
      displayJavascriptError(errorReason);
    });

  $("#heatmap-submit").click(function(){
    if(buttonDisabled){ return; }
    disableButtons();

    showSpinner();
    populateFilters();
    dataManager.getFullDataPromise()
      .then(function(){
        hideSpinner();
        enableButtons();
      })
      .catch(function (errorReason) {
        displayJavascriptError(errorReason);
      });
  });

  $("#heatmap-hide-diagonal").click(function(){
    if(buttonDisabled){ return; }
    disableButtons();
    dataManager.setZeroDiagonal();
    enableButtons();
  });


  function populateFilters(){
    var priZdist = parseFloat($("#priZdistThresh").val());
    var priScales = $('input[name="priScales"]:checked').map(function() { 
      return parseFloat(this.value); 
    }).get();

    var secZdist = parseFloat($("#secZdistThresh").val());
    var secScales = $('input[name="secScales"]:checked').map(function() { 
      return parseFloat(this.value); 
    }).get();

    var intThreshs = $('input[name="intThreshs"]:checked').map(function() { 
      return parseFloat(this.value); 
    }).get();

    dataManager.updateFilters(priZdist, priScales, secZdist, secScales, intThreshs);
  };

  function enableButtons(){
    buttonDisabled = false;
    $("#heatmap-submit").removeClass('disabled');
    $("#heatmap-hide-diagonal").removeClass('disabled');
    $("#maxNumOfLocalizations").text(dataManager.getMaxNumOfLocalizations());
  };

  function disableButtons(){
    buttonDisabled = true;
    $("#heatmap-submit").addClass('disabled');
    $("#heatmap-hide-diagonal").addClass('disabled');
  };
});
