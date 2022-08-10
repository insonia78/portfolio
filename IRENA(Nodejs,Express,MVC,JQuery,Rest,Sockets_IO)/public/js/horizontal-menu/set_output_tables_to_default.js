/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var set_data_to_default_installed_capacity_output_es_cap_tables = function ()
{
    var table = $("#energystorage").find(".installed-capacity-output-es-cap-table");
    var tbody = table.find("tbody");
    var tr = tbody.find("tr");
    var tr_new = $(tr[0]).clone();
    tbody.empty();
      
    $(tr_new).find("th").text("");
    var td = $(tr_new).find("td");
    for(var i = 0; i < td.length; i++)
    {
        $(td[i]).find("div").text("");
    }
    tbody.append("<tr>"+ $(tr_new).html()+"</tr>");
    

};

//KAI
var set_data_to_default_installed_capacity_output_noess_cap_tables = function ()
{
    var table = $("#energystoragenoess").find(".installed-capacity-output-noess-cap-table");
    var tbody = table.find("tbody");
    var tr = tbody.find("tr");
    var tr_new = $(tr[0]).clone();
    tbody.empty();
      
    $(tr_new).find("th").text("");
    var td = $(tr_new).find("td");
    for(var i = 0; i < td.length; i++)
    {
        $(td[i]).find("div").text("");
    }
    tbody.append("<tr>"+ $(tr_new).html()+"</tr>");
    

};
var set_data_to_default_demand_side_output_installed_cap_tables = function ()
{
    var table = $("#installedcap").find(".demand-side-output-installed-cap-table");
    var tbody = table.find("tbody");
    var td = tbody.find("td");     
    for(var i = 0 ; i < td.length;i++)
    {
       $(td[i]).find("div").text("");
    }

};
//KAI
var set_data_to_default_demand_side_output_installed_cap_noess_tables = function ()
{
    var table = $("#installedcapnoess").find(".demand-side-output-installed-cap-noess-table");
    var tbody = table.find("tbody");
    var td = tbody.find("td");     
    for(var i = 0 ; i < td.length;i++)
    {
       $(td[i]).find("div").text("");
    }

};
var set_data_to_default_energy_capacity_output_es_cap_tables = function ()
{
    var table = $("#energystorage").find(".energy-capacity-output-es-cap-table");
    var tbody = table.find("tbody");
    var tr = tbody.find("tr");
    var tr_new = $(tr[0]).clone();
    tbody.empty();
      
    $(tr_new).find("th").text("");
    var td = $(tr_new).find("td");
    for(var i = 0; i < td.length; i++)
    {
        $(td[i]).find("div").text("");
    }
    tbody.append("<tr>"+ $(tr_new).html()+"</tr>");
};

// KAI
var set_data_to_default_energy_capacity_output_noess_cap_tables = function ()
{
    var table = $("#energystoragenoess").find(".energy-capacity-output-noess-cap-table");
    var tbody = table.find("tbody");
    var tr = tbody.find("tr");
    var tr_new = $(tr[0]).clone();
    tbody.empty();
      
    $(tr_new).find("th").text("");
    var td = $(tr_new).find("td");
    for(var i = 0; i < td.length; i++)
    {
        $(td[i]).find("div").text("");
    }
    tbody.append("<tr>"+ $(tr_new).html()+"</tr>");
};
var set_data_to_default_hydro_generation_output_installed_cap_tables = function ()
{
    var table = $("#installedcap").find(".hydro-generation-output-installed-cap-table");
    var tbody = table.find("tbody");
    var td = tbody.find("td");     
    for(var i = 0 ; i < td.length;i++)
    {
       $(td[i]).find("div").text("");
    }

};
//KAI
var set_data_to_default_hydro_generation_output_installed_cap_noess_tables = function ()
{
    var table = $("#installedcapnoess").find(".hydro-generation-output-installed-cap-noess-table");
    var tbody = table.find("tbody");
    var td = tbody.find("td");     
    for(var i = 0 ; i < td.length;i++)
    {
       $(td[i]).find("div").text("");
    }

};

var set_data_to_default_renewables_output_installed_cap_table = function ()
{
    var table = $("#installedcap").find(".renewables-output-installed-cap-table");
    var tbody = table.find("tbody");
    var td = tbody.find("td");
     
    for(var i = 0 ; i < td.length;i++)
    {
       $(td[i]).find("div").text("");
    }
};

//KAI
var set_data_to_default_renewables_output_installed_cap_noess_table = function ()
{
    var table = $("#installedcapnoess").find(".renewables-output-installed-cap-noess-table");
    var tbody = table.find("tbody");
    var td = tbody.find("td");
     
    for(var i = 0 ; i < td.length;i++)
    {
       $(td[i]).find("div").text("");
    }
};
var set_data_to_default_thermal_generation_output_installed_cap_tables = function ()
{
    var table = $("#installedcap").find(".thermal-generation-output-installed-cap-table");
    var tbody = table.find("tbody");
    var tr = tbody.find("tr");
    var tr_new = $(tr[0]).clone();
    tbody.empty();
      
    $(tr_new).find("th").text("");
    var td = $(tr_new).find("td");
    for(var i = 0; i < td.length; i++)
    {
        $(td[i]).find("div").text("");
    }
    tbody.append("<tr>"+ $(tr_new).html()+"</tr>");

};
//KAI
var set_data_to_default_thermal_generation_output_installed_cap_noess_tables = function ()
{
    var table = $("#installedcapnoess").find(".thermal-generation-output-installed-cap-noess-table");
    var tbody = table.find("tbody");
    var tr = tbody.find("tr");
    var tr_new = $(tr[0]).clone();
    tbody.empty();
      
    $(tr_new).find("th").text("");
    var td = $(tr_new).find("td");
    for(var i = 0; i < td.length; i++)
    {
        $(td[i]).find("div").text("");
    }
    tbody.append("<tr>"+ $(tr_new).html()+"</tr>");

};

var set_data_to_default_benefits_bucket_output_es_buckets_table = function ()
{   
    var table = $("#stackedbenefits").find(".benefits-bucket-output-es-buckets-table");
    var tbody = table.find("tbody");
    var children = tbody.children();
    var td = tbody.find("td");
     
    for(var i = 0 ; i < td.length;i++)
    {
       $(td[i]).find("div").text("");
    }
};

var set_data_to_default_fuel_usage_output_installed_cap_tables = function ()
{
    var table = $("#fuelusage").find(".fuel-usage-output-installed-cap-tables");
    var tbody = table.find("tbody");
    var tr = tbody.find("tr");
    var tr_new = $(tr[0]).clone();
    tbody.empty();
      
    $(tr_new).find("th").text("");
    var td = $(tr_new).find("td");
    for(var i = 0; i < td.length; i++)
    {
        $(td[i]).find("div").text("");
    }
    tbody.append("<tr>"+ $(tr_new).html()+"</tr>");
};
//KAI
var set_data_to_default_fuel_usage_output_installed_noess_tables = function ()
{
    var table = $("#fuelusagenoess").find(".fuel-usage-output-installed-noess-table");
   
    var tbody = table.find("tbody");
    var td = tbody.find("td");     
    for(var i = 0 ; i < td.length;i++)
    {
       $(td[i]).find("div").text("");
    }
};

var set_graphs_to_default = function()
{
            //Clear charts and labels
    $('#cappertechchart').html('');
    $('#genpertechchart').html('');
    $('#genprofilechart').html('');
    $('#primreschart').html('');
    $('#secreschart').html('');
    $('#terreschart').html('');
    $('#enerpriceprofilechart').html('');
    $('#respricechart').html('');
    $('#EMgeneration').html('');
    $('#EMprimres').html('');
    $('#EMsecres').html('');
    $('#EMtertres').html('');
    $('#genprofilechartlabels').html('');
    $('#primreschartlabels').html('');
    $('#secreschartlabels').html('');
    $('#terreschartlabels').html('');
    $('#enerpriceprofilechartlabels').html('');
    $('#respricechartlabels').html('');
    $('#EMgenerationlabels').html('');
    $('#EMprimreslabels').html('');
    $('#EMsecreslabels').html('');
    $('#EMtertreslabels').html('');
    //noess
            //Clear charts
    $('#cappertechchartnoess').html('');
    $('#genpertechchartnoess').html('');
    $('#genprofilechartnoess').html('');
    $('#primreschartnoess').html('');
    $('#secreschartnoess').html('');
    $('#terreschartnoess').html('');
    $('#enerpriceprofilechartnoess').html('');
    $('#respricechartnoess').html('');
    $('#EMgenerationnoess').html('');
    $('#EMprimresnoess').html('');
    $('#EMsecresnoess').html('');
    $('#EMtertresnoess').html('');
    $('#genprofilechartnoesslabels').html('');
    $('#primreschartnoesslabels').html('');
    $('#secreschartnoesslabels').html('');
    $('#terreschartnoesslabels').html('');
    $('#enerpriceprofilechartnoesslabels').html('');
    $('#respricechartnoesslabels').html('');
    $('#EMgenerationnoesslabels').html('');
    $('#EMprimresnoesslabels').html('');
    $('#EMsecresnoesslabels').html('');
    $('#EMtertresnoesslabels').html('');
};

var set_data_to_default_inputs_for_existing_table = function ()
{
    var table = $("#tabular").find(".inputs-for-existing-table");
    $(table).find('td').remove();
    $(table).find('.sub-row').remove();
    $(table).find('.year-heading').remove();
    $(table).find('tr:first').find('th:first').attr('colspan',"1");
};

var set_data_to_default_co_outputs_table = function ()
{
    var table = $("#tabular").find(".co-outputs-table");
    $(table).find('td').remove();
    $(table).find('.sub-row').remove();
    $(table).find('.year-heading').remove();
    $(table).find('tr:first').find('th:first').attr('colspan',"1");
};

var set_data_to_default_pc_outputs_table = function ()
{
    var table = $("#tabular").find(".pc-outputs-table");
    $(table).find('td').remove();
    $(table).find('.sub-row').remove();
    $(table).find('.year-heading').remove();
    $(table).find('tr:first').find('th:first').attr('colspan',"1");
};
 
  var set_data_to_default_pc_metrics_table = function ()
{
  var table = $("#outputs #pcmetrics").find(".pc-metrics-table");
  $(table).find('td').remove();
  $(table).find('.sub-row').remove();
  $(table).find('.year-heading').remove();
  $(table).find('tr:first').find('th:first').attr('colspan',"1");
};

var set_data_to_default_pc_metrics_noess_table = function ()
{
  var table = $("#outputs_noess #pcmetricsnoess").find(".pc-metrics-noess-table");
  $(table).find('td').remove();
  $(table).find('.sub-row').remove();
  $(table).find('.year-heading').remove();
  $(table).find('tr:first').find('th:first').attr('colspan',"1");
};