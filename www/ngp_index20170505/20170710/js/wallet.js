$(function(){
    /*充值选项卡*/
    $(".wallet_tab_l ul li").on("click",function(){
        $(".wallet_tab_l ul li").removeClass("tab_active");
        $(this).addClass("tab_active");
        $(".transaction_query").hide();
        $(".transaction_query:eq('"+$(this).index()+"')").show();
        
    });
})