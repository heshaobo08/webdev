;
(function (X) {

    var rootPathTmpl = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__,
        rootPathApi = X.configer.__API_PATH__;

    var interFace = {
        tpl: "/order/164.html",
        uri: {
            lists: "/order/list",
            siteList: "/config/site/list",
            siteAll:'/config/site/all'
        }
    };

    var orderItem = X(),
        orderConstor = orderItem.ctrl();

      var commonItem = orderItem._mI["common"];


    //定义订单列表模块视图对象
    orderConstor.view = {
        elem: "#id_conts",
        tpl: rootPathTmpl + interFace.tpl,
        tmpl: "#listsTmpl",
        cont: "#lists",
        getTotal:"#searchTotalCount"
    };

    //渲染主界面只有静态模板不包含数据项
    var renderView = orderConstor.render();

    //渲染主界面后的回掉函数
    renderView.then(function () {
        orderConstor.request({
            url:rootPathApi + interFace.uri.siteAll,
            type:'get'
        }).then(function(D){
            if (D.statusCode == "2000000") {
                orderConstor.allSitelist={};
                $.each(D.data,function(i,site){
                    //http://cgi.ebay.ca/ws/eBayISAPI.dll?ViewItem&item=
                    site.commodityPrefixUrl = site.commodityPrefixUrl?site.commodityPrefixUrl.split('${itemId}')[0]:'';
                    orderConstor.allSitelist[site.id]=site;
                });
                commonItem.renderLists(orderConstor, {
                    url: rootPathApi + interFace.uri.lists,
                    data: {}
                });

                //初始化页面 对页面元素操作实例化
                orderConstor.tirgger("init");

                //初始化选择平台与站点联动
                $("#platformSite").on("click", "li", function () {
                    var _this = $(this),
                        siteHtml = '<li index-data=""><span>请选择</span></li>',
                        platform_code = _this.attr("index-data");

                    if (platform_code != "") {
                        orderConstor.request({
                            url: rootPathApi + interFace.uri.siteList,
                            data: JSON.stringify({
                                "platformCode": platform_code
                            })
                        }).then(function (D) {

                            if (D.statusCode == "2000000") {
                                $.each(D.data, function (i, item) {
                                    siteHtml += '<li index-data="' + item.id + '"><span>' + item.cnName + '</span></li>';
                                });
                                $("#siteRoom").html(siteHtml);
                                sele($("#selectSite"));
                            }
                        });
                    } else {
                        $("#siteRoom").html(siteHtml);
                        sele($("#selectSite"));
                    }

                });
            }
        });

    });


    orderConstor.on("init", function () {

        var elems = $(orderConstor.view.elem),
            searchDelay = true;

        //自定义select初始化
        sele();

        //搜索按钮
        $("#submitButton").off().click(function () {

           //搜索间隔 延迟
            orderItem.utils.countDown(1, 1, function () {
                searchDelay = true;
            });

            debugger;
            if (searchDelay) {
                commonItem.renderLists(orderConstor, {
                    url: rootPathApi + interFace.uri.lists,
                    data: commonItem.formValueCrawler("#searchForm", "index-data")
                });
            }

            searchDelay = false;
            //显示搜索结果
            $('#searchTotalCount').closest('.addbutton').removeClass('none');

        });
        $(".timeStart").on("click",function(){
            laydate({
                istime: true,
                elem : '#dateStart',
                event : 'focus',
                format: 'YYYY-MM-DD hh:mm:ss',
                choose: function (dates) {
                    $('#dateStart').attr("index-data", dates);
                },
                empty: function () {
                    $('#dateStart').attr("index-data", "");
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
                    $('#dateOver').attr("index-data", dates);
                },
                empty: function () {
                    $('#dateOver').attr("index-data", "");
                }
            });
        });
        //开始日期
        /*$("#dateStart").click(function () {
            dateComponent("#dateStart");
        });

        //结束日期
        $("#dateOver").click(function () {
            dateComponent("#dateOver");
        });

        function dateComponent(el, callback) {
            laydate({
                istime: true,
                elem: el,
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss',
                choose: function (dates) {
                    $(this.elem).attr("index-data", dates);
                    (callback && callback(dates));
                },
                empty: function () {
                    $(el).attr("index-data", "");
                }
            });
        };*/

    });

})(mXbn);
