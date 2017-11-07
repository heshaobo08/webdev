;
(function (X) {
    var customerService = X(),
        customerServiceCtrl = customerService.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = customerService.utils.getRequest();//{ m:"xhr_id_20100000_20101000",  page:"1"}

    customerServiceCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };

    // 模板渲染
    customerServiceCtrl.render().then(function () {
        customerServiceCtrl.tirgger('domEvents', '#id_conts');
    });

    customerServiceCtrl.on('domEvents', function (elem) {
        //提交添加
        $('.js-submit').off().on('click', function () {
            $("#addCustomerForm").submit();
        });
        customerServiceCtrl.tirgger('addCustomerFormRender');
    });

    // 表单验证
    customerServiceCtrl.on('addCustomerFormRender', function () {
        $('#addCustomerForm').html5Validate(function () {
            var sendData = {
                name: $('input[name=name]').val(),
                qq: $('input[name=qq]').val()
            };
            customerServiceCtrl.request({
                url: dataPath + X.configer[request.m].api.add,
                data: JSON.stringify(sendData),
                type: 'post'
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    customerServiceCtrl.tirgger('setTipsCommit', '客服添加成功！', function () {
                        customerService.router.setHistory("?m=xhr_id_20100000_20108000");
                        customerService.router.runCallback();
                        //防止面包屑导航文字不对
                        document.title = '海外仓业务管理-客服信息管理';
                    });
                } else {
                    customerServiceCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode,'wareErr'));
                }
            });
        });
    });

    // 提示消息弹框方法定义 ,只有确定按钮
    customerServiceCtrl.on('setTipsCommit', function (msg, callback) {
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
    customerServiceCtrl.on('setTipsAsk', function (msg, callback) {
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