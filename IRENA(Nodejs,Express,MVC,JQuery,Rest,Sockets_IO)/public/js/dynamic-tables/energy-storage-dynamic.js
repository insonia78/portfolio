$(function () {
    var index=0;
  StorageOptions = ['Compressed Air',
      'Flow Battery',
      'Sodium-Sulphur Battery',
      'Lithium Ion',
      'Sodium-Nickel Chloride Battery',
      'Lead Acid',
      'Nickel-Cadmium Battery',
      'Nickel-Metal Hydride battery',
      'Flywheel',
      'High Power Supercapacitors',
      'Thermal Storage',
      'Pumped Hydro',
      'Short',
      'Medium Short',
      'Medium Long',
      'Long'];
  durationOptions = ['0.5','1','2','4'];
    //include functionality to add fuel
    $('#energy-storage-dynamic-table, #energy-storage-cost-dynamic-table').unbind("click").on('click', '.btn-add', function (e) {
        e.preventDefault();
        var controlForm = $('#energy-storage-dynamic-table tbody tr:first');
        addESGen($('#energy-storage-dynamic-table tbody .entry:first .btn-add'), controlForm,index);
        var controlForm = $('#energy-storage-cost-dynamic-table tbody tr:first');
        addESGen($('#energy-storage-cost-dynamic-table tbody .entry:first .btn-add'), controlForm,index); 
    }).on('click', '.btn-remove', function (e) {
        var rowIndex = $(this).data('index');
        var remElement = $('#energy-storage-dynamic-table').find('[data-index="'+rowIndex+'"]');
        remElement.parents('tr:first').remove();
        var remElement = $('#energy-storage-cost-dynamic-table').find('[data-index="'+rowIndex+'"]');
        remElement.parents('tr:first').remove();
        $(this).parents('.entry:first').remove();
        e.preventDefault();
        return false;
    });
    
    var sel = $('#energy-storage-dynamic-table').find('.duration-options');
    updateESSelection(sel,durationOptions);
//Select options for thermal gen table
    var sel = $('#energy-storage-dynamic-table').find(".storage-options");
    updateESSelection(sel,StorageOptions);
    var option = sel.find("option");
    for(var i = 0; i < sel.length;i++)
    {
       $(sel[i]).val($(option[i]).val());
    }
    
    var sel = $('#energy-storage-cost-dynamic-table').find('.duration-options');
    updateESSelection(sel,durationOptions);
//Select options for thermal gen table
    var sel = $('#energy-storage-cost-dynamic-table').find(".storage-options");
    updateESSelection(sel,StorageOptions);
    var option = sel.find("option");
    for(var i = 0; i < sel.length;i++)
    {
       $(sel[i]).val($(option[i]).val());
    }
});


function updateESSelection(element, opts)
{
    element.empty();
    for (var k = 0; k < opts.length; k++)
    {
         element.append('<option>' + opts[k] +'</option>');
    }
    return opts[opts.length - 1];

}

function addESGen(element,controlForm,index) {
    //console.log(element)
    var currentEntry = element.parents('.entry:first');
    var newEntry = $(currentEntry.clone()).appendTo(controlForm.parents('tbody'));

    newEntry.find('input').val('0.0');
    
    newEntry.find('td span.remove-btn',element)
        .html('<span class="input-group-btn"><a class="btn-remove btn btn-primary" type="button" data-index="'+index+'"><span class="glyphicon glyphicon-minus"></span></a></span>');
    
}
