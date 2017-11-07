/**
 * 更换手机号
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
    $(".login_phone").on("click", function () {
        hasher.setHash("pay_verify");
    });
});