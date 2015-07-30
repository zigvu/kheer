
$(".analysis_mining_setup_confusion_finder.show").ready(function() {
  // special case for wicked wizard since it always uses show - disable
  // when in non-confusion.html.erb page
  if(!window.isInConfusionPage){ return; }

  $("#heatmap-submit").addClass('disabled');

  heatmapChart = undefined;
  dataManager = new MiningSetup.Confusion.DataManager();
  populateFilters();

  showSpinner();
  dataManager.getFullDataPromise()
    .then(function(){
      hideSpinner();
      heatmapChart = new MiningSetup.Confusion.HeatmapChart(dataManager);
      $("#maxNumOfLocalizations").text(dataManager.getMaxNumOfLocalizations());
      $("#heatmap-submit").removeClass('disabled');
    })
    .catch(function (errorReason) {
      displayJavascriptError(errorReason);
    });

  $("#heatmap-submit").click(function(){
    if($("#heatmap-submit").hasClass('disabled')){ return; }
    $("#heatmap-submit").addClass('disabled');
    showSpinner();
    populateFilters();
    dataManager.getFullDataPromise()
      .then(function(){
        hideSpinner();
        heatmapChart.repaint();
        $("#heatmap-submit").removeClass('disabled');
        $("#maxNumOfLocalizations").text(dataManager.getMaxNumOfLocalizations());
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

    var secZdist = parseFloat($("#secZdistThresh").val());
    var secScales = $('input[name="secScales"]:checked').map(function() { 
      return parseFloat(this.value); 
    }).get();

    var intThreshs = $('input[name="intThreshs"]:checked').map(function() { 
      return parseFloat(this.value); 
    }).get();

    dataManager.updateFilters(priZdist, priScales, secZdist, secScales, intThreshs);
  };
});
