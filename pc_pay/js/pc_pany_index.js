$(function(){
    /*显示与隐藏快捷支付和网银支付其他支付方式*/
    $(".js_online_pany").on("click",function(){
        $(".online_box").show();
        $(".quick_box").hide();
        $(".other_box").hide();
        $(".js_online_tip").attr("src","images/pany_ioc.png");
        $(".js_quick_tip").attr("src","images/pany_ioc1.png");
        $(".js_other_tip").attr("src","images/pany_ioc1.png");
    })
    $(".js_quick_pany").on("click",function(){
        $(".quick_box").show();
        $(".online_box").hide();
        $(".other_box").hide();
        $(".js_quick_tip").attr("src","images/pany_ioc.png");
        $(".js_online_tip").attr("src","images/pany_ioc1.png");
        $(".js_other_tip").attr("src","images/pany_ioc1.png");
    });
    
     $(".js_other_pany").on("click",function(){
        $(".online_box").hide();
        $(".quick_box").hide();
        $(".other_box").show();
        $(".js_other_tip").attr("src","images/pany_ioc.png");
        $(".js_quick_tip").attr("src","images/pany_ioc1.png");
        $(".js_online_tip").attr("src","images/pany_ioc1.png");
    });
   
  
    
    var off=true; 
    $(".tie_ct_r p").on("click",function(){
        if(off){
            $(this).find("img").attr("src","images/tie_tip1.png");
            $(".tie_text p:eq(1)").show();
            $(".tie_text p:eq(2)").show();
            off=false;
        }else{
            $(this).find("img").attr("src","images/tie_tip.png");
            $(".tie_text p:eq(1)").hide();
            $(".tie_text p:eq(2)").hide();
            off=true;
        }
        
    })
    
    /*银行卡输入框的获取焦点与失去焦点*/
    $("#quick_pany").on("focus",function(){
        $(this).removeClass("b_color").addClass("b_success_color");
        $(this).siblings("span").css({"background":"#57a8ec","color":"#fff","cursor":"pointer"});
    })
    
    $("#quick_pany").on("blur",function(){
        if(!$(this).val()){
           $(this).removeClass("b_success_color").addClass("b_color");
           $(this).siblings("span").css({"background":"#c2c1c1","color":"#fff","cursor":"auto"}); 
        }
       
    })
    
    
    /*鼠标移到银行卡列表上的状态*/
    
    $(".pany_bank_list ul li").mouseenter(function(){
        $(this).find("p").slideDown();
        $(this).find("em").slideDown();
    });
    $(".pany_bank_list ul li").mouseleave(function(){
         $(".pany_bank_list ul li").find("p").slideUp();
         $(".pany_bank_list ul li").find("em").slideUp();
    });
     
     
})