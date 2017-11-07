$(function(){
   /*返回修改*/
    $(".customs_back").on("click",function(){
        $('#cover').height($(document).height());
        $("#cover").show();
        $(".customs_pop_one").show();
        $(".customs_pop_box span").html("您确定要提交吗？")
        $("html,body").animate({scrollTop:0},500);
    });
    $(".customs_pop_one em,.customs_pop_btn").on("click",function(){
        $("#cover").hide();
        $(".customs_pop_one").hide();
    });
    
    /*确认提交*/
    $(".customs_btn_q").on("click",function(){
         $('#cover').height($(document).height());
        $("#cover").show();
        $(".customs_pop_one").show();
        $(".customs_pop_box span").html("您确定要返回修改吗？")
        $("html,body").animate({scrollTop:0},500);
    });
    
})