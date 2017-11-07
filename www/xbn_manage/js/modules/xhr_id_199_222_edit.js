;
(function (X) {

    var gl_pz = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__;

    var jsPath=X.configer.__API_PATH__;
    
    var localParm=gl_pz.utils.getRequest();

    var saleproductCtrl = gl_pz.ctrl();

    // 创建视图
    saleproductCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    var getProductId=mXbn().utils.getRequest().id;
    // 获取所有基础服务站点
    saleproductCtrl.request({
        url:jsPath + X.configer[localParm.m].api.siteList,
        type:'get'
    }).then(function (siteData) {
        if(siteData.statusCode=='2000000'){
            // 物流基础信息加载页面
            if(getProductId){
                // 修改
                saleproductCtrl.request({
                    url:jsPath + X.configer[localParm.m].api.getProductDetail+getProductId,
                    type: "post"
                }).then(function(data){
                    if(data.statusCode=='2000000'){
                        data.data.data=siteData.data; //设置站点信息
                        var selectSite=data.data.baseProducts?data.data.baseProducts.split(','):[];
                        data.data.selectSite={};
                        $.each(selectSite,function (i,site) {
                            data.data.selectSite[site]=site;
                        });
                        // 获取营业执照
                        getRelationPicture(X,[getProductId],function (filedata) {
                            if(filedata.length>0){
                                data.data.fileOriginalurl =filedata[0].fileOriginalurl;
                                data.data.relFileId=filedata[0].relFileId;
                            }
                            saleproductCtrl.render(data.data).then(function(){
                                // 触发页面dom事件
                                saleproductCtrl.tirgger('dom_init',"#id_conts");
                            });
                        });                        
                        
                    }else{
                        saleproductCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                    }           
                });
            }else{
                // 新增
                saleproductCtrl.render(siteData).then(function(){
                    // 触发页面dom事件
                    saleproductCtrl.tirgger('dom_init',"#id_conts");
                });
            }
        }else{
            saleproductCtrl.tirgger('setTips',X.getErrorName(siteData.statusCode));
        }
    });

    
    

    // 初始化dom事件
    saleproductCtrl.on('dom_init',function(ele){
        // 提交
        $('.js-saveSaleProduct',ele).off().on('click',function(){
            $("#saleProductFrom").submit();
        });

        // 上传宣传图片
        var $_file = $("#jd-pictureId");
        gl_pz.uploadFile($_file, function (D) {
            if (D.statusCode == "2000000") {
                $_file.closest('dd').find('img').attr('src',D.data.fileUrl).attr('data-filedid',D.data.fileId).show();
                $_file.closest('dd').find('input[type=hidden]').attr('data-change','1').val(D.data.fileId);
            }
        });

        // 查看图片
        $('#saleProductFrom').undelegate().delegate('img','click',function () {
            var imgUrl=$(this).attr('src');
            $.layer({
                title:'查看图片',
                area: ['540px', '540px'],
                dialog:{
                    btn:1,
                    btn:['返回'],
                    type:8,
                    msg:'<div class="tips mB20"><img src="'+imgUrl+'" style="max-width:520px;max-height:520px"/></div>',
                    yes:function(index){
                        layer.close(index);                        
                    }
                }
            });
        });

        // 表单验证
        $("#saleProductFrom").html5Validate(function(){
            var url='',
                sendData=null,
                baseProducts=[];
            sendData={
                productName:$('input[name=productName]',"#saleProductFrom").val(),
                price:$('input[name=price]',"#saleProductFrom").val(),
                productUnit:$('input[name=productUnit]',"#saleProductFrom").val(),
                productIntroduction:$('[name=productIntroduction]',"#saleProductFrom").val(),
                productType:$('input[name=productType]',"#saleProductFrom").attr('index-data'),//销售类型
                isRecommended:$('input[name=isRecommended]',"#saleProductFrom").attr('index-data'),//是否推荐产品
                productStatus:$('input[name=productStatus]',"#saleProductFrom").attr('index-data') //是否推荐产品
            }
            // 修改
            if(getProductId){
                url=jsPath + X.configer[localParm.m].api.editSaveProduct;
                sendData.productureId=$('input[name=serviceId]',"#saleProductFrom").val();
            }else{
                url=jsPath + X.configer[localParm.m].api.productSaveProduct; // 新增 
            }
            $('input[name=baseProducts]:checked',"#saleProductFrom").each(function (i,radio) {
                baseProducts.push($(this).val());
            });
            sendData.baseProducts=baseProducts.join(',');
            // 提交修改/添加
            saleproductCtrl.request({
                url:url,
                data:JSON.stringify(sendData),
                type:'post'
            }).then(function(data){
                if(data.statusCode=="2000000"){
                    var isChange=$('input[name=pictureId]',"#saleProductFrom").attr('data-change');
                    if(isChange){
                        // 保存图片关联关系
                        updateRelationShip(X,{
                            data:{
                                "ids": [getProductId?getProductId:data.data], 
                                "list" : [{
                                        "relBelong": getProductId?getProductId:data.data,
                                        "fileId": $('input[name=pictureId]',"#saleProductFrom").val()
                                    }]
                            }
                        });
                    }
                    var isEdit = getProductId ? "销售产品修改成功" : "销售产品添加成功";
                    saleproductCtrl.tirgger('setTips',isEdit,function(){
                        gl_pz.router.setHistory("?m=xhr_id_199_222");
                        gl_pz.router.runCallback();
                    });
                }else{
                    saleproductCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });
        },{
            validate:function () {
                if(!$('[name=baseProducts]:checked').length){
                    $('[name=baseProducts]:first').testRemind('请选择包含基础产品');
                    return false;
                }
                return true;
            }
        });

        // 下拉列表
        sele();

        // 上传图片(Todo)
        
    });

     // 提示消息弹框方法定义
    saleproductCtrl.on('setTips',function(msg,callback){
        if(!msg) return;
        $.layer({
            title:'提示消息',
            area: ['500px', '200px'],
            dialog:{
                btn:1,
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
