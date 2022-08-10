//
// //When calculations are complete load all charts.
//
// //NEED TO CHECK FOR CALCULATIONS COMPLETE
//
// /*
// $(document).ready(function(){
// g = new Dygraph(
//
//     // containing div
//     document.getElementById("enerpriceprofilechart"), "High.csv");
// });
// */
//
// //var loadGoogleCharts = function(username,scenario,case)
// //{
//
//   //var path = '/opt/slt_data/'+username+'/'+scenario+'/'+case +'/';
//
//
//   $(window).on("load",function(){
//   $.getScript("../js/jquery-csv.js",function(){
//   google.charts.setOnLoadCallback(genPerTechChart);
//   google.charts.setOnLoadCallback(capPerTechChart);
//   energyPriceChart();
//   //google.charts.setOnLoadCallback(energyPriceChart);
//   google.charts.setOnLoadCallback(genProfileChart);
//   //google.charts.setOnLoadCallback(primResProfile);
//   //google.charts.setOnLoadCallback(secResProfile);
//   //google.charts.setOnLoadCallback(terResProfile);
//   //google.charts.setOnLoadCallback(reservePriceChart);
//   });
//
// });
//
//
//   function genPerTechChart() {
//     //var filename = '';
//     //var filepath = path+filename;
//
//
//       $.ajax({url: "js/graphs/sample.csv", dataType: "text", success:function(data){
//           var data = $.csv.toArrays(data);
//           for (var i=1;i<data.length;i++){
//             data[i][1] = parseFloat(data[i][1]);
//           }
//
//           data = google.visualization.arrayToDataTable(data);
//           var options = {
//               'title': 'Sum of Hourly Generation Per Technology',
//               'width':700,
//               'height':500
//             };
//
//             var chart = new google.visualization.PieChart(document.getElementById('genpertechchart'));
//             chart.draw(data, options);
//
//       }});
//
//
//     }
//
//
//
//
//
//   function capPerTechChart(){
//       $.ajax({url: "js/graphs/sample.csv", dataType: "text", success:function(data){
//           var data = $.csv.toArrays(data);
//           for (var i=1;i<data.length;i++){
//             data[i][1] = parseFloat(data[i][1]);
//           }
//
//           data = google.visualization.arrayToDataTable(data);
//           var options = {
//               'title': 'Sum of Hourly Generation Per Technology',
//               'width':700,
//               'height':500
//             };
//
//             var chart = new google.visualization.PieChart(document.getElementById('cappertechchart'));
//             chart.draw(data, options);
//       }});
//
//   }
//
//   function energyPriceChart(){
//
//       var element = document.getElementById("enerpriceprofilechart");
//       var path = "js/graphs/sample1.csv";
//       $.ajax({url: path , success:function(data){
//         g = new Dygraph(element, data,
//             {
//               rollPeriod: 2,
//               showRoller: true,
//               animatedZooms: true,
//               drawGrid: true
//             }
//         );
//       }});
// }
//
// function genProfileChart(){
//
//   $.ajax({url: "js/graphs/area_sample.csv", dataType: "text", success:function(data){
//       var data = $.csv.toArrays(data);
//       console.log(data);
//       for (var i=1;i<data.length;i++){
//         data[i][0] = parseInt(data[i][0]);
//         for(var j=1; j<data[0].length;j++)
//         {
//           data[i][j] = parseFloat(data[i][j]);
//         }
//       }
//
//       data = google.visualization.arrayToDataTable(data);
//       console.log(data);
//       var options = {
//           'title': 'Hourly Generation Per Technology',
//           hAxis: {title: 'Hours',  titleTextStyle: {color: '#333'}},
//           vAxis: {minValue: 0},
//           width: 1000,
//           height: 300
//         };
//
//         var chart = new google.visualization.AreaChart(document.getElementById('genprofilechart'));
//         chart.draw(data, options);
//   }});
//
// }
//
// function primResProfile(){
//   var data = google.visualization.arrayToDataTable([
//             ['Year', 'Sales', 'Expenses'],
//             ['2013',  1000,      400],
//             ['2014',  1170,      460],
//             ['2015',  660,       1120],
//             ['2016',  1030,      540]
//           ]);
//
//           var options = {
//             title: 'Company Performance',
//             hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
//             vAxis: {minValue: 0},
//             'width': 1000,
//             'height':300
//           };
//
//           var chart = new google.visualization.AreaChart(document.getElementById('primreschart'));
//           chart.draw(data, options);
// }
//
// function secResProfile(){
//   var data = google.visualization.arrayToDataTable([
//             ['Year', 'Sales', 'Expenses'],
//             ['2013',  1000,      300],
//             ['2014',  1170,      460],
//             ['2015',  660,       1120],
//             ['2016',  1030,      540]
//           ]);
//
//           var options = {
//             title: 'Company Performance',
//             hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
//             vAxis: {minValue: 0},
//             'width': 1000,
//             'height':300
//           };
//
//           var chart = new google.visualization.AreaChart(document.getElementById('secreschart'));
//           chart.draw(data, options);
// }
//
// function terResProfile(){
//   var data = google.visualization.arrayToDataTable([
//             ['Year', 'Sales', 'Expenses'],
//             ['2013',  1000,      400],
//             ['2014',  1170,      460],
//             ['2015',  660,       1120],
//             ['2016',  1030,      540]
//           ]);
//
//           var options = {
//             title: 'Company Performance',
//             hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
//             vAxis: {minValue: 0},
//             'width': 1000,
//             'height':300
//           };
//
//           var chart = new google.visualization.AreaChart(document.getElementById('terreschart'));
//           chart.draw(data, options);
// }
//
// function reservePriceChart(){
//   var data = new google.visualization.DataTable();
//       data.addColumn('number', 'X');
//       data.addColumn('number', 'Dogs');
//       data.addColumn('number', 'Cats');
//
//       data.addRows([
//         [0, 0, 0],    [1, 10, 5],   [2, 23, 15],  [3, 17, 9],   [4, 18, 10],  [5, 9, 5],
//         [6, 11, 3],   [7, 27, 19],  [8, 33, 25],  [9, 40, 32],  [10, 32, 24], [11, 35, 27],
//         [12, 30, 22], [13, 40, 32], [14, 42, 34], [15, 47, 39], [16, 44, 36], [17, 48, 40],
//         [18, 52, 44], [19, 54, 46], [20, 42, 34], [21, 55, 47], [22, 56, 48], [23, 57, 49],
//         [24, 60, 52], [25, 50, 42], [26, 52, 44], [27, 51, 43], [28, 49, 41], [29, 53, 45],
//         [30, 55, 47], [31, 60, 52], [32, 61, 53], [33, 59, 51], [34, 62, 54], [35, 65, 57],
//         [36, 62, 54], [37, 58, 50], [38, 55, 47], [39, 61, 53], [40, 64, 56], [41, 65, 57],
//         [42, 63, 55], [43, 66, 58], [44, 67, 59], [45, 69, 61], [46, 69, 61], [47, 70, 62],
//         [48, 72, 64], [49, 68, 60], [50, 66, 58], [51, 65, 57], [52, 67, 59], [53, 70, 62],
//         [54, 71, 63], [55, 72, 64], [56, 73, 65], [57, 75, 67], [58, 70, 62], [59, 68, 60],
//         [60, 64, 56], [61, 60, 52], [62, 65, 57], [63, 67, 59], [64, 68, 60], [65, 69, 61],
//         [66, 70, 62], [67, 72, 64], [68, 75, 67], [69, 80, 72]
//       ]);
//
//       var options = {
//         hAxis: {
//           title: 'Time',
//           textStyle: {
//             color: '#01579b',
//             fontSize: 20,
//             fontName: 'Arial',
//             bold: true,
//             italic: true
//           },
//           titleTextStyle: {
//             color: '#01579b',
//             fontSize: 16,
//             fontName: 'Arial',
//             bold: false,
//             italic: true
//           }
//         },
//         vAxis: {
//           title: 'Popularity',
//           textStyle: {
//             color: '#1a237e',
//             fontSize: 24,
//             bold: true
//           },
//           titleTextStyle: {
//             color: '#1a237e',
//             fontSize: 24,
//             bold: true
//           }
//         },
//         colors: ['#a52714', '#097138'],
//         'width':1000,
//         'height':300
//       };
//       var chart = new google.visualization.LineChart(document.getElementById('respricechart'));
//       chart.draw(data, options);
//
// }
