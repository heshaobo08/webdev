$(function(){
    $(".unionpay_box").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".unionpay_pop_box").show();
    });
    
    $(".ngp_pop_hd em").on("click",function(){
        $("#cover").hide();
        $(".unionpay_pop_box").hide();
    });
    
    //点击按钮创建二维码
    $(".cash_btn").on("click",function(){
        $(".qr_code_one").hide();
        $(".qr_code_two").show();
        $(".ngp_pop_hd em").hide();
    });
    
    
})