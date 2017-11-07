/**
 * 账户设置
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
    //修改手机号
    $(".phone_update").on("click",function(){
        hasher.setHash("phone_update");
    });
    //实名认证
    $(".certification_card").on("click",function(){
        hasher.setHash("certification_card");
    });
    //设置支付密码
    $(".set_pay_psw").on("click",function(){
        hasher.setHash("set_pay_psw");
    });
});