$(function(){
    /*交易管理选项卡*/
    $(".account_tab_l ul li").on("click",function(){
        $(".account_tab_l ul li").removeClass("tab_active");
        $(this).addClass("tab_active");
        $(".transaction_query").hide();
        $(".transaction_query:eq('"+$(this).index()+"')").show();
        
    });
    
    /*删除*/
    $(".is_account_del").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".ngp_pop_three").show();
    });
    $(".ngp_pop_three em").on("click",function(){
        $("#cover").hide();
        $(".ngp_pop_three").hide();
    });
     
    /*重发邮件*/
    $(".js_account_email").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".account_pop").show();
    });
     $(".account_pop em,.ngp_pop_btn").on("click",function(){
        $("#cover").hide();
        $(".account_pop").hide();
        $(".ngp_pop_three").hide();
    });
})