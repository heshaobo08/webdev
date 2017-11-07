/**
 * 全选组件
 */

var mxbnItem = mXbn();
var checkeBox = (function () {
    var _privte = {
        selectAll: function (box) {
            box.prop('checked', true);
        },
        selectNotAll: function (box) {
            box.prop('checked', false);
        }
    };

    return function (attr, callback) {
        var cAttr = attr || 'r-box';
        var box = $('*[' + cAttr + ']');
        var parent = null,
            _callback = callback || function () {};

        box.each(function () {
            var self = $(this);
            var name = self.attr(cAttr);
            parent = self.closest('[' + cAttr + ']');
            var firstBox = parent.find('input[type=checkbox][ name=' + name + ']'),
                disabledBox = parent.find('input[type=checkbox][disabled=disabled]'),
                allCheckBox = parent.find('input[type=checkbox]').not(firstBox).not(disabledBox);

            var len = allCheckBox.length;

            //全选
            firstBox.click(function () {
                var _that = $(this);
                parent = _that.closest('[' + cAttr + ']');
                if (_that.is(':checked')) {
                    _privte.selectAll(allCheckBox);
                    _callback.call(parent, allCheckBox, 1);
                } else {
                    _privte.selectNotAll(allCheckBox);
                    _callback.call(parent, allCheckBox, 0);
                }
            });

            allCheckBox.click(function () {
                var self = $(this);
                parent = self.closest('[' + cAttr + ']');
                var disabledBox = parent.find('input[type=checkbox][disable=disable]');
                var checkedBox = parent.find('input[type=checkbox]:checked').not(firstBox).not(disabledBox);
                if (len == (checkedBox.length)) {
                    firstBox.prop('checked', true);
                } else {
                    firstBox.prop('checked', false);
                }

                if (self.is(':checked')) {
                    _callback.call(parent, checkedBox, 1);
                } else {
                    _callback.call(parent, self, 0);
                }

            });
        });
    }
}());



//js截取文字

var sliceNewsTitle = function (obj, number) {
    var count = [];
    var originalTitle = [];
    var smallTitle = [];
    for (var i = 0; obj[i]; i++) {
        count[i] = 0.0;
        originalTitle[i] = $.trim($(obj[i]).html());
        for (var num = 0; num < originalTitle[i].length; num++) {
            count[i] += originalTitle[i].charCodeAt(num) <= 108 ? 0.5 : 1;
        }
        count[i] = Math.round(count[i]);
        if (count[i] < number) {
            $(obj[i]).html(originalTitle[i]);
        } else {
            smallTitle[i] = originalTitle[i].substr(0, number - 1) + "...";
            $(obj[i]).html(smallTitle[i]);
        }
    }
};

//计数tips
function countTips() {
    var num = "";
    $(".js-count").off().on("focusin keyup", function () {
        var self = $(this),
            str = self.val(),
            len = str.replace(/[^\x00-\xff]/g, "**").length,
            maxLen = self.attr("maxlength"),
            html = '<span class="count">' + maxLen + '</span>';

        if (self.siblings(".count").length > 0) {
            self.siblings(".count").removeClass("none");
        } else {
            self.after(html);
        }

        num = maxLen - len;

        if (maxLen >= len) {
            self.nextAll(".count").html(num);
        } else {
            self.val(str.substr(0, self.val().length + num / 2));
        }

    }).on("focusout", function () {
        var self = $(this);
        if (self.siblings(".count").length > 0) {
            self.siblings(".count").addClass("none");
        }
    });
}

//下拉组件
function sele(ele, parentEle, callback) {
    parentEle = parentEle ? parentEle : 'body';
    var select = ele ? $(ele, parentEle) : $(".select", parentEle);

    function close() {
        select.each(function () {
            var self = $(this);
            if (self.hasClass("active")) {
                self.css({
                    "z-index": 5
                });
                self.removeClass("active").find("ul").slideUp(function () {
                    self.css({
                        "z-index": 0
                    });
                });
                self.find("em").attr({
                    "class": "icon-52"
                });
            }
        });
    };
    select.each(function () {
        var sThat = $(this);
        var sI = sThat.find("i");
        var sLi = sThat.find("li");
        var sInput = sThat.find("input");
        var onOff = false;
        var sInputData = sInput.attr("index-data");
        sLi.each(function () {
            if (sInputData != "") {
                var liData = $(this).attr("index-data");
                if (liData == sInputData) {
                    sLi.removeClass("active");
                    $(this).addClass("active");
                }
            }

            if ($(this).hasClass("active")) {
                onOff = true;
            }
        });
        if (onOff) {
            var sIndexData = sThat.find("li.active").attr("index-data"),
                sValue = sThat.find("li.active").find("span").text();
            sI.addClass("active").attr("index-data", sIndexData).html(sValue);
            sInput.attr("index-data", sIndexData).val(sValue);
        } else {
            sI.attr("index-data", "").html("请选择");
            sInput.attr("index-data", "").val("");
        }
    });
    select.undelegate("i,em", "click").delegate("i,em", 'click', function () {
        // select.find("i,em").delegate().on("click", function () {
        var that = $(this);
        var parent = that.parent();
        var ul = parent.find("ul");
        var em = parent.find("em");
        if (!parent.hasClass("disabled")) {
            if (parent.hasClass("active")) {
                em.attr({
                    "class": "icon-52"
                });
                ul.slideUp(function () {
                    parent.removeClass("active");
                    select.css({
                        "z-index": 0
                    });
                });
            } else {
                close();
                em.attr({
                    "class": "icon-53"
                });
                parent.addClass("active");
                ul.slideDown();
            }
            parent.css({
                "z-index": 10
            });
        } else {
            close();
        }

    });
    select.undelegate('li', "click").delegate('li', "click", function () {
        var _that = $(this);
        var _parent = _that.closest(".select");
        var _ul = _parent.find("ul");
        var _i = _parent.find("i");
        var _input = _parent.find("input");
        var _em = _parent.find("em");
        var indexData = _that.attr("index-data"),
            value = _that.find("span").text();
        if (indexData == "") {
            _i.removeClass("active");
            _input.attr({
                "index-data": ""
            }).val("");
        } else {
            _i.addClass("active");
            _input.attr({
                "index-data": indexData
            }).val(value);
            _input.blur();
        }
        _i.attr({
            "index-data": indexData
        }).html(value);
        _em.attr({
            "class": "icon-52"
        });
        _ul.slideUp(function () {
            _parent.removeClass("active");
            select.css({
                "z-index": 0
            });
            // 选中成功回调函数
            callback && callback.call(_that.closest('.select'), indexData, value);
        });

    });
    blankClick(".select", function () {
        close();
    });

};


//点击空白操作
function blankClick(elem, fn) {
    $(document).mouseup(function (e) {
        var _con = $(elem); // 设置目标区域
        if (!_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1
            fn && fn();
        }
    });
}

var Pager = (function () {

    var $_pager;
    var Pager = function (options) {

        if (!(this instanceof Pager)) {
            return new Pager(options)
        }

        var self = this;
        this.options = $.extend({
            "topElem": "#topPager",
            "elem": "#pager",
            "showEntries": 5, //分页可见页码
            "defaultItem": 1, //默认选中页码
            "totalPages": 20 //总条数
        }, options, true);

        this.count = 0;
        this._html = {};
        this.selectNumber = 1;
        this.callback = function () {};

        $_pager = $(this.options.elem);
        if ($_pager.length) {
            $_pager[0]["show"] = "on";
        }

        var _private = {

            getsScope: function (number, arr) {
                var _arr = arr.sort(function (a, b) {
                    return a - b;
                });
                var _val = 0;
                for (var i = 0; i < _arr.length; i++) {
                    if (_arr[i] >= number) {
                        _val = _arr[i - 1];
                        break;
                    }
                }
                return _val;
            },

            createGroup: function () {
                var groupArr = [];
                for (var i = 0; i <= self.group; i++) {
                    groupArr.push(i * self.options.showEntries);
                }
                return groupArr;
            }
        };

        //当前页码 number
        this.init = function (number) {
            this.group = Math.ceil(this.options.totalPages / this.options.showEntries);
            this._html = this.create(_private.getsScope(number, _private.createGroup()));
            this.display();

            //默认选中当前页码
            $_pager.find("#page_" + number).click();
        };

        //初始化分页组件
        (function () {

            //单一按钮分页事件绑定
            $(self.options.elem).off().on("click", "[data-num]", function () {

                var _this = $(this),
                    searchUri = location.search;

                //删除所有添加的class On 属性值
                _this.parent().find("li").removeClass("on");

                //添加选中效果Class on 属性值
                _this.addClass("on");

                self.selectNumber = _this.data("num");
                self.callback(self.selectNumber);
                history.pushState({}, "", searchUri.replace(/&page=[0-9]+/g, "") + "&page=" + self.selectNumber);

            });

            //功能按钮事件绑定
            $(self.options.topElem).off().on("click", "[data-displace]", function () {

                var _this = $(this);
                switch (_this.data("displace")) {
                    case "prev":
                        if (self.count > 0) {
                            self.prev();
                            self.display();
                            addSelectStryle(self.selectNumber);
                        }
                        break;

                    case "next":
                        if (self.count < self.group - 1) {
                            self.next();
                            self.display();
                            addSelectStryle(self.selectNumber);
                        }
                        break;

                    case "first":
                        if (self.selectNumber > 1)
                            self.first();

                        break;

                    case "last":
                        if (self.options.totalPages != self.selectNumber)
                            self.last();
                        break;
                }


            });

            function addSelectStryle(numberId) {
                $(self.options.topElem).find("#page_" + numberId).addClass("on");
            };

            self.init(self.options.defaultItem);
        })();
    }

    Pager.prototype = {

        //创建页码
        create: function (num) {
            var showEntries = this.options.showEntries;
            var _html = "";
            for (var i = 0; i < showEntries; i++) {
                num += 1;
                if (num <= this.options.totalPages) {
                    _html += "<li data-num='" + num + "' id='page_" + num + "'>" + num + "</li>";
                } else {
                    _html += "<li style='background:#E5E5E5; cursor:auto;' class='disable'></li>";
                }
            }
            return _html;
        },

        //下位移
        next: function () {
            this._html = this.create(++this.count * this.options.showEntries);
        },

        //上位移
        prev: function () {
            this._html = this.create(--this.count * this.options.showEntries);
        },

        //首页
        first: function () {
            this.count = 0;
            this.init(1);
        },

        //尾页
        last: function () {
            this.count = this.group - 1;
            this.init(this.options.totalPages);
        },

        //渲染
        display: function () {
            if ($_pager.length && $_pager[0].show == "on") {
                $_pager.html(this._html);
            }
        },

        //回调事件
        then: function (fn) {
            this.callback = fn;
            //this.callback(this.selectNumber);
        }
    };
    return Pager;
})();



//跨域请求
function crossDomain(X /*X对象*/ , opts) {
    //默认项
    opts.url = opts.url || '';
    opts.data = opts.data || {};
    opts.type = opts.type || 'post';
    opts.success = opts.success || $.loop;
    opts.sesseionID = opts.sesseionID || ''; //sesseionID为必填项

    if (window.navigator.userAgent.indexOf('MSIE 9.0') != -1 || window.navigator.userAgent.indexOf('MSIE 8.0') != -1 || window.navigator.userAgent.indexOf('MSIE 7.0') != -1) {
        var xdr = new XDomainRequest();
        var strlll = JSON.stringify(opts.data);
        xdr.onload = function () {
            var data = eval('(' + xdr.responseText + ')');
            opts.success && opts.success(data)
        };
        xdr.onerror = function (e) {
            console.log(e)
            alert('出错')
        };
        //如果是IE 7 8  9 常规接口Url+/domain?obj=后跟字符串格式的json数据

        //console.log(opts.url+"/domain;jsessionid="+opts.sesseionID+"?obj="+strlll)

        xdr.open(opts.type, opts.url + "/domain;jsessionid=" + opts.sesseionID + "?obj=" + strlll);

        xdr.send(null);
    }
    //其他浏览器
    else {
        $.ajax({
            url: opts.url + ";jsessionid=" + opts.sesseionID,
            type: opts.type,
            data: JSON.stringify(opts.data),

            success: function (data) {
                opts.success && opts.success(data)
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                opts.error && opts.error(textStatus);
            }
        });
    };

}
//更新关联图片
function updateRelationShip(X /*X对象*/ , opts) {
    //默认项
    opts.data = opts.data || {};
    opts.success = opts.success || $.loop;
    $.ajax({
        url: mXbn.configer.__ROOT_PATH__ + "/api/service/sessid",
        type: "get",
        success: function (data) {
            if (data.statusCode == "2000000") {
                var sesseionID = data.data;
                crossDomain(X, {
                        url: mXbn.configer.__ROOT_PATH_IMG_HOST__ + "file/relation/updateall",
                        sesseionID: sesseionID,
                        data: opts.data,
                        type: "post",
                        success: function (data) {
                            opts.success && opts.success(data)
                        }
                });
            }
        }
    });

}

//保存关联图片
function saveRelationShip(X /*X对象*/ , opts) {
    //debugger
    //默认项
    opts.data = opts.data || {};
    opts.success = opts.success || $.loop;
    $.ajax({
        url: mXbn.configer.__ROOT_PATH__ + "/api/service/sessid",
        type: "get",
        success: function (data) {
            if (data.statusCode == "2000000") {
                var sesseionID = data.data;
                crossDomain(X, {
                    url: mXbn.configer.__ROOT_PATH_IMG_HOST__ +  "/file/relation/saveall",
                    sesseionID: sesseionID,
                    data: opts.data,
                    type: "post",
                    success: function (data) {
                        opts.success && opts.success(data)
                    }
                });
            }
        }
    });
}

//获取关联图片
function getRelationPicture(X, IdArr, successFn, errorFn) {

    //var sesseionID = document.cookie;
    //var sesseionIDArr = (sesseionID.split(';'));
    $.ajax({
        url: mXbn.configer.__ROOT_PATH__ + "/api/service/sessid",
        type: "get",
        success: function (data) {
            if (data.statusCode == "2000000") {
                var sesseionID = data.data;
                crossDomain(X, {
                    url: mXbn.configer.__ROOT_PATH_IMG_HOST__ + "file/relation/list",
                    sesseionID: sesseionID,
                    data: {
                        "list": IdArr
                    },
                    type: "post",
                    success: function (data) {
                        if (data.statusCode == '2000000') {
                            for (var i = 0; i < data.data.length; i++) {
                                data.data[i].fileOriginalurl = mXbn.configer.__ROOT_PATH_IMG_HOST__ + data.data[i].fileOriginalurl
                            };
                            successFn && successFn(data.data)
                        }
                    },
                    error: function (error) {
                        errorFn && errorFn(error);
                    }
                });

            }
        }
    })

};


// 获取站点某一特定字段（获取站点相关基础数据）
function getSiteDicWord(siteObj) {
    var code = 'enName'; //获取对象的enName
    return siteObj[code];
};



/*******************加载图片***************
 ** dom属性 data-fileid和data-defaultImg
 ** data-fileid:关联id
 ** data-defaultImg: 无关联图片时的默认图片路径(针对img)、
 ** view 视图对象
 ** 非img时，获取子节点，生成图片
 ** isType 用于判断是否需要用type来获取图片数据
 ******************************************/
function addRelationImg(X, view, isType) {
    var arrListId = [],
        aImgDoms = $('[data-fileid]');
    // 无data-fileid节点，退出
    if (!aImgDoms.length) return;
    aImgDoms.each(function (i) {
        if ($(this).attr('data-fileid')) {
            // 获取需要传入的图片关联id
            arrListId.push($(this).attr('data-fileid'));
        }
    });
    if (!arrListId.length) return;
    // 获取管理图片地址数据
    getRelationPicture(X, arrListId, function (data) {
        // 判断有没有返回图片数据
        if (data.length) {
            var newData = {};
            // 遍历data并生成关联id=>[img1,img2...]
            $.each(data, function (i, list) {
                if (isType) {
                    if (typeof newData[list.relBelong] == 'undefined') {
                        newData[list.relBelong] = {};
                    }
                    // 根据返回的数据type来用
                    if (typeof newData[list.relBelong][list.type] == 'undefined') {
                        newData[list.relBelong][list.type] = [];
                    }
                    newData[list.relBelong][list.type].push(list["fileOriginalurl"]);
                } else {
                    if (typeof newData[list.relBelong] == 'undefined') {
                        newData[list.relBelong] = [];
                    }
                    newData[list.relBelong].push(list["fileOriginalurl"]);
                }

            });
            // 节点加载图片
            aImgDoms.each(function (i) {
                // 获取关联id
                var relateId = $(this).attr('data-fileid');
                // 判断是不是单图img
                if (this.nodeName.toLowerCase() == 'img' && newData[relateId]) {
                    if (isType) {
                        if (newData[relateId][$(this).attr('data-type')]) {
                            $(this).attr('src', newData[relateId][$(this).attr('data-type')][0]);
                        }
                    } else {
                        $(this).attr('src', newData[relateId][0]);
                    }
                } else if (newData[relateId]) {
                    if (isType) {
                        var type = $(this).attr('data-type');
                        // 视图渲染模板
                        view.renderIn('[data-forFileid=' + relateId + '][data-type=' + type + ']', $(this), {
                            list: newData[relateId][type]
                        });
                    } else {
                        // 视图渲染模板
                        view.renderIn('[data-forFileid=' + relateId + ']', $(this), {
                            list: newData[relateId]
                        });
                    }

                } else {
                    // 没有返回该关联id的数据
                    if (this.nodeName.toLowerCase() == 'img') {
                        // 设置默认图片
                        $(this).attr('src', $(this).attr('data-defaultImg'));
                    } else {
                        $(this).html('');
                    }
                }
            });
        } else {
            // 设置默认图片
            console.error('没有关联图片数据');
        }
    });

}

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd(arg1, arg2) {
    var arg1 = arg1 == null ? 0 : arg1;
    var arg2 = arg2 == null ? 0 : arg2;
    var r1,
        r2,
        m,
        c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accSub(arg1, arg2) {
    var r1,
        r2,
        m,
        n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}


 /**************** 2016-2-4 pdf预览 function start ****************/
     //检测浏览器类型：IE、火狐、谷歌、Safari
    function getBrowserName() {

        var userAgent = navigator ? navigator.userAgent.toLowerCase() : "other";
        if (userAgent.indexOf("chrome") > -1) return "chrome";

        else if (userAgent.indexOf("safari") > -1) return "safari";

        else if (userAgent.indexOf("msie") > -1 || userAgent.indexOf("trident") > -1)

                return "ie";

        else if (userAgent.indexOf("firefox") > -1) return "firefox";

        return userAgent;

    }

     //针对IE返回ActiveXObject　　
    function getActiveXObject(name) {

        try {

            return new ActiveXObject(name);

        } catch(e) {

        }

    }

     //针对除了IE之外浏览器　　
    function getNavigatorPlugin(name) {

        for (key in navigator.plugins) {

            var plugin = navigator.plugins[key];

            if (plugin.name == name)

                return plugin;
        }
    }

     //获取Adobe Reader插件信息　　
    function getPDFPlugin() {

        if (getBrowserName() == 'ie') {

            // load the activeX control　　
            //AcroPDF.PDF is used by version 7 and later　　
            // PDF.PdfCtrl is used by version 6 and earlier　　
            return getActiveXObject('AcroPDF.PDF')

                    || getActiveXObject('PDF.PdfCtrl');

        } else {

            return getNavigatorPlugin('Adobe Acrobat') || getNavigatorPlugin('Chrome PDF Viewer') || getNavigatorPlugin('WebKit built-in PDF');
        }

    }

    //判断插件是否安装pdf　　
    function isAcrobatInstalled() {

        return !! getPDFPlugin();

    }

    //获取Adobe Reader版本　　
    function getAcrobatVersion() {

        try {

            var plugin = getPDFPlugin();

            if (getBrowserName() == 'ie') {

                var versions = plugin.GetVersions().split(',');

                var latest = versions[0].split('=');

                return parseFloat(latest[1]);

            }

            if (plugin.version)

                return parseInt(plugin.version);

            return plugin.name;

        }
        catch(e) {

            return null;

        }

    }

     /********** 2016-2-4 pdf预览 function end **********/


/*加法函数*/
function accAdd(arg1, arg2) {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
}
/*减法函数*/
function Subtr(arg1, arg2) {
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    //last modify by deeka
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
/*乘法函数*/
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
/*除法函数*/
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
    try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return (r1 / r2) * pow(10, t2 - t1);
    }
}
Number.prototype.add = function (arg) {
    return accAdd(arg, this);
}
Number.prototype.Subtr = function (arg) {
    return Subtr(arg, this);
}
Number.prototype.accMul = function (arg) {
    return accMul(arg, this);
}
Number.prototype.accDiv = function (arg) {
    return accDiv(arg, this);
}


//设置iframe内容
/*
*    iframe  原生JS DOM对象
*
* */
function setIframeContent(iframe,content){
    setTimeout(function(){
        if( window.navigator.userAgent.indexOf('Firefox') != -1 ){
            var iframeBody = iframe.contentDocument.body;
        }else{
            var iframeBody = iframe.contentWindow.document.body;
        };
        iframeBody.innerHTML = content;
    },100);
}

//返回两位小数
function getTwoPoint(n){
    var num = n +"";
    var arr = num.split(".");
    if(arr[1]){
        if(arr[1].length == 1)
            num += "0";
    }else{
        num += ".00";
    }
    return num;
}

