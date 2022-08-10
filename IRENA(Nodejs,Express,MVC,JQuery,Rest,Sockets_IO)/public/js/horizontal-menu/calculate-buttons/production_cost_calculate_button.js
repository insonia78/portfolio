/*
 * Copyright 2018 Acelerex Inc.
 */
var page_refresh_13 = 0;
$(document).ready(function () {
    if (page_refresh_13 === 1)
    {
        page_refresh_13 = 0;
        return;
    }

    page_refresh_13 = 1;
    $('#production-cost-btn').on("click", make_production_cost_calculation);
});
var production_cost_scenario;
var production_cost_case;

var make_production_cost_calculation = function ()
{
     if(!set_calculation_sequence_status("production_cost_calculation"))
         return;
    set_all_buttons_to_disable_status();
    console.log("make_production_cost_calculation");
    /****************************************/
    /*
    var active_tab;
    if($('.wrapper .io-tab').find('.active').attr('id')==="output_noess_btn")
        active_tab="NOESS";
    else
        active_tab="ESS";
    */
   /****************************************/
    set_data_to_default_pc_metrics_table();
    set_data_to_default_pc_metrics_noess_table();
    set_data_to_default_fuel_usage_output_installed_cap_tables();
    set_data_to_default_fuel_usage_output_installed_noess_tables();
    $('#cappertechchart').html('');
    $('#genpertechchart').html('');
    $('#genprofilechart').html('');
    $('#primreschart').html('');
    $('#secreschart').html('');
    $('#terreschart').html('');
    $('#enerpriceprofilechart').html('');
    $('#respricechart').html('');
    $('#cappertechchartnoess').html('');
    $('#genpertechchartnoess').html('');
    $('#genprofilechartnoess').html('');
    $('#primreschartnoess').html('');
    $('#secreschartnoess').html('');
    $('#terreschartnoess').html('');
    $('#enerpriceprofilechartnoess').html('');
    $('#respricechartnoess').html('');
    
    $('#genprofilechartlabels').html('');
    $('#primreschartlabels').html('');
    $('#secreschartlabels').html('');
    $('#terreschartlabels').html('');
    $('#enerpriceprofilechartlabels').html('');
    $('#respricechartlabels').html('');
    $('#genprofilechartnoesslabels').html('');
    $('#primreschartnoesslabels').html('');
    $('#secreschartnoesslabels').html('');
    $('#terreschartnoesslabels').html('');
    $('#enerpriceprofilechartnoesslabels').html('');
    $('#respricechartnoesslabels').html('');
    
    var makeRequest = {
        username: $("#username").attr("value"),
        scenario: $('.scenario-option').val(),
        case: $('.case-option').val()
        //active_tab: active_tab
    };
    production_cost_scenario = $('.scenario-option').val();
    production_cost_case = $('.case-option').val();
    if ($('.scenario-option').val() === "")
    {
        swal(" Missing scenario ", "", "error");
        return;
    }
    if ($('.case-option').val() === "")
    {
        swal(" Missing case", "", "error");
        return;
    }
   
    $.ajax({
        type: 'POST',
        url: 'REQ_PRODUCTION_COST_CALCULATION',
        data: makeRequest,
        success: function (msg) {
            if (api_session_handler(msg) === true)
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
                    start_production_cost_data_request(JSON.parse(msg));
                    break;
                case 3: //Array
                    start_production_cost_data_request(msg);
                    break;
                case 4://Object
                    start_production_cost_data_request(msg);
                    break;
                default: // dont know
                    break;
            }
        }
    });


};
var start_request_production_cost_data_request = false;
var start_production_cost_data_request = function (msg)
{
    console.log(" >> start_production_cost_data_request " + msg.response);
    if (msg.response === "IN_PROGRESS")
    {
        if (start_request_production_cost_data_request === false)
        {
//            var response = "Scenario: " + msg.scenario
//                    + "\n Case: " + msg.case
//                    + "\n Calculation: PORDUCTION COST calc Started";
//            swal("Status: Started", response, "success");
            $(".last-run-text").text("");
            $(".last-run-text").text("PRODUCTION COST");
            $(".status-text").text("");
            $(".status-text").text(msg.response); 
            $('#busyanim').addClass('spinning');
        }
        start_request_production_cost_data_request = true;

       
        var makeRequest = {
            username: $("#username").attr("value"),
            scenario: production_cost_scenario,
            case: production_cost_case
        };
        
        
        $.ajax({
            type: 'POST',
            url: 'REQ_PRODUCTION_COST_DATA',
            data: makeRequest,
            success: function (msg) {
                if (api_session_handler(msg) === true)
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
                        setTimeout(start_production_cost_data_request, 1000, JSON.parse(msg));
                        break;
                    case 3: //Array
                        setTimeout(start_production_cost_data_request, 1000, msg);
                        break;
                    case 4://Object
                        setTimeout(start_production_cost_data_request, 1000, msg);
                        break;
                    default: // dont know
                        break;

                }
            }
        });
    } else if (msg.response === "COMPLETE")
    {
        set_output_data_pc_metrics_table(msg);
        set_output_data_pc_metrics_noess_table(msg);
        set_output_data_fuel_usage_output_installed_cap_tables(msg);
        set_output_data_fuel_usage_output_installed_cap_noess_tables(msg);
        
        set_all_buttons_to_enable_status();
        getProdCsvFiles(msg);

        var response = "Scenario: " + msg.scenario
                + "\n Case: " + msg.case
                + "\n Calculation: Production Cost";

        swal("Status: Complete", response, "success");
        
            
            
 
        start_request_production_cost_data_request = false;
        $(".status-text").text("");
        $(".status-text").text(msg.response);       
        $("#production-cost-btn").css("background-color","#42f4b0");
        $('#busyanim').removeClass('spinning');
        
    } else
    {
        start_request_production_cost_data_request = false;
        $('#busyanim').removeClass('spinning');
        swal("Error", JSON.stringify(msg), "error");
        set_all_buttons_to_enable_status();
        set_calculation_sequence_status_to_false("production_cost_calculation");
    }
    
};

var getProdCsvFiles = function (msg)
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
            },20000);
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
    y_label.push("Price ($/MWh)");
    y_label.push("Reserve Price ($/MW)");
    for(var i=0; i<msg.production_cost_output_files.length; i++)
        {
            messageReq = {};
            chart_id_list = [];
            chart_label_id = [];
            messageReq.username = $("#username").attr("value");
            if(msg.production_cost_output_files[i]["ess_or_noess"]==="0")
            {
                messageReq.PC_generation = msg.production_cost_output_files[i].PC_generation; ;
                messageReq.PC_primres = msg.production_cost_output_files[i].PC_primres;
                messageReq.PC_secres = msg.production_cost_output_files[i].PC_secres;
                messageReq.PC_tertres = msg.production_cost_output_files[i].PC_tertres;
                messageReq.PC_enerprice = msg.production_cost_output_files[i].PC_enerprice;
                messageReq.PC_resprice = msg.production_cost_output_files[i].PC_resprice; 
                request_url = '/REQ_GET_PRODUCTION_COST_NOESS_RESULTS';
                req_zip_url = '/REQ_ZIP_CSV_FILES_NOESS';
                chart_id_list.push("cappertechchartnoess");
                chart_id_list.push("genpertechchartnoess");
                chart_id_list.push("genprofilechartnoess");
                chart_id_list.push("primreschartnoess");
                chart_id_list.push("secreschartnoess");
                chart_id_list.push("terreschartnoess");
                chart_id_list.push("enerpriceprofilechartnoess");
                chart_id_list.push("respricechartnoess");
                chart_label_id.push("genprofilechartnoesslabels");
                chart_label_id.push("primreschartnoesslabels");
                chart_label_id.push("secreschartnoesslabels");
                chart_label_id.push("terreschartnoesslabels");
                chart_label_id.push("enerpriceprofilechartnoesslabels");
                chart_label_id.push("respricechartnoesslabels");
                make_request_to_get_charts_data(messageReq,chart_id_list,request_url, req_zip_url,chart_label_id, y_label);
            }
            else
            {
                messageReq.PC_generation = msg.production_cost_output_files[i].PC_generation; ;
                messageReq.PC_primres = msg.production_cost_output_files[i].PC_primres;
                messageReq.PC_secres = msg.production_cost_output_files[i].PC_secres;
                messageReq.PC_tertres = msg.production_cost_output_files[i].PC_tertres;
                messageReq.PC_enerprice = msg.production_cost_output_files[i].PC_enerprice;
                messageReq.PC_resprice = msg.production_cost_output_files[i].PC_resprice; 
                request_url = '/REQ_GET_PRODUCTION_COST_RESULTS';
                req_zip_url = '/REQ_ZIP_CSV_FILES';
                chart_id_list.push("cappertechchart");
                chart_id_list.push("genpertechchart");
                chart_id_list.push("genprofilechart");
                chart_id_list.push("primreschart");
                chart_id_list.push("secreschart");
                chart_id_list.push("terreschart");
                chart_id_list.push("enerpriceprofilechart");
                chart_id_list.push("respricechart");
                chart_label_id.push("genprofilechartlabels");
                chart_label_id.push("primreschartlabels");
                chart_label_id.push("secreschartlabels");
                chart_label_id.push("terreschartlabels");
                chart_label_id.push("enerpriceprofilechartlabels");
                chart_label_id.push("respricechartlabels");
                make_request_to_get_charts_data(messageReq,chart_id_list,request_url, req_zip_url,chart_label_id, y_label);
            }
        }

    
//    if(action==="CASE_SELECTED")
//    {   
//                for(var i=0; i<msg.production_cost_output_files.length; i++)
//                {
//                    messageReq = {};
//                    messageReq.username = $("#username").attr("value");
//                    if(msg.production_cost_output_files[i]["noess_or_ess"]==="NOESS")
//                    {
//                        messageReq.PC_generation = msg.production_cost_output_files[i].PC_generation; ;
//                        messageReq.PC_primres = msg.production_cost_output_files[i].PC_primres;
//                        messageReq.PC_secres = msg.production_cost_output_files[i].PC_secres;
//                        messageReq.PC_tertres = msg.production_cost_output_files[i].PC_tertres;
//                        messageReq.PC_enerprice = msg.production_cost_output_files[i].PC_enerprice;
//                        messageReq.PC_resprice = msg.production_cost_output_files[i].PC_resprice; 
//                        request_url = '/REQ_GET_PRODUCTION_COST_NOESS_RESULTS';
//                        req_zip_url = '/REQ_ZIP_CSV_FILES_NOESS';
//                        chart_id_list.push("cappertechchartnoess");
//                        chart_id_list.push("genpertechchartnoess");
//                        chart_id_list.push("genprofilechartnoess");
//                        chart_id_list.push("primreschartnoess");
//                        chart_id_list.push("secreschartnoess");
//                        chart_id_list.push("terreschartnoess");
//                        chart_id_list.push("enerpriceprofilechartnoess");
//                        chart_id_list.push("respricechartnoess");
//                        make_request_to_get_charts_data(messageReq,chart_id_list,request_url, req_zip_url);
//                    }
//                    else
//                    {
//                        messageReq.PC_generation = msg.production_cost_output_files[i].PC_generation; ;
//                        messageReq.PC_primres = msg.production_cost_output_files[i].PC_primres;
//                        messageReq.PC_secres = msg.production_cost_output_files[i].PC_secres;
//                        messageReq.PC_tertres = msg.production_cost_output_files[i].PC_tertres;
//                        messageReq.PC_enerprice = msg.production_cost_output_files[i].PC_enerprice;
//                        messageReq.PC_resprice = msg.production_cost_output_files[i].PC_resprice; 
//                        request_url = '/REQ_GET_PRODUCTION_COST_RESULTS';
//                        req_zip_url = '/REQ_ZIP_CSV_FILES';
//                        chart_id_list.push("cappertechchart");
//                        chart_id_list.push("genpertechchart");
//                        chart_id_list.push("genprofilechart");
//                        chart_id_list.push("primreschart");
//                        chart_id_list.push("secreschart");
//                        chart_id_list.push("terreschart");
//                        chart_id_list.push("enerpriceprofilechart");
//                        chart_id_list.push("respricechart");
//                        make_request_to_get_charts_data(messageReq,chart_id_list,request_url, req_zip_url);
//                    }
//                }
//                
//    }
//    else
//    {
//        var production_cost_noess_output_files,production_cost_output_files;
//        for(var i=0; i<msg.production_cost_output_files.length; i++)
//        {
//            if(msg.production_cost_output_files[i]["noess_or_ess"]==="NOESS")
//            {
//                production_cost_noess_output_files=msg.production_cost_output_files[i];
//            }
//            else
//            {
//                production_cost_output_files=msg.production_cost_output_files[i];
//            }
//        }
//        if(msg.active_tab==="NOESS")
//        {
//                messageReq.PC_generation = production_cost_noess_output_files.PC_generation; ;
//                messageReq.PC_primres = production_cost_noess_output_files.PC_primres;
//                messageReq.PC_secres = production_cost_noess_output_files.PC_secres;
//                messageReq.PC_tertres = production_cost_noess_output_files.PC_tertres;
//                messageReq.PC_enerprice = production_cost_noess_output_files.PC_enerprice;
//                messageReq.PC_resprice = production_cost_noess_output_files.PC_resprice; 
//                request_url = '/REQ_GET_PRODUCTION_COST_NOESS_RESULTS';
//                chart_id_list.push("cappertechchartnoess");
//                chart_id_list.push("genpertechchartnoess");
//                chart_id_list.push("genprofilechartnoess");
//                chart_id_list.push("primreschartnoess");
//                chart_id_list.push("secreschartnoess");
//                chart_id_list.push("terreschartnoess");
//                chart_id_list.push("enerpriceprofilechartnoess");
//                chart_id_list.push("respricechartnoess");
//                req_zip_url = '/REQ_ZIP_CSV_FILES_NOESS';
//                make_request_to_get_charts_data(messageReq,chart_id_list,request_url, req_zip_url);
//        }
//        else
//        {
//       
//                messageReq.PC_generation = production_cost_output_files.PC_generation; ;
//                messageReq.PC_primres = production_cost_output_files.PC_primres;
//                messageReq.PC_secres = production_cost_output_files.PC_secres;
//                messageReq.PC_tertres = production_cost_output_files.PC_tertres;
//                messageReq.PC_enerprice = production_cost_output_files.PC_enerprice;
//                messageReq.PC_resprice = production_cost_output_files.PC_resprice;
//                request_url = '/REQ_GET_PRODUCTION_COST_RESULTS';
//                chart_id_list.push("cappertechchart");
//                chart_id_list.push("genpertechchart");
//                chart_id_list.push("genprofilechart");
//                chart_id_list.push("primreschart");
//                chart_id_list.push("secreschart");
//                chart_id_list.push("terreschart");
//                chart_id_list.push("enerpriceprofilechart");
//                chart_id_list.push("respricechart");
//                req_zip_url = '/REQ_ZIP_CSV_FILES';
//                make_request_to_get_charts_data(messageReq,chart_id_list,request_url, req_zip_url);
//        }
//         //Bind this call to a RETRIEVE output API call
//    }

};

var make_request_to_get_charts_data = function(messageReq, chart_id_list, request_url, req_zip_url, chart_label_id, y_label)
{
    $.ajax({
        url: request_url,
        type: 'POST',
        data: messageReq,
        success: function (result) {
/*      
            $('.input-headings button').removeClass('active');
            $('.output-headings button').addClass('active');
            document.getElementById('inputs').style.display = "none";
            document.getElementById('outputs').style.display = 'block';
*/          

            updateCapbyFuelChart(chart_id_list[0]);

            var a = "";
            var labels;
            //labels
            result[0][0] = result[0][0].split(",");
            result[0][0].pop();
            result[0][0].pop();
            labels = result[0][0]; 
            //data
            for (var i = 1; i < result[0].length; i++)
            {
                result[0][i] = result[0][i].split(",");
                result[0][i].pop();
                result[0][i].pop();
                result[0][i].pop();
                result[0][i].join(",");
                a += result[0][i] + "\n";
            }
            plotDyChart(chart_id_list[1], "pie", result[0], "","","");
            
            plotDyChart(chart_id_list[2], "area", a, labels, chart_label_id[0],y_label[0]);
            //console.log(a);
            
            

            a = "";
            labels = result[1][0].slice(0, -1).split(",");
            for (var i = 1; i < result[1].length; i++)
            {
                a += result[1][i].slice(0, -1) + "\n";
            }
            plotDyChart(chart_id_list[3], "area", a,labels,chart_label_id[1],y_label[1]);
            //console.log(a);
            a = "";
            labels = result[2][0].slice(0, -1).split(",");
            for (var i = 1; i < result[2].length; i++)
            {
                a += result[2][i].slice(0, -1) + "\n";
            }
            plotDyChart(chart_id_list[4], "area", a, labels,chart_label_id[2],y_label[2]);
            //console.log(a);
            a = "";
            labels = result[3][0].slice(0, -1).split(",");
            for (var i = 1; i < result[3].length; i++)
            {
                a += result[3][i].slice(0, -1) + "\n";
            }
            plotDyChart(chart_id_list[5], "area", a, labels,chart_label_id[3],y_label[3]);
            //console.log(a);
            a = "";
            labels = result[4][0].slice(0, -1).split(",");
            for (var i = 1; i < result[4].length; i++)
            {
                a += result[4][i] + "\n";
            }
            plotDyChart(chart_id_list[6], "line", a, labels,chart_label_id[4],y_label[4]);
            //console.log(a);
            a = "";
            labels = result[5][0].slice(0, -1).split(",");
            for (var i = 1; i < result[5].length; i++)
            {
                a += result[5][i] + "\n";
            }

            plotDyChart(chart_id_list[7], "line", a, labels, chart_label_id[5],y_label[5]);
            charts_modal = false;
            console.log("false called");
            var sc_row_id = scenario_and_cases_data_bucket.getCaseData($('input.scenario-option').val(),$('input.case-option').val()).scenarios_and_cases_row_id;
            
            $.ajax({
                type: 'GET',
                url: req_zip_url,
                data:{scenarios_and_cases_row_id:sc_row_id}
            }); 
        }
    });
};