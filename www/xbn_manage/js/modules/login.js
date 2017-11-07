;
(function (win) {

    var __LOCATION_FILE__ = document.location.protocol + "//tadmin.xbniao.com/api";

    var loopTime = 3,
        _private = {

            //登陆过期
            "require_3000403": function () {

            },

            //登陆失败
            "require_2508000": function () {

                var sBtns = this.form.find(".signin");

                sBtns.html("登陆失败~请检查用户名和密码 [<span id='countdown'>3</span>]");
                this.countdown("#countdown", function () {
                    sBtns.html(sBtns.data("name"));
                });
            },

            //登陆成功
            "require_2000000": function (d, code, sesson) {
                win.localStorage.Roles = JSON.stringify(this.rolesHandle(d.data.roles));
                win.localStorage.User = JSON.stringify(d.data.user);
                $.cookie("ID", d.data.user.id);
                $.cookie("SID", sesson);
                win.location.href = "index.html";
            },

            "countdown": function (id, fn) {

                var _this = this;
                if (loopTime > 0) {
                    setTimeout(function () {
                        _this.countdown(id, fn);
                    }, 1000);
                }

                $(id).html(loopTime);

                if (loopTime-- <= 0) {
                    fn();
                    loopTime = 3;
                }
            },

            "setStyle": function (options) {
                $.testRemind.css = $.extend({
                    "color": "#FFF",
                    "borderColor": "#f60",
                    "backgroundColor": "#f60",
                    "border-radius": "5px"
                }, options);
            },

            "sub": function () {
                if (loopTime >= 3) {
                    this.form.submit();
                }
            },

            "send": function (options) {

                return $.ajax($.extend({
                    type: "POST",
                    dataType: "json"
                }, options));
            },

            "parms": function (pStr) {
                return (function (param) {
                    var obj = {};
                    var keyvalue = [];
                    var key = "",
                        value = "";
                    var paraString = param.split("&");
                    for (var i in paraString) {
                        keyvalue = paraString[i].split("=");
                        key = keyvalue[0];
                        value = keyvalue[1];
                        obj[key] = value;
                    }
                    return obj;
                })(pStr);
            },

            "showPass": function (that) {
                var that = $(that),
                    parent = that.closest(".psword");

                var inputPass = parent.find("#password");

                if ($.trim(inputPass.val())) {
                    if (that.data("eyes") != "text") {
                        inputPass[0].type = "text";
                        parent.addClass("visible_box");
                        that.data("eyes", "text");
                    } else {
                        inputPass[0].type = "password";
                        parent.removeClass("visible_box");
                        that.data("eyes", "password");
                    }
                }
            },

            "success": function () {
                var _this = this;
                this.send({
                    url: __LOCATION_FILE__ + "/user/login",
                    data: JSON.stringify({
                        loginPwd: $('[name=loginPwd]').val(),
                        loginUser: $('[name=loginUser]').val()
                    })
                }).then(function (data) {
                    _this.send({
                        url: __LOCATION_FILE__ + "/service/sessid",
                        type: "GET"
                    }).then(function (D) {
                        _this["require_" + data.statusCode](data, _this.parms($(_this.form).serialize()), D.data);
                    });
                });
            },

            "rolesHandle": function (data) {

                var source = $.extend([], data, true);

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
        };

    //初始化函数
    _private.form = $("#loginIn");

    //初始化校验
    _private.form.html5Validate(function () {
        _private.success();
    });

    //设置提示语样式
    _private.setStyle();
    //提交按钮
    _private.form.find(".signin").on("click", function () {
        _private.sub();
    });

    //密码显示与隐藏按钮
    _private.form.find("#eyes").on("click", function () {
        _private.showPass(this);
    });

    //设置ajax通用请求编码，如果不设置会出现415错误
    $.ajaxSetup({
        cache: false,
        contentType: "application/json;charset=utf-8"
    });
})(window);
