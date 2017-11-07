/**
 * 余额
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
    //充值
    $(".balance_charge").on("click",function(){
        hasher.setHash("balance_charge");
    });
    //提现
    $(".balance_withdraw").on("click",function(){
        hasher.setHash("balance_withdraw");
    });
    //明细查询
    $(".balance_detail").on("click",function(){
        hasher.setHash("balance_detail");
    });
    
    
});