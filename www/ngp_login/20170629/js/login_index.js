$(function () {
    
    /*密码登录框的切换*/
    $(".ngp_login_btn").on("click",function(){
        $(".ngp_login_box_one").hide();
        $(".ngp_login_box").slideDown(1000);
    });
    
    /*合作伙伴tab*/
    $(".cooperation ul li").on("click",function(){
        $(".cooperation ul li").removeClass("cooperation_ative");
        $(this).addClass("cooperation_ative");
        $(".cooperation_list").hide();
        $(".cooperation_list:eq("+ $(this).index()+")").show();
    });
    

    /*获取登录框的焦点*/
    $(".login_input").on("focus", function () {
        $(this).removeClass("login_bg").addClass("b_success_color");
        $(this).removeClass("b_error_color").addClass("b_success_color");
        $(this).siblings(".login_del").find("img").attr("src","images/login_del.png");
        $(this).siblings("span").show();
    });

    $(".login_input").on("blur", function () {
    	$(this).removeClass("b_success_color").addClass("login_bg");
        if(!$(this).val()){
           $(this).siblings("span").hide(); 
        }
        
    });
    
    $(".login_del").on("click",function(){
        $(".login_name_top input").val("");
    });
    
    /*获取验证码框的焦点*/
    $(".login_yzm_w").on("focus", function () {
        $(this).removeClass("login_bg").addClass("b_success_color");
        $(this).removeClass("b_error_color").addClass("b_success_color");
        $(this).siblings(".login_yzm_del").find("img").attr("src","images/login_del.png");
        $(this).siblings("span").show();
    });
    $(".login_yzm_w").on("blur", function () {
        var code = $(this).val();
        $.ajax({
            type: "GET",
            url: "/authImageCode",
            data: {'code':code},
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                	 $(this).removeClass("b_success_color").addClass("login_bg");
                     $(this).siblings(".login_yzm_del").hide();  
                }else if(data.code == 300){
                	 $(this).removeClass("login_bg").addClass("b_error_color");
                     $(this).siblings(".login_yzm_del").find("img").attr("src","images/login_error.png");
                }
            },
            error: function (data) {

            }
        });
    });
    
    $(".login_yzm_del").on("click",function(){
        $(".login_pwd_y input").val("");
    });
    
    /*登录*/
    $(".js_login_btn").on("click",function(){
        var login_name = $("#login_name").val();
        var login_pwsd = $("#login_pwsd").val();
        var login_yzm = $("#login_yzm").val();
        if(login_name == ""){
            $("#login_name").removeClass("login_bg").addClass("b_error_color");
            $("#login_name").siblings(".login_del").show();
            $("#login_name").siblings(".login_del").find("img").attr("src","images/login_error.png");
            return false;
        }
       if(login_pwsd ==""){
            $("#login_pwsd").removeClass("login_bg").addClass("b_error_color");
            $("#login_pwsd").siblings(".login_del").show();
            $("#login_pwsd").siblings(".login_del").find("img").attr("src","images/login_error.png");
            return false;
        }
       //不用控件使用的方法
       $.ajax({
           type: "POST",
           url: "/tologin",
           data: {'email':login_name,"password":login_pwsd,"code":login_yzm},
           dataType: 'json',
           success: function (data) {
               if (data.code == 200) {
            	   window.location.href = data.message;
               }else if(data.code == 300){
            	   $(".login_error_tip").html(data.message);
            	   $(".login_error_tip").show();
               }
           },
           error: function (data) {

           }
       });
       //用控件使用的方法
       //setcurite();
    });
    
    /*回车提交*/
    $(document).keyup(function(event){
        if(event.keyCode ==13){
            $(".js_login_btn").trigger("click");
        }
    });
    
    
    
})