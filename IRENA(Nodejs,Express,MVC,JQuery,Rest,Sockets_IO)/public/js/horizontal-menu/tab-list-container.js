/*
 * Copyright 2018 Acelerex Inc.
 */

var page_refresh_3 = 0;
var clicked = true;
var events = [];
$(document).ready(function () {
    // prevent double refresh 
    if (page_refresh_3 === 1)
    {
        page_refresh_3 = 0;
        return;
    }

    page_refresh_3 = 1;
    

    $(".select-editable-notes-container").find(".data-table-list").click(function () {

        if (clicked === true)
        {            
            $(".scenario-menu-container").find(".table-list-container").css("display", "block");
            create_project_and_runs_table(scenario_and_cases_data_bucket.bucket);
            table_list_is_active = true;
        } else
        {
            table_list_is_active = false;
            $(".scenario-menu-container").find(".table-list-container").css("display", "none");
        }
        clicked = !clicked;
    });



});
/*
 * it creates the table list by dinamic search by character
 * 
 */
var create_table_list_search_dinamically =  function(scenario)
{  
   if(scenario === "")
   {
     create_project_and_runs_table(scenario_and_cases_data_bucket.bucket);
   }
   else
     create_project_and_runs_table(
              scenario_and_cases_data_bucket.searchBucketByScenarioCharacher(scenario));  
};
/*
 * 
 * 
 */
var create_project_and_runs_table = function (values)
{
    
    $(".scenario-menu-container").find(".table-list-container").empty();
    
    for(var i = 0; i < events.length;i++)
    {
        delete events[i];
    }
    
    var data = values;
    var i = 0;
    var z = 1;
    var ul = "<ul class='tab-list-links' style='list-style-type:none;display:block'></ul>";
    $(".scenario-menu-container").find(".table-list-container").append(ul);
    do {
        var table_container;
        if (z === 1)
            table_container = "<div style='width:100%;display:block' class= ' horizontal-menu-table-container ' id ='table-container_" + z + "'></div>";
        else
            table_container = "<div style='width:100%;display:none' class= ' horizontal-menu-table-container ' id ='table-container_" + z + "'></div>";
        $(".scenario-menu-container").find(".table-list-container").append(table_container);
        var table_container_ancor = "<li style='display:inline;margin-left:1%;'><a href='#table-container_" + z + "'>" + z + "</a></li>";
        $(".scenario-menu-container .table-list-container").find(".tab-list-links").append(table_container_ancor);
        var project_table = "<table class =' horizontal-menu-table scenario_and_cases_"+z+"' style='display:inline-table; width:100%';>"
                + "<thead>"
                + "<tr>"
                + "<th width='27%'>Project</th>"
                + "<th width='27%'>Run</th>"
                + "<th width='30%'>Date Created</th>"
                + "<th width='100%'>Notes</th>"
                + "</thead>"
                + "<tbody>"
                + "</tbody>"
                + "</table>";
        $(".table-list-container").find("#table-container_" + z).append(project_table);          
        while (i < data.length)
        {
            console.log(data[i]);  
            var value = "<tr class ='scenario-and-cases-css-tr'>"
                    + "<td onclick ='get_cases_from_table_list(" + i + ")' class=' val  scenario-and-cases-css_" + i + "' value='" + data[i].scenario + "'>" + data[i].scenario + "</td>"
                    + "<td onclick ='get_cases_from_table_list(" + i + ")' class='scenario-and-cases-css_" + i + "'>" + data[i].cases.length + "</td>"
                    + "<td onclick ='get_cases_from_table_list(" + i + ")' class='scenario-and-cases-css_" + i + "'>" + data[i].date + "</td>"
                    + "<td onclick ='get_cases_from_table_list(" + i + ")' class='scenario-and-cases-css_" + i + "'>" + data[i].notes + "</td>"
                    + "</tr>";
            $(".scenario_and_cases_" + z).find("tbody").append(value);
            ++i;
            if ((i % 5) === 0)
                break;

        }
        z++;
    } while (i < data.length);
    $('tr.scenario-and-cases-css-tr').hover(function ()
    {
        events.push(this);
        $(".select-editable-container").find(".scenario-option").val("");
        $(".select-editable-container").find(".scenario-option").val($(this).find(".val").attr("value"));
        $(this).css("background-color", "#a7cce5");

    }, function () {   
    $("tr.scenario-and-cases-css-tr").css("background-color", "white");
    $("tr.scenario-and-cases-css-tr").css("text-align", "center");
    $('.tab-list-links a').on('click', function (e) {

        events.push(this);
        var a = $('.tab-list-links').find("a");
        for (var i = 0; i < a.length; i++)
        {
            if ($(a[i]).attr("href") === $(this).attr('href'))
                $($(this).attr('href')).show();
            else
                $($(a[i]).attr("href")).hide();
        }
        e.preventDefault();
    });
    
  });
};
var get_cases_from_table_list = function (value)
{
    for(var i = 0; i < events.length;i++)
    {
        delete events[i];
    }
    $(".select-editable-notes-container").find(".scenario-notes").val("");
    $(".select-editable-container").find(".scenario-option").val("");
    var a = $(".horizontal-menu-table").find(".scenario-and-cases-css_" + value);
    var scenario = a.attr("value");
    $(".select-editable-container").find(".scenario-option").val(scenario);
    $(".select-editable-notes-container").find(".scenario-notes").val(scenario_and_cases_data_bucket.getScenarioNotes(scenario));
    $(".select-editable-container").find(".scenario-option").click();
    create_case_list_table(scenario);
};
var create_case_list_table = function (scenario)
{  
    $(".scenario-menu-container").find(".table-list-container").empty();
    var ul = "<ul class='tab-list-links' style='list-style-type:none;display:block'></ul>";
    var arrow_image ="<li style='display:inline;margin-left:1%;'><img src='images/arrow.png' class= 'arrow-back' style='width:2%;height:2%' /></li>"
    $(".scenario-menu-container").find(".table-list-container").append(ul);
    $(".scenario-menu-container .table-list-container").find(".tab-list-links").append(arrow_image);
    var cases = scenario_and_cases_data_bucket.getCases(scenario);
    console.log(cases);
    var y = 0;
    var z = 1;
    do {
        var table_container;
        if (z === 1)
            table_container = "<div style='width:100%;display:block' class= ' horizontal-menu-table-container ' id ='table-container_" + z + "'></div>";
        else
            table_container = "<div style='width:100%;display:none' class= ' horizontal-menu-table-container ' id ='table-container_" + z + "'></div>";
        $(".scenario-menu-container").find(".table-list-container").append(table_container);
        var table_container_ancor = "<li style='display:inline;margin-left:1%;'><a href='#table-container_" + z + "'>" + z + "</a></li>";
        $(".scenario-menu-container .table-list-container").find(".tab-list-links").append(table_container_ancor);
        
        var hidden_table = "<table class ='horizontal-menu-table cases_data_" + z + "' width:100%'>"
                + "<thead>"
                + "<tr>"
                + "<th width='27%'>Project</th>"
                + "<th width='27%'>Run</th>"
                + "<th width='30%'>Date Created</th>"
                + "<th width='100%'>Notes</th>"
                + "</thead>"
                + "<tbody>"
                + "</tbody>"
                + "</table>";
        $(".scenario-menu-container").find("#table-container_" + z).append(hidden_table);
        
        var table_data;
        
        table_data = "<tr class = 'cases-css-tr'>"
                + "<td onclick='get_case_inputs(" + y + ")'>" + scenario + "</td>"
                + "<td onclick='get_case_inputs(" + y + ")' class = 'val' value ='" + cases[y].case + "'>" + cases[y].case + "</td>"
                + "<td onclick='get_case_inputs(" + y + ")'>" + cases[y].date + "</td>"
                + "<td onclick='get_case_inputs(" + y + ")'>" + cases[y].notes + "</td>"
                + "</tr>";
        $(".cases_data_" + z ).find("tbody").append(table_data);
        ++y;
        while(y < cases.length)
        {
            table_data = "<tr class = 'cases-css-tr'>"
                    + "<td onclick='get_case_inputs(" + y + ")'></td>"
                    + "<td onclick='get_case_inputs(" + y + ")' class = 'val' value='" + cases[y].case + "'>" + cases[y].case + "</td>"
                    + "<td onclick='get_case_inputs(" + y + ")'>" + cases[y].date + "</td>"
                    + "<td onclick='get_case_inputs(" + y + ")'>" + cases[y].notes + "</td>"
                    + "</tr>";
            $(".cases_data_"+ z ).find("tbody").append(table_data);
            if((y++ % 4) === 0)
                break;
            
        }
        
        z++;
    } while (y < cases.length)
    $('tr.cases-css-tr').hover(function ()
    {
        events.push(this);
        $(".select-editable-container").find(".case-option").val("");
        $(".select-editable-container").find(".case-option").val($(this).find(".val").attr("value"));
        $(this).css("background-color", "#a7cce5");
        $(this).click(function ()
        {
            $(".select-editable-container").find(".case-option").click();
        });

    }, function () {
        $(this).css("background-color", "white");
    });
    
    $('.tab-list-links a').on('click', function (e) {
          
         events.push(this);
        var a = $('.tab-list-links').find("a");
        for (var i = 0; i < a.length; i++)
        {
            if ($(a[i]).attr("href") === $(this).attr('href'))
                $($(this).attr('href')).show();
            else
                $($(a[i]).attr("href")).hide();
        }
        e.preventDefault();
    });
     $(".tab-list-links img").on("click",function(){
        events.push(this);        
        create_project_and_runs_table(scenario_and_cases_data_bucket.bucket);
    });     
    $(".horizontal-menu-table").find("tbody").children().css("background-color", "white");
    $(".horizontal-menu-table").find("tbody").children().css("text-align", "center");
};
