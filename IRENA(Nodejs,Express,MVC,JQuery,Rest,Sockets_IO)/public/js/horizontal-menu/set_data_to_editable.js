/*
 * Copyright 2018 Acelerex Inc.
 */
var set_data_to_editable_country = function()
{
    $('#country').attr("disabled", false);
};
// new tables
var set_data_to_editable_programs_renewables_tables = function()
{
    var tbody = $(".programs-renewables-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var i = 0; i < children.length;i++)
        {
            $(children[i]).attr("disabled", true);
        }
    }
    
    

};
var set_data_to_editable_programs_planning_criteria_table = function()
{
    var tbody = $(".programs-planning-criteria-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var i = 0; i < children.length;i++)
        {
            $(children[i]).attr("disabled", true);
        }
    }
};
var set_data_to_editable_programs_demand_side_table = function()
{
    var tbody = $(".programs-demand-side-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var i = 0; i < children.length;i++)
        {
            $(children[i]).attr("disabled", true);
        }
    }
};

var set_data_to_editable_demand_table = function()
{
    var tbody = $(".demand-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var i = 0; i < children.length;i++)
        {
            $(children[i]).attr("disabled", true);
        }
    }
};
var set_data_to_editable_generation_conventional_table = function()
{
    var tbody = $(".generation-conventional-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var i = 0; i < children.length;i++)
        {
            $(children[i]).attr("disabled", true);
        }
    }
};
var set_data_to_editable_generation_renewables_table = function()
{
    
    var tbody = $(".generation-renewables-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {        
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length; y++)
        {  
           $(children[i]).attr("disabled", true);                        
        }
    }
};
var set_data_to_editable_generation_hydro_table = function()
{
    var tbody = $(".generation-hydro-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var i = 0; i < children.length;i++)
        {
            $(children[i]).attr("disabled", true);
        }
    }
};


var set_data_to_editable_hydro_monthly_energy_table = function()
{
    var tbody = $(".hydro-monthly-energy-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var i = 0; i < children.length;i++)
        {
            $(children[i]).attr("disabled", true);
        }
    }
};
var set_data_to_editable_energy_storage_dynamic_table = function()
{
    var tbody = $(".energy-storage-dynamic-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var i = 0; i < children.length;i++)
        {
            $(children[i]).attr("disabled", true);
        }
    }
};