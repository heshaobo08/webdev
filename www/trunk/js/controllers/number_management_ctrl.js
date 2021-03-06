/**
 * 场次管理
 * author shaobo
 * **/
require(['jquery','utils'],function($,utils){
	//时间插件
	utils.relationCal('start_time1','end_time1');
	//全选，反选
	$("#comm_all").off().on("click",function(){   
		var comm_all = document.getElementById("comm_all");
		var goods_delete = document.getElementsByName("app_box");
		for(var i=0;i<goods_delete.length;i++){
			if(comm_all.checked){
				goods_delete[i].checked = true;
			}else{
				goods_delete[i].checked = false;
			}
		}
	});
	//单选取消全选
	$(".address_list_comm").delegate("input[name=app_box]","click",function(){
		var comm_all = document.getElementById("comm_all");
		var goods_delete = document.getElementsByName("app_box");
		for(var i=0,n=0;i<goods_delete.length;i++){
			if(goods_delete[i].checked){
			   n++; 
			}
			comm_all.checked = n==goods_delete.length?true:false;
		}
	});
	
	//重置
	$(".ac_ser_reset").on("click",function(){
		$("input").val("");
        var SelectArr = $("select")
        for (var i = 0; i < SelectArr.length; i++) {
            SelectArr[i].options[0].selected = true;
        }
	});

	//上移下移置换
	$(".tbl_content .ac_up").on("click",function(){
		var _sort=$(this).attr("data-id");
		$("#data_sort").val(_sort);
		$(".ac_down").removeClass("ac_downon").addClass("ac_down");
		$(".tbl_content .ac_up").each(function(index, element) {
			$(element).removeClass("ac_upon");
        });
		$(this).addClass("ac_upon");
		//ajaxGetData(1);
	});
	$(".tbl_content .ac_down").on("click",function(){
		var _sort=$(this).attr("data-id");
		$("#data_sort").val(_sort);
		$(".ac_up").removeClass("ac_upon").addClass("ac_up");
		$(".tbl_content .ac_down").each(function(index, element) {
			$(element).removeClass("ac_downon");
        });
		$(this).addClass("ac_downon");
		//ajaxGetData(1);
	});
	//分页
	pageNav.go(2,12);

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

	//判断是否选中
	$("#mass_up").on("click",function(){
		if(!$("input[name='app_box']").is(':checked')){
			utils.detail_end("请勾选发布的场次",function(){},"提示信息",2,0);
		}
		
	});

	$("#mass_down").on("click",function(){
		if(!$("input[name='app_box']").is(':checked')){
			utils.detail_end("请勾选下线的场次",function(){},"提示信息",2,0);
		}
	});

	$("#mass_move").on("click",function(){
		if(!$("input[name='app_box']").is(':checked')){
			utils.detail_end("请勾选删除的场次",function(){},"提示信息",2,0);
		}
	});

	//上线与下线
	$(".app_online").on("click",function(){
		utils.detail_end("是否确定上线？",function(){},"上线",4,0);
	});

	$(".app_offline").on("click",function(){
		utils.detail_end("<p>是否确定下线？</p><p>注意！相关场次及配置将不再前端显示</p>",function(){},"下线",4,0);
	});

});