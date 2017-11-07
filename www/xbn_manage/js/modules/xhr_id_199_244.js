;
(function (X) {

    var gl_pz = X();

    var path = X.configer.__ROOT_PATH__ + '/' + X.configer.__FILE_HTML__ + '/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath = X.configer.__API_PATH__;

    var refundCtrl = gl_pz.ctrl();

    var localParm = gl_pz.utils.getRequest();

    var platform = localParm.platform,

        tpl = path + X.configer[localParm.m].tpl.ebay,

        cataList = null,

        siteList = {},

        baseReturnData = {},

        operateData = X.getRolesObj.apply(null, localParm.m.split('_').slice(2));

    if (platform == '1') {
        // ebay
        tpl = path + X.configer[localParm.m].tpl.ebay;

    } else if (platform == '2') {
        // amazon'
        tpl = path + X.configer[localParm.m].tpl.amazon;

    } else if (platform == '3') {
        // newegg
        tpl = path + X.configer[localParm.m].tpl.newegg;
    } else {
        platform = '1';
    }

    // 创建视图
    refundCtrl.view = {
        elem: "#id_conts",
        tpl: tpl
    };

    // 获取站点列表所有数据
    refundCtrl.request({
        url: jsPath + X.configer[localParm.m].api.siteList,
        data: JSON.stringify({
            'platformCode': platform
        }),
        type: 'post'
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            $.each(data.data, function (i, site) {
                siteList[site.id] = site;
            });
            if (platform == '1') {
                var returnType = [];
                $.each(siteList, function (i, site) {
                    var getDicSite = getSiteDicWord(site);
                    returnType.push("ADDITEM_RETURNPOLICY_ACCEPTED|" + getDicSite, 'ADDITEM_RETURNPOLICY_COSTPAID|' + getDicSite, 'ADDITEM_RETURNPOLICY_REFUNDDAYS|' + getDicSite, 'ADDITEM_RETURNPOLICY_REFUND|' + getDicSite);
                })
                // 获取所有退货政策基础数据
                refundCtrl.request({
                    url: jsPath + X.configer[localParm.m].api.baseData,
                    data: JSON.stringify({
                        types: returnType
                    }),
                    type: 'post'
                }).then(function (basedata) {
                    if (basedata.statusCode == "2000000") {
                        $.each(basedata.data, function (i, data) {
                            $.each(data, function (j, base) {
                                data[base.name] = base;
                                delete data[j];
                            })
                        });
                        baseReturnData = basedata.data;
                        // 获取退换货数据列表
                        refundCtrl.tirgger('getRefundList');
                    } else {
                        refundCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                    }
                });
            } else {
                // 获取退换货数据列表
                refundCtrl.tirgger('getRefundList');
            }

        } else {
            refundCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
        }
    });


    // 获取退换货数据列表
    refundCtrl.on('getRefundList', function () {
        refundCtrl.request({
            data: JSON.stringify({
                "platform": platform,
                "pageSize": 10,
                "cPageNo": localParm.page || 1
            }),
            type: 'post',
            url: jsPath + X.configer[localParm.m].api.refundList
        }).then(function (refundData) {
            if (refundData.statusCode == '2000000') {
                refundData.data.site = siteList;//站点列表
                refundData.data.baseReturnData = baseReturnData; //退货政策基础数据
                refundData.data.operateData = operateData;
                // 模板渲染
                refundCtrl.render(refundData.data).then(function () {
                    refundCtrl.tirgger("refundRender", refundData.data);
                    // 渲染分页
                    refundCtrl.renderIn('#pageListCon', '.page', refundData);
                    // 分页加载
                    refundCtrl.tirgger('pageRender', refundData.data);
                    // 表单验证
                    refundCtrl.tirgger('searchValid');
                    // 下拉列表
                    sele();
                });
            } else {
                refundCtrl.tirgger('setTips', X.getErrorName(refundData.statusCode));
            }
        });
    });


    // 页面渲染初始化
    refundCtrl.on('refundRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        // 渲染商品列表
        refundCtrl.renderIn('#refundListTmpl', '#refundListCon', data);
        // dom节点event触发
        refundCtrl.tirgger('dom_init', "#id_conts");
    });

    // dom节点event初始化
    refundCtrl.on('dom_init', function (ele) {
        var cPageNo = 1,
            pageSize = 10,
            pathIds = [];
        // 分类路径（amazon）
        if (platform == '2') {
            // 获取分类id
            $('.getFullPath').each(function (i, dom) {
                if ($(dom).attr('data-pathId')) {
                    pathIds.push($(dom).attr('data-pathId'));
                }
            });
            pathIds = pathIds.join(',');
            // 获取路径
            refundCtrl.request({
                url: jsPath + X.configer[localParm.m].api.getFullPaths,
                data: JSON.stringify({
                    categoryId: pathIds
                }),
                type: 'post'
            }).then(function (data) {
                if (data.statusCode == "2000000") {
                    //设置路径
                    $.each(data.data, function (i, path) {
                        $('.getFullPath[data-pathId=' + path.categoryId + ']').html(path.pathValue);
                    })
                } else {
                    refundCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                }
            });
        }
        // 搜索
        $('.js-rejectEarch').off().on('click', function () {
            // 表单提交
            $('#rejectSearchForm').submit();

        });

        // 开始时间
        $(".timeStart,#startTime").on("click", function () {
            laydate({
                istime: true,
                elem: '#startTime',
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss',
                choose: function (dates) { //选择好日期的回调
                    $('#dataStart').val(dates);
                }
            });
        });
        // 结束时间
        $(".timeEnd,#endTime").on("click", function () {
            laydate({
                istime: true,
                elem: '#endTime',
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss',
                choose: function (dates) { //选择好日期的回调
                    $('#dataEnd').val(dates);
                }
            });
        });


        $(".bigTable tbody tr,.smallTable tbody tr").hover(function () {
            $(this).css({"background-color": "#ececec"});
        }, function () {
            $(this).attr('style', '');
        });

    });

    // 分页加载
    refundCtrl.on('pageRender', function (data) {
        var cPageNo = localParm.page,
            pageSize = 10,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            refundCtrl.tirgger('searchSubmit', p, function (data) {
                gl_pz.router.setHistory("?m=" + localParm.m + "&page=" + p);
                refundCtrl.tirgger("refundRender", data);
                cPageNo = p;
            });
        });
    });

    // 表单验证
    refundCtrl.on('searchValid', function () {
        // 搜索验证
        $('#rejectSearchForm').html5Validate(function () {
            refundCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发 
                refundCtrl.tirgger('refundRender', data);
                // 分页渲染
                refundCtrl.renderIn('#pageListCon', '.page', data);
                // 分页加载
                refundCtrl.tirgger('pageRender', data);
                //显示搜索结果
                $('#searchTotalCount').closest('.addbutton').removeClass('none');
            });
        }, {
            validate: function () {
                // 开始时间和结束时间的校验
                if ($("#startTime").html() && $('#endTime').html() == "") {
                    $("#endTime").testRemind("请选择结束时间");
                    return false;
                } else if ($("#startTime").html() == "" && $('#endTime').html()) {
                    $("#startTime").testRemind("请选择开始时间");
                    return false;
                } else if ($("#startTime").html() > $('#endTime').html()) {
                    $("#startTime").testRemind("开始时间不能大于结束时间");
                    return false;
                }
                return true;
            }
        });
    });


    // 列表搜索提交
    refundCtrl.on('searchSubmit', function (toPageNo, callback) {
        var siteId = $('input[name=siteId]', "#rejectSearchForm").attr('index-data'),
            isReturns = $('input[name=isReturns]', "#rejectSearchForm").attr('index-data'),
            undertaker = $('input[name=undertaker]', "#rejectSearchForm").attr('index-data'),
            dateNumber = $('input[name=dateNumber]', "#rejectSearchForm").attr('index-data'),
            updateTimeStart = $('#startTime', "#rejectSearchForm").html(),
            updateTimeEnd = $('#endTime', "#rejectSearchForm").val(),
            sendData = {
                "platform": platform,
                "siteId": siteId ? siteId : null,
                "isReturns": isReturns ? isReturns : null,
                "undertaker": undertaker ? undertaker : null,
                "dateNumber": dateNumber ? dateNumber : null,
                "updateTimeStart": updateTimeStart ? updateTimeStart : null,
                "updateTimeEnd": updateTimeEnd ? updateTimeEnd : null,
                cPageNo: toPageNo,
                pageSize: 10
            };
        refundCtrl.request({
            url: jsPath + X.configer[localParm.m].api.refundList,
            type: 'post',
            data: JSON.stringify(sendData)
        }).then(function (data) {
            // 添加站点列表
            if (data.statusCode == '2000000') {
                data.data.site = siteList;
                data.data.operateData = operateData;
                data.data.baseReturnData = baseReturnData; //退货政策基础数据
                callback && callback(data.data);
            } else {
                refundCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
            }
        });
    });

    // 提示消息弹框方法定义
    refundCtrl.on('setTips', function (msg, callback) {
        if (!msg) return;
        $.layer({
            title: '提示消息',
            area: ['500px', '200px'],
            dialog: {
                btns: 1,
                btn: ['返回'],
                type: 8,
                msg: '<div class="tips mB20"><em>' + msg + '</em></div>',
                yes: function (index) {
                    layer.close(index);
                    // 回调
                    callback && callback();
                }
            }
        })
    });

})(mXbn);
