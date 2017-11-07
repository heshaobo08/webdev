;
(function (X) {

    var rootPathTmpl = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__,
        rootPathApi = X.configer.__API_PATH__,
        _dataCatch = {},
        detailsItem = X(),
        detailsConstor = detailsItem.ctrl(),
        parms = detailsItem.utils.getRequest(),
        interFace = {
            tpl: "/order/164_details_abstract.html",
            uri: {
                details: "/order/",
                detailsShip: "/order/shipping/history",
                detailsMessage: "/message/datagridbyorder",
                detailsMessageShow: "/message/"
            }
        };

    //tabs切换(摘要 发货 消息)事件监听
    detailsConstor.on("tabsSwitch", function (no) {

        var tabsDetails = $("#order_tabs_details [data-tabs_tabs_details]"),
            tabsConts = $("#order_tabs [data-tabs]");

        tabsConts.removeClass("this");

        tabsDetails.each(function () {

            var _this = $(this);
            if (_this.data("tabs_tabs_details") == no) {
                _this.show();
                $("#order_tabs [data-tabs=" + no + "]").addClass("this");
            } else {
                _this.hide();
            }
        });

    });

    //详情模块中消息信息单条查看详情
    detailsConstor.on("messageLooks", function (msId) {

        var xhrDetailsMsg = detailsConstor.request({
            url: rootPathApi + interFace.uri.detailsMessageShow + msId
        });

        xhrDetailsMsg.then(function (D) {

            if (D.statusCode == "2000000" && D.data) {

                detailsConstor.renderIn("#details_message_show_tmpl", "#details_message_show_conts", {
                    source: D.data
                });

                var $messageDelis = $("#message_content");

                //回写消息详情
                if ($messageDelis.length)
                    $messageDelis.html(D.data.content);

                $.layer({
                    title: '查看消息',
                    area: ['602px', '400px'],
                    dialog: {
                        btns: 1,
                        btn: ['返回', ''],
                        type: 8,
                        msg: $("#details_message_show_conts").html()
                    }
                });
            }
        });
    });


    //定义详情模块视图对象
    detailsConstor.view = {
        elem: "#id_conts",
        tpl: rootPathTmpl + interFace.tpl
    };

    //请求详情模块中发货信息
    var ship = detailsConstor.request({
        url: rootPathApi + interFace.uri.detailsShip,
        data: JSON.stringify({
            xbnOrderId: parms.id
        })
    });

    //详情模块中发货信息数据返回后的回调函数
    ship.then(function (D) {
        if (D.statusCode == "2000000" && D.data) {
            _dataCatch["2"] = D;
        }
    });

    //请求详情模块数据与标签中摘要信息
    var xhr = detailsConstor.request({
        url: rootPathApi + interFace.uri.details + parms.pl,
        data: JSON.stringify({
            xbnOrderId: parms.id
        })
    });

    //详情模块中消息信息
    var message = (function () {

        var requestData;

        var _private = {

            request: function (uri, id, pageSize, pageNo) {

                requestData = detailsConstor.request({
                    url: uri,
                    data: JSON.stringify({
                        orderID: id,
                        pageSize: pageSize,
                        toPageNo: pageNo
                    })
                });
            },

            render: function (tmpl, conts, callback) {

                var _callback = callback || function () {};
                requestData.then(function (D) {
                    if (D.statusCode == "2000000" && D.data) {
                        detailsConstor.renderIn(tmpl, conts, {
                            source: D.data
                        });

                        _callback(D.data);
                    }
                });
            }
        };

        _private.request(rootPathApi + interFace.uri.detailsMessage, parms.id, 10, 1);

        return {
            getRequest: _private.request,
            runderIn: _private.render
        };
    })();


    //详情模块数据返回后的回调函数,通常情况在这个回调中渲染页面（render方法）
    xhr.then(function (D) {
        if (D.statusCode == "2000000") {
            var remderView = detailsConstor.render(D.data);

            remderView.then(function () {

                var tabs = $("#order_tabs").find("[data-tabs]");
                tabs.click(function () {
                    var _this = $(this),
                        numTabs = _this.data("tabs");
                    detailsConstor.tirgger("tabsSwitch", numTabs);

                    //渲染详情模块 - 局部（发货）
                    detailsConstor.renderIn("#details_ship", "#details_ship_conts", {
                        source: _dataCatch[numTabs] ? _dataCatch[numTabs].data : []
                    });

                    //渲染详情模块 - 局部（消息）
                    message.runderIn("#details_message", "#details_message_conts", function (D) {

                        var pageItem = Pager({
                            topElem: "#message_pager",
                            elem: "#message_pager_item",
                            defaultItem: 1,
                            totalPages: D.totalPages
                        });

                        pageItem.then(function (p) {
                            message.getRequest(rootPathApi + interFace.uri.detailsMessage, parms.id, 10, p);
                            message.runderIn("#details_message", "#details_message_conts");
                        });
                    });

                    $("#details_message_conts").off().on("click", ".pop_message", function () {

                        var _this = $(this),
                            _id = _this[0].id;

                        detailsConstor.tirgger("messageLooks", _id);
                    });

                });

                renderImgs();
                detailsConstor.tirgger("tabsSwitch", 1);
            });
        }

    });

    function renderImgs() {

        var imgIds = [],
            $imgIds = $("img[id]");

        $imgIds.each(function (index, item) {
            imgIds.push(item.id);
        });

        if (imgIds.length) {
            //订单列表图片
            getRelationPicture("X", imgIds, function (D) {

                if (D.length) {
                    $.each(D, function (i) {
                        var ds = D[i];
                        $("#" + ds.relBelong)[0].src = ds.fileOriginalurl;
                    });
                }
            });
        }
    }


})(mXbn);