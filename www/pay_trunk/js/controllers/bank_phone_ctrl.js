/**
 *填写手机号码
 * author shaobo
 * **/
require(['jquery','hasher','routeService','utils'],function($,hasher,routeService,utils){
	 /*阻止默认事件*/
    var stopDefault = function(e) {
        e.preventDefault();
    };
    $(".yzm_tip").on("click",function() {
        $("#cover").show();
        $(".yzm_box").show();
        $(window).on("touchmove",stopDefault);
    });
    $(".yzm_box h6").on("click",function() {
        $("#cover").hide();
        $(".yzm_box").hide();
        $(window).off("touchmove",stopDefault);
    });
    
    //下一步
    $(".bank_next").on("click",function() {
        var str_yzm = $("#number_yzm").val();
        if(str_yzm==""){
            utils.appearDiv("phone_error","输入短信验证码！");
            return false;
        }
        $("#cover").show();
        $(".data").show();
        setTimeout(function(){
            hasher.setHash('success');
            $("#cover").hide();
            $(".data").hide();
        },1000)
       
        
    });
    
    var timeoff=true;
    var count = 60;
    //初始化读秒
    if(timeoff){
        countdown = setInterval(CountDown, 1000);
        CountDown();
    }
    //重发验证码
    $(".resend_code").on("click",function() {
        if(timeoff){
            countdown = setInterval(CountDown, 1000);
            CountDown();
        }
    });
    function CountDown() {
            timeoff=false;
			$(".resend_code").html(count + "秒后重发");
			if (count == 0) {
				$('.resend_code').html("重发验证码");
                timeoff=true;
                count = 60;
				clearInterval(countdown);
			}
			count--;
		}
    
})
	
	