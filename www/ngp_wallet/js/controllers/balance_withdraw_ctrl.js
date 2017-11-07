/**
 * 提现
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
    //点击按钮逐个删除
    $(".del_tip").on("click", function () {
        $("#number_card").val("");
    });
    //下一步
    $(".login_phone").on("click", function () {
            //验证金额	
            var reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
            var number_card = $("#number_card").val().trim();
            if (!number_card) {
                utils.appearDiv("phone_error","请输入金额！");
                return false;
            }
            if (!reg.test(number_card)) {
                utils.appearDiv("phone_error","输入金额错误！");
                return false;
            }
            $("#cover").height($(document).height());
            $("#cover").show();
            $(".pay_pwd_box").show();
    });
    //输入支付密码提交
    $(".pay_pwd_ok").on("click",function(){
            var pay_pwd = $(".pay_pwds").val();
            if (!pay_pwd) {
                $(".error_pay").html("请输入支付密码！")
                return false;
            }
            $("#cover").hide();
            $(".pay_pwd_box").hide();
            hasher.setHash("withdraw_success");
        });
        $(".pay_pwds").on("focus",function(){
            $(".error_pay").html("");
        });
    $(".repeal_pay_pwd").on("click", function () {
        $("#cover").hide();
        $(".pay_pwd_box").hide();
    });
});