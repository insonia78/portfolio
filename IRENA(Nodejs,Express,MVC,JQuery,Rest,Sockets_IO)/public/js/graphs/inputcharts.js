/*
 * Copyright 2018 Acelerex Inc.
 */
$(document).ready(function () {
        google.charts.load('current', {packages: ['corechart']});

//	updateCapbyFuelChart('generation-cap-fuel');
//	updateHydroGraph();

	//append update of cap by fuel chart to a data update
	$('#cap-by-fuel-dynamic tbody').on('focusin keyup mouseup', function () {
		updateCapbyFuelChart('generation-cap-fuel');

	});

//	$(window).resize(function () {
//		updateCapbyFuelChart('generation-cap-fuel');
//		updateHydroGraph();
//
//	})

	//append update of hydro capcity
	$('#hydro-monthly-energy tbody').on('focusin keyup mouseup', function () {
		updateHydroGraph();
	});

});

function updateHydroGraph() {
	//Draw Capacity by fuel input value
	//get values from Hydro Gen
	var k = 0;
	var data_hydro = [];
	$('#hydro-monthly-energy tbody td').each(function (i, row) {
		k = k + 1;

		var $val = $(row).find('input');
		data_hydro.push([k + '', parseInt($val.val())]);
	});
	//console.log(data_hydro);
	table2ColumnChart($('#hydro-profile-graph').get(0), data_hydro, 'Hydro Generation Capacity');
}

function updateCapbyFuelChart(chart_id) {
	var data = [];//[['Generation','MW']]
	$('#cap-by-fuel-dynamic tbody').find('tr').each(function (i, row) {

		var $prop = $(row).find('th select');
		var $val = $(row).find('td').eq(1).find('input');
		data.push([$prop.find(':selected').text(), parseInt($val.val())]);
	});
        if(chart_id==="cappertechchart")
        {
            data.push(["Wind",parseFloat($("#windcappol1").val())]);
            data.push(["Solar",parseFloat($("#solarcappol1").val())]);
            data.push(["Hydro",parseFloat($("#hydrocap1").val())])
        }
	table2PieChart(document.getElementById(chart_id), data, 'Capacity by Fuel Type');
}

function updateSysBenefitChart() {

}


function table2PieChart(element, array, divTitle) {
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {

		//var Gdata = google.charts.visualization.arrayToDataTable(array,false);
		var Gdata = new google.visualization.DataTable();
		Gdata.addColumn('string', 'Property');
		Gdata.addColumn('number', 'Magnitude');
		var group_array = [];

		array.forEach(function (a) {
			if (!this[a[0]]) {
				this[a[0]] = [a[0], 0];
				group_array.push(this[a[0]]);
			}
			this[a[0]][1] += a[1];

		}, {});


		Gdata.addRows(group_array)

		var options = {
			title: divTitle,
			pieHole: 0.4,
			heigth: 300,
                        width: 800,
			chartArea: { left: 0, top: 30, width: 800, height: 500 },
			legend: 'labeled'
                        
		};
                console.log(element);
		var chart = new google.visualization.PieChart(element);
		chart.draw(Gdata, options);
	}
}

function table2ColumnChart(element, array, divTitle) {
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
		var Gdata = new google.visualization.DataTable();
		Gdata.addColumn('string', 'Property');
		Gdata.addColumn('number', 'Generation(GWh)');
		Gdata.addRows(array)

		var options = {
			title: divTitle,
			heith: 300,
			width: 800,
			legend: { position: "none" },
			hAxis: {
				title: 'Month',
				viewWindowMode: 'pretty'

			},
			vAxis: {
				title: 'GWh',
				viewWindowMode: 'pretty'
			},
			chartArea: { width: '100%' }

		};

		var chart = new google.visualization.ColumnChart(element);
		chart.draw(Gdata, options);
	}
}

function table2BarChart(element, array, divTitle) {
	google.charts.setOnLoadCallback(drawChart);
	
	function drawChart() {
		var Gdata = new google.visualization.DataTable();
		Gdata.addColumn('string', 'Property');
		Gdata.addColumn('number', 'Benefit');
		Gdata.addRows(array)

		var options = {
			title: divTitle,
			height: 300,
			width: 800,
			legend: 'none',
			chartArea: {
				top: 5,
				height: '100%',
				left: '40%',
				bottom:'10%'
			},
			hAxis: {
				title: '$',
				minValue: 0,
			},
		};

		var chart = new google.visualization.BarChart(element);
		chart.draw(Gdata, options);
	}
}
