$(document).ready(function(){

/**********************************
 
 Expanding and contracting the accorditons 
 
 ************************************/
    $( ".preview" ).click(function() {
	  
	      var start = true;
		  if(start == true)
		  {
	         
			 $( ".allAccordions" ).toggleClass("expandAccordion",1000);
	         $( ".expandAccordion" ).toggleClass("allAccordions",1000);
	         
		  }
		 
	  
    });
});	