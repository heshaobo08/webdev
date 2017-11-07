;
(function (X) {
    var forecast = X(),
        forecastCtrl = forecast.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = forecast.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var perPage = 10;//列表每页显示10条记录

    forecastCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };
    var storeList = [];
    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓业务管理-收货预报管理';
    //页面初次加载
    forecastCtrl.request({
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
            forecastCtrl.request({
                url: dataPath + X.configer[request.m].api.storeList,
                type: "get"
            }).then(function (storeData) {
                if (storeData.statusCode == '2000000') {
                    data.data.stores = storeData.data;
                    forecastCtrl.render(data.data).then(function () {
                        //下拉框
                        sele();
                        //模板局部渲染
                        forecastCtrl.tirgger("listRender", data.data);
                        // 表单校验加载
                        forecastCtrl.tirgger("searchFormValid");
                        // 分页渲染
                        forecastCtrl.renderIn('#pageListTmpl', '.page', data);
                        // 分页加载
                        forecastCtrl.tirgger('pageRender', data.data);
                        // 导出收货预报
                        forecastCtrl.tirgger('export');
                        // 打印条码
                        forecastCtrl.tirgger('print');
                        // 打印箱子条码
                        forecastCtrl.tirgger('printBox');
                        // 修改备注
                        forecastCtrl.tirgger('editRemak');

                        forecastCtrl.tirgger('update');
                        // 导出收货预报
                        forecastCtrl.tirgger('export');
                    });
                } else {
                    forecastCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        } else {
             forecastCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });
    //模板局部渲染
    forecastCtrl.on('listRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        forecastCtrl.renderIn('#listTmpl', '#listCon', data);
        //触发页面dom事件
        forecastCtrl.tirgger('domEvents', "#id_conts");
        //调用全选功能
        checkeBox("r-box");
    });

    // 更新进程

    forecastCtrl.on('update',function(){
        $('.js-update').off().on('click', function () {
            if(!$('#listCon tr :checkbox:checked').length){
                forecastCtrl.tirgger('setTips', '请选择收货预报。');
                return false;
            }
            var arrIds = [], checkedDoms = $('#listCon tr :checkbox:checked'), arrStatus = [1,2,3,11];
            for(var i=0;i<checkedDoms.length;i++){
                var tr =checkedDoms.eq(i).closest('tr');
                if(arrStatus.indexOf(tr.data('status'))!=-1){
                    forecastCtrl.tirgger('setTips', '商家未发货的收货预报不能更新进程。');
                    return false;
                }
                arrIds.push(tr.data('id'));
            }
            //$(this).data('href',"?m=xhr_id_20100000_20106000_updateProcess");
            localStorage.setItem("updateIds","");
            localStorage.setItem("updateIds",arrIds);
        });
    });

    forecastCtrl.on('domEvents', function (ele) {
        //选择时间
        forecastCtrl.tirgger('pickDate');
        //搜索提交
        $('.js-search').off().on('click', function () {
            $("#searchForm").submit();
        });
        //批量审核
        $('.js-batchExamine').off().on('click',function(){
            var checkBox = $("#listCon [type=checkbox]:checked");
            var len = checkBox.length;
            if(len == 0){
                forecastCtrl.tirgger('setTips','请选择收货预报。',function(){
                    layer.close(layer.index);
                },1);
            }else{
                var ids = [];
                checkBox.each(function(){
                    var that = $(this);
                    var id = that.closest("tr").data("id");
                    ids.push(id);
                });
                forecastCtrl.tirgger('examine',ids);
            }
        });
        //单个审核
        $('.js-examine').off().on('click',function(){
            var id=$(this).closest('tr').data('id');
            forecastCtrl.tirgger('examine',[id]);
        });
        //批量驳回
        $(".js-batchReject").on("click",function(){
            var checkBox = $("[type=checkbox]:checked").not("[name=all]");
            var len = checkBox.length;
            if(len == 0){
                forecastCtrl.tirgger('setTips','请选择收货预报。',function(){
                    layer.close(layer.index);
                },1);
            }else{
                var ids = [];
                checkBox.each(function(){
                    var that = $(this);
                    var id = that.closest("tr").attr("data-id");
                    ids.push(id);
                });
                forecastCtrl.tirgger('reject',ids);
            }
        });
         //单个驳回
        $('.js-reject').off().on('click',function(){
            var id=$(this).closest('tr').data('id');
            forecastCtrl.tirgger('reject',[id],'驳回');
        });
    });

    //表单验证
    forecastCtrl.on('searchFormValid', function () {
        // 表单验证
        $('#searchForm').html5Validate(function () {
            forecastCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发
                forecastCtrl.tirgger('listRender', data);
                // 分页渲染
                forecastCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                forecastCtrl.tirgger('pageRender', data);
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            });
        },{
            validate: function() {
                // 开始时间和结束时间的校验
                if($('#forecastTime-start').text() && $('#forecastTime-end').text()==''){
                    $('#forecastTime-end').testRemind("请选择预报结束时间");
                    return false;
                }else if($('#forecastTime-start').text()=='' && $('#forecastTime-end').text() ){
                    $('#forecastTime-start').testRemind("请选择预报开始时间");
                    return false;
                }else if($('#forecastTime-start').text()>$('#forecastTime-end').text()){
                    $('#forecastTime-start').testRemind("开始时间不能大于结束时间");
                    return false;
                }
                if ($('.priceBegin').val().length && $('.priceEnd').val().length) {
                    var begin = parseFloat($('.priceBegin').val()),
                        end = parseFloat($('.priceEnd').val());

                    if(begin>end){
                        $('.priceBegin').testRemind('请重新添写总运费，开始金额不能大于结束金额');
                        return false
                    }
                }
                return true;
            }
        });
    });

    //导出收货预报
    forecastCtrl.on('export', function () {
        $('.js-export').off().on('click', function () {
            var checkBox = $("[type=checkbox]:checked").not("[name=all]");
            var len = checkBox.length;
            if(len == 0){
                $("#export").find("[type=text]").remove();
                forecastCtrl.tirgger('setTips','请选择收货预报。',function(){
                    layer.close(layer.index);
                });
            }else{
                $("#export").find("[type=text]").remove();
                checkBox.each(function(){
                    var that = $(this);
                    var id = that.closest("tr").attr("data-id");
                    $("#export").append('<input type="text" name="id" value="'+id+'">')
                })
                $("#export").find("[type=submit]").click();
            }
        });
    });

    //打印条码
    forecastCtrl.on('print', function () {
        $('.js-printBarCode').off().on('click', function () {
            var checkBox = $("[type=checkbox]:checked").not("[name=all]");
            var len = checkBox.length;
            if(len == 0){
                forecastCtrl.tirgger('setTips','请选择收货预报。',function(){
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
                localStorage.setItem("barIds","");
                localStorage.setItem("barIds",ids);
                layer.close(layer.index);
            }
        });
    });

    //打印箱子条码
    forecastCtrl.on('printBox', function () {
        $('.js-printBoxCode').off().on('click', function () {
            var checkBox = $("[type=checkbox]:checked").not("[name=all]");
            var len = checkBox.length;
            if(len == 0){
                forecastCtrl.tirgger('setTips','请选择收货预报。',function(){
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
                localStorage.setItem("boxIds","");
                localStorage.setItem("boxIds",ids);
                layer.close(layer.index);
            }
        });
    });

    // 修改备注
    forecastCtrl.on('editRemak',function(){
        $(".highTable").on("click",".js-editRemak",function(){
            var id = $(this).closest("tr").attr("data-id");
            var remark = $(this).parent().prev().text() == "暂无备注" ? "" : $(this).parent().prev().text();
            $.layer({
                title: '修改备注',
                area: ['550px', '300px'],
                dialog: {
                    btns: 2,
                    btn: ['确认','取消'],
                    type : 8,
                    msg: '<form id="frozenForm"><div class="frozen mB20 pT35"><textarea name="remark" cols="30" rows="10" class="textadd" placeholder="请输入备注" data-cnmax="500">'+remark+'</textarea></div></form>',
                },
                 success: function (layero, index) {
                     $('#frozenForm').html5Validate(function () {
                        forecastCtrl.request({
                            url:dataPath + X.configer[request.m].api.updateRemark,
                            data:JSON.stringify({id:id,remark:$("[name=remark]").val()}),
                            type:'post'
                        }).then(function(data){
                            if(data.statusCode=='2000000'){
                                layer.close(layer.index);
                                forecastCtrl.tirgger('setTips','备注修改成功！',function(){
                                    forecast.router.runCallback();
                                });
                            }else{
                                forecastCtrl.tirgger('setTips',X.getErrorName(data.statusCode, 'wareErr'));
                            }
                        });
                     });
                },
                yes: function () {
                    $('#frozenForm').submit();
                },
                no: function () {
                    if ($('#frozenForm').length) $('#validateRemind').remove();
                }
            });
        })
    });

    // 审核
    forecastCtrl.on('examine',function(ids){
        forecastCtrl.tirgger('setTips','确认审核通过？',function(){
            forecastCtrl.request({
                url: dataPath + X.configer[request.m].api.batchPass,
                type: 'post',
                data: JSON.stringify({ids:ids})
            }).then(function (track) {
                if (track.statusCode == '2000000') {
                    forecastCtrl.tirgger('setTips','您已审核成功！',function(){
                        forecast.router.runCallback();
                    },1);
                }else{
                    forecastCtrl.tirgger('setTips',X.getErrorName(track.statusCode, 'wareErr'));
                }
            });
        },2);
    });

    //驳回
    forecastCtrl.on('reject',function(ids,text){
        var text = text ? text : '批量驳回';
        $.layer({
            title: text,
            area: ['550px', '300px'],
            dialog: {
                btns: 2,
                btn: ['确认','取消'],
                type : 8,
                msg: '<form id="frozenForm"><div class="frozen mB20 pT35"><textarea name="remark" id="" cols="30" rows="10" class="textadd" placeholder="请输入驳回原因" required data-cnmax="500"></textarea></div></form>',
                yes: function(index){
                    $("#frozenForm").submit();
                },
                no: function(index){
                    layer.close(index);
                }
            },
            success:function(){
                // 控制层级
                $.testRemind.css.zIndex=$('.xubox_shade').css('zIndex')+1;
                // 表单验证
                $("#frozenForm").html5Validate(function(){
                    forecastCtrl.request({
                        url:dataPath + X.configer[request.m].api.batchReject,
                        data:JSON.stringify({ids:ids,param:$("[name=remark]").val()}),
                        type:'post'
                    }).then(function(data){
                        if(data.statusCode=='2000000'){
                            forecastCtrl.tirgger('setTips','驳回成功！',function(){
                                forecast.router.runCallback();
                            });
                        }else{
                            forecastCtrl.tirgger('setTips',X.getErrorName(data.statusCode, 'wareErr'));
                        }
                    });
                });
            }
        });
    });

    // 分页加载
    forecastCtrl.on('pageRender', function (data) {
        var cPageNo = request.page,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            forecastCtrl.tirgger('searchSubmit', p, function (data) {
                forecast.router.setHistory("?m=" + request.m + "&page=" + p);
                forecastCtrl.tirgger("listRender", data);
                $("[name=all]").prop("checked",false);
                cPageNo = p;
            });
        });
    });

     // 列表搜索提交
    forecastCtrl.on('searchSubmit', function (toPageNo, callback) {
        var form = $('#searchForm');
        var sendData = {
            "cpage": toPageNo,
            "limit": perPage,
            "forecastCode": $('input[name=forecastCode]', form).val(),
            "createUser": $('input[name=createUser]', form).val(),
            "status": parseInt($('input[name=status]', form).attr("index-data")),
            "disposalSite": $('input[name=disposalSite]', form).attr("index-data")?$('input[name=disposalSite]', form).val():'',
            "destinationStoreCode": $('input[name=destinationStoreCode]', form).attr("index-data"),
            "logisticsType": parseInt($('input[name=logisticsType]', form).attr("index-data")),
            "searchParamList": []
        }
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

        if($('input[name=chargebackSituation]').attr('index-data')){
            sendData.searchParamList.push({
               key: "chargebackSituation",
                operator: 'eq',
                value: $('input[name=chargebackSituation]').attr('index-data')
            });
        }
        forecastCtrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: "post",
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                callback && callback(data.data);
            } else {
                forecastCtrl.tirgger('setTips', X.getErrorName(data.statusCode, 'wareErr'));
            }
        });
    });

    // 提示消息弹框方法定义
    forecastCtrl.on('setTips',function(msg,callback,n){
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

    //获取时间
    forecastCtrl.on('pickDate', function () {
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
