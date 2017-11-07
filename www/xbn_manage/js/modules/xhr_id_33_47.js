;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ + '/' + X.configer.__FILE_HTML__ + '/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath = X.configer.__API_PATH__;

    var brandCtrl = gl_hy.ctrl();

    var localParm = gl_hy.utils.getRequest(),
        operateData = X.getRolesObj.apply(null, localParm.m.split('_').slice(2));


    // 创建视图
    brandCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    // 品牌管理列表加载
    brandCtrl.request({
        url: jsPath + X.configer[localParm.m].api.brandList,
        type: "post",
        data: JSON.stringify({
            "pageSize": '10',
            "cPageNo": localParm.page || 1,
            'listType': '1'
        })
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            data.data.operateData = operateData;
            brandCtrl.render(data.data).then(function () {
                // 设置剩余多少天
                if(data.data.list && data.data.list.length){
                    for (var i = 0; i < data.data.list.length; i++) {
                        data.data.list[i].lastDay = getDays(data.data.list[i].brandExpireTime, 15);
                    }
                }
                $.each(data.data.list,function(i,e){
                    e.brandExpireTime = e.brandExpireTime.substr(0,10);
                    e.chkTime = e.chkTime.substr(0,10);
                })
                // 模板局部渲染 触发
                brandCtrl.tirgger("brandRender", data.data);
                // 表单校验加载
                brandCtrl.tirgger("searchFormValid");

                // 全选框
                sele();

                // 分页渲染
                brandCtrl.renderIn('#pageListCon', '.page', data);

                // 分页加载
                brandCtrl.tirgger('pageRender', data.data);
            });
        } else {
            brandCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
        }
    });

    // 模板局部渲染
    brandCtrl.on('brandRender', function (data) {
        // 设置剩余多少天
        if (data.list &&data.length) {
            for (var i = 0; i < data.list.length; i++) {
                data.list[i].lastDay = getDays(data.list[i].brandExpireTime, 15);
            }
        }
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        brandCtrl.renderIn('#brandListTmpl', '#brandListCon', data);
        // 触发页面dom事件
        brandCtrl.tirgger('dom-event-init', "#id_conts");
    });

    // 初始化页面所有dom事件
    brandCtrl.on('dom-event-init', function (elem) {
        // 搜索提交
        $('.js-brandSearch').off().on('click', function () {
            $("#brandSearchFrom").submit();
        })

        // 冻结
        $(".js-brandFreeze").off().on("click", function () {
            var id = $(this).attr('data-id');
            $.layer({
                title: '品牌冻结',
                area: ['550px', '300px'],
                dialog: {
                    btns: 2,
                    btn: ['确认', '取消'],
                    type: 8,
                    msg: '<form id="freezeForm"><div class="frozen mB20"><p class="frozenTitle">确认冻结该品牌？</p><textarea name="remark" id="" cols="30" rows="10" class="textadd" placeholder="请输入冻结原因" required></textarea></div></form>',
                    yes: function (index) {
                        $("#freezeForm").submit();
                    }
                },
                success: function () {
                    // 控制层级
                    $.testRemind.css.zIndex = $('.xubox_shade').css('zIndex') + 1;
                    // 表单验证
                    $("#freezeForm").html5Validate(function () {
                        brandCtrl.request({
                            url: jsPath + X.configer[localParm.m].api.brandFreeze,
                            data: JSON.stringify({
                                id: id,
                                remark: $("[name=remark]", "#freezeForm").val()
                            }),
                            type: 'post'
                        }).then(function (data) {
                            if (data.statusCode == '2000000') {
                                brandCtrl.tirgger('setTips', '品牌冻结成功！', function () {
                                    gl_hy.router.runCallback();
                                });
                            } else {
                                brandCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                            }
                        });
                    });
                }
            });

        });

        // 解冻
        $(".js-brandUnfreeze").off().on('click', function () {
            var id = $(this).attr('data-id');
            $.layer({
                title: '品牌解冻',
                area: ['550px', '300px'],
                dialog: {
                    btns: 2,
                    btn: ['确认', '取消'],
                    type: 8,
                    msg: '<div class="frozen mB20"><p class="frozenTitle">确认解冻该品牌？</p></div>',
                    yes: function (index) {
                        brandCtrl.request({
                            url: jsPath + X.configer[localParm.m].api.brandUnfreeze + id,
                            type: 'get'
                        }).then(function (data) {
                            if (data.statusCode == '2000000') {
                                brandCtrl.tirgger('setTips', '品牌解冻成功！', function () {
                                    gl_hy.router.runCallback();
                                });
                            } else {
                                brandCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                            }
                        });
                    }
                }
            });
        });

        // 开始时间
        $(".timeStart,#startTime").off().on("click", function () {
            laydate({
                istime: true,
                elem: '#startTime',
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        // 结束时间
        $(".timeEnd,#endTime").off().on("click", function () {
            laydate({
                istime: true,
                elem: '#endTime',
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        // 开始时间
        $(".stimeStart,#sstartTime").on("click", function () {
            laydate({
                istime: true,
                elem: '#sstartTime',
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        // 结束时间
        $(".stimeEnd,#sendTime").on("click", function () {
            laydate({
                istime: true,
                elem: '#sendTime',
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        $(".bigTable tbody tr,.smallTable tbody tr").hover(function () {
            $(this).css({"background-color": "#ececec"});
        }, function () {
            $(this).attr('style', '');
        });

    });

    brandCtrl.on('searchFormValid', function () {
        // 表单验证
        $('#brandSearchFrom').html5Validate(function () {
            brandCtrl.tirgger('searchSubmit', 1, function (data) {
                // 设置剩余多少天
                if (data.list && data.list.length) {
                    for (var i = 0; i < data.list.length; i++) {
                        data.list[i].lastDay = Math.ceil((new Date(data.list[i].brandExpireTime) - new Date()) / (1000 * 60 * 60 * 24));
                    }
                }
                // 模板局部渲染 触发
                brandCtrl.tirgger("brandRender", data);

                // 分页渲染
                brandCtrl.renderIn('#pageListCon', '.page', data);
                // 分页加载
                brandCtrl.tirgger('pageRender', data);
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
                // 开始时间和结束时间的校验
                if ($("#sstartTime").html() && $('#sendTime').html() == "") {
                    $("#sendTime").testRemind("请选择结束时间");
                    return false;
                } else if ($("#sstartTime").html() == "" && $('#sendTime').html()) {
                    $("#sstartTime").testRemind("请选择开始时间");
                    return false;
                } else if ($("#sstartTime").html() > $('#sendTime').html()) {
                    $("#sstartTime").testRemind("开始时间不能大于结束时间");
                    return false;
                }
                return true;
            }
        });
    });

    // 分页加载
    brandCtrl.on('pageRender', function (data) {
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
            brandCtrl.tirgger('searchSubmit', p, function (data) {
                gl_hy.router.setHistory("?m=" + localParm.m + "&page=" + p);
                brandCtrl.tirgger("brandRender", data);
                cPageNo = p;
            });
        });
    });

    // 列表搜索提交
    brandCtrl.on('searchSubmit', function (toPageNo, callback) {
        var cnName = $("input[name=cnName]", '#brandSearchFrom').val(),
            enName = $("input[name=enName]", '#brandSearchFrom').val(),
            qualificationType = $("input[name=qualificationType]", '#brandSearchFrom').attr('index-data'),
            qualificationStatus = $("input[name=qualificationStatus]", '#brandSearchFrom').attr('index-data'),
            relevanceAccount = $("input[name=relevanceAccount]", '#brandSearchFrom').val(),
            beginExpireTime = $("[name=beginExpireTime]", '#brandSearchFrom').html(),
            endExpireTime = $("[name=endExpireTime]", '#brandSearchFrom').html(),
            chkTime_start = $("[name=chkTime_start]", '#brandSearchFrom').html(),
            chkTime_end = $("[name=chkTime_end]", '#brandSearchFrom').html(),
            companyName=$("[name=companyName]",'#brandSearchFrom').val(),
            sendData = {
                "pageSize": 10,
                "cPageNo": toPageNo,
                cnName: cnName ? cnName : null,
                enName: enName ? enName : null,
                businessModel: qualificationType ? qualificationType : null,
                auditStatus: qualificationStatus ? qualificationStatus : null,
                brandExpireTime_start: beginExpireTime ? beginExpireTime : null,
                brandExpireTime_end: endExpireTime ? endExpireTime : null,
                chkTime_start: chkTime_start ? chkTime_start : null,
                chkTime_end: chkTime_end ? chkTime_end : null,
                relevanceAccount: relevanceAccount ? relevanceAccount : null,
                companyName:companyName?companyName:null,
                listType: '1'
            };

        brandCtrl.request({
            url: jsPath + X.configer[localParm.m].api.brandList,
            type: "post",
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                callback && callback(data.data);
            } else {
                brandCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
            }
        });
    });


    // 提示消息弹框方法定义
    brandCtrl.on('setTips', function (msg, callback) {
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

    //"2017-12-26 00:00:00
    function getDays(expireTime, n) {
        var arr = expireTime.split(' '),
            arr1 = arr[0].split('-'),
            arr2 = arr[1].split(':');
        var iDays = -1,
            nowTime = new Date().getTime(),
            expireDate = new Date(parseInt(arr1[0]), parseInt(arr1[1]) - 1, parseInt(arr1[2]), parseInt(arr2[0]), parseInt(arr2[1]), parseInt(arr2[2])),
            expireTime = expireDate.getTime();

        var remainTimes = expireTime - nowTime;
        if (remainTimes >= 0) {
            iDays = Math.ceil(remainTimes / (24 * 60 * 60 * 1000));
        }

        return iDays;
    }
})(mXbn);
