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

    Date.prototype.pattern=function(fmt) {
        var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
        };
        var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
        };
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        if(/(E+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
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
                    })
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

        $(".bigTable tbody tr,.smallTable tbody tr").hover(function(){
            $(this).css({"background-color":"#ececec"});
        },function(){
            $(this).attr('style','');
        });

        // 全选
        checkeBox();

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

        // sku查看全部  (已暂停使用 2015-10-9)
        $('.js-viewSku').off().on("click", function () {
            var id=$(this).attr('data-id');
            productCtrl.request({
                data:JSON.stringify({
                    id:id
                }),
                type:'post',
                url:detailUrl
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    if(data.data && data.data.commodityVariations){
                        var text='<div class="textDiscribe"><ul>';
                        // 拼隔数据
                        $.each(data.data.commodityVariations,function(i,variation){
                            text+='<li>';
                            // 获取sku包含对象
                            if(variation.variationDetails){
                                // 获取单个sku对象
                                $.each(variation.variationDetails,function(j,vary){
                                    text+='<em class="mR20">sku:'+vary.variationSku+'</em>';
                                   $.each(vary.variationValues.split('###'),function(m,single){
                                        text+='<em class="mR20">'+single+'</em>';
                                   });
                                   text+='</li>';
                                });
                            }
                            text+='</li>';
                        });
                        text+='</ul></div>';
                    }
                    if(!text){
                        text='<div class="tips"><em>暂无数据</em></div>';
                    }
                    $.layer({
                        title : '商品货号/SKU',
                        area : ['550px', ''],
                        dialog : {
                            btns : 1,
                            btn : ['确认', ''],
                            type : 8,
                            msg :text
                        }
                    });
                }else{
                    productCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });
        });

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
                        //area : ['550px', ''],
                        area : ['850px', ''],
                        dialog : {
                            btns : 1,
                            btn : ['返回', ''],
                            type : 8,
                            //msg : '<div class="textDiscribe">'+data.data.description+'</div>',
                            msg : '<div class="textDiscribe"><iframe id="wordDiscribeIframe" width="100%" height="100%" frameborder="0"></iframe></div>'
                        },
                        success: function (layero, index) {
                            layero.find('#wordDiscribeIframe')
                            var iframe = document.getElementById("wordDiscribeIframe");
                            if( iframe &&  data.data && data.data.description){
                                setIframeContent(iframe, data.data.description);
                            }
                        }
                    });
                }else{
                    productCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });
        });


        // 取消定时
        $('.js-publishCancel').off().on("click", function () {
            var aId=[$(this).attr('data-id')];
            $.layer({
                    title : '取消定时',
                    area : ['550px', ''],
                    dialog : {
                        btns : 2,
                        btn : ['确认', '取消'],
                        type : 8,
                        msg : '<div class="tips">您是否对选择的商品进行取消定时操作？</div>',
                        yes: function(index){
                            productCtrl.request({
                                data:JSON.stringify({
                                    ids:aId
                                }),
                                url:jsPath+X.configer[localParm.m].api.ebaycancelCron,
                                type:'post'
                            }).then(function(data){
                                if(data.statusCode=='2000000'){
                                    layer.close(index);
                                    gl_sp.router.runCallback();
                                }else{
                                    productCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                                }
                            });
                        }
                    }
                });

        });

        // 立即刊登
        $('.js-publishNow').off().on("click", function () {
            var aId=[$(this).attr('data-id')];
            $.layer({
                title : '立即刊登',
                area : ['550px', ''],
                dialog : {
                    btns : 2,
                    btn : ['确认', '取消'],
                    type : 8,
                    msg : '<div class="tips">您是否对选择的商品进行立即刊登操作？</div>',
                    yes: function(index){
                        productCtrl.request({
                            data:JSON.stringify({
                                ids:aId
                            }),
                            url:jsPath+X.configer[localParm.m].api.ebayImmediatePublish,
                            type:'post'
                        }).then(function(data){
                            if(data.statusCode=='2000000'){
                                productCtrl.tirgger('setTips','立即刊登成功！',function () {
                                    layer.close(index);
                                    gl_sp.router.runCallback();
                                });
                            }else{
                                productCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                            }
                        });
                    }
                }
            });
        });


        // 批量审核(ebay审核)
        $('.js-checkupBatch').off().on("click", function () {
            var id=$(this).attr('data-id'),
                siteId='';
            if(id){
                $('input[name=checkId]').prop('checked',false);
                $('input[name=checkId][value='+$(this).attr('data-id')+']').prop('checked',true);
            }
            if(!id){
                siteId=$('input[name=site]','#publishSearchForm').attr('index-data');
            }else{
                siteId=$('input[name=checkId]:checked').attr('data-site');
            }
            var aCheckId=$('input[name=checkId]:checked'),
                siteInfo=siteList[siteId],
                aId=[],
                siteRuleData={},//站点规则数据
                isContinue=true;
            if(!aCheckId.length){
                productCtrl.tirgger('setTips','至少选择一个商品进行操作');
                return false;
            }
            aCheckId.each(function(i,check){
                aId.push($(this).val());
            });
            // 获取站点规则数据
            productCtrl.request({
                data:JSON.stringify({
                    "site":siteId
                 }),
                type:'post',
                url:jsPath+X.configer[localParm.m].api.ebayCronRule
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    siteRuleData=data.data;
                    // 模板渲染
                    productCtrl.renderIn("#layerBoxTmpl",".layerCon",{platform:platform});

                    if(!isContinue){
                        $.layer({
                            title : '批量审核',
                            area : ['550px', ''],
                            dialog : {
                                btns : 2,
                                btn : ['确认', '取消'],
                                type : 8,
                                msg : '<div class="tips"><p>请针对“取消定时”和“刊登待审核”商品进行批量操作,请重新选择！</p></div>'
                            }
                        });
                    }else{
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
                                // 刊登日期设置
                                productCtrl.tirgger('timeSet',siteRuleData,siteInfo,"#productAuditLayerBox");

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

                                // 刊登方式 下拉列表 切换
                                sele('.select',"#productAuditLayerBox",function(index,val,select){
                                    if(index=='Unlimit'){
                                        // 不即时
                                        $('.timeInterval').show();
                                        $('.cronEndDate').hide();
                                    }else if(index=='Limit'){
                                        // 即时
                                        $('.timeInterval').hide();
                                        $('.cronEndDate').show();
                                    }
                                });

                                $.testRemind.css.zIndex=$('.xubox_shade').css('zIndex')+1;

                                // 表单验证
                                $("#productAuditLayerBox").html5Validate(function(){
                                    var url='',
                                        sendData={},
                                        audit=$('input[name=audit]:checked',"#productAuditLayerBox").val();
                                    if(audit=='passed'){
                                        // ebay 通过
                                        url=jsPath+X.configer[localParm.m].api.ebayPassed;
                                        var timeInterval=$('input[name=timeInterval]',"#productAuditLayerBox").val();
                                        sendData={
                                            ids:aId,
                                            type:$('input[name=type]',"#productAuditLayerBox").attr('index-data'),
                                            cronBeginDate:$('input[name=cronBeginDate]',"#productAuditLayerBox").val(),
                                            cronEndDate:$('input[name=cronEndDate]',"#productAuditLayerBox").val(),
                                            timeInterval:timeInterval?Number(timeInterval):null
                                        };
                                    }else if(audit=='reject'){
                                        // ebay 驳回
                                        url=jsPath+X.configer[localParm.m].api.ebayReject;
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
                                            var type=$('input[name=type]',"#productAuditLayerBox").attr('index-data');
                                            // ebay
                                            if(platform=='1'){
                                                // 选择刊登方式
                                                if(!type){
                                                    $("#jd-type").testRemind("请选择刊登方式");
                                                    return false;
                                                }else if(type=='Limit'){
                                                    var startTime=$("input[name=cronBeginDate]","#productAuditLayerBox").val(),
                                                        endTime=$("input[name=cronEndDate]","#productAuditLayerBox").val();
                                                    // 限时刊登
                                                    if(!startTime){
                                                        $("input[name=cronBeginDate]","#productAuditLayerBox").testRemind("开始刊登时间不能为空");
                                                        return false;
                                                    }
                                                    if(!endTime){
                                                        $("input[name=cronEndDate]","#productAuditLayerBox").testRemind("结束刊登时间不能为空");
                                                        return false;
                                                    }
                                                    if(endTime<=startTime){
                                                        $("input[name=cronEndDate]","#productAuditLayerBox").testRemind("结束时间必须大于开始时间");
                                                        return false;
                                                    }
                                                }else if(type=='Unlimit'){
                                                    var startTime=$("input[name=cronBeginDate]","#productAuditLayerBox").val(),
                                                        timeInterval=$("input[name=timeInterval]","#productAuditLayerBox").val();
                                                    // 不限时刊登
                                                    if(!startTime){
                                                        $("input[name=cronBeginDate]","#productAuditLayerBox").testRemind("开始刊登时间不能为空");
                                                        return false;
                                                    }
                                                    if(!timeInterval){
                                                        $("input[name=timeInterval]","#productAuditLayerBox").testRemind("时间间隔不能为空");
                                                        return false;
                                                    }
                                                }
                                            }else{
                                                return true;
                                            }
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
                    }
                }else{
                    productCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });

        });

        // 批量审核(amazon/newegg审核)
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
                            if(platform=='2'){
                                // amazon 通过
                                url=jsPath+X.configer[localParm.m].api.amazonPassed;
                                sendData={ids:aId};
                            }else if(platform=='3'){
                                // newegg 通过
                                url=jsPath+X.configer[localParm.m].api.neweggPassed;
                                sendData={ids:aId};
                            }
                        }else if(audit=='reject'){
                            if(platform=='2'){
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



        // 设置通用定时
        $('.js-publishSetCommon').off().on("click", function () {
            productCtrl.renderIn("#layerPublishBoxTmpl",".layerCon",{siteList:siteList});
            $.layer({
                title : '设置通用定时',
                area : ['550px', '410px'],
                dialog : {
                    btns : 2,
                    btn : ['确认', '取消'],
                    type : 8,
                    msg :$('.layerCon').html(),
                    yes: function(index){
                        $("#publishSiteForm").submit();
                    }
                },
                success:function () {
                    $('.layerCon').html("");
                    $.testRemind.css.zIndex=$('.xubox_shade').css('zIndex')+1;
                    // 刊登日期设置
                    productCtrl.tirgger('timeSet',null,null,"#publishSiteForm",'time');
                    // 下拉列表
                    sele(".select","#publishSiteForm",function (index,val) {
                        // 站点切换
                        if($(this).attr('id')=='jd-NewSite'){
                            var siteInfo=siteList[index];
                            productCtrl.request({
                                data:JSON.stringify({
                                    "site":index
                                 }),
                                type:'post',
                                url:jsPath+X.configer[localParm.m].api.ebayCronRule
                            }).then(function(data){
                                if(data.statusCode=='2000000'){
                                    // 有数据
                                    if(data.data){
                                        $("#addRuleId").val(data.data.id);
                                        $('.startTime',"#publishSiteForm").val(data.data.cronBeginDate);
                                        $('.endTime',"#publishSiteForm").val(data.data.cronEndDate);
                                        $('.timeIntervalText',"#publishSiteForm").val(data.data.timeInterval);
                                    }else{
                                        $("#addRuleId").val('');
                                        $('.startTime',"#publishSiteForm").val('');
                                        $('.endTime',"#publishSiteForm").val('');
                                        $('.timeIntervalText',"#publishSiteForm").val('');
                                    }
                                    // 刊登日期设置
                                    productCtrl.tirgger('timeSet',data.data,siteInfo,"#publishSiteForm",'time');
                                }else{
                                    productCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                                }
                            });
                        }else if($(this).attr('id')=='jd-publishType'){
                            // 刊登方式(不限时)
                            if(index=='Unlimit'){
                                $('.timeInterval').show();
                                $('.cronEndDate').hide();
                            }else if(index=='Limit'){
                                $('.timeInterval').hide();
                                $('.cronEndDate').show();
                            }
                        }
                    });

                    // 表单验证
                    $("#publishSiteForm").html5Validate(function () {
                        var id=$("#addRuleId").val(),
                            site=$("input[name=type]","#publishSiteForm").attr('index-data'),
                            type=$("input[name=publishType]","#publishSiteForm").attr('index-data'),
                            cronBeginDate=$("input[name=cronBeginDate]","#publishSiteForm").val(),
                            cronEndDate=$("input[name=cronEndDate]","#publishSiteForm").val(),
                            timeInterval=$("input[name=timeInterval]","#publishSiteForm").val(),
                            url=id?(jsPath+X.configer[localParm.m].api.cronRuleUpdate):(jsPath+X.configer[localParm.m].api.cronRuleSave),
                            sendData={
                                id:id?id:null,
                                site:site?site:null,
                                type:type?type:null,
                                cronBeginDate:cronBeginDate?cronBeginDate:null,
                                cronEndDate:type=='Limit'?(cronEndDate?cronEndDate:null):null,
                                timeInterval:type=='Unlimit'?(timeInterval?Number(timeInterval):null):null
                            };
                            productCtrl.request({
                                data:JSON.stringify(sendData),
                                type:'post',
                                url:url
                            }).then(function (data) {
                                if(data.statusCode=='2000000'){
                                     productCtrl.tirgger('setTips','刊登规则添加成功',function () {
                                        layer.close(layer.index);
                                        gl_sp.router.runCallback();
                                     });

                                }else{
                                    productCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                                }
                            });

                    },{
                        validate:function () {
                            var type=$('input[name=publishType]',"#publishSiteForm").attr('index-data');
                           // 选择刊登方式
                            if(type=='Limit'){
                                var startTime=$("input[name=cronBeginDate]","#publishSiteForm").val(),
                                    endTime=$("input[name=cronEndDate]","#publishSiteForm").val();
                                // 限时刊登
                                if(!startTime){
                                    $("input[name=cronBeginDate]","#publishSiteForm").testRemind("开始刊登时间不能为空");
                                    return false;
                                }
                                if(!endTime){
                                    $("input[name=cronEndDate]","#publishSiteForm").testRemind("结束刊登时间不能为空");
                                    return false;
                                }
                                if(endTime<=startTime){
                                    $("input[name=cronEndDate]","#publishSiteForm").testRemind("结束时间必须大于开始时间");
                                    return false;
                                }
                            }else if(type=='Unlimit'){
                                var startTime=$("input[name=cronBeginDate]","#publishSiteForm").val(),
                                    timeInterval=$("input[name=timeInterval]","#publishSiteForm").val();
                                // 不限时刊登
                                if(!startTime){
                                    $("input[name=cronBeginDate]","#publishSiteForm").testRemind("开始刊登时间不能为空");
                                    return false;
                                }
                                if(!timeInterval){
                                    $("input[name=timeInterval]","#publishSiteForm").testRemind("时间间隔不能为空");
                                    return false;
                                }
                            }
                            return true;
                        }
                    });

                }
            });
        });

    });

    // 刊登时间设置
    productCtrl.on('timeSet',function (siteRuleData,siteInfo,ele,dataType) {
        var dateFomat=dataType=='time'?'HH:mm:ss':'yyyy-MM-dd HH:mm:ss',
            siteInfo=siteInfo?siteInfo:{mistiming:0};
        // 开始刊登时间：
        $(".startTime",ele).off().on("click",function(){
            var day=new Date(),
                days=day.pattern("yyyy-MM-dd HH:mm:ss"),
                getDate=siteRuleData?(day.pattern("yyyy-MM-dd")+' '+siteRuleData.cronBeginDate):days,
                _that=this;
            laydate({
                istime: true,
                elem : _that,
                istoday:dataType=='time'?false:true,
                event : 'focus',
//                min: dataType=='time'?days:false,
                start:getDate>days?getDate:days,
                format: 'YYYY-MM-DD hh:mm:ss',
                hideData: dataType=='time'?true:false,
                choose:function(date) {
                    var siteDate=new Date(date).getTime()+parseFloat(siteInfo.mistiming)*60*60*1000;
                    if(!siteDate){
                        siteDate=newDateAndTime(date).getTime()+parseFloat(siteInfo.mistiming)*60*60*1000;
                        $('.startTime',ele).val(newDateAndTime(date).pattern(dateFomat));
                    }else{
                        $('.startTime',ele).val(new Date(date).pattern(dateFomat));
                    }
                    $('.startTime',ele).siblings('span').show().find('em').html(new Date(siteDate).pattern(dateFomat));
                }
            });
        });

        // 结束刊登时间：
        $(".endTime",ele).off().on("click",function(){
            var day=new Date(),
                days=day.pattern("yyyy-MM-dd HH:mm:ss"),
                getDate=siteRuleData?(day.pattern("yyyy-MM-dd")+' '+siteRuleData.cronEndDate):days,
                _that=this;
            laydate({
                istime: true,
                elem : _that,
                istoday:dataType=='time'?false:true,
                event : 'focus',
//                min: dataType=='time'?days:false,
                start:new Date(getDate)>day?getDate:days,
                format: 'YYYY-MM-DD hh:mm:ss',
                hideData: dataType=='time'?true:false,
                choose:function(date) {
                   var siteDate=new Date(date).getTime()+parseFloat(siteInfo.mistiming)*60*60*1000;
                   if(!siteDate){
                        siteDate=newDateAndTime(date).getTime()+parseFloat(siteInfo.mistiming)*60*60*1000;
                        $('.endTime',ele).val(newDateAndTime(date).pattern(dateFomat));
                    }else{
                        $('.endTime',ele).val(new Date(date).pattern(dateFomat));
                    }
                    $('.endTime',ele).siblings('span').show().find('em').html(new Date(siteDate).pattern(dateFomat));

                }
            });
        });
        // 间隔时间设置
        $('.timeIntervalText',ele).val(siteRuleData?siteRuleData.timeInterval:'');
    })

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
            startPublishDate=$('[name=startPublishDate]','#publishSearchForm').html(),
            endPublishDate=$('[name=endPublishDate]','#publishSearchForm').html(),
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
                startPublishDate:startPublishDate?startPublishDate:null,
                endPublishDate:endPublishDate?endPublishDate:null,
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

    function newDateAndTime(dateStr){
        var ds = dateStr.split(" ")[0].split("-");
        var ts = dateStr.split(" ")[1].split(":");
        var r = new Date();
        r.setFullYear(ds[0],ds[1] - 1, ds[2]);
        r.setHours(ts[0], ts[1], ts[2], 0);
        return r;
    }

})(mXbn);
