$(function(){
  
    $(".transfer_btn").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".ngp_pop_four").show();
    });
    $(".ngp_pop_four em").on("click",function(){
        $("#cover").hide();
        $(".ngp_pop_four").hide();
    });
    
    $(".upload_btn").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".ngp_pop_sex").show();
    });
    $(".ngp_pop_sex em").on("click",function(){
        $("#cover").hide();
        $(".ngp_pop_sex").hide();
    });
    
    
})