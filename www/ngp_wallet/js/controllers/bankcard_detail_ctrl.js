/**
 * 填写银行卡信息
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
        //下一步
        $(".login_phone").on("click", function () {
                //验证身份证
                var number_id = $("#number_id").val().trim();
                if (!number_id) {
                    utils.appearDiv("phone_error","请输入身份证号码！");
                    return false;
                }
                //手机号验证	
                var reg = /(^13\d{9}$)|(^14\d{9}$)|(^15\d{9}$)|(^16\d{9}$)|(^17\d{9}$)|(^18\d{9}$)|(^19\d{9}$)/g;
                var mobileP = $("#number_phone").val().trim();
                if (!mobileP) {
                    utils.appearDiv("phone_error","请输入手机号！");
                    return false;
                }
                if (!reg.test(mobileP)) {
                    utils.appearDiv("phone_error","手机号码输入错误！");
                    return false;
                }
                hasher.setHash("phone_verify");
                //window.location = "phone_verify.html";

            })
            //银行卡号 每隔4位空一个
        $("#number_card").on("keyup", function () {
            $(this).val($(this).val().replace(/\D/g, '').replace(/....(?!$)/g, '$& '))
        })

        //点击按钮删除
        $(".del_tip").on("click", function () {
            $("#number_card").val("");
        });
});