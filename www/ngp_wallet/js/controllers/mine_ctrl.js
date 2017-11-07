/**
 * 我的钱包
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
    //余额
    $(".mine_balance").on("click",function(){
        hasher.setHash("mine_balance");
    });
    //银行卡
    $(".mine_bankCard").on("click",function(){
        hasher.setHash("mine_bankCard");
    });
    //账号设置
    $(".mine_accont_set").on("click",function(){
        hasher.setHash("mine_accont_set");
    });
    //关于汇付宝
    $(".mine_about").on("click",function(){
        hasher.setHash("mine_about");
    });
    
});