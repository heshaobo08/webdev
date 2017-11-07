;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';
    //页面中存在验证提示时，从页面中移除
    if($('#validateRemind').length){
        $('#validateRemind').remove();
    }
    var jsPath=X.configer.__API_PATH__;

    var brandCtrl = gl_hy.ctrl();

    var localParm=gl_hy.utils.getRequest(),
        operateData=X.getRolesObj.apply(null,localParm.m.split('_').slice(2));

    // 创建视图
    brandCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };
    //页面中存在验证提示时，从页面中移除
    if($('#validateRemind').length){
        $('#validateRemind').remove();
    }

    // 品牌管理列表加载
    brandCtrl.request({
        url:jsPath + X.configer[localParm.m].api.brandList,
        type: "post",
        data:JSON.stringify({
            "pageSize":'10',
            "cPageNo":localParm.page || 1,
            "listType":'0'
        })
    }).then(function(data){
        if(data.statusCode=='2000000'){
            data.data.operateData=operateData;
            brandCtrl.render(data.data).then(function(){
                if(data.data.list){
                    // 设置剩余多少天
                    for(var i=0;i<data.data.list.length;i++){
                        data.data.list[i].lastDay=Math.ceil((new Date(data.data.list[i].brandExpireTime)-new Date())/(1000*60*60*24));
                    }
                }
                // 模板局部渲染 触发
                brandCtrl.tirgger("brandRender",data.data);

                // 表单校验加载
                brandCtrl.tirgger("searchFormValid");
                // 全选框
                sele();
                // 分页渲染
                brandCtrl.renderIn('#pageListCon','.page',data.data);
                brandCtrl.tirgger('pageRender',data.data);
            });
        }else{
            brandCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
        }
    });

    // 模板局部渲染
    brandCtrl.on('brandRender',function(data){
        $("#searchTotalCount").text(data.totalCount);
        $("#searchTotal").html(data.totalCount);

        // 数据列表渲染
        brandCtrl.renderIn('#brandListTmpl','#brandListCon',data);


        // 触发页面dom事件
        brandCtrl.tirgger('dom-event-init',"#id_conts");

    });

    // 初始化页面所有dom事件
    brandCtrl.on('dom-event-init',function(elem){
        var cPageNo=1,
            pageSize=10;

        // 搜索提交
        $('.js-brandSearch').off().on('click',function(){
            $("#brandSearchFrom").submit();
        });

        // 开始时间
        $(".timeStart,#startTime").on("click",function(){
            laydate({
                istime: true,
                elem : '#startTime',
                event : 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        // 结束时间
        $(".timeEnd,#endTime").on("click",function(){
            laydate({
                istime: true,
                elem : '#endTime',
                event : 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        $(".bigTable tbody tr,.smallTable tbody tr").hover(function(){
            $(this).css({"background-color":"#ececec"});
        },function(){
            $(this).attr('style','');
        });

    });

    brandCtrl.on('searchFormValid',function(){
        // 表单验证
        $('#brandSearchFrom').html5Validate(function(){
            brandCtrl.tirgger('searchSubmit',1,function(data){
                // 模板局部渲染 触发
                brandCtrl.tirgger("brandRender",data);
                // 分页渲染
                brandCtrl.renderIn('#pageListCon','.page',data);
                brandCtrl.tirgger('pageRender',data);
                $('#searchTotalCount').closest('em').removeClass('none');
            });
        },{
            validate: function() {
                // 开始时间和结束时间的校验
                if($("#startTime").html() && $('#endTime').html()==""){
                    $("#endTime").testRemind("请选择结束时间");
                    return false;
                }else if($("#startTime").html()=="" && $('#endTime').html()){
                    $("#startTime").testRemind("请选择开始时间");
                    return false;
                }else if($("#startTime").html()>$('#endTime').html()){
                    $("#startTime").testRemind("开始时间不能大于结束时间");
                    return false;
                }
                return true;
            }
        });
    });

    // 分页加载
    brandCtrl.on('pageRender',function(data){
        var cPageNo=localParm.page,
            pageSize=10,
            totalPages=data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            brandCtrl.tirgger('searchSubmit',p,function(data){
                gl_hy.router.setHistory("?m="+localParm.m+"&page="+p);
                brandCtrl.tirgger("brandRender",data);
                cPageNo=p;
            });
        });
    })

    // 列表搜索提交
    brandCtrl.on('searchSubmit',function(toPageNo,callback){
        var cnName=$("input[name=cnName]",'#brandSearchFrom').val(),
                enName=$("input[name=enName]",'#brandSearchFrom').val(),
                qualificationType=$("input[name=qualificationType]",'#brandSearchFrom').attr('index-data'),
                qualificationStatus=$("input[name=qualificationStatus]",'#brandSearchFrom').attr('index-data'),
                relevanceAccount=$("input[name=relevanceAccount]",'#brandSearchFrom').val(),
                beginExpireTime=$("[name=createTime_start]",'#brandSearchFrom').html(),
                endExpireTime=$("[name=createTime_end]",'#brandSearchFrom').html(),
                companyName=$("[name=companyName]",'#brandSearchFrom').val(),
                sendData={
                    "pageSize":10,
                    "cPageNo":toPageNo,
                    cnName:cnName?cnName:null,
                    enName:enName?enName:null,
                    businessModel:qualificationType?qualificationType:null,
                    auditStatus:qualificationStatus?qualificationStatus:null,
                    createTime_start:beginExpireTime?beginExpireTime:null,
                    createTime_end:endExpireTime?endExpireTime:null,
                    relevanceAccount:relevanceAccount?relevanceAccount:null,
                    companyName:companyName?companyName:null,
                    listType:'0'
                };

            brandCtrl.request({
                url:jsPath + X.configer[localParm.m].api.brandList,
                type: "post",
                data:JSON.stringify(sendData)
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    if(data.data.list){
                        // 设置剩余多少天
                        for(var i=0;i<data.data.list.length;i++){
                            data.data.list[i].lastDay=Math.ceil((new Date(data.data.list[i].brandExpireTime)-new Date())/(1000*60*60*24));
                        }
                    }
                    data.data.operateData=operateData;
                    callback && callback(data.data);
                }else{
                    brandCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });
    });



    // 提示消息弹框方法定义
    brandCtrl.on('setTips',function(msg,callback){
        if(!msg) return;
        $.layer({
            title:'提示消息',
            area: ['500px', '200px'],
            dialog:{
                btns:1,
                btn:['返回'],
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
