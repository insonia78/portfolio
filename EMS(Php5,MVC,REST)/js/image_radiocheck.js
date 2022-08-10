/* 
 *Author: R G senthilkumar 
 *Website: www.senthildesigner.co.nr
 */
(function ( $ ) {

    $.fn.radio_check = function(options) {
		
	//add-sales
		   $('.radio .radio-img').click(function() {
                var pname = $('.radio .radio-img').removeAttr("style");
                $(this).css("background-position","24px -4px");
                $(this).prevAll('input').prop('checked',true);
            });
			
            $('.radio .radio-img1').click(function() {
                var pname = $('.radio .radio-img1').removeAttr("style");
                $(this).css("background-position","18px -1px");
                $(this).prevAll('input').prop('checked',true);
            });
			
    // login - settings - profile - addmaintaince
       
	    $('.check .check-img, .check .check-img1, .check .check-img2, .check .check-img3').click(function() {   
                var rdcheck = $(this).prevAll('input').prop('checked');
    
                if(rdcheck==false)
                {
                    $(this).css("background-position","24px -4px");
                    $(this).prevAll('input').prop('checked',true);
     return false;
                }
                else
                {
                    $(this).removeAttr("style");
                    $(this).prevAll('input').prop('checked',false);
     return false;
                }
            });
			
	
			
		
	   
	   
   };
 
}( jQuery ));