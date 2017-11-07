;
(function (X) {
    var invoiceApply = X(),
        invoiceApplyCtrl = invoiceApply.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = invoiceApply.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var perPage = 10;//列表每页显示10条记录

    invoiceApplyCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };
    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓财务管理-发票管理';
    //页面初次加载
    invoiceApplyCtrl.request({
        url: dataPath + X.configer[request.m].api.list,
        type: "post",
        data: JSON.stringify({
            limit: perPage,
            cpage: request.page || 1
        })
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            data.data.operateData = operateData;
            data.data.month = ["01","02","03","04","05","06","07","08","09","10","11","12"];
            data.data.year=[];
            var now = new Date(),iYear=now.getFullYear();
            for(var i=iYear-2;i<=iYear;i++){
                data.data.year.push(i);
            }
            invoiceApplyCtrl.render(data.data).then(function () {
                //下拉框
                sele();
                //模板局部渲染
                invoiceApplyCtrl.tirgger("invoiceApplyRender", data.data);
                //表单校验加载
                invoiceApplyCtrl.tirgger("searchFormValid");
                //分页渲染
                invoiceApplyCtrl.renderIn('#pageListTmpl', '.page', data);
                //分页加载
                invoiceApplyCtrl.tirgger('pageRender', data.data);
            });
        } else {
            invoiceApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });

    //模板局部渲染
    invoiceApplyCtrl.on('invoiceApplyRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        invoiceApplyCtrl.renderIn('#listTmpl', '#listCon', data);
        //触发页面dom事件
        invoiceApplyCtrl.tirgger('domEvents', "#id_conts");
        //调用全选功能
        checkeBox('r-box');
        //去掉全选的选中状态
        $('input:checkbox[name=all0]').prop('checked',false);
    });

    invoiceApplyCtrl.on('domEvents', function (ele) {
        //搜索提交
        $('.js-search').off().on('click', function () {
            request.page = 1;
            $('#searchForm').submit();
        });
        //选择时间
        invoiceApplyCtrl.tirgger('pickDate');
        //批量受理
        $('.js-batchAudit').off().on('click', function () {
            var checkeds = $('#listCon :checkbox:checked');
            if (checkeds.length) {
                var idArray =[];
                for(var i=0;i<checkeds.length;i++){
                    var status = checkeds.eq(i).closest('tr').data('status');
                    if(status!=1){
                        invoiceApplyCtrl.tirgger('setTipsCommit','请选择处理状态为 “待受理” 的发票申请。');
                        return;
                    }
                    idArray.push(checkeds.eq(i).closest('tr').data('id'));
                }
                invoiceApplyCtrl.tirgger('doPass', idArray);
            } else {
                invoiceApplyCtrl.tirgger('setTipsCommit','请选择发票申请。');
            }
        });
        //受理
        $('.js-audit').off().on('click', function () {
            invoiceApplyCtrl.tirgger('doPass', [$(this).data('id')]);
        });
        //驳回原因
        $(".js-reason").off().on("click", function () {
            $.layer({
                title : '驳回原因',
                area : ['550px', '180px'],
                dialog : {
                    btns : 1,
                    btn : ['确认'],
                    type : 8,
                    msg : '<div class="tips f14 pad20">'+$(this).data('reason')+'</div>'
                }
            });
        });

        //驳回
        $('.js-reject').off().on('click', function () {
            invoiceApplyCtrl.tirgger('doReject', [$(this).data('id')]);
        });

        //批量驳回
        $('.js-batchReject').off().on('click', function () {
            var checkeds = $('#listCon :checkbox:checked');
            if (checkeds.length) {
                var idArray =[];
                for(var i=0;i<checkeds.length;i++){
                    var status = checkeds.eq(i).closest('tr').data('status');
                    if(status!=1){
                        invoiceApplyCtrl.tirgger('setTipsCommit','请选择处理状态为 “待受理” 的发票申请。');
                        return;
                    }
                    idArray.push(checkeds.eq(i).closest('tr').data('id'));
                }

                invoiceApplyCtrl.tirgger('doReject', idArray);
            } else {
                invoiceApplyCtrl.tirgger('setTipsCommit','请选择发票申请。');
            }
        });

        //单个寄出
        $('.js-send').off().on('click', function () {
            var id=$(this).data('id');
            $.layer({
                title: '发票寄出',
                area: ['550px', ''],
                dialog: {
                    btns: 2,
                    btn: ['确认', '取消'],
                    type: 8,
                    msg: $('#sendVoiceTmpl').html()
                },
                success: function (layero, index) {
                    invoiceApplyCtrl.tirgger('pickDate');
                    $('#sendVoiceForm').html5Validate(function () {
                        var d = {
                            id: id,
                            logisticsCompany: $('input[name=logisticsCompany2]').val().replace(/^\s+|\s+$/g, ''),
                            logisticsTrackingNumber: $('input[name=logisticsTrackingNumber2]').val().replace(/^\s+|\s+$/g, ''),
                            sendTime: $('#sendTime').text()
                        };
                        return;
                        invoiceApplyCtrl.request({
                            url: dataPath + X.configer[request.m].api.send,
                            type: 'post',
                            data: JSON.stringify([d])
                        }).then(function (data) {
                            if (data.statusCode == '2000000') {
                                invoiceApplyCtrl.tirgger('setTipsCommit', '发票申请寄出成功！', function () {
                                    invoiceApply.router.runCallback();
                                });
                            } else {
                                invoiceApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                            }
                        });
                    });
                },
                yes: function () {
                    $('#sendVoiceForm').submit();
                },
                no: function () {
                    if ($('#sendVoiceForm').length) $('#validateRemind').remove();
                }
            });
        });

        //批量寄出
        $('.js-batchSend').off().on('click',function(){
            var checkeds = $('#listCon :checkbox:checked');
            if (checkeds.length) {
                var list =[];
                for(var i=0;i<checkeds.length;i++){
                    var oTr = checkeds.eq(i).closest('tr');
                    var status = checkeds.eq(i).closest('tr').data('status');
                    if(status!=2){
                        invoiceApplyCtrl.tirgger('setTipsCommit','请选择处理状态为 “已受理” 的发票申请。');
                        return;
                    }
                    list.push({
                        id:checkeds.eq(i).closest('tr').data('id'),
                        applyCode:$('.applyCode',oTr).text(),
                        invoiceTitle:$('.invoiceTitle',oTr).text(),
                        invoiceMonth:$('.invoiceMonth',oTr).text(),
                        invoiceAmount:$('.invoiceAmount',oTr).text()
                    });
                }
                localStorage.setItem('invoiceApplyData',JSON.stringify(list));
                invoiceApply.router.setHistory('?m=xhr_id_20200000_20202000_send');
                invoiceApply.router.runCallback();
            } else {
                invoiceApplyCtrl.tirgger('setTipsCommit','请选择发票申请。');
            }
            return false;
        });
    });

    //表单验证
    invoiceApplyCtrl.on('searchFormValid', function () {
        // 表单验证
        $('#searchForm').html5Validate(function () {
            invoiceApplyCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发
                invoiceApplyCtrl.tirgger('invoiceApplyRender', data);
                // 分页渲染
                invoiceApplyCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                invoiceApplyCtrl.tirgger('pageRender', data);
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            });
        }, {
            validate: function () {
                //开始时间和结束时间的校验
                if ($('#time1').text() && $('#time2').text() == '') {
                    $('#time2').testRemind('请选择申请结束时间');
                    return false;
                } else if ($('#time1').text() == '' && $('#time2').text()) {
                    $('#time1').testRemind('请选择申请开始时间');
                    return false;
                } else if ($('#time1').text() > $('#time2').text()) {
                    $('#time1').testRemind('开始时间不能大于结束时间');
                    return false;
                }
                 if ($('#time3').text() && $('#time4').text() == '') {
                    $('#time4').testRemind('请选择申请结束时间');
                    return false;
                } else if ($('#time3').text() == '' && $('#time4').text()) {
                    $('#time3').testRemind('请选择申请开始时间');
                    return false;
                } else if ($('#time3').text() > $('#time4').text()) {
                    $('#time3').testRemind('开始时间不能大于结束时间');
                    return false;
                }
                if ($('.priceBegin').val() && $('.priceEnd').val() && parseFloat($('.priceBegin').val()) >= parseFloat($('.priceEnd').val())) {
                    $('.priceEnd').testRemind('请重新填写开票金额');
                    return false;
                }
                if(!$('#js-selYear input').val()&&$('#js-selMonth input').val()){
                    $('#js-selYear').testRemind('请选择开票年份');
                    return false;
                }
                return true;
            }
        });
    });

    // 分页加载
    invoiceApplyCtrl.on('pageRender', function (data) {
        var cPageNo = request.page,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            invoiceApplyCtrl.tirgger('searchSubmit', p, function (data) {
                invoiceApply.router.setHistory("?m=" + request.m + "&page=" + p);
                invoiceApplyCtrl.tirgger("invoiceApplyRender", data);
                $("[name=all]").prop("checked",false);
                cPageNo = p;
            });
        });
    });

    // 列表搜索提交
    invoiceApplyCtrl.on('searchSubmit', function (toPageNo, callback) {
        var form = $('#searchForm');
        var sendData = {
            cpage: toPageNo,
            limit: perPage,
            applyCode: $('input[name=applyCode]', form).val(),
            applyUser:$('input[name=applyUser]', form).val(),
            status: parseInt($('input[name=status]', form).attr('index-data')),
            invoiceType: parseInt($('input[name=invoiceType]', form).attr('index-data')),
            invoiceTitle:$('input[name=invoiceTitle]', form).val(),
            invoiceAmount:$('input[name=invoiceAmount]', form).val(),
            logisticsCompany:$('input[name=logisticsCompany]', form).val(),
            logisticsTrackingNumber:$('input[name=logisticsTrackingNumber]', form).val(),
            searchParamList: []
        };

        $('.dateInput', form).each(function () {
            var val = $(this).text();
            if (val) {
                sendData.searchParamList.push({
                    key: $(this).attr('name'),
                    operator: $(this).data('operator'),
                    value: val
                });
            }
        });

        $('input[name=invoiceAmount]', form).each(function () {
            var val = parseFloat($(this).val().replace(/^\s+|\s+$/g, ''));
            if (val) {
                sendData.searchParamList.push({
                    key: $(this).attr('name'),
                    operator: $(this).data('operator'),
                    value: val
                });
            }
        });

        if($('#js-selYear input').val()){
            var s=$('#js-selMonth input').val()?$('#js-selMonth input').attr('index-data'):'';
            sendData.invoiceMonth=$('#js-selYear input').attr('index-data')+'-'+s;
        }

        invoiceApplyCtrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: 'post',
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                callback && callback(data.data);
            } else {
                invoiceApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
            }
        });
    });

    //受理
    invoiceApplyCtrl.on('doPass', function (ids) {
        invoiceApplyCtrl.request({
            url: dataPath + X.configer[request.m].api.audit,
            type: 'post',
            data: JSON.stringify({
                ids: ids
            })
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                invoiceApplyCtrl.tirgger('setTipsCommit', '发票申请受理成功！',function(){
                    //invoiceApply.router.setHistory('?m=xhr_id_20100000_20107000');
                    invoiceApply.router.runCallback();
                });
            } else {
                invoiceApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
            }
        });
    });

    //驳回
    invoiceApplyCtrl.on('doReject', function (ids) {
        $.layer({
            title: '驳回原因',
            area: ['550px', '400px'],
            dialog: {
                btns: 2,
                btn: ['确认', '取消'],
                type: 8,
                msg: $('#rejectReasonTmpl').html()
            },
            success: function (layero, index) {
                 $('#rejectForm').html5Validate(function () {
                     var val = $('textarea[name=rejectInfo]').val().replace(/(^\s+)|(\s+$)/g, '');
                     invoiceApplyCtrl.request({
                         url: dataPath + X.configer[request.m].api.reject,
                         type: 'post',
                         data: JSON.stringify({
                             ids: ids,
                             rejectInfo: val
                         })
                     }).then(function (data) {
                         if (data.statusCode == '2000000') {
                             invoiceApplyCtrl.tirgger('setTipsCommit', '发票申请驳回成功！', function () {
                                invoiceApply.router.runCallback();
                             });
                         } else {
                             invoiceApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                         }
                     });
                 });
            },
            yes: function () {
                $('#rejectForm').submit();
            },
            no: function () {
                if ($('#rejectForm').length) $('#validateRemind').remove();
            }
        });
    });

    //单个寄出发票
    invoiceApplyCtrl.on('doSend', function (sendData) {
        $('#sendVoiceForm').html5Validate(function () {
            invoiceApplyCtrl.request({
                url: dataPath + X.configer[request.m].api.send,
                type: 'post',
                data: JSON.stringify(sendData)
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    invoiceApplyCtrl.tirgger('setTipsCommit', '发票申请寄出成功！', function () {
                        invoiceApply.router.runCallback();
                    });
                } else {
                    invoiceApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
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

    // 提示消息弹框方法定义,有确定和取消按钮
    invoiceApplyCtrl.on('setTipsAsk', function (msg, callback) {
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
})(mXbn);
