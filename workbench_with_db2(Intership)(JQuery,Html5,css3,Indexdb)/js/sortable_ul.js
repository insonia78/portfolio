$(document).ready(function() {
	
   
    
   
    $( "ul.document" ).sortable({
      connectWith: ".document",
      dropOnEmpty: true
    }).disableSelection();;
	
	 $( "ul.link" ).sortable({
      connectWith: ".link",
	  dropOnEmpty: true
	  	  
    }).disableSelection(); 
    
  });
  $(document).ready(function(){
	  $( "#Internet_links" ).resizable({
      containment: "#link_container"
    });
  });