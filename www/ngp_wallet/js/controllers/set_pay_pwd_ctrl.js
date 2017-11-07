/**
 * 设置支付密码
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
    //点击删除
        $(".del_tip").on("click", function () {
           $("#phone_number").val("");
        });
        //下一步
        $(".login_phone").on("click", function () {
            //手机号验证	
            var reg = /(^13\d{9}$)|(^14\d{9}$)|(^15\d{9}$)|(^16\d{9}$)|(^17\d{9}$)|(^18\d{9}$)|(^19\d{9}$)/g;
            var mobileP = $("#phone_number").val().trim();
            var yzm_number = $("#phone_yzm").val().trim();
            if (!mobileP) {
                utils.appearDiv("phone_error","请输入手机号！");
                return false;
            }
            if (!reg.test(mobileP)) {
                utils.appearDiv("phone_error","手机号码输入错误！");
                return false;
            }
             if (!yzm_number) {
                utils.appearDiv("phone_error","请输入验证码！");
                return false;
            }
         hasher.setHash("set_pay_new");
        });
        //初始化读秒
        var timeoff = true;
        var count = 60;
        //点击获取验证码
        $(".yzm_box").on("click",function(){
            //手机号验证	
            var reg = /(^13\d{9}$)|(^14\d{9}$)|(^15\d{9}$)|(^16\d{9}$)|(^17\d{9}$)|(^18\d{9}$)|(^19\d{9}$)/g;
            var mobileP = $("#phone_number").val().trim();
            if (!mobileP) {
                utils.appearDiv("phone_error","请输入手机号！");
                return false;
            }
            if (!reg.test(mobileP)) {
                utils.appearDiv("phone_error","手机号码输入错误！");
                return false;
            }
            if(timeoff){
                $("#cover").height($(document).height());
                $("#cover").show();
                $(".phone_succ").show();
            }
            //发送验证码
            $(".phone_ok").on("click",function(){
                if (timeoff) {
                    countdown = setInterval(CountDown, 1000);
                    CountDown();
                }
                $("#cover").hide();
                $(".cancel").hide();
                //请求后台发送验证码
                
            });
            
        });
        //发送验证码函数
        function CountDown() {
            timeoff = false;
            $(".yzm_box").html(count+"s");
            if (count == 0) {
                $('.yzm_box').html("重发验证码");
                timeoff = true;
                count = 60;
                clearInterval(countdown);
            }
            count--;
        }
    
     $(".cancel .repeal").on("click", function () {
            $("#cover").hide();
            $(".cancel").hide();
        });
});