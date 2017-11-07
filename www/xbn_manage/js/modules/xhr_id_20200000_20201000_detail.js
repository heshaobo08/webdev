;
(function (X) {
    var suggest = X(),

        suggestCtrl = suggest.ctrl(),

        path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址

        dataPath = X.configer.__OWMS_PATH__,//请求地址前缀

        request = suggest.utils.getRequest();

    //在帐户详情里设置
    var userId = JSON.parse(localStorage.user).uid,
        requestId = JSON.parse(localStorage.user).requestId;

    suggestCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };

    suggestCtrl.request({
        url: dataPath + X.configer[request.m].api.detail,
        data: JSON.stringify({
            "id": request.id,
            "dealItem": request.dealItem
        }),
        type: 'post'
    }).then(function (data) {
        var renderInObj = '';
        if (data.statusCode == '2000000') {
            //模板渲染
             //收款人信息
            var receiptBankInfo = constantValue.OwmsReceiptBankInfo;
            if(data.data.accountDetailDTO.dealItem != 10 && data.data.accountDetailDTO.dealItem != 11){
                data.data.receiptBankAccount = receiptBankInfo.receiptBankAccount;
                data.data.receiptBankName = receiptBankInfo.receiptBankName;
                data.data.receiptUserFullName = receiptBankInfo.receiptUserFullName;
            }

            suggestCtrl.render(data.data).then(function () {
                switch(data.data.accountDetailDTO.dealItem){
                    case 1:
                        renderInObj = '#details_online';
                    break;
                    case 2:
                        renderInObj = '#details_offline';
                    break;
                    case 3:
                        renderInObj = '#details_xbn';
                    break;
                    case 4:
                        renderInObj = '#details_firstLeg';
                    break;
                    case 5:
                        renderInObj = '#details_premium';
                    break;
                    case 6:
                        renderInObj = '#details_rent';
                    break;
                    case 7:
                        renderInObj = '#details_warehouse';
                    break;
                    case 8:
                        renderInObj = '#details_orderFee';
                    break;
                    case 9:
                        renderInObj = '#details_overseas';
                    break;
                    case 10:
                        renderInObj = '#details_refundBalance';
                    break;
                    case 11:
                        renderInObj = '#details_refundMember';
                    break;
                }

                suggestCtrl.renderIn(renderInObj, '#details', data.data);
                suggestCtrl.tirgger('rechargeHandly');
            });
        } else {
            suggestCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });


    //充值确认||退款
    suggestCtrl.on('rechargeHandly', function () {
        $('.btnMain a:first').removeClass('buttonText').addClass('button');
        //----------------充值确认--------------
        $(".js-offline").on("click",function(){
            suggestCtrl.request({
                url: dataPath + X.configer[request.m].api.offlineAffirm+'?id='+$(this).data('id'),
                type: "get"
            }).then(function (data) {
                   //收款人信息
                var receiptBankInfo = constantValue.OwmsReceiptBankInfo;
                data.data.receiptBankAccount = receiptBankInfo.receiptBankAccount;
                data.data.receiptBankName = receiptBankInfo.receiptBankName;
                data.data.receiptUserFullName = receiptBankInfo.receiptUserFullName;
                if (data.statusCode == '2000000') {
                    $.layer({
                        title: '线下充值确认',
                        area: ['550px', ''],
                        dialog: {
                            btns: 2,
                            btn: ['确认','取消'],
                            type : 8,
                            msg: '<div class="otherConts"><div class="details_C"><dl><dt>交易编号：</dt><dd>'+data.data.accountDetailDTO.dealCode+'</dd></dl><dl><dt>交易流水号：</dt><dd>'+data.data.detailCode+'</dd></dl><dl><dt>交易时间：</dt><dd>'+data.data.accountDetailDTO.dealTime+'</dd></dl><dl><dt>交易金额：</dt><dd>'+data.data.accountDetailDTO.dealAmount+' CNY</dd></dl><dl><dt>付款人开户行：</dt><dd>'+data.data.payBankName+'</dd></dl><dl><dt>付款人户名全称：</dt><dd>'+data.data.payUserFullName+'</dd></dl><dl><dt>付款人银行账户：</dt><dd>'+data.data.payBankName+'</dd></dl><dl><dt>收款人开户行：</dt><dd>'+data.data.receiptBankName+'</dd></dl><dl><dt>收款人户名全称：</dt><dd>'+data.data.receiptUserFullName+'</dd></dl><dl><dt>收款人银行账户：</dt><dd>'+data.data.receiptBankAccount+'</dd></dl></div></div>',
                            yes:function(index){
                                suggestCtrl.request({
                                    url: dataPath + X.configer[request.m].api.offlineAffirm+'?id='+id,
                                    type: "get"
                                }).then(function (data) {
                                    if (data.statusCode == '2000000') {
                                        layer.close(index);
                                        suggestCtrl.tirgger('setTipsCommit','确认成功！',function(){
                                            suggest.router.setHistory('?m=xhr_id_20200000_20201000_view&id='+requestId+'&uid='+userId);
                                            suggest.router.runCallback();
                                        });
                                       } else {
                                        suggestCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                                    }
                                })
                            }
                        }
                    });
                } else {
                    suggestCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        });

        //---------------退款-----------------
        $(".js-refund").off("click").on("click",function(){
            var code = $(this).data("code");
            var id = $(this).data("id");
            var dealAmount = $(this).data("dealamount");
            var html = '<form id="rechargeForm">'+
                            '<dl class="editDl mL30 mT20"><dt><font></font>退款编号：</dt>'+
                                '<dd><p>'+code+'</p></dd>'+
                            '</dl>'+
                            '<dl class="editDl  mL30"><dt><font></font>退款金额：</dt>'+
                                '<dd><input type="text" class="input w240" data-dealAmount="'+dealAmount+'" required name="dealAmount" pattern="^([1-9]\\d{0,9}|0)(\.\\d{1,2})?$"><span class="mL10">CNY</span></dd>'+
                            '</dl>'+
                            '<dl class="editDl mL30"><dt><font></font>退款原因：</dt>'+
                                '<dd><textarea class="textarea w240 h90" required name="rechargeReason" data-cnmax="500"></textarea></dd>'+
                            '</dl>'+
                        '</form>';

            $.layer({
                title: '退款',
                area: ['550px', ''],
                dialog: {
                    btns: 2,
                    btn: ['确认','取消'],
                    type : 8,
                    msg: html,
                    yes:function(index){
                        // 表单提交
                        $("#rechargeForm").html5Validate(function(){
                            suggestCtrl.request({
                                url: dataPath+ X.configer[request.m].api.refundToAccount,
                                type: "post",
                                data:JSON.stringify({
                                    //"dealCode":code,
                                    "detailId":id,
                                    "dealAmount": parseFloat($("#rechargeForm input[name=dealAmount]").val()),
                                    "refundReason": $("#rechargeForm textarea[name=rechargeReason]").val()//,
                                    //"userId":userId
                                })
                            }).then(function(data){
                                if(data.statusCode=='2000000'){
                                    layer.close(index);
                                      suggestCtrl.tirgger('setTipsCommit','退款成功！',function(){
                                        suggest.router.setHistory('?m=xhr_id_20200000_20201000_view&id='+requestId+'&uid='+userId);
                                        suggest.router.runCallback();
                                        //防止面包屑导航文字不对
                                        document.title = '海外仓财务管理-账户管理管理-账户详情';
                                    });
                                } else {
                                    suggestCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                                }
                            });
                        }, {
                            validate: function () {
                                var val = Number($('input[name=dealAmount]',"#rechargeForm").val()),
                                    dealAmount = Number($('input[name=dealAmount]',"#rechargeForm").attr("data-dealAmount"));
                                if(val > dealAmount){
                                    $('input[name=dealAmount]',"#rechargeForm").testRemind("退款金额不能大于交易金额");
                                    return false;
                                }
                                return true;
                            }
                        });

                        $("#rechargeForm").submit();

                    },
                    no:function(index){
                        layer.close(index);
                    }
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
})(mXbn);
