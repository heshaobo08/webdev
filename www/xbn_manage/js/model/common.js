;
(function (X) {

    var showNumber = 10,
        _pager = "#pager";

    var commonItem = X(),
        utils = commonItem.utils,
        $_pager;


    /************************
     @ 策略模式匹配后台接口（分页对象），统一配置为前台可用标准
     @ pageNo 当前分页显示页码
     @ pageSize 当前分页显示多少条目
     @ totalCount 当前分页总条目（数据总量）
     @ totalPages 当前分页总页码（数据综合 / 当前分页显示多少条目）
     @ 规则描述：
     @ 该对象下 【键（key）】 对应前台可用标准， 【值（value）】对应后台返回字段，
     @ 并与前台标准 【键（key）】对应
     **/
    var macthPager = {
        pageNo: ["cPageNO", "toPageNo", "currentPageNo"],
        pageSize: ["pageSize"],
        totalCount: ["totalCount"],
        totalPages: ["totalPages"]
    };

    commonItem._mI["common"] = {

        /************************
         @ 请求列表数据并局部渲染 (需要设定局部模板ID 与 局部渲染区域ID 获取并设置所有数据)=>需要在控制器对象 View 中定义
         @ 例如： constor.view = {
         @   tmpl : "#ID",
         @   cont : "#ID",
         @   getTotal:"#ID"
         @ }
         @ constor 控制器对象
         @ parames 后台请求参数集合
         @ return 返回XHR对象
         **/

        localRenderIn: function (constor, parames) {

            var self = this,
                requestXhr = constor.request(parames);

            requestXhr.then(function (D) {
                //返回数据中D.data.page不存在，需要拼凑成所需要的对象
                if (!D.data.page) {
                    D.data.page = {
                        cPageNO: D.data.cPageNO,
                        pageSize: D.data.pageSize,
                        totalCount: D.data.totalCount,
                        totalPages: D.data.totalPages
                    };
                }

                // 设置搜索条数
                if (constor.view.getTotal) {
                    $(constor.view.getTotal).text(D.data.page.totalCount);
                }

                if (D.statusCode == "2000000" && self.detectionType(D.data)) {
                    constor.renderIn(constor.view.tmpl, constor.view.cont, {
                        source: D.data,
                        siteList: constor.allSitelist
                    });
                } else {
                    constor.renderIn("#listsNotTmpl", constor.view.cont, {
                        source: {
                            msg: "暂无数据"
                        }
                    });
                    //控制分页控件（隐藏）
                    //$_pager[0].show = "off";
                    //$_pager.html("");
                }
            });

            $_pager = $(_pager);

            return requestXhr;
        },

        /************************
         @ 分页组件渲染
         @ mID 分页模板顶层ID （确保唯一，应用于多个分页组件初始化）
         @ lID 分页模板列表ID （页码）
         @ pageNo 默认页码
         @ totalNo 总页码数量
         @ constor 控制器对象
         @ callback 回调函数
         **/

        renderPager: function (mID, lID, pageNo, totalNo, callback) {
            //debugger
            var pageItem = Pager({
                topElem: mID,
                elem: lID,
                defaultItem: pageNo,
                totalPages: Math.ceil(totalNo / showNumber)
            });

            pageItem.then(function (p) {
                callback(p);
            });

        },

        /************************
         @ 渲染列表（局部）
         @ constor 控制器对象
         @ parames 原始数据集合（请求方向，通常配合控制器request方法使用）
         **/

        renderLists: function (constor, parames, searchPageTo) {

            var self = this,
                pageTo = utils.getRequest().page || 1,
                pageTo = searchPageTo ? searchPageTo : pageTo;

            var xhr = this.localRenderIn(constor, self.stringifyData(parames, {
                isPage: true,
                pageSize: showNumber,
                pageNO: searchPageTo || pageTo
            }));

            xhr.then(function (D) {
                var _page = {};
                if (D.data.page) {
                    _page = D.data.page
                } else {
                    //返回数据中D.data.page不存在，需要拼凑成所需要的对象
                    _page = {
                        cPageNO: D.data.cPageNO,
                        pageSize: D.data.pageSize,
                        totalCount: D.data.totalCount,
                        totalPages: D.data.totalPages
                    }
                }

                if (D.data && self.detectionType(D.data)) {
                    self.matchingRulePager(D.data, "page", macthPager);
                    self.renderPager("#topPager", _pager, pageTo, _page.totalCount, function (p) {
                        self.localRenderIn(constor, self.stringifyData(parames, {
                            isPage: true,
                            pageSize: showNumber,
                            pageNO: p
                        })).then(function () {
                            self.renderImgs();
                        });
                    });
                    self.renderImgs();
                } else {
                    //没有数据时也要进行分页渲染，与其它模块统一
                    self.renderPager("#topPager", _pager, pageTo, _page.totalCount);
                }
            });

        },

        /************************
         @ JSON数据合并后序列化
         @ parames 原始数据集合（请求方向，通常配合控制器request方法使用）
         @ data 请求参数集合（请求方向，通常配合控制器request方法使用）
         **/
        stringifyData: function (parames, data) {

            if (!parames.data) {
                parames.data = {};
            }

            if (utils.isString(parames.data)) {
                parames.data = JSON.parse(parames.data)
            }

            parames.data = JSON.stringify($.extend(parames.data, data, true));
            return parames;
        },

        /************************
         @ 爬虫【表单取值】
         @ formID 表单域ID
         @ customAttr 表单域内自定义属性，用于获取该值
         **/
        formValueCrawler: function (formID, customAttr, isDelNull) {
            isDelNull = (typeof isDelNull !== 'undefined') ? isDelNull : true;
            var form = $(formID),
                values = decodeURI(form.serialize().replace(/\+/g, "%20"));

            var parmsValues = utils.getRequest(values),
                customValues = {},
                _this;

            if (customAttr) {
                var formCustom = form.find("[" + customAttr + "]");
                for (var i = 0; i < formCustom.length; i++) {
                    _this = $(formCustom[i]);
                    if (!_this.attr("name")) {
                        continue;
                    }
                    customValues[_this.attr("name")] = _this.attr(customAttr);
                }
            }

            //过滤值为空的对象
            var newValue = $.extend(parmsValues, customValues, true);
            if (isDelNull) {
                for (var nv in newValue) {
                    if (newValue[nv] == "")
                        delete newValue[nv];
                }
            }
            return newValue;

        },

        /************************
         @ 选项卡切换
         @ formID 表单域ID
         @ customAttr 表单域内自定义属性，用于获取该值
         **/
        tabsSwitch: function () {
        },

        /************************
         @ 返回类型数据检测 【undefined | null |  空数组 | 符串 | 返回false】
         @ data 请求返回的数据
         **/
        detectionType: function (data) {

            var state = true;
            if (data) {
                if (utils.isString(data)) {
                    state = false;
                } else if (utils.isArray(data) && !data.length) {
                    state = false;
                } else if (utils.isArray(data.list) && !data.list.length) {
                    state = false;
                } else {
                    state = true;
                }
            }
            return state;
        },

        /************************
         @ 匹配分页数据至可用对象
         @ source 原始返回数据 对象类型（data）
         @ keyword 可用分页字段 字符串类型
         @ matchRule keyword 对象填充内容
         **/
        matchingRulePager: function (source, keyword, matchRule) {

            if (!commonItem.utils.isObject(source)) {
                return;
            }

            var _source,
                _parivate = {
                    create: function (source) {

                        var page = {};
                        for (var p in matchRule) {
                            page[p] = this.getKeyword(matchRule[p], source);
                        }
                        return page;
                    },

                    upDate: function () {
                        return this.create(source[keyword]);
                    },

                    getKeyword: function (data, source) {

                        var _value = "";
                        $.each(data, function (i, key) {
                            _value = source[key];
                        });
                        return _value;
                    }
                };

            if (source[keyword]) {
                _source = _parivate.upDate();
            } else {
                _source = _parivate.create(source);
            }

            source[keyword] = _source;
        },

        /************************
         @ 根据页面图片ID获取真实图片URL地址,并回填
         **/
        renderImgs: function () {

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
    };

})(mXbn);
