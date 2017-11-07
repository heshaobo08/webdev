;
(function (X) {
    var wraeGoods = X(),
        goodsCtrl = wraeGoods.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = wraeGoods.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var perPage = 10;//列表每页显示10条记录

    //防止从详情退回时，面包屑导航文字错误
    document.title='海外仓业务管理-货品管理';

    goodsCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };

    //页面初次加载
    goodsCtrl.request({
        url: dataPath + X.configer[request.m].api.list,
        type: "post",
        data: JSON.stringify({
            limit: perPage,
            cpage: request.page || 1
        })
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            data.data.operateData = operateData;
            goodsCtrl.render(data.data).then(function () {
                //下拉框
                sele();
                //模板局部渲染
                goodsCtrl.tirgger("listRender", data.data);
                // 表单校验加载
                goodsCtrl.tirgger("searchFormValid");
                // 分页渲染
                goodsCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                goodsCtrl.tirgger('pageRender', data.data);
                // 导出货品
                goodsCtrl.tirgger('export');
                // 打印条码
                goodsCtrl.tirgger('print');

            });
        } else {
            $("#listCon").html("<tr><td colspan='4' style='text-align:center'>" + X.getErrorName(data.statusCode, 'wareErr') + "</td></tr>");
        }
    });
    //模板局部渲染
    goodsCtrl.on('listRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        goodsCtrl.renderIn('#listTmpl', '#listCon', data);
        //触发页面dom事件
        goodsCtrl.tirgger('domEvents', "#id_conts");
        //调用全选功能
        checkeBox("r-box");
    });

    goodsCtrl.on('domEvents', function (ele) {
        //搜索提交
        $('.js-search').off().on('click', function () {
            $("#searchForm").submit();
        });
    });

    //表单验证
    goodsCtrl.on('searchFormValid', function () {
        // 表单验证
        $('#searchForm').html5Validate(function () {
            goodsCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发
                goodsCtrl.tirgger('listRender', data);
                // 分页渲染
                goodsCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                goodsCtrl.tirgger('pageRender', data);
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            });
        });
    });

    //导出货品
    goodsCtrl.on('export', function () {
        $('.js-export').off().on('click', function () {
            var checkBox = $("[type=checkbox]:checked").not("[name=all]");
            var len = checkBox.length;
            if(len == 0){
                $(".js-exportGoods").find("[type=hidden]").remove();
                goodsCtrl.tirgger('setTips','是否导出全部货品？',function(){
                    layer.close(layer.index);
                    $(".js-exportGoods").find("[type=submit]").click();
                },2);
            }else{
                 goodsCtrl.tirgger('setTips','是否导出选中货品？',function(){
                    layer.close(layer.index);
                    $(".js-exportGoods").find("[type=text]").remove();
                    checkBox.each(function(){
                        var that = $(this);
                        var id = that.closest("tr").attr("data-id");
                        $(".js-exportGoods").append('<input type="hidden" name="id" value="'+id+'" />')
                    });
                    $(".js-exportGoods").find("[type=submit]").click();
                },2);
            }
        });
    });

    //打印条码
    goodsCtrl.on('print', function () {
        $('.js-print').off().on('click', function () {
            var checkBox = $("[type=checkbox]:checked").not("[name=all]");
            var len = checkBox.length;
            if(len == 0){
                goodsCtrl.tirgger('setTips','请选择货品！',function(){
                    layer.close(layer.index);
                },1);
                return false;
            }else{
                var ids = [];
                checkBox.each(function(){
                    var that = $(this);
                    var id = that.closest("tr").attr("data-id");
                    ids.push(id);
                });
                //goodsCtrl.tirgger('setTips','打印已选货品条码？',function(){
                    localStorage.setItem("ids","");
                    localStorage.setItem("ids",ids);
                    //window.location.href="?m=xhr_id_20100000_20105000_print";
                    layer.close(layer.index);
                //},2);
            }
        });
    });

    // 分页加载
    goodsCtrl.on('pageRender', function (data) {
        var cPageNo = request.page,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            goodsCtrl.tirgger('searchSubmit', p, function (data) {
                wraeGoods.router.setHistory("?m=" + request.m + "&page=" + p);
                goodsCtrl.tirgger("listRender", data);
                $("[name=all]").prop("checked",false);
                cPageNo = p;
            });
        });
    });

     // 列表搜索提交
    goodsCtrl.on('searchSubmit', function (toPageNo, callback) {
        var form = $('#searchForm');
        var sendData = {
            cpage: toPageNo,
            limit: perPage,
            userName: $('input[name=userName]', form).val(),
            inventoryCode: $('input[name=inventoryCode]', form).val(),
            merchantSku: $('input[name=merchantSku]', form).val(),
            title: $('input[name=title]', form).val(),
            specsModel: $('input[name=specsModel]', form).val(),
            source: $('input[name=source]', form).attr("index-data")
        };
        goodsCtrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: "post",
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                callback && callback(data.data);
            } else {
                goodsCtrl.tirgger('setTips', X.getErrorName(data.statusCode, 'wareErr'));
            }
        });
    });

    // 提示消息弹框方法定义
    goodsCtrl.on('setTips',function(msg,callback,n){
        if(!msg) return;
        var arr = [];
        if(n==2){
            arr =  ['确认','返回'];
        }else{
            arr =  ['确认'];
        }
        $.layer({
            title:'提示消息',
            area: ['500px', '200px'],
            dialog:{
                btns: n || 1,
                btn:arr,
                type:8,
                msg:'<div class="tips mB20"><em>'+msg+'</em></div>',
                yes:function(index){
                    layer.close(index);
                    // 回调
                    callback && callback();
                }
            }
        })
    });


})(mXbn);
