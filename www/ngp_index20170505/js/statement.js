$(function(){
 
  /*结算管理选项卡*/
    $(".transaction_tab_l ul li").on("click",function(){
        $(".transaction_tab_l ul li").removeClass("tab_active");
        $(this).addClass("tab_active");
        $(".transaction_query").hide();
        $(".transaction_query:eq('"+$(this).index()+"')").show();
        
    });
    
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
    
    /*切换 全部 收入 支出*/
    $(".statement_btn span").on("click",function(){
        $(".statement_btn span").removeClass("statement_btn_ative");
        $(this).addClass("statement_btn_ative");
    })
    
    
})