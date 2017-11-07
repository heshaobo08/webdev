;
(function (X) {
    var invoiceApply = X(),
        invoiceApplyCtrl = invoiceApply.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = invoiceApply.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  id:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓业务管理-发票管理-批量寄出';
    var rendData={
        data:{
            list:JSON.parse(localStorage.invoiceApplyData),
            operateData:operateData
        }
    };
    invoiceApplyCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };

    invoiceApplyCtrl.render(rendData.data).then(function () {
        invoiceApplyCtrl.renderIn('#listTmpl', '#listCon', rendData.data);
        invoiceApplyCtrl.tirgger('domEvents','#id_conts');
    });
    
    invoiceApplyCtrl.on('domEvents',function(elem){
        //将金额改成千分位写法
        $('.amount').each(function(){
            var amount = $(this).text();
            if(amount) {
                amount = amount.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
                $(this).text(amount);
            }          
        });
        
        invoiceApplyCtrl.tirgger('pickDate');
        invoiceApplyCtrl.tirgger('formRender');
        //寄出发票
        $('.js-send').off().on('click', function () {
            $('#sendVoiceForm').submit();         
        }); 
    });
    
    // 表单验证
    invoiceApplyCtrl.on('formRender', function () {
        $('#sendVoiceForm').html5Validate(function () {
            var sendData = [];
            $('#listCon tr').each(function(){
                sendData.push({
                    id:$(this).data('id'),
                    logisticsCompany:$(this).find('input[name=logisticsCompany]').val(),
                    logisticsTrackingNumber:$(this).find('input[name=logisticsTrackingNumber]').val(),
                    sendTime:$(this).find('.dateInput').text()
                });
            });
            invoiceApplyCtrl.request({
                url: dataPath + X.configer[request.m].api.send,
                data: JSON.stringify(sendData),
                type: 'post'
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    invoiceApplyCtrl.tirgger('setTipsCommit', '发票寄出成功！', function () {
                        invoiceApply.router.setHistory("?m=xhr_id_20200000_20202000");
                        invoiceApply.router.runCallback();
                        //防止面包屑导航文字不对
                        document.title = '海外仓财务管理-发票管理';
                    });
                } else {
                    invoiceApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode,'wareErr'));
                }
            });
        }, {
            validate: function () {
                var isCanSubmit=true;
                $('.dateInput').each(function(){
                    if(!$(this).text().length){
                        $(this).closest('.deadline').testRemind('请选择寄出时间');
                        isCanSubmit=false;
                        return false;
                    }
                });
                if(!isCanSubmit) return false;
                return true;
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
})(mXbn);