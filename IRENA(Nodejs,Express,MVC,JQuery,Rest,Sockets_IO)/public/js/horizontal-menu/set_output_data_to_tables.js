/*
 * Copyright 2018 Acelerex Inc.
 */
var set_data_to_installed_capacity_output_es_cap_tables = function (outputs)
{
    var table = $("#energystorage").find(".installed-capacity-output-es-cap-table");
    var tbody = table.find("tbody");
    var tr = tbody.find("tr");
    var tr_new = $(tr[0]).clone();
    tbody.empty();
    var i = 0;
    if(outputs.installed_capacity_output_es_cap_tables.length===0)
    {
        tbody.append(tr_new);
        return;
    }
    while (outputs.installed_capacity_output_es_cap_tables.length > i)
    {
        var tr_clone = tr_new.clone();
        for (var y = 0; y < tr_clone.length; y++)
        {

            var children = tr_clone.children();
            
            for (var x = 0; x < children.length; x++)
            {
 
                var keys = Object.keys(outputs.installed_capacity_output_es_cap_tables[i]);
                var values = Object.values(outputs.installed_capacity_output_es_cap_tables[i]);
                 
                for (var z = 0; z < keys.length; z++)
                {
                    if( keys[z] === "scenario_and_cases_row_id" )
                    {
                        x--;
                        break;
                    }
                    var temp_file = isNaN(values[z]);
                    $(tr_clone).find("#" + keys[z]).text("");
                    if(temp_file)
                        $(tr_clone).find("#" + keys[z]).text(values[z]);
                    else
                      $(tr_clone).find("#" + keys[z]).text(Math.round(values[z]));
                }
                i++;
            }
            tbody.append("<tr>"+ $(tr_clone).html()+"</tr>");
        }
    }

};
// KAI 
var set_data_to_installed_capacity_output_noess_cap_tables= function (outputs)
{
    var table = $("#energystoragenoess").find(".installed-capacity-output-noess-cap-table");
    var tbody = table.find("tbody");
    var tr = tbody.find("tr");
    var tr_new = $(tr[0]).clone();
    tbody.empty();
    var i = 0;
    if(outputs.installed_capacity_output_noess_cap_tables.length===0)
    {
        tbody.append(tr_new);
        return;
    }
    while (outputs.installed_capacity_output_noess_cap_tables.length > i)
    {
        var tr_clone = tr_new.clone();
        for (var y = 0; y < tr_clone.length; y++)
        {
            var children = tr_clone.children();
            
            for (var x = 0; x < children.length; x++)
            {
                var keys = Object.keys(outputs.installed_capacity_output_noess_cap_tables[i]);
                var values = Object.values(outputs.installed_capacity_output_noess_cap_tables[i]);
                 
                for (var z = 0; z < keys.length; z++)
                {
                    if( keys[z] === "scenario_and_cases_row_id" )
                    {
                        x--;
                        break;
                    }
                    var temp_file = isNaN(values[z]);
                    $(tr_clone).find("#" + keys[z]).text("");
                    if(temp_file)
                        $(tr_clone).find("#" + keys[z]).text(values[z]);
                    else
                      $(tr_clone).find("#" + keys[z]).text(Math.round(values[z]));
                }
                i++;
            }
            tbody.append("<tr>"+ $(tr_clone).html()+"</tr>");
        }
    }

};

var set_data_to_demand_side_output_installed_cap_tables = function (outputs)
{
   var table = $("#installedcap").find(".demand-side-output-installed-cap-table");
    var tbody = table.find("tbody");
    var children = tbody.children();
    for(var i = 0 ; i < outputs.demand_side_output_installed_cap_tables.length;i++)
    {
        var keys = Object.keys(outputs.demand_side_output_installed_cap_tables[i]);
        var values = Object.values(outputs.demand_side_output_installed_cap_tables[i]);
        for (var z = 0; z < keys.length; z++)
        {
           table.find("#" + keys[z]).text("");
           table.find("#" + keys[z]).text(Math.round(values[z]));
        } 
    }

};
// KAI 4 4 2018
var set_data_to_demand_side_output_installed_cap_noess_tables = function (outputs)
{
   var table = $("#installedcapnoess").find(".demand-side-output-installed-cap-noess-table");
    var tbody = table.find("tbody");
    var children = tbody.children();
    for(var i = 0 ; i < outputs.demand_side_output_installed_cap_noess_tables.length;i++)
    {
       var keys = Object.keys(outputs.demand_side_output_installed_cap_noess_tables[i]);
        var values = Object.values(outputs.demand_side_output_installed_cap_noess_tables[i]);
        for (var z = 0; z < keys.length; z++)
        {
           table.find("#" + keys[z]).text("");
           table.find("#" + keys[z]).text(Math.round(values[z]));
        } 
    }

};
var set_data_to_energy_capacity_output_es_cap_tables = function (outputs)
{
    var table = $("#energystorage").find(".energy-capacity-output-es-cap-table");
    var tbody = table.find("tbody");
    var tr = tbody.find("tr");
    var tr_new = $(tr[0]).clone();
    tbody.empty();
    var i = 0;
    var check_if_the_row_pass_medium_short= Boolean(0);
    if(outputs.energy_capacity_output_es_cap_tables.length===0)
    {
        tbody.append(tr_new);
        return;
    }
    while (outputs.energy_capacity_output_es_cap_tables.length > i)
    {
        var tr_clone = tr_new.clone();
        for (var y = 0; y < tr_clone.length; y++)
        {
            var children = tr_clone.children();
            
            for (var x = 0; x < children.length; x++)
            {
                var keys = Object.keys(outputs.energy_capacity_output_es_cap_tables[i]);
                var values = Object.values(outputs.energy_capacity_output_es_cap_tables[i]);
                
                // KAI 3.30 2018 if it is short row, 
                // which comes after medium short column, then we display one decimal
                
                
                if(Object.values(outputs.energy_capacity_output_es_cap_tables[i])[0]==="Medium Short")
                    check_if_the_row_pass_medium_short=Boolean(1);
                
                for (var z = 0; z < keys.length; z++)
                {
                    if( keys[z] === "scenario_and_cases_row_id" )
                    {
                        x--;
                        break;
                    }
                    var temp_file = isNaN(values[z]);
                    $(tr_clone).find("#" + keys[z]).text("");
                    if(temp_file)
                        $(tr_clone).find("#" + keys[z]).text(values[z]);
                    else{
                        if(check_if_the_row_pass_medium_short===Boolean(0))
                            $(tr_clone).find("#" + keys[z]).text(Math.round(values[z]));
                        else
                            $(tr_clone).find("#" + keys[z]).text(Math.round(values[z]*10)/10);
                        // we leave one decimal to the row of short KAI 
                    }
                }
                i++;
            }
            tbody.append("<tr>"+ $(tr_clone).html()+"</tr>");
        }
    }

};
// KAI 4 4 2018
var set_data_to_energy_capacity_output_noess_cap_tables= function (outputs)
{
    var table = $("#energystoragenoess").find(".energy-capacity-output-noess-cap-table");
    var tbody = table.find("tbody");
    var tr = tbody.find("tr");
    var tr_new = $(tr[0]).clone();
    tbody.empty();
    var i = 0;
    var check_if_the_row_pass_medium_short= Boolean(0);
    
    if(outputs.energy_capacity_output_noess_cap_tables.length===0)
    {
        tbody.append(tr_new);
        return;
    }
    
    while (outputs.energy_capacity_output_noess_cap_tables.length > i)
    {
        var tr_clone = tr_new.clone();
        for (var y = 0; y < tr_clone.length; y++)
        {
            var children = tr_clone.children();
            
            for (var x = 0; x < children.length; x++)
            {
                var keys = Object.keys(outputs.energy_capacity_output_noess_cap_tables[i]);
                var values = Object.values(outputs.energy_capacity_output_noess_cap_tables[i]);
                
                // KAI 3.30 2018 if it is short row, 
                // which comes after medium short column, then we display one decimal
                
                
                if(Object.values(outputs.energy_capacity_output_noess_cap_tables[i])[0]==="Medium Short")
                    check_if_the_row_pass_medium_short=Boolean(1);
                
                for (var z = 0; z < keys.length; z++)
                {
                    if( keys[z] === "scenario_and_cases_row_id" )
                    {
                        x--;
                        break;
                    }
                    var temp_file = isNaN(values[z]);
                    $(tr_clone).find("#" + keys[z]).text("");
                    if(temp_file)
                        $(tr_clone).find("#" + keys[z]).text(values[z]);
                    else{
                        if(check_if_the_row_pass_medium_short===Boolean(0))
                            $(tr_clone).find("#" + keys[z]).text(Math.round(values[z]));
                        else
                            $(tr_clone).find("#" + keys[z]).text(Math.round(values[z]*10)/10);
                        // we leave one decimal to the row of short KAI 
                    }
                }
                i++;
            }
            tbody.append("<tr>"+ $(tr_clone).html()+"</tr>");
        }
    }

};

var set_data_to_hydro_generation_output_installed_cap_tables = function (outputs)
{
    var table = $("#installedcap").find(".hydro-generation-output-installed-cap-table");
    var tbody = table.find("tbody");
    var children = tbody.children(); 
    for(var i = 0 ; i < outputs.hydro_generation_output_installed_cap_tables.length;i++)
    {
       var keys = Object.keys(outputs.hydro_generation_output_installed_cap_tables[i]);
        var values = Object.values(outputs.hydro_generation_output_installed_cap_tables[i]);
        for (var z = 0; z < keys.length; z++)
        {
           table.find("#" + keys[z]).text("");
           table.find("#" + keys[z]).text(Math.round(values[z]));
        } 
    }


};
// KAI
var set_data_to_hydro_generation_output_installed_cap_noess_tables = function (outputs)
{
    var table = $("#installedcapnoess").find(".hydro-generation-output-installed-cap-noess-table");
    var tbody = table.find("tbody");
    var children = tbody.children(); 
    for(var i = 0 ; i < outputs.hydro_generation_output_installed_cap_noess_tables.length;i++)
    {
       var keys = Object.keys(outputs.hydro_generation_output_installed_cap_noess_tables[i]);
        var values = Object.values(outputs.hydro_generation_output_installed_cap_noess_tables[i]);
        for (var z = 0; z < keys.length; z++)
        {
           table.find("#" + keys[z]).text("");
           table.find("#" + keys[z]).text(Math.round(values[z]));
        } 
    }


};


var set_data_to_renewables_output_installed_cap_table = function (outputs)
{
    var table = $("#installedcap").find(".renewables-output-installed-cap-table");
    var tbody = table.find("tbody");
    var children = tbody.children(); 
    for(var i = 0 ; i < outputs.renewables_output_installed_cap_table.length;i++)
    {
       var keys = Object.keys(outputs.renewables_output_installed_cap_table[i]);
        var values = Object.values(outputs.renewables_output_installed_cap_table[i]);
        for (var z = 0; z < keys.length; z++)
        {
           table.find("#" + keys[z]).text("");
           table.find("#" + keys[z]).text(Math.round(values[z]));
        } 
    }
};
// KAI
var set_data_to_renewables_output_installed_cap_noess_table = function (outputs)
{
    var table = $("#installedcapnoess").find(".renewables-output-installed-cap-noess-table");
    var tbody = table.find("tbody");
    var children = tbody.children(); 
    for(var i = 0 ; i < outputs.renewables_output_installed_cap_noess_table.length;i++)
    {
       var keys = Object.keys(outputs.renewables_output_installed_cap_noess_table[i]);
        var values = Object.values(outputs.renewables_output_installed_cap_noess_table[i]);
        for (var z = 0; z < keys.length; z++)
        {
           table.find("#" + keys[z]).text("");
           table.find("#" + keys[z]).text(Math.round(values[z]));
        } 
    }
};
var set_data_to_thermal_generation_output_installed_cap_tables = function (outputs)
{
    var table = $("#installedcap").find(".thermal-generation-output-installed-cap-table");
    var tbody = table.find("tbody");
    var tr = tbody.find("tr");
    var tr_new = $(tr[0]).clone();
    tbody.empty();
    var i = 0;

    if(outputs.thermal_generation_output_installed_cap_tables.length===0)
    {
        tbody.append(tr_new);
        return;
    }
    
    while (outputs.thermal_generation_output_installed_cap_tables.length > i)
    {
        var tr_clone = tr_new.clone();
        for (var y = 0; y < tr_clone.length; y++)
        {
            
            var children = tr_clone.children();
           
            for (var x = 0; x < children.length; x++)
            {
                var keys = Object.keys(outputs.thermal_generation_output_installed_cap_tables[i]);
                var values = Object.values(outputs.thermal_generation_output_installed_cap_tables[i]);
                 
                for (var z = 0; z < keys.length; z++)
                {
                    if( keys[z] === "scenario_and_cases_row_id" )
                    {
                        x--;
                        break;
                    }
                    var temp_file = isNaN(values[z]);
                    $(tr_clone).find("#" + keys[z]).text("");
                    if(temp_file)
                        $(tr_clone).find("#" + keys[z]).text(values[z]);
                    else
                      $(tr_clone).find("#" + keys[z]).text(Math.round(values[z]));
                }
                i++;
            }
            tbody.append("<tr>"+ $(tr_clone).html()+"</tr>");
        }
    }

};
// KAI
var set_data_to_thermal_generation_output_installed_cap_noess_tables = function (outputs)
{
    var table = $("#installedcapnoess").find(".thermal-generation-output-installed-cap-noess-table");
    var tbody = table.find("tbody");
    var tr = tbody.find("tr");
    var tr_new = $(tr[0]).clone();
    tbody.empty();
    var i = 0;
    
    if(outputs.thermal_generation_output_installed_cap_noess_tables.length===0)
    {
        tbody.append(tr_new);
        return;
    }
    while (outputs.thermal_generation_output_installed_cap_noess_tables.length > i)
    {
        var tr_clone = tr_new.clone();
        for (var y = 0; y < tr_clone.length; y++)
        {
            var children = tr_clone.children();
           
            for (var x = 0; x < children.length; x++)
            {
                var keys = Object.keys(outputs.thermal_generation_output_installed_cap_noess_tables[i]);
                var values = Object.values(outputs.thermal_generation_output_installed_cap_noess_tables[i]);
                 
                for (var z = 0; z < keys.length; z++)
                {
                    if( keys[z] === "scenario_and_cases_row_id" )
                    {
                        x--;
                        break;
                    }
                    var temp_file = isNaN(values[z]);
                    $(tr_clone).find("#" + keys[z]).text("");
                    if(temp_file)
                        $(tr_clone).find("#" + keys[z]).text(values[z]);
                    else
                      $(tr_clone).find("#" + keys[z]).text(Math.round(values[z]));
                }
                i++;
            }
            tbody.append("<tr>"+ $(tr_clone).html()+"</tr>");
        }
    }

};

//var set_data_to_demand_side_output_installed_cap_table = function (outputs)
//{
//    $("#outeff1").val(outputs.demand_side_output_installed_cap_tables.outeff1);
//    $("#outdem1").val(outputs.demand_side_output_installed_cap_tables.outdem1);
//    $("#outdist1").val(outputs.demand_side_output_installed_cap_tables.outdist1);
//    $("#outeff2").val(outputs.demand_side_output_installed_cap_tables.outeff2);
//    $("#outdem2").val(outputs.demand_side_output_installed_cap_tables.outdem2);
//    $("#outdist2").val(outputs.demand_side_output_installed_cap_tables.outdist2);
//};
//// KAI 
//var set_data_to_demand_side_output_installed_cap_noess_tables = function (outputs)
//{
//    $("#outeff1").val(outputs.demand_side_output_installed_cap_noess_tables.outeff1);
//    $("#outdem1").val(outputs.demand_side_output_installed_cap_noess_tables.outdem1);
//    $("#outdist1").val(outputs.demand_side_output_installed_cap_noess_tables.outdist1);
//    $("#outeff2").val(outputs.demand_side_output_installed_cap_noess_tables.outeff2);
//    $("#outdem2").val(outputs.demand_side_output_installed_cap_noess_tables.outdem2);
//    $("#outdist2").val(outputs.demand_side_output_installed_cap_noess_tables.outdist2);
//};

var set_output_data_benefits_bucket_output_es_buckets_table = function (outputs)
{   
    console.log("set_output_data_benefits_bucket_output_es_buckets_table");
    console.log(outputs);
    var table = $("#stackedbenefits").find(".benefits-bucket-output-es-buckets-table");
    var tbody = table.find("tbody");
    var children = tbody.children(); 
    for(var i = 0 ; i < outputs.benefit_buckets_output_es_buckets_table.length;i++)
    {       
       var keys = Object.keys(outputs.benefit_buckets_output_es_buckets_table[i]);
        var values = Object.values(outputs.benefit_buckets_output_es_buckets_table[i]);
        for (var z = 0; z < keys.length; z++)
        {
           $("#" + keys[z]).text("");
           $("#" + keys[z]).text(Math.round(values[z]));
        } 
    } 
};



var set_output_data_fuel_usage_output_installed_cap_tables = function (outputs)
{
    var table = $("#fuelusage").find(".fuel-usage-output-installed-cap-tables");
    var tbody = table.find("tbody");
    var tr = tbody.find("tr");
    var tr_new = $(tr[0]).clone();
    tbody.empty();
    var i = 0;
    if(outputs.fuel_usage_output_installed_cap_tables.length===0)
    {
        tbody.append(tr_new);
        return;
    }
    while (outputs.fuel_usage_output_installed_cap_tables.length > i)
    {
        var tr_clone = tr_new.clone();
        for (var y = 0; y < tr_clone.length; y++)
        {
            
            var children = tr_clone.children();
           
            for (var x = 0; x < children.length; x++)
            {
                var keys = Object.keys(outputs.fuel_usage_output_installed_cap_tables[i]);
                var values = Object.values(outputs.fuel_usage_output_installed_cap_tables[i]);
                 
                for (var z = 0; z < keys.length; z++)
                {
                    if( keys[z] === "scenario_and_cases_row_id" )
                    {
                        x--;
                        break;
                    }
                    var temp_file = isNaN(values[z]);
                    $(tr_clone).find("#" + keys[z]).text("");
                    if(temp_file)
                        $(tr_clone).find("#" + keys[z]).text(values[z]);
                    else
                      $(tr_clone).find("#" + keys[z]).text(Math.round(values[z]));
                }
                i++;
            }
            tbody.append("<tr>"+ $(tr_clone).html()+"</tr>");
        }
    }
};
// KAI
var set_output_data_fuel_usage_output_installed_cap_noess_tables= function (outputs)
{
   var table = $("#fuelusagenoess").find(".fuel-usage-output-installed-noess-table");
    var tbody = table.find("tbody");
    var tr = tbody.find("tr");
    var tr_new = $(tr[0]).clone();
    tbody.empty();
    var i = 0;
    
    if(outputs.fuel_usage_output_installed_noess_tables.length===0)
    {
        tbody.append(tr_new);
        return;
    }
    
    while (outputs.fuel_usage_output_installed_noess_tables.length > i)
    {
        var tr_clone = tr_new.clone();
        for (var y = 0; y < tr_clone.length; y++)
        {
            var children = tr_clone.children();
            for (var x = 0; x < children.length; x++)
            {
                var keys = Object.keys(outputs.fuel_usage_output_installed_noess_tables[i]);
                var values = Object.values(outputs.fuel_usage_output_installed_noess_tables[i]);
                 
                for (var z = 0; z < keys.length; z++)
                {
                    if( keys[z] === "scenario_and_cases_row_id" )
                    {
                        x--;
                        break;
                    }
                    var temp_file = isNaN(values[z]);
                    $(tr_clone).find("#" + keys[z]+"noess").text("");
                    if(temp_file)
                        $(tr_clone).find("#" + keys[z]+"noess").text(values[z]);
                    else
                      $(tr_clone).find("#" + keys[z]+"noess").text(Math.round(values[z]));
                }
                i++;
            }
            tbody.append("<tr>"+ $(tr_clone).html()+"</tr>");
        }
    }
};
//var set_output_data_benefits_bucket_output_es_buckets_table = function (outputs)
//{
//    $("#outfueldol1").val(outputs.benefits_bucket_output_es_buckets_table.outfueldol1);
//    $("#outvomdol1").val(outputs.benefits_bucket_output_es_buckets_table.outvomdol1);
//    $("#outprimresdol1").val(outputs.benefits_bucket_output_es_buckets_table.outprimresdol1);
//    $("#outsecresdol1").val(outputs.benefits_bucket_output_es_buckets_table.outsecresdol1);
//    $("#outterresdol1").val(outputs.benefits_bucket_output_es_buckets_table.outterresdol1);
//    $("#outfreqresdol1").val(outputs.benefits_bucket_output_es_buckets_table.outfreqresdol1);
//    $("#outreacpowdol1").val(outputs.benefits_bucket_output_es_buckets_table.outreacpowdol1);
//    $("#outblacksavdol1").val(outputs.benefits_bucket_output_es_buckets_table.outblacksavdol1);
//    $("#outenerarbdol1").val(outputs.benefits_bucket_output_es_buckets_table.outenerarbdol1);
//    $("#outredpeakdol1").val(outputs.benefits_bucket_output_es_buckets_table.outredpeakdol1);
//    $("#outforcerrdol1").val(outputs.benefits_bucket_output_es_buckets_table.outforcerrdol1);
//    $("#outaddsavdol1").val(outputs.benefits_bucket_output_es_buckets_table.outaddsavdol1);
//    $("#outtddefdol1").val(outputs.benefits_bucket_output_es_buckets_table.outtddefdol1);
//    /************************************************************/
//    $("#outfueldol2").val(outputs.benefits_bucket_output_es_buckets_table.outfueldol2);
//    $("#outvomdol2").val(outputs.benefits_bucket_output_es_buckets_table.outvomdol2);
//    $("#outprimresdol2").val(outputs.benefits_bucket_output_es_buckets_table.outprimresdol2);
//    $("#outsecresdol2").val(outputs.benefits_bucket_output_es_buckets_table.outsecresdol2);
//    $("#outterresdol2").val(outputs.benefits_bucket_output_es_buckets_table.outterresdol2);
//    $("#outfreqresdol2").val(outputs.benefits_bucket_output_es_buckets_table.outfreqresdol2);
//    $("#outreacpowdol2").val(outputs.benefits_bucket_output_es_buckets_table.outreacpowdol2);
//    $("#outblacksavdol2").val(outputs.benefits_bucket_output_es_buckets_table.outblacksavdol2);
//    $("#outenerarbdol2").val(outputs.benefits_bucket_output_es_buckets_table.outenerarbdol2);
//    $("#outredpeakdol2").val(outputs.benefits_bucket_output_es_buckets_table.outredpeakdol2);
//    $("#outforcerrdol2").val(outputs.benefits_bucket_output_es_buckets_table.outforcerrdol2);
//    $("#outaddsavdol2").val(outputs.benefits_bucket_output_es_buckets_table.outaddsavdol2);
//    $("#outtddefdol2").val(outputs.benefits_bucket_output_es_buckets_table.outtddefdol2);
//    /*****************************************************************************/
//
//    $("#outfuelloc1").val(outputs.benefits_bucket_output_es_buckets_table.outfuelloc1);
//    $("#outvomloc1").val(outputs.benefits_bucket_output_es_buckets_table.outvomloc1);
//    $("#outprimresloc1").val(outputs.benefits_bucket_output_es_buckets_table.outprimresloc1);
//    $("#outsecresloc1").val(outputs.benefits_bucket_output_es_buckets_table.outsecresloc1);
//    $("#outterresloc1").val(outputs.benefits_bucket_output_es_buckets_table.outterresloc1);
//    $("#outfreqresloc1").val(outputs.benefits_bucket_output_es_buckets_table.outfreqresloc1);
//    $("#outreacpowloc1").val(outputs.benefits_bucket_output_es_buckets_table.outreacpowloc1);
//    $("#outblacksavloc1").val(outputs.benefits_bucket_output_es_buckets_table.outblacksavloc1);
//    $("#outenerarbloc1").val(outputs.benefit_buckets.outenerarbloc1);
//    $("#outredpeakloc1").val(outputs.benefit_buckets.outredpeakloc1);
//    $("#outforcerrloc1").val(outputs.benefit_buckets.outforcerrloc1);
//    $("#outaddsavloc1").val(outputs.benefit_buckets.outaddsavloc1);
//    $("#outtddefloc1").val(outputs.benefit_buckets.outtddefloc1);
//    /*****************************************************************/
//    $("#outfuelloc2").val(outputs.benefit_buckets.outfuelloc2);
//    $("#outvomloc2").val(outputs.benefit_buckets.outvomloc2);
//    $("#outprimresloc2").val(outputs.benefit_buckets.outprimresloc2);
//    $("#outsecresloc2").val(outputs.benefit_buckets.outsecresloc2);
//    $("#outterresloc2").val(outputs.benefit_buckets.outterresloc2);
//    $("#outfreqresloc2").val(outputs.benefit_buckets.outfreqresloc2);
//    $("#outreacpowloc2").val(outputs.benefit_buckets.outreacpowloc2);
//    $("#outblacksavloc2").val(outputs.benefit_buckets.outblacksavloc2);
//    $("#outenerarbloc2").val(outputs.benefit_buckets.outenerarbloc2);
//    $("#outredpeakloc2").val(outputs.benefit_buckets.outredpeakloc2);
//    $("#outforcerrloc2").val(outputs.benefit_buckets.outforcerrloc2);
//    $("#outaddsavloc2").val(outputs.benefit_buckets.outaddsavloc2);
//    $("#outtddefloc2").val(outputs.benefit_buckets.outtddefloc2);
//};
//var set_data_to_fuel_usage = function (outputs)
//{
//    $(".outfuelburn1").val(outputs.fuel_usage.outfuelburn1);
//    $(".outfuelburn2").val(outputs.fuel_usage.outfuelburn2);
//    $(".outco2em1").val(outputs.fuel_usage.outco2em1);
//    $(".outco2em2").val(outputs.fuel_usage.outco2em2);
//};

//var set_output_data_inputs_for_existing_table = function(outputs)
//{
//  
//  var table = $('#tabular').find(".inputs-for-existing-table");
//  var tbody = $(table).find('tbody');
//  
//  tbody = append_row_in_tbody(tbody, "Load Peak (MW)", outputs.tabular_inputs_for_existing_table.existingloadpeak);
//  tbody = append_row_in_tbody(tbody, "Load Energy (GWh)", outputs.tabular_inputs_for_existing_table.existingloadenergy);
//  tbody = append_row_in_tbody(tbody, "Capacity Requirement (MW)", outputs.tabular_inputs_for_existing_table.existingcaprequirement);
//  tbody = append_row_in_tbody(tbody, "Installed Capacity by Fuel Type (MW)", outputs.tabular_inputs_for_existing_table.existinginstcapfuel);
//  tbody = append_row_in_tbody(tbody, "Firm Capacity by Fuel Type (MW)", outputs.tabular_inputs_for_existing_table.existingfirmcapfuel);
//  tbody = append_row_in_tbody(tbody, "Fuel Prices ($/MMBtu)", outputs.tabular_inputs_for_existing_table.existingfuelprices);
//  $(table).find('tbody').replaceWith(tbody);
//  
//};
//
//var set_output_data_co_outputs = function(outputs)
//{
//  var table = $('#tabular').find('.co-outputs-table');
//  var tbody = $(table).find('tbody');
//  var thead = $(table).find('thead');
//  //Add code for heading colspan and the year heading for multiple years
//  var number_of_years = outputs.tabular_co_outputs_table.length;
//  $(table).find('thead').find('tr:first').attr('colspan',number_of_years)
//  
//  tbody = append_row_in_tbody(tbody, "Forced Deactivation (MW)", outputs.tabular_co_outputs_table.cooutforceddeact);
//  tbody = append_row_in_tbody(tbody,"Forced Build (MW)", outputs.tabular_co_outputs_table.cooutforcedbuild);
//  tbody = append_row_in_tbody(tbody, "Economic Retirement (MW)", outputs.tabular_co_outputs_table.cooutecoretirement);
//  tbody = append_row_in_tbody(tbody, "Economic Build (MW)", outputs.tabular_co_outputs_table.cooutecobuild);
//  tbody = append_row_in_tbody(tbody, "Zonal Price ($/MWh)", outputs.tabular_co_outputs_table.cooutzonalprice);
//  tbody = append_row_in_tbody(tbody, "Capacity Price ($/kW-yr)", outputs.tabular_co_outputs_table.cooutcapacityprice);
//  tbody = append_row_in_tbody(tbody, "Import/Exports (GWh)", outputs.tabular_co_outputs_table.cooutimpexp);
//  tbody = append_row_in_tbody(tbody, "CO2 Emission (tons)", outputs.tabular_co_outputs_table.cooutco2emission);
//  tbody = append_row_in_tbody(tbody, "Emissions Cost ($000)", outputs.tabular_co_outputs_table.cooutemissioncost);
//  tbody = append_row_in_tbody(tbody, "Total Fuel Costs ($000)", outputs.tabular_co_outputs_table.coouttotalfuelcost);
//  tbody = append_row_in_tbody(tbody, "Energy by Fuel Type (GWh)", outputs.tabular_co_outputs_table.cooutenergybyfuel);
//  tbody = append_row_in_tbody(tbody, "Gen Capacity by Fuel Type (MW)", outputs.tabular_co_outputs_tablel.cooutgencapbyfuel);
//  tbody = append_row_in_tbody(tbody, "Generation Cost ($000)", outputs.tabular_co_outputs_table.cooutgencost);
//  tbody = append_row_in_tbody(tbody, "FO&M Cost ($000)", outputs.tabular_co_outputs_table.cooutfomcost);
//  
//  $(table).find('tbody').replaceWith(tbody);
//  
//};
//
//var append_row_in_tbody = function(tbody,rowHeading ,yearly_values)
//{
//    var tr = '<tr>';
//    if(yearly_values.constructor===Array)
//    {
//        tr+='<th class="table-items-description table-items-description-text">'+rowHeading + '</th>';
//        
//        for(var i=0; i<yearly_values.length; i++)
//        {
//            tr+='<td class="row-color-gray"><div>'+yearly_values[i]+'</div></td>';
//        }        
//        tr+='</tr>';
//        
//    }else if(yearly_values.constructor===Object)
//    {
//        var keys = Object.keys(yearly_values);
//        var values = Object.values(yearly_values);
//        var number_of_years = values[0].length;
//        tr+='<th class="table-items-description table-items-description-text">' + rowHeading + '</th>';
//        for(var i=0;i<number_of_years; i++)
//        {
//            tr+='<th class="table-items-description table-items-description-text"></th>';
//        }
//        tr+='</tr>';
//        for(var i=0; i<keys.length; i++)
//        {
//            tr+='<tr align="middle>';
//            tr+='<th class="table-items-description table-items-description-text">'+keys[i]+'</th>';
//            for(var j=0; j<values[i].length; j++)
//            {
//                tr+='<td class="row-color-gray"><div>'+values[i][j]+'</div></td>';
//            }
//            tr+='</tr>';
//        }
//        
//    }
//    
//    return tbody.append(tr);
//    
//};


var set_output_data_inputs_for_existing_table = function(outputs)
{
if(outputs.tabular_inputs_for_existing_table_static.length===0)
    return;
  var table = $('#tabular').find('.inputs-for-existing-table');
  var thead = '<thead>';
  console.log(table);
  
  //Add table heading
  thead+="<tr><th class='table-header table-header-text'>Inputs for Existing Table</th></tr>";
  
  //Add year headings
  thead+="<tr><th class='table-header-field table-header-field-title'></th>";
  
  //Keep a count of number of columns the heading stretches to
  var colspan = 1;
  
  var td,tr,sub_tr,fuel_th,sub_row_id;
  
  //Populate Static table
  //Yearly iteration in the outermost loop
  for(var i=0; i<outputs.tabular_inputs_for_existing_table_static.length; i++)
  {
      var keys = Object.keys(outputs.tabular_inputs_for_existing_table_static[i]);
      var values = Object.values(outputs.tabular_inputs_for_existing_table_static[i]);
      
      var year_id = outputs.tabular_inputs_for_existing_table_static[i]["year_id"];
      
      //Update the year heading by adding year column
      thead += "<th class='table-header-field table-header-field-title year-heading'> Year "+year_id+"</th>";
      colspan+=1;//Increment colspan
      
      
      //Update the values for static rows for the current year iteration
      for(var j=0; j<keys.length; j++)
      {
          if(keys[j]==="scenario_and_cases_row_id"||keys[j]==="year_id")
          {
              continue;
          }
          td = '<td class="row-color-gray">'+values[j]+'</td>';
          $(table).find('#'+keys[j]).append(td);
      }
  }
  thead+='</tr></thead>';
  
  $(table).find('thead').replaceWith(thead);
  $(table).find('tr:first').find('th:first').attr('colspan',colspan.toString());
  console.log("--------------------\n");
  //Get the year_id of the first row in the dynamic table for current scenario and case
  var year_prev_id = outputs.tabular_inputs_for_existing_table_dynamic[0]["year_id"];
  var sub_tr;
  
  //Populate dynamic rows
  for(var i=0; i<outputs.tabular_inputs_for_existing_table_dynamic.length; i++)
  {
      var keys = Object.keys(outputs.tabular_inputs_for_existing_table_dynamic[i]);
      var values = Object.values(outputs.tabular_inputs_for_existing_table_dynamic[i]);
      
      for(var j=0; j<keys.length; j++)
      {
          //Create new rows only when iterating through values for 1st year
          if(outputs.tabular_inputs_for_existing_table_dynamic[i]["year_id"]===year_prev_id)
          {
                if(!(keys[j]==="fueltype"||keys[j]==="year_id"))
              {
                  sub_tr_id = keys[j]+outputs.tabular_inputs_for_existing_table_dynamic[i]["fueltype"].replace(/\W/g,"");
                  sub_tr = '<tr id="'+sub_tr_id+'" class="sub-row">';
                  sub_tr+= '<th class="table-items-description table-items-description-text">'+outputs.tabular_inputs_for_existing_table_dynamic[i]["fueltype"]+'</th>';
                  sub_tr+='<td class="row-color-gray">'+values[j]+'</td></tr>';
                  $(table).find('#'+keys[j]).after(sub_tr);
              }
          }
          
          //Use the same rows created initially and append td to them
          else
          {
              if(!(keys[j]==="fueltype"||keys[j]==="year_id"))
              {
                  sub_tr_id = keys[j]+outputs.tabular_inputs_for_existing_table_dynamic[i]["fueltype"].replace(/\W/g,"");
                  td = '<td class="row-color-gray">' + values[j] +'</td>';
                  $(table).find('#'+sub_tr_id).append(td);
              }
          }
          
      }
      
      
  }
  
};

var set_output_data_co_outputs_table = function(outputs)
{
if(outputs.tabular_co_outputs_table_static.length===0)
    return;
  var table = $('#tabular').find('.co-outputs-table');
  var thead = '<thead>';
  
  //Add table heading
  thead+="<tr><th class='table-header table-header-text'>CO Outputs Table</th></tr>";
  
  //Add year headings
  thead+="<tr><th class='table-header-field table-header-field-title'></th>";
  
  //Keep a count of number of columns the heading stretches to
  var colspan = 1;
  
  var td,tr,sub_tr,fuel_th,sub_row_id;
  
  //Populate Static table
  //Yearly iteration in the outermost loop
  for(var i=0; i<outputs.tabular_co_outputs_table_static.length; i++)
  {
      var keys = Object.keys(outputs.tabular_co_outputs_table_static[i]);
      var values = Object.values(outputs.tabular_co_outputs_table_static[i]);
      
      var year_id = outputs.tabular_co_outputs_table_static[i]["year_id"];
      
      //Update the year heading by adding year column
      thead += "<th class='table-header-field table-header-field-title year-heading'> Year "+year_id+"</th>";
      colspan+=1;//Increment colspan
      
      
      //Update the values for static rows for the current year iteration
      for(var j=0; j<keys.length; j++)
      {
          if(keys[j]==="scenario_and_cases_row_id"||keys[j]==="year_id")
          {
              continue;
          }
          td = '<td class="row-color-gray">'+values[j]+'</td>';
          $(table).find('#'+keys[j]).append(td);
      }
  }
  thead+='</tr></thead>';
  
  $(table).find('thead').replaceWith(thead);
  $(table).find('tr:first').find('th:first').attr('colspan',colspan.toString());
  console.log("--------------------\n");
  //Get the year_id of the first row in the dynamic table for current scenario and case
  var year_prev_id = outputs.tabular_co_outputs_table_dynamic[0]["year_id"];
  var sub_tr;
  
  //Populate dynamic rows
  for(var i=0; i<outputs.tabular_co_outputs_table_dynamic.length; i++)
  {
      var keys = Object.keys(outputs.tabular_co_outputs_table_dynamic[i]);
      var values = Object.values(outputs.tabular_co_outputs_table_dynamic[i]);
      
      for(var j=0; j<keys.length; j++)
      {
          //Create new rows only when iterating through values for 1st year
          if(outputs.tabular_co_outputs_table_dynamic[i]["year_id"]===year_prev_id)
          {
                if(!(keys[j]==="fueltype"||keys[j]==="year_id"))
              {
                  sub_tr_id = keys[j]+outputs.tabular_co_outputs_table_dynamic[i]["fueltype"].replace(/\W/g,"");
                  sub_tr = '<tr id="'+sub_tr_id+'" class="sub-row">';
                  sub_tr+= '<th class="table-items-description table-items-description-text">'+outputs.tabular_co_outputs_table_dynamic[i]["fueltype"]+'</th>';
                  sub_tr+='<td class="row-color-gray">'+values[j]+'</td></tr>';
                  $(table).find('#'+keys[j]).after(sub_tr);
              }
          }
          
          //Use the same rows created initially and append td to them
          else
          {
              if(!(keys[j]==="fueltype"||keys[j]==="year_id"))
              {
                  sub_tr_id = keys[j]+outputs.tabular_co_outputs_table_dynamic[i]["fueltype"].replace(/\W/g,"");
                  td = '<td class="row-color-gray">' + values[j] +'</td>';
                  $(table).find('#'+sub_tr_id).append(td);
              }
          }   
      }
  }    
};

var set_output_data_pc_outputs_table = function(outputs)
{
if(outputs.tabular_pc_outputs_table_static.length===0)
    return;
  var table = $('#tabular').find('.pc-outputs-table');
  var thead = '<thead>';
  
  //Add table heading
  thead+="<tr><th class='table-header table-header-text'>PC Outputs</th></tr>";
  
  //Add year headings
  thead+="<tr><th class='table-header-field table-header-field-title'></th>";
  
  //Keep a count of number of columns the heading stretches to
  var colspan = 1;
  
  var td,tr,sub_tr,fuel_th,sub_row_id;
  
  //Populate Static table
  //Yearly iteration in the outermost loop
  for(var i=0; i<outputs.tabular_pc_outputs_table_static.length; i++)
  {
      var keys = Object.keys(outputs.tabular_pc_outputs_table_static[i]);
      var values = Object.values(outputs.tabular_pc_outputs_table_static[i]);
      
      var year_id = outputs.tabular_pc_outputs_table_static[i]["year_id"];
      
      //Update the year heading by adding year column
      thead += "<th class='table-header-field table-header-field-title year-heading'> Year "+year_id+"</th>";
      colspan+=1;//Increment colspan
      
      
      //Update the values for static rows for the current year iteration
      for(var j=0; j<keys.length; j++)
      {
          if(keys[j]==="scenario_and_cases_row_id"||keys[j]==="year_id")
          {
              continue;
          }
          td = '<td class="row-color-gray">'+values[j]+'</td>';
          $(table).find('#'+keys[j]).append(td);
      }
  }
  thead+='</tr></thead>';
  
  $(table).find('thead').replaceWith(thead);
  $(table).find('tr:first').find('th:first').attr('colspan',colspan.toString());
  console.log("--------------------\n");
  //Get the year_id of the first row in the dynamic table for current scenario and case
  var year_prev_id = outputs.tabular_pc_outputs_table_dynamic[0]["year_id"];
  var sub_tr;
  
  //Populate dynamic rows
  for(var i=0; i<outputs.tabular_pc_outputs_table_dynamic.length; i++)
  {
      var keys = Object.keys(outputs.tabular_pc_outputs_table_dynamic[i]);
      var values = Object.values(outputs.tabular_pc_outputs_table_dynamic[i]);
      
      for(var j=0; j<keys.length; j++)
      {
          //Create new rows only when iterating through values for 1st year
          if(outputs.tabular_pc_outputs_table_dynamic[i]["year_id"]===year_prev_id)
          {
                if(!(keys[j]==="fueltype"||keys[j]==="year_id"))
              {
                  sub_tr_id = keys[j]+outputs.tabular_pc_outputs_table_dynamic[i]["fueltype"].replace(/\W/g,"");
                  sub_tr = '<tr id="'+sub_tr_id+'" class="sub-row">';
                  sub_tr+= '<th class="table-items-description table-items-description-text">'+outputs.tabular_pc_outputs_table_dynamic[i]["fueltype"]+'</th>';
                  sub_tr+='<td class="row-color-gray">'+values[j]+'</td></tr>';
                  $(table).find('#'+keys[j]).after(sub_tr);
              }
          }
          
          //Use the same rows created initially and append td to them
          else
          {
              if(!(keys[j]==="fueltype"||keys[j]==="year_id"))
              {
                  sub_tr_id = keys[j]+outputs.tabular_pc_outputs_table_dynamic[i]["fueltype"].replace(/\W/g,"");
                  td = '<td class="row-color-gray">' + values[j] +'</td>';
                  $(table).find('#'+sub_tr_id).append(td);
              }
          }
          
      }
      
      
  }
};

var set_output_data_pc_metrics_table = function(outputs)
{

if(outputs.pc_metrics_table.length===0)
    return;
var table = $('#outputs #pcmetrics').find('.pc-metrics-table');
var thead = '<thead>';

//Add table heading
thead+="<tr><th class='table-header table-header-text'>Production Cost Metrics</th></tr>";

//Add year headings
thead+="<tr><th class='table-header-field table-header-field-title'></th>";

//Keep a count of number of columns the heading stretches to
var colspan = 1;

var td,tr,sub_tr,fuel_th,sub_row_id,year_id,year_prev_id;

//Get the year_id of the first row in the dynamic table for current scenario and case
var year_0 = outputs.pc_metrics_table[0]["year_id"];
var year_prev_id = -1;
var sub_tr;

//Populate dynamic rows
for(var i=outputs.pc_metrics_table.length-1; i>=0; i--)
{
    var keys = Object.keys(outputs.pc_metrics_table[i]);
    var values = Object.values(outputs.pc_metrics_table[i]);
    year_id = outputs.pc_metrics_table[i]["year_id"];
    if(year_prev_id!==year_id)
    {
      //Update the year heading by adding year column
      thead += "<th class='table-header-field table-header-field-title year-heading'> Year "+year_id+"</th>";
      colspan+=1;//Increment colspan
      year_prev_id=year_id;
    }
    
    for(var j=0; j<keys.length; j++)
    {
        //Create new rows only when iterating through values for 1st year
        if(outputs.pc_metrics_table[i]["year_id"]===year_0)
        {
              if(!(keys[j]==="generator"||keys[j]==="year_id"))
            {
                sub_tr_id = keys[j]+outputs.pc_metrics_table[i]["generator"].replace(/\W/g,"");
                sub_tr = '<tr id="pcmetrics_'+sub_tr_id+'" class="sub-row">';
                sub_tr+= '<th class="table-items-description table-items-description-text">'+outputs.pc_metrics_table[i]["generator"]+'</th>';
                sub_tr+='<td class="row-color-gray">'+roundNumber(values[j])+'</td></tr>';
                $(table).find('#pcmetrics_'+keys[j]).after(sub_tr);
            }
        }
        
        //Use the same rows created initially and append td to them
        else
        {
            if(!(keys[j]==="generator"||keys[j]==="year_id"))
            {
                sub_tr_id = keys[j]+outputs.pc_metrics_table[i]["generator"].replace(/\W/g,"");
                td = '<td class="row-color-gray">' + roundNumber(values[j]) +'</td>';
                $(table).find('#pcmetrics_'+sub_tr_id).append(td);
            }
        }
        
    }
}

thead+='</tr></thead>';
$(table).find('thead').replaceWith(thead);
$(table).find('tr:first').find('th:first').attr('colspan',colspan.toString());

};

var set_output_data_pc_metrics_noess_table = function(outputs)
{
if(outputs.pc_metrics_noess_table.length===0)
    return;
var table = $('#outputs_noess #pcmetricsnoess').find('.pc-metrics-noess-table');
var thead = '<thead>';

//Add table heading
thead+="<tr><th class='table-header table-header-text'>Production Cost Metrics</th></tr>";

//Add year headings
thead+="<tr><th class='table-header-field table-header-field-title'></th>";

//Keep a count of number of columns the heading stretches to
var colspan = 1;

var td,tr,sub_tr,fuel_th,sub_row_id,year_id,year_prev_id;

//Get the year_id of the first row in the dynamic table for current scenario and case
var year_0 = outputs.pc_metrics_noess_table[0]["year_id"];
var year_prev_id = -1;
var sub_tr;

//Populate dynamic rows
for(var i=outputs.pc_metrics_noess_table.length-1; i>=0; i--)
{
    var keys = Object.keys(outputs.pc_metrics_noess_table[i]);
    var values = Object.values(outputs.pc_metrics_noess_table[i]);
    year_id = outputs.pc_metrics_noess_table[i]["year_id"];
    if(year_prev_id!==year_id)
    {
      //Update the year heading by adding year column
      thead += "<th class='table-header-field table-header-field-title year-heading'> Year "+year_id+"</th>";
      colspan+=1;//Increment colspan
      year_prev_id=year_id;
    }
    
    for(var j=0; j<keys.length; j++)
    {
        //Create new rows only when iterating through values for 1st year
        if(outputs.pc_metrics_noess_table[i]["year_id"]===year_0)
        {
              if(!(keys[j]==="generator"||keys[j]==="year_id"))
            {
                sub_tr_id = keys[j]+outputs.pc_metrics_noess_table[i]["generator"].replace(/\W/g,"");
                sub_tr = '<tr id="pcmetricsnoess_'+sub_tr_id+'" class="sub-row">';
                sub_tr+= '<th class="table-items-description table-items-description-text">'+outputs.pc_metrics_noess_table[i]["generator"]+'</th>';
                sub_tr+='<td class="row-color-gray">'+roundNumber(values[j])+'</td></tr>';
                $(table).find('#pcmetricsnoess_'+keys[j]).after(sub_tr);
            }
        }
        
        //Use the same rows created initially and append td to them
          else
          {
              if(!(keys[j]==="generator"||keys[j]==="year_id"))
              {
                  sub_tr_id = keys[j]+outputs.pc_metrics_noess_table[i]["generator"].replace(/\W/g,"");
                  td = '<td class="row-color-gray">' + roundNumber(values[j]) +'</td>';
                  $(table).find('#pcmetricsnoess_'+sub_tr_id).append(td);
              }
          }
          
      }
  }
  
  thead+='</tr></thead>';
  $(table).find('thead').replaceWith(thead);
  $(table).find('tr:first').find('th:first').attr('colspan',colspan.toString());
 };
 
 var roundNumber = function(value)
 {
   if(value.split(".")[0].length>2)
   {
       return value.split(".")[0];
   }
   else if(value.split(".")[0].length===2)
   {
       value = value.split(".")[0]+"."+value.split(".")[1].slice(0,2);
       return value
   }
   else if(value.split(".")[0].length===1)
   {
       value = value.split(".")[0]+"."+value.split(".")[1].slice(0,3);
       return value;
   }
   else
   {
       value = value.split(".")[0]+"."+value.split(".")[1].slice(0,4);
       return value;
   }
 };