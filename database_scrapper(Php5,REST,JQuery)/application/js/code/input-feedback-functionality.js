/* 
 * It performs process and fetch data from server
 * 
 * It handles all the operation performed in the html 
 * 
 * file:input_feedback_view.php
 * date: 1/5/2016
 * version :1.0
 * 
 * 
 * 
 */
$(document).ready(function () {

    /********************************Variables ***************************************************/

    var id;
    var checkboxes_id = $(".center-right").find('.checkboxes');
    var fields_not_selected_obj = $(".center-right").find('#checkboxes');
    var total_records_final_id = $(".center-right").find('.numbers-of-fields').attr('id');
    var total_records_processed = $(".center-right").find('.total-fields-processed').attr('id');
    var answers_completed = [];
    var dialog_boxed_poped_up = false;
    var data_tobe_erased = [];
    var last_id_processed ;
    var data_tobe_sent_to_feedback = [];
    var process_dialog_boxed_poped_up = false;
    var partial_process_count = 0;
    var activateProcessButton = true;
     var z = 0;
     var y = 0;
     var fetch = $("#fetch").attr("value");
     var ajaxToken = $("#ajax-token").attr("value");

    /**************************************************************************************/

    /****************************************
     * 
     * 
     * buttons 
     * 
     * 
     */




    //process the data selected
   
        
         $("#process").button()
            .off( "click", Process );
  
    
       
        
    
    
    function Process()
    {
    
        var process ;

        process = Finished("process");
        
        if(process == true )
        {
        
           $("#compleated-all-fields").dialog("open");
        
        }

      
  }

    // fetches the data if it was not done automatically 
    $("#fetch-data").button().click(function () {


        window.location.href = '../config/main.php?fetch='+ fetch;
       



    });





    /*******************************
     * 
     * handles section right 
     * 
     */


    $(".center-right").find('.checkboxes').mouseover(function () {


        id = $(this).attr("id");
        $(".information").empty();

    });

    

    /*****************************************dialogs *****************************************/


    $(function () {
        $("#missed-fields").dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                Ok: function () {
                    $(this).dialog("close");
                }
            }
        });
    });



    $(function () {
        $("#compleated-all-fields").dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                Ok: function () {
                    ajax_call(data_tobe_erased,last_id_processed,data_tobe_sent_to_feedback);
                    $(this).dialog("close");
                },
                Cancel: function ()
                {
                    $(this).dialog("close");
                }
            }
        });
    });

    /**********************************************************************************************************************/


    /***************************************************************8
     * it kaptures the checkboxes action and it process if needs to be finished  
     * 
     * 
     * 
     * 
     *****************************************/



    checkboxes_id.find(".keep").click(function () {
        $(this).css('background-color', 'red');
        checkboxes_id.find("#discard" + id).css('background-color', 'white');
         
         ActivateProcessButton();
        
        if (id % 2 == 0)
        {
            fields_not_selected_obj.find("#" + id).css('background-color', '#f2f2f2');
        }
        else
        {
            fields_not_selected_obj.find("#" + id).css('background-color', 'white');
        }
        answers_completed[id] = "keep";

        Finished("all");
    });




    checkboxes_id.find(".discard").click(function () {
        $(this).css('background-color', 'red');
        checkboxes_id.find("#keep" + id).css('background-color', 'white');
 
        
        ActivateProcessButton();
        
         
        
        if (id % 2 == 0)
        {
            fields_not_selected_obj.find("#" + id).css('background-color', '#f2f2f2');
        }
        else
        {
            fields_not_selected_obj.find("#" + id).css('background-color', 'white');
        }

        answers_completed[id] = "discard";
        Finished("all");

    });



    function ActivateProcessButton()
    {
        
        if(activateProcessButton)
        {
            $("#process").button()
            .on( "click", Process );
            
            activateProcessButton = false;
        }
        
        
        
    }


    /*************************************************************************************************************/

    /****************************************Functions*******************************************************/







    function Finished(action)
    {
        
        var count_records_missed ;
        if (action == "all")
        {

            if (total_records_final_id == (answers_completed.length - 1))
            {
                   count_records_missed = total_records_final_id;

                        
                    count_records_missed = getTheDiscardRecords(count_records_missed);
                    $("#process")
                    .off( "click", Process );  

                if (total_records_final_id == count_records_missed)
                {

                     

                    $("#compleated-all-fields").dialog("open");

                }


                if (total_records_final_id != count_records_missed && dialog_boxed_poped_up == false)
                {
                    Missed_fields();
                    dialog_boxed_poped_up = true;
                }

            }
        }
        else
        {
            
            count_records_missed = answers_completed.length ;
           
            count_records_missed = getTheProcessedDiscardRecords(count_records_missed);
           
            if( count_records_missed != (answers_completed.length - 1) && process_dialog_boxed_poped_up == false )
            {
                Missed_fields();
                process_dialog_boxed_poped_up = true;
                
            }
            
            
            if( count_records_missed == answers_completed.length )
            {
                
                return true;
                
            }
            
            
        }
    }





    function Missed_fields()
    {
        $("#missed-fields").dialog("open");
    }




    function getTheProcessedDiscardRecords(count_records_missed)
    {
        
        
       
                
        for (var i = id ; i < answers_completed.length; i++)
        {         
           partial_process_count++;
           count_records_missed = processData(i,answers_completed,count_records_missed);
        }
        
      
       return  count_records_missed;

    }
     
     function getTheDiscardRecords(count_records_missed)
    {
          var where_to_start = (total_records_final_id - total_records_processed) + partial_process_count;
        
         for (var i = ( where_to_start + 1); i < answers_completed.length; i++)
        {
             
            
            count_records_missed = processData(i,answers_completed,count_records_missed);
         


        }
       
        return count_records_missed;

    }
    
    
    
     function processData(i , answers_completed, count_records_missed)
     {
        
        var records_obj;
        var records_id;
        records_obj = $(".center-left").find("#data" + i);
         
         if (typeof answers_completed[i] === 'undefined')
            {
               
                count_records_missed--;
                fields_not_selected_obj.find("#" + i).css('background-color', 'blue');

            }

           else if (answers_completed[i] == "discard")
            {
                
               
                records_id = records_obj.find("#id").attr("value");
                
                data_tobe_erased[ y ] = records_id;
                
               
                last_id_processed = i;
                y++;

            }
            else 
            {
                 
                records_id = records_obj.find("#code").attr("value");
                
                 data_tobe_sent_to_feedback[z] = records_id;
                z++;
                records_id = records_obj.find("#q1").attr("value");
                
                 data_tobe_sent_to_feedback[z] = records_id;
                z++;
                records_id = records_obj.find("#q2").attr("value");
                data_tobe_sent_to_feedback[z] = records_id;
                  z++;
                records_id = records_obj.find("#q3").attr("value");
               data_tobe_sent_to_feedback[z] = records_id;
                 z++;
                records_id = records_obj.find("#q4").attr("value");
               data_tobe_sent_to_feedback[z] = records_id;
                  z++;
                records_id = records_obj.find("#q5").attr("value");
               data_tobe_sent_to_feedback[z] = records_id;
                  z++;
                records_id = records_obj.find("#q6").attr("value");
                data_tobe_sent_to_feedback[z] = records_id;
                last_id_processed = i;
                z++;
               
                
            }
         
         return count_records_missed;
         
     }  
   

    function ajax_call(data_tobe_erased,last_id_processed,data_tobe_sent_to_feedback)
    {
           
           var obj = new Obj();

            for (var i = 0 ; i < data_tobe_erased.length; i++)
            {
                    obj.data_tobe_erased[i] = data_tobe_erased[i];
                        
                
            }
            for (var y = 0 ; y < data_tobe_sent_to_feedback.length; y++)
            {
                    obj.data_tobe_sent_to_feedback[y] = data_tobe_sent_to_feedback[y];
                       
                
                
            }

        var request = $.ajax({
            url: "../config/main.php",
            method: "post",
            data: {data_tobe_erased: obj.data_tobe_erased, id : last_id_processed, data_tobe_sent_to_feedback : obj.data_tobe_sent_to_feedback , ajax : ajaxToken },
            dataType: "html"
        });

        request.done(function (msg) {
            var count = msg.split(",");
            
            
          
            
            
           
             
           if(count[0] == 1)
           {
               alert(" temp_input_feedeback_data updated " + '  ' + count[1]);
                for (var i = (answers_completed.length - total_records_processed); i < answers_completed.length; i++)
                {
                    
                    $(".center-left").find("#data" + i).empty();
                    fields_not_selected_obj.find("#"+i).empty();

                }


            } 
            else
            {
                alert( msg );
            }





        });
        request.fail(function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });
    }
    
    function Obj() 
    {
        
        this.data_tobe_erased = [] ;
        this.data_tobe_sent_to_feedback = []
    }




});

