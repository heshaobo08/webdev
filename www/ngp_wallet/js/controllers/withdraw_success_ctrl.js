/**
 * 提现申请成功
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
    //完成
    $(".login_phone").on("click",function(){
        hasher.setHash("mine_balance");
        $(".pay_pwds").val("");
    });

});