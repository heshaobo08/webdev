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
    
    $(".cash_bank_add").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".cash_pop_one").show();
    });
     $(".cash_pop_one em").on("click",function(){
        $("#cover").hide();
        $(".cash_pop_one").hide();
    });
     
     /*确认添加*/
    $(".cash_pop_one h3").on("click",function(){
        $(".cash_pop_one").hide();
        $(".ngp_pop_four").show();
    });
    
    $(".ngp_pop_four em").on("click",function(){
        $("#cover").hide();
        $(".ngp_pop_four").hide();
    });
    
})