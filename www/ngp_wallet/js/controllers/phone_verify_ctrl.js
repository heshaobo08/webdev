/**
 * 
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
      /*阻止默认事件*/
        var stopDefault = function (e) {
                e.preventDefault();
            }
            //弹层函数
        function appearDiv(str) {
            $("#cover").show();
            $(".phone_error").fadeIn(400).find('h4').text(str);
            $(window).on("touchmove", stopDefault);
        }
        $(".phone_error p").on("click", function () {
                $("#cover").hide();
                $(".phone_error").hide();
                $(window).off("touchmove", stopDefault);
            })
            //点击按钮删除
        $(".del_tip").on("click", function () {
            var card_str = $("#number_card").val("");
        });
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
        // 下一步
        $(".login_phone").on("click", function () {
            var str_yzm = $("#number_yzm").val().trim();
            if (!str_yzm) {
                utils.appearDiv("phone_error","输入短信验证码！");
                return false;
            }
            hasher.setHash("bind_success");
        }) 
});