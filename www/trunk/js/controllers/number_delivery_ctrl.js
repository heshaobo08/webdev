/**
 *应用分发
 * author shaobo
 * **/
require(['jquery','utils','validate'],function($,utils,validate){
	//上一步
	$(".prize_last_bt").on("click",function(){
		location.href ='#/number_info';
	});

	//下一步
	$(".prize_next_bt").on("click",function(){
		location.href ='#/number_finish';
	});
	
})
	
	