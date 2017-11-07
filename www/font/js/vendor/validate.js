/**
 * 表单验证
 * author shaobo
 * **/
define(['jquery','additional_methods','jqueryvalidate'],function($,additional_methods,validate){
	//应用管理
	var valid_ac_new=function(){
		$('#ac_new_form').validate({
				ignore:'',
                rules:{//验证规则
                     prize:{ 
                        required:true
                     },
					start_time:{ 
                        required:true
                     },
					collect:{
						required:true
					}
					
                },  
                messages: { //提示
                    prize:{ 
                        required:'<img src="img/tipWrong.png">请勾选奖品分类'
                     },
					start_time:{ 
                        required:'<img src="img/tipWrong.png">请填写领取有效时间'
                     },
					collect:{ 
                        required:'<img src="img/tipWrong.png">请勾选领取方式'
                     }
                },
                errorElement: 'div',
                errorClass:'errorTip',
                errorPlacement:function(error,ele){
                    error.appendTo(ele.parent().parent());  
                 }
            })
	};
	//场次基本信息
	var valid_matches=function(){
		$('#matches_form').validate({
				ignore:'',
                rules:{//验证规则
                     theme:{ 
                        required:true
                     },
					start_time:{ 
                        required:true
                     },
					countdown:{
						required:true
					},
					uploadImgHidden:{
						required:true
					},
					in_number:{
						required:true
					},
					collect:{
						required:true
					},
					start_collect:{
						required:true
					},
					start_since:{
						required:true
					},
					push_content:{
						required:true
					},
					push_time:{
						required:true
					},
					push_object:{
						required:true
					},
					start_push:{
						required:true
					}
						
                },  
                messages: { //提示
                    theme:{ 
                        required:'<img src="img/tipWrong.png">请输入主题名称'
                     },
					start_time:{ 
                        required:'<img src="img/tipWrong.png">请填写时间'
                     },
					countdown:{ 
                        required:'<img src="img/tipWrong.png">请选择倒计时'
                     },
					uploadImgHidden:{ 
                        required:'<img src="img/tipWrong.png">请上传图片'
                     },
					in_number:{ 
                        required:'<img src="img/tipWrong.png">请填写日参与数'
                     },
					collect:{ 
                        required:'<img src="img/tipWrong.png">请勾选领取方式'
                     },
					start_collect:{ 
                        required:'<img src="img/tipWrong.png">请填写领取有效期'
                     },
					start_since:{ 
                        required:'<img src="img/tipWrong.png">请填写自提有效期'
                     },
					push_content:{ 
                        required:'<img src="img/tipWrong.png">请填写推送内容'
                     },
					push_time:{ 
                        required:'<img src="img/tipWrong.png">请选择推送时间'
                     },
					push_object:{ 
                        required:'<img src="img/tipWrong.png">请选择推送对象'
                     },
					start_push:{ 
                        required:'<img src="img/tipWrong.png">请填写推送时间'
                     }
                },
                errorElement: 'div',
                errorClass:'errorTip',
                errorPlacement:function(error,ele){
                    error.appendTo(ele.parent().parent());  
                 }
            })
	};
	return {
		valid_ac_new:valid_ac_new,
		valid_matches:valid_matches
	};
});