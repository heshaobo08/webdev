;
(function (X) {


    //模板基础路径
    var rootPathTmpl = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;

    //API基础路径
    var rootPathApi = X.configer.__API_PATH__;

    //模板文件与接口路径
    var rootFilePath = {

        tmpl: "/order/168_return_applyDetails.html",
        uri: {

            //退换货详情
            lists: "/order/return/details",

            //退换货协商
            history: "order/return/history",

            //订单详情
            details: "/order/",

            //关闭申请
            closeRequest: "/order/return/update",

            //协商记录
            recordReply: "/order/return/record",

            //填写退换货信息
            returnshipservice: "/order/return/returnshipservice",

            //操作退款
            refundmoneycomplete: "/order/return/refundmoneycomplete",
            
            //平台仲裁退货退款
            returnaddress: "/order/return/returnaddress"

        }
    };

    var orderDatas = {
        xbnOrderId: "",
        orderPlatform: ""
    };


    var orderItem = X(),
        orderConstor = orderItem.ctrl();

    var parms = orderItem.utils.getRequest();

    //操作按钮类
    function Class_button_operation() {

        var self = this;

        //获取订单ID
        var getOrderID = function () {
                return $("[orderid]").attr("orderid");
            },
            getFormValue = function (index, vO) {

                var $_parentElem = $("#xubox_layer" + index),
                    value = {};
                $.each(vO, function (k, v) {
                    value[k] = $_parentElem.find(v).attr("value");
                });
                return value;
            };

        //默认弹窗配置
        this.layerConfig = {
            title: "提示",
            area: ['550px', '190px'],
            btns: 2,
            btn: ['确认', '取消'],
            msg: "<div class='tips'>消息提醒!</div>"
        };

        //对话框处理
        this.dialogBox = function (uri, options, callback) {
            var checkItem,
                data = {};
            this.layer(options.layer, function (index, success, error) {
                var content = getFormValue(index, options.value),
                    source = options.source || {};
                var _options = $.extend({
                    "returnID": parms.id,
                    "orderID": getOrderID()
                }, source, content);

                if (checkItem.check()) {
                    self.setRequest(uri, _options, function (xhr) {
                        xhr.then(function (D) {
                            if (D.statusCode == "2000000") {
                                data = D;
                                //保存图片关联关系 
                                if (self.fileId) {
                                    updateRelationShip("X", {
                                        data: {
                                            ids: [D.data],
                                            list: [{
                                                "relBelong": D.data,
                                                "sort": "0",
                                                "fileId": self.fileId,
                                                "type": "0"
                                            }]
                                        }
                                    });
                                }

                                success(options.success);
                                options.state && self.setState(options.state);
                            } else {
                                error(options.error)
                            }
                        });
                    });
                }
            });
            checkItem = this.checkform(options.checkform);

            //弹出对话窗口后的回调函数（不能确保是否每次执行，因出现位置的原因定义）
            callback && callback(data);
        };

    }

    Class_button_operation.prototype = {

        //发送请求至接口
        setRequest: function (url, options, callback) {
            var renderView = orderConstor.request({
                url: url,
                data: JSON.stringify(options)
            });
            callback && callback(renderView);
        },

        //设置当前对象的状态
        setState: function (state, success, error) {

            var path = rootPathApi + rootFilePath.uri.closeRequest;
            this.setRequest(path, {
                "returnID": parms.id,
                "colName": "returnStatus",
                "value": state
            }, function (xhr) {
                xhr.then(function (D) {
                    if (D.statusCode == "2000000") {
                        success && success();
                    } else {
                        error && error();
                    }
                });
            });
        },

        //弹出窗口定义
        layer: function (options, callback) {

            var _this = this,
                _opts = $.extend({
                    success: function (msg) {
                        _this.layer({
                            title: "提示信息",
                            btns: 1,
                            msg: "<div class='tips'>" + msg + "</div>"
                        }, function () {
                            window.location.href = "index.html?m=xhr_id_163_168";
                        });
                    },
                    error: function (msg) {
                        _this.layer({
                            title: "提示信息",
                            btns: 1,
                            msg: "<div class='tips'>" + msg + "</div>"
                        });
                    }
                }, this.layerConfig, options);
            $.layer({
                title: _opts.title,
                area: _opts.area,
                dialog: {
                    btns: _opts.btns,
                    btn: _opts.btn,
                    type: 8,
                    msg: _opts.msg
                },
                yes: function (index) {

                    /**
                     * parames index 弹出窗口的下标值 success 成功后的回调函数 error 失败后的回调函数
                     */
                    callback && callback.call(_this, index, _opts.success, _opts.error);
                }
            });
        },

        checkform: function (fId) {

            var $_confirm = $(".xubox_layer"),
                $_formBox = $_confirm.find("#" + fId);

            var state = false;

            $_formBox.html5Validate(function () {
                state = true;
            });

            return {
                check: function () {
                    $_formBox.submit();
                    return state;
                }
            }
        }
    };

    var buttonOper = new Class_button_operation();

    //定义订单列表模块视图对象
    orderConstor.view = {
        "elem": "#id_conts",
        "tpl": rootPathTmpl + rootFilePath.tmpl
    };

    orderConstor.request({
        "url": rootPathApi + rootFilePath.uri.lists,
        "data": JSON.stringify({
            returnID: parms.id
        })
    }).then(function (D) {

        var orderPlatform = "";
        switch (D.data.orderPlatform) {
        case "1":
            orderPlatform = "ebay/";
            break;
        case "2":
            orderPlatform = "amazon/";
            break;
        case "3":
            orderPlatform = "newegg/";
            break;
        }

        if (D.statusCode == "2000000") {

            var carTime = D.data.applyExprieTime;

            //获取系统时间
            orderConstor.request({
                url: rootPathApi + "/sysDate",
                type: "GET"
            }).then(function (D) {

                if (D.statusCode == "2000000") {
                    var createTime = new Date(carTime).getTime(),
                        sysTime = new Date(D.data.sysDate).getTime();
                    if ((createTime - sysTime) <= 0) { //goto 超时后显示仲裁按钮 <临时注释用于测试>
                        //if (true) {
                        setTimeout(function () {
                            $("#btnArbitration").html('<a href="javascript:;" class="button mar20" data-type="11">平台仲裁</a>');
                        }, 100);

                    }

                }
            });

            //全局渲染视图
            orderConstor.render(D.data).then(function () {

                //获取订单详情数据
                orderConstor.request({
                    "url": rootPathApi + rootFilePath.uri.details + orderPlatform,
                    "data": JSON.stringify({
                        xbnOrderId: D.data.orderID
                    })
                }).then(function (D) {

                    var platform = "";

                    if (D.statusCode == "2000000" && D.data) {
                        var freight = 0;
                        for(var i=0;i< D.data.order.items.length;i++){
                            var item = D.data.order.items[i];
                            freight += Number(item.freight)*100;
                        }
                        D.data.order.totalFreight=freight/100;
                        orderConstor.renderIn("#details_tmpl", "#details_conts", {
                            source: D.data
                        });

                        switch (D.data.order.orderPlatform) {
                        case "1":
                            platform = "ebay";
                            break;
                        case "2":
                            platform = "amazon";
                            break;
                        case "3":
                            platform = "newegg";
                            break;
                        }
                        orderDatas.xbnOrderId = D.data.order.xbnOrderId;
                        orderDatas.orderPlatform = platform;
                        //获取图片并渲染img标签
                        renderImgs("#details_conts");
                    }
                });

                //交涉记录
                orderConstor.request({
                    "url": rootPathApi + rootFilePath.uri.history,
                    "data": JSON.stringify({
                        returnID: parms.id
                    })
                }).then(function (D) {

                    if (D.statusCode == "2000000" && D.data) {
                        orderConstor.renderIn("#details_history_tmpl", "#details_history_conts", {
                            source: D.data
                        });
                        //获取图片并渲染img标签
                        renderImgs("#details_history_conts");
                    }

                });


                //页面操作按钮事件绑定
                $("#id_conts").off().on("click", "[data-type]", function () {

                    var _this = $(this),
                        _type = _this.data("type"),
                        _btnTitle = ""; //_this.html();
                    
                    if (_this.html() == "提出退款申请") {
                        _btnTitle = "01";
                    } else if (_this.html() == "回复卖家") {
                        _btnTitle = "02";
                    } else if (_this.html() == "提出解决方案") {
                        _btnTitle = "03";
                    } else if (_this.html() == "修改解决方案") {
                        _btnTitle = "04";
                    } else if (_this.html() == "驳回卖家请求") {
                        _btnTitle = "05";
                    } else if (_this.html() == "平台仲裁") {
                        _btnTitle = "06";
                    } else if (_this.html() == "填写退货信息") {
                        _btnTitle = "07";
                    } else if (_this.html() == "更新退货信息") {
                        _btnTitle = "08";
                    } else if (_this.html() == "关闭申请") {
                        _btnTitle = "09";
                    } else if (_this.html() == "联系买家") {
                        _btnTitle = "11";
                    } else if (_this.html() == "同意申请") {
                        _btnTitle = "12";
                    } else if (_this.html() == "拒绝申请") {
                        _btnTitle = "13";
                    } else if (_this.html() == "确认收货") {
                        _btnTitle = "14";
                    } else if (_this.html() == "未收到货") {
                        _btnTitle = "15";
                    } else if (_this.html() == "直接退款") {
                        _btnTitle = "16";
                    }

                    switch (_type) {
                    case 1:
                        buttonOper.layer({
                            title: "关闭申请",
                            msg: "<div class='tips'>您确定关闭这个退款申请吗？</div>"
                        }, function (index, success, error) {
                            buttonOper.setState("8", function () {
                                success("退款申请已关闭");
                            }, error);
                        });
                        break;
                    case 3:
                        window.location.href = "index.html?m=xhr_id_168_return_apply&pl=" + orderDatas.orderPlatform + "&id=" + orderDatas.xbnOrderId + "&op=c2bf3fab352a43229802&rid=" + parms.id;
                        break;
                    case 6:
                        window.location.href = "index.html?m=xhr_id_168_return_apply&pl=" + orderDatas.orderPlatform + "&id=" + orderDatas.xbnOrderId + "&op=c2bf3fab352a43229802&rid=" + parms.id;
                        break;
                    case 4:
                        buttonOper.dialogBox(rootPathApi + rootFilePath.uri.recordReply, {
                            layer: {
                                title: "回复卖家",
                                area: ['550px', '380px'],
                                msg: $("#layer_4").html()
                            },
                            checkform: "layer_4_form",
                            value: {
                                content: "#txtReply",
                                fileStatus: "#fileStatus"
                            },
                            source: {
                                "operator": JSON.parse(localStorage.User).uname,
                                "action": _btnTitle
                            },
                            success: "您的消息已经发送成功",
                            error: "",
                            state: "1"
                        }, function () {

                            //图片上传
                            var $_confirm = $(".xubox_layer");
                            var $_file = $_confirm.find("#upPic"),
                                $_fileStatus = $_confirm.find("#fileStatus");
                            orderItem.uploadFile($_file, function (D) {
                                if (D.statusCode == "2000000") {
                                    $_fileStatus.val(1);
                                    buttonOper.fileId = D.data.fileId;
                                    $_confirm.find("#setPic").html('<img src=' + D.data.fileUrl + ' alt="" width="48" height="48" class="mR10"/>');
                                }
                            });
                        });
                        break;
                    case 5:
                        buttonOper.dialogBox(rootPathApi + rootFilePath.uri.recordReply, {
                            layer: {
                                title: "驳回卖家请求",
                                area: ['550px', '380px'],
                                msg: $("#layer_5").html()
                            },
                            checkform: "layer_5_form",
                            value: {
                                content: "#txtReply",
                                fileStatus: "#fileStatus"
                            },
                            source: {
                                "operator": JSON.parse(localStorage.User).uname,
                                "action": _btnTitle
                            },
                            success: "卖家请求已经驳回成功!",
                            error: "",
                            state: "3"
                        }, function (D) {
                            //图片上传
                            var $_confirm = $(".xubox_layer");
                            var $_file = $_confirm.find("#upPic"),
                                $_fileStatus = $_confirm.find("#fileStatus");
                            orderItem.uploadFile($_file, function (D) {
                                if (D.statusCode == "2000000") {
                                    $_fileStatus.val(1);
                                    buttonOper.fileId = D.data.fileId;
                                    $_confirm.find("#setPic").html('<img src=' + D.data.fileUrl + ' alt="" width="48" height="48" class="mR10"/>');
                                }
                            });
                        });
                        break;
                    case 7:
                        buttonOper.dialogBox(rootPathApi + rootFilePath.uri.returnshipservice, {
                            layer: {
                                title: "填写退货信息",
                                area: ['550px', '260px'],
                                msg: $("#layer_7").html()
                            },
                            checkform: "layer_7_form",
                            value: {
                                shipCode: "#wls",
                                shipService: "#gzdh"
                            },
                            source: {
                                "operator": JSON.parse(localStorage.User).uname,
                                "action": _btnTitle
                            },
                            success: "退货物流信息已经提交成功!",
                            error: "",
                            state: "6"
                        });
                        break;
                    case 9:
                        buttonOper.dialogBox(rootPathApi + rootFilePath.uri.returnshipservice, {
                            layer: {
                                title: "更新退货信息",
                                area: ['550px', '260px'],
                                msg: $("#layer_7").html()
                            },
                            checkform: "layer_7_form",
                            value: {
                                shipCode: "#wls",
                                shipService: "#gzdh"
                            },
                            source: {
                                "operator": JSON.parse(localStorage.User).uname,
                                "action": _btnTitle
                            },
                            success: "退货物流信息已经提交成功!",
                            error: "",
                            state: "6"
                        });
                        break;
                    case 10:
                        buttonOper.dialogBox(rootPathApi + rootFilePath.uri.refundmoneycomplete, {
                            layer: {
                                title: "操作退款",
                                area: ['550px', '480px'],
                                msg: $("#layer_10").html()
                            },
                            checkform: "layer_10_form",
                            value: {
                                "refundMoney": "#refundMoney",
                                "content": "#content",
                                "refundDate": ".dataInput"
                            },
                            success: "您的退款信息已经提交成功!",
                            error: "",
                            state: "10"
                        }, function () {

                            var $_confirm = $(".xubox_layer"),
                                $_return_money_time = $_confirm.find("#returnMonerTime"),
                                randomId = $_return_money_time[0].id + "_" + orderItem.utils.createGuid();

                            $_return_money_time[0].id = randomId;

                            $_return_money_time.click(function () {
                                laydate({
                                    istime: true,
                                    elem: "#" + randomId,
                                    event: 'focus',
                                    format: 'YYYY-MM-DD hh:mm:ss',
                                    min: laydate.now(),
                                    choose: function (dates) {
                                        $(this.elem).attr("value", dates);
                                    },
                                    empty: function () {
                                        $("#" + randomId).attr("value", "");
                                    }
                                });
                            });

                        });
                        break;

                    case 11:
                        var $stateArbitration = $("[data-state]"),
                            stateNum = $stateArbitration.data("state");

                        if (stateNum == "1" || stateNum == "2") {
                            //退货填写地址
                            buttonOper.dialogBox(rootPathApi + rootFilePath.uri.returnaddress, {
                                layer: {
                                    title: "平台仲裁",
                                    area: ['600px', '480px'],
                                    msg: $("#layer_11").html()
                                },
                                checkform: "layer_11_form",
                                value: {
                                    "userID": "",
                                    "returnID": "#returnID",
                                    "orderID": "#orderID",
                                    "operator": "#operator",
                                    "name": "#name",
                                    "street": "#street",
                                    "city": "#city",
                                    "region": "#region",
                                    "zipCode": "#zipCode",
                                    "country": "#country",
                                    "phone": "#phone"
                                },
                                source: {
                                    "action": 12
                                },
                                success: "您的退款信息已经提交成功!",
                                error: ""
                            }, function () {});

                        } else if (stateNum == "3" || stateNum == "4") {
                            
                            buttonOper.layer({
                                title: "平台仲裁",
                                area: ['520px', '190px'],
                                msg: "<div class='tips'>您确定按照现有处理方案强制执行吗？</div>"
                            }, function (index, success) {
                                buttonOper.setState(9);
                                success("已按照现有处理方案强制执行成功！");
                            });
                            
                        } else {
                            //提示信息 【双方继续沟通】
                            buttonOper.layer({
                                title: "平台仲裁",
                                area: ['520px', '190px'],
                                btns: 1,
                                msg: "<div class='tips'>您还没有提出处理方案，请您先创建处理方案在进行平台仲裁</div>"
                            }, function (index) {
                                layer.close(index);
                            });
                        }

                        break;

                    }

                });
            });
        }
    });

    function renderImgs(parent, callback) {
        var
            imgIds = [],
            imgs = {},
            $imgIds = $(parent).find("img[id]");

        var _imgFunc = {
            moreImage: function (key, data) {
                var
                    imgArr = [],
                    $img = $('#' + key),
                    $parent = $img.parent(),
                    len = data.length;
                for (var i = 0; i < len; i++) {
                    var cloneImger = $img.clone();

                    if ($parent.data('dis') === 'order') {
                        $img.attr('src', data[0].fileOriginalurl);
                        continue;
                    }
                    if (i == 0)
                        $parent.html('');
                    $parent.append(cloneImger.attr('src', data[i].fileOriginalurl));
                }
            }
        };

        $imgIds.each(function (index, item) {
            if (item.id)
                imgIds.push(item.id);
        });

        if (imgIds.length) {
            getRelationPicture("X", imgIds, function (D) {
                if (D.length) {
                    inEach(D);
                    for (var img in imgs) {
                        _imgFunc.moreImage(img, imgs[img]);
                    }
                }
            });
        }

        function inEach(source, key) {
            var _data = [];
            for (var i = 0; i < source.length; i++) {
                //子循环处理
                if (key === source[i].relBelong) {
                    _data.push(source[i]);
                }
                //分组处理
                if (!key) {
                    if (source[i].relBelong in imgs) {
                        continue;
                    } else {
                        imgs[source[i].relBelong] = inEach(source, source[i].relBelong);
                    }
                }
            }
            return _data;
        }
    }

})(mXbn);