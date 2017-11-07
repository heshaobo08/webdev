/**
 * 获取银行卡列表
 * author shaobo
 * **/
require(['jquery','hasher','routeService'],function($,hasher,routeService){
	 $(".banklist li").on("click",function() {
        $(".banklist li p").removeClass();
        $(this).find("p").addClass("sel_bank");
        setTimeout(function() {
            hasher.setHash('bank_phone');
        },500)
    });
    
    $(".add_bank").on("click",function(){
         hasher.setHash('add_bank');
    });
})
	
	