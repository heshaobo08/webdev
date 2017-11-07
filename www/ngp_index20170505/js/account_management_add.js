$(function(){
    /*成功后的点击确定*/
    $("#redirect").on("click",function(){
    	window.location.href = "/management/toSubAccountPage";
    });
    /*失败提示的确定点击*/
    $("#fail").on("click",function(){
        $("#cover").hide();
        $(".account_pop_three").hide();
    });

    /*右上角的叉叉*/
    $(".account_pop_one em").on("click",function(){
        $("#cover").hide();
        $(".account_pop_one").hide();
    });

    //一级全选，反选
    $(".js_quanxuan").off().on("click",function(){
        var comm_all = $(this);
        var goods_delete = $(this).parent().parent().find("input[name=app_box]");
        for(var i=0;i<goods_delete.length;i++){
            if(comm_all.is(':checked')){
                goods_delete[i].checked = true;
            }else{
                goods_delete[i].checked = false;
            }
        }
    });
    
    //二级全选，反选
    $(".js_erquanxuan").off().on("click",function(){
        var comm_all = $(this);
        var goods_delete = $(this).parent().next().find("input[name=app_box]");
        for(var i=0;i<goods_delete.length;i++){
            if(comm_all.is(':checked')){
                goods_delete[i].checked = true;
            }else{
                goods_delete[i].checked = false;
            }
        }
    });
    
    //二级单选取消全选
    $(".js_erquanxuan").on("click",function(){
        var comm_all = $(this).parent().parent().parent().find(".js_quanxuan");
        var goods_delete = $(this).parent().parent().parent().find("h6 input[name=app_box]");
        for(var i=0,n=0;i<goods_delete.length;i++){
            if(goods_delete[i].checked){
                n++;
            }
            if(n){
                $(comm_all).attr("checked",true);
            }else{
                $(comm_all).attr("checked",false);
            }
        }
    });
    
    
    //三级单选取消全选
    $(".authority").delegate("input[name=app_box]","click",function(){
        var comm_all_one = $(this).parents(".account_powers_list").find(".js_quanxuan");
        var comm_all_two = $(this).parent().parent().parent().prev().find(".js_erquanxuan");
        var two = $(this).parents(".account_powers_list").find(".js_erquanxuan");//找到点击选项所在权限的全部二级权限
        var goods_delete = $(this).parent().parent().parent().find("input[name=app_box]");
        for(var i=0,n=0;i<goods_delete.length;i++){
            if(goods_delete[i].checked){
                n++;
            }
            if(n){
                $(comm_all_two).attr("checked",true);
                $(comm_all_one).attr("checked",true);
            }else{
                $(comm_all_two).attr("checked",false);
                if($(two).is(':checked')){
                   $(comm_all_one).attr("checked",true);
                }else{
                    $(comm_all_one).attr("checked",false);
                }
                
            }
        }
    });



    /*保存*/
    $(".account_add_btn").on("click",function(){
        var script_reg = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    	$("html,body").animate({scrollTop:0},500);
        $("#emailconfirm").text($("#email").val());
        //提交后台发送邮件
		var email = $("#emailinput").val();
		var mobile = $("#phoneinput").val();
		//var remark = $("#remarkinput").val().replace(script_reg,"");
        var checked = [];
        $('input:checkbox:checked').each(function() {
            checked.push($(this).val());
        });
        var checkedstr = checked.join(",");
        console.log(checkedstr);
        var errorOff = true;
        if(!email){
            //邮箱为空验证
            $("#emailinput").siblings(".company_form_tip").show();
            errorOff = false;
        }else{
            //邮箱验证
            var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})$/;
            if (!reg.test(email)) {
                $("#emailinput").siblings(".company_form_tip").html("<img src='/static/images/login_error.png'><em>邮箱格式输入错误，请重新输入!</em>").show();
                errorOff = false;
            }
        }
        if (!mobile) {
            //手机号为空验证
            $("#phoneinput").siblings(".company_form_tip").show();
            errorOff = false;
        }else{
            //手机号错误验证
            var reg = /(^13\d{9}$)|(^14\d{9}$)|(^15\d{9}$)|(^16\d{9}$)|(^17\d{9}$)|(^18\d{9}$)|(^19\d{9}$)/g;
            if (!reg.test(mobile)) {
                $("#phoneinput").siblings(".company_form_tip").html("<img src='/static/images/login_error.png'><em>手机号码输入错误，请重新输入!</em>").show();
                errorOff = false;
            }
        }
        if(!checked.length){
            $(".account_powers em").show();
            errorOff = false;
        }else{
            $(".account_powers em").hide();
        }
        if(!errorOff){
            $("html,body").animate({scrollTop:0},500);
            return false;
        }
        $("#cover_two").height($(document).height());
        $("#cover_two").show();
        $(".loading_two").show();
        $.ajax({
            type: "POST",
            url: "/management/addEmployee",
            data: {'email': email, 'mobile': mobile, 'remark': remark,'permission':checkedstr},
            dataType: 'json',
            success: function (data) {
            	if(data.code == 100){
            		 $("#cover").height($(document).height());
            		 $("#cover").show();
            		 $("#emailconfirm").text($("#emailinput").val());
            		 $(".account_pop_two").show();
                     $("#cover_two").hide();
                     $(".loading_two").hide();
                    $("html,body").animate({scrollTop:0},500);
            	}else{
        	        $("#cover").hide();
        	        $(".account_pop_one").hide();
        	        $("#error").text(data.message);
        	        $(".account_pop_three").show();
                    $("#cover_two").hide();
                    $(".loading_two").hide();
            	}
            }
        });
    });
    
    /*点击取消的叉叉*/
     $(".account_pop_two em").on("click",function(){
        $("#cover").hide();
        $(".account_pop_two").hide();
    });
    /*点击取消的叉叉*/
    $(".account_pop_three em").on("click",function(){
        $("#cover").hide();
        $(".account_pop_three").hide();
        window.location.href = "/management/toSubAccountPage";
    });

    /*所有表单获取焦点*/
    $(".account_management_add input").on("focus", function () {
        $(this).removeClass("b_color").addClass("b_success_color");
        $(".company_form_tip").hide();
        $(".company_box input").removeClass("b_error_color").addClass("b_color");
    });
    
});