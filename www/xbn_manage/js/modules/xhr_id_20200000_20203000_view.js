;
(function (X) {
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
    //防止面包屑导航文字不对
    document.title='海外仓财务管理-退款管理-退款申请详情';
    refundApplyCtrl.request({
        url: dataPath + X.configer[request.m].api.detail,
        data: JSON.stringify({ id:request.id }),
        type: 'post'
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            //模板渲染
            data.data.operateData=operateData;
            refundApplyCtrl.render(data.data).then(function () {
                refundApplyCtrl.tirgger('domEvents','#id_conts')
            });
        } else {
            refundApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });

    refundApplyCtrl.on('domEvents', function (elem) {
        $('.btnMain a').eq(0).removeClass('buttonText').addClass('button');
        //驳回
        $('.js-reject').off().on("click", function () {
            var returnId = $('#refundId').val();
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
                         refundApplyCtrl.request({
                             url: dataPath + X.configer[request.m].api.rejectRefundApply,
                             type: 'POST',
                             data: JSON.stringify({
                                 id: returnId,
                                 rejectInfo: val
                             })
                         }).then(function (data) {
                             if (data.statusCode == '2000000') {
                                 refundApplyCtrl.tirgger('setTipsCommit', '退款驳回成功！', function () {
                                    refundApply.router.runCallback();
                                 });
                             } else {
                                 refundApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
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
        //受理
        $('.js-accept').off().on('click', function () {
            var returnId = $('#refundId').val(),
                userId = $('#userId').val();
            refundApplyCtrl.request({
                url: dataPath + X.configer[request.m].api.dealRefundApply,
                type: 'post',
                data: JSON.stringify({id: returnId,userId:userId})
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    refundApplyCtrl.tirgger('setTipsCommit', '您已受理成功！',function(){
                        //refundApply.router.setHistory('?m=xhr_id_20100000_20107000');
                        refundApply.router.runCallback();
                    });
                } else {
                    var text=X.getErrorName(data.statusCode, 'wareErr');
                    if(data.statusCode=='9000001'){text+='<a data-href="?m=xhr_id_20200000_20203000_detail&p=1&uid='+userId+'" class="mL10 blue" href="javascript:;">未完成业务详情</a>'}
                    refundApplyCtrl.tirgger('setTipsCommit',text);
                }
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
