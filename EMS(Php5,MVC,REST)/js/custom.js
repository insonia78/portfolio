$(document).ready(function() {
	
	// ------ PLUGINS ------- //
	// - dataTables
	if($('.dataTable').length > 0){
		$('.dataTable').each(function(e){
			var opt = {
				"sPaginationType": "bootstrap",
					"oLanguage":{
						"sSearch": "",
						"sLengthMenu": "Limit: _MENU_"
					}
			};
			if($(this).hasClass("dataTable-noheader")){
				opt.bFilter = false;
				opt.bLengthChange = false;
			}
			if($(this).hasClass("dataTable-nofooter")){
				opt.bInfo = false;
				opt.bPaginate = false;
			}
			if($(this).hasClass("dataTable-nosort")){
				var column = $(this).data('nosort');
				opt.aoColumnDefs =  [
	          		{ 'bSortable': false, 'aTargets': [ column ] }
	      		];
			}
			$(this).dataTable(opt);
			$('.dataTables_filter input').attr("placeholder", "Search here...");
			$('.dataTables_length select').attr("class", "uniform");
		});
	}
	
	
	
});