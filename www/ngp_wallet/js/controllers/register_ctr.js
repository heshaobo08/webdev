/**
 * 注册
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
        //点击按钮逐个删除
        $(".del_tip").on("click", function () {
            $("#phone_number").val("");
        });
        $(".login_phone").on("click", function () {
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
            $("#cover").height($(document).height());
            $("#cover").show();
            $(".yzm_succ").show();
        });
        $(".cancel .repeal").on("click", function () {
            $("#cover").hide();
            $(".cancel").hide();
        });
    
        //去登录
        $(".hint p").on("click",function(){
            hasher.setHash("login");
        });
    
        $(".yzm_ok").on("click",function(){
            $("#cover").hide();
            $(".cancel").hide();
            //请求后台发送验证码
             hasher.setHash("security_code");
        });
});