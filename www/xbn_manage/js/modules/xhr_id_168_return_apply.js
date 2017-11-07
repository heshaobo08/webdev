;
(function (X) {

    var CEEATE_SUCCESS_TO_URL = "index.html?m=xhr_id_163_168";

    var _rDetaileDatas = [],
        _partAmount = [],
        returnType = 3,
        editorSource;

    var CFI = {

        //模板本地路径
        locationPath: X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__,

        //API接口路径
        locationApiPath: X.configer.__API_PATH__
    };

    //本地模板(html文件)
    CFI.T = {

        //页面全局模板文件
        mainTmpl: "/order/168_return_apply.html"
    };

    //API接口地址
    CFI.U = {

        //退换货列表Api
        "rLists": "/order/",

        //部分退换货详情（弹出窗口）
        "rDetaile": "/order/return/showItemsRefundInfo",

        //创建申请单（request）
        "createForms": "/order/return/create",

        //创建申请单 编辑（request）
        "c2bf3fab352a43229802": "/order/return/edit",

        //编辑退换货申请单 详情
        "editorDetaile": "/order/return/recordDetails",

        //获取退货单状态
        "rTypeState": "/order/return/ifExistReturn"
    };

    CFI.R = {};
    CFI.R.rItem = X();
    CFI.R.rConstor = CFI.R.rItem.ctrl();
    CFI.R.rParms = CFI.R.rItem.utils.getRequest();

    //验证规则与提示信息
    var checkInput = {

        message: {
            empty: "不能为空值！",
            format: "输入格式错误！",
            returnAmountEmpty: "请选择本次退款金额且退款金额不能为0！",
            thisAmountRefund: "请检查必填项是否为空！",
            freightDiff: "当前值应该小于最大运费补偿(运费*2+10)！",
            create: "创建退换货申请单成功！",
            createError: "退换货申请失败！",
            diff:"当前值应该小于最大金额"
        },

        show: function (elem, msg) {
            elem.html('<p class="errorTips">' + msg + '<em class="before"></em><em class="after"></em></p>');
        },

        hide: function (elem) {
            elem.html("");
        },

        space: function (elem) {
            return !elem.length ? true : false;
        },

        empty: function (str) {
            return $.trim(str) !== "";
        },

        /**
         * [[数字格式校验]]
         * @param   {String} str
         * @returns {Boolean} trur | false
         */
        numberFormat: function (str) {
            return /^[0-9]+([.]\d{1,2})?$/.test(str);
        },

        /**
         * [[比较两个值，判断值1是否大于值2]]
         * @param   {Number} v1
         * @param   {Number} v2
         * @returns {Boolean} true | false
         */
        numberDiff: function (v1, v2) {
            return accSub(v1, v2) < 0 ? false : true;
        },

        check: function (that, options, callback) {
            this.$formInput = that;
            var _opt = options || {},
                _callback = callback || function () {};
            for (var key in _opt) {
                if (!this.method[key].apply(this, _opt[key])) {
                    break;
                }
            }
        },

        method: {

            //输入值不能为空
            empty: function (value) {
                var _empty = true,
                    $errorTip = this.$formInput.next();
                if (!this.empty(value)) {
                    this.show($errorTip, this.message.empty);
                    _empty = false;
                }
                return _empty;
            },
            //验证输入值格式
            numberFormat: function (value) {
                var _numberFormat = true,
                    $errorTip = this.$formInput.next();
                if (!this.numberFormat(value) && this.empty(value)) {
                    this.show($errorTip, this.message.format);
                    _numberFormat = false;
                }
                return _numberFormat;
            },
            //输入值比较验证（验证最大运费）
            numberDiff: function (mValue, value) {
                var _numberDiff = true,
                    $errorTip = this.$formInput.next();
                if (!this.numberDiff(mValue, value)) {
                    this.show($errorTip, this.message.diff);
                    _numberDiff = false;
                }
                return _numberDiff;
            },
            //输入值比较验证
            numberFreightDiff: function (mValue, value) {
                var _numberDiff = true,
                    $errorTip = this.$formInput.next();
                if (!this.numberDiff(mValue, value)) {
                    this.show($errorTip, this.message.freightDiff);
                    _numberDiff = false;
                }
                return _numberDiff;
            },
            //校验通过后的回掉函数
            success: function (allErrorElems, fn) {
                if (this.space(allErrorElems)) {
                    fn.call(this);
                }
            }
        }
    };

    //部分退换货弹出组件
    var comReturnGoods = {

            init: function (fn) {
                fn.call(this);
                return this;
            },

            //部分退货输入值求和
            moneyInsetSum: function () {
                var sums = 0;
                if (this.inSetInputText) {
                    this.inSetInputText.each(function (i, item) {
                        var _item = $(item),
                            _itemValue = $.trim(_item.val());

                        if (_itemValue !== "") {
                            sums = accAdd(sums, _itemValue);
                        }
                    });
                }
                return sums;
            },

            //部分退换货（运算）
            moneyPartSum: function (D) {

                var moneys = {};
                if (rView.R.rItem.utils.isArray(D)) {
                    moneys.orderQuota = 0;
                    moneys.maxQuota = 0;
                    moneys.returnQuota = 0;
                    $.each(D, function (i, item) {
                        moneys.orderQuota = accAdd(moneys.orderQuota, accAdd(item.initialMoney*item.quantityOrdered, item.initialShipMoney));
                        moneys.returnQuota = accAdd(moneys.returnQuota, accAdd(item.refundedMoney, item.freightedMoney));
                        moneys.maxQuota = accAdd(moneys.maxQuota, accAdd(accSub(item.initialMoney*item.quantityOrdered, item.refundedMoney), accSub(item.initialShipMoney, item.freightedMoney)));
                    });
                }
                return moneys;
            },

            //部分退换货（运算模板）
            moneSumHtml: function () {
                var data = this.moneyPartSum(this.data);
                return '<tr class="summary">' +
                    '<td>合计</td>' +
                    '<td>' + this.currencySymbol + data.orderQuota + '</td>' +
                    '<td>' + this.currencySymbol + data.returnQuota + '</td>' +
                    '<td>' + this.currencySymbol + data.maxQuota + '</td>' +
                    '<td>' + this.currencySymbol + '<span class="red" id="allTotal"></span>' +
                    '</td></tr>';
            },

            //获取部分退款自定义的值
            moneGetValue: function () {
                var $skuLists = this.elem.find("[data-sku]"),
                    _list = {};

                $skuLists.each(function (i, item) {

                    var _this = $(item),
                        skuSign = _this.data("sku");

                    var $moneValues = _this.find("[data-sourcevalue]"),
                        refundMoneyValue = $.trim($moneValues[0].value),
                        freightValue = $.trim($moneValues[1].value);

                    //过滤掉为0的数据
                    if (refundMoneyValue === "0" && freightValue === "0") {
                        return;
                    }

                    if (refundMoneyValue || freightValue) {
                        _list[skuSign] = {
                            refundMoney: refundMoneyValue || "0",
                            freight: freightValue || "0"
                        };
                    }

                });

                return _list;
            }

        },

        //下拉选择组件
        comInSelebox = {

            init: function (seleIndex) {
                sele();
                this.backFill(seleIndex || 0);
            },

            //根据类型（下标）回填选中值
            backFill: function (index) {
                $("li[index-data]").eq(index).click();
            },

            //获取下拉菜单选中值
            getValue: function () {
                var $seleTypeIsHiddenElem = $("input[type=hidden]");
                return {
                    type: $seleTypeIsHiddenElem.attr("index-data"),
                    name: $seleTypeIsHiddenElem.val()
                };
            }
        },

        //textArea输入框组件
        comTextareaBox = {

            init: function (msg) {
                var _this = this;
                this.$textarea = $("#textareaEdit");
                if (msg) {
                    this.backFill(msg);
                }
            },
            getValue: function () {
                return this.$textarea.val();
            },
            backFill: function (msg) {
                this.$textarea.val(msg);
            }
        },

        //运费补偿组件
        comCompensation = {

            init: function (number) {

                var _this = this;
                this.$freightCompensation = $(".freightCompensation");

                if (number) {
                    this.backFill(number);
                }

                this.$freightCompensation.blur(function () {
                    var that = $(this),
                        $errorTip = that.next(),
                        $dataMaxValue = that.data("amount"),
                        $dataSourceValue = that.data("sourcevalue"),
                        $errorNodes = that.closest("span").find(".errorTips");
                    that.data("check", false);
                    checkInput.hide($errorTip);
                    checkInput.check(that, {
                        empty: [this.value],
                        numberFormat: [this.value],
                        numberFreightDiff: [$dataSourceValue, this.value],
                        success: [$errorNodes, function () {
                            that.data("check", true);
                            $("input[type=radio]:checked").closest("dd").find(".anoutMoney").html(accAdd($dataMaxValue, that.val()));
                            }]
                    });
                });

            },
            backFill: function (num) {
                var _this = this;
                if(this.$freightCompensation.val(num)[0]){
                    this.$freightCompensation.val(num)[0].focus();
                    setTimeout(function () {
                        _this.$freightCompensation.blur();
                    }, 200);
                }

            }
        },
        //单选按钮组件
        comRadiobox = {

            init: function () {

                this.$radio = $(".refundWays input[type=radio]");
                $(".refundWays span").hide();
                this.$radio.click(function () {
                    var _this = $(this);
                    $(".refundWays span").hide();
                    _this.closest("dd").find("span").show();
                    returnType = _this.val();
                });
            },

            exec: function (num) {
                this.$radio.each(function (i, item) {
                    var $item = $(item);
                    if ($item.val() === num)
                        $item.click();
                });
            }
        },
        //图片上传组件
        comUpImages = {
            fileId: 0,
            fileStatus: "0",
            init: function () {
                var _this = this;
                rView.R.rItem.uploadFile("#addFile", function (D) {
                    if (D.statusCode == "2000000" && D.data) {
                        $(".addImg").html('<img src="' + D.data.fileUrl + '" class="imgBorder fL" width="48" height="48">');
                        _this.fileId = D.data.fileId;
                        _this.fileStatus = "1";
                    }
                });
            },

            //创建图片关联关系
            updateRelationShip: function (data) {

                if (this.fileStatus) {
                    updateRelationShip("X", {
                        data: {
                            ids: [data],
                            list: [{
                                relBelong: data,
                                sort: 0,
                                fileId: comUpImages.fileId,
                                type: 0
                            }]
                        }
                    });
                }
            },

            //根据关联关系 显示图片
            showImages: function () {
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
                                var ds = D[i],
                                    $imgNode = $("#" + ds.relBelong);
                                $imgNode.show();
                                $imgNode[0].src = ds.fileOriginalurl;
                            });
                        }
                    });
                }
            }
        };

    function Rdata() {
        this.source = {};
    }

    Rdata.prototype = $.extend({

        inSource: function (key, data) {

            var _this = this;
            var _data = this.rItem.utils.isArray(data) ? data : [data];
            $.each(_data, function (i, item) {
                _this.source[item[key]] = item;
            });
        },

        findSource: function (name) {
            return this.source[name];
        },

        getTotalAmount: function () {

            var _value = {
                allAmount: comReturnGoods.moneyPartSum(_rDetaileDatas.list).maxQuota,
                comAmount: 0
            };

            switch (returnType) {
                case "2":
                    var $amountCompensation = $(".freightCompensation"),
                        amountValue = $.trim($amountCompensation.val()) || 0;
                    _value = {
                        allAmount: accAdd(comReturnGoods.moneyPartSum(_rDetaileDatas.list).maxQuota, amountValue),
                        comAmount: amountValue
                    };
                    break;
                case "4":
                    _value = {
                        allAmount: comReturnGoods.moneyInsetSum(),
                        comAmount: 0
                    };
                    break;
                case "5":
                    _value = {
                        allAmount: 0,
                        comAmount: 0
                    };
                    break;
            }
            return _value;
        },

        getPartAmount: function (options) {

            var _this = this,
                partArr = [],
                source = options || {},
                _o = {};
            for (var k in _partAmount) {
                _o = $.extend(source, _this.findSource(k), _partAmount[k], true);
                _o.itemID = _o.itemId;
                partArr.push(this.sourceFilter(_o));
            }

            return partArr;
        },

        sourceFilter: function (data) {

            var filterArr = [
                "sku",
                "orderID",
                "refundMoney",
                "refundType",
                "sellerID",
                "itemID",
                "title",
                "freight"
            ];

            var _o = {};
            for (var i = 0; i < filterArr.length; i++) {
                _o[filterArr[i]] = data[filterArr[i]];
            }

            return _o;
        }
    }, CFI.R);

    function Rview() {

        var self = this;
        this.init = function (elem, tmpl) {

            //定义控制器下view所需要对象
            this.R.rConstor.view = {
                elem: elem,
                tpl: self.locationPath + self.T[tmpl]
            };

            var requestListConfig = {
                "xbnOrderId": self.R.rParms.id
            };

            var rData = new Rdata();

            this.request("rLists", requestListConfig, this.R.rParms.pl).then(function (D) {

                //计算运费补偿  运费补偿=总运费*2+10
                var freight = 0;
                for(var i=0;i< D.data.order.items.length;i++){
                    var item = D.data.order.items[i];
                    freight += Number(item.freight*100);
                }
                D.data.order.totalFreight=freight/100;
                $.extend(D.data.order,{"sourcevalue": freight/100*2+10});
                //本地缓存数据（根据sku）
                rData.inSource("sku", D.data.order.items);

                //内部嵌套状态请求
                self.request("rTypeState", {
                    //orderID: "eby150929100284"
                    orderID: self.R.rParms.id
                }).then(function (CD) {

                    if (CD.data) {
                        D.data.order.returnType = CD.data.returnType;
                        D.data.order.returnStatus = CD.data.returnStatus;
                    } else {
                        D.data.order.returnType = null;
                        D.data.order.returnStatus = null;
                    }

                    self.display(D.data.order).then(function (D) {
                        self.pageBusiness.call($.extend({}, self, rData), D);
                    });

                });

            });
        };

        this.runCreate = function () {
            //初始化退换货理由组件
            comInSelebox.init();

            //初始化买家意见组件
            comTextareaBox.init();

            //运费补偿组件
            comCompensation.init();

            //建议处理方案
            comRadiobox.init();
            comRadiobox.exec("3");
        };
        this.runEditor = function () {

            self.request("editorDetaile", {
                returnID: barParames.rid
            }).then(function (D) {

                editorSource = D.data;
                //初始化买家意见组件
                comTextareaBox.init(editorSource.content);

                //运费补偿组件
                comCompensation.init("" + editorSource.freightCompensation + "");

                //建议处理方案
                comRadiobox.init();
                comRadiobox.exec(editorSource.returnType);

            });

        };
    }

    //原型扩展【Rview函数】
    Rview.prototype = $.extend({

        //渲染界面
        display: function (data, onCallback) {

            var _this = this,
                _onCallback = onCallback || function (d) {
                    return d || [];
                };
            var renderThen = this.R.rConstor.render(_onCallback(data));

            return {
                then: function (fn) {
                    renderThen.then(function () {
                        fn.call(_this, data);
                    });
                }
            };

        },

        request: function (uName, pms, link) {

            var _this = this,
                _link = link || "";
            var thenFn = this.R.rConstor.request({
                url: this.locationApiPath + this.U[uName] + _link,
                data: JSON.stringify(pms || {})
            });

            return {
                then: function (fn) {
                    thenFn.then(function (D) {
                        if (D.statusCode === "2000000") {
                            fn(D);
                        } else {
                            //goto 数据返回错误的提示
                        }
                    });
                }
            };
        },

        /**
         * [[清理本地存储数据]]
         * @param {String} name [[如果参数为空将全部删除本地数据，否则根据参数单条删除数据]]
         */
        removePageMaps: function (name) {

            if (!this.pageMap) {
                return;
            }
            if (!name) {
                this.pageMap = {};
            } else {
                delete this.pageMap[name];
            }
        },

        showDialogbox: function (msg, fn) {

            var _fn = fn || function () {};
            $.layer({
                title: '提示信息',
                area: ['450px', 'auto'],
                dialog: {
                    btns: 1,
                    btn: ['确认'],
                    type: 8,
                    msg: '<div class="tips">' + msg + '</div>'
                },
                yes: function (index) {
                    _fn(index);
                    layer.close(index);
                }
            });
        }

    }, CFI);

    var rView = new Rview();

    try {

        var user = JSON.parse(localStorage.User);
        var barParames = rView.R.rItem.utils.getRequest();

        rView.init("#id_conts", "mainTmpl");
        rView.saveSource = {};
    } catch (e) {
        console.log(e);
    }

    rView.save = function () {

        var _this = this;
        var _op = barParames.op || "createForms";

        //退换货理由取值
        var goodsReason = comInSelebox.getValue(),
            amount = this.getTotalAmount();

        var $hiddenBox = $("input[type=hidden]"),
            $textArea = $("#textareaEdit"),
            $freightCompensation = $(".freightCompensation");
        //创建所需要的参数
        rView.saveSource.message = goodsReason.name || (!editorSource ? "" : editorSource.message);
        rView.saveSource.returnType = returnType;
        rView.saveSource.content = comTextareaBox.getValue();
        rView.saveSource.refundMoney = amount.allAmount;
        rView.saveSource.freightCompensation = amount.comAmount;
        rView.saveSource.fileStatus = comUpImages.fileStatus;
        if (returnType == 5){
            rView.saveSource.action = "02";
        } else {
            rView.saveSource.action = "01";
        }
        rView.saveSource.returnID = barParames.rid;


        //部分退款数据(退款总额不为0的情况下，添加子列表数据)
        delete rView.saveSource.moneyItems;
        if (returnType === "4" && amount.allAmount) {
            rView.saveSource.moneyItems = this.getPartAmount({
                orderID: rView.R.rParms.id,
                sellerID: this.locSource.sellerId,
                refundType: "0"
            });
        }

        if (returnType === "4" && !amount.allAmount) {
            this.showDialogbox(checkInput.message.returnAmountEmpty);
        } else if ($hiddenBox.length && !checkInput.empty($hiddenBox.val())) {
            this.showDialogbox(checkInput.message.thisAmountRefund);
        } else if (!checkInput.empty($textArea.val())) {
            this.showDialogbox(checkInput.message.thisAmountRefund);
        } else if (returnType === "2" && $freightCompensation.blur() && !$freightCompensation.data("check")) {
            //占位，错误提示采用非弹窗方式了。
        } else {
            this.request(_op, rView.saveSource).then(function (D) {

                if (D.statusCode === "2000000") {
                    comUpImages.updateRelationShip(D.data);
                    _this.showDialogbox(checkInput.message.create, function () {
                        window.location.href = CEEATE_SUCCESS_TO_URL;
                    });
                } else {
                    _this.showDialogbox(checkInput.message.createError);
                }
            });
        }

    };

    //业务处理【交互，数据解析，渲染】
    rView.pageBusiness = function (D) {

        var that = this;
        rView.saveSource.buyer = D.buyerName;
        rView.saveSource.seller = D.sellerId;
        rView.saveSource.site = D.site;
        rView.saveSource.platform = D.orderPlatform;
        rView.saveSource.currencySymbol = D.currencySymbol;
        rView.saveSource.admin = user.uname;
        rView.saveSource.operator = user.uname;
        rView.saveSource.orderID = rView.R.rParms.id;

        this.locSource = D;

        //加载部分退款（弹出窗口）数据
        that.request("rDetaile", {
            orderId: that.rParms.id
        }).then(function (D) {
            _rDetaileDatas = D.data;
            that.rConstor.renderIn("#reundMoney_tmpl", "#reundMoney_cont", {
                source: _rDetaileDatas
            });
        });

        //部分退款（弹出窗口）
        $("#okMeny").click(function () {

            var $elem = null;
            $.layer({
                title: '部分退款',
                area: ['1050px', 'auto'],
                dialog: {
                    btns: 2,
                    btn: ['确认', '取消'],
                    type: 8,
                    msg: $("#reundMoney_cont").html()
                },
                success: function (elem) {

                    $elem = $(elem);

                    var $moneyTotal = $elem.find("#moneyTotal"),
                        $inSetInputText = $elem.find("[data-sourcevalue]");

                    //初始化部分退款控件
                    comReturnGoods.init(function () {
                        this.data = _rDetaileDatas.list;
                        this.currencySymbol = D.currencySymbol;
                        this.elem = $elem;
                        this.inSetInputText = $inSetInputText;
                        $moneyTotal.html(this.moneSumHtml());
                    });

                    $inSetInputText.blur(function () {

                        var _this = $(this),
                            value = $.trim(_this.val());

                        var $errorTip = _this.next(),
                            $allTotal = $elem.find("#allTotal"),
                            $errorNodes = $elem.find(".errorTips"),
                            $dataMaxValue = _this.data("amount");
                        checkInput.hide($errorTip);
                        checkInput.check(_this, {
                            empty: [value],
                            numberFormat: [value],
                            numberDiff: [$dataMaxValue, value],
                            success: [$errorNodes, function () {
                                $allTotal.html(comReturnGoods.moneyInsetSum());
                            }]
                        });
                    });

                },
                yes: function (index) {

                    $elem.find("[data-sourcevalue]").blur();
                    var $errorNodes = $elem.find(".errorTips");
                    if (checkInput.space($errorNodes)) {
                        $("input[type=radio]:checked").closest("dd").find(".anoutMoney").html(comReturnGoods.moneyInsetSum());
                        _partAmount = comReturnGoods.moneGetValue();
                        layer.close(index);
                    }

                }
            });
        });

        //图片上传
        comUpImages.init();
        //显示列表图片
        comUpImages.showImages();
        (barParames.op ? this.runEditor : this.runCreate)();

        //创建退货申请单
        $("#setSubmit").click(function () {
            that.save();
        });
    };

})(mXbn);
