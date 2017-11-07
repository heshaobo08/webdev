;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var clientCtrl = gl_hy.ctrl();

    var localParm=gl_hy.utils.getRequest(),
        operateData=X.getRolesObj.apply(null,localParm.m.split('_').slice(2));

    // 创建视图
    clientCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };


    // 会员管理列表加载
    clientCtrl.request({
        url:jsPath + X.configer[localParm.m].api.customerList,
        type: "post",
        data:JSON.stringify({
            "pageSize":'10',
            "toPageNo":localParm.page || 1            
        })
    }).then(function(data){
        if(data.statusCode=='2000000'){
            data.data.operateData=operateData;
            clientCtrl.render(data.data).then(function(){
                // 模板局部渲染 触发
                clientCtrl.tirgger("customerRender",data.data);
                // 表单校验加载
                clientCtrl.tirgger("searchFormValid");

                // 下拉列表
                sele();

                // 分页渲染
                clientCtrl.renderIn('#pageListCon','.page',data.data);

                // 分页加载
                clientCtrl.tirgger('pageRender',data.data);
            });
        }else{
            clientCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
        }        
    });

    // 模板局部渲染
    clientCtrl.on('customerRender',function(data){
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        clientCtrl.renderIn('#customerListTmpl','#customerListCon',data);

        // 触发页面dom事件
        clientCtrl.tirgger('dom-event-init',"#id_conts",data);
    });

    // 初始化页面所有dom事件
    clientCtrl.on('dom-event-init',function(elem,data){

        // 搜索提交
        $('.js-customerSearch').off().on('click',function(){
            $("#customerSearchForm").submit();
        });

        // 开始时间
        $(".timeStart,#startTime").off().on("click",function(){
            laydate({
                istime: true,
                elem : '#startTime',
                event : 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        // 结束时间
        $(".timeEnd,#endTime").off().on("click",function(){
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

    // 分页加载
    clientCtrl.on('pageRender',function(data){
        var cPageNo=localParm.page,
            totalPages=data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            clientCtrl.tirgger('searchSubmit',p,function(data){
                gl_hy.router.setHistory("?m="+localParm.m+"&page="+p);
                clientCtrl.tirgger("customerRender",data);
                cPageNo=p;
            });
        });
    });

    // 表单验证
    clientCtrl.on('searchFormValid',function(){        
        $('#customerSearchForm').html5Validate(function(){
            clientCtrl.tirgger('searchSubmit',1,function(data){
                clientCtrl.tirgger("customerRender",data);
                // 分页渲染
                clientCtrl.renderIn('#pageListCon','.page',data);
                // 分页加载
                clientCtrl.tirgger('pageRender',data);
                //显示搜索结果
                $('#searchTotalCount').closest('.addbutton').removeClass('none');
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

    // 列表搜索提交
    clientCtrl.on('searchSubmit',function(toPageNo,callback){
        var userID=$('input[name=userID]').val(),
                platformID=$('input[name=platformID]').attr('index-data'),
                eMail=$('input[name=eMail]').val(),
                contacts=$('input[name=contacts]').val(),
                startTime=$('[name=startTime]').html(),
                endTime=$('[name=endTime]').html();
            clientCtrl.request({
                data:JSON.stringify({
                    userID:userID?userID:null,
                    platformID:platformID?platformID:null,
                    eMail:eMail?eMail:null,
                    contacts:contacts?contacts:null,
                    startTime:startTime?startTime:null,
                    endTime:endTime?endTime:null,
                    toPageNo:toPageNo,
                    pageSize:10
                }),
                type:'post',
                url:jsPath + X.configer[localParm.m].api.customerList
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    data.data.operateData=operateData;
                    callback && callback(data.data);
                }else{
                    clientCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });
    });
    


    // 提示消息弹框方法定义
    clientCtrl.on('setTips',function(msg,callback){
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
