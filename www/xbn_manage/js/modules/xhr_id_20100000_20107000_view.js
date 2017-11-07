;
(function (X) {
    var invoice = X(),
        invoiceCtrl = invoice.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = invoice.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  id:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓业务管理-发货单管理-详情';
    invoiceCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };

    invoiceCtrl.request({
        url: dataPath + X.configer[request.m].api.detail+'?id='+request.id,
        type: 'get',
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            //模板渲染
            data.data.operateData=operateData;
            invoiceCtrl.render(data.data).then(function () {
                invoiceCtrl.tirgger('domEvents','#id_conts')
            });
        } else {
            invoiceCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });

    invoiceCtrl.on('domEvents',function(elem){
        //切换
        $('.tabBtn li').on('click',function(){
            if($(this).hasClass('this')) return;
            var iNow=$(this).index();
            $(this).siblings('.this').removeClass('this').end().addClass('this');
            $('.tabCon .msg-con').addClass('none').eq(iNow).removeClass('none');
        });
        $(elem).find('.js-cancelSend').off().on('click',function(){
            invoiceCtrl.tirgger('doDelete',[$(this).data('id')]);
        });
        $(elem).find('.js-editRemark').off().on('click',function(){
            if($('.textareaBox').hasClass('none')){
                $('.textBox').addClass('none');
                $('.textareaBox').removeClass('none');
            }else{
                $('.textBox').removeClass('none');
                $('.textareaBox').addClass('none');                
            }
        });
        $(elem).find('.js-closeRemark').off().on('click',function(){
            $('.textBox').removeClass('none');
            $('.textareaBox').addClass('none'); 
        });
        //保存备注信息
        $(elem).find('.js-saveRemark').off().on('click',function(){
            $('#editRemarkForm').submit();
        });
        //表单验证
        $('#editRemarkForm').html5Validate(function () {
            var val=$('.textarea').val().replace(/(^\s+)|(\s+$)/g,'');
            invoiceCtrl.request({
                url: dataPath + X.configer[request.m].api.remark,
                type: 'POST',
                data: JSON.stringify({
                    id: request.id,
                    remark: val
                })
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    invoiceCtrl.tirgger('setTipsCommit', '备注信息修改成功！', function () {
                        $('#editRemarkForm .textarea').val(val);
                        $('.textareaBox').addClass('none');
                        $('.textBox').text(val).removeClass('none');
                    });
                } else {
                    invoiceCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        });  
        //取消发货
        $('.js-cancelSend').on('click',function(){
            invoiceCtrl.tirgger('cancelSend', [request.id],'是否取消该发货单？');
        });
                
        $('.btnMain a').eq(0).removeClass('buttonText').addClass('button');
    });

    //取消发货
    invoiceCtrl.on('cancelSend', function (ids,text) {
        var text = text ? text : '是否取消已选中的发货单？';
        invoiceCtrl.tirgger('setTipsAsk', text, function () {
            invoiceCtrl.request({
                url: dataPath + X.configer[request.m].api.cancelSend,
                type: 'post',
                data: JSON.stringify({
                    ids: ids
                })
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    invoiceCtrl.tirgger('setTipsCommit', '取消成功！',function(){
                        //invoice.router.setHistory('?m=xhr_id_20100000_20107000');
                        invoice.router.runCallback();
                    });
                } else {
                    invoiceCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        });
    });

    // 提示消息弹框方法定义 ,只有确定按钮
    invoiceCtrl.on('setTipsCommit', function (msg, callback) {
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
    invoiceCtrl.on('setTipsAsk', function (msg, callback) {
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