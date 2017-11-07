$(function(){
   $(".agreement ul li:not(.del)").on("click",function(){
        var pay = $(this).text();
        $(".pay_box ul li").each(function(i){
            if(!$(this).attr("data-number")){
                $(".pay_box ul li").eq(i).attr("data-number",pay);
                $(".pay_box ul li").eq(i).html(pay);
                setTimeout(function(){
                    $(".pay_box ul li").eq(i).html("<span></span>");
                    var m = $(".pay_box ul li").eq(i).attr("data-number");
                },500);
                return false;
            }
        })
        
    });
   
    
    $(".del").on("click",function(){
        $(".pay_box ul li").html("");
        $(".pay_box ul li").attr("data-number","");
    });
    
    
    
    
  
    $(".pay_input").on("blur",function(){
        console.log($(this).val());
    });
})
    
