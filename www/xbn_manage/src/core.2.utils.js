/** 
 * @description 框架原型扩展
 */

;
(function (XP) {

    var toStr = Object.prototype.toString,
        timeOut = {};

    //扩展原型对象utils方法
    $.extend(XP.utils, {


        //返回值: 如果传入的参数对象是布尔类型, 则返回true, 否则返回false
        isBoolean: function (testArr) {
            return (toStr.call(testArr).slice(8, -1) === "Boolean");
        },

        //返回值: 如果传入的参数对象是正则表达式类型, 则返回true, 否则返回false
        isRegExp: function (testArr) {
            return (toStr.call(testArr).slice(8, -1) === "RegExp");
        },

        //返回值: 如果传入的参数对象是函数类型, 则返回true, 否则返回false
        isFunction: function (testArr) {
            return (toStr.call(testArr).slice(8, -1) === "Function");
        },

        //判断是否为数值类型
        isNumber: function (num) {
            return toStr.call(num) === "[object Number]";
        },

        //转换数值类型（整型）
        toInt: function (num) {
            return this.isNumber(num) ? parseInt(num) : 0;
        },

        //返回值: 基于传入的原型对象参数o创建的新对象
        inhert: function (o) {

            var F = function () {};
            F.prototype = o;
            return new F();
        },

        //该函数基于一定算法返回一个16进制的唯一字符串序列
        createGuid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = (c == 'x') ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }).toUpperCase();
        },

        //该函数内包装了要执行的函数和函数运行的上下文对象
        proxy: function (context, func) {
            return (function () {
                return func.apply(context, arguments);
            });
        },

        //判断是否为IE浏览器
        isProIE: function () {
            return $.browser.msie ? 1 : 0;
        },

        //获取url参数值
        getRequest: function (args) {

            var theRequest = {},
                url = window.location.search,
                strs = '',
                str = '';
            if (typeof args == 'string' && args.indexOf("=") != -1) {
                str = args;
            } else if (typeof args != 'undefined') {
                return theRequest;
            } else {
                if (url.indexOf("?") != -1) {
                    str = url.substr(1);
                } else {
                    return theRequest;
                }
            }
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
            return theRequest;
        },

        /************************
         @ 倒计时 （秒计数器，单位秒）
         @ id计数器Id  *必填
         @ seconds 计数器秒数m单位 *必填
         @ cFn 倒计时结束后回掉函数 -非必填
         @ rFn 运行倒计时即时回掉函数 -非必填
        **/
        countDown: function (id, seconds, cFn, rFn) {

            clearTimeout(timeOut[id]);

            var loopTime = seconds;
            var countdown = function (cFn, rFn) {

                var _this = this;
                if (loopTime > 0) {
                    timeOut[id] = setTimeout(function () {
                        countdown(cFn, rFn);
                    }, 1000);
                }

                (rFn && rFn(loopTime));
                if (loopTime-- <= 0) {
                    (cFn && cFn(loopTime));
                    loopTime = 3;
                }
            };

            countdown(cFn, rFn);
        }

    });

})(mXbn.prototype);