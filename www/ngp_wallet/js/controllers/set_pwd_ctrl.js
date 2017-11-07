/**
 * 设置密码
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
        //下一步
        $(".login_phone").on("click", function () {
            var pwd_number = $("#pwd_number").val().trim();
            var pwd_numbers = $("#pwd_numbers").val().trim();
            if (!pwd_number) {
                utils.appearDiv("phone_error","请输入密码！");
                return false;
            }
            if (!pwd_numbers) {
                utils.appearDiv("phone_error","请再次输入密码！");
                return false;
            }
            if(pwd_number != pwd_numbers){
                utils.appearDiv("phone_error","两次密码不一致！");
                return false;
            }
            
            $("#cover").height($(document).height());
            $("#cover").show();
            $(".set_pwds").html("密码设置成功");
            $(".pwd_succ").show();
        });
        //密码设置成功去首页
        $(".go_index").on("click",function(){
             hasher.setHash('mine');
        })
        $(".cancel .repeal").on("click", function () {
            $("#cover").hide();
            $(".cancel").hide();
        });
       
});