/*
 * Copyright 2018 Acelerex Inc.
 */
var page_refresh_2 = 0;
$(document).ready(function () {
    if (page_refresh_2 === 1)
    {
        page_refresh_2 = 0;
        return;
    }
    page_refresh_2 = 1;
    $('#delete-btn').on("click", delete_from_database_pop_up_box);

});
var close_delete_from_database = function ()
{
    $(".request-answer").text("");
    $(".delete-message-pop-up-container").css("display", "none");
    $(".pop-up-box-modal").css("display", "none");
};
var delete_from_database_pop_up_box = function()
{
    if($('.scenario-option').val() === "")
    {
        swal("Missing scenario or case to delete","","error");
        return 1;
    }
    $(".request-answer").text("");
    $(".delete-message-pop-up-container").css("display", "block");
    $(".pop-up-box-modal").css("display", "block");
}
var delete_from_database = function ()
{
    
    var makeRequest = {
        scenario: $('.scenario-option').val(),
        case: $('.case-option').val(),
        username: $("#username").attr("value")    
    };
    console.log(makeRequest);
    $.ajax({
        type: 'POST',
        url: 'REQ_DELETE',
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
                    delete_from_bucket_array(msg);
                    break;
                case 3: //Array
                    delete_from_bucket_array(msg);
                    break;
                case 4://Object
                    delete_from_bucket_array(msg);
                    break;
                default: // dont know
                    break;

            }            
        }
    });
};
var delete_from_bucket_array = function (msg)
{
    $(".delete-message-pop-up-container").css("display", "none");
    $(".pop-up-box-modal").css("display", "none");
    console.log(msg);
    var json = JSON.parse(msg);
    if (json.response === "7001:SUCCESS_REQUEST") {
       $("#production-cost-btn").css("background-color","#28b1d6;");
       $("#alternative-analysis-btn").css("background-color","#28b1d6;");
       $("#stacked-benefits-btn").css("background-color","#28b1d6;");
       $("#emulator-btn").css("background-color","#28b1d6;");
       $(".created-on-text").text("");    
       $(".last-modified-text").text("");
       $(".status-text").text("");
       $(".last-run-text").text("");
        
        swal("Data Deleted","", "success");
        scenario_and_cases_data_bucket.DeleteFromTempBucket(json.scenario,json.case);
        scenario_and_cases_data_bucket.DeleteFromBucket(json.scenario,json.case);
        set_scenario_list(scenario_and_cases_data_bucket.bucket);
        $(".select-editable-container").find(".scenario-option").val("");
        $(".select-editable-container").find(".scenario-option").click();
        $(".select-editable-container").find(".case-option").val("");
        set_data_to_default_values();
        

    } else {
        swal("Error", "Run was not deleted\n" + JSON.stringify(json.response)
                + "\n" + JSON.stringify(json.error), "error");
    }
     
}
