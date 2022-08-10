/* 
 * SHIELDtech index.js
 * v0.0
 * 
 * Latest version: 
 *
 * build x.x.0:
 *
 * NOTE: Remember conventions and always error-proof your code.
 *		  - Watch this video: https://www.youtube.com/watch?v=_EANG8ZZbRs
 *        - Use http://www.jslint.com/
 */

function gmcreate() {
	function initialize() {

		var fetched_location = new google.maps.LatLng(40.8654094, -74.195979);
		
		var mapOptions = {
			zoom: 18,
			center: fetched_location,
			scrollwheel: false,
		};

		var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		
		var marker = new google.maps.Marker({
			position: fetched_location,
			map: map,
			title: 'distress location'
		});

	}
	google.maps.event.addDomListener(window, 'load', initialize);
}

$(document).ready(function($) {

	gmcreate();

	
});
