/**
 * 验证支付密码
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
    $(".login_phone").on("click", function () {
        var psw = $("#number_psw").val().trim();
        if (!psw) {
            utils.appearDiv("phone_error","请输入支付密码！");
            return false;
        }
        hasher.setHash("code_verify");
    });
});