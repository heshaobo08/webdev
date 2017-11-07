;(function (X) {
    var refundApply = X(),
        refundApplyCtrl = refundApply.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = refundApply.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  id:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    refundApplyCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };
    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓系统管理-退款管理-退款';
    refundApplyCtrl.request({
        url: dataPath + X.configer[request.m].api.detail,
        data: JSON.stringify({ id:request.id }),
        type: 'post'
    }).then(function (data) {
        if (data.statusCode == '2000000') {

            //获取账户信息中的可退金额
            refundApplyCtrl.request({
                url: dataPath + X.configer[request.m].api.account+'?userId='+data.data.userId,
                type: 'get'
            }).then(function (accountData) {
                if (accountData.statusCode == '2000000') {
                    data.data.vailableBalance = accountData.data.vailableBalance;
                } else {
                    data.data.vailableBalance = 0;
                }
                //模板渲染
                data.data.operateData = operateData;
                refundApplyCtrl.render(data.data).then(function () {
                    //表单校验加载
                    refundApplyCtrl.tirgger('formValide');
                    refundApplyCtrl.tirgger('domEvents', '#id_conts');
                });
            });
        } else {
            refundApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });

    //表单验证
    refundApplyCtrl.on('formValide', function () {
        // 表单验证
        $('#returnForm').html5Validate(function () {
            var sendData = {
                id: request.id,
                refundAmount:Number($('input[name=refundAmount]').val()), //付款金额
                payBankName: $('input[name=payBankName]').val(), //付款人开户银行
                payUserFullName: $('input[name=payUserFullName]').val(), //付款人户名全称
                payBankAccount: $('input[name=payBankAccount]').val(), //付款人银行帐号
                detailCode: $('input[name=detailCode]').val(), //打款小票流水号
                payTime: $('#timeStart').text(), //打款时间
                remark:$('textarea[name=remark]').val().replace(/^\s+|\s+$/g,'') //备注
            };
            refundApplyCtrl.request({
                url: dataPath + X.configer[request.m].api.refundToBank,
                data: JSON.stringify(sendData),
                type: 'post'
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    refundApplyCtrl.tirgger('setTipsCommit', '退款成功！', function () {
                        refundApply.router.setHistory('?m=xhr_id_20200000_20203000');
                        refundApply.router.runCallback();
                        //防止面包屑导航文字不对
                        document.title = '海外仓财务管理-退款管理';
                    });
                } else {
                    refundApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode,'wareErr'));
                }
            });
        },{
            validate: function () {
                if (!$('#timeStart').text()) {
                    $('#timeStart').testRemind('请选择付款时间');
                    return false;
                }
                //退款金额不能大于用户可能金额
                var refundAmountIpt=$('input[name=refundAmount]');
                if (refundAmountIpt.val()&&refundAmountIpt.val()>refundAmountIpt.data('imax')) {
                    refundAmountIpt.testRemind('退款金额不能大于用户可能金额'+refundAmountIpt.data('imax'));
                    return false;
                }
                return true;
            }
        });
    });

    refundApplyCtrl.on('domEvents', function (elem) {
        $('.js-save').off().on('click', function () {
            $('#returnForm').submit();
            return false;
        });
        $('.timeStart').on('click', function () {
            laydate({
                istime: true,
                elem: '#timeStart',
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });
    });
    // 提示消息弹框方法定义 ,只有确定按钮
    refundApplyCtrl.on('setTipsCommit', function (msg, callback) {
        if (!msg) return;
        $.layer({
            title: '提示消息',
            area: ['500px', ''],
            dialog: {
                msg: '<div class="tips">' + msg + '</div>',
                yes: function (index) {
                    layer.close(index);
                    callback && callback();
                }
            }
        })
    });

    // 提示消息弹框方法定义,有确定和取消按钮
    refundApplyCtrl.on('setTipsAsk', function (msg, callback) {
        if (!msg) return;
        $.layer({
            title: '提示消息',
            area: ['500px', ''],
            dialog: {
                btns: 2,
                btn: ['确定', '取消'],
                type: 8,
                msg: '<div class="tips">' + msg + '</div>',
                yes: function (index) {
                    layer.close(index);
                    callback && callback();
                },
                no: function (index) {
                    layer.close(index);
                }
            }
        })
    });
})(mXbn);
