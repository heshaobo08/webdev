$(function(){
    /*选项卡*/
    $(".account_tab_l ul li").on("click",function(){
        $(".account_tab_l ul li").removeClass("tab_active");
        $(this).addClass("tab_active");
        $(".transaction_query").hide();
        $(".transaction_query:eq('"+$(this).index()+"')").show();
        
    });
    
    $(".sign_look_btn").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".ngp_pop_sign").show();
        $("html,body").animate({scrollTop:0},500);
    });
    
    $(".ngp_pop_hd em").on("click",function(){
        $("#cover").hide();
        $(".ngp_pop_sign").hide();
    })
    
    //确认提交
    $(".ngp_pop_btn").on("click",function(){
        $("#cover").hide();
        $(".ngp_pop_sign").hide();
    })
    
})