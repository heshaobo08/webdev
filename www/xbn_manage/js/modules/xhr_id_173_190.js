;
(function (X) {

    var gl_xt = X();

    var ctrl = gl_xt.ctrl();

    var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;

    var dataPath = X.configer.__API_PATH__ + '/';

    var request = gl_xt.utils.getRequest(),

        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var totalPages = "";//后台返回的总页码数

    var start = "";//当前页码

    ctrl.view = {
        elem: "#id_conts",
        tpl: path + "/" + X.configer[request.m].tpl
    };

    //向后台发送数据
    ctrl.request({
        url: dataPath + X.configer[request.m].api.list,
        type: "post",
        data: JSON.stringify({
            "pageSize": 10,
            "start": request.page || 1
        })
    }).then(function (data) {
        if (data.statusCode == "2000000") {
            data.data.operateData = operateData;
            ctrl.render(data.data).then(function () {
                // 模板局部渲染 触发
                ctrl.tirgger("memberRender", data.data);
                // 表单校验加载
                ctrl.tirgger("searchFormValid");
                // 分页渲染
                ctrl.renderIn('#pageListCon', '.page', data);
                // 分页加载
                ctrl.tirgger('pageRender', data.data);
                // 全选框
                sele();
            });
        } else {
            $("#listCon").html("<tr><td colspan='9' style='text-align:center'>操作失败</td></tr>");
        }

    });

    // 模板局部渲染
    ctrl.on('memberRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        ctrl.renderIn("#list", "#listCon", data);

        // 触发页面dom事件
        ctrl.tirgger('dom-event-init', "#id_conts");
    });

    // 初始化页面所有dom事件
    ctrl.on('dom-event-init', function (elem) {

        // 搜索提交
        $('.js-search').off().on('click', function () {
            $("#searchForm").submit();
        });

        $(".timeStart").on("click", function () {
            laydate({
                istime: true,
                elem: '#startTime',
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });
        $(".timeEnd").on("click", function () {
            laydate({
                istime: true,
                elem: '#endTime',
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        //快速支付
        pay();

    });

    //付款
    function pay() {
        $(".js-pay").on("click", function () {
            var id = $(this).attr("index-id");
            var html = '<form id="payForm"><div class="payed">';
            html += '<dl><dt>实付金额：</dt><dd><input type="text" class="input w190 mR10" required data-max="10" name="payAmount"/>元</dd></dl>';
            html += '<dl><dt>付款时间：</dt><dd><div class="deadline"><span class="dataInput" id="payTime"></span><a class="icon-54 timeStart" href="javascript:;"></a></div></dd></dl>';
            html += '<dl class=""><dt>付款方式：</dt><dd> <div class="select w190 fL"><input type="hidden" value="请选择" index-data="" name="payType"><i>请选择</i><em class="icon-52"></em>' +
            '<ul style=""> ' +
            '<li index-data=""><span>请选择</span></li>' +
            '<li index-data="银行转账"><span>银行转账</span></li>' +
            '<li index-data="支票"><span>支票</span></li>' +
            '<li index-data="现金"><span>现金</span></li>' +
            '<li index-data="支付宝"><span>支付宝</span></li>' +
            '<li index-data="网银"><span>网银</span></li>' +
            '</ul>' +
            '</div></dd></dl>';
            html += '<dl class=""> <dt>交易流水号：</dt><dd><input type="text" class="w190 input" name="tranCode" required/></dd></dl>';
            html += '</div></form>';
                 
            $.layer({
                title: '付款信息',
                area: ['550px', '400px'],
                dialog: {
                    btns: 2,
                    btn: ['提交', '取消'],
                    type: 8,
                    msg: html,
                    yes: function (index) {
                        $("#payForm").submit();
                    }
                },
                success: function () {
                    // 控制层级
                    $.testRemind.css.zIndex = $('.xubox_shade').css('zIndex') + 1;
                    // 表单验证
                    $("#payForm").html5Validate(function () {
                        ctrl.request({
                            url: dataPath + X.configer[request.m].api.save,
                            type: "POST",
                            data: JSON.stringify({
                                "orderId": id,
                                "payType": $("[name=payType]").val(),
                                "payAmount": $("[name=payAmount]").val(),
                                "payTime": $("#payTime").text(),
                                "tranCode": $("[name=tranCode]").val()
                            })
                        }).then(function (data) {
                            if (data.statusCode == "2000000") {
                                $.layer({
                                    title: '提示消息',
                                    area: ['500px', '200px'],
                                    dialog: {
                                        btn: 1,
                                        btn: ['确定'],
                                        type: 8,
                                        msg: '<div class="tips mB20"><em>提交成功</em></div>',
                                        yes: function (index) {
                                            gl_xt.router.runCallback();
                                            layer.close(index);
                                        }
                                    }
                                })
                            }
                        });
                    }, {
                        validate: function () {
                            //不允许0和负数以及非数字
                            var _val = $('input[name=payAmount]').val();
                            var reg = /[0-9]+\.?[0-9]{0,2}/;


                            if (!reg.test(_val) || _val <= 0) {
                                $('input[name=payAmount]').testRemind("请输入大于0的数字");
                                return false;
                            }

                            // 开始时间和结束时间的校验
                            if ($("#payTime").html() == "") {
                                $("#payTime").testRemind("请选择付款时间");
                                return false;
                            }

                            if ($("[name=payType]").attr("index-data") == "") {
                                $(".select").testRemind("请选择付款方式");
                                return false;
                            }
                            return true;
                        }
                    });

                    sele();
                    $(".timeStart").on("click", function () {
                        laydate({
                            istime: true,
                            elem: '#payTime',
                            event: 'focus',
                            format: 'YYYY-MM-DD hh:mm:ss'
                        });
                    });
                }
            });
        });
    }

    ctrl.on('searchFormValid', function () {
        // 表单验证
        $('#searchForm').html5Validate(function () {
            ctrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发 
                ctrl.tirgger('memberRender', data);
                // 分页渲染
                ctrl.renderIn('#pageListCon', '.page', data);
                // 分页加载
                ctrl.tirgger('pageRender', data);
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            })
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

    // 分页加载
    ctrl.on('pageRender', function (data) {
        var toPageNo = request.page,
            pageSize = 10,
            totalPages = data.totalPages;

        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: toPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            ctrl.tirgger('searchSubmit', p, function (data) {
                gl_xt.router.setHistory("?m=" + request.m + "&page=" + p);
                ctrl.tirgger("memberRender", data);
                toPageNo = p;
            });
        });
    });

    // 列表搜索提交
    ctrl.on('searchSubmit', function (toPageNo, callback) {
        var orderId = $("[name=orderId]").val(),
            userName = $("[name=userName]").val(),
            productName = $("[name=productNames]").val(),
            requestStartTime = $("[data-startime=createTime_start]").text(),
            requestEndTime = $("[data-endtime=createTime_end]").text()
        sendData = {
            orderId: orderId ? orderId : "",
            userName: userName ? userName : "",
            productName: productName ? productName : "",
            requestStartTime: requestStartTime ? requestStartTime : "",
            requestEndTime: requestEndTime ? requestEndTime : "",
            start: toPageNo,
            pageSize: 10
        };

        ctrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: "post",
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                //没有搜索到数据时拼接一个对象
                if (!data.data) {
                    data.data = {
                        orderList: [],
                        totalCount: 0,
                        pageSize: 10,
                        start: 1,
                        totalPages: 0
                    };
                }
                data.data.operateData = operateData;
                callback && callback(data.data);
            } else {
                $("#listCon").html("<tr><td colspan='5' style='text-align:center'>数据加载失败</td></tr>");
            }
        });
    });

})(mXbn);