/**
 *银行卡信息
 * author shaobo
 * **/
require(['jquery','hasher','routeService','utils'],function($,hasher,routeService,utils){
	 /*阻止默认事件*/
    var stopDefault = function(e) {
        e.preventDefault();
    }
    $(".js_check").on("change",function() {
        if($(this).prop("checked")) {
            $("#cover").show();
            $(".agreement").slideToggle(1000);
            $(window).on("touchmove",stopDefault);
        }
        
    })
    $(".js_cancel").on("click",function() {
        $("#cover").hide();
        $(".agreement").slideToggle(1000);
        $(window).off("touchmove",stopDefault);
    })
    
    $(".js_phone_tip").on("click",function() {
         $("#cover").show();
        $(".phone_tip").show();
        $(window).on("touchmove",stopDefault);
    })
    
     $(".phone_tip h6").on("click",function() {
        $("#cover").hide();
        $(".phone_tip").hide();
        $(window).off("touchmove",stopDefault);
    })
     
    $(".bank_next").on("click",function() {
        //手机号验证	
        var reg = /(^13\d{9}$)|(^14\d{9}$)|(^15\d{9}$)|(^16\d{9}$)|(^17\d{9}$)|(^18\d{9}$)|(^19\d{9}$)/g; 
        var mobileP = $("#number_phone").val().trim();
        if(!mobileP){
            utils.appearDiv("phone_error","请输入手机号！");
			return false;
        }
        if(!reg.test(mobileP)){
            utils.appearDiv("phone_error","手机号码输入错误！");
			return false;
        }
        if(!$(".js_check").prop("checked")){
            utils.appearDiv("phone_error","请勾选同意用户协议！");
			return false;
        }
        hasher.setHash('bank_phone');

    })
    
    
})
	
	