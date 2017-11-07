;
(function (X) {
    var inventory = X(),
        inventoryCtrl = inventory.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = inventory.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var perPage = 10;//列表每页显示10条记录

    //防止面包屑导航文字不对
    document.title='海外仓财务管理-库存管理';

    inventoryCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };

    var storeList = [];
    //页面初次加载
    inventoryCtrl.request({
        url: dataPath + X.configer[request.m].api.list,
        type: "post",
        data: JSON.stringify({
            limit: perPage,
            cpage: request.page || 1,
            "orders": [
                {
                    "field": "inventoryCode",
                    "order": "desc"
                }
            ]
        })
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            data.data.operateData = operateData;
            //获取所有仓库
            inventoryCtrl.request({
                url: dataPath + X.configer[request.m].api.storeList,
                type: "get"
            }).then(function (storeData) {
                if (storeData.statusCode == '2000000') {
                    //获取到仓库数据不为空
                    if (storeData.data.length) {
                        for (var i = 0; i < storeData.data.length; i++) {
                            storeList.push({
                                storeName: storeData.data[i].storeName,
                                storeCode: storeData.data[i].storeCode
                            })
                        }
                    }
                    data.data.stores = storeList;
                    inventoryCtrl.render(data.data).then(function () {
                        //下拉框
                        sele();
                        //模板局部渲染
                        inventoryCtrl.tirgger("inventoryRender", data.data);
                        //表单校验加载
                        inventoryCtrl.tirgger("searchFormValid");
                        // 分页渲染
                        inventoryCtrl.renderIn('#pageListTmpl', '.page', data);
                        // 分页加载
                        inventoryCtrl.tirgger('pageRender', data.data);
                    });
                } else {
                    inventoryCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        } else {
            $("#listCon").html("<tr><td colspan='11' style='text-align:center'>" + X.getErrorName(data.statusCode, 'wareErr') + "</td></tr>");
        }
    });

    //模板局部渲染
    inventoryCtrl.on('inventoryRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        //数据列表渲染
        inventoryCtrl.renderIn('#listTmpl', '#listCon', data);
        //触发页面dom事件
        inventoryCtrl.tirgger('domEvents', "#id_conts");
    });

    inventoryCtrl.on('domEvents', function (ele) {
        //搜索提交
        $('.js-search').off().on('click', function () {
            request.page = 1;
            /*//查看仓库容量的地址赋值
            if($('input[name=storeCode]').attr('index-data')){
                $('.js-view').data('href','?m=xhr_id_20100000_20103000_view&wareHouse='+$('input[name=storeCode]').attr('index-data'));
                $('.addbutton').removeClass('none');
                localStorage.setItem('inventoryStoreName',$('input[name=storeCode]').val());
            }else{
                $('.js-view').data('href','');
                $('.addbutton').addClass('none');
            }*/
            $('#searchForm').submit();
        });

        $('#selectStore li').on("click",function(){
            setTimeout(function(){
                var index = $('input[name=storeCode]').attr("index-data");
                if(index){
                    $('.addbutton').removeClass('none');
                    $('.js-view').attr('data-href','?m=xhr_id_20100000_20103000_view&wareHouse='+index);
                }else{
                    $('.js-view').attr('data-href','');
                    $('.addbutton').addClass('none');
                }
            },100)
        })

    });

    //表单验证
    inventoryCtrl.on('searchFormValid', function () {
        //表单验证
        $('#searchForm').html5Validate(function () {
            inventoryCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发
                inventoryCtrl.tirgger('inventoryRender', data);
                // 分页渲染
                inventoryCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                inventoryCtrl.tirgger('pageRender', data);
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            });
        });
    });

    // 分页加载
    inventoryCtrl.on('pageRender', function (data) {
        var cPageNo = request.page,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            inventoryCtrl.tirgger('searchSubmit', p, function (data) {
                inventory.router.setHistory("?m=" + request.m + "&page=" + p);
                inventoryCtrl.tirgger("inventoryRender", data);
                cPageNo = p;
            });
        });
    });

    //列表搜索提交
    inventoryCtrl.on('searchSubmit', function (toPageNo, callback) {
        var form = $('#searchForm');
        var sendData = {
            cpage: toPageNo,
            limit: perPage,
            storeCode: $('input[name=storeCode]', form).attr('index-data'),//仓库
            inventoryCode: $('input[name=inventoryCode]', form).val(),//库存编码
            userName: $('input[name=userName]', form).val(),//货主
            merchantSku: $('input[name=merchantSku]', form).val(),//商家SKU
            title: $('input[name=title]', form).val(),//货品名称
            specsModel: $('input[name=specsModel]', form).val(),//规格型号
            "orders": [
                {
                    "field": "inventoryCode",
                    "order": "desc"
                }
            ],
            searchParamList: []
        };

        //获取数量区间
        $("input[name$='Num-start'],input[name$='Num-end']", form).each(function () {
            if ($(this).val().length) {
                var arr = $(this).attr('name').split('-');
                sendData.searchParamList.push({
                    key: arr[0],
                    operator: arr[1] == 'start' ? 'ge' : 'le',
                    value: parseInt($(this).val())
                });
            }
        });

        inventoryCtrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: "post",
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                data.data.stores = storeList;
                callback && callback(data.data);
            } else {
                inventoryCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
            }
        });
    });

    // 提示消息弹框方法定义 ,只有确定按钮
    inventoryCtrl.on('setTipsCommit', function (msg, callback) {
        if (!msg) return;
        $.layer({
            title: '提示消息',
            area: ['500px', ''],
            dialog: {
                msg: '<div class="tips">' + msg + '</div>',
                yes: function (index) {
                    layer.close(index);
                    callback && callback();
                }
            }
        })
    });

    // 提示消息弹框方法定义,有确定和取消按钮
    inventoryCtrl.on('setTipsAsk', function (msg, callback) {
        if (!msg) return;
        $.layer({
            title: '提示消息',
            area: ['500px', ''],
            dialog: {
                btns: 2,
                btn: ['确定', '取消'],
                type: 8,
                msg: '<div class="tips">' + msg + '</div>',
                yes: function (index) {
                    layer.close(index);
                    callback && callback();
                },
                no: function (index) {
                    layer.close(index);
                }
            }
        })
    });
})(mXbn);
