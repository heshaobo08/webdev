;
(function (X) {
    var customerService = X(),
        customerServiceCtrl = customerService.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = customerService.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));
    var perPage = 10;//列表每页显示10条记录

    customerServiceCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };

    //页面初次加载
    customerServiceCtrl.request({
        url: dataPath + X.configer[request.m].api.list,
        type: "post",
        data: JSON.stringify({
            limit: perPage,
            cpage: request.page || 1
        })
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            data.data.operateData = operateData;
            customerServiceCtrl.render(data.data).then(function () {
                //下拉框
                sele();
                //模板局部渲染
                customerServiceCtrl.tirgger("customerServiceRender", data.data);
                // 表单校验加载
                customerServiceCtrl.tirgger("searchFormValid");
                // 分页渲染
                customerServiceCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                customerServiceCtrl.tirgger('pageRender', data.data);
            });
        } else {
            $("#listCon").html("<tr><td colspan='4' style='text-align:center'>" + X.getErrorName(data.statusCode, 'wareErr') + "</td></tr>");
        }
    });

    //模板局部渲染
    customerServiceCtrl.on('customerServiceRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        customerServiceCtrl.renderIn('#listTmpl', '#listCon', data);
        //触发页面dom事件
        customerServiceCtrl.tirgger('domEvents', "#id_conts");
        //调用全选功能
        checkeBox("r-box");
    });

    customerServiceCtrl.on('domEvents', function (ele) {
        //搜索提交
        $('.js-search').off().on('click', function () {
            request.page = 1;
            $('#searchForm').submit();
        });
        //批量删除
        $('.js-batchDelete').off().on('click', function () {
            var idArray = [];
            $("[name=accountId]:checked").each(function (index, element) {
                idArray.push($(element).data("id"));
            });
            if (!idArray.length) {
                customerServiceCtrl.tirgger('setTipsCommit', '至少选择一个客服进行操作');
                return;
            }
            customerServiceCtrl.tirgger('doDelete', idArray);
        });
        //单个删除
        $('.js-delete').off().on('click', function () {
            customerServiceCtrl.tirgger('doDelete', [$(this).data('id')]);
        });
    });

    //删除
    customerServiceCtrl.on('doDelete', function (ids) {
        customerServiceCtrl.tirgger('setTipsAsk', '确定删除所选客服？', function () {
            customerServiceCtrl.request({
                url: dataPath + X.configer[request.m].api.delete,
                type: "post",
                data: JSON.stringify({
                    ids: ids
                })
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    customerServiceCtrl.tirgger('setTipsCommit', '删除成功！',function(){
                        customerService.router.setHistory('?m=xhr_id_20100000_20108000');
                        customerServiceCtrl.router.runCallback();
                    });
                } else {
                    customerServiceCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        });
    });

    //表单验证
    customerServiceCtrl.on('searchFormValid', function () {
        // 表单验证
        $('#searchForm').html5Validate(function () {
            customerServiceCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发
                customerServiceCtrl.tirgger('customerServiceRender', data);
                // 分页渲染
                customerServiceCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                customerServiceCtrl.tirgger('pageRender', data);
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            });
        });
    });

    // 分页加载
    customerServiceCtrl.on('pageRender', function (data) {
        var cPageNo = request.page,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            customerServiceCtrl.tirgger('searchSubmit', p, function (data) {
                customerService.router.setHistory("?m=" + request.m + "&page=" + p);
                customerServiceCtrl.tirgger("customerServiceRender", data);
                $("[name=all0]").prop("checked",false);
                cPageNo = p;
            });
        });
    });

    // 列表搜索提交
    customerServiceCtrl.on('searchSubmit', function (toPageNo, callback) {
        var form = $('#searchForm');
        var sendData = {
            cpage: toPageNo,
            limit: perPage,
            name: $('input[name=name]', form).val(),
            qq: $('input[name=qq]', form).val()
        };
        customerServiceCtrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: "post",
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                callback && callback(data.data);
            } else {
                customerServiceCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
            }
        });
    });

    // 提示消息弹框方法定义 ,只有确定按钮
    customerServiceCtrl.on('setTipsCommit', function (msg, callback) {
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
    customerServiceCtrl.on('setTipsAsk', function (msg, callback) {
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
