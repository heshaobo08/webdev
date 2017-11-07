$(function(){
    /*选择银行*/
    $(".other_bank_list ul li").on("click",function(){
         $(this).siblings().removeClass("other_ative");
         $(this).addClass("other_ative");
         $(".bank_list_qu").hide();
         $(".bank_list_qu:eq('"+ $(this).index()+"')").show();
    });
    
    /*鼠标移到银行卡列表上的状态*/
    $(".bank_list_qu ul li").mouseenter(function(){
        $(this).find("p").slideDown();
        $(this).find("em").slideDown();
    });
    $(".bank_list_qu ul li").mouseleave(function(){
         $(".bank_list_qu ul li").find("p").slideUp();
         $(".bank_list_qu ul li").find("em").slideUp();
    });
    
    $(".other_bank").on("click",function(){
        $(this).hide();
        $(".other_bank_box").show();
    });
})