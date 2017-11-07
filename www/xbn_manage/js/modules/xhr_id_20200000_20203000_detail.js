;
(function (X) {
    var refundApply = X(),
        refundApplyCtrl = refundApply.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"
    var request = refundApply.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  id:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var activePos = request.p ? parseInt(request.p) : 1,
        postUrl = '',
        userId = request.uid,
        applyId = request.aid;//退款申请id
    

    
    var perPage = 10;//每页显示10条记录
    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓财务管理-退款管理-详情-未完成业务';
    //移除掉从其它页面遗留的弹出框
    $('.xubox_shade,.xubox_layer').remove();
    refundApplyCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };
    if (activePos == 1) {
        postUrl = dataPath + X.configer[request.m].api.forecast;
    } else if (activePos == 2) {
        postUrl = dataPath + X.configer[request.m].api.invoice;
    } else if (activePos == 3) {
        postUrl = dataPath + X.configer[request.m].api.inventory;
    }

    refundApplyCtrl.request({
        url: postUrl,
        data: JSON.stringify({ cpage:1,limit:perPage,userId:request.uid }),
        type: 'post'
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            data.data.operateData = operateData;
            data.data.activePos = activePos;
            data.data.userId = userId;
            data.data.applyId = applyId;
            //模板渲染
            refundApplyCtrl.render(data.data).then(function () {
                //列表渲染和事件触发
                refundApplyCtrl.tirgger('refundApplyRender', data.data);
                //分页渲染
                refundApplyCtrl.renderIn('#pageListTmpl', '.page', data);
                //分页加载
                refundApplyCtrl.tirgger('pageRender', data.data);
            });
        }else{
            refundApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });
    
    // 分页加载
    refundApplyCtrl.on('pageRender', function (data) {
        var cPageNo = request.page?request.page:1,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            refundApplyCtrl.tirgger('searchSubmit', p, function (data) {
                refundApply.router.setHistory("?m=" + request.m + "&p="+activePos+"&uid="+userId+"&page=" + p);
                refundApplyCtrl.tirgger('refundApplyRender', data);
                cPageNo = p;
            });
        });
    });
    
    refundApplyCtrl.on('refundApplyRender',function(data){
        // 数据列表渲染
        refundApplyCtrl.renderIn('#listTmpl', '#listCon', data);
        //触发页面dom事件
        refundApplyCtrl.tirgger('domEvents', "#id_conts");
    });
    
    // 列表搜索提交
    refundApplyCtrl.on('searchSubmit', function (toPageNo, callback) {
        var sendData = {
            cpage: toPageNo,
            limit: perPage,
            userId: userId
        };

        refundApplyCtrl.request({
            url: postUrl,
            type: 'post',
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                data.data.activePos = activePos;
                data.data.userId = userId;
                callback && callback(data.data);
            } else {
                refundApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
            }
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