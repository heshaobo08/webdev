;
(function (X) {

    var gl_xt = X();

    var ctrl = gl_xt.ctrl();

    var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;

    var dataPath = X.configer.__API_PATH__ + "/";

    var request = gl_xt.utils.getRequest();

    var id = request.id,
        typeList = {};

    ctrl.view = {
        elem: "#id_conts",
        tpl: path + "/" + X.configer[request.m].tpl
    };

    // 查询权限类型
    ctrl.request({
        url: dataPath + X.configer[request.m].api.type,
        type: "POST",
        data: JSON.stringify({
            "isValid": true
        })
    }).then(function (data) {
        if (data.statusCode == "2000000") {
            $.each(data.data, function (i, type) {
                typeList[type.id] = type;
            });
            listData();
        } else {
            ctrl.tirgger('setTips', X.getErrorName(data.statusCode));
        }
    });

    // 提示消息弹框方法定义
    ctrl.on('setTips', function (msg, callback) {
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
                    // 回调
                    callback && callback();
                },
                no: function (index) {
                    layer.close(index);
                    if ($('#validateRemind').length) $('#validateRemind').remove();
                }
            }
        });
    });


    function listData() {
        ctrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: "POST",
            data: JSON.stringify({
                "levelId": request.id
            })
        }).then(function (data) {
            detailList(data);
        });
    }

    //等级权限列表
    function detailList(data) {
        if (data.statusCode == "2000000") {
            // 设置权限类型 初始化
            $.each(typeList, function (i, type) {
                typeList[i].isUsed = false;
            });
            // 设置权限类型是否被用
            if (data.data) {
                $.each(data.data, function (i, list) {
                    if (typeList[list.typeId]) {
                        typeList[list.typeId].isUsed = true;
                    }
                });
            }
            ctrl.render().then(function () {
                ctrl.renderIn("#list", ".smallTable tbody", {list: data.data});

                //新增弹出层
                addLayer();

                //编辑弹出层
                editLayer();

                //删除对应id的等级权限
                delList();

            });

        } else {
            ctrl.tirgger('setTips', X.getErrorName(data.statusCode));
        }
    }

    //加载删除等级权限信息
    function delList() {
        $(".js-del").off().on("click", function () {
            var id = $(this).attr("data-id"); //每一条的明细id
            ctrl.tirgger('setTips', '你确定要删除吗？', function () {
                ctrl.request({
                    url: dataPath + X.configer[request.m].api.del + id,
                    type: "DELETE"
                }).then(function (data) {
                    if (data.statusCode == "2000000") {
                        listData();
                    }
                });
            });
        })
    }

    //加载权限信息
    function addLayer() {
        var html = '<form id="serviceForm"><div class="selectRole">',
            isCanEdit = [];
        html += '<dl class="editDl">';
        html += '<dt>类型：</dt><dd>';
        html += '<div class="select w190 fL"><input index-data="" name="typeId" type="hidden" value="请选择"><i>请选择</i><em class="icon-52"></em>';
        html += '<ul><li index-data=""><span>请选择</span></li>';
        $.each(typeList, function (i, type) {
            if (!type.isUsed) {
                html += '<li index-data="' + type.id + '"><span>' + type.typeName + '</span></li>';
                isCanEdit.push(type);
            }
        });
        html += '</ul>';
        html += '</div></dd></dl>';
        html += '<dl class="editDl"><dt>权限值：</dt>';
        html += '<dd><input type="text" name="value" class="input w190" required data-max="5" maxlength="5"></dd></dl>';
        html += '<dl class="changeDl"><dt>描述：</dt><dd><textarea rows="3" cols="30" class="textadd" name="remark"></textarea></dd></dl></div></form>';
        $(".js-add").off().on("click", function () {
            if (!isCanEdit.length) {
                $(".js-add").testRemind('已无可添加权限');
                return;
            }
            $.layer({
                title: '添加权限',
                area: ['550px', '400px'],
                dialog: {
                    btns: 2,
                    btn: ['提交', '取消'],
                    type: 8,
                    msg: html
                },
                success: function (layero, index) {
                    var reg = /^\d+(\.\d{1,2})?$/;

                    sele("", "", function (indexData, value) {
                        if (indexData == "1") {//小笨鸟佣金优惠比例
                            reg = "^\\d+(\\.\\d{1,2})?$";
                            $('input[name=value]').attr("data-max", "5").attr('pattern', reg);
                        } else if (indexData == "2") {//Paypal佣金比例
                            reg = "^\\d+(\\.\\d{1,4})?$";
                            $('input[name=value]').attr("data-max", "7").attr('maxlength',7).attr('pattern', reg);
                        } else if (indexData == "3") {//提现费用
                            reg = "^\\d{1,5}$";
                            $('input[name=value]').attr("data-max", "5").attr('pattern', reg);
                        } else if (indexData == "4") {//最低提现金额
                            reg = "^\\d+(\\.\\d{1,2})?$";
                            $('input[name=value]').attr("data-max", "10").attr({'maxlength': 10, 'pattern': reg});
                        } else if (indexData == "5") {//最大品牌数量
                            reg = '^[1-9][\\d]{0,4}$';
                            $('input[name=value]').attr("data-max", "5").attr('pattern', reg);
                        }
                    });
                    $('[name="value"]').blur(function () {
                        //var reg = /^\d+(\.\d{1,2})?$/;//判断是否是正数，并且两位小数  /^[1-9][\d]*$/;//大于等于0的正整数

                        if (!$.html5Validate.isAllpass($(this))) {
                            $.testRemind.css.zIndex = $('.xubox_shade').css('zIndex') + 1;
                            return false;
                        }
                    });
                    $("#serviceForm").html5Validate(function () {
                        ctrl.request({
                            url: dataPath + X.configer[request.m].api.add,
                            type: "POST",
                            data: JSON.stringify({
                                "levelId": id,
                                "typeId": $("[name=typeId]").attr("index-data"),
                                "value": $("[name=value]").val(),
                                "remark": $("[name=remark]").val()
                            })
                        }).then(function (data) {
                            if (data.statusCode == '2000000') {
                                ctrl.tirgger('setTips', '等级权限添加成功！', function () {
                                    listData();
                                });
                            } else {
                                ctrl.tirgger('setTips', X.getErrorName(data.statusCode));
                            }
                        });
                    });
                },
                yes: function () {
                    $("#serviceForm").submit();
                },
                no: function () {
                    if ($('#validateRemind').length) $('#validateRemind').remove();
                }
            });
        });
    }

    // 修改权限
    function editLayer() {
        $(".js-edit").on("click", function () {
            var id = $(this).attr("data-id"); //每一条的明细id
            var levelId = $(this).attr("data-levelid"); //等级id

            ctrl.request({
                url: dataPath + X.configer[request.m].api.query + id,
                type: "GET"
            }).then(function (data) {
                var dataInfo = data.data;
                var html = '<form id="serviceForm"><div class="selectRole">';
                html += '<dl class="editDl">';
                html += '<dt>类型：</dt><dd><input type="hidden" name="typeId" value="' + dataInfo.typeId + '"/>' + dataInfo.typeName + '</dd></dl>';
                html += '<dl class="editDl"><dt>权限值：</dt>';
                html += '<dd>';
                var iptStr = '<input type="text" name="value" class="input w190" required value="' + dataInfo.value + '" ';
                switch (dataInfo.typeId) {
                    case 1:
                        iptStr += 'data-max="5" maxlength="5" pattern="^\\d+(\\.\\d{1,2})?$"/>';
                        break;
                    case 2:
                        iptStr += 'data-max="7" maxlength="7" pattern="^\\d+(\\.\\d{1,4})?$"/>';
                        break;
                    case 3:
                        iptStr += 'data-max="5" maxlength="5" pattern="^\\d{1,5}$"/>';
                        break;
                    case 4:
                        iptStr += 'data-max="10" maxlength="10" pattern="^\\d+(\\.\\d{1,2})?$"/>';
                        break;
                    case 5:
                        iptStr += 'data-max="5" maxlength="5" pattern="^[1-9][\\d]{0,4}$"/>';
                        break;
                    default:
                        iptStr += 'data-max="5" maxlength="5"/>';
                }
                html += iptStr + '</dd></dl>';
                html += '<dl class="changeDl"><dt>描述：</dt><dd><textarea rows="3" cols="30" class="textadd" name="remark">' + dataInfo.remark + '</textarea></dd></dl></div></form>';

                $.layer({
                    title: '编辑权限',
                    area: ['550px', '400px'],
                    dialog: {
                        btns: 2,
                        btn: ['提交', '取消'],
                        type: 8,
                        msg: html
                    },
                    success: function (layero, index) {
                        sele();

                        $("#serviceForm").html5Validate(function () {
                            ctrl.request({
                                url: dataPath + X.configer[request.m].api.edit,
                                type: "POST",
                                data: JSON.stringify({
                                    "id": id,
                                    "typeId": $("input[name=typeId]").val(),
                                    "levelId": levelId,
                                    "value": $("input[name=value]").val(),
                                    "remark": $("[name=remark]").val()
                                })
                            }).then(function (data) {
                                if (data.statusCode == '2000000') {
                                    ctrl.tirgger('setTips', '等级权限编辑成功！', function () {
                                        listData();
                                    });
                                } else {
                                    ctrl.tirgger('setTips', X.getErrorName(data.statusCode));
                                }
                            });
                        });
                    },
                    yes: function () {
                        $("#serviceForm").submit();
                    },
                    no: function () {
                        if ($('#validateRemind').length) $('#validateRemind').remove();
                    }
                });
            });

        });
    }

})(mXbn);