;
(function (X) {


    //模板基础路径
    var rootPathTmpl = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;

    //API基础路径
    var rootPathApi = X.configer.__API_PATH__;

    //模板文件与接口路径
    var rootFilePath = {

        tmpl: "/order/168.html",
        uri: {

            //退换货列表API
            lists: "/order/return/list"
        }
    };

    var orderItem = X(),
        orderConstor = orderItem.ctrl();

    var commonItem = orderItem._mI["common"];

    var renderView,
        queryState = true,
        orderPage = {
            init: function () {
                var $_queryButton = $("#queryButton"),
                    $_dateStart = $("#dateStart"),
                    $_dateOver = $("#dateOver");
                var _this = this;
                this.initConstor();
                this.bind("click", $_queryButton, "getQuery");
                $(".timeStart").on("click",function(){
                    laydate({
                        istime: true,
                        elem : '#dateStart',
                        event : 'focus',
                        format: 'YYYY-MM-DD hh:mm:ss',
                        choose: function (dates) {
                            $_dateStart.attr("index-data", dates);
                        },
                        empty: function () {
                            $_dateStart.attr("index-data", "");
                        }
                    });
                });
                $(".timeEnd").on("click",function(){
                    laydate({
                        istime: true,
                        elem : '#dateOver',
                        event : 'focus',
                        format: 'YYYY-MM-DD hh:mm:ss',
                        choose: function (dates) {
                            $_dateOver.attr("index-data", dates);
                        },
                        empty: function () {
                            $_dateOver.attr("index-data", "");
                        }
                    });
                });
                sele();
            },

            bind: function (eType, elem, hander, options) {

                elem.on(eType, function () {
                    orderConstor.tirgger(hander, options);
                });
            },

            //控制器对象中的事件集合，【事件消息模式】
            initConstor: function () {

                //搜索按钮事件句柄
                orderConstor.on("getQuery", this.getQuery);

                //日期控件事件句柄
                orderConstor.on("selectDate", this.selectDate);
            },

            //搜索按钮相应函数 可以传递参数
            getQuery: function () {

                //搜索间隔 延迟1m
                orderItem.utils.countDown(1, 1, function () {
                    queryState = true;
                });

                if (queryState) {
                    commonItem.renderLists(orderConstor, {
                        url: rootPathApi + rootFilePath.uri.lists,
                        data: commonItem.formValueCrawler("#searchForm", "index-data",false)
                    }, 1);
                }
                queryState = false;
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            }
        };

    //定义订单列表模块视图对象
    orderConstor.view = {

        "elem": "#id_conts",
        "tpl": rootPathTmpl + rootFilePath.tmpl,

        //局部模版ID
        "tmpl": "#listsTmpl",

        //局部模板写入ID
        "cont": "#lists",

        'getTotal': "#searchTotalCount"
    };

    //全局渲染视图
    renderView = orderConstor.render();

    //全局渲染视图回掉函数
    renderView.then(function () {

        commonItem.renderLists(orderConstor, {
            url: rootPathApi + rootFilePath.uri.lists,
            data:{}
        });

        //页面入口开始
        orderPage.init();

    });


})(mXbn);