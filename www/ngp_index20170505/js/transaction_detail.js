$(function(){
    $(".detail_refund_btn").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".ngp_pop_two").show();
    });
    $(".ngp_pop_two em").on("click",function(){
        $("#cover").hide();
        $(".ngp_pop_two").hide();
    });
})