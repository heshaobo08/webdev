;
(function (X) {

    var gl_sp = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var productCtrl = gl_sp.ctrl();

    var localParm=gl_sp.utils.getRequest(),

        siteList={},

        platform=localParm.p,

        url='',

        siteRuleData={},

        siteInfo={},

        productId=localParm.id;

    // 创建视图
    productCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };
    // 设置获取平台详情url
    if(platform=='1'){
        url=jsPath+X.configer[localParm.m].api.ebayDetail;
    }else if(platform=='2'){
        url=jsPath+X.configer[localParm.m].api.amazonDetail;
    }else if(platform=='3'){
        url=jsPath+X.configer[localParm.m].api.neweggDetail;
    }

    // 获取平台详情
    productCtrl.request({
        url:jsPath+X.configer[localParm.m].api.siteConfigList,
        type:'get'
    }).then(function(siteConfigDate){
        if(siteConfigDate.statusCode=='2000000'){               
            $.each(siteConfigDate.data,function(i,site){
                //site.productUrlPre=site.commodityPrefixUrl.split("${itemId}")[0];
                siteList[site.id]=site;
            });    
        }else{
            productCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
        }                                        
    }); 

    // 获取详情
    if(productId){
        productCtrl.request({
            type:'post',
            url:url,
            data:JSON.stringify({
                id:productId
            })
        }).then(function(data){
            if(data.statusCode=='2000000'){
                // 获取用户详情
                productCtrl.request({
                    type:'get',
                    url:jsPath + X.configer[localParm.m].api.userDetail+data.data.userId
                }).then(function (userData) {
                    if(userData.statusCode=='2000000'){
                        data.data.userDetail=userData.data;
                    }else{
                        productCtrl.tirgger('setTips',X.getErrorName(userData.statusCode));
                    }
                });
                
                data.data.platform=platform;
                // 组合多规格数据(拼合规格名规格值)                
                if(data.data.variationType=='multiVariation'){
                    if(data.data.commodityVariations){
                        data.data.commodityVariations.title=data.data.commodityVariations[0].variationNames.split('###');
                        data.data.totalStock=0;//库存
                        data.data.varyPrice=[];//销售价格
                        if(platform=='1'){
                            $.each(data.data.commodityVariations,function(i,vary){
                                $.each(vary.variationDetails,function (m,commodity) {
                                    commodity.aVariationValue=commodity.variationValues.split("###");
                                    data.data.totalStock+=commodity.variationStock;
                                    data.data.varyPrice.push(parseFloat(commodity.variationPrice));
                                });
                            });
                        }else if(platform=='2' || platform=='3'){
                            $.each(data.data.commodityVariations,function(i,vary){
                                vary.aVariationValue=vary.variationValues.split("###");
                                data.data.totalStock+=vary.variationStock;
                                data.data.varyPrice.push(parseFloat(vary.variationPrice));
                            });
                        }
                        var min=Math.min.apply(null,data.data.varyPrice);
                        var max=Math.max.apply(null,data.data.varyPrice)
                        if(min==max){
                            data.data.varyPrice=min;
                        }else{
                            data.data.varyPrice=min +'-'+max;
                        }                        
                    }
                }              

                if(platform=='1'){
                    // 获取运费模板
                    productCtrl.request({
                        type:'post',
                        data:JSON.stringify({
                            ids:[data.data.shippingId],
                            xbniaoUserID:data.data.userId
                        }),
                        url:jsPath + X.configer[localParm.m].api.shipInfo
                    }).then(function (shipData) {
                        if(shipData.statusCode=='2000000'){
                            data.data.shipData=shipData.data.templateCommodityShippingList[0];
                        }else{
                            productCtrl.tirgger('setTips',X.getErrorName(shipData.statusCode));
                        }
                    });
                }

                // 获取退货政策
                productCtrl.request({
                    type:'post',
                    url:jsPath + X.configer[localParm.m].api.getReturnPolicyById,
                    data:JSON.stringify({
                        siteId:data.data.site,
                        pageSize:1,
                        cPageNo:1
                    })
                }).then(function (returnData) {
                    if(returnData.statusCode=='2000000'){
                        if(returnData.data.list){
                            data.data.returnData=returnData.data.list[0];
                        }                        
                    }else{
                        productCtrl.tirgger('setTips',X.getErrorName(returnData.statusCode));
                    }
                });

                if(platform=='1'){
                    // 获取商品状况数据
                    productCtrl.request({
                        type:'post',
                        url:jsPath + X.configer[localParm.m].api.getCategoryCondition,
                        async:false,
                        data:JSON.stringify({
                            "categoryId":data.data.firstCategory,
                            "site":data.data.site
                        })
                    }).then(function (productStatus) {
                        if(productStatus.statusCode=='2000000'){
                            data.data.productStatus={};
                            $.each(productStatus.data.categoryConditions,function (i,condition) {
                                data.data.productStatus[condition.value]=condition;
                            });
                        }else{
                            productCtrl.tirgger('setTips',X.getErrorName(productStatus.statusCode));
                        }
                    });
                }


                 // 获取商品发货地址
                productCtrl.request({
                    type:'post',
                    url:jsPath + X.configer[localParm.m].api.addressInfo,
                    data:JSON.stringify({
                        ids:[data.data.addressId]
                    })
                }).then(function(addressData){
                    if(addressData.statusCode=='2000000'){
                        if(addressData.data){
                            data.data.address=addressData.data.shippingAddressInfoList[0];// 设置发货地址详情
                        }

                        // 获取商品全部分类路径
                        productCtrl.request({
                            type:'get',
                            url:jsPath + X.configer[localParm.m].api.catePath+(platform=='1'?data.data.firstCategory:data.data.category)
                        }).then(function (cateFullPathData) {
                            if(cateFullPathData.statusCode=='2000000'){
                                if(cateFullPathData.data){
                                    data.data.cateFullPath=cateFullPathData.data;
                                }
                                // 设置商品状态
                                data.data.chkStatus=data.data.commodityChk.chkStatus;
                                data.data.cronStatus=data.data.commodityCron?data.data.commodityCron.cronStatus:data.data.commodityCron;
                                data.data.operateType=data.data.commodityOperate.operateType;
                                data.data.operateMode=data.data.commodityOperate.operateMode;
                                data.data.operateStage=data.data.commodityOperate.operateStage;
                                data.data.siteList=siteList;//设置站点列表
                                data.data.publishStatus=statuSite(data.data);
                                // 获取站点规则数据
                                productCtrl.request({
                                    data:JSON.stringify({
                                        "site":data.data.site
                                     }),
                                    type:'post',
                                    url:jsPath+X.configer[localParm.m].api.ebayCronRule
                                }).then(function(siteDetail){
                                    if(data.statusCode=='2000000'){
                                        siteInfo=siteList[data.data.site];
                                        if(siteInfo){
                                            siteRuleData=siteDetail.data;
                                        }              
                                        productCtrl.render(data.data).then(function(){
                                            if(platform=='1'){
                                                var iframe = document.getElementById("wordDiscribeIframe");
                                                if( iframe &&  data.data && data.data.description){
                                                    setIframeContent(iframe, data.data.description);
                                                }
                                            }
                                            // dom 初始化渲染
                                            productCtrl.tirgger('dom_event_init',"#id_conts");
                                        });       
                                    }else{
                                        productCtrl.tirgger('setTips',X.getErrorName(siteDetail.statusCode));
                                    }
                                });
                            }else{
                                productCtrl.tirgger('setTips',X.getErrorName(cateFullPathData.statusCode));
                            }
                        });
                                                                                      
                    }else{
                        productCtrl.tirgger('setTips',X.getErrorName(addressData.statusCode));
                    }                            
                });
            }else{
                productCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
            }
        });
    }

    // dom init
    productCtrl.on('dom_event_init',function(ele){
        // 设置关联图
        addRelationImg(X,productCtrl,1);
        // 切换
        $('.tabBtn>li',ele).off().on('click',function(){
            var index=$(this).index();
            $('.tabBtn>li',ele).removeClass('this');
            $(this).addClass('this');
            $('.showMainProduct .details').hide();
            $('.showMainProduct .details').eq(index).show();
        });

        // 审核
        $('.js-editProductSubmit').off().on('click',function () {
            $("#productAuditLayerBox").submit();
        })

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

        // 查看图片
        $('.details .pic_show,.details .productTable').undelegate().delegate('img','click',function () {
            var imgUrl=$(this).attr('src');
            $.layer({
                title:'查看图片',
                area: ['520', 'auto'],
                dialog:{
                    btn:1,
                    btn:['返回'],
                    type:8,
                    msg:'<div style="text-align:center"><img src="'+imgUrl+'" style="max-width:500px;max-height:500px" /></div>',
                    yes:function(index){
                        layer.close(index);
                    }
                },
                success:function (index) {
                    index.find(".xubox_dialog").css({
                        maxHeight : "505px"
                    });    
                }    
            });
        });
        // 表单验证
        $("#productAuditLayerBox").html5Validate(function(){
            var url='',
                sendData={},
                audit=$('input[name=audit]:checked',"#productAuditLayerBox").val();
            if(audit=='passed'){
                var timeInterval=$('input[name=timeInterval]',"#productAuditLayerBox").val();
                sendData={
                    ids:[productId],
                    type:$('input[name=type]',"#productAuditLayerBox").attr('index-data'),
                    cronBeginDate:$('input[name=cronBeginDate]',"#productAuditLayerBox").val(),
                    cronEndDate:$('input[name=cronEndDate]',"#productAuditLayerBox").val(),
                    timeInterval:timeInterval?Number(timeInterval):null
                };
                if(platform=='1'){
                    // ebay 通过
                    url=jsPath+X.configer[localParm.m].api.ebayPassed;
                }else if((platform=='2')){
                    url=jsPath+X.configer[localParm.m].api.amazonPassed;
                }else if((platform=='3')){
                    url=jsPath+X.configer[localParm.m].api.neweggPassed;
                }
            }else if(audit=='reject'){                                                             
                sendData={
                    ids:[productId],
                    chkReason:$('[name=chkReason]',"#productAuditLayerBox").val()
                };
                if(platform=='1'){
                    // ebay 通过
                    url=jsPath+X.configer[localParm.m].api.ebayReject;
                }else if((platform=='2')){
                    url=jsPath+X.configer[localParm.m].api.amazonReject;
                }else if((platform=='3')){
                    url=jsPath+X.configer[localParm.m].api.neweggReject;
                }
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

    });

    // 刊登时间设置
    productCtrl.on('timeSet',function (siteRuleData,siteInfo,ele,dataType) {
        var dateFomat=dataType=='time'?'HH:mm:ss':'yyyy-MM-dd HH:mm:ss',
            siteInfo=siteInfo?siteInfo:{mistiming:0};

        // 开始刊登时间：
        $("#editProtimeStart",ele).off().on("focus",function(){
            var day=new Date(),
                days=day.pattern("yyyy-MM-dd HH:mm:ss"),
                getDate=siteRuleData?(day.pattern("yyyy-MM-dd")+' '+siteRuleData.cronBeginDate):days;
            laydate({
                istime: true,
                elem : '#editProtimeStart',
                event : 'focus',
                min: days, 
                start:getDate>days?getDate:days,
                format: 'YYYY-MM-DD hh:mm:ss',
                choose:function(date) {
                    
                    var siteDate=new Date(date).getTime()+parseFloat(siteInfo.mistiming?siteInfo.mistiming:0)*60*60*1000;
                    if(!siteDate){
                        siteDate=newDateAndTime(date).getTime()+parseFloat(siteInfo.mistiming?siteInfo.mistiming:0)*60*60*1000;
                        $('#editProtimeStart',ele).val(newDateAndTime(date).pattern(dateFomat));
                    }else{
                        $('#editProtimeStart',ele).val(new Date(date).pattern(dateFomat));
                    }                    
                    $('#editProtimeStart',ele).siblings('span').show().find('em').html(new Date(siteDate).pattern(dateFomat));
                }
            });
        });

        // 结束刊登时间：
        $("#editProendTime",ele).off().on("focus",function(){
            var day=new Date(),
                days=day.pattern("yyyy-MM-dd HH:mm:ss"),
                getDate=siteRuleData?(day.pattern("yyyy-MM-dd")+' '+siteRuleData.cronEndDate):days;
            laydate({
                istime: true,
                elem : '#editProendTime',
                event : 'focus',
                min: days, 
                start:new Date(getDate)>day?getDate:days,
                format: 'YYYY-MM-DD hh:mm:ss',
                choose:function(date) {
                    var siteDate=new Date(date).getTime()+parseFloat(siteInfo.mistiming?siteInfo.mistiming:0)*60*60*1000;
                   if(!siteDate){
                        siteDate=newDateAndTime(date).getTime()+parseFloat(siteInfo.mistiming?siteInfo.mistiming:0)*60*60*1000;
                        $('#editProendTime',ele).val(newDateAndTime(date).pattern(dateFomat));
                    }else{
                        $('#editProendTime',ele).val(new Date(date).pattern(dateFomat));                        
                    }
                    $('#editProendTime',ele).siblings('span').show().find('em').html(new Date(siteDate).pattern(dateFomat));  
                }
            });
        });
        // 间隔时间设置
        $('.timeIntervalText',ele).val(siteRuleData?siteRuleData.timeInterval:'');
    })
    
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
