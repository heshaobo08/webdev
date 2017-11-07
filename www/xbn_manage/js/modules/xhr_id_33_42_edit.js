;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var userCtrl = gl_hy.ctrl();

    var localParm=gl_hy.utils.getRequest();

    // 创建视图
    userCtrl.view = {
        elem: "#id_conts",
        tpl: path + "/" + X.configer[localParm.m].tpl
    };

    var companyId=localParm.id;
    // 获取商家详情
    if(companyId){
        // 修改
        userCtrl.request({
            url:jsPath + X.configer[localParm.m].api.settledDetail+companyId,
            type: "GET",
        }).then(function(data){
            if(data.statusCode=='2000000'){
                var userId=data.data.userId;
                userCtrl.request({
                    url:jsPath + X.configer[localParm.m].api.userDetail+userId,
                    type: "GET",
                }).then(function(userData){
                    if(userData.statusCode=='2000000'){
                        data.data.userMobile=userData.data.mobile;
                        data.data.userEmail=userData.data.email;
                        if(data.data.companyType == 2){
                            // 个人身份证图片
                            getRelationPicture(X, [companyId], function (filedata) {
                                if (filedata.length > 0) {
                                    $.each(filedata,function(i,e){
                                        if(e.sort == 2){
                                            data.data.fileOriginalurl0 = e.fileOriginalurl;
                                            data.data.relFileId0 = e.relFileId;
                                        }else if(e.sort == 3){
                                            data.data.fileOriginalurl1 = e.fileOriginalurl;
                                            data.data.relFileId1 = e.relFileId;
                                        }else if(e.sort == 4){
                                            data.data.fileOriginalurl2 = e.fileOriginalurl;
                                            data.data.relFileId2 = e.relFileId;
                                        }else if(e.sort == 5){
                                            data.data.fileOriginalurl3 = e.fileOriginalurl;
                                            data.data.relFileId3 = e.relFileId;
                                        }
                                    })
                                } else {
                                    data.data.fileOriginalurl = null;//默认图像
                                    data.data.relFileId = null;
                                }
                                // 模板渲染
                                userCtrl.render(data.data).then(function(){
                                    // 触发页面dom事件
                                    userCtrl.tirgger('dom_init',"#id_conts",data.data);
                                });
                            });
                        }else{
                            // 获取营业执照
                            getRelationPicture(X,[companyId],function (filedata) {
                                if(filedata.length>0){
                                    data.data.fileOriginalurl =filedata[0].fileOriginalurl;
                                    data.data.relFileId=filedata[0].relFileId;
                                }else{
                                    data.data.fileOriginalurl=null;//默认图像
                                    data.data.relFileId=null;
                                }
                                userCtrl.render(data.data).then(function(){
                                    // 触发页面dom事件
                                    userCtrl.tirgger('dom_init',"#id_conts",data.data);
                                });
                            });
                        }
                    }else{
                        userCtrl.tirgger('setTips',X.getErrorName(userData.statusCode));
                    }
                });
            }else{
                userCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
            }
        })
    }


    // 初始化dom事件
    userCtrl.on('dom_init',function(ele,data){
        var companyType = data.companyType;
        // 提交
        $('.js-settledSubmit',ele).off().on('click',function(){
            $('#editUserForm').submit();
        });

        // 重置
        $('.js-logisReset',ele).off().on('click',function(){
            // Todo 重置
            $('#editUserForm')[0].reset();
        });

        // 三级联动 Todo
         $("#editUserForm").citySelect({
            "pId":'#addressData',
            "setId" : ["jd-province","jd-city" ,"jd-county"],
            "setVal":[data.province,data.city,data.county]
        });

        // 下拉列表
        sele('#jd-averageSkuPrice');

        if(companyType == 2){//个人
            // 身份证正面
            var $_facefile=$('#js-facefile');
            gl_hy.uploadFile($_facefile, function (D) {
                if (D.statusCode == "2000000") {
                    $_facefile.closest('a').siblings('[name=facefile]').attr('data-change','1').val(D.data.fileId);
                    $(".facefile").show().find('img').eq(0).attr('src',D.data.fileUrl);
                }
            });

            // 身份证反面
            var $_backfile=$('#js-backfile');
            gl_hy.uploadFile($_backfile, function (D) {
                if (D.statusCode == "2000000") {
                    $_backfile.closest('a').siblings('[name=backfile]').attr('data-change','1').val(D.data.fileId);
                    $(".backfile").show().find('img').eq(0).attr('src',D.data.fileUrl);
                }
            });

            // 手持身份证照
            var $_handsfile=$('#js-handsfile');
            gl_hy.uploadFile($_handsfile, function (D) {
                if (D.statusCode == "2000000") {
                    $_handsfile.closest('a').siblings('[name=handsfile]').attr('data-change','1').val(D.data.fileId);
                    $(".handsfile").show().find('img').eq(0).attr('src',D.data.fileUrl);
                }
            });

            // 手持手稿照
            var $_paperfile=$('#js-paperfile');
            gl_hy.uploadFile($_paperfile, function (D) {
                if (D.statusCode == "2000000") {
                    $_paperfile.closest('a').siblings('[name=paperfile]').attr('data-change','1').val(D.data.fileId);
                    $(".paperfile").show().find('img').eq(0).attr('src',D.data.fileUrl);
                }
            });

        }else{//企业
            // 上传图片
            var $_file=$('#js-businessLicense');
            gl_hy.uploadFile($_file, function (D) {
                if (D.statusCode == "2000000") {
                    $_file.closest('a').siblings('[name=businessLicense]').attr('data-change','1').val(D.data.fileId);
                    $(".businessLicenseImg").show().find('img').attr('src',D.data.fileUrl);
                }
            });
        }

        // 查看图片
        $('.businessLicenseImg img,.facefile img').off().on('click',function () {
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
        $("#editUserForm").html5Validate(function(){
            var id=$('input[name=id]',"#editUserForm").val();
            var sendData={
                "id": id,
                "companyName": $('input[name=companyName]',"#editUserForm").val(),
                "province": $('input[name=province]',"#editUserForm").attr('index-data'),
                "city": $('input[name=city]',"#editUserForm").attr('index-data'),
                "county": $('input[name=county]',"#editUserForm").attr('index-data'),
                "address": $('input[name=address]',"#editUserForm").val(),
                "postcode": $('input[name=postcode]',"#editUserForm").val(),
                "legalRepresent": $('input[name=legalRepresent]',"#editUserForm").val(),
                "registeredNo": $('input[name=registeredNo]',"#editUserForm").val(),
                "skuTotal": $('input[name=skuTotal]',"#editUserForm").val(),
                "averageSkuPrice":$('input[name=averageSkuPrice]',"#editUserForm").attr('index-data'),
                "remark": $('[name=remark]',"#editUserForm").val(),
                'description':$('[name=description]',"#editUserForm").val(),
                "companyType": companyType
            };
            userCtrl.request({
                data:JSON.stringify(sendData),
                url:jsPath + X.configer[localParm.m].api.settledEdit,
                type:'post'
            }).then(function(data){
                if(data.statusCode=='2000000'){

                    if(companyType == 2){//个人
                        //保存图片关联关系
                        updateRelationShip(X,{
                            data:{
                                "ids": [id?id:data.data.id],
                                "list" : [{
                                    "relBelong": id?id:data.data.id,
                                    "fileId": $('input[name=facefile]',"#editUserForm").val(),
                                    "sort": 2
                                },{
                                    "relBelong": id?id:data.data.id,
                                    "fileId": $('input[name=backfile]',"#editUserForm").val(),
                                    "sort": 3
                                },{
                                    "relBelong": id?id:data.data.id,
                                    "fileId": $('input[name=handsfile]',"#editUserForm").val(),
                                    "sort": 4
                                },{
                                    "relBelong": id?id:data.data.id,
                                    "fileId": $('input[name=paperfile]',"#editUserForm").val(),
                                    "sort": 5
                                }]
                            }
                        });

                    }else{
                        var isChange=$('input[name=businessLicense]',"#editUserForm").attr('data-change');

                        if(isChange){
                            // 保存图片关联关系
                            updateRelationShip(X,{
                                data:{
                                    "ids": [id],
                                    "list" : [{
                                            "relBelong": id,
                                            "fileId": $('input[name=businessLicense]',"#editUserForm").val()
                                        }]
                                }
                            });
                        }

                    }
                    userCtrl.tirgger('setTips','修改商家信息成功！',function(){
                        gl_hy.router.setHistory("?m=xhr_id_33_42");
                        gl_hy.router.runCallback();
                    });
                }else{
                    userCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });
        },{
            validate: function() {
                var isValid=true;
                var companyType = $("[name=companyType]").val();
                if(companyType == 2){//个人
                    var _val = $('input[name=registeredNo]',"#editUserForm").val();
                    //身份证唯一性
                    userCtrl.request({
                        data:JSON.stringify({id:companyId,registeredNo:_val}),
                        url:jsPath + X.configer[localParm.m].api.verify,
                        type:'post',
                        async:false
                    }).then(function(data){
                        if(data.statusCode=='2000000'){
                            if(!data.data){
                                $('input[name=registeredNo]',"#editUserForm").testRemind("该证件号码已申请入驻");
                                isValid=false;
                            }
                        }
                    })
                }
                return isValid;

            }
        });

    })

     // 提示消息弹框方法定义
    userCtrl.on('setTips',function(msg,callback){
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
        });
    });


})(mXbn);
