var ZIGVU = ZIGVU || {};
ZIGVU.Analysis = ZIGVU.Analysis || {};
ZIGVU.Analysis.Mining = ZIGVU.Analysis.Mining || {};

var Mining = ZIGVU.Analysis.Mining;
Mining.ChartManager = Mining.ChartManager || {};

/*
  Generate commonly used HTML elements.
*/

Mining.ChartManager.HtmlGenerator = function() {
  var self = this;

  // get a new button
  this.newButton = function(divId, buttonText){
    return '<div class="button small success" id="' + divId +'">' + buttonText + '</div>';
  };

  this.newTextInput = function(divId, defaultValue){
    return '<INPUT type="text" SIZE="5" id="' + divId + '" VALUE="' + defaultValue + '">';
  };

  // get table from a array structured data
  this.table = function(headerArr, bodyArr){
    var table = '<table>';
    table = table + self.tableHeader(headerArr);
    table = table + self.tableBody(bodyArr);
    table += '</table>';
    return table;
  };

  this.tableHeader = function(headerArr){
    var header = '<thead>';
    _.each(headerArr, function(h){
      header = header + '<td>' + h + '</td>';
    });
    header += '</thead>';
    return header;
  };

  this.tableBody = function(bodyArr){
    var body = '<tbody>';
    _.each(bodyArr, function(tdArr){
      body = body + self.tableRow(tdArr);
    });
    body += '</tbody>';
    return body;
  };

  this.tableRow = function(tdArr){
    var row = '<tr>';
    _.each(tdArr, function(td){
      row = row + '<td>' + td + '</td>';
    });
    row += '</tr>';
    return row;
  };

  this.formatArray = function(arr){
    var ar = '[';
    _.each(arr, function(a, idx, list){
      if (idx == 0){
        ar = ar + a;
      } else {
        ar = ar + ', ' + a;
      }
    });
    ar += ']';
    return ar;
  };

};