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
                    data.data.platform=platform;
                     // 组合多规格数据(拼合规格名规格值)
                    if(data.data.after.variationType=='multiVariation'){
                        if(data.data.after.commodityVariations.length){
                            data.data.after.commodityVariations.title=data.data.after.commodityVariations[0].variationNames.split('###');
                            data.data.after.totalStock=0;//库存
                            data.data.after.varyPrice=[];//销售价格
                            if(platform=='1'){
                                $.each(data.data.after.commodityVariations,function(i,vary){
                                    $.each(vary.variationDetails,function (m,commodity) {
                                        commodity.aVariationValue=commodity.variationValues.split("###");
                                        data.data.after.totalStock+=commodity.variationStock;
                                        data.data.after.varyPrice.push(parseFloat(commodity.variationPrice));
                                    });
                                });
                            }else if(platform=='2' || platform=='3'){
                                $.each(data.data.after.commodityVariations,function(i,vary){
                                    vary.aVariationValue=vary.variationValues.split("###");
                                    data.data.after.totalStock+=vary.variationStock;
                                    data.data.after.varyPrice.push(parseFloat(vary.variationPrice));
                                });
                            }
                            var min=Math.min.apply(null,data.data.after.varyPrice);
                            var max=Math.max.apply(null,data.data.after.varyPrice);
                            if(min==max){
                                data.data.after.varyPrice=min;
                            }else{
                                data.data.after.varyPrice=min +'-'+max;
                            }
                        }
                    }
                    if(data.data.before && data.data.before.variationType=='multiVariation'){
                        if(data.data.before && data.data.before.commodityVariations.length){
                            data.data.before.commodityVariations.title=data.data.before.commodityVariations[0].variationNames.split('###');
                            data.data.before.totalStock=0;//库存
                            data.data.before.varyPrice=[];//销售价格
                            if(platform=='1'){
                                $.each(data.data.before.commodityVariations,function(i,vary){
                                    $.each(vary.variationDetails,function (m,commodity) {
                                        commodity.aVariationValue=commodity.variationValues.split("###");
                                        data.data.before.totalStock+=vary.variationStock;
                                        data.data.before.varyPrice.push(parseFloat(vary.variationPrice));
                                    });
                                });
                            }else if(platform=='2' || platform=='3'){
                                $.each(data.data.before.commodityVariations,function(i,vary){
                                    vary.aVariationValue=vary.variationValues.split("###");
                                    data.data.before.totalStock+=vary.variationStock;
                                    data.data.before.varyPrice.push(parseFloat(vary.variationPrice));
                                });
                            }
                            var min=Math.min.apply(null,data.data.before.varyPrice);
                            var max=Math.max.apply(null,data.data.before.varyPrice)
                            if(min==max){
                                data.data.before.varyPrice=min;
                            }else{
                                data.data.before.varyPrice=min +'-'+max;
                            }
                        }

                    }
                    // 获取用户详情
                    productCtrl.request({
                        type:'get',
                        url:jsPath + X.configer[localParm.m].api.userDetail+data.data.after.userId,
                    }).then(function (userData) {
                        if(userData.statusCode=='2000000'){
                            data.data.after.userDetail=userData.data;
                        }else{
                            productCtrl.tirgger('setTips',X.getErrorName(userData.statusCode));
                        }
                    });
                    if(platform=='1'){
                        // 获取运费模板
                        productCtrl.request({
                            type:'post',
                            data:JSON.stringify({
                                ids:data.data.before?[data.data.after.shippingId,data.data.before.shippingId]:[data.data.after.shippingId],
                                xbniaoUserID:data.data.after.userId
                            }),
                            url:jsPath + X.configer[localParm.m].api.shipInfo
                        }).then(function (shipData) {
                            if(shipData.statusCode=='2000000'){
                                data.data.after.shipData=shipData.data.templateCommodityShippingList[0];
                                if(data.data.before){
                                    data.data.before.shipData=shipData.data.templateCommodityShippingList[1];
                                }                                
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
                            siteId:data.data.before?(data.data.after.site+','+data.data.before.site):data.data.after.site,
                        })
                    }).then(function (returnData) {
                        if(returnData.statusCode=='2000000'){
                            if(returnData.data){
                                data.data.after.returnData=returnData.data[0];
                                if(data.data.before){
                                    data.data.before.returnData=returnData.data[1];
                                }                                
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
                                "categoryId":data.data.after.firstCategory,
                                "site":data.data.after.site
                            })
                        }).then(function (productStatus) {
                            if(productStatus.statusCode=='2000000'){
                                data.data.after.productStatus={};
                                $.each(productStatus.data.categoryConditions,function (i,condition) {
                                    data.data.after.productStatus[condition.value]=condition;
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
                            ids:data.data.before?[data.data.after.addressId,data.data.before.addressId]:[data.data.after.addressId]
                        })
                    }).then(function(addressData){
                        if(addressData.statusCode=='2000000'){
                            if(addressData.data){
                                data.data.after.address=addressData.data.shippingAddressInfoList[0];// 设置发货地址详情
                                if(data.data.before){
                                    data.data.before.address=addressData.data.shippingAddressInfoList[1];
                                }
                                
                            }
                            // 获取商品全部分类路径
                            productCtrl.request({
                                type:'post',
                                url:jsPath + X.configer[localParm.m].api.catePath,
                                data:JSON.stringify({
                                    categoryId:data.data.before?((platform=='1'?data.data.after.firstCategory:data.data.after.category)+','+(platform=='1'?data.data.before.firstCategory:data.data.before.category)):(platform=='1'?data.data.after.firstCategory:data.data.after.category)
                                })
                            }).then(function (cateFullPathData) {
                                if(cateFullPathData.statusCode=='2000000'){
                                    if(cateFullPathData.data){
                                        data.data.after.cateFullPath=cateFullPathData.data[0];
                                        if(data.data.before){
                                            data.data.before.cateFullPath=cateFullPathData.data[1];
                                        }
                                        
                                    }
                                    // 设置商品状态
                                    data.data.after.chkStatus=data.data.after.commodityChk.chkStatus;
                                    data.data.after.cronStatus=data.data.after.commodityCron?data.data.after.commodityCron.cronStatus:data.data.after.commodityCron;
                                    data.data.after.operateType=data.data.after.commodityOperate.operateType;
                                    data.data.after.operateMode=data.data.after.commodityOperate.operateMode;
                                    data.data.after.operateStage=data.data.after.commodityOperate.operateStage;
                                    data.data.siteList=siteList;//设置站点列表
                                    data.data.after.publishStatus=statuSite(data.data.after);
                                    productCtrl.render(data.data).then(function(){
                                        if(platform=='1'){
                                            var iframeBefore = document.getElementById("wordDiscribeIframe_before");
                                            if( iframeBefore &&  data.data.before && data.data.before.description){
                                                setIframeContent(iframeBefore, data.data.before.description);
                                            };

                                            var iframeAfter = document.getElementById("wordDiscribeIframe_after");
                                            if( iframeAfter &&  data.data.after && data.data.after.description){
                                                setIframeContent(iframeAfter, data.data.after.description);
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
            // 审核驳回切换
            $('input[name=audit]',".productAuditBox").off().on('change',function(){
                var type=$('input[name=audit]:checked',".productAuditBox").val();
                if(type=='passed'){
                    $(".rejectBox").hide();
                }else{
                    $(".rejectBox").show();
                }
            });

            $('.js-editProductSubmit').off().on('click',function(){
                $(".productAuditBox").submit();
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
            $(".productAuditBox").html5Validate(function(){
                var url='',
                    sendData={ids:[productId]},
                    audit=$('input[name=audit]:checked',".productAuditBox").val();
                if(audit=='passed'){
                    if(platform=='1'){
                        // amazon 通过
                        url=jsPath+X.configer[localParm.m].api.ebayPassed;
                    }else if(platform=='2'){
                        // amazon 通过
                        url=jsPath+X.configer[localParm.m].api.amazonPassed;
                    }else if(platform=='3'){
                        // newegg 通过
                        url=jsPath+X.configer[localParm.m].api.neweggPassed;
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
                        ids:[productId],
                        chkReason:$('[name=chkReason]',".productAuditBox").val()
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
                    var seletAudit=$('input[name=audit]:checked',".productAuditBox").val();
                    // 审核通过
                    if(seletAudit=="passed"){
                        return true;
                    }else if(seletAudit=='reject'){
                        // 审核驳回
                        if(!$('[name=chkReason]',".productAuditBox").val()){
                            $('[name=chkReason]',".productAuditBox").testRemind("驳回原因不能为空");
                            return false;
                        }
                    }
                    return true;
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
