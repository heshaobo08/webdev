;
(function (X) {
    var storehouse = X(),
        storehouseCtrl = storehouse.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = storehouse.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  id:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    //获取仓库列表的m值 xhr_id_20100000_20101000
    var mLastIndex = request.m.lastIndexOf('_'),
        parentPath_m = request.m.substring(0,mLastIndex);

    storehouseCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };

    storehouseCtrl.request({
        url: dataPath + X.configer[request.m].api.detail+'?id='+request.id,
        type: 'get'
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            //模板渲染
            data.data.operateData=operateData;
            storehouseCtrl.render(data.data).then(function () {
                storehouseCtrl.tirgger('domEvents','#id_conts')
            });
        } else {
            storehouseCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });

    storehouseCtrl.on('domEvents',function(elem){
        $(elem).find('.js-delete').off().on('click',function(){
            storehouseCtrl.tirgger('doDelete',[$(this).data('id')],'是否删除该仓库？');
        });
    });

    //删除
    storehouseCtrl.on('doDelete', function (ids,text) {
        var text = text ? text : '是否删除已选中的仓库？';
        storehouseCtrl.tirgger('setTipsAsk', text, function () {
            storehouseCtrl.request({
                url: dataPath + X.configer[parentPath_m].api.delete,
                type: "post",
                data: JSON.stringify({
                    ids: ids
                })
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    storehouseCtrl.tirgger('setTipsCommit','仓库删除成功！',function(){
                        storehouse.router.setHistory("?m=xhr_id_20100000_20102000");
                        storehouse.router.runCallback();
                        //防止面包屑导航文字不对
                        document.title = '海外仓业务管理-仓库管理';
                    });
                } else {
                    joinWareCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
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
})(mXbn);