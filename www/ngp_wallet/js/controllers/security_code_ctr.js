/**
 * 注册
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
        //点击按钮逐个删除
        $(".del_tip").on("click", function () {
            $("#number_card").val("");
        });
        //返回
        $(".hint p").on("click",function(){
            hasher.setHash("register");
            clearInterval(countdown);
        })
        
        //重发验证码
        var timeoff = true;
        var count = 60;
        //初始化读秒
        if (timeoff) {
            countdown = setInterval(CountDown, 1000);
            CountDown();
        }

        //重发验证码
        $(".resend_code").on("click", function () {
            if (timeoff) {
                countdown = setInterval(CountDown, 1000);
                CountDown();
            }
        });

        function CountDown() {
            timeoff = false;
            $(".resend_code").html(count + "秒后重发");
            if (count == 0) {
                $('.resend_code').html("重发验证码");
                timeoff = true;
                count = 60;
                clearInterval(countdown);
            }
            count--;
        }
        //提交
        $(".login_phone").on("click", function () {
                var str_yzm = $("#number_yzm").val().trim();
                if (!str_yzm) {
                     utils.appearDiv("phone_error","输入短信验证码！");
                    return false;
                }
                $("#cover").height($(document).height());
                $("#cover").show();
                $(".wallat_su").html("注册成功!");
                $(".login_succ").show();
            });
    
        //去设置密码
        $(".set_pwd").on("click", function () {
            hasher.setHash("set_pwd");
            $("#cover").hide();
            $(".cancel").hide();
            clearInterval(countdown);
        });
        //以后再说
        $(".back_index").on("click", function () {
            hasher.setHash("mine");
            $("#cover").hide();
            $(".cancel").hide();
            clearInterval(countdown);
        });
});