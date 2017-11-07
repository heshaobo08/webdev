/**
 * 银行卡
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
    //添加银行卡
    $(".bankCard_add").on("click",function(){
        hasher.setHash("bankCard_add");
    });
});