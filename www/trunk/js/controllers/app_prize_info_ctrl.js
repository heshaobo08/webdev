/**
 * 奖品信息
 * author shaobo
 * **/
require(['jquery','utils','validate'],function($,utils,validate){
	//重置
	$(".ac_ser_reset").on("click",function(){
		$("input").val("");
        var SelectArr = $("select")
        for (var i = 0; i < SelectArr.length; i++) {
            SelectArr[i].options[0].selected = true;
        }
	});

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
	//奖品切换
	$(".app_switch ul li").on("click",function(){
		if($(this).index()==1){
			$(".number_tbl_two").show();
			$(".number_tbl_one").hide();	
		}
		else if($(this).index()==0){
			$(".number_tbl_one").show();
			$(".number_tbl_two").hide();
		}
		$(this).addClass('on').siblings('li').removeClass('on');
	});

	//分页
	pageNav.go(7,12);

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
			utils.detail_end("请勾选批量上架商品",function(){},"提示信息",2,0);
		}
		
	});

	$("#mass_down").on("click",function(){
		if(!$("input[name='app_box']").is(':checked')){
			utils.detail_end("请勾选批量下架商品",function(){},"提示信息",2,0);
		}
	});
	$("#mass_move").on("click",function(){
		if(!$("input[name='app_box']").is(':checked')){
			utils.detail_end("请勾选批量移除的商品",function(){},"提示信息",2,0);
		}
	});

	//上一步
	$(".prize_last_bt").on("click",function(){
		location.href ='#/app_information';
	});

	//下一步
	$(".prize_next_bt").on("click",function(){
		location.href ='#/app_finish';
	});
	
})
	
	