//$(function () {
//
//  StorageOptions = ['Select Storage Type',
//      'Compressed Air',
//      'Flow Battery',
//      'Sodium-Sulphur Battery',
//      'Lithium Ion',
//      'Sodium-Nickel Chloride Battery',
//      'Lead Acid',
//      'Nickel-Cadmium Battery',
//      'Nickel-Metal Hydride battery',
//      'Flywheel',
//      'High Power Supercapacitors',
//      'Thermal Storage',
//      'Pumped Hydro',
//      'Short',
//      'Medium Short',
//      'Medium Long',
//      'Long'];
//
//
//    //include functionality to add fuel
//    $('#energy-storage-cost-dynamic-table').unbind("click").on('click', '.btn-add', function (e) {
//        e.preventDefault();
//        console.log('add Generator');
//        var controlForm = $('#energy-storage-cost-dynamic-table tbody tr:first');
//        addESCostGen($(this), controlForm);
//    }).on('click', '.btn-remove', function (e) {
//        $(this).parents('.entry:first').remove();
//        e.preventDefault();
//        return false;
//    });
//
////Select options for thermal gen table
//    var sel = $('#energy-storage-cost-dynamic-table').find(".storage-options");
//
//    updateESCostSelection(sel,StorageOptions);
//    var option = sel.find("option");
//    for(var i = 0; i < sel.length;i++)
//    {
//       $(sel[i]).val($(option[i]).val());
//    }
//});
//
//
//function updateESCostSelection(element, opts)
//{
//    element.empty();
//    for (var k = 0; k < opts.length; k++)
//    {
//         element.append('<option>' + opts[k] +'</option>');
//    }
//    return opts[opts.length - 1];
//}
//
//function addESCostGen(element,controlForm) {
//    //console.log(element)
//    var currentEntry = element.parents('.entry:first');
//    var newEntry = $(currentEntry.clone()).appendTo(controlForm.parents('tbody'));
//
//    newEntry.find('input').val('0');
//    newEntry.find('td span.remove-btn',element)
//        .html('<span class="input-group-btn"><a class="btn-remove btn btn-primary" type="button"><span class="glyphicon glyphicon-minus"></span></a></span>');
///*
//    currentEntry.find('td span .btn-add',element)
//        .removeClass('btn-add').addClass('btn-remove')
//        .removeClass('btn-primary').addClass('btn-default')
//        .html('<span class="glyphicon glyphicon-minus"></span>');
//*/
//    newEntry.find('.storage-options',element).change(function () {
//        //console.log('test1111' + $(this).val());
//        console.log(StorageOptions[$(this).val()]);
//    })
//}
