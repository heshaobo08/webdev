;
(function (X) {

    var gl_sp = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var productCtrl = gl_sp.ctrl();

    var localParm=gl_sp.utils.getRequest(),
        userDetailListUrl=jsPath+X.configer[localParm.m].api.userDetailList,
        userIds = [],
        siteList={},
        operateData=X.getRolesObj.apply(null,localParm.m.split('_').slice(2));

    // 创建视图
    productCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    // 获取站点列表
    productCtrl.request({
        url:jsPath+X.configer[localParm.m].api.siteConfigList,
        data:'{}',
        type:'post'
    }).then(function(siteConfigDate){
        if(siteConfigDate.statusCode=='2000000'){               
            $.each(siteConfigDate.data,function(i,site){
                siteList[site.id]=site;
            }); 
            // 会员管理列表加载
            productCtrl.request({
                url:jsPath + X.configer[localParm.m].api.mainProductList,
                type: "post",
                data:JSON.stringify({
                    "pageSize":'10',
                    "pageNo":localParm.page || 1           
                })
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    data.data.siteList=siteList;
                    data.data.operateData=operateData;
                    productCtrl.render(data.data).then(function(){
                        // 模板局部渲染 触发
                        productCtrl.tirgger("productRender",data.data);
                        // 表单校验加载
                        productCtrl.tirgger("searchFormValid");
                        // 下拉列表
                        sele();
                        // 分页渲染
                        productCtrl.renderIn('#pageListCon','.page',data.data);
                        // 分页加载
                        productCtrl.tirgger('pageRender',data.data);
                    });
                }else{
                    productCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }        
            });
        }else{
            productCtrl.tirgger('setTips',X.getErrorName(siteConfigDate.statusCode));
        }
    });

    // 模板局部渲染
    productCtrl.on('productRender',function(data){
        // 获取用户名
        $.each(data.list,function(i,site){
            userIds.push(site.userName);
        });
        productCtrl.request({
            url:userDetailListUrl,
            type: "post",
            data:JSON.stringify({
                "ids":userIds   
            })
        }).then(function(users){
            if(users.statusCode=='2000000'){
                $.each(users.data,function(i,site){
                    $.each(data.list,function(j,val){                     
                        if(val.userName === i){
                            val.userName = site.name;         
                        }
                    });
                }); 
                $("#searchTotalCount").text(data.page.totalCount);
                // 数据列表渲染
                productCtrl.renderIn('#productListTmpl','#productListCon',data);

                // 触发页面dom事件
                productCtrl.tirgger('dom-event-init',"#id_conts",data);
            }else{
                productCtrl.tirgger('setTips',X.getErrorName(users.statusCode));
            }
        });     

    });

    // 初始化页面所有dom事件
    productCtrl.on('dom-event-init',function(elem,data){
        // 设置关联图
        addRelationImg(X,productCtrl,1);

        // 搜索提交
        $('.js-mainProductSearch').off().on('click',function(){
            $("#mainProductSearchFrom").submit();
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
    productCtrl.on('pageRender',function(data){
        var cPageNo=localParm.page,
            totalPages=data.page.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            productCtrl.tirgger('searchSubmit',p,function(data){
                gl_sp.router.setHistory("?m="+localParm.m+"&page="+p);
                productCtrl.tirgger("productRender",data);
                cPageNo=p;
            });
        });
    });

    // 表单验证
    productCtrl.on('searchFormValid',function(){        
        $('#mainProductSearchFrom').html5Validate(function(){
            productCtrl.tirgger('searchSubmit',1,function(data){
                // 模板渲染
                productCtrl.tirgger("productRender",data);
                // 分页渲染
                productCtrl.renderIn('#pageListCon','.page',data);
                // 分页加载
                productCtrl.tirgger('pageRender',data);
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
    productCtrl.on('searchSubmit',function(toPageNo,callback){
        var title=$('input[name=title]').val(),
            sku=$('input[name=sku]').val(),
            userName=$('input[name=userName]').val(),
            site=$('input[name=site]').val(),
            startDate=$('[name=startDate]').html(),
            userType=$('input[name=userType]').attr('index-data'),
            endDate=$('[name=endDate]').html();
        productCtrl.request({
            data:JSON.stringify({
                title:title?title:null,
                sku:sku?sku:null,
                userName:userName?userName:null,
                site:site?site:null,
                startDate:startDate?startDate:null,
                endDate:endDate?endDate:null,
                pageNo:toPageNo,
                pageSize:10,
                userType:userType?userType:null
            }),
            type:'post',
            url:jsPath + X.configer[localParm.m].api.mainProductList
        }).then(function(data){
            if(data.statusCode=='2000000'){
                data.data.siteList=siteList;
                data.data.operateData=operateData;
                callback && callback(data.data);
            }else{
                productCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
            }
        });
    });
    


    // 提示消息弹框方法定义
    productCtrl.on('setTips',function(msg,callback){
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
