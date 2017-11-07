;
(function (X) {
    var wareHouse = X(),
        joinWareCtrl = wareHouse.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__,//请求地址前缀 "http://tadmin.xbniao.com/owms"
        apiPath = X.configer.__API_PATH__; //请求地址前缀 "http://tadmin.xbniao.com/api"

    var request = wareHouse.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var roleList = {},
        levelList = {};

    var perPage = 10;//列表每页显示10条记录

    joinWareCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };

    joinWareCtrl.request({
        url: dataPath + X.configer[request.m].api.list,
        type: "post",
        data: JSON.stringify({
            limit: perPage,
            cpage: request.page || 1
        })
    }).then(function (data) {
        if (data.statusCode == "2000000") {
            data.data.operateData = operateData;
            joinWareCtrl.render(data.data).then(function () {
                //下拉框
                sele();
                //申请时间选择
                joinWareCtrl.tirgger('selectDate');
                //模板局部渲染
                joinWareCtrl.tirgger("wareRender", data.data);
                //表单校验加载
                joinWareCtrl.tirgger("searchFormValid");
                //分页渲染
                joinWareCtrl.renderIn('#pageListTmpl', '.page', data);
                //分页加载
                joinWareCtrl.tirgger('pageRender', data.data);
                //获取角色数据
                joinWareCtrl.request({
                    url: apiPath + X.configer[request.m].api.userRoleList,
                    type: "post",
                    data: JSON.stringify({
                        "isValid": true
                    })
                }).then(function (data) {
                    if (data.statusCode == '2000000') {
                        $.each(data.data, function (i, val) {
                            roleList[val.id] = val;
                        })
                    } else {
                        joinWareCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                    }
                });
                // 获取等级数据
                joinWareCtrl.request({
                    url: apiPath + X.configer[request.m].api.userLevelList,
                    type: "post",
                    data: JSON.stringify({
                        "isValid": true
                    })
                }).then(function (data) {
                    if (data.statusCode == '2000000') {
                        $.each(data.data, function (i, val) {
                            levelList[val.id] = val;
                        })
                    } else {
                        joinWareCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                    }
                });
            });
        } else {
            $("#listCon").html("<tr><td colspan='10' style='text-align:center'>" + X.getErrorName(data.statusCode, 'wareErr') + "</td></tr>");
        }
    });

    //模板局部渲染
    joinWareCtrl.on('wareRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        joinWareCtrl.renderIn('#listTmpl', '#listCon', data);
        //调用全选功能
        checkeBox("r-box");
        //去掉全选的选中状态
        $('input:checkbox[name=all0]').prop('checked', false);
        // 触发页面dom事件
        joinWareCtrl.tirgger('domEvents', "#id_conts");
    });

    joinWareCtrl.on('domEvents', function (ele) {
        // 搜索提交
        $('.js-search').off().on('click', function () {
            request.page = 1;
            $('#searchForm').submit();
        });
        //批量驳回
        $('.js-batchReject').off().on('click', function () {
            var idArray = [];
            $("[name=accountId]:checked").each(function (index, element) {
                idArray.push($(element).data("id"));
            });
            if (!idArray.length) {
                joinWareCtrl.tirgger('setTipsCommit', '至少选择一个申请进行操作');
                return;
            }
            joinWareCtrl.tirgger('doReject', idArray);
        });
        //单个驳回
        $('.js-reject').off().on('click', function () {
            joinWareCtrl.tirgger('doReject', [$(this).data('id')]);
        });
        //单个审核
        $('.js-pass').off().on('click', function () {
            joinWareCtrl.tirgger('doPass', [$(this).data('id'), $(this).data('userid')]);
        });
    });

    //驳回请求
    joinWareCtrl.on('doReject', function (ids) {
        joinWareCtrl.tirgger('setTipsAsk', '确定驳回所选申请？', function () {
            joinWareCtrl.request({
                url: dataPath + X.configer[request.m].api.reject,
                type: "post",
                data: JSON.stringify({
                    ids: ids
                })
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    wareHouse.router.runCallback();
                } else {
                    joinWareCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        });
    });

    //审核请求
    joinWareCtrl.on('doPass', function (ids) {
        var id = ids[0], //申请的id
            userId = ids[1];//申请人的用户id
        var sendData = {
            id: userId,
            roleList: roleList,
            levelList: levelList
        };

        //获取用户角色等级
        joinWareCtrl.request({
            url: apiPath + X.configer[request.m].api.userDetail + userId,
            type: 'get'
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                sendData.role = data.data.groupId;
                sendData.level = data.data.levelId;

                //角色等级弹框渲染
                joinWareCtrl.renderIn('#settledUserRoleTmpl', '.layerBoxCon', sendData);
                $.layer({
                    title: '修改角色等级',
                    area: ['550px', '300px'],
                    dialog: {
                        btns: 2,
                        btn: ['确认', '取消'],
                        type: 8,
                        msg: $(".layerBoxCon").html(), //设置角色等级数据
                        yes: function (index) {
                            $("#settledUserRoleForm").submit();
                        }
                    },
                    success: function () {
                        $(".layerBoxCon").html("");
                        $.testRemind.css.zIndex = $('.xubox_shade').css('zIndex') + 1;
                        sele('.select', "#settledUserRoleForm");
                        // 表单验证
                        $("#settledUserRoleForm").html5Validate(function () {
                            //审核
                            joinWareCtrl.request({
                                url: dataPath + X.configer[request.m].api.pass,
                                data: JSON.stringify({
                                    ids: [id]
                                }),
                                type: 'post'
                            }).then(function (passData) {
                                if (passData.statusCode == '2000000') {
                                    //保存角色和等级
                                    joinWareCtrl.request({
                                        data: JSON.stringify({
                                            id: $('input[name=id]', "#settledUserRoleForm").val(),
                                            groupId: $('input[name=groupId]', "#settledUserRoleForm").attr('index-data'),
                                            levelId: $('input[name=levelId]', "#settledUserRoleForm").attr('index-data')
                                        }),
                                        url: apiPath + X.configer[request.m].api.userUpdateGroupLevel,
                                        type: 'post'
                                    }).then(function (groupLeveldata) {
                                        if (groupLeveldata.statusCode == '2000000') {
                                            joinWareCtrl.tirgger('setTipsCommit', '海外仓审核成功', function () {
                                                wareHouse.router.runCallback();
                                            });
                                        } else {
                                            joinWareCtrl.tirgger('setTipsCommit', X.getErrorName(groupLeveldata.statusCode, 'wareErr'));
                                        }
                                    });
                                } else {
                                    joinWareCtrl.tirgger('setTipsCommit', X.getErrorName(passData.statusCode, 'wareErr'));
                                }
                            });
                        });
                    }
                });
            } else {
                joinWareCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode),'wareErr');
            }
        });
    });

    //表单验证
    joinWareCtrl.on('searchFormValid', function () {
        // 表单验证
        $('#searchForm').html5Validate(function () {
            joinWareCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发
                joinWareCtrl.tirgger('wareRender', data);
                // 分页渲染
                joinWareCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                joinWareCtrl.tirgger('pageRender', data);
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            });
        }, {
            validate: function () {
                // 开始时间和结束时间的校验
                if ($("#startTime").text() && $('#endTime').text() == "") {
                    $("#endTime").testRemind("请选择结束时间");
                    return false;
                } else if ($("#startTime").text() == "" && $('#endTime').text()) {
                    $("#startTime").testRemind("请选择开始时间");
                    return false;
                } else if ($("#startTime").text() > $('#endTime').text()) {
                    $("#startTime").testRemind("开始时间不能大于结束时间");
                    return false;
                }
                return true;
            }
        });
    });

    //申请时间选择
    joinWareCtrl.on('selectDate', function () {
        // 开始时间
        $(".timeStart,#startTime").on("click", function () {
            laydate({
                istime: true,
                elem: '#startTime',
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss',
                max: laydate.now(),
                choose: function (dates) {
                    endTime.min = dates; //开始日选好后，重置结束日的最小日期
                    endTime.start = dates;//将结束日的初始值设定为开始日
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
                max: laydate.now(),
                choose: function (dates) {
                    startTime.max = dates; //结束日选好后，重置开始日的最大日期
                }
            });
        });
    });

    // 分页加载
    joinWareCtrl.on('pageRender', function (data) {
        var cPageNo = request.page,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            joinWareCtrl.tirgger('searchSubmit', p, function (data) {
                wareHouse.router.setHistory("?m=" + request.m + "&page=" + p);
                joinWareCtrl.tirgger("wareRender", data);
                cPageNo = p;
            });
        });
    });

    // 列表搜索提交
    joinWareCtrl.on('searchSubmit', function (toPageNo, callback) {
        var form = $('#searchForm');
        var sendData = {
            cpage: toPageNo,
            limit: perPage,
            applyer: $('input[name=applyer]', form).val(),
            corporateName: $('input[name=corporateName]', form).val(),
            contactName: $('input[name=contactName]', form).val(),
            contactPhone: $('[name=contactPhone]', form).val(),
            goodsType: $('[name=goodsType]', form).val(),
            isContainBattery: $('[name=isContainBattery]', form).attr('index-data'),
            status: $('[name=status]', form).attr('index-data'),
            searchParamList: []
        };
        //申请时间起至时间不为空
        if ($('#startTime').text().length) {
            sendData.searchParamList.push({
                key: 'applyTime',
                value: $('#startTime').text(),
                operator: 'ge' //大于等于
            });
        }
        if ($('#endTime').text().length) {
            sendData.searchParamList.push({
                key: 'applyTime',
                value: $('#endTime').text(),
                operator: 'le' //小大于等于
            });
        }

        joinWareCtrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: "post",
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                callback && callback(data.data);
            } else {
                joinWareCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
            }
        });
    });

    // 提示消息弹框方法定义 ,只有确定按钮
    joinWareCtrl.on('setTipsCommit', function (msg, callback) {
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
    joinWareCtrl.on('setTipsAsk', function (msg, callback) {
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
