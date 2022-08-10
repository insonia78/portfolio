/*
 * Copyright 2018 Acelerex Inc.
 */
$(document).ready(function () {

  $('#userdemandprofile1').val('/home/gonzales1609/IRENA/SBT/data/Demand/North.csv');
   $('#userdemandprofile2').val('/home/gonzales1609/IRENA/SBT/data/Demand/North.csv'); 
   $('#userbasewind1').val('/home/gonzales1609/IRENA/SBT/data/Generation/Wind/Median.csv');  
   $('#userbasesolar1').val('/home/gonzales1609/IRENA/SBT/data/Generation/Solar/Median.csv');
   $('#userbasewind2').val('/home/gonzales1609/IRENA/SBT/data/Generation/Wind/Median.csv');  
   $('#userbasesolar2').val('/home/gonzales1609/IRENA/SBT/data/Generation/Solar/Median.csv');
  //bind on click to download
  var optDemand = {
    options: ['North', 'Equator', 'South'],
    folder: '../data/Demand',
    ylabel: 'MW',
    scale:1
  }
  
  var optSolar = {
    options: ['High', 'Median', 'Low'],
    folder: '../data/Generation/Solar',
    ylabel: '%',
    scale: 100
  }

  var optWind = {
    options: ['High', 'Median', 'Low'],
    folder: '../data/Generation/Wind',
    ylabel: '%',
    scale: 100
  }

  //Initial Set-up
  getData($('#demand-profile-graph1').get(0), 'North', optDemand, 'Northern Hemisphere');
  getData($('#demand-profile-graph2').get(0), 'North', optDemand, 'Northern Hemisphere');
  getData($('#wind-profile-graph1').get(0), 'High', optWind, 'High');
  getData($('#solar-profile-graph1').get(0), 'High', optSolar, 'High');
  getData($('#wind-profile-graph2').get(0), 'High', optWind, 'High');
  getData($('#solar-profile-graph2').get(0), 'High', optSolar, 'High');

  console.log("Bind to graph called");
  //plot WIND profile depending of user selection
  bindGraph2Select('#basewind1',
    '#wind-profile-graph1', optWind);
  bindGraph2Select('#basewind2',
    '#wind-profile-graph2', optWind);

  //plot SOLAr profile depending of user selection
  bindGraph2Select('#basesolar1',
    '#solar-profile-graph1', optSolar);
  bindGraph2Select('#basesolar2',
    '#solar-profile-graph2', optSolar);


  for (var year = 0; year < 2; year++) {
    //plot DEMAND profile depending of user selection
    console.log(year);
    bindGraph2Select('#demandprofile' + (year + 1),
      '#demand-profile-graph' + (year + 1),
      optDemand);

  }
  google.charts.load('current', {'packages':['corechart','line']});
  
  
});


var updateInputProfiles = function(elementID, path,options) {
  var aux = { 'path': path };

  //console.log(JSON.stringify(aux));

  $.ajax({
    url: '/get-input-profiles',
    type: 'post',
    data: JSON.stringify(aux),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (result) {

      if (result.status === true) {
        var data =processText(result.profile, options.scale);
        //console.log(data)
        plotGraph($(elementID).get(0), data, options.ylabel, options.legend);

      }
      else {
        console.log('Could not load input files');
      }

    }
  });  //Bind this call to a RETRIEVE output API call
}


var getData = function(element, opt, options, myHeader = '') {
  var path = options.folder + '/' + opt + '.csv';
  
  $.ajax({
    // type: "GET",
    url: path,

    success: function (data) {
      //get data consistency

      plotGraph(element, processText(data, options.scale), options.ylabel, myHeader);

    }
  });
}

var plotGraph = function(element, data, myYlabel = 'Value', myHeader = 'V') {
    var myTitle;
    var id = $(element).attr("id"); 
    if(id==="wind-profile-graph1"){
        myTitle = "Wind Year 1";
    }else if(id==="wind-profile-graph2"){
        myTitle = "Wind Year 2";
    }else if(id==="solar-profile-graph1"){
        myTitle = "Solar Year 1";
    }else if(id==="solar-profile-graph2"){
        myTitle = "Solar Year 2";
    }else if(id==="demand-profile-graph1"){
        myTitle = "Demand Year 1";
    }else if(id==="demand-profile-graph2"){
        myTitle = "Demand Year 2";
    }
    
    var g = new Dygraph(element, data, {
    // options go here. See http://dygraphs.com/options.html
    title: myTitle,
    width: 400,
    height: 200,
    legend: 'always',
    animatedZooms: true,
    ylabel: myYlabel,
    xlabel: 'Hour',
    labels: ['Hour', myHeader]
  });
}

var processText = function(csv, scale = .3) {
  var allTextLines = [];
  if (typeof (csv) === 'string') {
    allTextLines = csv.split(/\r\n|\n/);
  }
  else{
    allTextLines=csv;
  }


  var lines = allTextLines.map(function (val, hour) {
    return [hour, Number(val) * scale];
  });

  return lines;
}

var bindGraph2Select = function(selectID, graphID, options)
{
    
    $(selectID).click(
        function ()
        {
            var opt = $(this).val();
            if( opt === "")
                return;
            var allOpt = options.options;//['High', 'Median', 'Low'];

            if (allOpt.includes(opt))
            {
                getData($(graphID).get(0), opt, options, $(this).val());
                if (selectID == "#demandprofile1") {$('#userdemandprofile1').val('/home/gonzales1609/IRENA/SBT/data/Demand/'+opt+'.csv'); };
                if (selectID == "#demandprofile2") {$('#userdemandprofile2').val('/home/gonzales1609/IRENA/SBT/data/Demand/'+opt+'.csv'); };
                if (selectID == "#basewind1")  {$('#userbasewind1').val('/home/gonzales1609/IRENA/SBT/data/Generation/Wind/'+opt+'.csv');  };
                if (selectID == "#basewind2")  {$('#userbasewind2').val('/home/gonzales1609/IRENA/SBT/data/Generation/Wind/'+opt+'.csv');  };
                if (selectID == "#basesolar1") {$('#userbasesolar1').val('/home/gonzales1609/IRENA/SBT/data/Generation/Solar/'+opt+'.csv'); };
                if (selectID == "#basesolar2") {$('#userbasesolar2').val('/home/gonzales1609/IRENA/SBT/data/Generation/Solar/'+opt+'.csv'); };
            }

            if (opt === 'User')
            {
                $file = $(this).siblings('.my-file-selector');
                $file.trigger('click');
                if ($file[0].files && $file[0].files[0])
                {
                console.log('Loading user csv');    
                    var reader = new FileReader();
                    reader.readAsText($file[0].files[0]);
                    reader.onload = function (e)
                    {
                        var text = e.target.result;
                        console.log(text)
			$.post(
                            'save_user_profile',
                            { userdemandprofile: text },
			    function (msg)
                            {
				
                                var res = msg;
                                if (selectID == "#demandprofile1") {$('#userdemandprofile1').val(res.saved_path); };
                                if (selectID == "#demandprofile2") {$('#userdemandprofile2').val(res.saved_path); };
                                if (selectID == "#basewind1")  {$('#userbasewind1').val(res.saved_path);  };
                                if (selectID == "#basesolar1") {$('#userbasesolar1').val(res.saved_path); };
                                if (selectID == "#basewind2")  {$('#userbasewind2').val(res.saved_path);  };
                                if (selectID == "#basesolar2") {$('#userbasesolar2').val(res.saved_path); };
                                plotGraph($(graphID).get(0), processText(text, options.scale), options.ylabel, 'User Defined');
			    }
                        );
                    }
                }
            }

            console.log('Select changed to:' + opt);
        }
    );
}

var plotDyChart = function(chart_id,chart_type,data,labels,chart_label_id, y_label){
   
   console.log("Loading "+chart_id);
   
   var element = document.getElementById(chart_id); 
  
    if(chart_type==="line")
   {
   
   g = new Dygraph(element, data,
          {
            labels: labels,
            labelsDiv: chart_label_id,
            legend: 'always',
            rollPeriod: 1,
            showRoller: true,
            xlabel:"Hours",
            ylabel: y_label,
            animatedZooms: true,
            width: 800,
            height: 300
          });
    }
    else if(chart_type==='area')
    {
      var g = new Dygraph(
      element,
      data,
      {
        labels: labels,
        labelsDiv: chart_label_id,
        legend: 'always',
        width: 800,
        height: 300,
        stackedGraph: true,
        xlabel:"Hours",
        ylabel:y_label,
        stackedGraphNanFill: "none",
        rollPeriod: 1,
        showRoller: true,
        highlightCircleSize: 2,
        strokeWidth: 1,
        strokeBorderWidth: null,
       
        highlightSeriesOpts: {
          strokeWidth: 3,
          strokeBorderWidth: 1,
          highlightCircleSize: 5
        }
      });

  var onclick = function(ev) {
    if (g.isSeriesLocked()) {
      g.clearSelection();
    } else {
      g.setSelection(g.getSelection(), g.getHighlightSeries(), true);
    }
  };
  g.updateOptions({clickCallback: onclick}, true);

    }       
  else
  {
    
    
    for(var i=1;i<data.length;i++)
    {
        for(var j=0;j<data[0].length; j++)
        {
            data[i][j]=parseFloat(data[i][j]);
        }
    }
    var sum_generation = Array.from(Array(data[0].length-1),() => 0);
    
    for(var i=1;i<data.length;i++)
    {
        for(var j=1;j<data[0].length;j++)
        {
            sum_generation[j-1]+=data[i][j];
        }
    }
    
    var nThermGen = $('#cap-by-fuel-dynamic tbody').find('tr').length;
    var selectedTech = $('#cap-by-fuel-dynamic tbody').find('.fuel-options :selected');
    var thermGenList = [];
    for(var i=0;i<nThermGen;i++)
    {
        thermGenList.push(selectedTech.eq(i).text());
    }
    var sum_array = [["Technology","Hourly Generation"]];
    for(i=0;i<nThermGen;i++)
    {
        sum_array.push([thermGenList[i],sum_generation[i]]);
    }
    
    var windGen = parseFloat($('#outwind1').text());
    var solarGen = parseFloat($('#outsolarpv1').text());
    var damGen = parseFloat($('#outdam1').text());
    
    sum_array.push(['Wind', windGen]);
    sum_array.push(['Solar',solarGen]);
    sum_array.push(['Hydro',damGen]);
    console.log(sum_array);
    
    google.charts.setOnLoadCallback(init);
  }
   function init(){
       genPerTechChart(sum_array,chart_id);
   }
};



function genPerTechChart(data,chart_id) {
  
  //var filename = '';
  //var filepath = path+filename;
        
        data = google.visualization.arrayToDataTable(data);
        var options = {
            'title': 'Generation by Fuel Type',
            
            pieHole:0.4,
            width:800,
            height:300,
            chartArea: { left: 0, top: 30, width: '100%', height: 500 },
            legend: 'labeled'
          };

          var chart = new google.visualization.PieChart(document.getElementById(chart_id));
          chart.draw(data, options);
}


