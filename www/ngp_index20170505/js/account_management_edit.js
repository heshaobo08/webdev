$(function(){
    /*删除*/
    $(".account_management_add em").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".ngp_pop_three").show();
    });
    $(".ngp_pop_three em").on("click",function(){
        $("#cover").hide();
        $(".ngp_pop_three").hide();
    });
})