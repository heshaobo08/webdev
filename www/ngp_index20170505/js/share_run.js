$(function(){
    /*下来菜单获取值*/
    $('[name="record_select"]').click(function(e){
	$('[name="record_select"]').find('ul').hide();
	$(this).find('ul').show();
	e.stopPropagation();
    });
    $('[name="record_select"] li').hover(function(e){
        $(this).toggleClass('on');
        e.stopPropagation();
    });
    $('[name="record_select"] li').click(function(e){
        var val = $(this).text();
        var dataVal = $(this).attr("data-value");
        $(this).parents('[name="record_select"]').find('input').val(val);
        $('[name="record_select"] ul').hide();
        e.stopPropagation();
    });
    $(document).click(function(){
        $('[name="record_select"] ul').hide();
    });
    
    /*交易管理选项卡*/
    $(".account_tab_l ul li").on("click",function(){
        $(".account_tab_l ul li").removeClass("tab_active");
        $(this).addClass("tab_active");
        $(".transaction_query").hide();
        $(".transaction_query:eq('"+$(this).index()+"')").show();
        
    });
    
    //全选，反选
	$(".comm_all").off().on("click",function(){
		var comm_all = $(".comm_all");
		var goods_delete = document.getElementsByName("app_box");
		for(var i=0;i<goods_delete.length;i++){
			if(comm_all.is(':checked')){
				goods_delete[i].checked = true;
			}else{
				goods_delete[i].checked = false;
			}
		}
	});
	//单选取消全选
	$(".record_list").delegate("input[name=app_box]","click",function(){
		var comm_all = $(".comm_all");
		var goods_delete = document.getElementsByName("app_box");
		for(var i=0,n=0;i<goods_delete.length;i++){
			if(goods_delete[i].checked){
			   n++; 
			}
            if(n==goods_delete.length){
                $(".comm_all").attr("checked",true);
            }else{
               $(".comm_all").attr("checked",false); 
            }
		}
	});
    
    
    $(".transaction_check b").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".ngp_pop_three").show();
    });
    $(".ngp_pop_three em").on("click",function(){
        $("#cover").hide();
        $(".ngp_pop_three").hide();
    });
    
     $(".record_refund").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".ngp_pop_two").show();
    });
    $(".ngp_pop_two em").on("click",function(){
        $("#cover").hide();
        $(".ngp_pop_two").hide();
    });
    
    
    
    
})