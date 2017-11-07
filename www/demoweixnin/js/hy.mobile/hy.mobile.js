/// <reference path="zepto.js" />
/// <reference path="hy.mobile.hyapp.js" />

/*
    注意：
    * 本JS引用必须添加 data-hy-role="jslib"属性
    * JS获取网站根目录是基于JS库的目录，以hy.mobile文件夹的上级为根目录
        如：/js/hy.mobile/hy.mobile.js 则/为根目录
    * JS库加载完成会调用 window.onHmLoad()


    getJSON返回错误处理指令（ComData中cmd）
    auto_redirect: 自动跳转到返回的url，必须参数：url
    msg_redirect:弹出消息，确认后跳转到返回的url，必须参数：url
    返回的数据格式示例:
    {
        HasError:true,
        Message:"",
        ComData:{
            cmd:"auto_redirect",
            url:"xxxxxxx"
        }
     }

*/

; window.hm = (function ($) {

    var hm = function () {
        /// <summary>汇元移动端JS库</summary>
    };

    hm.const = {
        logLevelArr: ["debug", "info", "warn", "error"]    //列表中的级别记录控制台日志
    };
    //获取网站根目录 使用hy.mobile的上级所在目录
    var script = $("script[data-hy-role=jslib]");
    if (script && script.length > 0) {
        script = script.prop("src");
        script = script.substr(0, script.toLowerCase().indexOf("/hy.mobile/"));
        hm.rootPath = script.substr(0, script.lastIndexOf("/"));
    } else {
        hm.rootPath = "/";
    }
    //对标记有"data-hy-type"的手机号、纯数字、身份证、电话等输入框的验证
    //@todo

    //汇元轻应用，需要接口支持
    hm.hyapp = {
        callAPP: function (data) {
            /// <summary>APP通讯</summary>
            /// <param name="data" type="JSON">JSON格式的参数{cmd:"",param:{}}</param>

            var clientInfo = hm.getClientInfo();
            if (clientInfo.browser.isHyApp !== true) {
                hm.log("callApp", "该版本不支持此操作", "error", true, false);
                return;
            }

            if (typeof (data) === "string") {
                hm.log("callApp", "APP消息必须为JSON格式", "error");
                return;
            }

            hm.log("callAPP", data, "debug", false, false);

            data = JSON.stringify(data);
            var os = clientInfo.os;
            var resValue = null;  //返回值，建议模型：{hasError:false, data:{},message:""}
            try {
                if (os.isWindowsPhone) {
                    resValue = window.external.notify(data);
                } else if (os.isAndroid || os.isIOS) {
                    resValue = window.hyApp.call(data);
                } else {
                    var msg = "不支持APP请求";
                    hm.showMsg(msg, "错误");
                    hm.log("callAPP", msg, "error", true, false);
                    return;
                }
            } catch (e) {
                hm.log("callAPP 调用APP函数异常", e, "error", true, false);
                hm.showMsg("不支持此操作", "错误");
                resValue = null;
            }
            return resValue;
        }
    };

    hm.clickStat = function (tag) {
        /// <summary>数据分析点击监控</summary>
        /// <param name="tag" type="String">按钮标识</param>
        try {
            //腾讯云分析
            MtaH5.clickStat(tag);
        } catch (e) {
            hm.log("点击监控上报失败", e, "warn");
        }
    };

    hm.showMsg = function (content, title, key, buttons, selectindex, showhtml) {
        /// <summary>消息提示框</summary>
        /// <param name="content" type="String">内容 必填</param>
        /// <param name="title" type="String">标题 可选 默认：'提示'</param>
        /// <param name="key" type="String">消息框的id</param>
        /// <param name="buttons" type="json">消息框按钮</param>
        /// <param name="selectindex" type="int">高亮显示按钮,默认第一个按钮,最大不能超过按钮数量</param>
        /// <param name="showhtml" type="string">是否已html内容显示，是="show"</param>
        if (!title || title == "") {
            title = "提示";
        }
        if (!key || key == "") {
            key = "weuiDialog";
        }
        if (!selectindex || selectindex == "" || isNaN(parseInt(selectindex))) {
            selectindex = 1;
        }
        $(".weui_dialog_confirm").remove();
        $(".weui_dialog_alert").remove();

        var weui_dialog = $("<div></div>"),
            weui_mask = $("<div></div>"),
            weui_dialog_type = $("<div></div>"),
            dialog_title = $("<div></div>"),
            dialog_title_content = $("<strong></strong>"),
            dialog_content = $("<div></div>"),
            dialog_ft = $("<div></div>");

        weui_mask.addClass("weui_mask");
        weui_dialog.attr("id", key);
        weui_dialog_type.addClass("weui_dialog");
        dialog_title.addClass("weui_dialog_hd");
        dialog_title_content.addClass("weui_dialog_title");
        dialog_content.addClass("weui_dialog_bd");
        dialog_ft.addClass("weui_dialog_ft");

        dialog_title_content.text(title);
        if (showhtml == "show") {
            dialog_content.html(content);
        } else {
            dialog_content.text(content);
        }

        if (buttons) {
            weui_dialog.addClass("weui_dialog_confirm");
            //点击按钮后自动关闭
            $.each(buttons, function (i, event) {
                var btn = $("<a></a>");
                btn.text(i);
                btn.on("click", function () {
                    event();
                    $("#" + key + "").hide();
                });
                btn.addClass("weui_btn_dialog default");
                dialog_ft.append(btn);
            })
        } else {
            weui_dialog.addClass("weui_dialog_alert");
            btn_confirm = $("<a></a>");
            btn_confirm.addClass("weui_btn_dialog primary");
            btn_confirm.text("确定");
            btn_confirm.on("click", function () {
                $("#" + key + "").hide();
            });
            dialog_ft.append(btn_confirm);
        }

        $(dialog_ft.children()[selectindex - 1]).removeClass("default");
        $(dialog_ft.children()[selectindex - 1]).addClass("primary");
        dialog_title.append(dialog_title_content);
        weui_dialog_type.append(dialog_title);
        weui_dialog_type.append(dialog_content);
        weui_dialog_type.append(dialog_ft);

        weui_dialog.append(weui_mask);
        weui_dialog.append(weui_dialog_type);
        $("body").append(weui_dialog);
        $("#" + key + "").css("display", "block");
    };

    hm.getPageLastModified = function () {
        /// <summary>取页面最后修改时间</summary>
        var dt = document.lastModified;
        //dt = new Date(dt).toGMTString();
        //dt = new Date(dt);
        //return hm.format.dateTimeToString(dt);
        return dt;
    };

    hm.getClientInfo = function () {
        /// <summary>获取客户端信息</summary>

        var info = {
            userAgent: navigator.userAgent,
            platform: "unknown",
            os: {},
            browser: {},
            hyapp: {},
            thirdApp: {}
        };
        //platform
        var agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "Windows NT", "iPad", "iPod", "Mac OS", "BlackBerry");
        $.each(agents, function (index, agent) {
            if (info.userAgent.indexOf(agent) > 0) {
                info.platform = agent;
                return false;
            }
        });

        var hyAppInfo = navigator.userAgent.match(/ HyApp\([\S+/\S+]+\) /i);
        info.browser.isHyApp = $.isArray(hyAppInfo) && hyAppInfo.length > 0;

        if (info.browser.isHyApp === true) {
            //UA格式：HyApp(名/版本)，如：HyApp(PTrade/1) ，注意前后都有空格
            var appInfo = hyAppInfo[0].substring(7, hyAppInfo[0].length - 2);
            appInfo = appInfo.split("/");
            if ($.isArray(appInfo) && appInfo.length == 2) {
                info.hyapp.name = appInfo[0];
                info.hyapp.ver = appInfo[1];
            }
        }
        //os
        info.os.isWindowsPhone = info.platform == "Windows Phone";
        info.os.isAndroid = info.platform == "Android";
        info.os.isIOS = $.inArray(info.platform, ["iPhone", "iPad", "iPod"]) >= 0;

        //browser
        info.browser.isChrome = /chrome/i.test(info.userAgent);//谷歌浏览器
        info.browser.isMsIE = /msie/i.test(info.userAgent);
        info.browser.isFirefox = /firefox/i.test(info.userAgent);
        info.browser.isSafari = /safari/i.test(info.userAgent);
        info.browser.isQQBrowser = /qqbrowser/i.test(info.userAgent);//qq浏览器
        info.browser.isQHBrowser = /qhbrowser/i.test(info.userAgent);//360浏览器
        info.browser.isBaiDuBrowser = /baidubrowser/i.test(info.userAgent);//百度浏览器
        info.browser.isMqqBrowser = /baidubrowser/i.test(info.userAgent);//华为手机自带浏览器
        info.browser.isMIUIBrowser = /miuibrowser/i.test(info.userAgent);//小米手机自带浏览器
        info.browser.isOppoBrowser = /oppobrowser/i.test(info.userAgent);//oppo手机自带浏览器

        info.thirdApp.isWeixin = /MicroMessenger/i.test(info.userAgent);//微信客户端

        return info;
    };

    hm.getJSON = function (url, param, onSuccess, option) {
        /// <summary>请求服务器JSON数据</summary>
        /// <param name="url" type="String">服务地址，可空，默认当前页</param>
        /// <param name="param" type="JSON">提交的数据</param>
        /// <param name="onSuccess" type="Function">请求成功后的回调函数</param>
        /// <param name="option" type="JSON">请求配置，可空，模型：{type:"POST",async:true,onFinish:function(xhr, options){},onError:function(xhr, options, error){}}</param>

        if (!url || url == "") {
            url = location.pathname;
        }

        param = param || {};
        if (!param.reqType) {
            param.reqType = "ajaxreq";
        }

        option = option || {};
        if (option.async !== false) {
            option.async = true;
        }
        if (!option.onFinish) {
            option.onFinish = function () { };
        }
        if (!option.onError) {
            option.onError = function (xhr, type) {
                var text = type == "abort" ? "请检查网络连接是否正常" : type + " " + xhr.statusText;
                hm.showMsg(text, "请求异常")
            }
        }
        if (option.type != "GET") {
            option.type = "POST";
        }
        if (!option.dataType) {
            option.dataType = "json";
        } else if (option.dataType == "jsonp") {
            option.type = "get";
        }
        if (option.showLoading !== false) {
            setTimeout(function () {
                try {
                    hm.onShowLoading();
                } catch (e) {
                    hm.log("show loading error", e, "warn")
                }
            }, 1);
        }
        hm.log("ajax " + option.type + " 异步 " + option.async + " [" + url + "]:", param);
        $.ajax({
            type: option.type,
            url: url,
            data: param,
            dataType: option.dataType,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            async: option.async,
            jsonp: option.jsonp,
            success: function (data) {
                hm.log("ajax结果：", data);

                if (!data || data.HasError === null || data.HasError === undefined) {
                    hm.showMsg("数据结构异常", "错误");
                    return;
                }


                if (data && data.ComData && data.ComData.cmd) {
                    hm.onEexecErrorCmd(data.ComData);
                    return;
                }
                if (data.NeedLogin === true) {
                    data.fromUrl = window.location.href;
                    hm.onNeedLogin(data);
                    return;
                }

                if (onSuccess) {
                    onSuccess(data);
                }
            },
            error: function (xhr, options, error) {
                hm.log("ajax error options:" + options, error, "error");
                option.onError(xhr, options, error);
            },
            complete: function (xhr, options) {
                hm.log("ajax 请求完成");
                option.onFinish(xhr, options);
            }
        });
    };

    hm.onShowLoading = function () {
        /// <summary>显示加载中</summary>
        hm.log("显示加载中");
    };

    hm.onHideLoading = function () {
        /// <summary>隐藏加载中</summary>
        hm.log("隐藏加载中");
    };
    hm.parseURL = function (url) {
        /// <summary>分析URL</summary>

        if (!url) {
            url = window.location.href;
        }

        var a = document.createElement("a");
        a.href = url;
        return {
            href: url,
            protocol: a.protocol.replace(":", ""),
            hostname: a.hostname,
            port: a.port,
            search: a.search,
            hash: a.hash.replace("#", ""),
            path: a.pathname.replace(/^([^\/])/, "/$1"),
            segments: a.pathname.replace(/^\//, "").split("/"),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ""])[1],
            rawURL: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ""])[1],
            params: (function () {
                var res = {},
                    paramArr = a.search.replace(/^\?/, "").split("&"),
                    param;
                for (var i = 0; i < paramArr.length; i++) {
                    if (!paramArr[i]) {
                        continue;
                    }
                    param = paramArr[i].split("=");
                    res[param[0]] = param[1];
                }
                return res;
            })()
        };
    };

    hm.log = function (text, obj, level, writeClientInfo, callApp) {
        /// <summary>写控制台日志，普通日志</summary>
        /// <param name="text" type="String">日志内容</param>
        /// <param name="obj" type="Object">对象</param>
        /// <param name="level" type="String">日志级别，默认debug，info warn error</param>
        /// <param name="writeClientInfo" type="Boolean">是否附加客户端信息，默认false</param>
        /// <param name="callApp" type="Boolean">是否通知APP，默认True</param>

        if (typeof (level) != "string") {
            level = "debug";
        } else {
            level = level.toLowerCase();
        }
        if ($.inArray(level, ["debug", "info", "warn", "error"]) == -1) {
            text = "不支持的日志级别：" + level;
            level = "error";
        }

        if ($.inArray(level, hm.const.logLevelArr) == -1) {
            return;
        }

        var clientInfo = hm.getClientInfo();

        if (obj == null || obj == undefined) {
            obj = "";
        }
        if (writeClientInfo === true) {
            obj = { objValue: obj, clientInfo: clientInfo };
        }

        var preStr = "hylog";
        try {
            switch (level) {
                case "info":
                    console.info(preStr, text, obj);
                    break;
                case "warn":
                    console.warn(preStr, text, obj);
                    break;
                case "error":
                    console.error(preStr, text, obj);
                    break;
                default:
                    console.debug(preStr, text, obj);
                    break;
            }
            if (callApp !== false && clientInfo.browser.isHyApp) {
                hm.hyapp.showMsg(level, text);
            }
        } catch (e) { }
    };

    hm.cancelBubble = function () {
        /// <summary>阻止冒泡</summary>
        event.cancelBubble = true;
        try {
            event.preventDefault();
        } catch (e) { }
    };

    hm.form = function (selecter, context) {
        if (selecter.indexOf("#", 0) != 0) {
            selecter = "#" + selecter;
        }
        var dom = $(selecter, context);
        if ($(dom).data("hy-role") != "form") {
            hm.log("不支持的form表单", $(dom).get(0), "error");
            return;
        }

        var method = function (dom) {
            this.checkValid = function () {
                /// <summary>检查表单是否有效</summary>
                var valid = true,
                    errMsg = "";
                $.each($("" + selecter + " input").not("[data-hy-novalidate]"), function (index, item) {
                    var tag = $(item).attr("data-hy-type"),
                        inputVal = $(item).val();
                    return hm.verifyInput(tag, inputVal, function (ret, msg) {
                        errMsg = msg;
                        if (ret === "invalid_tag") {
                            valid = item.validity.valid
                            if (valid) {
                                return valid;
                            }

                            hm.log(item.title + ":" + item.validationMessage);
                            errMsg = $(item).data("hy-errmsg");
                            if (!errMsg) {
                                if (item.title) {
                                    errMsg = item.title + "格式不正确";
                                } else {
                                    errMsg = item.validationMessage;
                                }
                            }
                            valid = false;
                        } else {
                            valid = ret;
                        }

                        if (valid) {
                            return valid;
                        }
                        hm.showMsg(errMsg, item.title + "提示", "tip", {
                            "确定": function () {
                                $(item).focus();
                                return valid;
                            }
                        });
                        return valid;
                    });
                });
                return valid;
            };
            this.submit = function (callback, option) {
                /// <summary>提交表单返回JSON</summary>
                /// <param name="callback" type="Function">请求成功后的回调函数</param>
                /// <param name="option" type="JSON">请求配置，参考hm.getJSON</param>

                if (!this.checkValid()) {
                    hm.log("表单检查未通过");
                    return;
                }

                var data = $(dom).serialize();
                var url = $(dom).attr("action");

                data = "reqType=ajaxreq&" + data;

                option = option || {};
                option.type = $(dom).attr("method");
                hm.getJSON(url, data, callback, option)
            }
        };

        return new method(dom);
    };

    hm.verifyInput = function (tag, input, callback) {
        /// <summary>输入信息格式校验，手机号码、email、银行卡号、6位数字验证码、身份证号码</summary>
        /// <param name="tag" type="String">输入信息类别 tag说明 tel:手机号码，email:邮箱地址，bankcard:银行卡号，idcard:身份证号码，code：验证码，isnull:验证非空，cvv：信用卡cvv2码，number:纯数字，可以配合长度验证其他</param>
        /// <param name="input" type="String">输入框的ID或者输入的值</param>
        /// <param name="callback" type="function">回调函数，不传默认为获取输入框焦点,否则执行callback;返回ture或false</param>
        var canPass = true,
            errMsg = "输入信息格式有误",
            tipTitle;
        if (!input) {
            input = "";
        }
        var html_Input,
            inputVal;
        try {
            html_Input = $("#" + input);
        } catch (e) {

        }
        if (html_Input && html_Input.length > 0) {
            inputVal = html_Input.val().replace(/[ ]/g, "");
            tipTitle = html_Input.attr("title");
        } else {
            inputVal = input.replace(/[ ]/g, "")
        }
        switch (tag) {
            case "tel":
                var reg_mobile = /^[1][3-8]\d{9}$/g;
                if (!inputVal || !reg_mobile.test(inputVal)) {
                    errMsg = "手机号码输入格式有误";
                    canPass = false;
                }
                break;
            case "email":
                var reg_email = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                if (!inputVal || !reg_email.test(inputVal)) {
                    errMsg = "邮箱地址输入格式有误";
                    canPass = false;
                }
                break;
            case "bankcard":
                var reg_carNo = /(^\d{15,20}$)/;
                if (!inputVal || !reg_carNo.test(inputVal)) {
                    errMsg = "银行卡号输入格式有误";
                    canPass = false;
                }
                break;
            case "idcard":
                var reg_idCarNo = /(^[\d]{6}(19|20)\d{2}((0[1-9])|(10|11|12))([012][\d]|(30|31))\d{3}[xX\d]$)/;
                if (!inputVal || !reg_idCarNo.test(inputVal)) {
                    errMsg = "身份证号输入格式有误";
                    canPass = false;
                }
                break;
            case "code":
                var reg_code = /(^\d{6}$)/;
                if (!inputVal || !reg_code.test(inputVal)) {
                    errMsg = "验证码输入格式有误，应为6位数字";
                    canPass = false;
                }
                break;
            case "cvv":
                regCVV = /(^\d{3}$)/;
                if (!inputVal || !regCVV.test(inputVal)) {
                    errMsg = "CVV码输入格式有误，应为3位数字";
                    canPass = false;
                }
                break;
            case "number":
                regNumber = /(^\d*$)/;
                if (!inputVal || !regNumber.test(inputVal)) {
                    errMsg = "格式输入有误，应为0-9数字";
                    canPass = false;
                }
                break;
            case "chinese":
                regChinese = /^[\u4e00-\u9fa5]{0,}$/;
                if (!inputVal || !regChinese.test(inputVal)) {
                    errMsg = "输入有误，请输入汉字";
                    canPass = false;
                }
                break;
            default:
                errMsg = "";
                canPass = "invalid_tag";
                break;
        }

        if (callback) {
            return callback(canPass,errMsg);
        } else {
            if (!canPass) {
                if (tipTitle) {
                    errMsg = tipTitle + "输入格式有误";
                }
                hm.showMsg(errMsg, "", "error", {
                    "确定": function () {
                        if (html_Input && html_Input.length > 0) {
                            html_Input.focus();
                        }
                        return canPass;
                    }
                });
            }
            return canPass;
        }
    };

    hm.format = function () {
        /// <summary>格式化库</summary>
        var method = function () {
            this.padLeft = function (value, length, char) {
                /// <summary>返回指定最小长度的字符串，长度不够从左测添加指定字符，大于长度原样返回</summary>
                /// <param name="value" type="String">字符串</param>
                /// <param name="length" type="Number">长度</param>
                /// <param name="char" type="String">填充字符，默认0</param>

                if (!char || char.length != 1) {
                    char = "0";
                }
                value = value.toString();
                return Array(length > value.length ? (length - value.length + 1) : "").join(char) + value;
            };

            this.dateTimeToString = function (time, format) {
                /// <summary>格式化日期时间</summary>
                /// <param name="time" type="Date">时间对象</param>
                /// <param name="format" type="String">返回格式，yy或yyyy年 MM月 dd日 HH24小时的时 mm分 ss秒，默认yyyy-MM-dd HH:mm:ss</param>
                /// <returns type="String" />

                time = new Date(time);
                if (!time) {
                    hm.showMsg("参数无效的时间类型", "错误");
                    return;
                }

                if (!format) {
                    format = "yyyy-MM-dd HH:mm:ss";
                }

                var dt = {
                    y: time.getFullYear(),
                    m: time.getMonth() + 1,
                    d: time.getDate(),
                    h: time.getHours(),
                    mm: time.getMinutes(),
                    s: time.getSeconds(),
                    ms: time.getMilliseconds()
                };

                var result = format;
                result = result.replace("yyyy", this.padLeft(dt.y, 4));
                result = result.replace("MM", this.padLeft(dt.m, 2));
                result = result.replace("dd", this.padLeft(dt.d, 2));
                result = result.replace("HH", this.padLeft(dt.h, 2));
                result = result.replace("mm", this.padLeft(dt.mm, 2));
                result = result.replace("ss", this.padLeft(dt.s, 2));
                result = result.replace("fff", this.padLeft(dt.ms, 3));

                result = result.replace("yy", dt.y.toString().substr(2, 2));

                return result;
            };

            this.jsonTimeToJs = function (jsonTimeStr, format) {
                /// <summary>转换JSON时间格式为JS格式</summary>
                /// <param name="jsonTimeStr" type="String">JSON格式的时间字符串</param>
                /// <param name="format" type="String">返回格式，同dateTimeToString，默认返回时间对象</param>
                /// <returns type="String" />

                try {
                    var start = jsonTimeStr.substr(0, 6);
                    if (start.toLowerCase() == "/date(") {
                        var timeValue = parseInt(jsonTimeStr.replace(start, "").replace(")/", ""));
                        jsonTimeStr = new Date(timeValue);
                    } else {
                        var timeStr = jsonTimeStr.match(/\d{4}(-\d{2}){2}T(\d{2}:){2}\d{2}/);
                        jsonTimeStr = new Date(timeStr[0].replace("T", " "));
                    }
                } catch (e) { }

                if (jsonTimeStr == "Invalid Date") {
                    return "";
                }

                jsonTimeStr = this.dateTimeToString(jsonTimeStr, format);

                return jsonTimeStr;
            }
        }
        return new method();
    };

    //多页面管理 需要hyui.mobile.less
    hm.pageMgr = {
        $container: {},
        _pageStack: [],
        _configs: [],
        _defaultPage: null,
        _pageIndex: 1,
        setDefault: function (defaultPage) {
            this._defaultPage = this._find('name', defaultPage);
            return this;
        },
        init: function (pageCfgArr) {
            /// <summary>初始化</summary>
            /// <param name="pageCfgArr" type="Array">页面配置数组</param>
            if (!Array.isArray(pageCfgArr) || pageCfgArr.length == 0) {
                hm.showMsg("页面配置无效", "错误");
                return;
            }
            this._configs = pageCfgArr;
            this.setDefault(this._configs[0].name);

            this.$container = $("[data-hy-role=tplbody]");

            var self = this;

            $(window).on('hashchange', function () {
                var state = history.state || {};
                var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
                var page = self._find('url', url) || self._defaultPage;
                //if (state._pageIndex <= self._pageIndex || self._findInStack(url)) {
                //    self._back(page);
                //} else {
                //    self._go(page);
                //}
                self._go(page);
            });

            if (history.state && history.state._pageIndex) {
                this._pageIndex = history.state._pageIndex;
            }

            this._pageIndex--;

            var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
            var page = self._find('url', url) || self._defaultPage;
            this._go(page);
            return this;
        },
        go: function (to) {
            var config = this._find('name', to);
            if (!config) {
                return;
            }
            location.hash = config.url;
        },
        _go: function (config) {
            this._pageIndex++;

            history.replaceState && history.replaceState({ _pageIndex: this._pageIndex }, '', location.href);

            var html = $(config.template).html();
            var $html = $(html).addClass('slideIn').addClass(config.name);
            this.$container.append($html);
            this._pageStack.push({
                config: config,
                dom: $html
            });

            if (!config.isBind) {
                this._bind(config);
            }

            return this;
        },
        back: function () {
            history.back();
        },
        _back: function (config) {
            this._pageIndex--;

            var stack = this._pageStack.pop();
            if (!stack) {
                return;
            }

            var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
            var found = this._findInStack(url);
            if (!found) {
                var html = $(config.template).html();
                var $html = $(html).css('opacity', 1).addClass(config.name);
                $html.insertBefore(stack.dom);

                if (!config.isBind) {
                    this._bind(config);
                }

                this._pageStack.push({
                    config: config,
                    dom: $html
                });
            }

            stack.dom.addClass('slideOut').on('animationend', function () {
                stack.dom.remove();
            }).on('webkitAnimationEnd', function () {
                stack.dom.remove();
            });

            return this;
        },
        _findInStack: function (url) {
            var found = null;
            for (var i = 0, len = this._pageStack.length; i < len; i++) {
                var stack = this._pageStack[i];
                if (stack.config.url === url) {
                    found = stack;
                    break;
                }
            }
            return found;
        },
        _find: function (key, value) {
            var page = null;
            for (var i = 0, len = this._configs.length; i < len; i++) {
                if (this._configs[i][key] === value) {
                    page = this._configs[i];
                    break;
                }
            }
            return page;
        },
        _bind: function (page) {
            var events = page.events || {};
            for (var t in events) {
                for (var type in events[t]) {
                    this.$container.on(type, t, events[t][type]);
                }
            }
            page.isBind = true;
        }
    };

    hm.lazyLoading = {
        init: function () {
            /// <summary>启用懒加载 【要在pageload中调用懒加载】</summary>
            var img_arr = $("img");
            $.each(img_arr, function (index, item) {
                if (item.getAttribute('data-hy-src')) {
                    $(item).addClass("weuiLoading");
                    $(item).attr("src", "data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iciIgd2lkdGg9JzEyMHB4JyBoZWlnaHQ9JzEyMHB4JyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJub25lIiBjbGFzcz0iYmsiPjwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjRTlFOUU5JwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoMCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICA8L3JlY3Q+CiAgICA8cmVjdCB4PSc0Ni41JyB5PSc0MCcgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHJ4PSc1JyByeT0nNScgZmlsbD0nIzk4OTY5NycKICAgICAgICAgIHRyYW5zZm9ybT0ncm90YXRlKDMwIDUwIDUwKSB0cmFuc2xhdGUoMCAtMzApJz4KICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyM5Qjk5OUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz4KICAgIDwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjQTNBMUEyJwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoOTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNBQkE5QUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxMjAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCMkIyQjInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxNTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCQUI4QjknCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxODAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDMkMwQzEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyMTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDQkNCQ0InCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEMkQyRDInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEQURBREEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNFMkUyRTInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0Pgo8L3N2Zz4=");
                }
            });

            window.onscroll = function () {
                /// <summary>屏幕滚动到可视区域加载图片</summary>
                var img_arr = $("img");
                $.each(img_arr, function (index, item) {
                    //检查元素是否在可视区域
                    var t = document.documentElement.clientHeight + (document.documentElement.scrollTop || document.body.scrollTop);
                    var h = hm.lazyLoading.getOffsetHeight(item);
                    if (h < t && item.getAttribute('data-hy-src')) {
                        setTimeout("hm.lazyLoading.setImg(" + index + ")", 500);
                    }
                });
            };

            //首次监控屏幕滚动
            window.onscroll();
        },
        getOffsetHeight: function (obj) {
            /// <summary>获得对象距离页面顶端的距离 </summary>
            var h = 0;
            while (obj) {
                h += obj.offsetTop;
                obj = obj.offsetParent;
            }
            return h;
        },
        setImg: function (index) {
            var img_arr = $("img");
            var img = img_arr[index];
            $(img).removeClass("weuiLoading");
            if (img.getAttribute('data-hy-src')) {
                img.src = img.getAttribute('data-hy-src');
            }
        }
    };

    hm.initManifest = function () {
        /// <summary>离线缓存初始化</summary>

        if (!applicationCache) {
            hm.log("不支持离线");
            return;
        }

        applicationCache.addEventListener("updateready", function () {
            //缓存更新后下载完成
            //hm.showMsg("页面已过期，是否重新加载？", "页面更新提醒", { "重新加载": function () { location.reload(); }, "取消": function () { } });
            location.reload();
            hm.log("缓存更新");
        }, false);

    };

    hm.initDebugEvent = function () {
        /// <summary>初始化调试事件</summary>

        hm.lib_bodyClickCount = 0;

        $("body").on("click", function () {
            if ($.inArray(event.toElement.nodeName.toLowerCase(), ["input", "select", "button", "label", "a", "span"]) !== -1) {
                return;
            }

            //第一次点击启动timer
            if (hm.lib_bodyClickCount++ == 0) {
                setTimeout(function () {
                    hm.lib_bodyClickCount = 0;
                }, 2800);
            }

            if (hm.lib_bodyClickCount >= 10) {
                hm.onAppDebug();
                hm.lib_bodyClickCount = 0;
            }

            hm.log("事件", hm.lib_bodyClickCount);
        });
    };

    hm.onNeedLogin = function (data) {
        /// <summary>当需要登录时触发，页面可重写该函数</summary>
        /// <param name="data" type="object">事件传递来的参数</param>
    };

    hm.onEexecErrorCmd = function (data) {
        /// <summary>当服务返回错误指令时触发，页面可重写该函数</summary>
        /// <param name="data" type="object">事件传递来的参数,必须有cmd参数，cmd参数说明见该文件顶部</param>
        if (data.cmd == "auto_redirect") {
            window.location = data.url;
            return false;
        } else {
            h.log("h.onEexecErrorCmd 出错", data, "warn");
        }
    };
    hm.onAppDebug = function () {

        if (hm.getClientInfo().browser.isHyApp) {
            //启用APP日志
            hm.hyapp.showDebugMsg();
        }

        var panel = $("<div data-hy-role=\"debugpanel\"></div>");

        //APP信息
        var clientInfo = this.getClientInfo();

        var btnClose = $("<a>[关闭调试消息]</a>");
        $(btnClose).on("click", function () {
            if (hm.getClientInfo().browser.isHyApp) {
                //关闭APP日志
                hm.hyapp.closeDebugMsg();
            }
            $("div[data-hy-role='debugpanel']").remove();
        });
        $(panel).append(btnClose);

        var btnToTestPage = $("<a>[打开测试页]</a>");
        $(btnToTestPage).on("click", function () {
            window.location.href = hm.rootPath + "/Test/AppTest.html";
        });
        $(panel).append(btnToTestPage);

        var textArr = [];
        textArr.push("页面生成时间：" + this.getPageLastModified());
        textArr.push("URL:" + location.href);
        textArr.push(JSON.stringify(clientInfo));
        for (var i = 0; i < textArr.length; i++) {
            var info = $("<div></div>");
            $(info).html("<hr />" + textArr[i]);
            $(panel).append(info);
        }

        $("div[data-hy-role='debugpanel']").remove();
        $("body").append(panel);
    };
    hm.colorLog = function (f) {
        /// <summary>带样式日志</summary>
        return f.toString().replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '');
    };

    //初始化
    hm.initManifest();
    hm.initDebugEvent();
    var log_content = hm.colorLog(function () {/*             
  _ _  _ _ _            
 |_ _/   _ _|           ************ 欢迎光临 - 汇元科技*********
  __    /                   加入汇元科技，让我们共同铸就梦想！
 |__|  |  ◇                简历发送至 zhengyy@9186.com
  _ _   \_ _                官网主页：http://www.hynet.co/
 |_ _\ _ _ _|           *****************************************

    */});
    console.info("%c汇元科技-前端开发部%c%s%c%s", "background:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:2em;", "color:#0505b0;", log_content, "background:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #22f), color-stop(1, #f2f) );color:transparent;-webkit-background-clip: text;font-size:2em;", "\n汇元科技【股票代码832028】");

    return hm;
})(Zepto);

try {
    window.onHmLoad();
} catch (e) { }

