;
(function (X) {

    var gl_xt = X();

    var ctrl = gl_xt.ctrl();

    var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;

    var dataPath = X.configer.__API_PATH__;

    var request = gl_xt.utils.getRequest();

    var id = request.id;

    ctrl.view = {
        elem: "#id_conts",
        tpl: path + "/" + X.configer[request.m].tpl
    };

    // 提示消息弹框方法定义
    ctrl.on('setTips', function (msg, callback) {
        if (!msg) return;
        $.layer({
            title: '提示消息',
            area: ['500px', '200px'],
            dialog: {
                btns: 2,
                btn: ['确定', '取消'],
                type: 8,
                msg: '<div class="tips mB20"><em>' + msg + '</em></div>',
                yes: function (index) {
                    layer.close(index);
                    // 回调
                    callback && callback();
                },
                no: function (index) {
                    layer.close(index);
                }
            }
        })
    });

    renderData();

    //获取提现手续费
    function getFee(userId, callbakc) {
        var feeValue = 0;
        var userId = userId;//前台用户id;
        //查询会员详情
        ctrl.request({
            url: dataPath + X.configer[request.m].api.user + userId,
            type: "GET",
            data: JSON.stringify({
                "id": id
            })
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                var levelId = data.data.levelId ? data.data.levelId : 0;
                var value = 0;
                //查询会员等级
                ctrl.request({
                    url: dataPath + X.configer[request.m].api.level,
                    type: "POST",
                    data: JSON.stringify({
                        "levelId": levelId,
                        "typeId": 3 //提现手续费类型-3
                    })
                }).then(function (data) {
                    if (data.statusCode == '2000000') {
                        if (data.data != null) {
                            feeValue = data.data[0].value;
                        } else {
                            feeValue = 0;
                        }
                    }

                    if (gl_xt.utils.isFunction(callbakc)) callbakc(feeValue);
                });

            }
        });
        //return value;
    }

    //向后台发送数据
    function renderData() {
        ctrl.request({
            url: dataPath + X.configer[request.m].api.query,
            type: "POST",
            data: JSON.stringify({
                "depositId": id
            })
        }).then(function (data) {
            //处理地址信息
            var arr = data.data.openAccountInfo.split(",");
            data.data.openAccountInfo = $.fn.citySelect.getAreaVal(arr[0], Number(arr[1]), "") + "，" + arr[2];
            //获取提现费用
            //所有操作放在获取提现费用的回调函数里
            getFee(data.data.userId, function (feeValue) {
                data.data.value = feeValue;//提现手续费
                data.data.valueRealSum = feeValue + parseFloat(data.data.realSum); //提现金额（提现手续费+实际到账）
                if (data.statusCode == "2000000") {
                    data.data.value = data.data.value ? data.data.value : 0;
                    ctrl.render(data.data).then(function () {
                        //调用校验
                        validates(data.data.value);

                        $(".js-submit").on("click", function () {
                            $("#financeForm").submit();
                        });

                        /*控制提现状态*/
                        if ($("[name=status]").attr("index-data") == "2") {
                            $(".failReason").show();
                        }

                        sele('.select','body',function(index,val){
                            if (index == "2") {
                                $(".failReason").show();
                                $("[name=failReason]").attr("required", true);
                            } else {
                                $(".failReason").hide();
                                $("[name=failReason]").attr("required", false);
                            }
                        });

                        /*控制提现状态*/
                        //实际到账金额最大值
                        //var iMaxNum = parseFloat(data.data.sum - feeValue);
                        $("[name=realSum]").keyup(function () {
                            var val = $(this).val().replace(/\s+/g, ''),
                                reg = /^\d*\.?\d{0,2}$/;
                            //验证不通过直接置为0
                            if (isNaN(val)) {
                                $(this).val(0);
                            } else {
                                if (!reg.test(val)) {
                                    $(this).val(parseFloat($(this).val()).toFixed(2));
                                }
                                /*if (val > iMaxNum) {
                                    $(this).val(iMaxNum);
                                }*/
                            }
                            var num = parseFloat($(this).val()) ? parseFloat($(this).val()) : 0;
                            $(".valueRealSum").text(num + feeValue);
                        });

                    });
                } else {
                    $(".bigTable tbody").html("<tr><td colspan='5' style='text-align:center'>操作失败</td></tr>");
                }
            });


        });
    }


    function validates(fee) {
        var value = fee;
        $("#financeForm").html5Validate(function () {
            ctrl.tirgger('setTips', '确定提交吗？', function () {
                ctrl.request({
                    url: dataPath + X.configer[request.m].api.edit,
                    type: "POST",
                    data: JSON.stringify({
                        "depositId": id,
                        "status": $("[name=status]").attr("index-data"),
                        "operator": $("[name=operator]").val(),
                        "realSum": $("[name=realSum]").val(),
                        "withdrawFee": value,
                        "failReason": $("[name=failReason]").val(),
                        "remark": $("[name=remark]").val()
                    })
                }).then(function (data) {
                    if (data.statusCode == '2000000') {
                        gl_xt.router.setHistory("?m=xhr_id_173_178");
                        gl_xt.router.runCallback();
                    } else {
                        ctrl.tirgger('setTips', '数据操作失败');
                    }
                });
            });
        });
    }

})(mXbn);