;
(function (X) {
    var refundApply = X(),
        refundApplyCtrl = refundApply.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"
    var request = refundApply.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  id:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var activePos = request.p ? parseInt(request.p) : 1,//1为收货预报，2为发货单
        postUrl = '';

     //移除掉从其它页面遗留的弹出框
    $('.xubox_shade,.xubox_layer').remove();
    refundApplyCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };
    if (activePos == 1) {
        postUrl = dataPath + X.configer[request.m].api.forecast+'?id='+request.id;
        //防止从详情退回时，面包屑导航文字错误
        document.title = '海外仓财务管理-退款管理-详情-未完成业务-收货预报详情';
    }else if(activePos==2){
        postUrl = dataPath + X.configer[request.m].api.invoice+'?id='+request.id;
        //防止从详情退回时，面包屑导航文字错误
        document.title = '海外仓财务管理-退款管理-详情-未完成业务-发货单详情';
    }

    refundApplyCtrl.request({
        url: postUrl,
        type: 'get',
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            //模板渲染
            data.data.operateData = operateData;
            data.data.activePos = activePos;
            if(activePos==1){
                //收货预报获取物流信息
                refundApplyCtrl.request({
                    url: dataPath + X.configer[request.m].api.track+'?forecastId='+request.id,
                    type: 'get'
                }).then(function (track) {
                    if (track.statusCode == '2000000') {
                        data.data.track = track.data;
                    }else{
                        data.data.track=[{nodeName:'暂无数据'}];
                    }
                    refundApplyCtrl.render(data.data).then(function () {
                        refundApplyCtrl.tirgger('domEvents','#id_conts')
                    });                    
                });                
            }else{
                refundApplyCtrl.render(data.data).then(function () {
                    refundApplyCtrl.tirgger('domEvents','#id_conts')
                });                
            }
        } else {
            refundApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });
    
    refundApplyCtrl.on('domEvents',function(ele){
        //收货预报状态详情
        $(".js-details").on("click",function(){
            var _slid = $(".proList");
            if( _slid.hasClass("switch")){
                _slid.stop().slideDown();
                _slid.prev(".blue").text("收起详情");
                _slid.removeClass("switch");
            }else{
                _slid.stop().slideUp();
                _slid.prev(".blue").text("展开详情");
                _slid.addClass("switch");
            }
        });
        //切换
        $('.tabBtn li').on('click',function(){
            if($(this).hasClass('this')) return;
            var iNow=$(this).index();
            $(this).siblings('.this').removeClass('this').end().addClass('this');
            $('.tabCon .msg-con').addClass('none').eq(iNow).removeClass('none');
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
})(mXbn);