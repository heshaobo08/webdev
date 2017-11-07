;
(function (X) {
    var refundApply = X(),
        refundApplyCtrl = refundApply.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = refundApply.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var perPage = 10;//列表每页显示10条记录

    refundApplyCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };
    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓财务管理-退款管理';
    //页面初次加载
    refundApplyCtrl.request({
        url: dataPath + X.configer[request.m].api.list,
        type: "post",
        data: JSON.stringify({
            limit: perPage,
            cpage: request.page || 1
        })
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            data.data.operateData = operateData;
            refundApplyCtrl.render(data.data).then(function () {
                //下拉框
                sele();
                //模板局部渲染
                refundApplyCtrl.tirgger("refundApplyRender", data.data);
                //表单校验加载
                refundApplyCtrl.tirgger("searchFormValid");
                //分页渲染
                refundApplyCtrl.renderIn('#pageListTmpl', '.page', data);
                //分页加载
                refundApplyCtrl.tirgger('pageRender', data.data);
            });
        } else {
            $("#listCon").html("<tr><td colspan='7' style='text-align:center'>" + X.getErrorName(data.statusCode, 'wareErr') + "</td></tr>");
        }
    });

    //模板局部渲染
    refundApplyCtrl.on('refundApplyRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        refundApplyCtrl.renderIn('#listTmpl', '#listCon', data);
        //触发页面dom事件
        refundApplyCtrl.tirgger('domEvents', "#id_conts");
        //调用全选功能
        checkeBox("r-box");
        //去掉全选的选中状态
        $('input:checkbox[name=all0]').prop('checked',false);
    });

    refundApplyCtrl.on('domEvents', function (ele) {
        //搜索提交
        $('.js-search').off().on('click', function () {
            request.page = 1;
            $('#searchForm').submit();
        });
        //选择时间
        refundApplyCtrl.tirgger('pickDate');
    });

    //表单验证
    refundApplyCtrl.on('searchFormValid', function () {
        // 表单验证
        $('#searchForm').html5Validate(function () {
            refundApplyCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发
                refundApplyCtrl.tirgger('refundApplyRender', data);
                // 分页渲染
                refundApplyCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                refundApplyCtrl.tirgger('pageRender', data);
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            });
        }, {
            validate: function () {
                // 开始时间和结束时间的校验
                if ($('#startTime').text() && $('#endTime').text() == '') {
                    $('#endTime').testRemind('请选择申请结束时间');
                    return false;
                } else if ($('#startTime').text() == '' && $('#endTime').text()) {
                    $('#startTime').testRemind('请选择申请开始时间');
                    return false;
                } else if ($('#startTime').text() > $('#endTime').text()) {
                    $('#startTime').testRemind('开始时间不能大于结束时间');
                    return false;
                }
                if ($('.priceBegin').val() && $('.priceEnd').val() && parseFloat($('.priceBegin').val()) >= parseFloat($('.priceEnd').val())) {
                    $('.priceEnd').testRemind('请重新填写退款金额');
                    return false;
                }
                return true;
            }
        });
    });

    // 分页加载
    refundApplyCtrl.on('pageRender', function (data) {
        var cPageNo = request.page,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            refundApplyCtrl.tirgger('searchSubmit', p, function (data) {
                refundApply.router.setHistory("?m=" + request.m + "&page=" + p);
                refundApplyCtrl.tirgger("refundApplyRender", data);
                cPageNo = p;
            });
        });
    });

    // 列表搜索提交
    refundApplyCtrl.on('searchSubmit', function (toPageNo, callback) {
        var form = $('#searchForm');
        var sendData = {
            cpage: toPageNo,
            limit: perPage,
            applyCode: $('input[name=applyCode]', form).val(),
            status: parseInt($('input[name=status]', form).attr('index-data')),
            searchParamList: []
        };

        $('input[name=refundAmount]', form).each(function () {
            var val = $(this).val().replace(/^\s+|\s+$/g, '');
            if (val) {
                sendData.searchParamList.push({
                    key: $(this).attr('name'),
                    operator: $(this).data('operator'),
                    value: val
                });
            }
        });
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


        refundApplyCtrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: "post",
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                callback && callback(data.data);
            } else {
                refundApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
            }
        });
    });

    refundApplyCtrl.on('pickDate', function () {
        //受理
        $('.js-accept').off().on('click', function () {
            var returnId = $(this).data('id'),
                userId = $(this).data('uid');

            refundApplyCtrl.request({
                url: dataPath + X.configer[request.m].api.dealRefundApply,
                type: "post",
                data: JSON.stringify({id: returnId,userId:userId})
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    refundApplyCtrl.tirgger('setTipsCommit', '您已受理成功！',function(){
                        //invoice.router.setHistory('?m=xhr_id_20100000_20107000');
                        refundApply.router.runCallback();
                    });
                } else {
                    var text = X.getErrorName(data.statusCode, 'wareErr');
                    if (data.statusCode == '9000001') {
                        text += '<a data-href="?m=xhr_id_20200000_20203000_detail&p=1&uid='+userId+'" class="mL10 blue">未完成业务详情</a>'
                    }
                    refundApplyCtrl.tirgger('setTipsCommit', text);
                }
            });
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
        $(".js-reject").off().on("click", function () {
            var returnId = $(this).data('id');
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
                         refundApplyCtrl.request({
                             url: dataPath + X.configer[request.m].api.rejectRefundApply,
                             type: "POST",
                             data: JSON.stringify({
                                 id: returnId,
                                 rejectInfo: val
                             })
                         }).then(function (data) {
                             if (data.statusCode == '2000000') {
                                 refundApplyCtrl.tirgger('setTipsCommit', '退款驳回成功！', function () {
                                    refundApply.router.runCallback();
                                 });
                             } else {
                                 refundApplyCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
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

    //获取时间
    refundApplyCtrl.on('pickDate', function () {
        $('.timeStart,.timeEnd').on("click", function () {
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
