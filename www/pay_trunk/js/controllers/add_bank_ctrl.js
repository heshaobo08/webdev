/**
 * 添加银行卡
 * author shaobo
 * **/
require(['jquery','hasher','routeService','utils'],function($,hasher,routeService,utils){
    
    //设置cookie
    utils.setCookie("","");
    
    //获取cookie
    utils.getCookie("");
    
	/*阻止默认事件*/
    var stopDefault = function(e) {
        e.preventDefault();
    };
    $(".back").on("click",function() {
        $("#cover").show();
        $(".cancel").show();
        $(window).on("touchmove",stopDefault);
        
    });
    $(".cancel p span:eq(0)").on("click",function() {
        $("#cover").hide();
        $(".cancel").hide();
        $(window).off("touchmove",stopDefault);
    });
    
    $(".cancel p span:eq(1)").on("click",function() {
        $("#cover").hide();
        $(".cancel").hide();
        $(window).off("touchmove",stopDefault);
        hasher.setHash('payment');
    });
    
    //下一步
    $(".bank_next").on("click",function() {
        var number_card = $("#number_card").val();
        if(!number_card){
            utils.appearDiv("phone_error","请填写卡号！");
            return false;
        }
        var str_card = number_card.replace(/\s+|s+$/g, '');
        var reg = /^(\d{16}|\d{19})$/; 
        if(!reg.test(str_card)){
            utils.appearDiv("phone_error","请输入正确的卡号！");
			return false;
        }
        hasher.setHash('message_bank');
       
    });
    //银行卡号 每隔4位空一个
    $("#number_card").on("keyup",function() {
        $(this).val($(this).val().replace(/\D/g,'').replace(/....(?!$)/g,'$& '))
    });
    
    //点击删除
    $(".del_tip").on("click",function() {
        $("#number_card").val("");
    });
    
})
	
	