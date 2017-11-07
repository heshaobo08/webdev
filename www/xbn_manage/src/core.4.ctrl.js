;
(function (X) {

    var pro = X.prototype,
        rolesData = {};

    try {
        rolesData = JSON.parse(window.localStorage.Roles);
    } catch (e) {
        console.log(e.message);
    }

    var Ctrl = function () {

        if (!(this instanceof Ctrl)) {
            return new Ctrl();
        }

        this.el = null;

        this.view = {};

        this.channels = {};

        return this;
    };

    $.extend(Ctrl.prototype, pro.utils.inhert(pro), {

        // 订阅一个事件，并且提供一个事件触发以后的回调函数
        on: function (channel, fn) {

            if (!this.channels[channel]) {
                this.channels[channel] = [];
            }

            this.channels[channel].push({
                context: this,
                callback: fn
            });

            return this;
        },

        // 广播事件
        tirgger: function (channel) {

            if (!this.channels[channel]) {
                return false
            };

            var args = Array.prototype.slice.call(arguments, 1);

            for (var i = 0, l = this.channels[channel].length; i < l; i++) {
                var subscription = this.channels[channel][i];
                subscription.callback.apply(subscription.context, args);
            }

            return this;
        },

        installTo: function (obj) {
            obj.subscribe = this.subscribe;
            obj.publish = this.publish;
        },

        render: function (data) {

            var that = this;
            var _data = data || {};

            return xhrHttpRequest({
                url: that.view.tpl
            }).then(function (tpl) {
                $(that.view.elem).html($.tmpl(tpl, {
                    source: _data,
                    roles: pro.authority(rolesData)
                }));
            });
        },

        renderIn: function (tId, elem, data) {
            $.template('template', tmplParsing(tId));
            $(elem).html($.tmpl('template', $.extend(data, {
                roles: pro.authority(rolesData)
            })));
        },

        renderTo: function (tId, elem, data) {
            $.template('template', tmplParsing(tId));
            $.tmpl('template', $.extend(data, {
                roles: pro.authority(rolesData)
            })).appendTo(elem);
        },

        request: function (options) {

            return xhrHttpRequest($.extend({
                type: "POST",
                dataType: "json"
            }, options));
        }

    });


    function tmplParsing(tId) {

        var tmplStr = $(tId).html();
        //模板解析引擎算法
        // return $.trim(tmplStr).replace(/_\[+/g, "{").replace(/\]+_/g, "}");
        return $.trim(tmplStr).replace(/_\[/g, "{").replace(/\]_/g, "}");
    }


    function xhrHttpRequest(options) {

        return $.ajax($.extend({
            type: "GET",
            dataType: "html",
            cache: false,
            data: {}
        }, options));

    }

    pro.ctrl = Ctrl;

})(mXbn);
