;(function (X) {
    var suggest = X(),

        suggestCtrl = suggest.ctrl(),

        path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址

        dataPath = X.configer.__OWMS_PATH__,//请求地址前缀

        request = suggest.utils.getRequest(),
     operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var perPage = 10;//列表每页显示10条记录

    suggestCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };
    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓账务管理-帐户管理';

    suggestCtrl.request({
        url: dataPath + X.configer[request.m].api.list,
        type: "post",
        data: JSON.stringify({
            limit: perPage,
            cpage: request.page || 1
        })
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            data.data.operateData = operateData;
            suggestCtrl.render(data.data).then(function () {

                //模板局部渲染
                suggestCtrl.tirgger("suggestRender", data.data);
                // 表单校验加载
                suggestCtrl.tirgger("searchFormValid");
                // 分页渲染
                suggestCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                suggestCtrl.tirgger('pageRender', data.data);
                // 详情
                suggestCtrl.tirgger('detail', data.data);

            });
        } else {
            $("#listCon").html("<tr><td colspan='7' style='text-align:center'>" + X.getErrorName(data.statusCode, 'wareErr') + "</td></tr>");
        }
    });

    //详情
    suggestCtrl.on('detail', function () {
        /*$(".js-detail").on("click",function(){
            localStorage.setItem("user","");
            localStorage.setItem("user",[$(this).attr("data-user"),$(this).attr("data-id")]);
            window.location.href="?m=xhr_id_20200000_20201000_view";
            $(this).data('href','?m=xhr_id_20200000_20201000_view');
        })*/
    });

    //表单验证
    suggestCtrl.on('searchFormValid', function () {
        // 表单验证
        $('#searchForm').html5Validate(function () {
            suggestCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发
                suggestCtrl.tirgger('suggestRender', data);
                // 分页渲染
                suggestCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                suggestCtrl.tirgger('pageRender', data);
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            });
        },{
            validate: function() {
                var isSubmit = true;
                $('.priceBegin').each(function(){
                    if($(this).hasClass('priceBegin')&&$(this).val().length){
                        var begin = parseFloat($(this).val()),
                            end = parseFloat($(this).siblings('.priceEnd').val()),
                            name = $(this).attr('name');
                        var text ='';
                        switch(name){
                            case 'totalBalance':
                                 text='总余额';
                                break;
                            case 'vailableBalance':
                                text='可用余额';
                                break;
                            case 'frozenBalance':
                                text='冻结余额';
                                break;
                        }
                        if(begin>end){
                            $(this).testRemind('请重新添写'+text+'，开始金额不能大于结束金额');
                            isSubmit=false;
                            return false
                        }
                    }
                });
                return isSubmit;
            }
        });
    });

    //模板局部渲染
    suggestCtrl.on('suggestRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        suggestCtrl.renderIn('#listTmpl', '#listCon', data);

        //触发页面dom事件
        suggestCtrl.tirgger('domEvents', "#id_conts");
    });

    suggestCtrl.on('domEvents', function (ele) {
        //搜索提交
        $('.js-search').off().on('click', function () {
            request.page = 1;
            $('#searchForm').submit();
        });
    });

    // 分页加载
    suggestCtrl.on('pageRender', function (data) {
        var cPageNo = request.page,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            suggestCtrl.tirgger('searchSubmit', p, function (data) {
                suggest.router.setHistory("?m=" + request.m + "&page=" + p);
                data.operateData = operateData;
                suggestCtrl.tirgger("suggestRender", data);
                cPageNo = p;
            });
        });
    });


    // 列表搜索提交
    suggestCtrl.on('searchSubmit', function (toPageNo, callback) {
        var sendData = {
            cpage: toPageNo,
            limit: perPage,
            userName:$('input[name=userName]').val(),
            corporateName:$('input[name=corporateName]').val(),
            contactPhone:$('input[name=contactPhone]').val(),
            searchParamList: []
        };
        $('.priceBegin,.priceEnd').each(function () {
            if($(this).val()){
                sendData.searchParamList.push({
                    key:$(this).attr('name'),
                    operator:$(this).data('operator'),
                    value:$(this).val()
                });
            }
        });

        suggestCtrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: "post",
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                callback && callback(data.data);
            } else {
                suggestCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
            }
        });
    });

    // 提示消息弹框方法定义 ,只有确定按钮
    suggestCtrl.on('setTipsCommit', function (msg, callback) {
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

})(mXbn);
