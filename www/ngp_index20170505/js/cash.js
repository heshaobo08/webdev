$(function(){
 function stopDefault(e){
     e.preventDefault();		
 }
$(window).on('touchmove',stopDefault);
    /*提现银行卡管理*/
    $(".cash_bank_list ul li em").on("click",function(e){
        e.stopPropagation();
        $(this).siblings(".cash_bank_mode").show();
        $(this).parent().siblings("li").find(".cash_bank_mode").hide();
    });
     $(document).click(function(){
        $(".cash_bank_mode").hide();
    });
    
    /*选中提现银行卡*/
    $("input[name='radio_bank']").on("click",function(){
        if($(this).is(":checked")){
           $(this).parent().parent().addClass("cash_ative");
           $(this).parent().parent().siblings("li").removeClass("cash_ative");
        }
    });
    
    /*查看服务费*/
    $(".cash_look").on("mouseover",function(){
        $(".cash_service").show();
    });
    $(".cash_look").on("mouseout",function(){
        $(".cash_service").hide();
    });
    
    /*添加提现账户*/
    $(".cash_add").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".cash_pop_one").show();
    });
     $(".cash_pop_one em").on("click",function(){
        $("#cover").hide();
        $(".cash_pop_one").hide();
    });
     
     /*确认添加提现账户*/
     $(".cash_pop_one h3").on("click",function(){
        $(".ngp_pop_four").show();
        $(".cash_pop_one").hide();
    });
     $(".ngp_pop_four em").on("click",function(){
        $("#cover").hide();
        $(".ngp_pop_four").hide();
    });
     
    
    /*确认提现*/
    $(".cash_btn").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".cash_pop_two").show();
    });
    
    $(".cash_pop_two em").on("click",function(){
        $("#cover").hide();
        $(".cash_pop_two").hide();
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
     
    
})