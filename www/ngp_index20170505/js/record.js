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
    
    $(".record_refund").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".ngp_pop_one").show();
    });
    
    $(".ngp_pop_one em").on("click",function(){
        $("#cover").hide();
        $(".ngp_pop_one").hide();
    });
    
    $(".ngp_pop_one h3").on("click",function(){
        $("#cover").hide();
        $(".ngp_pop_one").hide();
    });
    
    /*充值选项卡*/
    $(".transaction_tab_l ul li").on("click",function(){
        $(".transaction_tab_l ul li").removeClass("tab_active");
        $(this).addClass("tab_active");
        $(".transaction_query").hide();
        $(".transaction_query:eq('"+$(this).index()+"')").show();
        
    });
})