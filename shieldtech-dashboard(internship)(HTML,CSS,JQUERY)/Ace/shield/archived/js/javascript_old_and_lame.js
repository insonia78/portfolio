/* 
 * SHIELDtech javascript.js
 * v0.0
 * 
 * Latest version: 
 *
 * build x.x.0:
 *
 * NOTE: Remember conventions and always error-proof your code.
 *		  - Watch this video: https://www.youtube.com/watch?v=_EANG8ZZbRs
 *        - Use http://www.jslint.com/
 */

function gmcreate() {
	function initialize() {
		var fetched_location = new google.maps.LatLng(40.8654094, -74.195979);
		var mapOptions = {
			zoom: 18,
			center: fetched_location,
			scrollwheel: false,
		};
		var map = new google.maps.Map(document.getElementById('alerts-map-canvas'), mapOptions);
		
		var marker = new google.maps.Marker({
			position: fetched_location,
			map: map,
			title: 'distress location'
		});
	}
	google.maps.event.addDomListener(window, 'load', initialize);
}

$(document).ready(function($) {
gmcreate();
var c = 0;
var i = 0;
var data_array = [];
var exception = false;
$.get('../db/query_alerts.php', function(data) {

	try {
		Object.keys(data).length;
		while ( i < Object.keys(data).length ) {
			if ( c == 0 ) {
				var html = '<div id="all-alerts" class="panel panel-danger"> </div>';
				$('div#alerts').append(html);
			}
				var html = '<div class="panel-heading"> <div class="row"> <div class="col-xs-12 col-sm-6 col-md-8"> <div class="panel-title" id="alerts-title"> <h3><b id="aid'+c+'"></b>&nbsp&nbsp<span id="start_time'+c+'"></span></h3> </div> </div> <div id="alerts-accordion" class="col-xs-6 col-md-4 text-right"> <button type="button" class="btn btn-danger btn-lg" data-toggle="collapse" data-target="#collapse'+c+'" >Toggle Alert</button> &nbsp&nbsp <button type="button" class="btn btn-success btn-lg">&nbspArchive&nbsp</button> </div> </div> </div> <div id="collapse'+c+'" class="panel-collapse collapse in"> <div class="panel-body"> <div class="row"> <div class="col-xs-6 col-md-4"> <div class="thumbnail" id="photo_id'+c+'" style="width:230px"> </div> </div> <div class="col-xs-12 col-sm-6 col-md-8"> <div class="profile-user-info profile-user-info-striped"> <div class="profile-info-row"> <div class="profile-info-name"> Phone Number </div> <div class="profile-info-value"> <span class="editable" id="phone_cell'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> First Name </div> <div class="profile-info-value"> <span class="editable" id="name_first'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Last Name </div> <div class="profile-info-value"> <span class="editable" id="name_last'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Age </div> <div class="profile-info-value"> <span class="editable" id="dob'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Medical Issues </div> <div class="profile-info-value"> <span class="editable" id="medical_issues'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Blood Type </div> <div class="profile-info-value"> <span class="editable" id="blood_type'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Assigned Dorm Building </div> <div class="profile-info-value"> <span class="editable" id="dorm_building'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Dorm Room Number </div> <div class="profile-info-value"> <span class="editable" id="dorm_roomnum'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> CWID </div> <div class="profile-info-value"> <span class="editable" id="cwid'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Registered Email </div> <div class="profile-info-value"> <span class="editable" id="email'+c+'"></span> </div> </div> </div> </div> </div> </div> </div>';
				$('div#all-alerts').append(html);
				$('b#aid'+c).append(data[i].aid);
				$('span#start_time'+c).append(data[i].start_time);
				$('span#phone_cell'+c).append(data[i].phone_cell);
				$('span#name_first'+c).append(data[i].name_first);
				$('span#name_last'+c).append(data[i].name_last);
				$('span#medical_issues'+c).append(data[i].medical_issues);
				$('span#blood_type'+c).append(data[i].blood_type);
				$('span#dorm_building'+c).append(data[i].dorm_building);
				$('span#dorm_roomnum'+c).append(data[i].dorm_roomnum);
				$('span#cwid'+c).append(data[i].cwid);
				$('span#email'+c).append(data[i].email);
				$('span#dob'+c).append(data[i].dob);
				$('div#photo_id'+c).append('<img src="../assets/images/stock.png">');
				data_array.push(data[i].aid);
				exception = false;
			i = i + 1;
			c = c + 1;
		}
		i = 0;
	} catch ( e ) {
		exception = true;
		var html = '<div class="panel panel-success"> <div class="panel-heading"> <h3>No alerts detected.&nbsp&nbsp&nbsp&nbspOn system stand-by.</h3> </div> </div>';
		$('div#alerts').append(html);
	}
});

setInterval(function() {
	$.get('../db/query_alerts.php', function(data) {
		try {
			Object.keys(data).length;
			while ( i < Object.keys(data).length ) {
				if ( data_array.indexOf(data[i].aid) == (-1) ) {
					if ( c == 0 ) {
						var html = '<div id="all-alerts" class="panel panel-danger"> </div>';
						$('div#alerts').append(html);
					}
						if ( exception ) {
							var html = '<div id="alerts"> <div id="all-alerts" class="panel panel-danger"> <div class="panel-heading"> <div class="row"> <div class="col-xs-12 col-sm-6 col-md-8"> <div class="panel-title" id="alerts-title"> <h3><b id="aid'+c+'"></b>&nbsp&nbsp<span id="start_time'+c+'"></span></h3> </div> </div> <div id="alerts-accordion" class="col-xs-6 col-md-4 text-right"> <button type="button" class="btn btn-danger btn-lg" data-toggle="collapse" data-target="#collapse'+c+'" >Toggle Alert</button> &nbsp&nbsp <button type="button" class="btn btn-success btn-lg">&nbspArchive&nbsp</button> </div> </div> </div> <div id="collapse'+c+'" class="panel-collapse collapse in"> <div class="panel-body"> <div class="row"> <div class="col-xs-6 col-md-4"> <div class="thumbnail" id="photo_id'+c+'" style="width:230px"> </div> </div> <div class="col-xs-12 col-sm-6 col-md-8"> <div class="profile-user-info profile-user-info-striped"> <div class="profile-info-row"> <div class="profile-info-name"> Phone Number </div> <div class="profile-info-value"> <span class="editable" id="phone_cell'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> First Name </div> <div class="profile-info-value"> <span class="editable" id="name_first'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Last Name </div> <div class="profile-info-value"> <span class="editable" id="name_last'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Age </div> <div class="profile-info-value"> <span class="editable" id="dob'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Medical Issues </div> <div class="profile-info-value"> <span class="editable" id="medical_issues'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Blood Type </div> <div class="profile-info-value"> <span class="editable" id="blood_type'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Assigned Dorm Building </div> <div class="profile-info-value"> <span class="editable" id="dorm_building'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Dorm Room Number </div> <div class="profile-info-value"> <span class="editable" id="dorm_roomnum'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> CWID </div> <div class="profile-info-value"> <span class="editable" id="cwid'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Registered Email </div> <div class="profile-info-value"> <span class="editable" id="email'+c+'"></span> </div> </div> </div> </div> </div> </div> </div> </div> </div>';
							$('div#alerts').replaceWith(html);
							$('b#aid'+c).append(data[i].aid);
							$('span#start_time'+c).append(data[i].start_time);
							$('span#phone_cell'+c).append(data[i].phone_cell);
							$('span#name_first'+c).append(data[i].name_first);
							$('span#name_last'+c).append(data[i].name_last);
							$('span#medical_issues'+c).append(data[i].medical_issues);
							$('span#blood_type'+c).append(data[i].blood_type);
							$('span#dorm_building'+c).append(data[i].dorm_building);
							$('span#dorm_roomnum'+c).append(data[i].dorm_roomnum);
							$('span#cwid'+c).append(data[i].cwid);
							$('span#email'+c).append(data[i].email);
							$('span#dob'+c).append(data[i].dob);
							$('div#photo_id'+c).append('<img src="../assets/images/stock.png">');
							data_array.push(data[i].aid);
							exception = false;
						} else {
							var html = '<div class="panel-heading"> <div class="row"> <div class="col-xs-12 col-sm-6 col-md-8"> <div class="panel-title" id="alerts-title"> <h3><b id="aid'+c+'"></b>&nbsp&nbsp<span id="start_time'+c+'"></span></h3> </div> </div> <div id="alerts-accordion" class="col-xs-6 col-md-4 text-right"> <button type="button" class="btn btn-danger btn-lg" data-toggle="collapse" data-target="#collapse'+c+'" >Toggle Alert</button> &nbsp&nbsp <button type="button" class="btn btn-success btn-lg">&nbspArchive&nbsp</button> </div> </div> </div> <div id="collapse'+c+'" class="panel-collapse collapse in"> <div class="panel-body"> <div class="row"> <div class="col-xs-6 col-md-4"> <div class="thumbnail" id="photo_id'+c+'" style="width:230px"> </div> </div> <div class="col-xs-12 col-sm-6 col-md-8"> <div class="profile-user-info profile-user-info-striped"> <div class="profile-info-row"> <div class="profile-info-name"> Phone Number </div> <div class="profile-info-value"> <span class="editable" id="phone_cell'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> First Name </div> <div class="profile-info-value"> <span class="editable" id="name_first'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Last Name </div> <div class="profile-info-value"> <span class="editable" id="name_last'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Age </div> <div class="profile-info-value"> <span class="editable" id="dob'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Medical Issues </div> <div class="profile-info-value"> <span class="editable" id="medical_issues'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Blood Type </div> <div class="profile-info-value"> <span class="editable" id="blood_type'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Assigned Dorm Building </div> <div class="profile-info-value"> <span class="editable" id="dorm_building'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Dorm Room Number </div> <div class="profile-info-value"> <span class="editable" id="dorm_roomnum'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> CWID </div> <div class="profile-info-value"> <span class="editable" id="cwid'+c+'"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Registered Email </div> <div class="profile-info-value"> <span class="editable" id="email'+c+'"></span> </div> </div> </div> </div> </div> </div> </div>';
							$('div#all-alerts').append(html);
							$('b#aid'+c).append(data[i].aid);
							$('span#start_time'+c).append(data[i].start_time);
							$('span#phone_cell'+c).append(data[i].phone_cell);
							$('span#name_first'+c).append(data[i].name_first);
							$('span#name_last'+c).append(data[i].name_last);
							$('span#medical_issues'+c).append(data[i].medical_issues);
							$('span#blood_type'+c).append(data[i].blood_type);
							$('span#dorm_building'+c).append(data[i].dorm_building);
							$('span#dorm_roomnum'+c).append(data[i].dorm_roomnum);
							$('span#cwid'+c).append(data[i].cwid);
							$('span#email'+c).append(data[i].email);
							$('span#dob'+c).append(data[i].dob);
							$('div#photo_id'+c).append('<img src="../assets/images/stock.png">');
							data_array.push(data[i].aid);
							exception = false;
						}
					c = c + 1;
				}
				i = i + 1;
			} // end while statement
			i = 0;
		} catch ( e ) {
			exception = true;
			var html = '<div id="alerts"> <div class="panel panel-success"> <div class="panel-heading"> <h3>No alerts detected.&nbsp&nbsp&nbsp&nbspOn system stand-by.</h3> </div> </div> </div>';
			$('div#alerts').replaceWith(html);
		}
	});
}, 1000);
});
