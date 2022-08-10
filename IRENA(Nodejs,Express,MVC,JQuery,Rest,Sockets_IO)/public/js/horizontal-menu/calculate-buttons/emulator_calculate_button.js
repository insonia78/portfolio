/*
 * Copyright 2018 Acelerex Inc.
 */
var page_refresh_11 = 0;
$(document).ready(function () {
    if (page_refresh_11 === 1)
    {
        page_refresh_11 = 0;
        return;
    }

    page_refresh_11 = 1;
    $('#emulator-btn').on("click", make_emulator_calculation);
});
var emulator_scenario ;
var emulator_case;
var make_emulator_calculation = function()
{
  console.log("emulator-btn");
   if(!set_calculation_sequence_status("emulator_calculation"))
      return; 
    set_all_buttons_to_disable_status();
    $('#EMgenerationnoesslabels').html('');
    $('#EMprimresnoesslabels').html('');
    $('#EMsecresnoesslabels').html('');
    $('#EMtertresnoesslabels').html('');
    $('#EMgenerationnoess').html('');
    $('#EMprimresnoess').html('');
    $('#EMsecresnoess').html('');
    $('#EMtertresnoess').html('');
    $('#EMgenerationlabels').html('');
    $('#EMprimreslabels').html('');
    $('#EMsecreslabels').html('');
    $('#EMtertreslabels').html('');
    $('#EMgeneration').html('');
    $('#EMprimres').html('');
    $('#EMsecres').html('');
    $('#EMtertres').html('');
    
  var makeRequest = {
        username:$("#username").attr("value"),
        scenario: $('.scenario-option').val(),
        case: $('.case-option').val(),
        active_tab: $('.wrapper .io-tab').find('.active').attr('id')
    };
    emulator_scenario = $('.scenario-option').val();
    emulator_case = $('.case-option').val();
    if($('.scenario-option').val() === "")
    {
        swal(" Missing scenario ");
        return;
    }
    if($('.case-option').val() === "")
    {
        swal(" Missing case");
        return;
    }
 
    $.ajax({
        type: 'POST',
        url: 'REQ_EMULATOR_CALCULATION',
        data: makeRequest,
        success: function (msg) {
            if(api_session_handler(msg) === true)
               return;
            console.log("REQ_EMULATOR");
            console.log(JSON.parse(msg));
            switch (test_object.Test_Response(msg))
            {
                case 0://null
                    display_pop_up(msg);
                    break;
                case 1://undefined
                    display_pop_up(msg);
                    break;
                case 2: // String
                    start_emulator_data_request(JSON.parse(msg));
                    break;
                case 3: //Array
                    start_emulator_data_request(msg);
                    break;
                case 4://Object
                    start_emulator_data_request(msg);
                    break;
                default: // dont know
                    break;
            }
        }
    });


};
var start_request_emulator_request = false;
var start_emulator_data_request = function(msg)
{
    console.log(" >> start_emulator_data_request " + msg.response);
    if(msg.response === "IN_PROGRESS")
    {
        
        if (start_request_emulator_request === false)
        {
//            var response = "Scenario: " + msg.scenario
//                    + "\n Case: " + msg.case
//                    + "\n Calculation: PORDUCTION COST calc Started";
//            swal("Status: Started", response, "success");
            $(".last-run-text").text("");
            $(".last-run-text").text("EMULATOR");
            $(".status-text").text("");
            $(".status-text").text(msg.response);
            $("#busyanim").addClass('spinning');
        }
        start_request_emulator_request = true;
        
        
        
        $('#emulator-btn').css('background-color','#42f4b0');
    var makeRequest = {
        username:$("#username").attr("value"),
        scenario: emulator_scenario,
        case: emulator_case
    };
    $.ajax({
        type: 'POST',
        url: 'REQ_EMULATOR_DATA',
        data: makeRequest,
        success: function (msg) {
            if(api_session_handler(msg) === true)
               return;

            switch (test_object.Test_Response(msg))
            {
                case 0://null
                    display_pop_up(msg);
                    break;
                case 1://undefined
                    display_pop_up(msg);
                    break;
                case 2: // String
                    setTimeout(start_emulator_data_request,1000,JSON.parse(msg));
                    break;
                case 3: //Array
                    setTimeout(start_emulator_data_request,1000,msg);
                    break;
                case 4://Object
                    setTimeout(start_emulator_data_request,1000,msg);
                    break;
                default: // dont know
                    break;

            }
        }
    });
    }
    else if(msg.response === "COMPLETE")
    {
        set_all_buttons_to_enable_status();
        
//        if(charts_modal===false)
//        {
//            $('#modal-charts').css('display','block');
//            charts_modal=true;
//            setTimeout(function(){
//                $('#modal-charts').css('display','none');
//            },6000);
//        }
        getEMCsvFiles(msg);
        $('#busyanim').removeClass('spinning');
        var response = "Scenario: " + msg.scenario
                       +"\n Case: " + msg.case
                       +"\n Calculation: Emulator"
                       +"\n Status: " + msg.response;
        swal("Status: Complete", response, "success");
        
//        if(msg.active_tab==="output_noess_btn")
//        {
//            $('.wrapper .io-tab').find('button').removeClass('active');
//            $('.wrapper .io-tab').find('#output_noess_btn').addClass('active');
//            $('#page-wrapper').find('.io-container').css('display','none');
//            $('#page-wrapper').find('#outputs_noess').css('display','block');
//        }
//        else
//        {
            $('.wrapper .io-tab').find('button').removeClass('active');
            $('.wrapper .io-tab').find('#output_btn').addClass('active');
            $('#page-wrapper').find('.io-container').css('display','none');
            $('#page-wrapper').find('#outputs').css('display','block');
//        }
        
        $("#emulator-btn").css("background-color","#42f4b0");
        $(".status-text").text("");
        $(".status-text").text(msg.response);
        start_request_emulator_request = false;
        $('#busyanim').removeClass('spinning');
    }
    else
    {        
        swal("Error", JSON.stringify(msg), "error");
        start_request_emulator_request = false;
        set_all_buttons_to_enable_status();
        set_calculation_sequence_status_to_false("emulator_calculation");
        $('#busyanim').removeClass('spinning');
    }
};


var getEMCsvFiles = function (msg)
{
    $('.wrapper .io-tab').find('button').removeClass('active');
    $('.wrapper .io-tab').find('#output_btn').addClass('active');
    $('#page-wrapper').find('.io-container').css('display','none');
    $('#page-wrapper').find('#outputs').css('display','block');
    $('#page-wrapper').find('#outputs_noess').css('display','block');
    
    setTimeout(function(){
        $('#page-wrapper').find('.io-container').css('display','none');
        $('#page-wrapper').find('#outputs').css('display','block');
        $('.wrapper .io-tab').find('button').removeClass('active');
        $('.wrapper .io-tab').find('#output_btn').addClass('active');
    },20000);
    if(charts_modal===false)
        {
            $('#modal-charts').css('display','block');
            charts_modal=true;
            setTimeout(function(){
                $('#modal-charts').css('display','none');
            },10000);
        }
    var chart_id_list = [];
    var chart_label_id = [];
    var y_label = [];
    var req_zip_url,request_url;
    var messageReq = {};
    
    y_label.push("Generation (MW)");
    y_label.push("Reserve Provision (MW)");
    y_label.push("Reserve Provision (MW)");
    y_label.push("Reserve Provision (MW)");
    
    for(var i=0; i<msg.emulator_output_files.length; i++)
    {
       messageReq ={};
       chart_id_list = [];
       chart_label_id = [];
       messageReq.username = $("#username").attr("value");
       if(false)
       {
            messageReq.EM_generation = msg.emulator_noess_output_files[i].EM_generation;
            messageReq.EM_primres = msg.emulator_noess_output_files[i].EM_primres;
            messageReq.EM_secres = msg.emulator_noess_output_files[i].EM_secres;
            messageReq.EM_tertres = msg.emulator_noess_output_files[i].EM_tertres;
            request_url = '/REQ_GET_EMULATOR_NOESS_RESULTS';
            req_zip_url = '/REQ_EM_ZIP_CSV_FILES_NOESS';
            chart_id_list.push("EMgenerationnoess");
            chart_id_list.push("EMprimresnoess");
            chart_id_list.push("EMsecresnoess");
            chart_id_list.push("EMtertresnoess");
            chart_label_id.push("EMgenerationnoesslabels");
            chart_label_id.push("EMprimresnoesslabels");
            chart_label_id.push("EMsecresnoesslabels");
            chart_label_id.push("EMtertresnoesslabels");
            make_request_to_get_EM_charts_data(messageReq,chart_id_list,request_url, req_zip_url,chart_label_id,y_label);  
       }
       else
       {
           messageReq.EM_generation = msg.emulator_noess_output_files[i].EM_generation;
            messageReq.EM_primres = msg.emulator_noess_output_files[i].EM_primres;
            messageReq.EM_secres = msg.emulator_noess_output_files[i].EM_secres;
            messageReq.EM_tertres = msg.emulator_noess_output_files[i].EM_tertres;
            request_url = '/REQ_GET_EMULATOR_RESULTS';
            req_zip_url = '/REQ_EM_ZIP_CSV_FILES';
            chart_id_list.push("EMgeneration");
            chart_id_list.push("EMprimres");
            chart_id_list.push("EMsecres");
            chart_id_list.push("EMtertres");
            chart_label_id.push("EMgenerationlabels");
            chart_label_id.push("EMprimreslabels");
            chart_label_id.push("EMsecreslabels");
            chart_label_id.push("EMtertreslabels");
            make_request_to_get_EM_charts_data(messageReq,chart_id_list,request_url, req_zip_url,chart_label_id,y_label);
       }
   }
};

var make_request_to_get_EM_charts_data = function(messageReq, chart_id_list, request_url, req_zip_url, chart_label_id, y_label)
{
    $.ajax({
        url: request_url,
        type: 'POST',
        data: messageReq,
        success: function (result) {
            var a = ""; 
            var labels;
            result[0][0] = result[0][0].split(",");
            result[0][0].pop();
            labels = result[0][0];
            for (var i = 1; i < result[0].length; i++)
            {
                result[0][i] = result[0][i].split(",");
                result[0][i].pop();
                result[0][i].pop();
                result[0][i].join(",");
                a += result[0][i] + "\n";
            }
            
            //console.log(result[0]);
            plotDyChart(chart_id_list[0], "area", a, labels, chart_label_id[0], y_label[0]);
            //console.log(a);
            
            a = "";
            labels = result[1][0].slice(0, -1).split(",");
            for (var i = 1; i < result[1].length; i++)
            {
                a += result[1][i].slice(0, -1) + "\n";
            }
            plotDyChart(chart_id_list[1], "area", a, labels, chart_label_id[1], y_label[1]);
            //console.log(a);
            a = "";
            labels = result[2][0].slice(0, -1).split(","); 
            for (var i = 1; i < result[2].length; i++)
            {
                a += result[2][i].slice(0, -1) + "\n";
            }
            plotDyChart(chart_id_list[2], "area", a, labels, chart_label_id[2], y_label[2]);
            //console.log(a);
            a = "";
            labels = result[3][0].slice(0, -1).split(",");
            for (var i = 1; i < result[3].length; i++)
            {
                a += result[3][i].slice(0, -1) + "\n";
            }
            plotDyChart(chart_id_list[3], "area", a, labels, chart_label_id[3], y_label[3]);
            //charts_modal = false;
            //console.log(a);
            var sc_row_id = scenario_and_cases_data_bucket.getCaseData($('input.scenario-option').val(),$('input.case-option').val()).scenarios_and_cases_row_id;
            $.ajax({
                type: 'GET',
                url: req_zip_url,
                data:{scenarios_and_cases_row_id:sc_row_id}
            });    
        }
    });  
};

