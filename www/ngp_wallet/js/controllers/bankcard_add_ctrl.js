/**
 * 添加银行卡
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
        //下一步
        $(".login_phone").on("click", function () {
                var number_card = $("#number_card").val();
                if (!number_card) {
                    utils.appearDiv("phone_error","请填写卡号！");
                    return false;
                }
                var str_card = number_card.replace(/\s+|s+$/g, '');
                var reg = /^(\d{16}|\d{19})$/;
                if (!reg.test(str_card)) {
                    utils.appearDiv("phone_error","请输入正确的卡号！");
                    return false;
                }
                hasher.setHash("bankCard_detail");

            })
            //银行卡号 每隔4位空一个
        $("#number_card").on("keyup", function () {
            $(this).val($(this).val().replace(/\D/g, '').replace(/....(?!$)/g, '$& '))
        })

        //点击按钮逐个删除
        $(".del_tip").on("click", function () {
            $("#number_card").val("");
        });
});