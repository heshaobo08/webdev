;
(function (X) {
    var invoiceApply = X(),
        invoiceApplyCtrl = invoiceApply.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = invoiceApply.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  id:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓业务管理-发票管理-发票申请详情';
    invoiceApplyCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };
    invoiceApplyCtrl.request({
        url: dataPath + X.configer[request.m].api.detail+'?id='+request.id,
        type: 'get',
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            //模板渲染
            data.data.operateData=operateData;
            invoiceApplyCtrl.render(data.data).then(function () {
                invoiceApplyCtrl.tirgger('domEvents','#id_conts')
            });
        } else {
            invoiceApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });

    invoiceApplyCtrl.on('domEvents',function(elem){
        $('.btnMain a').eq(0).removeClass('buttonText').addClass('button');
        //将金额改成千分位写法
        var amount = $('#amount').text();
        if(amount) {
            amount = amount.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
            $('#amount').text(amount);
        }

        //受理
        $('.js-audit').off().on('click', function () {
            invoiceApplyCtrl.tirgger('doPass', [$(this).data('id')]);
        });

        //驳回
        $('.js-reject').off().on('click', function () {
            invoiceApplyCtrl.tirgger('doReject', [$(this).data('id')]);
        });

        //单个寄出
        $('.js-send').off().on('click', function () {
            var id=$(this).data('id');
            $.layer({
                title: '发票寄出',
                area: ['550px', ''],
                dialog: {
                    btns: 2,
                    btn: ['确认', '取消'],
                    type: 8,
                    msg: $('#sendVoiceTmpl').html()
                },
                success: function (layero, index) {
                    invoiceApplyCtrl.tirgger('pickDate');
                    $('#sendVoiceForm').html5Validate(function () {
                        var d = {
                            id: id,
                            logisticsCompany: $('input[name=logisticsCompany2]').val().replace(/^\s+|\s+$/g, ''),
                            logisticsTrackingNumber: $('input[name=logisticsTrackingNumber2]').val().replace(/^\s+|\s+$/g, ''),
                            sendTime: $('#sendTime').text()
                        };
                        invoiceApplyCtrl.request({
                            url: dataPath + X.configer[request.m].api.send,
                            type: 'post',
                            data: JSON.stringify([d])
                        }).then(function (data) {
                            if (data.statusCode == '2000000') {
                                invoiceApplyCtrl.tirgger('setTipsCommit', '发票申请寄出成功！', function () {
                                    invoiceApply.router.runCallback();
                                });
                            } else {
                                invoiceApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                            }
                        });
                    });
                },
                yes: function () {
                    $('#sendVoiceForm').submit();
                },
                no: function () {
                    if ($('#sendVoiceForm').length) $('#validateRemind').remove();
                }
            });
        });
    });

    //受理
    invoiceApplyCtrl.on('doPass', function (ids) {
        invoiceApplyCtrl.request({
            url: dataPath + X.configer[request.m].api.audit,
            type: 'post',
            data: JSON.stringify({
                ids: ids
            })
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                invoiceApplyCtrl.tirgger('setTipsCommit', '发票申请受理成功！',function(){
                    //invoiceApply.router.setHistory('?m=xhr_id_20100000_20107000');
                    invoiceApply.router.runCallback();
                });
            } else {
                invoiceApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
            }
        });
    });

    //驳回
    invoiceApplyCtrl.on('doReject', function (ids) {
        $.layer({
            title: '驳回原因',
            area: ['550px', '400px'],
            dialog: {
                btns: 2,
                btn: ['确认', '取消'],
                type: 8,
                msg: $('#rejectReasonTmpl').html()
            },
            success: function (layero, index) {
                 $('#rejectForm').html5Validate(function () {
                     var val = $('textarea[name=rejectInfo]').val().replace(/(^\s+)|(\s+$)/g, '');
                     invoiceApplyCtrl.request({
                         url: dataPath + X.configer[request.m].api.reject,
                         type: 'post',
                         data: JSON.stringify({
                             ids: ids,
                             rejectInfo: val
                         })
                     }).then(function (data) {
                         if (data.statusCode == '2000000') {
                             invoiceApplyCtrl.tirgger('setTipsCommit', '发票申请驳回成功！', function () {
                                invoiceApply.router.runCallback();
                             });
                         } else {
                             invoiceApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                         }
                     });
                 });
            },
            yes: function () {
                $('#rejectForm').submit();
            },
            no: function () {
                if ($('#rejectForm').length) $('#validateRemind').remove();
            }
        });
    });

    //单个寄出发票
    invoiceApplyCtrl.on('doSend', function (id) {
        $.layer({
            title: '发票寄出',
            area: ['550px', ''],
            dialog: {
                btns: 2,
                btn: ['确认', '取消'],
                type: 8,
                msg: $('#sendVoiceTmpl').html()
            },
            success: function (layero, index) {
                 $('#sendVoiceForm').html5Validate(function () {
                     var val = $('textarea[name=rejectInfo]').val().replace(/(^\s+)|(\s+$)/g, '');
                     invoiceApplyCtrl.request({
                         url: dataPath + X.configer[request.m].api.reject,
                         type: 'post',
                         data: JSON.stringify({
                             ids: ids,
                             rejectInfo: val
                         })
                     }).then(function (data) {
                         if (data.statusCode == '2000000') {
                             invoiceApplyCtrl.tirgger('setTipsCommit', '发票申请寄出成功！', function () {
                                invoiceApply.router.runCallback();
                             });
                         } else {
                             invoiceApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                         }
                     });
                 });
            },
            yes: function () {
                $('##sendVoiceForm').submit();
            },
            no: function () {
                if ($('##sendVoiceForm').length) $('#validateRemind').remove();
            }
        });
    });

    //获取时间
    invoiceApplyCtrl.on('pickDate', function () {
        $('.timeIco').on("click", function () {
            var $this = $(this),
                elemId = $this.siblings('.dateInput').attr('id');
            laydate({
                istime: true,
                elem: '#' + elemId,
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });
    });

    // 提示消息弹框方法定义 ,只有确定按钮
    invoiceApplyCtrl.on('setTipsCommit', function (msg, callback) {
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
    invoiceApplyCtrl.on('setTipsAsk', function (msg, callback) {
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
