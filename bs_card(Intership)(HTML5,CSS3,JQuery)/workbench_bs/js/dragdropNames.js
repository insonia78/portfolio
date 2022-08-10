$(document).ready(function(event) {
  
 
 
 $(".companyName").mouseover(function(event){
     
 id = $(".companyName");	 
     
	         id.addClass("addBorder")
      
	 id.click(function(event){
	      
		 id.toggleClass("addBorder")
		  id.draggable({
		   
             containment :"parent"
		});
    });
  });
  $(".companyName").mouseout(function(){
         $(".companyName" ).removeClass("addBorder");
   });
   
  $(".companyMessage").mouseover(function(event){    
	 $(".companyMessage").addClass("addBorder");
	
	$( ".companyMessage" ).click(function(event){
	      $( ".companyMessage" ).draggable({
		   
             containment :"parent"
		});
    });
});
$(".companyMessage").mouseout(function(){
         $(".companyMessage" ).removeClass("addBorder")
   });
   
  $(".fullName").mouseover(function(event){    
	 $(".fullName").addClass("addBorder"); 
	$( ".fullName" ).click(function(event){
	      $( ".fullName" ).draggable({
		   
             containment :"parent"
		});
    });
	});
	$(".fullName").mouseout(function(){
         $(".fullName" ).removeClass("addBorder")
   });
   
 $(".jobTitle").mouseover(function(event){    
	 $(".jobTitle").addClass("addBorder");
	$( ".jobTitle" ).click(function(event){
	      $( ".jobTitle" ).draggable({
		   
             containment :"parent"
		});
    });
	});
	$(".jobTitle").mouseout(function(){
         $(".jobTitle" ).removeClass("addBorder")
   });
   
 $(".address1").mouseover(function(event){    
	 $(".address1").addClass("addBorder");  
	$( ".address1" ).click(function(event){
	      $( ".address1" ).draggable({
		   
             containment :"parent"
		});
    });
 });
	$(".address1").mouseout(function(){
         $(".address1" ).removeClass("addBorder")
   });
   
 $(".address2").mouseover(function(event){    
	 $(".address2").addClass("addBorder");  
	$( ".address2" ).click(function(event){
	      $( ".address2" ).draggable({
		   
             containment :"parent"
		});
    });
  });
  $(".address2").mouseout(function(){
         $(".address2" ).removeClass("addBorder")
   });
   
 $(".phone").mouseover(function(event){    
	 $(".phone").addClass("addBorder"); 
	$( ".phone" ).click(function(event){
	      $( ".phone" ).draggable({
		   
             containment :"parent"
		});
    });
});
	
	$(".phone").mouseout(function(){
         $(".phone" ).removeClass("addBorder")
   });
   
   
 $(".email").mouseover(function(event){    
	 $(".email").addClass("addBorder");  
	$( ".email" ).click(function(event){
	      $( ".email" ).draggable({
		   
             containment :"parent"
		});
    });
 });
$(".email").mouseout(function(){
         $(".email" ).removeClass("addBorder")
   });
   $(".web").mouseover(function(event){    
	 $(".web").addClass("addBorder");  
	$( ".web" ).click(function(event){
	      $( ".web" ).draggable({
		   
             containment :"parent"
		});
    });
 });
$(".web").mouseout(function(){
         $(".web" ).removeClass("addBorder")
   });
   $("#image-container").mouseover(function(event){    
	 $(".image").addClass("addBorder");
	 $( "#image-container" ).on("click",function(event){
             
			     $('#image-container').resizable({
				 
				 
				 containment :"parent"
				 
				 }); 
				 
	          $('#image-container').draggable({
		   
                containment :"parent"
		  });
	  });
	
 });
 $("#image-container").mouseout(function(){
         $(".image").removeClass("addBorder")
		 $("#image-container").off("click");
   });
   
   
  /*
     Back sidebar of the card
	 */  
   
   $(".backName").mouseover(function(event){    
	 $(".backName").addClass("addBorder");  
	$( ".backName" ).click(function(event){
	      $( ".backName" ).draggable({
		   
             containment :"parent"
		});
    });
 });
$(".backName").mouseout(function(){
         $(".backName" ).removeClass("addBorder")
   });
   
   $(".backName2").mouseover(function(event){    
	 $(".backName2").addClass("addBorder");  
	$( ".backName2" ).click(function(event){
	      $( ".backName2" ).draggable({
		   
             containment :"parent"
		});
    });
 });
$(".backName2").mouseout(function(){
         $(".backName2" ).removeClass("addBorder")
   });
   
   
  $(".backName3").mouseover(function(event){    
	 $(".backName3").addClass("addBorder");  
	$( ".backName3" ).click(function(event){
	      $( ".backName3" ).draggable({
		   
             containment :"parent"
		});
    });
 });
$(".backName3").mouseout(function(){
         $(".backName3" ).removeClass("addBorder")
   }); 
   
   
   
  /////////////////////////////////////////////////////////////////////////////////// 
   
   $( document ).tooltip({
      position: {
         my: "center bottom-20",
        at: "center top",
        using: function( position, feedback ) {
          $( this ).css( position );
          $( "<div>" )
            .addClass( "arrow" )
            .addClass( feedback.vertical )
            .addClass( feedback.horizontal )
			
            .appendTo( this );
        }
      }
    });
	
	///////////////////////////////////////////////////////////
	
 $(".myCanvasBackDemo").mouseover(function(event){    
	 $(".myCanvasBackDemo").addClass("togleFrontBack");  
	$( ".innerLineBackDemo" ).click(function(event){
		
	    $(".innerLine").addClass("hidden");
        $(".innerLineBack").addClass('show');		
    });
 });
$(".myCanvasBackDemo").mouseout(function(){
         $(".myCanvasBackDemo" ).removeClass("togleFrontBack")
   }); 
   
  $(".myCanvasFrontDemo").mouseover(function(event){    
	 $(".myCanvasFrontDemo").addClass("togleFrontBack");  
	$( ".myCanvasFrontDemo" ).click(function(event){
	      
		  $(".innerLine").removeClass("hidden");
        $(".innerLineBack").removeClass('show');
		  
    });
 });
$(".myCanvasFrontDemo").mouseout(function(){
         $(".myCanvasFrontDemo" ).removeClass("togleFrontBack")
   }); 
   
$(".checkbox").mouseover(function(event){    
	   
	$( ".checkbox" ).click(function(event){
	      
		  $(".checkbox").toggleClass("checked");
          $("#image-container").toggleClass("hidden");       
		  
    });
 });
 function readfiles(files) {
  for (var i = 0; i < files.length; i++) {
  
    
    
    
    var blob = new Blob([files[0]],{type: 'multipart/form-data'});
	var url = URL.createObjectURL(blob); //reader.readAsDataURL(files[i]);
	document.getElementById('image').src = url;
  }
}	
var holder = document.getElementById('holder');
holder.ondragover = function () { this.className = 'hover'; return false; };
holder.ondragend = function () { this.className = ''; return false; };
holder.ondrop = function (e) {
  this.className = '';
  e.preventDefault();
  readfiles(e.dataTransfer.files);
} 

   
 
});