$(document).ready(function(){

/********************************


iframe preview 


******************************************/
$(".size").find(".column").mouseenter(function(){

 
 var portlet = $(".portlet");
 var li = $("li");
  portlet.mouseover(function(){
    var present = $(this);
  present.addClass("highlight");
    present.click(function(){
	   
	  present.addClass("selected");
	  
	  
	  
	  li.click(function(){
	  
	 
	  present.removeClass("selected");
	  
	  
	  });
	
	});
	
   $(this).dblclick(function(){
   
    $(this).removeClass("selected");
	

    });
	  	
	
  });
  portlet.mouseout(function(){
  
    $(this).removeClass("highlight");
  
  });
  
  var document ;
   
  li.mouseover(function(){
     var link = $(this);
	   
    var a = link.children("div").attr("value");
    var id = link.children("div").attr("id");	 
	
	
	document = window.open( a , "", "width = 200", "height = 500") ;
									           
											  document.moveTo( 800 , 500 ); 
											  document.resizeTo( 500 , 600 );
	
	/*
    document = window.open(a);
	document.moveTo( 500 , 800 );
	document.resizeTo( 750, 1500 );
	 */
	 /***************************
	 
	  sending info to helpertabs.html
	 
	 *************************/
	 
	  $(".size").find(link).click(function(){
		  
	  //window.location.href= "workBench.html?document=" + a + "&id=" + id ;
	  
	  
	  });
       	  
		
		
	
	 
	});

	
	 
	 li.mouseout(function(){
	 document.close();
	  
	  
	 
	 });
  });
}); 
 
 


