;
(function (X) {
    var logisticsPlan = X(),
        logisticsPlanCtrl = logisticsPlan.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = logisticsPlan.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var perPage = 10;//列表每页显示10条记录

    logisticsPlanCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };
    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓业务管理-物流计划管理';
    var layerUp;
    var storeList = [];
    //页面初次加载
    logisticsPlanCtrl.request({
        url: dataPath + X.configer[request.m].api.list,
        type: "post",
        data: JSON.stringify({
            limit: perPage,
            cpage: request.page || 1
        })
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            data.data.operateData = operateData;
            //获取所有仓库
            logisticsPlanCtrl.request({
                url: dataPath + X.configer[request.m].api.storeList,
                type: "get"
            }).then(function (storeData) {
                if (storeData.statusCode == '2000000') {
                    //获取到仓库数据不为空
                    if (storeData.data.length) {
                        for (var i = 0; i < storeData.data.length; i++) {
                            storeList.push({id: storeData.data[i].id, storeName: storeData.data[i].storeName,storeCode: storeData.data[i].storeCode})
                        }
                    }
                    data.data.stores = storeList;
                    logisticsPlanCtrl.render(data.data).then(function () {
                        //下拉框
                        sele();
                        //模板局部渲染
                        logisticsPlanCtrl.tirgger("logisticsRender", data.data);
                        // 表单校验加载
                        logisticsPlanCtrl.tirgger("searchFormValid");
                        // 分页渲染
                        logisticsPlanCtrl.renderIn('#pageListTmpl', '.page', data);
                        // 分页加载
                        logisticsPlanCtrl.tirgger('pageRender', data.data);
                        //加载文件上传控件
                        $.getScript("js/plug/ajaxfileupload.js", function(){

                        });
                    });
                } else {
                    logisticsPlanCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        } else {
            $("#listCon").html("<tr><td colspan='7' style='text-align:center'>" + X.getErrorName(data.statusCode, 'wareErr') + "</td></tr>");
        }
    });

    //模板局部渲染
    logisticsPlanCtrl.on('logisticsRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        logisticsPlanCtrl.renderIn('#listTmpl', '#listCon', data);
        //调用全选功能
        checkeBox("r-box");
        //去掉全选的选中状态
        $('input:checkbox[name=all0]').prop('checked', false);
        //触发页面dom事件
        logisticsPlanCtrl.tirgger('domEvents', "#id_conts");
    });

    logisticsPlanCtrl.on('domEvents', function (ele) {
        //搜索提交
        $('.js-search').off().on('click', function () {
            request.page = 1;
            $('#searchForm').submit();
        });
        //批量删除
        $('.js-batchDelete').off().on('click', function () {
            var idArray = [];
            $("[name=accountId]:checked").each(function (index, element) {
                idArray.push($(element).data("id"));
            });
            if (!idArray.length) {
                logisticsPlanCtrl.tirgger('setTipsCommit', '选择物流计划。');
                return;
            }
            logisticsPlanCtrl.tirgger('doDelete', idArray);
        });
        //单个删除
        $('.js-delete').off().on('click', function () {
            logisticsPlanCtrl.tirgger('doDelete', [$(this).data('id')],'是否删除该物流计划？');
        });
        //选择时间
        logisticsPlanCtrl.tirgger('pickDate');

        $(".js-batchUpload").on("click",function(){
            layerUp=$.layer({
                title: '批量上传',
                area: ['550px', '200px'],
                dialog: {
                    btns: 2,
                    btn: ['本地上传','取消'],
                    type : 8,
                    msg: $('#importTmpl').html(),
                    yes: function(index){
                        logisticsPlanCtrl.tirgger('fileClick','importLogisticsPlanTemplate');
                        $('.xubox_layer').delegate('#importLogisticsPlanTemplate','change',function(){
                            if($(this).val()!=null){
                                $('#fileName em').text($(this).val().split("\\").pop());
                                $('#fileName').removeClass('none');
                                logisticsPlanCtrl.tirgger('ajaxFileUpload',index,$('#fileName em').text());
                            }
                        });
                    },
                    no: function(index){
                        layer.close(index);
                    }
                }
            });
        });
    });

    //模拟点击
    logisticsPlanCtrl.on('fileClick',function(ele){
        var ie = navigator.appName == "Microsoft Internet Explorer" ? true : false;
        if(ie){
            document.getElementById(ele).click();
        }else{
            var mouseobj = document.createEvent("MouseEvents");
            mouseobj.initEvent("click", true, true);
            document.getElementById(ele).dispatchEvent(mouseobj);
        }
    });

    logisticsPlanCtrl.on('ajaxFileUpload',function(index,fileName){
        $.ajaxFileUpload({
            url: dataPath + X.configer[request.m].api.imports, //用于文件上传的服务器端请求地址
            secureuri: false,
            type:'post',
            fileElementId: 'importLogisticsPlanTemplate',
            dataType: 'json',
            success: function (data){
                if (data.statusCode == '2000000') {
                    //关闭导入模板文件对话框
                    layer.close(index);
                    logisticsPlanCtrl.tirgger('setTipsCommit', '上传成功！'+fileName,function(){
                        logisticsPlan.router.runCallback();
                    });
                } else {
                    /*if(data.errorData.length == 0){
                        var errText = X.getErrorName(data.statusCode, 'wareErr');
                    }else{
                        var errText = data.errorData;
                    }*/
                    //var errText = X.getErrorName(data.statusCode,'wareErr') +","+ (data.errorData.message || data.errorData);
                    var errText = data.errorData.message || data.errorData;
                    $('#fileName').addClass('red').html(errText+'！<em>'+fileName+'</em>');
                }
            },
            error: function (data, status, e){
                //服务器响应失败
                $('#fileName').addClass('red').html('物流计划导入失败！<em>'+fileName+'</em>');
            }
        })
    });

    //删除
    logisticsPlanCtrl.on('doDelete', function (ids,text) {
        var text = text ? text : '是否删除已选中的物流计划？';
        logisticsPlanCtrl.tirgger('setTipsAsk', text, function () {
            logisticsPlanCtrl.request({
                url: dataPath + X.configer[request.m].api.delete,
                type: "post",
                data: JSON.stringify({
                    ids: ids
                })
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    logisticsPlanCtrl.tirgger('setTipsCommit', '删除成功！',function(){
                        //logisticsPlan.router.setHistory('?m=xhr_id_20100000_20104000');
                        logisticsPlan.router.runCallback();
                    });
                } else {
                    logisticsPlanCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        });
    });

    //表单验证
    logisticsPlanCtrl.on('searchFormValid', function () {
        // 表单验证
        $('#searchForm').html5Validate(function () {
            logisticsPlanCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发
                logisticsPlanCtrl.tirgger('logisticsRender', data);
                // 分页渲染
                logisticsPlanCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                logisticsPlanCtrl.tirgger('pageRender', data);
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            });
        },{
            validate: function() {
                // 开始时间和结束时间的校验
                if($('#sendTimeLimit-start').text() && $('#sendTimeLimit-end').text()==''){
                    $('#sendTimeLimit-end').testRemind("请选择截至下单结束时间");
                    return false;
                }else if($('#sendTimeLimit-start').text()=='' && $('#sendTimeLimit-end').text() ){
                    $('#sendTimeLimit-start').testRemind("请选择截至下单开始时间");
                    return false;
                }else if($('#sendTimeLimit-start').text()>$('#sendTimeLimit-end').text()){
                    $('#sendTimeLimit-start').testRemind("开始时间不能大于结束时间");
                    return false;
                }
                if($('#receiveTimeLimit-start').text() && $('#receiveTimeLimit-end').text()==''){
                    $('#receiveTimeLimit-end').testRemind("请选择截至收货结束时间");
                    return false;
                }else if($('#receiveTimeLimit-start').text()=='' && $('#receiveTimeLimit-end').text() ){
                    $('#receiveTimeLimit-start').testRemind("请选择截至收货开始时间");
                    return false;
                }else if($('#receiveTimeLimit-start').text()>$('#receiveTimeLimit-end').text()){
                    $('#receiveTimeLimit-start').testRemind("开始时间不能大于结束时间");
                    return false;
                }
                if($('#expectedArrivalDate-start').text() && $('#expectedArrivalDate-end').text()==''){
                    $('#expectedArrivalDate-end').testRemind("请选择预计到货日期");
                    return false;
                }else if($('#expectedArrivalDate-start').text()=='' && $('#expectedArrivalDate-end').text() ){
                    $('#expectedArrivalDate-start').testRemind("请选择预计到货日期");
                    return false;
                }else if($('#expectedArrivalDate-start').text()>$('#expectedArrivalDate-end').text()){
                    $('#expectedArrivalDate-start').testRemind("开始日期不能大于结束日期");
                    return false;
                }
                return true;
            }
        });
    });

    // 分页加载
    logisticsPlanCtrl.on('pageRender', function (data) {
        var cPageNo = request.page,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            logisticsPlanCtrl.tirgger('searchSubmit', p, function (data) {
                logisticsPlan.router.setHistory("?m=" + request.m + "&page=" + p);
                logisticsPlanCtrl.tirgger("logisticsRender", data);
                $("[name=all0]").prop("checked",false);
                cPageNo = p;
            });
        });
    });

    // 列表搜索提交
    logisticsPlanCtrl.on('searchSubmit', function (toPageNo, callback) {
        var form = $('#searchForm');
        var sendData = {
            cpage: toPageNo,
            limit: perPage,
            logisticsCode: $('input[name=logisticsCode]', form).val(),//物流编码
            disposalSite: parseInt($('input[name=disposalSite]', form).attr('index-data')),//处理地点
            logisticsType: parseInt($('input[name=logisticsType]', form).attr('index-data')),//物流方式
            destinationStoreCode: $('input[name=destinationStoreCode]', form).attr('index-data'),//目的仓库
            startStation: $('input[name=startStation]', form).val(),//始发站
            lastStation: $('input[name=lastStation]', form).val(),//终点站
            searchParamList: []
        };
        $('.dateInput').each(function(){
            if($(this).text().length){
              sendData.searchParamList.push({
                  key: $(this).data('key'),
                  operator: $(this).data('operator'),
                  value: $(this).text()
              });
            }
        });

        logisticsPlanCtrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: "post",
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                data.data.stores = storeList;
                callback && callback(data.data);
            } else {
                logisticsPlanCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
            }
        });
    });

    // 提示消息弹框方法定义 ,只有确定按钮
    logisticsPlanCtrl.on('setTipsCommit', function (msg, callback) {
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
    logisticsPlanCtrl.on('setTipsAsk', function (msg, callback) {
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

    //获取时间
    logisticsPlanCtrl.on('pickDate', function () {
        $(".timeStart,.timeEnd").on("click", function () {
            var $this = $(this),
                elemId = $this.siblings('.dateInput').attr('id');
            //预计到货日期不需要时分秒
            var isTime=elemId.indexOf('expectedArrivalDate')==-1?true:true;
            laydate({
                istime: isTime,
                elem:'#'+elemId,
                event: 'focus',
                format: isTime?'YYYY-MM-DD hh:mm:ss':'YYYY-MM-DD'
            });
        });
    });
})(mXbn);
