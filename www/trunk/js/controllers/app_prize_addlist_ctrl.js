/**
 * 增加奖品列表
 * author shaobo
 * **/
require(['jquery','utils','validate'],function($,utils,validate){
	//全选，反选
	$("#comm_all").off().on("click",function(){   
		var comm_all = document.getElementById("comm_all");
		var goods_delete = document.getElementsByName("app_box");
		for(var i=0;i<goods_delete.length;i++){
			if(comm_all.checked){
				goods_delete[i].checked = true;
				$(".ct_box").html('选择：'+goods_delete.length+'种奖品');
			}else{
				goods_delete[i].checked = false;
				$(".ct_box").html('选择：'+0+'种奖品');
			}
		}
	});
	//单选取消全选
	$(".address_list_comm").delegate("input[name=app_box]","click",function(){
		var comm_all = document.getElementById("comm_all");
		var goods_delete = document.getElementsByName("app_box");
		var kt=($("input[name=app_box]:checked").length);
		$(".ct_box").html('选择：'+kt+'种奖品');
		for(var i=0,n=0;i<goods_delete.length;i++){
			if(goods_delete[i].checked){
			   n++;
			}
			comm_all.checked = n==goods_delete.length?true:false;
		}
	});

	$("#mass_move").on("click",function(){
		if(!$("input[name='app_box']").is(':checked')){
			utils.detail_end("请勾选批量移除的商品",function(){},"提示信息",2,0);
		}
	});

	//分页
	pageNav.go(4,12);

	//每页显示几条记录
	$("#page_nav").on("change",function(){
		//ajaxGetData(1);
		$("#page_num").val(1);
	});
	//跳转到第几页
	$("#page_num").on("blur",function(){
		var count = $('#count').val();
		var page_nav = $("#page_nav").val();
		var page_big = Math.ceil(count/page_nav);
		var page = $("#page_num").val();
		if(page > page_big){
			page = page_big;
			$("#page_num").val(page);
		}
		//ajaxGetData(page);
	});
	

})
	
	