/*
 * Copyright 2018 Acelerex Inc.
 */
var page_is_loaded_5 = 0;
var charts_modal = false;
$(document).ready(function () {
		//$(':input').val('');

            if(page_is_loaded_5 === 1)
            {
                page_is_loaded_5 = 0;
                return;
            }
            page_is_loaded_5 = 1;

              $('#page-wrapper').css('height', $("body").height()-$('#menuheader').height()-$('#fixedheader').height()*1.1);
              $(".wrapper .header_storage_benefits_tool").find(".right-icon-container").css("display","block");
              $(".wrapper .header_storage_benefits_tool").find(".io-tab").css("display","inline-block");
		var project;
		var run;
                var username = $('#username').val();
                if(typeof username === 'undefined' || username == null)
                   username = 'undefined';


                var credentials ={
                  username:'undefined',
                  password:"",
                  token:""
                };

		var $projects = $("#project-select");
		var $runs = $('#run-select');
		var $samples = $('#sample-select');

		var statusTimer = false;

		//Load list of projects to options when page is loaded
		//console.log('Calling SLT API')
 /*
  * Test the https code received from the back end and evaluates
  * process
  */
function TestData(msg)
{
    var data = msg.split("&&");
    var httpsCode = parseInt(data[0]);
    switch(httpsCode) {
    case 200:
        return data[1];
    case 201:
        return data[1];
    case 202:
         return data[1];
    case 302:
         return data[1];
    default:
          swal("Error", "Error:"+data[0]+"\nMessage:"+data[1], "error");
          return "";
    }
}
function updateNavbarSelect(element, opts, type) {
	var list = '<option selected="true" value="add" disabled>Select ' + type + '</option>';
	//console.log(element);
	//console.log(opts);
	for (var k = 0; k < opts.length; k++) {
		list += '<option value=' + opts[k] + '>' + opts[k] + '</option>';
	}
	element.html(list);
	element.trigger("chosen:updated");
    }
});

function aboutAcelerex(){
    swal({title: '<p>Copyright © 2018 Acelerex</p><br><p>All rights reserved</p><br><p><a target="_blank" href="http://www.acelerex.com">www.acelerex.com</a></p>', html:true});
}

function ToogleMenu()
{

  $( ".menu" ).slideToggle( "fast",function(){
    if($("#menuheader").css('display')==='none'){
        $('#page-wrapper').css('height', $("body").height()-$('#fixedheader').height());
    }else{
        $('#page-wrapper').css('height', $("body").height()-$('#menuheader').height()-$('#fixedheader').height()*1.1);
    }
  });
}
 