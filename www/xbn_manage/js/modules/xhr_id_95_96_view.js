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
                site.productUrlPre=site.commodityPrefixUrl?site.commodityPrefixUrl.split("${itemId}")[0]:'';
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
                    url:jsPath + X.configer[localParm.m].api.userDetail+data.data.userId,
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
                    if(data.data.commodityVariations && data.data.commodityVariations.length){
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
                        data:JSON.stringify({
                            "categoryId":data.data.firstCategory,
                            "site":data.data.site
                        }),
                        async:false
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
                                data.data.siteList=siteList;//设置站点列表
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

        // 批量下线
        $('.js-productOffLine').off().on("click", function () {
            // 模板渲染
            productCtrl.renderIn("#layerBoxTmpl",".layerCon",{platform:platform});
            $.layer({
                title : '下线',
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

                    $.testRemind.css.zIndex=$('.xubox_shade').css('zIndex')+1;

                    // 表单验证
                    $("#productAuditLayerBox").html5Validate(function(){
                        var url='',
                            sendData={};
                        if(platform=='1'){
                             // amazon 下线
                            url=jsPath+X.configer[localParm.m].api.ebayOffline;
                        }else if(platform=='2'){
                             // amazon 下线
                            url=jsPath+X.configer[localParm.m].api.amazonOffline;
                        }else if(platform=='3'){
                             // newegg 下线
                            url=jsPath+X.configer[localParm.m].api.neweggOffline;
                        }                                
                        sendData={
                            ids:[productId],
                            endReason:$('[name=chkReason]',"#productAuditLayerBox").val()
                        };
                        productCtrl.request({
                            data:JSON.stringify(sendData),
                            url:url,
                            type:'post'
                        }).then(function(data){
                            if(data.statusCode=='2000000'){
                                productCtrl.tirgger('setTips','操作成功',function(){
                                    layer.close(layer.index);
                                    gl_sp.router.runCallback('?m=xhr_id_95_96');
                                });                                    
                            }else{
                                productCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                            }
                        });
                    });
                }
            });

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
