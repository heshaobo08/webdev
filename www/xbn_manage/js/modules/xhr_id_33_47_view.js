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
                brandCtrl.request({
                    url: jsPath + X.configer[localParm.m].api.brandAuthSite + brandId,
                    type: 'get'
                }).then(function (siteData) {
                    if (siteData.statusCode == '2000000') {
                        if (siteData.data) {
                            data.data.siteAuthList = siteData.data; //授权站点
                        }
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
                                brandCtrl.tirgger('dom_init');
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

    // dom init
    brandCtrl.on('dom_init', function () {
        // 查看图片
        $('.relatedBox').undelegate().delegate('img', 'click', function () {
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
    })

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
