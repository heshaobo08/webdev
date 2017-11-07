/**
 * 编辑基础信息
 * author shaobo
 * **/
require(['jquery','utils','validate'],function($,utils,validate){
	//时间插件
	utils.relationCal('start_time1','end_time1');
	//验证表单
	validate.valid_ac_new();
	$(".app_next_bt").on("click",function(){
		if(!$('#ac_new_form').valid()){
        return false;
	}else{
		location.href ='#/app_prize_info';
	}
	});
	
})
	
	