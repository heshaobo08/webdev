;
(function (X) {

    var gl_sp = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var productCtrl = gl_sp.ctrl();

    var localParm=gl_sp.utils.getRequest(),
        url='',
        userDetailListUrl=jsPath+X.configer[localParm.m].api.userDetailList,
        userIds = [],
        detailUrl='',
        siteList={}, //站点列表
        platform=localParm.p || '1', //平台
        operateData=X.getRolesObj.apply(null,localParm.m.split('_').slice(2));

    if(platform=='1'){
        url=jsPath+X.configer[localParm.m].api.ebayList;
        detailUrl=jsPath+X.configer[localParm.m].api.ebayDetail;
    }else if(platform=='2'){
        url=jsPath+X.configer[localParm.m].api.amazonList;
        detailUrl=jsPath+X.configer[localParm.m].api.amazonDetail;
    }else if(platform=='3'){
        url=jsPath+X.configer[localParm.m].api.neweggList;
        detailUrl=jsPath+X.configer[localParm.m].api.neweggDetail;
    }

    // 创建视图
    productCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    // 获取站点列表
    productCtrl.request({
        url:jsPath+X.configer[localParm.m].api.siteConfigList,
        data:JSON.stringify({platformCode:platform}),
        type:'post'
    }).then(function(siteConfigDate){
        if(siteConfigDate.statusCode=='2000000'){
            $.each(siteConfigDate.data,function(i,site){
                siteList[site.id]=site;
            });
            // 会员管理列表加载
            productCtrl.request({
                url:url,
                type: "post",
                data:JSON.stringify({
                    "pageSize":'10',
                    "pageNo":localParm.page || 1
                })
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    data.data.platform=platform;
                    data.data.siteList=siteList;
                    data.data.operateData=operateData;
                    $.each(data.data.list,function(i,list){
                        // 设置状态
                        list.publishShowStatus=statuSite(list);
                    });
                    productCtrl.render(data.data).then(function(){
                        // 模板局部渲染 触发
                        productCtrl.tirgger("publishRender",data.data);
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
    productCtrl.on('publishRender',function(data){
        // 获取用户名
        $.each(data.list,function(i,site){
            userIds.push(site.userId);
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
                        if(val.userId === i){
                            val.userName = site.name;         
                        }
                    });
                }); 
                $("#searchTotalCount").text(data.page.totalCount);
                // 数据列表渲染
                productCtrl.renderIn('#publishListTmpl','#publishListCon',data);

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
        $('.js-publishSearch').off().on('click',function(){
            $("#publishSearchForm").submit();
        });

        // 提交时间开始
        $(".stimeStart,#sstartTime").off().on("click",function(){
            laydate({
                istime: true,
                elem : '#sstartTime',
                event : 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        // 提交结束时间
        $(".stimeEnd,#sendTime").off().on("click",function(){
            laydate({
                istime: true,
                elem : '#sendTime',
                event : 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        // 刊登开始时间
        $(".timeStart,#startTime").off().on("click",function(){
            laydate({
                istime: true,
                elem : '#startTime',
                event : 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        // 刊登结束时间
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

        // 全选
        checkeBox();

        // 查看描述
        $('.js-publishDiscribe').off().on("click", function () {
            var id=$(this).attr('data-id');
            productCtrl.request({
                data:JSON.stringify({
                    id:id
                }),
                type:'post',
                url:detailUrl
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    $.layer({
                        title : '描述',
                        area : ['850px', '500px'],
                        dialog : {
                            btns : 1,
                            btn : ['返回', ''],
                            type : 8,
                            //msg : '<div class="textDiscribe">'+(data.data.after?data.data.after.description:'暂无内容')+'</div>',
                            msg : '<div class="textDiscribe"><iframe id="wordDiscribeIframe" width="100%" height="100%" frameborder="0"></iframe></div>'
                        },
                        success: function (layero, index) {
                            var iframe = document.getElementById("wordDiscribeIframe");
                            if( iframe ){
                                if(data.data.after){
                                    setIframeContent(iframe, data.data.after.description);
                                }else{
                                    setIframeContent(iframe, '暂无内容');
                                }


                            }
                        }
                    });
                }else{
                    productCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });
        });

        // 批量审核
        $('.js-checkupOtherBatch').off().on("click", function () {
            var id=$(this).attr('data-id');
            if(id){
                $('input[name=checkId]').prop('checked',false);
                $('input[name=checkId][value='+$(this).attr('data-id')+']').prop('checked',true);
            }
            var aCheckId=$('input[name=checkId]:checked'),
                aId=[];
            if(!aCheckId.length){
                productCtrl.tirgger('setTips','至少选择一个商品进行操作');
                return false;
            }
            aCheckId.each(function(i,check){
                aId.push($(this).val());
            });
            // 模板渲染
            productCtrl.renderIn("#layerBoxTmpl",".layerCon",{platform:platform});
            $.layer({
                title : '批量审核',
                area : ['550px', ''],
                dialog : {
                    btns : 2,
                    btn : ['确认', '取消'],
                    type : 8,
                    msg : $(".layerCon").html(),
                    yes: function(index){
                        $("#productAuditLayerBox").submit();
                    }
                },
                success:function(){
                    $(".layerCon").html('');

                    // 审核驳回切换
                    $('input[name=audit]',"#productAuditLayerBox").off().on('change',function(){
                        var type=$('input[name=audit]:checked',"#productAuditLayerBox").val();
                        if(type=='passed'){
                            $('.passedBox').show();
                            $(".rejectBox").hide();
                        }else{
                            $('.passedBox').hide();
                            $(".rejectBox").show();
                        }
                    });

                    $.testRemind.css.zIndex=$('.xubox_shade').css('zIndex')+1;

                    // 表单验证
                    $("#productAuditLayerBox").html5Validate(function(){
                        var url='',
                            sendData={},
                            audit=$('input[name=audit]:checked',"#productAuditLayerBox").val();
                        if(audit=='passed'){
                            if(platform=='1'){
                                // amazon 通过
                                url=jsPath+X.configer[localParm.m].api.ebayPassed;
                                sendData={ids:aId};
                            }else if(platform=='2'){
                                // amazon 通过
                                url=jsPath+X.configer[localParm.m].api.amazonPassed;
                                sendData={ids:aId};
                            }else if(platform=='3'){
                                // newegg 通过
                                url=jsPath+X.configer[localParm.m].api.neweggPassed;
                                sendData={ids:aId};
                            }
                        }else if(audit=='reject'){
                            if(platform=='1'){
                                 // amazon 驳回
                                url=jsPath+X.configer[localParm.m].api.ebayReject;
                            }else if(platform=='2'){
                                 // amazon 驳回
                                url=jsPath+X.configer[localParm.m].api.amazonReject;
                            }else if(platform=='3'){
                                 // newegg 驳回
                                url=jsPath+X.configer[localParm.m].api.neweggReject;
                            }
                            sendData={
                                ids:aId,
                                chkReason:$('[name=chkReason]',"#productAuditLayerBox").val()
                            };
                        }
                        productCtrl.request({
                            data:JSON.stringify(sendData),
                            url:url,
                            type:'post'
                        }).then(function(data){
                            if(data.statusCode=='2000000'){
                                productCtrl.tirgger('setTips','操作成功',function(){
                                    layer.close(layer.index);
                                    gl_sp.router.runCallback();
                                });
                            }else{
                                productCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                            }
                        });
                    },{
                        validate:function(){
                            var seletAudit=$('input[name=audit]:checked',"#productAuditLayerBox").val();
                            // 审核通过
                            if(seletAudit=="passed"){
                                return true;
                            }else if(seletAudit=='reject'){
                                // 审核驳回
                                if(!$('[name=chkReason]',"#productAuditLayerBox").val()){
                                    $('[name=chkReason]',"#productAuditLayerBox").testRemind("驳回原因不能为空");
                                    return false;
                                }
                            }
                            return true;
                        }
                    });
                }
            });

        });

        // 查看驳回原因详情
        $('.js-publishForbidView').off().on("click", function () {
            var reason=$(this).attr('data-reason');
            $.layer({
                title : '驳回原因',
                area : ['550px', ''],
                dialog : {
                    btns : 1,
                    btn : ['确认', ''],
                    type : 8,
                    msg : '<div class="frozen"><p class="textShow">'+reason+'</p></div>'
                }
            });
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
                productCtrl.tirgger("publishRender",data);
                cPageNo=p;
            });
        });
    });

    // 表单验证
    productCtrl.on('searchFormValid',function(){
        $('#publishSearchForm').html5Validate(function(){
            productCtrl.tirgger('searchSubmit',1,function(data){
                // 模板渲染
                productCtrl.tirgger("publishRender",data);
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
                if($("#sstartTime").html() && $('#sendTime').html()==""){
                    $("#sendTime").testRemind("请选择结束时间");
                    return false;
                }else if($("#sstartTime").html()=="" && $('#sendTime').html()){
                    $("#sstartTime").testRemind("请选择开始时间");
                    return false;
                }else if($("#sstartTime").html()>$('#sendTime').html()){
                    $("#sstartTime").testRemind("开始时间不能大于结束时间");
                    return false;
                }
                return true;
            }
        });
    });

    // 列表搜索提交
    productCtrl.on('searchSubmit',function(toPageNo,callback){
        var title=$('input[name=title]','#publishSearchForm').val(),
            sku=$('input[name=sku]','#publishSearchForm').val(),
            userName=$('input[name=userName]','#publishSearchForm').val(),
            variationType=$('input[name=variationType]','#publishSearchForm').attr('index-data'),
            listingType=$('input[name=listingType]','#publishSearchForm').attr('index-data'),
            startSubmitDate=$('[name=startSubmitDate]','#publishSearchForm').html(),
            endSubmitDate=$('[name=endSubmitDate]','#publishSearchForm').html(),
            startEditDate=$('[name=startEditDate]','#publishSearchForm').html(),
            endEditDate=$('[name=endEditDate]','#publishSearchForm').html(),
            site=$('input[name=site]','#publishSearchForm').attr('index-data'),
            userType=$('input[name=userType]','#publishSearchForm').attr('index-data'),
            status=$('input[name=status]','#publishSearchForm').attr('index-data');
        productCtrl.request({
            data:JSON.stringify({
                title:title?title:null,
                sku:sku?sku:null,
                userName:userName?userName:null,
                variationType:variationType?variationType:null,
                listingType:listingType?listingType:null,
                startSubmitDate:startSubmitDate?startSubmitDate:null,
                endSubmitDate:endSubmitDate?endSubmitDate:null,
                startEditDate:startEditDate?startEditDate:null,
                endEditDate:endEditDate?endEditDate:null,
                site:site?site:null,
                status:status?status:null,
                pageNo:toPageNo,
                pageSize:10,
                userType:userType?userType:null
            }),
            type:'post',
            url:url
        }).then(function(data){
            if(data.statusCode=='2000000'){
                data.data.platform=platform;
                data.data.siteList=siteList;
                data.data.operateData=operateData;
                $.each(data.data.list,function(i,list){
                    // 设置状态
                    list.publishShowStatus=statuSite(list);
                });
                if(site){
                    $(".js-checkupBatch").removeClass('none');
                }else{
                    $(".js-checkupBatch").addClass('none');
                }
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
