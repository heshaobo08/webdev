;
(function (X) {

    var gl_pz = X();

    var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__ + '/';

    // var jsPath=X.configer.__API_PATH__ + "/" + X.configer.__FILE_JS__+'/';

    var jsPath = X.configer.__API_PATH__;

    var localParm = gl_pz.utils.getRequest(),
        operateData = X.getRolesObj.apply(null, localParm.m.split('_').slice(2));

    var setCtrl = gl_pz.ctrl(),
        cPageNo = 1;
    // 创建视图
    setCtrl.view = {
        elem: "#id_conts",
        tpl: path + "/" + X.configer[localParm.m].tpl
    };
    // 加载数据和模板
    setCtrl.request({
        url: jsPath + X.configer[localParm.m].api.keywordList,
        type: "post",
        data: JSON.stringify({
            "pageSize": 10,
            "cPageNo": localParm.page || 1,
            "orderBy": 'creaTime',
            "isAsc": false
        })
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            data.data.operateData = operateData;
            setCtrl.render(data.data).then(function () {
                //列表渲染和事件触发
                setCtrl.tirgger('sensitiveListRender', data.data);
                // 分页渲染
                setCtrl.renderIn('#pageListCon', '.page');

                // 分页加载
                setCtrl.tirgger('pageRender', data.data);
                // 下拉列表
                sele();
            });
        } else {
            setCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
        }
    })

    // 数据渲染（列表和分页模板）
    setCtrl.on('sensitiveListRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        // 敏感词列表渲染
        setCtrl.renderIn('#sensitiveListCon', '#showSensitiveList', data);
        // 触发页面dom事件
        setCtrl.tirgger('dom-event-init', "#id_conts");

    })


    // 初始化页面所有dom事件
    setCtrl.on('dom-event-init', function (elem) {

        // 批量添加特殊用户
        $(elem).find(".js-batchSet").off().on("click", function () {
            // 判断未选中的checkbox
            if (!$('input[data-id]:checked', elem).length) {
                // 消息提示
                setCtrl.tirgger('setTips', "至少选择一个敏感词进行操作");
                return;
            }
            // 设置数据
            data = {type: 'set'};
            var temVal = {ids: [], vals: []};
            // 添加选中id
            $('input[data-id]:checked', elem).each(function (i) {
                temVal.ids.push($(this).attr('data-id'));
                temVal.vals.push($(this).parent('td').siblings('.keyVal').find('span').html());
            })
            data.keywordValue = temVal.vals.join(',');
            data.ids = temVal.ids.join(',');
            setCtrl.renderIn('#setLayerCon', '.layerHtmlBox', data);
            $.layer({
                title: '设置特殊用户',
                area: ['550px', '418px'],
                dialog: {
                    btns: 2,
                    btn: ['确认', '取消'],
                    type: 8,
                    msg: $('.layerHtmlBox').html(),//$('#setLayerCon').tmpl(data).html(),
                    yes: function (index) {
                        // 表单提交
                        $("#layBoxForm").submit();
                    }
                },
                success: function (layero, index) {
                    $('.layerHtmlBox').html("");
                    // 修改index
                    $.testRemind.css.zIndex = $('.xubox_shade').css('zIndex') + 1;
                    // 表单验证
                    $('#layBoxForm').html5Validate(function () {
                        // 发送添加请求
                        setCtrl.request({
                            data: JSON.stringify({
                                ids: $('input[name=ids]', '.jsSetCon').val(),
                                exceptantUsers: $('[name=exceptantUsers]', '.jsSetCon').val()
                            }),
                            type: 'post',
                            url: jsPath + X.configer[localParm.m].api.keywordExceptantUsers
                        }).then(function (data) {
                            if (data.statusCode == '2000000') {
                                // 弹层关闭
                                layer.close(layer.index);
                                // 重新加载
                                gl_pz.router.runCallback();
                            } else {
                                setCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                            }
                        });
                    });
                }
            });
        });
        // 修改特殊用户
        $(elem).find(".js-set").off().on("click", function () {
            var id = $(this).attr('data-id');
            // 获取单个敏感词详情数据
            setCtrl.request({
                url: jsPath + X.configer[localParm.m].api.keywordGetById + id,
                type: 'get'
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    data.data.type = 'set';
                    setCtrl.renderIn('#setLayerCon', '.layerHtmlBox', data.data);
                    $.layer({
                        title: '设置特殊用户',
                        area: ['550px', '418px'],
                        dialog: {
                            btns: 2,
                            btn: ['确认', '取消'],
                            type: 8,
                            msg: $('.layerHtmlBox').html(),
                            yes: function (index) {
                                $('#layBoxForm').submit();
                            }
                        },
                        success: function () {
                            $('.layerHtmlBox').html('');
                            // 修改index
                            $.testRemind.css.zIndex = $('.xubox_shade').css('zIndex') + 1;
                            // 表单验证
                            $('#layBoxForm').html5Validate(function () {
                                // 发送添加请求
                                setCtrl.request({
                                    data: JSON.stringify({
                                        id: $('[name=id]', '.jsSetCon').val(),
                                        exceptantUsers: $('[name=exceptantUsers]', '.jsSetCon').val()
                                    }),
                                    type: 'post',
                                    url: jsPath + X.configer[localParm.m].api.keywordUpdate
                                }).then(function (data) {
                                    if (data.statusCode == '2000000') {
                                        // 弹层关闭
                                        layer.close(layer.index);
                                        // 重新加载
                                        gl_pz.router.runCallback();
                                    } else {
                                        setCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                                    }
                                });
                            });
                        }
                    });
                } else {
                    setCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                }
            })
        });
        // 添加敏感词
        $(".js-addSens", elem).off().on("click", function () {
            data = {type: 'add'};
            // Todo 表单验证
            setCtrl.renderIn('#setLayerCon', '.layerHtmlBox', data);
            $.layer({
                title: '添加敏感词',
                area: ['550px', '418px'],
                dialog: {
                    btns: 2,
                    btn: ['确认', '取消'],
                    type: 8,
                    msg: $('.layerHtmlBox').html(),
                    yes: function (index) {
                        $('#layBoxForm').submit();
                    }
                },
                success: function (layero, index) {
                    $('.layerHtmlBox').html("");
                    // 修改index
                    $.testRemind.css.zIndex = $('.xubox_shade').css('zIndex') + 1;
                    // 表单验证
                    $('#layBoxForm').html5Validate(function () {
                        // 发送添加请求
                        setCtrl.request({
                            data: JSON.stringify({
                                platform: $('input[name=platform]', '.jsAddCon').attr('index-data'),
                                keyWordValues: $('[name=keyWordValues]', '.jsAddCon').val()
                            }),
                            url: jsPath + X.configer[localParm.m].api.keywordSaves,
                            type: 'post'
                        }).then(function (data) {
                            if (data.statusCode == '2000000') {
                                // 弹层关闭
                                layer.close(layer.index);
                                // 重新加载
                                gl_pz.router.runCallback();
                            } else {
                                setCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                            }
                        });
                    });
                }
            });
            // 下拉列表
            sele();
        });
        // 批量删除
        $(".js-deleteSens", elem).off().on("click", function () {
            var _that = $(this);
            // 判断未选中的checkbox
            if (!_that.attr('data-id') && !$('input[data-id]:checked', elem).length) {
                // 消息提示
                setCtrl.tirgger('setTips', "至少选择一个敏感词进行操作");
                return;
            }

            $.layer({
                title: '提示信息',
                area: ['550px', '190px'],
                dialog: {
                    btns: 2,
                    btn: ['确认', '取消'],
                    type: 8,
                    msg: '<div class="tips">确认删除敏感词？</div>',
                    yes: function (index) {
                        var data = {},
                            ids = [],
                            url = jsPath + X.configer[localParm.m].api.keywordDeleteByIds;
                        sendData = {}; //接口数据
                        if (!_that.attr('data-id')) {
                            // 拼接ids(批量删除)
                            $('input[data-id]:checked', elem).each(function (i) {
                                ids.push($(this).attr('data-id'));
                            })
                            data.ids = ids.join(',');
                            sendData = {
                                data: JSON.stringify(data),
                                type: 'post',
                                url: url
                            };
                        } else {
                            // 单个删除
                            data = _that.attr('data-id');
                            url = jsPath + X.configer[localParm.m].api.keywordDeleteById;
                            sendData = {
                                url: url + data,
                                type: 'get'
                            };
                        }
                        setCtrl.request(sendData).then(function (data) {
                            if (data.statusCode == '2000000') {
                                // 弹层关闭
                                layer.close(index);
                                // 重新加载
                                gl_pz.router.runCallback();
                            } else {
                                setCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                            }
                        })
                    }
                }
            });
        });


        // 禁用(Todo)
        $(".js-forbidSens", elem).off().on("click", function () {
            // 判断未选中的checkbox
            if (!$('input[data-id]:checked', elem).length) {
                // 消息提示
                setCtrl.tirgger('setTips', "至少选择一个敏感词进行操作");
                return;
            }
            var ids = [];
            // 添加选中id
            $('input[data-id]:checked', elem).each(function (i) {
                ids.push($(this).attr('data-id'));
            })
            ids = ids.join(',');
            $.layer({
                title: '提示信息',
                area: ['550px', '190px'],
                dialog: {
                    btns: 2,
                    btn: ['确认', '取消'],
                    type: 8,
                    msg: '<div class="tips"><em>禁用敏感词后，设置的敏感词将可以提交至审核后台</em></div>',
                    yes: function (index) {
                        // 发送禁用请求
                        setCtrl.request({
                            data: JSON.stringify({ids: ids}),
                            url: jsPath + X.configer[localParm.m].api.keywordDisables,
                            type: 'post'
                        }).then(function (data) {
                            if (data.statusCode == '2000000') {
                                // 弹层关闭
                                layer.close(index);
                                // 重新加载
                                gl_pz.router.runCallback();
                            } else {
                                setCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                            }
                        })
                    }
                }
            });
        });
        // 启用(Todo)
        $(".js-startSens", elem).off().on("click", function () {
            // 判断未选中的checkbox
            if (!$('input[data-id]:checked', elem).length) {
                // 消息提示
                setCtrl.tirgger('setTips', "至少选择一个敏感词进行操作");
                return;
            }
            var ids = [];
            // 添加选中id
            $('input[data-id]:checked', elem).each(function (i) {
                ids.push($(this).attr('data-id'));
            })
            ids = ids.join(',');
            $.layer({
                title: '提示信息',
                area: ['550px', '190px'],
                dialog: {
                    btns: 2,
                    btn: ['确认', '取消'],
                    type: 8,
                    msg: '<div class="tips"><em>启用敏感词后，设置的敏感词将无法提交至审核后台</em></div>',
                    yes: function (index) {
                        // 发送禁用请求
                        setCtrl.request({
                            data: JSON.stringify({ids: ids}),
                            url: jsPath + X.configer[localParm.m].api.keywordEnableds,
                            type: 'post'
                        }).then(function (data) {
                            if (data.statusCode == '2000000') {
                                // 弹层关闭
                                layer.close(index);
                                // 重新加载
                                gl_pz.router.runCallback();
                            } else {
                                alert('操作失败');
                            }
                        })
                    }
                }
            });
        });
        // 修改
        $(".js-editSens", elem).off().on("click", function () {
            // 获取单个敏感词详情数据
            setCtrl.request({
                url: jsPath + X.configer[localParm.m].api.keywordGetById + $(this).attr('data-id'),
                type: 'get'
            }).then(function (data) {
                data.data.type = 'edit';
                setCtrl.renderIn('#setLayerCon', '.layerHtmlBox', data.data);
                $.layer({
                    title: '修改设置',
                    area: ['550px', '250px'],
                    dialog: {
                        btns: 2,
                        btn: ['确认', '取消'],
                        type: 8,
                        msg: $('.layerHtmlBox').html(),
                        yes: function (index) {
                            $('#layBoxForm').submit();
                        }
                    },
                    success: function (layero, index) {
                        $('.layerHtmlBox').html("");
                        // 修改index
                        $.testRemind.css.zIndex = $('.xubox_shade').css('zIndex') + 1;
                        // 表单验证
                        $('#layBoxForm').html5Validate(function () {
                            // 发送请求（修改敏感词）
                            setCtrl.request({
                                data: JSON.stringify({
                                    id: $('input[name=id]', '.jsEditCon').val(),
                                    platform: $('input[name=platform]', '.jsEditCon').attr('index-data'),
                                    keywordValue: $('input[name=keywordValue]', '.jsEditCon').val()
                                }),
                                url: jsPath + X.configer[localParm.m].api.keywordUpdate,
                                type: 'post'
                            }).then(function (data) {
                                gl_pz.router.runCallback();
                                layer.close(layer.index);
                            });
                        });
                        // 下拉列表
                        sele();
                    }
                });
            })

        });

        // 敏感词排序
        $('.js-orderSensitive', elem).off().on('click', function () {
            var isAsc = $(this).data('isasc'),
                orderName = $(this).data('order');
            _that = $(this);
            sendData = {};
            if (isAsc == 'desc') {
                sendData.isAsc = false;
            } else {
                sendData.isAsc = true;
            }
            sendData.orderBy = orderName;
            sendData.pageSize = 10;
            sendData.cPageNo = cPageNo;
            setCtrl.request({
                url: jsPath + X.configer[localParm.m].api.keywordList,
                data: JSON.stringify(sendData),
                type: 'post'
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    //列表渲染和事件触发
                    data.data.operateData = operateData;
                    setCtrl.tirgger('sensitiveListRender', data.data);
                    _that.data('isasc', isAsc == 'desc' ? "asc" : "desc").find('span').text(isAsc == 'desc' ? "↓" : "↑");
                } else {
                    setCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                }
            });

        });

        // 搜索
        $('.js-sensitiveSearch').off().on('click', function () {
            setCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发
                setCtrl.tirgger('sensitiveListRender', data);
                // 分页渲染
                setCtrl.renderIn('#pageListCon', '.page', data);
                // 分页加载
                setCtrl.tirgger('pageRender', data);
                //显示搜索结果
                $('#searchTotalCount').closest('.addbutton').removeClass('none');
            });
        });

        // 全选框
        checkeBox();

        // 提示框样式
        // $.testRemind.css = {
        //     "color": "#FFF",
        //     "borderColor": "#f60",
        //     "backgroundColor": "#f60",
        //     "border-radius": "5px"
        // };

        $(".bigTable tbody tr,.smallTable tbody tr").hover(function () {
            $(this).css({"background-color": "#ececec"});
        }, function () {
            $(this).attr('style', '');
        });
    });
    // 分页加载
    setCtrl.on('pageRender', function (data) {
        var cPageNo = localParm.page,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            setCtrl.tirgger('searchSubmit', p, function (data) {
                gl_pz.router.setHistory("?m=" + localParm.m + "&page=" + p);
                setCtrl.tirgger("sensitiveListRender", data);
                cPageNo = p;
            });
        });
    });

    // 列表搜索提交
    setCtrl.on('searchSubmit', function (toPageNo, callback) {
        var keywordValue = $('input[name=keywordValue]', '#searchForm').val(),
            exceptantUsers = $('input[name=exceptantUsers]', '#searchForm').val(),
            platform = $('input[name=platform]', '#searchForm').attr('index-data'),
            status = $('input[name=status]', '#searchForm').attr('index-data'),
            sendData = {
                "keywordValue": keywordValue ? keywordValue : null,
                "exceptantUsers": exceptantUsers ? exceptantUsers : null,
                "platform": platform ? platform : null,
                "status": status ? status : null,
            };
        sendData.pageSize = 10;
        sendData.cPageNo = toPageNo;
        sendData.isAsc = $('.js-orderSensitive').attr('data-isasc') == 'desc' ? false : true;
        sendData.orderBy = "keywordValue";
        setCtrl.request({
            url: jsPath + X.configer[localParm.m].api.keywordList,
            data: JSON.stringify(sendData),
            type: 'post'
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                callback && callback(data.data);
            } else {
                setCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
            }
        });
    });

    // 提示消息弹框方法定义
    setCtrl.on('setTips', function (msg, callback) {
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
    })


})(mXbn);
