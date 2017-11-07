;
(function (X) {
    var country = X(),
        countryCtrl = country.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = country.utils.getRequest();//{ m:"xhr_id_20100000_20101000",  id:"1"}
    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓系统管理-国家设置-修改';
    countryCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };
    // 获取国家说情
    countryCtrl.request({
        url: dataPath + X.configer[request.m].api.detail + '?id=' + request.id,
        type: 'get'
    }).then(function (data) {
        //模板渲染
        if (data.statusCode == '2000000') {
            countryCtrl.render(data.data).then(function () {
                countryCtrl.tirgger('domEvents', "#id_conts");
            });
        } else {
            countryCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });

    countryCtrl.on('domEvents', function (elem) {
        //提交修改
        $('.js-submit').off().on('click', function () {
            $("#addCountryForm").submit();
        });
        countryCtrl.tirgger('addCountryFormRender');
    });

    // 表单验证
    countryCtrl.on('addCountryFormRender', function () {
        $('#addCountryForm').html5Validate(function () {
            var sendData = {
                id: $('input[name=countryId]').val(),
                country: $('input[name=country]').val(),
                currencyUnit: $('input[name=currencyUnit]').val(),
                applyWarn: $('textarea[name=applyWarn]').val(),
                forbiddenKeys: $('textarea[name=forbiddenKeys]').val()
            };
            countryCtrl.request({
                url: dataPath + X.configer[request.m].api.edit,
                data: JSON.stringify(sendData),
                type: 'post'
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    countryCtrl.tirgger('setTipsCommit', '国家修改成功！', function () {
                        country.router.setHistory("?m=xhr_id_20300000_20301000");
                        country.router.runCallback();
                    });
                } else {
                    countryCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        },{
            validate:function(){
                var reg =/^[A-Z]{3}$/;
                if(!reg.test($('input[name=currencyUnit]').val())){
                    $('input[name=currencyUnit]').testRemind('请输入3位大写字母');
                    return false;
                }
                return true;        
            }
        });
    });

    // 提示消息弹框方法定义 ,只有确定按钮
    countryCtrl.on('setTipsCommit', function (msg, callback) {
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
    countryCtrl.on('setTipsAsk', function (msg, callback) {
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