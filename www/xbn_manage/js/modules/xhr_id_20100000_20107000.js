;
(function (X) {
    var invoice = X(),
        invoiceCtrl = invoice.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = invoice.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));
    var perPage = 10;//列表每页显示10条记录

    invoiceCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };
    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓业务管理-发货单管理';
    var layerUp;
    var storeList = [];
    //页面初次加载
    invoiceCtrl.request({
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
            invoiceCtrl.request({
                url: dataPath + X.configer[request.m].api.storeList,
                type: "get"
            }).then(function (storeData) {
                if (storeData.statusCode == '2000000') {
                    //获取到仓库数据不为空
                    if (storeData.data.length) {
                        for (var i = 0; i < storeData.data.length; i++) {
                            storeList.push({id: storeData.data[i].id, storeName: storeData.data[i].storeName})
                        }
                    }
                    data.data.stores = storeList;
                    invoiceCtrl.render(data.data).then(function () {
                        //下拉框
                        sele();
                        //模板局部渲染
                        invoiceCtrl.tirgger("invoicesRender", data.data);
                        //表单校验加载
                        invoiceCtrl.tirgger("searchFormValid");
                        //分页渲染
                        invoiceCtrl.renderIn('#pageListTmpl', '.page', data);
                        // 分页加载
                        invoiceCtrl.tirgger('pageRender', data.data);
                    });
                } else {
                    invoiceCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        } else {
            $("#listCon").html("<tr><td colspan='7' style='text-align:center'>" + X.getErrorName(data.statusCode, 'wareErr') + "</td></tr>");
        }
    });

    //模板局部渲染
    invoiceCtrl.on('invoicesRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        invoiceCtrl.renderIn('#listTmpl', '#listCon', data);
        //调用全选功能
        checkeBox("r-box");
        //去掉全选的选中状态
        $('input:checkbox[name=all0]').prop('checked', false);
        //触发页面dom事件
        invoiceCtrl.tirgger('domEvents', "#id_conts");
    });

    invoiceCtrl.on('domEvents', function (ele) {
        //搜索提交
        $('.js-search').off().on('click', function () {
            request.page = 1;
            $('#searchForm').submit();
        });

        //选择时间
        invoiceCtrl.tirgger('pickDate');

        //导出发货单
        $('.js-export').off().on('click',function(){
            var checkeds = $('#listCon :checkbox:checked');
            $("#exportForm").find("[type=hidden]").remove();
            if (checkeds.length) {
                invoiceCtrl.tirgger('setTipsAsk', '是否导出选中的发货单？', function () {
                    var ids = "";
                    checkeds.each(function () {
                        var that = $(this);
                        var id = that.closest("tr").attr("data-id");
                        ids += '<input name="id" type="hidden" value="' + id + '">';
                    });
                    $("#exportForm").append(ids);
                    $("#exportForm").find(".export").click();
                });
            } else {
                invoiceCtrl.tirgger('setTipsCommit','请选择发货单！');
            }
        });

        //批量取消发货
        $('.js-batchCancelSend').off().on('click',function(){
            var checkeds = $('#listCon :checkbox:checked');
            if (checkeds.length) {
                var idArray =[];
                for(var i=0;i<checkeds.length;i++){
                    var status = checkeds.eq(i).closest('tr').data('status'),
                        id= checkeds.eq(i).closest('tr').data('id');
                        arr=[1,6,7];

                    if(arr.indexOf(status)!=-1){
                        invoiceCtrl.tirgger('setTipsCommit','处理状态为：新建、已发货、已取消的发货单<br/>无法取消发货。');
                        return;
                    }
                    idArray.push(id);
                }
                invoiceCtrl.tirgger('cancelSend', idArray);
            } else {
                invoiceCtrl.tirgger('setTipsCommit','请选择发货单。');
            }
        });

        //单个取消发货
        $('.js-cancelSend').off().on('click',function(){
            var id=$(this).closest('tr').data('id');
            invoiceCtrl.tirgger('cancelSend', [id],'是否取消该发货单？');
        });

        //修改备注
        $('.js-editRemark').off().on('click',function(){
            var $this = $(this);
            var htmlStr='<form id="editRemarkForm">'+
                '<div class="selectRole" style="padding-left:45px">'+
                    '<dl class="changeDl" style="margin-bottom:0;">'+
                        '<dt>备注信息：</dt>'+
                        '<dd><textarea name="remark" class="textadd" cols="30" rows="3" data-cnmax="250" required>'+$this.data('remark')+'</textarea></dd>'+
                    '</dl>'+
                '</div>'+
            '</form>';
            var invoiceId=$this.closest('tr').data('id');
            $.layer({
                title: '修改备注',
                area: ['550px', '400px'],
                dialog: {
                    btns: 2,
                    btn: ['确认', '取消'],
                    type: 8,
                    msg: htmlStr
                },
                success: function (layero, index) {
                     $('#editRemarkForm').html5Validate(function () {
                         var val = $('textarea[name=remark]').val().replace(/(^\s+)|(\s+$)/g, '');
                         invoiceCtrl.request({
                             url: dataPath + X.configer[request.m].api.remark,
                             type: "POST",
                             data: JSON.stringify({
                                 id: invoiceId,
                                 remark: val
                             })
                         }).then(function (data) {
                             if (data.statusCode == '2000000') {
                                 invoiceCtrl.tirgger('setTipsCommit', '备注信息修改成功！', function () {
                                     $this.data('remark', val);
                                     $this.closest('td').prev().children('.Truncate').text(val);
                                 });
                             } else {
                                 invoiceCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                             }
                         });
                     });
                },
                yes: function () {
                    $('#editRemarkForm').submit();
                },
                no: function () {
                    if ($('#validateRemind').length) $('#validateRemind').remove();
                }
            });
        });
    });

    //取消发货
    invoiceCtrl.on('cancelSend', function (ids,text) {
        var text = text ? text : '是否取消已选中的发货单？';
        invoiceCtrl.tirgger('setTipsAsk', text, function () {
            invoiceCtrl.request({
                url: dataPath + X.configer[request.m].api.cancelSend,
                type: "post",
                data: JSON.stringify({
                    ids: ids
                })
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    invoiceCtrl.tirgger('setTipsCommit', '取消成功！',function(){
                        //invoice.router.setHistory('?m=xhr_id_20100000_20107000');
                        invoice.router.runCallback();
                    });
                } else {
                    invoiceCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        });
    });

    //表单验证
    invoiceCtrl.on('searchFormValid', function () {
        // 表单验证
        $('#searchForm').html5Validate(function () {
            invoiceCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发
                invoiceCtrl.tirgger('invoicesRender', data);
                // 分页渲染
                invoiceCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                invoiceCtrl.tirgger('pageRender', data);
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            });
        },{
            validate: function() {
                // 开始时间和结束时间的校验
                if($('#submitTime-start').text() && $('#submitTime-end').text()==''){
                    $('#submitTime-end').testRemind("请选择处理结束时间");
                    return false;
                }else if($('#submitTime-start').text()=='' && $('#submitTime-end').text() ){
                    $('#submitTime-start').testRemind("请选择处理开始时间");
                    return false;
                }else if($('#submitTime-start').text()>$('#submitTime-end').text()){
                    $('#submitTime-start').testRemind("开始时间不能大于结束时间");
                    return false;
                }
                return true;
            }
        });
    });

    // 分页加载
    invoiceCtrl.on('pageRender', function (data) {
        var cPageNo = request.page,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            invoiceCtrl.tirgger('searchSubmit', p, function (data) {
                invoice.router.setHistory("?m=" + request.m + "&page=" + p);
                invoiceCtrl.tirgger("invoicesRender", data);
                $("[name=all]").prop("checked",false);
                cPageNo = p;
            });
        });
    });

    // 列表搜索提交
    invoiceCtrl.on('searchSubmit', function (toPageNo, callback) {
        var form = $('#searchForm');
        var sendData = {
            cpage: toPageNo,
            limit: perPage,
            userName: $('input[name=userName]', form).val(),//提交人
            source: parseInt($('input[name=source]', form).attr('index-data')),//来源
            invoiceCode: $('input[name=invoiceCode]', form).val(),//发货单号
            orderCode: $('input[name=orderCode]', form).val(),//小笨鸟订单号
            originalCode: $('input[name=originalCode]', form).val(),//原始订单号
            sendStore: $('input[name=sendStore]', form).attr('index-data'),//发货仓库
            status: parseInt($('input[name=status]', form).attr('index-data')),//处理状态
            searchParamList: []
        };
        $('.dateInput').each(function(){
            if($(this).text().length){
                sendData.searchParamList.push({
                    key: $(this).data('key'),
                    operator:$(this).data('operator'),
                    value: $(this).text()
                });
            }
        });
        $('input[name=totalFreight]').each(function(){
             if($(this).val().length){
                sendData.searchParamList.push({
                    key: $(this).data('key'),
                    operator:$(this).data('operator'),
                    value: $(this).val()
                });
            }
        });

        invoiceCtrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: "post",
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                data.data.stores = storeList;
                callback && callback(data.data);
            } else {
                invoiceCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
            }
        });
    });

    // 提示消息弹框方法定义 ,只有确定按钮
    invoiceCtrl.on('setTipsCommit', function (msg, callback) {
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
    invoiceCtrl.on('setTipsAsk', function (msg, callback) {
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
    invoiceCtrl.on('pickDate', function () {
        $(".timeStart,.timeEnd").on("click", function () {
            var $this = $(this),
                elemId = $this.siblings('.dateInput').attr('id');
            laydate({
                istime: true,
                elem:'#'+elemId,
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });
    });
})(mXbn);
