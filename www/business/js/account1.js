$(function(){
    //下来菜单获取值
    $('[name="nice-select"]').click(function(e){
	$('[name="nice-select"]').find('ul').hide();
	$(this).find('ul').show();
	e.stopPropagation();
    });
    $('[name="nice-select"] li').hover(function(e){
        $(this).toggleClass('on');
        e.stopPropagation();
    });
    $('[name="nice-select"] li').click(function(e){
        var val = $(this).text();
        var dataVal = $(this).attr("data-value");
        $(this).parents('[name="nice-select"]').find('input').val(val);
        $('[name="nice-select"] ul').hide();
        e.stopPropagation();
        //alert("中文值是："+val);
        //alert("数字值是："+dataVal);
    });
    $(document).click(function(){
        $('[name="nice-select"] ul').hide();
    });
    
    /*获取登录密码框的焦点*/
    $("#password").on("focus",function(){
        $(this).removeClass("b_color").addClass("b_success_color");
        $(this).parent().siblings(".password_tip").show();
    })
    
     /*失去登录密码框的焦点*/
    $("#password").on("blur",function(){
        $(this).removeClass("b_success_color").addClass("b_color");
        $(this).parent().siblings(".password_tip").hide();
        var password = $(this).val();
        
    })
    
    /*获取再次输入密码框的焦点*/
    $("#pwd_agin").on("focus",function(){
        $(this).removeClass("b_color").addClass("b_success_color");
        $(this).parent().siblings(".password_tip").show();
        $(this).parent().siblings(".password_tip_error").hide();
        $(this).parent().siblings(".password_tip_succ").hide();
    })
    
     /*失去再次输入密码框的焦点*/
    $("#pwd_agin").on("blur",function(){
        $(this).removeClass("b_success_color").addClass("b_color");
        $(this).parent().siblings(".password_tip").hide();
        var password = $("#password").val();
        var pwd_agin = $(this).val();
        if(password!=pwd_agin){
           $(this).parent().siblings(".password_tip_error").show();
        }else{
           $(this).parent().siblings(".password_tip_succ").show();
        }
    })
    
    
    /*获取支付密码框的焦点*/
    $("#pay_password").on("focus",function(){
        $(this).removeClass("b_color").addClass("b_success_color");
        $(this).parent().siblings(".password_tip").show();
    })
    
     /*失去支付密码框的焦点*/
    $("#pay_password").on("blur",function(){
        $(this).removeClass("b_success_color").addClass("b_color");
        $(this).parent().siblings(".password_tip").hide();
    })
    
    
    /*获取再次输入支付密码框的焦点*/
    $("#pay_pwd_agin").on("focus",function(){
        $(this).removeClass("b_color").addClass("b_success_color");
        $(this).parent().siblings(".password_tip").show();
    })
    
     /*失去再次输入支付密码框的焦点*/
    $("#pay_pwd_agin").on("blur",function(){
        $(this).removeClass("b_success_color").addClass("b_color");
        $(this).parent().siblings(".password_tip").hide();
    })
    
    
    /*获取安全保护框的焦点*/
    $("#safe").on("focus",function(){
        $(this).removeClass("b_color").addClass("b_success_color");
        $(this).parent().siblings(".password_tip").show();
    })
    
     /*失去安全保护框的焦点*/
    $("#safe").on("blur",function(){
        $(this).removeClass("b_success_color").addClass("b_color");
        $(this).parent().siblings(".password_tip").hide();
    })
    
    
    
    
})