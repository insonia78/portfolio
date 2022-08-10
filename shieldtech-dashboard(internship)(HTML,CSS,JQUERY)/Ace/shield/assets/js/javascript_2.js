/* 
 * SHIELDtech javascript.js
 * v2.0
 * 
 * Latest version: 
 *
 * build x.x.0:
 *
 * NOTE: Remember conventions and always error-proof your code.
 *    - Watch this video: https://www.youtube.com/watch?v=_EANG8ZZbRs
 *    - Use http://www.jslint.com/
 */
var archiveAlert = function (value) {
  "use strict";
  $.ajax({
    type: "POST",
    url: '../db/archive_alerts.php',
    data: { aid : value }
  }).success(function (data) {
    if (data === "success") {
      $('div#' + value).slideUp("fast", function () {
        $('div#' + value).remove();
      });
    } else {
      alert(data);
    }
  }).fail(function () {
    alert("Error archiving alert.");
  });
};
$(document).ready(function ($) {
  "use strict";
  (function () {
    var data_array = [],
      exception = false;
    setInterval(function () {
      $.get('../db/query_alerts.php', function (data) {
        (function () {
          var i = 0,
            replace_html = '<div id="object_group"> </div>',
            alerts = {
              append_html: function (i) {
                var alert_html = '<!-- Alert --> <div class="panel panel-danger aid" id="' + data[i].aid + '"> <!-- Alert title --> <div class="panel-heading row"> <!-- Alert information buttons --> <div class="panel-title col-xs-6 col-md-8 text-left"> <div class="btn btn-danger btn-md no-border" style="margin-right:-4px"> Alert ID: <span id="aid' + data[i].aid + '"></span> </div> <div class="btn btn-danger btn-md no-border" style="margin-right:-4px"> <span id="timestamp' + data[i].aid + '"></span> </div> <div id="location_button' + data[i].aid + '" class="btn btn-inverse btn-md no-hover" onclick="showMarker(' + data[i].initial_loc_lat + ', ' + data[i].initial_loc_long + ')"> Location : <span id="initial_loc_lat' + data[i].aid + '"></span>, <span id="initial_loc_long' + data[i].aid + '"></span> </div> </div> <!-- /Alert information buttons --> <!-- Alert toggle/archive buttons --> <div class="col-xs-6 col-md-4 text-right"> <button type="button" class="btn btn-danger btn-md" data-toggle="collapse" data-target="#collapse' + data[i].aid + '">Toggle Alert</button> <button type="button" class="btn btn-success btn-md" onclick="archiveAlert(' + data[i].aid + ')">Archive Alert</button> </div> <!-- /Alert toggle/archive buttons --> </div> <!-- /Alert title --> <!-- Alert body --> <div id="collapse' + data[i].aid + '" class="panel-collapse collapse"> <div class="panel-body"> <div class="row"> <!-- Profile user Photo. --> <div class="col-xs-6 col-md-4"> <div class="thumbnail" id="photo_id' + data[i].aid + '" style="width:230px"> </div> </div> <!-- /Profile user Photo. --> <!-- Profile user Information. --> <div class="col-xs-12 col-sm-6 col-md-8"> <div class="profile-user-info profile-user-info-striped"> <div class="profile-info-row"> <div class="profile-info-name"> Phone Number </div> <div class="profile-info-value"> <span class="editable" id="phone_cell' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> First Name </div> <div class="profile-info-value"> <span class="editable" id="name_first' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Last Name </div> <div class="profile-info-value"> <span class="editable" id="name_last' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Age </div> <div class="profile-info-value"> <span class="editable" id="dob' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Medical Issues </div> <div class="profile-info-value"> <span class="editable" id="medical_issues' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Blood Type </div> <div class="profile-info-value"> <span class="editable" id="blood_type' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Assigned Dorm Building </div> <div class="profile-info-value"> <span class="editable" id="dorm_building' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Dorm Room Number </div> <div class="profile-info-value"> <span class="editable" id="dorm_roomnum' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> CWID </div> <div class="profile-info-value"> <span class="editable" id="cwid' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Registered Email </div> <div class="profile-info-value"> <span class="editable" id="email' + data[i].aid + '"></span> </div> </div> </div> </div> <!-- /Profile user Informaiton --> </div> </div> </div> <!-- /Alert body --> </div> <!-- /Alert -->';
                $('div#object_group').hide();
                $('div#object_group').append(alert_html);
                $('span#aid' + data[i].aid).append(data[i].aid);
                $('span#timestamp' + data[i].aid).append(data[i].start_time);
                $('span#initial_loc_lat' + data[i].aid).append(data[i].initial_loc_lat);
                $('span#initial_loc_long' + data[i].aid).append(data[i].initial_loc_long);
                $('span#phone_cell' + data[i].aid).append(data[i].phone_cell);
                $('span#name_first' + data[i].aid).append(data[i].name_first);
                $('span#name_last' + data[i].aid).append(data[i].name_last);
                $('span#medical_issues' + data[i].aid).append(data[i].medical_issues);
                $('span#blood_type' + data[i].aid).append(data[i].blood_type);
                $('span#dorm_building' + data[i].aid).append(data[i].dorm_building);
                $('span#dorm_roomnum' + data[i].aid).append(data[i].dorm_roomnum);
                $('span#cwid' + data[i].aid).append(data[i].cwid);
                $('span#email' + data[i].aid).append(data[i].email);
                $('span#dob' + data[i].aid).append(data[i].dob);
                $('div#photo_id' + data[i].aid).append('<img src="../assets/images/stock.png">');
                $('div#object_group').slideDown(500);
              },
              replace_html: function () {
                $('div#object_group').replaceWith(replace_html);
              }
            },
            exceptions = function () {
              var exception_html = '<div class="panel panel-success"> <div class="panel-heading"> <div class="panel-title"> <b>No alerts detected. On system stand-by.</b> </div> </div> </div>';
              if (!exception) {
                $('div#object_group').replaceWith(replace_html);
                $('div#object_group').append(exception_html);
                $('div#object_group').hide();
                $('div#object_group').slideDown(500);
              } else {
                $('div#object_group').replaceWith(replace_html);
                $('div#object_group').append(exception_html);
              }
            };
          if (!data) {
            exceptions();
            exception = true;
          } else {
            for (i = 0; i < Object.keys(data).length; i = i + 1) {
              if (data_array.indexOf(data[i].aid) === (-1)) {
                if (exception) {
                  alerts.replace_html();
                  exception = false;
                }
                alerts.append_html(i);
                data_array.push(data[i].aid);
              }
            }
          }
        }());
      });
    }, 1000);
  }());
});