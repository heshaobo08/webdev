;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ + '/' + X.configer.__FILE_HTML__ + '/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath = X.configer.__API_PATH__;

    var memberCtrl = gl_hy.ctrl();

    var localParm = gl_hy.utils.getRequest(),
        operateData = X.getRolesObj.apply(null, localParm.m.split('_').slice(2));

    var roleList = {},

        levelList = {};

    // 创建视图
    memberCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    // 获取等级数据
    memberCtrl.request({
        url: jsPath + X.configer[localParm.m].api.userLevelList,
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
            memberCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
        }
    });

    // 获取角色数据
    memberCtrl.request({
        url: jsPath + X.configer[localParm.m].api.userRoleList,
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
            memberCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
        }
    });


    // 会员管理列表加载
    memberCtrl.request({
        url: jsPath + X.configer[localParm.m].api.settledList,
        type: "post",
        data: JSON.stringify({
            "pageSize": '10',
            "cPageNo": localParm.page || 1,
            "listType": '1'
        })
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            data.data.role = roleList;
            data.data.level = levelList;
            data.data.operateData = operateData;
            memberCtrl.render(data.data).then(function () {
                // 模板局部渲染 触发
                memberCtrl.tirgger("settledRender", data.data);
                // 表单校验加载
                memberCtrl.tirgger("searchFormValid");

                // 分页渲染
                memberCtrl.renderIn('#pageListCon', '.page', data.data);

                // 全选框
                sele();

                memberCtrl.tirgger('pageRender', data.data);
            });
        } else {
            memberCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
        }
    });

    // 模板局部渲染
    memberCtrl.on('settledRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        memberCtrl.renderIn('#settledListTmpl', '#settledListCon', data);
        // 触发页面dom事件
        memberCtrl.tirgger('dom-event-init', "#id_conts");
    });

    // 初始化页面所有dom事件
    memberCtrl.on('dom-event-init', function (elem) {
        // 搜索提交
        $('.js-settleSearch').off().on('click', function () {
            $("#settledEarchForm").submit();
        })

        // 修改角色等级
        $(".js-settledModify").off().on("click", function () {
            var id = $(this).attr('data-id'),
                sendData = {
                    id: id,
                    roleList: roleList,
                    levelList: levelList
                };
            //获取用户角色等级
            memberCtrl.request({
                url: jsPath + X.configer[localParm.m].api.userDetail + id,
                type: 'get'
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    sendData.role = data.data.groupId;
                    sendData.level = data.data.levelId;
                    //局部模板渲染
                    memberCtrl.renderIn('#settledUserRoleTmpl', ".layerBoxCon", sendData);
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
                                memberCtrl.request({
                                    data: JSON.stringify({
                                        id: $('input[name=id]', "#settledUserRoleForm").val(),
                                        groupId: $('input[name=groupId]', "#settledUserRoleForm").attr('index-data'),
                                        levelId: $('input[name=levelId]', "#settledUserRoleForm").attr('index-data')
                                    }),
                                    url: jsPath + X.configer[localParm.m].api.userUpdateGroupLevel,
                                    type: 'post'
                                }).then(function (data) {
                                    if (data.statusCode == '2000000') {
                                        memberCtrl.tirgger('setTips', '设置角色等级成功', function () {
                                            gl_hy.router.runCallback();
                                        });
                                    } else {
                                        memberCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                                    }
                                });
                            });
                        }
                    });

                } else {
                    memberCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                }
            });
        });

        //UPC授权
        $(".js-settledLicense").off().on("click", function () {
            var id = $(this).attr('data-id'),
                sendData = {};
            // 获取商家upc数量
            memberCtrl.request({
                url: jsPath + X.configer[localParm.m].api.userDetail + id,
                type: 'get'
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    // 设置用户upc数量
                    sendData.upcTotal = data.data.upcTotal;
                    //局部模板渲染
                    memberCtrl.renderIn('#settledUpcTmpl', ".layerBoxCon", sendData);
                    // 弹框
                    $.layer({
                        title: 'UPC授权',
                        area: ['550px', '200px'],
                        dialog: {
                            btns: 2,
                            btn: ['确认', '取消'],
                            type: 8,
                            msg: $(".layerBoxCon").html(),
                            yes: function (index) {
                                $("#settledUpcForm").submit();
                            }
                        },
                        success: function () {
                            $(".layerBoxCon").html("");
                            $.testRemind.css.zIndex = $('.xubox_shade').css('zIndex') + 1;

                            // 表单验证
                            $("#settledUpcForm").html5Validate(function () {
                                memberCtrl.request({
                                    url: jsPath + X.configer[localParm.m].api.userUpcAccredit + id + '/' + $('input[name=count]', "#settledUpcForm").val(),
                                    type: 'get'
                                }).then(function (data) {
                                    if (data.statusCode == '2000000') {
                                        memberCtrl.tirgger('setTips', 'UPC设置成功', function () {
                                            gl_hy.router.runCallback();
                                        });
                                    } else {
                                        memberCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                                    }
                                });
                            });

                            // 数据修改触发
                            $('input[name=count]', "#settledUpcForm").off().on('input change', function () {
                                $("#settledUpcTotal").html((parseInt($(this).val()) || 0) + parseInt($("#settledCurrentNum").html()));
                            });

                        }
                    });
                } else {
                    memberCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                }
            });
        });

        //ebay刊登量授权
        $(".js-settledPublish").off().on("click", function () {
            var id = $(this).attr('data-id'),
                sendData = {};
            // 获取商家ebay刊登量授权数量
            memberCtrl.request({
                url: jsPath + X.configer[localParm.m].api.userDetail + id,
                type: 'get'
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    // 设置数量
                    sendData.ebayListTotal = data.data.ebayListTotal;
                    //局部模板渲染
                    memberCtrl.renderIn('#settledEbayTmpl', ".layerBoxCon", sendData);
                    $.layer({
                        title: 'ebay刊登量授权',
                        area: ['550px', '200px'],
                        dialog: {
                            btns: 2,
                            btn: ['确认', '取消'],
                            type: 8,
                            msg: $(".layerBoxCon").html(),
                            yes: function (index) {
                                $("#settledEbayForm").submit();
                            }
                        },
                        success: function () {
                            $(".layerBoxCon").html("");
                            $.testRemind.css.zIndex = $('.xubox_shade').css('zIndex') + 1;

                            // 表单验证
                            $("#settledEbayForm").html5Validate(function () {
                                memberCtrl.request({
                                    url: jsPath + X.configer[localParm.m].api.userEbayPublish + id + '/' + $('input[name=count]', "#settledEbayForm").val(),
                                    type: 'get'
                                }).then(function (data) {
                                    if (data.statusCode == '2000000') {
                                        memberCtrl.tirgger('setTips', 'ebay刊登量授权成功', function () {
                                            gl_hy.router.runCallback();
                                        });
                                    } else {
                                        memberCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                                    }
                                });
                            });

                            // 数据修改触发
                            $('input[name=count]', "#settledEbayForm").off().on('input change', function () {
                                $("#settledEbayTotal").html((parseInt($(this).val()) || 0) + parseInt($("#settledEbayCurrentNum").html()));
                            });

                        }
                    });
                } else {
                    memberCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
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

        $(".bigTable tbody tr,.smallTable tbody tr").hover(function () {
            $(this).css({"background-color": "#ececec"});
        }, function () {
            $(this).attr('style', '');
        });

    });

    memberCtrl.on('searchFormValid', function () {
        // 表单验证
        $('#settledEarchForm').html5Validate(function () {
            memberCtrl.tirgger('searchSubmit', 1, function (data) {
                // 模板渲染
                memberCtrl.tirgger("settledRender", data);
                // 分页渲染
                memberCtrl.renderIn('#pageListCon', '.page', data);
                // 分页加载
                memberCtrl.tirgger('pageRender', data);
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

    // 分页加载
    memberCtrl.on('pageRender', function (data) {
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
            memberCtrl.tirgger('searchSubmit', p, function (data) {
                gl_hy.router.setHistory("?m=" + localParm.m + "&page=" + p);
                memberCtrl.tirgger("settledRender", data);
                cPageNo = p;
            });
        });
    });

    // 列表搜索提交
    memberCtrl.on('searchSubmit', function (toPageNo, callback) {
        var userMobile = $('input[name=userMobile]', "#settledEarchForm").val(),
            companyName = $('input[name=companyName]', "#settledEarchForm").val(),
            groupId = $('input[name=groupId]', "#settledEarchForm").attr('index-data'),
            startChkTime = $('#startTime', "#settledEarchForm").html(),
            endChkTime = $('#endTime', "#settledEarchForm").html(),
            levelId = $('input[name=levelId]', "#settledEarchForm").attr('index-data'),
            companyType = $('input[name=companyType]', "#settledEarchForm").attr('index-data'),
            sendData = {
                userMobile: userMobile ? userMobile : null,
                companyName: companyName ? companyName : null,
                companyType:companyType?companyType:null,
                groupId: groupId ? groupId : null,
                levelId: levelId ? levelId : null,
                startChkTime: startChkTime ? startChkTime : null,
                endChkTime: endChkTime ? endChkTime : null,
                pageSize: 10,
                cPageNo: toPageNo,
                listType: "1"
            };
        // 发送请求
        memberCtrl.request({
            data: JSON.stringify(sendData),
            url: jsPath + X.configer[localParm.m].api.settledList,
            type: 'post'
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.role = roleList;
                data.data.level = levelList;
                data.data.operateData = operateData;
                callback && callback(data.data);
            } else {
                memberCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
            }
        });
    });


    // 提示消息弹框方法定义
    memberCtrl.on('setTips', function (msg, callback) {
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
