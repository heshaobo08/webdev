;
(function (X) {

    var gl_xt = X();

    var ctrl = gl_xt.ctrl();

    var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;

    var dataPath = X.configer.__API_PATH__ + "/";

    var request = gl_xt.utils.getRequest();

    var id = request.id;

    ctrl.view = {
        elem: "#id_conts",
        tpl: path + "/" + X.configer[request.m].tpl
    };

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
                }
            }
        })
    });

    //查询信息
    ctrl.request({
        url: dataPath + X.configer[request.m].api.query + id,
        type: "GET"
    }).then(function (data) {
        if (data.statusCode == "2000000") {
            //前台菜单
            ctrl.request({
                url: dataPath + X.configer[request.m].api.tree,
                type: "post",
                data: JSON.stringify({
                    "parentId": -1
                })
            }).then(function (treeData) {
                if (treeData.statusCode == "2000000") {
                    data.data.userTree = rolesHandle(treeData.data);
                    data.data.selectMenu = {};
                    if (data.data.menuIds) {
                        var selectMenu = data.data.menuIds.split('|');
                        $.each(selectMenu, function (i, menu) {
                            data.data.selectMenu[menu] = 1;
                        });
                    }

                    ctrl.render(data.data).then(function () {
                        ctrl.tirgger('dom_init');
                    });
                }
            });
        }
        ;
    });

    // dom init
    ctrl.on('dom_init', function () {
        $(".js-submit").on("click", function () {
            $("#serviceForm").submit();
        });

        // 菜单效果
        $('.js-showMore').off().on('click', function () {
            var oDt = $(this).closest('dt'),
                oDl = $(this).closest('.topTree'),
                index = oDl.index();
            oDl.siblings('.topTree').find('dd').slideUp();
            oDl.siblings('.topTree').find('.js-showMore').addClass('icon-24').removeClass('icon-57');
            if ($(this).hasClass('icon-24')) {
                oDt.next('dd').slideDown();
                $(this).addClass('icon-57').removeClass('icon-24');
            } else {
                oDt.next('dd').slideUp();
                $(this).addClass('icon-24').removeClass('icon-57');
            }
        });
        //业务子级的全选功能
        $('input:checkbox[name=checkAll]').click(function(){
            $(this).parent().siblings('dl').children('dt').children('label').children('input:checkbox').prop('checked',this.checked);
        });
        //判断选中子项之后，全选是否呈现全选的状态
        $('.menuList input:checkbox[id^="treeId_"]').click(function(){
            var dd= $(this).closest('dd'),
                checkbox=dd.children('dl').children('dt').children('label').children('input:checkbox[id^="treeId_"]'),
                checkedbox = dd.children('dl').children('dt').children('label').children('input:checkbox[id^="treeId_"]:checked'),
                checkAll = $(this).closest('dl').siblings('label').children('input:checkbox');

            this.checked? checkAll.prop('checked',checkedbox.length==checkbox.length):checkAll.prop('checked',false);
        });
        //判断选中子项之后，全选是否呈现全选的状态
        $('.menuList dd').each(function(){
            var checkAll=$(this).children('label').children('input:checkbox');
            if(checkAll.length){
                var checkbox=$(this).children('dl').children('dt').children('label').children('input:checkbox[id^="treeId_"]'),
                    checkedbox = $(this).children('dl').children('dt').children('label').children('input:checkbox[id^="treeId_"]:checked');
                checkAll.prop('checked',checkedbox.length==checkbox.length);
            }
        });

        // 角色唯一性验证
        $('[name=roleName]').off().on('blur', function () {
            var value = $(this).val(),
                that = $(this);
            if (value != $(this).attr('data-oldVal')) {
                ctrl.request({
                    url: dataPath + X.configer[request.m].api.serviceVerify,
                    type: "POST",
                    async: false,
                    data: JSON.stringify({
                        "roleName": value
                    })
                }).then(function (data) {
                    if (data.statusCode == '2000000') {
                        if (!data.data) {
                            that.testRemind("该业务名称已存在，请重新输入");
                            that.focus();
                            return;
                        }
                    } else {
                        ctrl.tirgger('setTips', X.getErrorName(data.statusCode));
                    }
                });
            }
        });

        $("#serviceForm").html5Validate(function () {
            var roleName = $("input[name=roleName]").val();
            var remark = $("input[name=remark]").val();
            var menuIds = [];
            var isValid = $("input[type=radio]:checked").val();
            $('input[id^=treeId]:checked').each(function (i, tree) {
                menuIds.push($(this).val());
            });
            ctrl.request({
                url: dataPath + X.configer[request.m].api.edit,
                type: "post",
                data: JSON.stringify({
                    "id": id,
                    "roleName": roleName,
                    "isValid": isValid,
                    "remark": remark,
                    "menuIds": menuIds.join('|')
                })
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    ctrl.tirgger('setTips', '业务修改成功！', function () {
                        gl_xt.router.setHistory("?m=xhr_id_1_306");
                        gl_xt.router.runCallback();
                    });
                } else {
                    ctrl.tirgger('setTips', '数据操作失败');
                }
            });
        });
    });

    function rolesHandle(data) {
        var source = data;
        var groups = [];
        //解析权限与导航数据生成结构树
        var handle = function (data, parnetId, diffId, arrBox) {

            for (var i = 0; i < data.length; i++) {
                if (data[i][parnetId] == diffId) {

                    var obj = {
                        "id": data[i].id,
                        "menuName": data[i].menuName,
                        "sort": data[i].sort,
                        "level": data[i].level,
                        "code": data[i].code,
                        "menuType": data[i].menuType,
                        "childs": []
                    };

                    arrBox.push(obj);
                    handle(data, parnetId, obj.id, obj.childs);

                    //删除指定数组元素，减轻遍历数组压力
                    //data.splice(i, 1);
                }
            }

        };

        //根据指定值,对象数组排序
        var sort = function (arr, key) {

            for (var i = 0; i < arr.length; i++) {

                if (!arr[i].sort) {
                    continue;
                }

                arr.sort(function (a, b) {
                    return a[key] - b[key];
                });
                sort(arr[i].childs, "sort");
            }
        };

        handle(source, "parentId", -1, groups);
        sort(groups, "sort");
        return groups;
    }

})(mXbn);