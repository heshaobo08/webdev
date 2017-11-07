;
(function (X) {
    var storehouse = X(),
        storehouseCtrl =  storehouse.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request =  storehouse.utils.getRequest();//{ m:"xhr_id_20100000_20101000",  page:"1"}

    storehouseCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };

    //获取所有国家不分页
    storehouseCtrl.request({
        url: dataPath + X.configer[request.m].api.listNoPage,
        type: "post"
    }).then(function (data) {
        if (data.statusCode == "2000000") {
            //模板渲染
            var countryList = data.data;
             storehouseCtrl.render(data.data).then(function () {
                storehouseCtrl.tirgger('domEvents', "#id_conts");
                //下拉框
                sele('.select', '#id_conts', function (id, text) {
                    if (id) {
                        //从国家列表中找到对应的货币单位
                        var iPos = getPos(countryList, 'id', id);
                        $('#showUnit').find('input').val(iPos != -1 ?countryList[iPos].currencyUnit:'');
                    } else {
                        $('#showUnit').find('input').val('');
                    }
                });
            });
        } else {
            storehouseCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });


    storehouseCtrl.on('domEvents', function (elem) {
        //提交添加
        $('.js-submit').off().on('click', function () {
            $("#addStoreForm").submit();
        });
        storehouseCtrl.tirgger('addStoreFormRender');
    });

    // 表单验证
    storehouseCtrl.on('addStoreFormRender', function () {
        $('#addStoreForm').html5Validate(function () {
            var sendData = {
                storeCode: $('input[name=storeCode]').val(),
                storeName: $('input[name=storeName]').val(),
                address: $('textarea[name=address]').val(),
                consignee: $('input[name=consignee]').val(),
                phonenumber: $('input[name=phonenumber]').val(),
                countryCurrencyId: $('input[name=countryId]').attr('index-data'),
                componyName: $('input[name=componyName]').val(),
                country:$('input[name=countryId]').val(),
                currencyUnit:$('input[name=currencyUnit]').val(),
                sysCode:$('input[name=sysCode]').val()
            };
            storehouseCtrl.request({
                url: dataPath + X.configer[request.m].api.add,
                data: JSON.stringify(sendData),
                type: 'post'
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    storehouseCtrl.tirgger('setTipsCommit', '仓库添加成功！', function () {
                        storehouse.router.setHistory("?m=xhr_id_20100000_20102000");
                        storehouse.router.runCallback();
                        //防止面包屑导航文字不对
                        document.title = '海外仓业务管理-仓库管理';
                    });
                } else {
                    storehouseCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode,'wareErr'));
                }
            });
        });
    });

    // 提示消息弹框方法定义 ,只有确定按钮
    storehouseCtrl.on('setTipsCommit', function (msg, callback) {
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
    storehouseCtrl.on('setTipsAsk', function (msg, callback) {
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

    //从数组中找到元素索引
    function getPos(arr, prop, val) {
        var result = -1;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][prop] == val) {
                result = i;
                break;
            }
        }
        return result;
    }
})(mXbn);