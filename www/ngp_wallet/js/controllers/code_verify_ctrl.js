/**
 * 验证原有手机号
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
     // 下一步
    $(".login_phone").on("click", function () {
        var str_yzm = $("#number_yzm").val().trim();
        if (!str_yzm) {
             utils.appearDiv("phone_error","输入短信验证码！");
            return false;
        }
        hasher.setHash("new_phone");
    });
});