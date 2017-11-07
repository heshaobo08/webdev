;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ + '/' + X.configer.__FILE_HTML__ + '/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath = X.configer.__API_PATH__;

    var brandCtrl = gl_hy.ctrl();

    var localParm = gl_hy.utils.getRequest();

    var brandId = localParm.id,

        returnUrl = localParm.r;

    // 创建视图
    brandCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    // 修改
    if (brandId) {
        brandCtrl.request({
            url: jsPath + X.configer[localParm.m].api.brandDetail + brandId,
            type: 'get'
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                // 获取授权站点列表
                brandCtrl.request({
                    url: jsPath + X.configer[localParm.m].api.brandAuthSite + brandId,
                    type: 'get'
                }).then(function (siteData) {
                    if (siteData.statusCode == '2000000') {
                        if (siteData.data) {
                            data.data.siteAuthList = siteData.data; //授权站点
                        }
                        data.data.pageStatus = 'audit';
                        data.data.returnUrl = returnUrl;
                        // 获取品牌关联图片
                        getRelationPicture(X, [brandId], function (filedata) {
                            if (filedata.length > 0) {
                                data.data.filedata = {};
                                //0为品牌图片，1为资质证书图片
                                var imgType = '0';
                                $.each(filedata, function (i, img) {
                                    imgType = img.type != '0' ? '1' : '0';
                                    if (!data.data.filedata[imgType]) {
                                        data.data.filedata[imgType] = [];
                                    }
                                    data.data.filedata[imgType].push(img);
                                });
                            }
                            // 模板渲染
                            brandCtrl.render(data.data).then(function () {
                                // event 初始化
                                brandCtrl.tirgger('dom_event_init', '#id_conts', data.data)
                            });
                        });

                    } else {
                        brandCtrl.tirgger('setTips', X.getErrorName(siteData.statusCode));
                    }
                });

            } else {
                brandCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
            }
        });
    }

    // dom event
    brandCtrl.on('dom_event_init', function (ele, getBrandData) {
        var addAuthSiteList = [], //要返回的授权站点数据
            selectData = null,
            id = brandId;

        // 获取未授权站点数据
        brandCtrl.request({
            url: jsPath + X.configer[localParm.m].api.brandNoAuthSite + id,
            type: 'get'
        }).then(function (unAuthdata) {
            if (unAuthdata.statusCode == '2000000') {
                getBrandData.unAuthList = unAuthdata.data;//设置未授权数据
            } else {
                brandCtrl.tirgger('setTips', X.getErrorName(unAuthdata.statusCode));
            }
        });

        // 查看图片
        $('.details').undelegate().delegate('img', 'click', function () {
            var imgUrl = $(this).attr('src');
            $.layer({
                title: '查看图片',
                area: ['540px', '540px'],
                dialog: {
                    btn: 1,
                    btn: ['返回'],
                    type: 8,
                    msg: '<div class="tips mB20"><img src="' + imgUrl + '" style="max-width:520px;max-height:520px"/></div>',
                    yes: function (index) {
                        layer.close(index);
                    }
                }
            });
        });

        // 审核驳回
        $('.js-brandAuditUnPass', ele).off().on('click', function () {
            var id = $(this).attr('data-id');
            $.layer({
                title: '品牌申请审核驳回',
                area: ['500px', '200px'],
                dialog: {
                    btns: 2,
                    btn: ['确定', '取消'],
                    type: 8,
                    msg: '<form id="authForbidForm"><div class="frozen mB20"><p class="frozenTitle">确认驳回该品牌申请吗？</p><textarea name="remark" id="" cols="30" rows="10" class="textadd" placeholder="请输入驳回原因" required></textarea></div></form>',
                    yes: function (index) {
                        $('#authForbidForm').submit();
                    }
                },
                success: function () {
                    // 控制层级
                    $.testRemind.css.zIndex = $('.xubox_shade').css('zIndex') + 1;
                    $('#authForbidForm').html5Validate(function () {
                        brandCtrl.request({
                            url: jsPath + X.configer[localParm.m].api.brandAuditCheck,
                            data: JSON.stringify({
                                id: id,
                                remark: $("[name=remark]", "#authForbidForm").val(),
                                auditStatus: '3'
                            }),
                            type: 'post'
                        }).then(function (data) {
                            if (data.statusCode == '2000000') {
                                brandCtrl.tirgger('setTips', '审核驳回成功！', function () {
                                    layer.close(layer.index);
                                    gl_hy.router.setHistory("?m=xhr_id_33_69");
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

        // 审核通过
        $('.js-brandAuditPass', ele).off().on('click', function () {
            var id = $(this).attr('data-id');
            $.layer({
                title: '品牌申请审核通过',
                area: ['500px', '200px'],
                dialog: {
                    btns: 2,
                    btn: ['确定', '取消'],
                    type: 8,
                    msg: '<div class="frozen"><p class="frozenTitle">确认审核通过该品牌？</p></div>',
                    yes: function (index) {
                        // 是否提交授权站点
                        if (addAuthSiteList.length) {
                            //提交授权站点
                            brandCtrl.request({
                                data: JSON.stringify(addAuthSiteList),
                                url: jsPath + X.configer[localParm.m].api.addBrandAUth,
                                type: 'post'
                            }).then(function (data) {
                                if (data.statusCode == '2000000') {
                                    // 审核通过
                                    brandCtrl.request({
                                        url: jsPath + X.configer[localParm.m].api.brandAuditCheck,
                                        data: JSON.stringify({
                                            id: id,
                                            auditStatus: '2'
                                        }),
                                        type: 'post'
                                    }).then(function (data) {
                                        if (data.statusCode == '2000000') {
                                            brandCtrl.tirgger('setTips', '审核通过成功！', function () {
                                                layer.close(index);
                                                gl_hy.router.setHistory("?m=xhr_id_33_69");
                                                gl_hy.router.runCallback();
                                            });
                                        } else {
                                            brandCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                                        }
                                    });
                                } else {
                                    brandCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                                }
                            });
                        } else {
                            // 审核通过
                            brandCtrl.request({
                                url: jsPath + X.configer[localParm.m].api.brandAuditCheck,
                                data: JSON.stringify({
                                    id: id,
                                    auditStatus: '2'
                                }),
                                type: 'post'
                            }).then(function (data) {
                                if (data.statusCode == '2000000') {
                                    brandCtrl.tirgger('setTips', '审核通过成功！', function () {
                                        layer.close(index);
                                        gl_hy.router.setHistory("?m=xhr_id_33_69");
                                        gl_hy.router.runCallback();
                                    });
                                } else {
                                    brandCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                                }
                            });
                        }

                    }
                }
            });
        });

        //编辑授权站点
        $(".js-editBrandSite").off().on("click", function () {
            getBrandData.hasSelectData = selectData;
            brandCtrl.renderIn('#allSiteTmpl', ".layercon", getBrandData);
            $.layer({
                title: '授权站点',
                area: ['550px', '360px'],
                dialog: {
                    btns: 2,
                    btn: ['确认', '取消'],
                    type: 8,
                    msg: $(".layercon").html(),
                    yes: function (index) {
                        // 提交
                        $('#siteAuthEditForm').submit();
                        var text = '';
                        $.each(addAuthSiteList, function (i, site) {
                            text += "<a href='javascript:;' data-siteId='" + site.siteId + "'>" + site.siteName + "</a>";
                        });
                        $('.siteShow').html(text);
                        layer.close(index);
                    }
                },
                success: function () {
                    $(".layercon").html("");
                    // 修改index
                    $.testRemind.css.zIndex = $('.xubox_shade').css('zIndex') + 1;
                    $('#siteAuthEditForm').html5Validate(function () {
                        var authSite = [];
                        selectData = {};
                        $('input[name=siteId]:checked', '#siteAuthEditForm').each(function (i, site) {
                            authSite.push({
                                "userId": $('input[name=userId]', '#siteAuthEditForm').val(),
                                "siteId": $(this).val(),
                                "siteName": $(this).attr('data-name'),
                                "qualificationId": $('input[name=qualificationId]', '#siteAuthEditForm').val()
                            });
                            selectData[$(this).val()] = 'checked';
                        });

                        addAuthSiteList = authSite;
                    });
                }
            });

        });
    });

    // 提示消息弹框方法定义
    brandCtrl.on('setTips', function (msg, callback) {
        if (!msg) return;
        $.layer({
            title: '提示消息',
            area: ['500px', '200px'],
            dialog: {
                btn: 1,
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
