/* 

    SHIELDtech dashboard_module.js v4.1

         - Watch this video: https://www.youtube.com/watch?v=_EANG8ZZbRs
         - Use http://www.jslint.com/

 */

// GLOBALS: to be depreciated with backbone.js (these variables are made global to allow annonymous (newly appended/future) alert elements to access archiving and map marker creation functions | these methods will be depreciated with the use of backbone.js's MVC methods and underscore's micro-templating)
"use strict";
var markers = [],
    mapOptions = {
        center: new google.maps.LatLng(40.861807, -74.197657),
        zoom: 17,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }, 
    map = new google.maps.Map(document.getElementById('alerts-map-canvas'), mapOptions),
    addMarker = function (lat, long, aid) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,long),
            title: 'Distress Call [ ID: ' + aid + ' ]' ,
            map: map
        });
        markers[aid] = marker;
    },
    removeMarker = function (aid) {
        if (aid) {
            markers[aid] ? (function (aid, map, markers) {markers[aid].setMap(null);}(aid, map, markers)) : markers[aid] = null;
        }
    },
    archiveAlert = function (value) {
        $.ajax({
            type : "POST",
            url : '../db/archive_alerts.php',
            data : { aid : value }
        }).success(function (data) {
            if (data === "success") {
                $('div#' + value).slideUp("fast", function () {$('div#' + value).remove();}); // removes the element
                removeMarker(value);
                setTimeout(function () {
                    if ($('.aid').toArray().length === 0) {
                        $('#alerts-panel').attr('class', 'alert alert-success');
                        $('div#status_group').html('<div class="progress progress-striped active"><div class="progress-bar progress-bar-striped progress-bar-success active"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">Verification in progress... [Server connection is online.]</div></div>');
                    }
                }, 1000);
            } else {
                alert(data);
            }
        }).fail(function () {
            alert("Error archiving alert.");
        });
    };

// dashboard module core functionality
$(document).ready(function ($) {
    "use strict";
    var died = false,
        values = [],
        _readyStates = [],
        _orgAjax = $.ajaxSettings.xhr;

    // Pushes current alert elements into array, returns individual Alert IDs
    function find_aids(values) {
        $('.aid#undefined').remove();
        $('.aid').toArray().forEach(function (element) {
            values.push(element.id);
        });
        return values;
    }

    // errors function
    function error(values, jqXHR, textStatus, errorThrown) {
        // In the event of a persistant error, we dont want to keep alerting the user over and over (died is set to false when the ajax call is a success)
        if (died === false) {
            setTimeout(function () {
                alert("Could not communictate with the server. Please contact an administrator with this error message. Error text: [ " + jqXHR + " || " + Date() + " ] ");
            }, 1000); // allows the user to interrupt an ajax call with a browser refresh or when closing the tab without being alerted
        }
        // console log the error details (optional)
        /* console.log("--Error details--");
        // console.log("XML Http Request Object:");
        // console.log(jqXHR);
        // console.log("XML Http Request ready state sequence:");
        // console.log(textStatus);
        // console.log("Error discription:");
        // console.log(errorThrown);
        */
        
        died = true;
        setTimeout(function () {
            if (textStatus === 'parsererror') {
                $('#alerts-panel').attr('class', 'alert alert-danger');
                $('div#status_group').html('<div class="progress progress-striped active"><div class="progress-bar progress-bar-striped progress-bar-danger active"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">WARNING: INVALID RESPONSE FROM THE SERVER... [Database error...Server is online.]</div></div>');
            } else {
                $('#alerts-panel').attr('class', 'alert alert-danger');
                $('div#status_group').html('<div class="progress progress-striped active"><div class="progress-bar progress-bar-striped progress-bar-danger active"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">WARNING: COULD NOT CONNECT TO THE SERVER, REATTEMPTING CONNECTION... [Server is offline.]</div></div>');
            }
            _readyStates = [];
            long_poll(find_aids(values));
        }, 3000);
        // long_poll is invoked after 3 seconds (error() happens again if long_poll() fails)
    }

    // Keep track of ready states, compensate for incomplete ajax requests
    $.ajaxSettings.xhr = function () {
        var xhr = _orgAjax();
        xhr.onreadystatechange = function () {
            _readyStates.push(xhr.readyState);
            if (xhr.readyState === 1) {
                if ($('#server-notifier').attr('class') !== 'badge badge-warning') {
                    $('#server-notifier').attr('title', 'Communicating with server.');
                    $('#server-notifier').attr('class', 'badge badge-success');
                    $('#server-notifier-icon').attr('class', 'ace-icon glyphicon glyphicon-refresh bigger-120');
                }
                setTimeout(function () {
                    if (xhr.readyState === 1) {
                        $('#database-notifier').attr('title', 'Database: ONLINE');
                        $('#database-notifier').attr('class', 'badge badge-purple');
                        $('#database-notifier-icon').attr('class', 'ace-icon glyphicon glyphicon-ok-circle bigger-120');
                        $('#server-notifier').attr('title', 'Server: ONLINE');
                        $('#server-notifier').attr('class', 'badge badge-success');
                        $('#server-notifier-icon').attr('class', 'ace-icon glyphicon glyphicon-ok-circle bigger-120');
                    }
                }, 3000);
            }
            // if (xhr.readyState === 2) {
            // }
            // if (xhr.readyState === 3) {
            // }
            if (xhr.readyState === 4) {
                if (_readyStates.indexOf(2) === (-1)) {
                    $('#database-notifier').attr('title', 'Database: OFFLINE');
                    $('#database-notifier').attr('class', 'badge badge-pink');
                    $('#database-notifier-icon').attr('class', 'ace-icon glyphicon glyphicon-remove-circle bigger-120');
                    $('#server-notifier').attr('title', 'Server: OFFLINE');
                    $('#server-notifier').attr('class', 'badge badge-danger');
                    $('#server-notifier-icon').attr('class', 'ace-icon glyphicon glyphicon-remove-circle bigger-120');
                    error(values, xhr, _readyStates, 'Ready state sequence error: ajax request was canceled.');
                } else {
                    if (xhr.response.match('Cannot Connect to')){
                        $('#database-notifier').attr('title', 'Database: OFFLINE');
                        $('#database-notifier').attr('class', 'badge badge-pink');
                        $('#database-notifier-icon').attr('class', 'ace-icon glyphicon glyphicon-remove-circle bigger-120');
                    } else {
                        $('#database-notifier').attr('title', 'Database: ONLINE');
                        $('#database-notifier').attr('class', 'badge badge-purple');
                        $('#database-notifier-icon').attr('class', 'ace-icon glyphicon glyphicon-ok-circle bigger-120');
                    }
                    $('#server-notifier').attr('title', 'Server: ONLINE');
                    $('#server-notifier').attr('class', 'badge badge-success');
                    $('#server-notifier-icon').attr('class', 'ace-icon glyphicon glyphicon-ok-circle bigger-120');
                    _readyStates = [];
                }
            }
        };
        return xhr;
    };

    // Ajax request function
    function long_poll(aids) {
        $.ajax({
            url : '../db/stay_alive.php',
            type : 'POST',
            data : { aids : aids },
            dataType : 'json',
            cache : false
        }).success(function (data) { // our success function

            // alerts is the literal that contains functions that append to the DOM
            var alerts = {
                    append_html: function (i) {
                        var alert_html = '<!-- Alert --> <div class="panel panel-danger aid" id="' + data[i].aid + '" hidden> <!-- Alert title --> <div class="panel-heading row"> <!-- Alert information buttons --> <div class="panel-title col-xs-6 col-md-8 text-left"> <div class="btn btn-danger btn-md no-border" style="margin-right:-4px"> Alert ID: <span id="aid' + data[i].aid + '"></span> </div> <div class="btn btn-danger btn-md no-border" style="margin-right:-4px"> <span id="timestamp' + data[i].aid + '"></span> </div> <div id="location_button' + data[i].aid + '" class="btn btn-inverse btn-md no-hover" onclick="addMarker(' + data[i].initial_loc_lat + ', ' + data[i].initial_loc_long + ', ' + data[i].aid + ')"> Location : <span id="initial_loc_lat' + data[i].aid + '"></span>, <span id="initial_loc_long' + data[i].aid + '"></span> </div> </div> <!-- /Alert information buttons --> <!-- Alert toggle/archive buttons --> <div class="col-xs-6 col-md-4 text-right"> <button type="button" class="btn btn-danger btn-md" data-toggle="collapse" data-target="#collapse' + data[i].aid + '">Toggle Alert</button> <button type="button" class="btn btn-success btn-md" onclick="archiveAlert(' + data[i].aid + ')">Archive Alert</button> </div> <!-- /Alert toggle/archive buttons --> </div> <!-- /Alert title --> <!-- Alert body --> <div id="collapse' + data[i].aid + '" class="panel-collapse collapse"> <div class="panel-body"> <div class="row"> <!-- Profile user Photo. --> <div class="col-xs-6 col-md-4"> <div class="thumbnail" id="photo_id' + data[i].aid + '" style="width:230px"> </div> </div> <!-- /Profile user Photo. --> <!-- Profile user Information. --> <div class="col-xs-12 col-sm-6 col-md-8"> <div class="profile-user-info profile-user-info-striped"> <div class="profile-info-row"> <div class="profile-info-name"> Phone Number </div> <div class="profile-info-value"> <span class="editable" id="phone_cell' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> First Name </div> <div class="profile-info-value"> <span class="editable" id="name_first' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Last Name </div> <div class="profile-info-value"> <span class="editable" id="name_last' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Age </div> <div class="profile-info-value"> <span class="editable" id="dob' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Medical Issues </div> <div class="profile-info-value"> <span class="editable" id="medical_issues' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Blood Type </div> <div class="profile-info-value"> <span class="editable" id="blood_type' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Assigned Dorm Building </div> <div class="profile-info-value"> <span class="editable" id="dorm_building' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Dorm Room Number </div> <div class="profile-info-value"> <span class="editable" id="dorm_roomnum' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> CWID </div> <div class="profile-info-value"> <span class="editable" id="cwid' + data[i].aid + '"></span> </div> </div> <div class="profile-info-row"> <div class="profile-info-name"> Registered Email </div> <div class="profile-info-value"> <span class="editable" id="email' + data[i].aid + '"></span> </div> </div> </div> </div> <!-- /Profile user Informaiton --> </div> </div> </div> <!-- /Alert body --> </div> <!-- /Alert -->';
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
                        $('div#' + data[i].aid).slideDown(500);
                    },
                    heartbeat_html: function () {
                        $('#alerts-panel').attr('class', 'alert alert-info');
                        $('div#status_group').html('<div class="progress progress-striped active"><div class="progress-bar progress-bar-striped progress-bar-primary active"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">No ongoing alerts. [Server connection is online.]</div></div>');
                    },
                    alert_html: function () {
                        $('#alerts-panel').attr('class', 'alert alert-warning');
                        $('div#status_group').html('<div class="progress progress-striped active"><div class="progress-bar progress-bar-striped progress-bar-warning active"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">Alert(s) in progress... [Server connection is online.]</div></div>');
                    }
                };

            // CONDITION #1: HEARTBEAT RESPONSE
            if (data.story === "heartbeat") {
                values = [];

                if (died) { // died means the error function ran before this
                    if ($('.aid').toArray().length === 0) {// if there are no alerts on the screen
                        died = false; 
                    } else {
                        setTimeout(function () {alerts.alert_html();}, 3000);
                        died = false;
                    }
                }

                // we need to check if there exists alert elements to decide on what to append/change on the DOM
                if ($('.aid').toArray().length === 0) {
                    alerts.heartbeat_html();
                }

                // rinse and repeat: reset our ready state history array and fire off long_poll() again passing in our alert IDs
                _readyStates = [];
                long_poll(find_aids(values));

            // CONDITION #2: ALERT RESPONSE
            } else if (data[data.length-1].story === "alert") {
                values = [];

                // similar to above
                if (died) {
                    if (($('.aid').toArray().length) === 0) {
                        died = false; 
                    } else {
                        setTimeout(function () {alerts.alert_html();}, 3000);
                        died = false;
                    } 
                }

                if ($('.aid').toArray().length === 0) {
                    alerts.alert_html();
                }

                // here we fire off our append function from our alerts literal passing in information from our server
                data.forEach(function (element, index) {
                    alerts.append_html(index);
                });

                // rinse and repeat like above
                _readyStates = [];
                long_poll(find_aids(values));
            }

        }).fail(function (jqXHR, textStatus, errorThrown) { // our fail function passes in a few details of the ajax error
            // We need to be careful here not to invoke multiple long_polls

            if (died) {
                // if our ready state checker ran before this, we don't need to invoke another long_poll, instead we check if the ready state checker came back false positive
                // ready state checker cannot anticipate a bad response from the database (this is a server-sided error that the browser has no connection to)
                // the way we use to detect a bad database response is by looking for the 'parsererror' when our ajax call returned a response that wasn't in JSON format
                if (textStatus === 'parsererror') {
                    error(values, jqXHR, textStatus, errorThrown); // this case is unique because the ready states would be valid, but the actual data response would be invalid
                }
            } else {
                // in any case where the ready state value is valid and the jquery ajax handler still calls this fail method, we can still invoke long_poll
                error(values, jqXHR, textStatus, error);
            }

        });
    }
    long_poll();
});