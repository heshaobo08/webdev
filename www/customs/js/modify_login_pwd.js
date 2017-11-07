$(function(){
    
    $("#password").on("focus",function(){
        $(".modify_one").hide();
        $("#password").removeClass("modify_b_error").addClass("modify_b");
    });
    $("#password_again").on("focus",function(){
        $(".modify_two").hide();
        $("#password_again").removeClass("modify_b_error").addClass("modify_b");
    });
    
    //点击下一步
    $("#customs_btn_next").on("click",function(){
        var password = $("#password").val();
        var password_again = $("#password_again").val();
        var reg = new RegExp("^(?=.{6,20})(((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[a-z])(?=.*\\W))|((?=.*[A-Z])(?=.*[0-9])(?=.*\\W))|((?=.*[a-z])(?=.*[0-9])(?=.*\\W)))|(?=.{6,20})(((?=.*[A-Z])(?=.*\\W))|((?=.*[a-z])(?=.*\\W))|((?=.*[0-9])(?=.*\\W))|((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        if(!password){
            $(".modify_one").html("请输入登录密码").show();
            $("#password").removeClass("modify_b").addClass("modify_b_error");
            return false;
        }
        if(password.length>20 || password.length<6){
            $(".modify_one").html("登录密码设置不符合要求，请重新输入！").show();
            $("#password").removeClass("modify_b").addClass("modify_b_error");
            return false;
        }
        if(!reg.test(password)){
            $(".modify_one").html("登录密码设置不符合要求，请重新输入！").show();
            $("#password").removeClass("modify_b").addClass("modify_b_error");
            return false;
        }
        if(password !=password_again){
            $(".modify_two").html("两次输入的密码不一致,请重新输入！").show();
            $("#password_again").removeClass("modify_b").addClass("modify_b_error");
            return false;
        }
        window.location.href="modify_login_pwd_success.html";
        
    });
    
    $(".modify_set").on("mouseover",function(){
        $(".modify_tip").show();
    });
    $(".modify_set").on("mouseout",function(){
        $(".modify_tip").hide();
    });
})