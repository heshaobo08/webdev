/**
 * 场次基础信息
 * author shaobo
 * **/
require(['jquery','utils','validate','vendor/webupload/upload_new'],function($,utils,validate,upload){
	//时间插件
	utils.relationCal('start_time1','end_time1',0,0);
	utils.relationCal('start_collect','end_collect');
	utils.relationCal('start_since','end_since');
	utils.relationCal('start_push');
	//上传图片
	upload.init();
	//验证表单
	validate.valid_matches();
	$(".app_next_bt").on("click",function(){
		//判断是否有上传图片
		if($(".filelist li").length >0){
			$("#uploadImgHidden").val("1");
		}else{
			$("#uploadImgHidden").val("");
		}

		var _timeo=transdate($("#start_time1").val());
		var _timet=transdate($("#start_push").val());
		if(_timeo>_timet){
			$(".tuisti p").html("<img src='img/tipWrong.png'>推送时间必须大于时间");
			return false;
		}
		
		if(!$('#matches_form').valid()){
			return false;
		}else{
			location.href ='#/number_info';
		}
	});
	//日期转换为时间戳
	function transdate(endTime){  
		var date=new Date();  
		date.setFullYear(endTime.substring(0,4));  
		date.setMonth(endTime.substring(5,7)-1);  
		date.setDate(endTime.substring(8,10));  
		date.setHours(endTime.substring(11,13));  
		date.setMinutes(endTime.substring(14,16));  
		date.setSeconds(endTime.substring(17,19));  
		return Date.parse(date)/1000;  
	}

	//编辑
    var img_url=$("#edit_url").val();
	if(img_url){
		//console.log(img_url);
		$("#dndArea").hide();
		var _html ='<p class="imgWrap"><img src='+img_url+'></p>'+
				   '<p class="tplimg"><img src="img/dot.png"></p>';
		$(".number_img_edit").html(_html);
		$(".filelist").html("<li style='display:none'></li>");
	}else{
		$(".number_img_edit").hide();
	}
	//删除
	$(".number_img_edit").on("click",".tplimg",function(){
		$(".filelist").html('');
		$("#uploadImgHidden").val("");
		var ac_id = $('#ac_id').val();
		var ac_url = $('#edit_url').val();
		$.ajax({
            type: "GET",
            url: "/admin/index.php/shared/ajaxDeleteImg",
            data:{'id':ac_id,'saveName':ac_url},//参数：id：图片id、saveName：图片地址
            success:function(data){
            	$(".number_img_edit").hide();
        		$("#dndArea").show();
        		upload.init();
            }
        });

	});
	
})
	
	