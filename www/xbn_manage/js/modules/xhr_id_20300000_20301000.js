;
(function (X) {
    var country = X(),
        countryCtrl = country.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = country.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));
    var currencyUnitLists = [];
    var perPage = 10;//列表每页显示10条记录
    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓系统管理-国家设置';

    countryCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };

    //获取所有国家不分页
    countryCtrl.request({
        url: dataPath + X.configer[request.m].api.listNoPage,
        type: "post"
    }).then(function (data) {
        if (data.statusCode == "2000000") {
            var arrList = data.data;
            if (arrList.length) {
                for (var i = 0; i < arrList.length; i++) {
                    currencyUnitLists.push(arrList[i].currencyUnit);
                }
            }
            //页面初次加载
            countryCtrl.tirgger('initLoad');
        } else {
            countryCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });

    //页面初次加载
    countryCtrl.on('initLoad',function(){
        countryCtrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: "post",
            data: JSON.stringify({
                limit: perPage,
                cpage: request.page || 1
            })
        }).then(function (data) {
            if (data.statusCode == "2000000") {
                data.data.operateData = operateData;
                if (currencyUnitLists.length) data.data.units = currencyUnitLists;
                countryCtrl.render(data.data).then(function () {
                    //下拉框
                    sele();
                    //模板局部渲染
                    countryCtrl.tirgger("countryRender", data.data);
                    // 表单校验加载
                    countryCtrl.tirgger("searchFormValid");
                    // 分页渲染
                    countryCtrl.renderIn('#pageListTmpl', '.page', data);
                    // 分页加载
                    countryCtrl.tirgger('pageRender', data.data);
                });
            } else {
                $("#listCon").html("<tr><td colspan='5' style='text-align:center'>"+X.getErrorName(data.statusCode, 'wareErr')+"</td></tr>");
            }
        });
    });

    //模板局部渲染
    countryCtrl.on('countryRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        countryCtrl.renderIn('#listTmpl', '#listCon', data);
        //调用全选功能
        checkeBox("r-box");
        //去掉全选的选中状态
        $('input:checkbox[name=all0]').prop('checked',false);
        // 触发页面dom事件
        countryCtrl.tirgger('domEvents', "#id_conts");
    });

    countryCtrl.on('domEvents', function (ele) {
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
                countryCtrl.tirgger('setTipsCommit', '请选择一个国家。');
                return;
            }
            countryCtrl.tirgger('doDelete', idArray);
        });
        //单个删除
        $('.js-delete').off().on('click', function () {
            countryCtrl.tirgger('doDelete', [$(this).data('id')],'是否删除该国家？');
        });
    });

    //删除
    countryCtrl.on('doDelete', function (ids,text) {
        var text = text ? text : '是否删除已选中的国家？';
        countryCtrl.tirgger('setTipsAsk', text, function () {
            countryCtrl.request({
                url: dataPath + X.configer[request.m].api.delete,
                type: "post",
                data: JSON.stringify({
                    ids: ids
                })
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    countryCtrl.tirgger('setTipsCommit', '删除成功！',function(){
                        country.router.setHistory('?m=xhr_id_20300000_20301000');
                        country.router.runCallback();
                    });

                } else {
                    countryCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        });
    });

    //表单验证
    countryCtrl.on('searchFormValid', function () {
        // 表单验证
        $('#searchForm').html5Validate(function () {
            countryCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发
                countryCtrl.tirgger('countryRender', data);
                // 分页渲染
                countryCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                countryCtrl.tirgger('pageRender', data);
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            });
        });
    });

    // 分页加载
    countryCtrl.on('pageRender', function (data) {
        var cPageNo = request.page,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            countryCtrl.tirgger('searchSubmit', p, function (data) {
                country.router.setHistory("?m=" + request.m + "&page=" + p);
                countryCtrl.tirgger("countryRender", data);
                $("[name=all0]").prop("checked",false);
                cPageNo = p;
            });
        });
    });

    // 列表搜索提交
    countryCtrl.on('searchSubmit', function (toPageNo, callback) {
        var form = $('#searchForm');
        var sendData = {
            cpage: toPageNo,
            limit: perPage,
            country: $('input[name=country]', form).val(),
            currencyUnit:  $('input[name=currencyUnit]', form).val()
        };

        countryCtrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: "post",
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                if (currencyUnitLists.length) data.data.units = currencyUnitLists;
                callback && callback(data.data);
            } else {
                countryCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
            }
        });
    });

    // 提示消息弹框方法定义 ,只有确定按钮
    countryCtrl.on('setTipsCommit', function (msg, callback) {
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
    countryCtrl.on('setTipsAsk', function (msg, callback) {
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
