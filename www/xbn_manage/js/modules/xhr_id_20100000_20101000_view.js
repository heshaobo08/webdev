;
(function (X) {
    var wareHouse = X(),
        joinWareCtrl = wareHouse.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template"
        dataPath = X.configer.__OWMS_PATH__,//请求地址前缀 "http://tadmin.xbniao.com/owms"
        apiPath =X.configer.__API_PATH__;

    var request = wareHouse.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  id:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    joinWareCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };

    var roleList = {},
        levelList = {};

    joinWareCtrl.request({
        url: dataPath + X.configer[request.m].api.detail + '?id=' + request.id,
        type: 'get'
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            //模板渲染
            data.data.operateData = operateData;
            joinWareCtrl.render(data.data).then(function () {
                joinWareCtrl.tirgger('domEvents', '#id_conts');
                //获取角色数据
                joinWareCtrl.request({
                    url: apiPath + X.configer[request.m].api.userRoleList,
                    type: "post",
                    data: JSON.stringify({
                        "isValid": true
                    })
                }).then(function (roleData) {
                    if (roleData.statusCode == '2000000') {
                        $.each(roleData.data, function (i, val) {
                            roleList[val.id] = val;
                        })
                    } else {
                        joinWareCtrl.tirgger('setTipsCommit', X.getErrorName(roleData.statusCode, 'wareErr'));
                    }
                });
                // 获取等级数据
                joinWareCtrl.request({
                    url: apiPath + X.configer[request.m].api.userLevelList,
                    type: "post",
                    data: JSON.stringify({
                        "isValid": true
                    })
                }).then(function (levelData) {
                    if (levelData.statusCode == '2000000') {
                        $.each(levelData.data, function (i, val) {
                            levelList[val.id] = val;
                        })
                    } else {
                        joinWareCtrl.tirgger('setTipsCommit', X.getErrorName(levelData.statusCode, 'wareErr'));
                    }
                });
            });
        } else {
            joinWareCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });

    joinWareCtrl.on('domEvents', function (elem) {
        //单个驳回
        $('.js-reject').off().on('click', function () {
            joinWareCtrl.tirgger('doReject', [$(this).data('id')]);
        });
        //单个审核
        $('.js-pass').off().on('click', function () {
            joinWareCtrl.tirgger('doPass', [$(this).data('id'), $(this).data('userid')]);
        });
        $('.btnMain a').eq(0).removeClass('buttonText').addClass('button');
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
                    wareHouse.router.setHistory("?m=xhr_id_20100000_20101000");
                    wareHouse.router.runCallback();
                    //防止面包屑导航文字不对
                    document.title = '海外仓业务管理-海外仓申请管理';
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
                                                wareHouse.router.setHistory("?m=xhr_id_20100000_20101000");
                                                wareHouse.router.runCallback();
                                                //防止面包屑导航文字不对
                                                document.title = '海外仓业务管理-海外仓申请管理';
                                            });
                                        } else {
                                            joinWareCtrl.tirgger('setTipsCommit', X.getErrorName(groupLeveldata.statusCode));
                                        }
                                    });
                                } else {
                                    joinWareCtrl.tirgger('setTipsCommit', X.getErrorName(passData.statusCode), 'wareErr');
                                }
                            });
                        });
                    }
                });
            } else {
                joinWareCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode));
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
