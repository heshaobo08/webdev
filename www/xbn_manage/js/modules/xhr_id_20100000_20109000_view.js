;
(function (X) {
    var suggest = X(),
        suggestCtrl = suggest.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = suggest.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  id:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    suggestCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };

    suggestCtrl.request({
        url: dataPath + X.configer[request.m].api.detail + '?id=' + request.id,
        type: 'get'
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            //模板渲染
            data.data.operateData = operateData;
            /*data.data.content = data.data.content.replace(/</g,"&lt;");
            data.data.content = data.data.content.replace(/>/g,"&gt;");
            data.data.content = data.data.content.replace(/'/g,"&#39;");
            data.data.content = data.data.content.replace(/'/'/g,"&#47;");
            data.data.content = data.data.content.replace(/'\'/g,"&#92;");
            data.data.content = data.data.content.replace(/&/g,"&#38;");
            console.log(data.data.content)*/
            suggestCtrl.render(data.data).then(function () {
                suggestCtrl.tirgger('domEvents', '#id_conts')
            });
        } else {
            suggestCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });

    suggestCtrl.on('domEvents', function (elem) {
        $(".js-handle").on("click", function () {
            $.layer({
                title: '处理结果',
                area: ['550px', ''],
                dialog: {
                    btns: 2,
                    btn: ['确认', '取消'],
                    type: 8,
                    msg: $('#dealBox').html()
                },
                yes: function (index) {
                    suggestCtrl.tirgger('doDeal', index);
                    $('#dealForm').submit();
                },
                no: function (index) {
                    layer.close(index);
                }
            });
            sele();
        });
    });

    //处理
    suggestCtrl.on('doDeal', function (layerIndex) {
        $('#dealForm').html5Validate(function () {
            var sendData = {
                id: $(".js-handle").data('id'),
                suggestLevel: parseInt($('input[name=suggestLevel]').attr('index-data')),
                dealResult: $('textarea[name=dealResult]').val()
            };
            suggestCtrl.request({
                url: dataPath + X.configer[request.m].api.deal,
                data: JSON.stringify(sendData),
                type: 'post'
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    suggestCtrl.tirgger('setTipsCommit', '意见处理成功！', function () {
                        suggest.router.setHistory("?m=xhr_id_20100000_20109000");
                        suggest.router.runCallback();
                        layer.close(layerIndex);
                        //防止面包屑导航文字不对
                        document.title = '海外仓业务管理-意见管理';
                    });
                } else {
                    suggestCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        });
    });

    // 提示消息弹框方法定义 ,只有确定按钮
    suggestCtrl.on('setTipsCommit', function (msg, callback) {
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
    suggestCtrl.on('setTipsAsk', function (msg, callback) {
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
