/*
 * Copyright 2018 Acelerex Inc.
 */
$(document).ready(function () {
    var index = 1;
    fuelOptions = ['Biomass',
        'Natural Gas',
        'Compressed Natural Gas (CNG)',
        'Liquefied Natural Gas (LNG)',
        'Landfill Gas (LFG)',
        'Oil',
        'Heavy Fuel Oil (HFO)',
        'Light Fuel Oil (LFO)',
        'Jet Fuel',
        'Residual Fuel Oil (RFO)',
        'Distillate Fuel Oil (DFO)',
        'Coal',
        'Uranium'];

    unitOptions = ['Base',
        'Peaker'];


    //include functionality to add fuel
    $('#cap-by-fuel-dynamic, #fuelprice-forecast-dynamic, #tech-capital-dynamic').unbind("click").on('click', '.btn-add', function (e) {
        e.preventDefault();
        console.log('add Thermal Generation');
        var controlForm = $('#cap-by-fuel-dynamic tbody tr:first');
        addThermGen($('#cap-by-fuel-dynamic tbody .entry:first .btn-add'), controlForm,index);
        console.log('add Fuel Price Generation');
        var controlForm = $('#fuelprice-forecast-dynamic tbody tr:first');
        addThermGen($('#fuelprice-forecast-dynamic tbody .entry:first .btn-add'), controlForm,index);
        console.log('add Tech Capital');
        var controlForm = $('#tech-capital-dynamic tbody tr:first');
        addThermGen($('#tech-capital-dynamic tbody .entry:first .btn-add'), controlForm,index);
        index++;
    }).on('click', '.btn-remove', function (e) {        
        var rowIndex = $(this).data('index');
        var remElement = $('#cap-by-fuel-dynamic').find('[data-index="'+rowIndex+'"]');
        remElement.parents('tr:first').remove();
        var remElement = $('#fuelprice-forecast-dynamic').find('[data-index="'+rowIndex+'"]');
        remElement.parents('tr:first').remove();
        var remElement = $('#tech-capital-dynamic').find('[data-index="'+rowIndex+'"]');
        remElement.parents('tr:first').remove();
        updateCapbyFuelChart('generation-cap-fuel');
        e.preventDefault();
        return false;
    });
    
//Select options for thermal gen table
    var $sel = $('#cap-by-fuel-dynamic .unit-options');
    updateThermSelection($sel, unitOptions);
    

    var sel = $('#cap-by-fuel-dynamic').find(".fuel-options");
    updateThermSelection(sel,fuelOptions);
    var option = sel.find("option");
    for(var i = 0; i < sel.length;i++)
    {
       $(sel[i]).val($(option[i]).val());
    }
    
    //Selection for Fuel Price table
    var $sel = $('#fuelprice-forecast-dynamic .unit-options');
    updateThermSelection($sel, unitOptions);
    

    var sel = $('#fuelprice-forecast-dynamic').find(".fuel-options");
    updateThermSelection(sel,fuelOptions);
    var option = sel.find("option");
    for(var i = 0; i < sel.length;i++)
    {
       $(sel[i]).val($(option[i]).val());
    }
    
    //Selection for tech capital table
    var $sel = $('#tech-capital-dynamic .unit-options');
    updateThermSelection($sel, unitOptions);
    

    var sel = $('#tech-capital-dynamic').find(".fuel-options");
    updateThermSelection(sel,fuelOptions);
    var option = sel.find("option");
    for(var i = 0; i < sel.length;i++)
    {
       $(sel[i]).val($(option[i]).val());
    }
});

//update this logic
function updateThermSelection(element, opts)
{
    element.empty();
    for (var k = 0; k < opts.length; k++)
    {
         element.append('<option>' + opts[k] +'</option>');
    }
    return opts[opts.length - 1];

}

function addThermGen(element,controlForm,index) {
    //console.log(element)
    var currentEntry = element.parents('.entry:first');
 
    var newEntry = $(currentEntry.clone()).appendTo(controlForm.parents('tbody'));
    newEntry.find('input').val('0.0');


    newEntry.find('td span.remove-btn')
        .html('<span class="input-group-btn"><a class="btn-remove btn btn-primary" type="button" data-index="'+index+'"><span class="glyphicon glyphicon-minus"></span></a></span>');

}
