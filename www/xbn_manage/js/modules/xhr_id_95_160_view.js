;
(function (X) {

    var gl_sp = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var productCtrl = gl_sp.ctrl();

    var localParm=gl_sp.utils.getRequest(),

        siteList={},

        languageList={},

        productId=localParm.id;

    // 创建视图
    productCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    // 获取站点列表
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
            productCtrl.tirgger('setTips',X.getErrorName(siteConfigDate.statusCode));
        }
    });

    //获取语言字典信息
    productCtrl.request({
        url:jsPath+X.configer[localParm.m].api.getDict,
        type:'post',
        data:JSON.stringify({types:['language']}),
    }).then(function(langData){
        if(langData.statusCode=='2000000'){
            //重组语言数据
            $.each(langData.data.language,function(i,lang){
                languageList[lang.id]=lang;
            });
        }else{
            productCtrl.tirgger('setTips',X.getErrorName(langData.statusCode));
        }
    });

    // 获取详情
    if(productId){
        productCtrl.request({
            type:'post',
            url:jsPath + X.configer[localParm.m].api.mainProductDetail,
            data:JSON.stringify({
                id:productId
            })
        }).then(function(data){
            if(data.statusCode=='2000000'){
                data.data.totalStock=0;//库存
                data.data.varyPrice=[];//销售价格
                // 组合多规格数据(拼合规格名规格值)
                if(data.data.variationType=='multiVariation'){
                    $.each(data.data.commodityVariations,function(i,vary){
                        vary.aVariation=vary.variationNames.split("###");
                        vary.aVariationValue=vary.variationValues.split("###");
                        data.data.totalStock+=vary.variationStock;
                        data.data.varyPrice.push(parseFloat(vary.variationPrice));
                    });
                    // data.data.varyPrice=Math.min.apply(null,data.data.varyPrice)+' - '+Math.max.apply(null,data.data.varyPrice);
                }

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
                // 获取商品关联站点详情
                productCtrl.request({
                    type:'post',
                    url:jsPath + X.configer[localParm.m].api.siteDetail,
                    data:JSON.stringify({
                        id:productId
                    })
                }).then(function(siteData){
                        // 获取商品分类
                        if(siteData.statusCode=='2000000'){
                            if(siteData.data){
                                $.each(siteData.data,function(i,site){
                                    site.produectSiteStatusShow=statuSite(site);
                                    site.sku=site.sku.slice(1,-1).replace(/([a-zA-z\d]*)\-([a-zA-z\d\,\-]*)/g,function(){
                                        return arguments[2]
                                    });
                                });

                                data.data.siteDetail=siteData.data;//设置站点详情
                            }

                            // 获取商品全部分类路径
                             productCtrl.request({
                                type:'get',
                                url:jsPath + X.configer[localParm.m].api.catePath+data.data.categoryId
                            }).then(function (cateFullPathData) {
                                if(cateFullPathData.statusCode=='2000000'){
                                    if(cateFullPathData.data){
                                        data.data.cateFullPath=cateFullPathData.data;
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
                                            data.data.siteList=siteList;//设置站点列表
                                            data.data.languageList=languageList;  //设置商品语言
                                            productCtrl.render(data.data).then(function(){
                                                var iframe = document.getElementById("wordDiscribeIframe");
                                                if( iframe &&  data.data.commodityLang && data.data.commodityLang.langRichDescription){
                                                    setIframeContent(iframe, data.data.commodityLang.langRichDescription);
                                                }
                                                // dom 初始化渲染
                                                productCtrl.tirgger('dom_event_init',"#id_conts");
                                            });
                                        }else{
                                            productCtrl.tirgger('setTips',X.getErrorName(addressData.statusCode));
                                        }
                                    });
                                }else{
                                    productCtrl.tirgger('setTips',X.getErrorName(cateFullPathData.statusCode));
                                }
                            });


                        }else{
                            productCtrl.tirgger('setTips',X.getErrorName(siteData.statusCode));
                        }
                    });
                // 获取商品分组
                productCtrl.request({
                    url:jsPath + X.configer[localParm.m].api.getGroupName,
                    type:'post',
                    data:JSON.stringify({groupId:data.data.commodityGroup})
                }).then(function (groupData) {
                    if(groupData.statusCode=='2000000'){
                        data.data.groupData=groupData.data;
                    }else{
                        productCtrl.tirgger('setTips',X.getErrorName(groupData.statusCode));
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
