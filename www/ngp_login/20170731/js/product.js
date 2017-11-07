$(function () {
  /*获取滚动条高度*/
    var st = null;
    $(window).scroll(function (){
        st = $(this).scrollTop();
        if(st<400){
            $(".product_sroll").css({"top":"0px"});
            $(".product_sroll span").removeClass("sroll_ative");
            $(".product_sroll span:eq(0)").addClass("sroll_ative");
        }
        else if(st>400 && st<750){
            $(".product_sroll").css({"top":"450px"});
            $(".product_sroll span").removeClass("sroll_ative");
            $(".product_sroll span:eq(1)").addClass("sroll_ative");
        }
        else if(st>750 && st<1000){
            $(".product_sroll").css({"top":"800px"});
            $(".product_sroll span").removeClass("sroll_ative");
            $(".product_sroll span:eq(2)").addClass("sroll_ative");
        }
        else if(st>1000 && st<1450){
            $(".product_sroll").css({"top":"1200px"});
            $(".product_sroll span").removeClass("sroll_ative");
            $(".product_sroll span:eq(3)").addClass("sroll_ative");
        }
    });
    
})