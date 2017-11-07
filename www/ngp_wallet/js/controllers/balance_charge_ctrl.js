/**
 * 充值
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
    //使用新卡支付
    $(".add_bank").on("click",function(){
        hasher.setHash("bankCard_add");
    });
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
            $(".pay_yzm").show();
    });
    //输入验证码提交
    $(".pay_ok").on("click",function(){
        var pay_pwd = $(".pay_pwd").val();
            if (!pay_pwd) {
                $(".error_pay").html("请输入验证码！");
                return false;
            }
            $("#cover").hide();
            $(".pay_yzm").hide();
            hasher.setHash("recharge_success");
        });
        
    $(".pay_pwd").on("focus",function(){
        $(".error_pay").html("");
    });
    $(".repeal_pay").on("click", function () {
        $("#cover").hide();
        $(".pay_yzm").hide();
    });
});