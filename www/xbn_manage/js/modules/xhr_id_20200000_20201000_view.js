;(function (X) {
    var suggest = X(),

        suggestCtrl = suggest.ctrl(),

        path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址

        dataPath = X.configer.__OWMS_PATH__,//请求地址前缀

        request = suggest.utils.getRequest(),

        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var perPage = 10;//列表每页显示10条记录

    /*var userId = localStorage.user.split(",")[0];
    var requestId = localStorage.user.split(",")[1];*/
    var userId = request.uid,
        requestId = request.id;
    localStorage.setItem('user',JSON.stringify({uid:userId,requestId:requestId}));

    suggestCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };
    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓财务管理-账户管理-账户详情';
    //用户信息
    suggestCtrl.tirgger('accountInfo');

    //流水列表
    suggestCtrl.request({
        url: dataPath + X.configer[request.m].api.user,
        data: JSON.stringify({
            userId: userId
        }),
        type: 'post'
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            //模板渲染
            data.data.operateData=operateData;
            suggestCtrl.render(data.data).then(function () {
                //下拉框
                sele();
                //模板局部渲染
                suggestCtrl.tirgger("suggestRender", data.data);
                // 表单校验加载
                suggestCtrl.tirgger("searchFormValid");
                // 分页渲染
                suggestCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                suggestCtrl.tirgger('pageRender', data.data);

                suggestCtrl.tirgger('rechargeHandly');

            });
        } else {
            suggestCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });

    //模板局部渲染
    suggestCtrl.on('accountInfo', function (data) {
        //用户信息
        suggestCtrl.request({
            url: dataPath + X.configer[request.m].api.getByUserId+'?userId='+userId,
            type: 'get'
        }).then(function (data) {
            data.data.operateData=operateData;
            suggestCtrl.renderIn('#userInfo', '#accountInfo', data.data);
        });
    });

    //模板局部渲染
    suggestCtrl.on('suggestRender', function (data) {
        // 数据列表渲染
        suggestCtrl.renderIn('#listTmpl', '#listCon', data);


        //用户信息
        suggestCtrl.tirgger('accountInfo');

        //操作
        suggestCtrl.tirgger('rechargeHandly');
    });

    //表单验证
    suggestCtrl.on('searchFormValid', function () {
        // 表单验证
        $('#searchForm').html5Validate(function () {
            suggestCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发
                suggestCtrl.tirgger('suggestRender', data);
                // 分页渲染
                suggestCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                suggestCtrl.tirgger('pageRender', data);
            });
        }, {
            validate: function () {
                var isSubmit = true;
                // 开始时间和结束时间的校验
                if ($('#startTime').text() && $('#endTime').text() == '') {
                    $('#endTime').testRemind("请选择交易时间结束时间");
                    isSubmit= false;
                    return isSubmit;
                } else if ($('#startTime').text() == '' && $('#endTime').text()) {
                    $('#startTime').testRemind("请选择交易开始时间");
                    isSubmit= false;
                    return isSubmit;
                } else if ($('#startTime').text() > $('#endTime').text()) {
                    $('#endTime').testRemind("开始时间不能大于结束时间");
                    isSubmit= false;
                    return isSubmit;
                }
                $('.priceBegin').each(function(){
                    if($(this).val().length&&$(this).siblings('.priceEnd').val()){
                        var begin = parseFloat($(this).val()),
                            end = parseFloat($(this).siblings('.priceEnd').val()),
                            name = $(this).attr('name');
                        var text ='';
                        switch(name){
                            case 'totalBalance':
                                 text='总余额';
                                break;
                            case 'vailableBalance':
                                text='可用余额';
                                break;
                            case 'frozenBalance':
                                text='冻结余额';
                                break;
                        }
                        if(begin>end){
                            $(this).testRemind('请重新添写'+text+'，开始金额不能大于结束金额');
                            isSubmit=false;
                            return false
                        }
                    }
                });
                return isSubmit;
            }
        });
    });

    // 分页加载
    suggestCtrl.on('pageRender', function (data) {
        var cPageNo = request.page,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            suggestCtrl.tirgger('searchSubmit', p, function (data) {
                suggest.router.setHistory('?m=' + request.m + '&id=' + requestId + '&uid=' + userId + '&page=' + p);
                data.operateData=operateData;
                suggestCtrl.tirgger("suggestRender", data);
                cPageNo = p;
            });
        });
    });

    // 列表搜索提交
    suggestCtrl.on('searchSubmit', function (toPageNo, callback) {
        // 获取搜索项
        var sendData = {
            cpage: toPageNo,
            limit: perPage,
            userId: userId,
            dealCode: $("input[name=dealCode]").val(),
            dealType: parseInt($("[name=dealType]").attr('index-data')),
            dealItem: parseInt($("[name=dealItem]").attr('index-data')),
            dealStatus: parseInt($("[name=dealStatus]").attr('index-data')),
            searchParamList: []
        };
        $('.dateInput').each(function(){
           if($(this).text().length){
               sendData.searchParamList.push({
                    key: $(this).attr('name'),
                    operator: $(this).data('operator'),
                    value: $(this).text()
               });
           }
        });
        $('.priceBegin,.priceEnd').each(function(){
           if($(this).val().length){
               sendData.searchParamList.push({
                    key: $(this).attr('name'),
                    operator: $(this).data('operator'),
                    value: $(this).val()
               });
           }
        });

        suggestCtrl.request({
            url: dataPath + X.configer[request.m].api.user,
            type: "post",
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData=operateData;
                callback && callback(data.data);
            } else {
                suggestCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
            }
        });
    });


    //充值确认||退款
    suggestCtrl.on('rechargeHandly', function () {
        //----------------充值确认--------------
        $(".js-offline").off("click").on("click",function(){
            var id = $(this).data('id');
            suggestCtrl.request({
                url: dataPath + X.configer[request.m].api.detail,
                type: "post",
                data: JSON.stringify({
                    "dealItem":"2",
                    "id":id
                })
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                      //收款人信息
                    var receiptBankInfo = constantValue.OwmsReceiptBankInfo;
                    data.data.receiptBankAccount = receiptBankInfo.receiptBankAccount;
                    data.data.receiptBankName = receiptBankInfo.receiptBankName;
                    data.data.receiptUserFullName = receiptBankInfo.receiptUserFullName;
                    $.layer({
                        title: '线下充值确认',
                        area: ['550px', ''],
                        dialog: {
                            btns: 2,
                            btn: ['确认','取消'],
                            type : 8,
                            msg: '<div class="otherConts"><div class="details_C"><dl><dt>交易编号：</dt><dd>'+data.data.accountDetailDTO.dealCode+'</dd></dl><dl><dt>交易流水号：</dt><dd>'+data.data.detailCode+'</dd></dl><dl><dt>交易时间：</dt><dd>'+data.data.accountDetailDTO.dealTime+'</dd></dl><dl><dt>交易金额：</dt><dd>'+data.data.accountDetailDTO.dealAmount+' CNY</dd></dl><dl><dt>付款人开户行：</dt><dd>'+data.data.payBankName+'</dd></dl><dl><dt>付款人户名全称：</dt><dd>'+data.data.payUserFullName+'</dd></dl><dl><dt>付款人银行账户：</dt><dd>'+data.data.payBankAccount+'</dd></dl><dl><dt>收款人开户行：</dt><dd>'+data.data.receiptBankName+'</dd></dl><dl><dt>收款人户名全称：</dt><dd>'+data.data.receiptUserFullName+'</dd></dl><dl><dt>收款人银行账户：</dt><dd>'+data.data.receiptBankAccount+'</dd></dl></div></div>',
                            yes:function(index){
                                suggestCtrl.request({
                                    url: dataPath + X.configer[request.m].api.offlineAffirm+'?id='+id,
                                    type: "get"
                                }).then(function (data) {
                                    if (data.statusCode == '2000000') {
                                        layer.close(index);
                                        //suggest.router.setHistory('?m=xhr_id_20200000_20201000_view&id='+requestId+'&uid='+userId);
                                        suggestCtrl.tirgger('setTipsCommit','确认成功！',function(){
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
                                '<dd><input type="text" data-dealAmount="'+dealAmount+'" class="input w240" required name="dealAmount" pattern="^([1-9]\\d{0,9}|0)(\.\\d{1,2})?$"><span class="mL10">CNY</span></dd>'+
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
                        $("#rechargeForm").submit();
                    },
                    no:function(index){
                        layer.close(index);
                    }
                },
                success:function(){
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
                                layer.close(layer.index);
                                 suggestCtrl.tirgger('setTipsCommit', '退款成功！', function () {
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
                            if(val < 0.01){
                                $('input[name=dealAmount]',"#rechargeForm").testRemind("最低金额为0.01元");
                                return false;
                            }
                            if(val > dealAmount){
                                $('input[name=dealAmount]',"#rechargeForm").testRemind("退款金额不能大于交易金额");
                                return false;
                            }
                            return true;
                        }
                    });
                }
            });
        });

        //---------------------小笨鸟充值------------------
         $(".js-recharge").off("click").on("click",function(){
            $.layer({
                title: '小笨鸟充值',
                area: ['550px', ''],
                dialog: {
                    btns: 2,
                    btn: ['确认','取消'],
                    type : 8,
                    msg: '<form id="rechargeForm">'+
                            '<dl class="editDl mL30 mT20"><dt><font></font>交易编号：</dt>'+
                                '<dd><p class="tradeCode"></p></dd>'+
                            '</dl>'+
                            '<dl class="editDl mL30"><dt><font></font>交易金额：</dt>'+
                                '<dd><input type="text" class="input w240" required name="dealAmount" pattern="^([1-9]\\d{0,9}|0)(\.\\d{1,2})?$"/><span class="mL10">CNY</span></dd>'+
                            '</dl>'+
                            '<dl class="editDl mL30"><dt><font></font>充值原因：</dt>'+
                                '<dd><textarea class="textarea w240 h90" required name="rechargeReason" data-cnmax="500"></textarea></dd>'+
                            '</dl>'+
                        '</form>',
                    yes:function(index){
                        $("#rechargeForm").submit();
                    },
                    no:function(index){
                        layer.close(index);
                    }
                },
                success:function(){
                    suggestCtrl.request({
                        url: dataPath+ X.configer[request.m].api.getDealCodeByItem+'?dealItem=1',
                        type: "get"
                    }).then(function(data){
                        if(data.statusCode=='2000000'){
                            $(".tradeCode").text(data.data);
                        }
                    });
                    // 表单提交
                    $("#rechargeForm").html5Validate(function(){
                        suggestCtrl.request({
                            url: dataPath+ X.configer[request.m].api.addXbniao,
                            type: "post",
                            data:JSON.stringify({
                                "dealCode": $(".tradeCode").text(),
                                "dealAmount": parseFloat($("#rechargeForm input[name=dealAmount]").val()),
                                "rechargeReason":$("textarea[name=rechargeReason]").val(),
                                "userId": userId
                            })
                        }).then(function(data){
                            if(data.statusCode=='2000000'){
                                layer.close(layer.index);
                                suggestCtrl.tirgger('setTipsCommit', '小笨鸟充值成功！', function () {
                                    suggest.router.runCallback();
                                    //防止面包屑导航文字不对
                                    document.title = '海外仓财务管理-账户管理管理-账户详情';
                                });
                            }else{
                                suggestCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                            }
                        });
                    }, {
                        validate: function () {
                            var val = Number($('input[name=dealAmount]',"#rechargeForm").val());
                            if(val < 0.01){
                                $('input[name=dealAmount]',"#rechargeForm").testRemind("最低金额为0.01元");
                                return false;
                            }
                            return true;
                        }
                    });
                }
            });
        });


        //-------------------导出账单----------------
        $(".js-exportBill").off("click").on("click",function(){
            if($('#listCon tr.notr').length){
                suggestCtrl.tirgger('setTipsCommit', '当前列表为空。');
                return;
            }
            // 获取搜索项
            var sendData = {
                userId: userId,
                dealCode: $("[name=dealCode]").val() || "",
                dealType: parseInt($("[name=dealType]").attr('index-data')) || "",
                dealItem: parseInt($("[name=dealItem]").attr('index-data')) || "",
                dealStatus: parseInt($("[name=dealStatus]").attr('index-data')) || "",
                searchParamList: []
            };

            $('.dateInput').each(function(){
               if($(this).text().length){
                   sendData.searchParamList.push({
                        key: $(this).attr('name'),
                        operator: $(this).data('operator'),
                        value: $(this).text()
                   });
               }
            });
            $('.priceBegin,.priceEnd').each(function(){
               if($(this).val().length){
                   sendData.searchParamList.push({
                        key: $(this).attr('name'),
                        operator: $(this).data('operator'),
                        value: $(this).val()
                   });
               }
            });
            $("#exportBill input[name=obj]").val(JSON.stringify(sendData));
            $("#exportBill").submit();
        });
        //搜索提交
        $('.js-search').off().on('click', function () {
            request.page = 1;
            $('#searchForm').submit();
        });
        //选择时间
        suggestCtrl.tirgger('pickDate');
    });

    //获取时间
    suggestCtrl.on('pickDate', function () {
        $(".timeStart,.timeEnd").on("click", function () {
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
