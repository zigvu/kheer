
$(".analysis_mining_setup_zdist_differencer.show").ready(function() {
  // special case for wicked wizard since it always uses show - disable
  // when not in difference.html.erb page
  if(!window.isInDifferencePage){ return; }

  var buttonDisabled = false;
  disableButtons();

  heatmapChart = undefined;
  eventManager = new MiningSetup.Difference.EventManager();
  dataManager = new MiningSetup.Difference.DataManager();
  dataManager.setEventManager(eventManager);

  populateFilters();

  showSpinner();
  dataManager.getFullDataPromise()
    .then(function(){
      hideSpinner();
      heatmapChart = new MiningSetup.Difference.HeatmapChart(dataManager);
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

  function populateFilters(){
    var priZdist = parseFloat($("#priZdistThresh").val());
    var priScales = $('input[name="priScales"]:checked').map(function() { 
      return parseFloat(this.value); 
    }).get();

    var secZdists = $('input[name="secZdists"]:checked').map(function() { 
      return parseFloat(this.value); 
    }).get();

    var intThresh = parseFloat($("#intThresh").val());

    dataManager.updateFilters(priZdist, priScales, secZdists, intThresh);
  };

  function enableButtons(){
    buttonDisabled = false;
    $("#heatmap-submit").removeClass('disabled');
    $("#maxNumOfLocalizations").text(dataManager.getMaxNumOfLocalizations());
  };

  function disableButtons(){
    buttonDisabled = true;
    $("#heatmap-submit").addClass('disabled');
  };
});
