/**
 * 绑定新手机
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
        //点击删除
        $(".del_tip").on("click", function () {
           $("#phone_number").val("");
        });
        $(".login_phone").on("click", function () {
            var old_pay = $("#old_pay").val().trim();
            var new_pay = $("#new_pay").val().trim();
            var old_pay = $("#old_pay").val().trim();
            var new_pay_agin = $("#new_pay_agin").val().trim();
            if (!old_pay) {
                utils.appearDiv("phone_error","请输入旧支付密码！");
                return false;
            }
            if (!new_pay) {
                utils.appearDiv("phone_error","请输入新支付密码！");
                return false;
            }
            if (!new_pay_agin) {
                utils.appearDiv("phone_error","请再次新支付密码！");
                return false;
            }
             if (new_pay !=new_pay_agin) {
                utils.appearDiv("phone_error","两次支付密码不一致！");
                return false;
            }
            $("#cover").height($(document).height());
            $("#cover").show();
            $(".set_pwds").html("修改成功!");
            $(".pwd_succ").show();
        });
        $(".go_index").on("click",function(){
             hasher.setHash('mine');
        })
        $(".cancel .repeal").on("click", function () {
            $("#cover").hide();
            $(".cancel").hide();
        });
    
});