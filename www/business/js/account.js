$(function () {
    //下来菜单获取值
    $('[name="nice-select"]').click(function (e) {
        $('[name="nice-select"]').find('ul').hide();
        $(this).find('ul').show();
        e.stopPropagation();
    });
    $('[name="nice-select"] li').hover(function (e) {
        $(this).toggleClass('on');
        e.stopPropagation();
    });
    $('[name="nice-select"] li').click(function (e) {
        //val是汉字
        var val = $(this).text();
        //dataVal是123
        var dataVal = $(this).attr("data-value");
        $(this).parents('[name="nice-select"]').find('input').val(val);
        $('[name="nice-select"] ul').hide();
        e.stopPropagation();
        $(".js_safe").hide();
    });
    $(document).click(function () {
        $('[name="nice-select"] ul').hide();
    });


    /*获取登录密码框的焦点*/
    $("#password").on("focus", function () {
        $(this).removeClass("b_color").addClass("b_success_color");
        $(this).parent().siblings(".password_tip").show();
        $(this).parent().siblings(".password_tip_error").hide();
        $(this).parent().siblings(".password_tip_succ").hide();
    })

    /*失去登录密码框的焦点*/
    $("#password").on("blur", function () {
        $(this).removeClass("b_success_color").addClass("b_color");
        $(this).parent().siblings(".password_tip").hide();
        var password = $(this).val().trim();
        var that = this;
        passwordCkeck(password, that);
    })

    /*获取再次输入密码框的焦点*/
    $("#pwd_agin").on("focus", function () {
        $(this).removeClass("b_color").addClass("b_success_color");
        $(this).parent().siblings(".password_tip").show();
        $(this).parent().siblings(".password_tip_error").hide();
        $(this).parent().siblings(".password_tip_succ").hide();
    })

    /*失去再次输入密码框的焦点*/
    $("#pwd_agin").on("blur", function () {
        $(this).removeClass("b_success_color").addClass("b_color");
        $(this).parent().siblings(".password_tip").hide();
        var password = $("#password").val();
        var pwd_agin = $(this).val();
        if (password) {
            if (password != pwd_agin) {
                $(this).parent().siblings(".password_tip_error").show();
            } else {
                $(this).parent().siblings(".password_tip_succ").show();
            }
        } else {
            $(this).parent().siblings(".password_tip_succ").hide();
        }

    })


    /*获取支付密码框的焦点*/
    $("#pay_password").on("focus", function () {
        $(this).removeClass("b_color").addClass("b_success_color");
        $(this).parent().siblings(".password_tip").show();
        $(this).parent().siblings(".password_tip_error").hide();
        $(this).parent().siblings(".password_tip_same").hide();
        $(this).parent().siblings(".password_tip_succ").hide();
    })

    /*失去支付密码框的焦点*/
    $("#pay_password").on("blur", function () {
        $(this).removeClass("b_success_color").addClass("b_color");
        $(this).parent().siblings(".password_tip").hide();
        var pay_password = $(this).val().trim();
        var psd = $("#password").val().trim();
        var that = this
        passwordCkeck(pay_password, that, psd);
    })


    /*获取再次输入支付密码框的焦点*/
    $("#pay_pwd_agin").on("focus", function () {
        $(this).removeClass("b_color").addClass("b_success_color");
        $(this).parent().siblings(".password_tip").show();
        $(this).parent().siblings(".password_tip_error").hide();
        $(this).parent().siblings(".password_tip_succ").hide();
    })

    /*失去再次输入支付密码框的焦点*/
    $("#pay_pwd_agin").on("blur", function () {
        $(this).removeClass("b_success_color").addClass("b_color");
        $(this).parent().siblings(".password_tip").hide();
        var pay_password = $("#pay_password").val();
        var pay_pwd_agin = $(this).val();
        if (pay_password) {
            if (pay_password != pay_pwd_agin) {
                $(this).parent().siblings(".password_tip_error").show();
            } else {
                $(this).parent().siblings(".password_tip_succ").show();
            }
        } else {
            $(this).parent().siblings(".password_tip_succ").hide();
        }
    })


    /*获取安全保护框的焦点*/
    $("#safe").on("focus", function () {
        $(this).removeClass("b_color").addClass("b_success_color");
        $(this).parent().siblings(".password_tip").show();
        $(this).parent().siblings(".password_tip_error").hide();
        $(this).parent().siblings(".password_tip_succ").hide();
    })

    /*失去安全保护框的焦点*/
    $("#safe").on("blur", function () {
        $(this).removeClass("b_success_color").addClass("b_color");
        $(this).parent().siblings(".password_tip").hide();
        var safe_str = $(this).val().trim();
        if (safe_str && safe_str.length >= 2 && safe_str.length <= 32) {
            $(this).parent().siblings(".password_tip_succ").show();
        } else {
            $(this).parent().siblings(".password_tip_error").show();
        }
    })


    function passwordCkeck(password, that, psd) {
        var str = /[\u4E00-\u9FA5]/g;
        /*
        高级
        16-20两种字符
        14-20三种字符
        6-20四种字符
        */
        var strongRegex = new RegExp("^(?=.{6,20})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W)|(?=.{14,20})(((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[a-z])(?=.*\\W))|((?=.*[A-Z])(?=.*[0-9])(?=.*\\W))|((?=.*[a-z])(?=.*[0-9])(?=.*\\W)))|(?=.{16,20})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*\\W))|((?=.*[a-z])(?=.*\\W))|((?=.*[0-9])(?=.*\\W))).*$", "g");
        
        /*
        中级
        6-13三种字符
        6-15两种字符
        */
        var mediumRegex = new RegExp("^(?=.{6,13})(((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[a-z])(?=.*\\W))|((?=.*[A-Z])(?=.*[0-9])(?=.*\\W))|((?=.*[a-z])(?=.*[0-9])(?=.*\\W)))|(?=.{6,15})(((?=.*[A-Z])(?=.*\\W))|((?=.*[a-z])(?=.*\\W))|((?=.*[0-9])(?=.*\\W))|((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        /*
        低级
        6-20单种字符
        */
        var enoughRegex = new RegExp("^(?=.{6,20}).*$", "g");
        if(password == psd){
            $(that).parent().siblings(".password_tip_succ").hide();
            $(that).parent().siblings(".password_tip_safe").hide();
            $(that).parent().siblings(".password_tip_same").show();
            return false;
        }
        if (password && password.length <= 20 && !str.test(password)) {
            if (!enoughRegex.test(password)) {
                $(that).parent().siblings(".password_tip_safe").show();
                $(that).parent().siblings(".password_tip_safe").find("span").css("background-color", "#ccc");
                $(that).parent().siblings(".password_tip_safe").find("span:eq(0)").css("background-color", "#ff0000");
                $(that).parent().siblings(".password_tip_safe").find("em").html("低");
                $(that).parent().siblings(".password_tip_safe").find("em").css("color", "#ff0000");
                $(that).parent().siblings(".password_tip_error").show();
                return false;
            } else if (strongRegex.test(password)) {
                $(that).parent().siblings(".password_tip_safe").show();
                $(that).parent().siblings(".password_tip_safe").find("span:eq(0)").css("background-color", "#5acb02");
                $(that).parent().siblings(".password_tip_safe").find("span:eq(1)").css("background-color", "#5acb02");
                $(that).parent().siblings(".password_tip_safe").find("span:eq(2)").css("background-color", "#5acb02");
                $(that).parent().siblings(".password_tip_safe").find("em").html("高");
                $(that).parent().siblings(".password_tip_safe").find("em").css("color", "#5acb02");
                $(that).parent().siblings(".password_tip_succ").show();

            } else if (mediumRegex.test(password)) {
                $(that).parent().siblings(".password_tip_safe").show();
                $(that).parent().siblings(".password_tip_safe").find("span").css("background-color", "#ccc");
                $(that).parent().siblings(".password_tip_safe").find("span:eq(0)").css("background-color", "#ff9600");
                $(that).parent().siblings(".password_tip_safe").find("span:eq(1)").css("background-color", "#ff9600");
                $(that).parent().siblings(".password_tip_safe").find("em").html("中");
                $(that).parent().siblings(".password_tip_safe").find("em").css("color", "#ff9600");
                $(that).parent().siblings(".password_tip_succ").show();

            } else {
                $(that).parent().siblings(".password_tip_safe").show();
                $(that).parent().siblings(".password_tip_safe").find("span").css("background-color", "#ccc");
                $(that).parent().siblings(".password_tip_safe").find("span:eq(0)").css("background-color", "#ff0000");
                $(that).parent().siblings(".password_tip_safe").find("em").html("低");
                $(that).parent().siblings(".password_tip_safe").find("em").css("color", "#ff0000");
                $(that).parent().siblings(".password_tip_error").show();

            }
        } else {
            $(that).parent().siblings(".password_tip_safe").hide();
            $(that).parent().siblings(".password_tip_error").show();
            return false;
        }

    }

    /*点击下一步*/
    $(".account_next").on("click", function () {
        var str = /[\u4E00-\u9FA5]/g;
        var num = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/;
        var nums = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/;
        var email = $(".user_name em").text();
        var password = $("#password").val().trim();
        var pwd_agin = $("#pwd_agin").val().trim();
        var pay_password = $("#pay_password").val().trim();
        var pay_pwd_agin = $("#pay_pwd_agin").val().trim();
        var select_num = $("#select_num").val();
        var safe = $("#safe").val();
        if (!password || password.length > 20 || password.length < 6 || str.test(password) || !num.test(password)) {
            $(this).siblings(".account_tip:eq(0)").find(".password_tip_error").show();
            return false;
        }
        if (password != pwd_agin) {
            $(this).siblings(".account_tip:eq(1)").find(".password_tip_error").show();
            $(this).siblings(".account_tip:eq(1)").find(".password_tip_succ").hide();
            return false;
        }

        if(password == pay_password){
            $(this).siblings(".account_tip:eq(2)").find(".password_tip_same").show();
            return false;
        }

        if (!pay_password || pay_password.length > 20 || pay_password.length < 6 || str.test(pay_password) || !nums.test(pay_password)) {
            $(this).siblings(".account_tip:eq(2)").find(".password_tip_error").show();
            return false;
        }

        if (pay_password != pay_pwd_agin) {
            $(this).siblings(".account_tip:eq(3)").find(".password_tip_error").show();
            $(this).siblings(".account_tip:eq(3)").find(".password_tip_succ").hide();
            return false;
        }

        if (!select_num) {
            $(".js_safe").show();
            return false;
        }

        if (!safe || safe.length < 2 || safe.length > 32) {
            $(this).siblings(".account_tip:eq(4)").find(".password_tip_error").show();
            return false;
        }
        $("#email").val(email);
        $("#passWordOne").val(password);
        $("#passWordTwo").val(pwd_agin);
        $("#payWordOne").val(pay_password);
        $("#payWordTwo").val(pay_pwd_agin);
        $("#question").val(select_num);
        $("#answer").val(safe);
        $("#cover_two").height($(document).height());
        $("#cover_two").show();
        $(".loading").show();
        $("html,body").animate({scrollTop:0},500);
        $("#form").submit();
    })
    
    /*点击保存员工*/
    $(".employee_save").on("click", function () {
    	var str = /[\u4E00-\u9FA5]/g;
        var num = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/;
        var nums = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/;
    	var email = $(".user_name em").text();
    	var password = $("#password").val().trim();
    	var pwd_agin = $("#pwd_agin").val().trim();
    	var pay_password = $("#pay_password").val().trim();
    	var pay_pwd_agin = $("#pay_pwd_agin").val().trim();
    	var select_num = $("#select_num").val();
    	var safe = $("#safe").val();
    	if (!password || password.length > 20 || password.length < 6 || str.test(password) || !num.test(password)) {
    		$(this).siblings(".account_tip:eq(0)").find(".password_tip_error").show();
    		return false;
    	}
    	if (password != pwd_agin) {
    		$(this).siblings(".account_tip:eq(1)").find(".password_tip_error").show();
    		$(this).siblings(".account_tip:eq(1)").find(".password_tip_succ").hide();
    		return false;
    	}
    	
    	if (!pay_password || pay_password.length > 20 || pay_password.length < 6 || str.test(pay_password) || !nums.test(pay_password) || password == pay_password) {
    		$(this).siblings(".account_tip:eq(2)").find(".password_tip_error").show();
    		return false;
    	}
    	
    	if (pay_password != pay_pwd_agin) {
    		$(this).siblings(".account_tip:eq(3)").find(".password_tip_error").show();
    		$(this).siblings(".account_tip:eq(3)").find(".password_tip_succ").hide();
    		return false;
    	}
    	
    	if (!select_num) {
    		$(".js_safe").show();
    		return false;
    	}
    	
    	if (!safe || safe.length < 2 || safe.length > 32) {
    		$(this).siblings(".account_tip:eq(4)").find(".password_tip_error").show();
    		return false;
    	}
    	$("#email").val(email);
    	$("#passWordOne").val(password);
    	$("#passWordTwo").val(pwd_agin);
    	$("#payWordOne").val(pay_password);
    	$("#payWordTwo").val(pay_pwd_agin);
    	$("#question").val(select_num);
    	$("#answer").val(safe);
    	$("#form").submit();
    })


})