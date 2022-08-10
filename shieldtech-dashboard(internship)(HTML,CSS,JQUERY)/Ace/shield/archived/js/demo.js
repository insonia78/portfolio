// demo jQuery testing

$(document).ready(function($) {

	$('#dashboard').on("click", function() {
		$('#map-canvas').hide();
	});


	$('#alerts-ongoing').on("click", function() {
		$('#map-canvas').show();
	});
	
	
});


