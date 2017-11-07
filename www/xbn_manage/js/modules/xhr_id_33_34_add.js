;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ + '/' + X.configer.__FILE_HTML__ + '/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath = X.configer.__API_PATH__;

    var memberCtrl = gl_hy.ctrl();

    var localParm = gl_hy.utils.getRequest();

    // 创建视图
    memberCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    // 模板渲染
    memberCtrl.render().then(function () {
        memberCtrl.tirgger('dom-event-init', "#id_conts");
    });

    // 初始化页面所有dom事件
    memberCtrl.on('dom-event-init', function (elem) {
        /*var reg = /^[0-9A-Za-z\.!@#$%&\'\*+\\\/\=?\^_`\<\({\|}\)\>~\-\:\[\]\;\"]{6,20}$/;
         $('input[name=password]').focus(function () {
         $(this).attr('pattern', reg);
         });*/
        // 验证唯一性
        $('.js-verify').off().on('blur', function () {
            var name = $(this).attr('name'),
                value = $(this).val(),
                that = this;

            if ($(this).val() && $.html5Validate.isAllpass($(this))) {
                memberCtrl.request({
                    data: '{"' + name + '":' + value + '}',
                    url: jsPath + X.configer[localParm.m].api.userVerify,
                    type: 'post',
                    async: false
                }).then(function (data) {
                    if (data.statusCode == '2000000') {
                        if (!data.data) {
                            $(that).testRemind("该信息已被注册，请重新输入").focus();
                            return;
                        }
                    } else {
                        memberCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                    }
                });
            }
        });

        // 添加用户
        $('.js-addUserSubmit').off().on('click', function () {
            $("#userAddForm").submit();
        });

        // 密码验证
        $('input[name=password]', "#userAddForm").off().on('keyup', function () {
            if ($.html5Validate.isAllpass($(this))) {
                if ($(this).val() == $('input[name=mobile]', "#userAddForm").val() || $(this).val() == $('input[name=email]', "#userAddForm").val()) {
                    $('input[name=password]', "#userAddForm").testRemind("密码不能与手机号或者邮箱相同");
                    $(this).focus();
                }
                var repwdVal = $('input[name=repwd]', "#userAddForm").val();
                if (repwdVal.length && $(this).val() !== repwdVal) {
                    $('input[name=repwd]', "#userAddForm").testRemind("确认密码与登录密码不同，请重新输入");
                    $(this).focus();
                }
            }
        });

        // 确认密码
        $('input[name=repwd]', "#userAddForm").off().on('change input', function () {
            if ($.html5Validate.isAllpass($(this))) {
                if ($(this).val() !== $('input[name=password]', "#userAddForm").val()) {
                    $('input[name=repwd]', "#userAddForm").testRemind("确认密码与登录密码不同，请重新输入");
                    $(this).focus();
                }
            }
        });


        memberCtrl.tirgger('addUserFormRender');
    });

    // 表单验证
    memberCtrl.on('addUserFormRender', function () {

        $("#userAddForm").html5Validate(function () {
            var mobile = $('input[name=mobile]', "#userAddForm").val(),
                email = $('input[name=email]', "#userAddForm").val(),
                password = hex_md5($('input[name=password]', "#userAddForm").val()),
                gender = $('input[name=gender]:checked', "#userAddForm").val(),
                name = $('input[name=name]', "#userAddForm").val(),
                phoneAreaCode = $('input[name=phoneAreaCode]', "#userAddForm").val(),
                phoneNo = $('input[name=phoneNo]', "#userAddForm").val(),
                phoneExtension = $('input[name=phoneExtension]', "#userAddForm").val(),
                realName = $('input[name=realName]', "#userAddForm").val(),
                sendData = {
                    mobile: mobile ? mobile : null,
                    email: email ? email : null,
                    password: password ? password : null,
                    gender: gender ? gender : null,
                    name: name ? name : null,
                    phoneAreaCode: phoneAreaCode ? phoneAreaCode : null,
                    phoneNo: phoneNo ? phoneNo : null,
                    phoneExtension: phoneExtension ? phoneExtension : null,
                    realName: realName ? realName : null
                };
            memberCtrl.request({
                data: JSON.stringify(sendData),
                url: jsPath + X.configer[localParm.m].api.userSave,
                type: 'post'
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    memberCtrl.tirgger('setTips', '会员添加成功！', function () {
                        gl_hy.router.setHistory("?m=xhr_id_33_34");
                        gl_hy.router.runCallback();
                    });
                } else {
                    memberCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                }
            });
        }, {
            validate: function () {
                var isReturn = true;
                if(!$('input[name=mobile]', "#userAddForm").val() || !$.html5Validate.isAllpass($('input[name=mobile]', "#userAddForm"))){
                    $('input[name=mobile]', "#userAddForm").testRemind("请输入手机号");
                    return false;
                }
                if(!$('input[name=email]', "#userAddForm").val() || !$.html5Validate.isAllpass($('input[name=email]', "#userAddForm"))){
                    $('input[name=email]', "#userAddForm").testRemind("请输入邮箱号");
                    return false;
                }
                if(!$('input[name=name]', "#userAddForm").val() || !$.html5Validate.isAllpass($('input[name=name]', "#userAddForm"))){
                    $('input[name=name]', "#userAddForm").testRemind("请输入用户名");
                    return false;
                }
                if ($('input[name=password]', "#userAddForm").val() == $('input[name=mobile]', "#userAddForm").val() || $('input[name=password]', "#userAddForm").val() == $('input[name=email]', "#userAddForm").val()) {
                    $('input[name=password]', "#userAddForm").testRemind("密码不能与手机号或者邮箱相同");
                    return false;
                }
                if ($('input[name=password]', "#userAddForm").val() !== $('input[name=repwd]', "#userAddForm").val()) {
                    $('input[name=repwd]', "#userAddForm").testRemind("确认密码与登录密码不同，请重新输入");
                    return false;
                }

                var sendData = {};
                $('.js-verify').each(function (i, dom) {
                    name = $(this).attr('name'),
                        value = $(this).val();
                    sendData[name] = value;
                });
                memberCtrl.request({
                    data: JSON.stringify(sendData),
                    url: jsPath + X.configer[localParm.m].api.userVerify,
                    type: 'post',
                    async: false
                }).then(function (data) {
                    if (data.statusCode == '2000000') {
                        if (!data.data) {
                            memberCtrl.tirgger('setTips', '用户已存在，请重新输入');
                            isReturn = false;
                        } else {
                            isReturn = true;
                        }
                    } else {
                        memberCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                        isReturn = false;
                    }
                });
                return isReturn;
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
