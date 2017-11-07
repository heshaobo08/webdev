;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var joinCtrl = gl_hy.ctrl();

    var localParm=gl_hy.utils.getRequest();

    var joinId=localParm.id,
        dictionaryBankList=[]; //银行基础数据

    // 创建视图
    joinCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    // 获取银行基础信息
    joinCtrl.request({
        url:jsPath + X.configer[localParm.m].api.dictionaryList,
        type:'post',
        data:JSON.stringify({
            types:['opening_bank']
        })
    }).then(function(data){
        if(data.statusCode=='2000000'){
            // 设置基础服务银行列表
            dictionaryBankList=data.data["opening_bank"];
        }else{
            joinCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
        }
        // 非编辑
        if(!joinId){

            // 新增
            joinCtrl.render().then(function(){
                joinCtrl.renderIn("#companyTmpl","#infos",{
                    dictionaryBankList:dictionaryBankList,
                    fileOriginalurl : "",
                    businessLicense : "",
                    averageSkuPrice : "",
                    bankdata : "",
                    bankrelFileId : "",
                });

                joinCtrl.tirgger('dom_init_event','#id_conts');
            });
        }
    });



    // 编辑  Todo 确认银行基础服务加入点
    if(joinId){
        joinCtrl.request({
            url:jsPath + X.configer[localParm.m].api.settledDetail+joinId,
            type: "GET"
        }).then(function(data){
            if(data.statusCode=='2000000'){
                var userId=data.data.userId;
                // 获取用户详情
                joinCtrl.request({
                    url:jsPath + X.configer[localParm.m].api.userDetail+userId,
                    type: "GET"
                }).then(function(userData){
                    if(userData.statusCode=='2000000'){
                        if(data.data.companyType == 2){
                            data.data.userDetail=userData.data; //用户详情
                            // 个人身份证图片
                            getRelationPicture(X, [joinId], function (filedata) {
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
                                joinCtrl.render(data.data).then(function(){
                                    joinCtrl.tirgger('dom_init_event','#id_conts',data.data);
                                });
                            });
                        }else{
                            // 获取营业执照
                            getRelationPicture(X,[joinId],function (filedata) {
                                if(filedata.length>0){
                                    data.data.fileOriginalurl =filedata[0].fileOriginalurl;
                                    data.data.relFileId=filedata[0].relFileId;
                                }else{
                                    data.data.fileOriginalurl=null;//默认图像
                                    data.data.relFileId=null;
                                }
                            });
                            // 获取银行数据信息
                            joinCtrl.request({
                                url:jsPath + X.configer[localParm.m].api.bankDetail+userId,
                                type: "GET"
                            }).then(function(bankData){
                                if(bankData.statusCode=='2000000'){
                                    data.data.userDetail=userData.data; //用户详情
                                    data.data.bankdata=bankData.data;    //银行信息
                                    data.data.dictionaryBankList=dictionaryBankList; //基础服务银行列表
                                    if(bankData.data){
                                        // 获取银行开户图片
                                        getRelationPicture(X,[bankData.data.id],function (filedata) {

                                            if(filedata.length>0){
                                                data.data.bankfileOriginalurl =filedata[0].fileOriginalurl;
                                                data.data.bankrelFileId=filedata[0].relFileId;
                                            }else{
                                                data.data.bankfileOriginalurl=null;//默认图像
                                                data.data.bankrelFileId=null;
                                            }
                                            // 模板渲染
                                            joinCtrl.render(data.data).then(function(){
                                                joinCtrl.tirgger('dom_init_event','#id_conts',data.data);
                                            });
                                        });
                                    }else{
                                        // 模板渲染
                                        joinCtrl.render(data.data).then(function(){
                                            joinCtrl.tirgger('dom_init_event','#id_conts',data.data);
                                        });
                                    }

                                }else{
                                    joinCtrl.tirgger('setTips',X.getErrorName(bankData.statusCode));
                                }
                            });
                        }

                    }else{
                        joinCtrl.tirgger('setTips',X.getErrorName(userData.statusCode));
                    }
                });
            }else{
                joinCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
            }
        });
    }

    // event 初始化
    joinCtrl.on('dom_init_event',function(ele,data){
        console.log(data);
        if(joinId){
            if(data.companyType == 2){//个人
                joinCtrl.renderIn("#singleTmpl","#infos",data);
                singlePic();
            }else{
                joinCtrl.renderIn("#companyTmpl","#infos",data);
                companyPic();
            }

        }else{
            $("[name=cType]").on("click",function(){
                var that = $(this);
                var companyType = that.val();
                if(companyType == 2){//个人
                    joinCtrl.renderIn("#singleTmpl","#infos");
                    singlePic();
                }else{//企业
                    joinCtrl.renderIn("#companyTmpl","#infos",{
                        dictionaryBankList:dictionaryBankList,
                        fileOriginalurl : "",
                        businessLicense : "",
                        averageSkuPrice : "",
                        bankdata : "",
                        bankrelFileId : "",
                    });
                    companyPic();
                }
                address();
            })
            companyPic();
        }

        address();
        function address(){
            if(data){
                $("#addRelateSubmitForm").citySelect({
                    "pId":'#addressData',
                    "setId" : ["jd-province","jd-city" ,"jd-county"],
                    "setVal":[data.province,data.city,data.county]
                });
                $("#addRelateSubmitForm").citySelect({
                    "pId":'#addressData1',
                    "setId" : ["jd-province1","jd-city1" ,"jd-county1"],
                    "setVal":[data.province,data.city,data.county]
                });
            }else{
                $("#addRelateSubmitForm").citySelect({
                    "pId":'#addressData',
                    "setId" : ["jd-province","jd-city" ,"jd-county"]
                });
                $("#addRelateSubmitForm").citySelect({
                    "pId":'#addressData1',
                    "setId" : ["jd-province1","jd-city1" ,"jd-county1"]
                });
            }
        }

        // 验证唯一性
        /*$('.js-verify').off().on('blur', function () {
            var name = $(this).attr('name'),
                value = $(this).val(),
                that = this;
            console.log(123);
            if ($.html5Validate.isAllpass($(this))) {

            }
        });*/


        // 密码验证
//        $('input[name=companyName]').off().on('change input', function () {
//            if ($.html5Validate.isAllpass($(this))) {
//                if ($(this).val()<=10 ) {
//                    $(this).testRemind("确认密码与登录密码不同，请重新输入");
//                }
//            }
//        });

        // 查看图片
        $('#addRelateSubmitForm').undelegate().delegate('img','click',function () {
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


        // 添加关联账号
        $("#infos").off('click','.js-addRelatedAccount').on('click','.js-addRelatedAccount',function(){
            joinCtrl.renderIn('#addRelatedTmpl','.layercon');
            $.layer({
                title:'添加关联账号',
                area: ['600px', '200px'],
                dialog:{
                    btns:2,
                    btn:['确定','取消'],
                    type:8,
                    msg:$('.layercon').html(),
                    yes:function(index){
                        $("#addRelatedUserSelectTable").submit();
                    }
                },
                success:function(){
                    // 控制层级
                    $.testRemind.css.zIndex=$('.xubox_shade').css('zIndex')+1;
                    $('.layercon').html('');
                    // 下拉
                    sele('.select','#addRelateForm');

                    // 搜索关联账户
                    $('.js-selectRelatedSearch').off().on('click',function(){
                        $("#addRelateForm").submit();
                    });

                    // 表单验证(搜索用户)
                    $("#addRelateForm").html5Validate(function(){
                        // 筛选关联用户
                        joinCtrl.request({
                            url:jsPath + X.configer[localParm.m].api.userList+$('.orderBySelectField').val()+'/0',
                            type:'get'
                        }).then(function(data){
                            if(data.statusCode=='2000000'){
                                if(!data.data) return;
                                var text='';
                                if(!data.data.id){
                                    text='<tr><td colspan="3">无相应用户存在。</td></tr>'
                                }else if(data.data.auditStatus=='0'){
                                    text+='<tr><td><input type="radio" class="discountType" required name="discountType_last" value="'+data.data.id+'" data-value="'+(data.data.name||'')+'###'+data.data.mobile+'"></td><td>'+(data.data.name||'')+'</td><td>'+data.data.mobile+'</td><td>未入驻</td></tr>';
                                }else{
                                    text+='<tr><td><input type="radio" class="discountType" required disabled  name="discountType_last" value="'+data.data.id+'"></td><td>'+(data.data.name||'')+'</td><td>'+data.data.mobile+'</td><td>已入驻</td></tr>';
                                }
                                $('#selectRelatedUser').html(text);
                                $('.bigTable').show();
                            }else{
                                joinCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                            }
                        });
                    });

                    // 选择用户
                    $("#addRelatedUserSelectTable").html5Validate(function(){
                        var selectId=$("#selectRelatedUser input:checked").val();
                        if(!selectId){
                            $(".js-selectRelatedSearch").testRemind("请选择一个关联账户");
                            return false;
                        }
                        var other=$("#selectRelatedUser input:checked").attr('data-value').split('###');
                        $('.related').show().find('input[name=userId]').val(selectId);
                        $('.related').find('.relatedMobile').html(other[1]);
                        $('.related').find('.relatedName').html(other[0]);
                        layer.close(layer.index);
                    });
                }
            })
        });

        // 提交入驻申请
        $('.js-addRelatedUserSubmit').off().on('click',function(){
            $("#addRelateSubmitForm").submit();
        });

        function companyPic(){
        // 上传图片营业执照
        var $_file=$('#js-businessLicense');
        gl_hy.uploadFile($_file, function (D) {
            if (D.statusCode == "2000000") {
                $_file.closest('a').siblings('[name=businessLicense]').attr('data-change','1').val(D.data.fileId);
                $(".businessLicenseImg").show().find('img').attr('src',D.data.fileUrl);
            }
        });

        // 上传图片银行开户许可证
        var $_bankfile=$('#js-bankLicense');
        gl_hy.uploadFile($_bankfile, function (D) {
            if (D.statusCode == "2000000") {
                $_bankfile.closest('a').siblings('[name=bankLicense]').attr('data-change','1').val(D.data.fileId);
                $(".bankLicenseImg").show().find('img').attr('src',D.data.fileUrl);
            }
        });
        }
        function singlePic(){
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
        }
        // 企业\个人提交表单验证
        $("#addRelateSubmitForm").html5Validate(function(){
            var companyType = "";
            if($("[name=companyType]").val()){
                companyType = $("[name=companyType]").val();
            }else{
                companyType = $("[name=cType]:checked").val();
            }
            // 商家信息
            var companyName=$('input[name=companyName]',"#addRelateSubmitForm").val(),
                id=$('input[name=id]').val(),
                province=$('input[name=province]',"#addRelateSubmitForm").attr('index-data'),
                city=$('input[name=city]',"#addRelateSubmitForm").attr('index-data'),
                county=$('input[name=county]',"#addRelateSubmitForm").attr('index-data'),
                address=$('input[name=address]',"#addRelateSubmitForm").val(),
                postcode=$('input[name=postcode]',"#addRelateSubmitForm").val(),
                legalRepresent=$('input[name=legalRepresent]',"#addRelateSubmitForm").val(),
                registeredNo=$('input[name=registeredNo]',"#addRelateSubmitForm").val(),
                skuTotal=$('input[name=skuTotal]',"#addRelateSubmitForm").val(),
                averageSkuPrice=$('input[name=averageSkuPrice]',"#addRelateSubmitForm").attr('index-data'),
                userId=$('input[name=userId]',"#addRelateSubmitForm").val(),
                description=$('[name=description]',"#addRelateSubmitForm").val();
            var sendCompanyInfo={
                "companyName":companyName?companyName:null,
                'province':province?province:null,
                'city':city?city:null,
                'county':county?county:null,
                'address':address?address:null,
                'postcode':postcode?postcode:null,
                'legalRepresent':legalRepresent?legalRepresent:null,
                'registeredNo':registeredNo?registeredNo:null,
                'skuTotal':skuTotal?skuTotal:null,
                'averageSkuPrice':averageSkuPrice?averageSkuPrice:null,
                'description':description?description:null,
                'userId':userId?userId:null,
                'companyType': companyType
            };
            if(companyType != 2){
                // 银行信息
                var bankId=$('input[name=bankId]',"#addRelateSubmitForm").val(),
                    userId=$('input[name=userId]',"#addRelateSubmitForm").val(),
                    bank=$('input[name=bank]',"#addRelateSubmitForm").attr('index-data'),
                    branch=$('input[name=branch]',"#addRelateSubmitForm").val(),
                    accountName=$('input[name=accountName]',"#addRelateSubmitForm").val(),
                    bankAccount=$('input[name=bankAccount]',"#addRelateSubmitForm").val();
                var bankInfo= {
                        "companyId":id?id:null,
                        "userId":userId?userId:null,
                        "bank": bank?bank:null,
                        "branch":branch?branch:null,
                        "accountName": accountName?accountName:null,
                        "bankAccount": bankAccount?bankAccount:null
                    };
                var bankUrl='';
                if(bankId){
                    bankInfo.id=bankId;
                    bankUrl=jsPath + X.configer[localParm.m].api.bankUpdate;
                }else{
                    bankUrl=jsPath + X.configer[localParm.m].api.bankApply;
                }
            }
            var applyUrl='';
            // 编辑
            if(joinId){
                applyUrl=jsPath + X.configer[localParm.m].api.settledUpdate;
                sendCompanyInfo.id=joinId;
            }else{
                // 新增
                applyUrl=jsPath + X.configer[localParm.m].api.settledApply;
            }

            // 提交商家信息
            joinCtrl.request({
                data:JSON.stringify(sendCompanyInfo),
                type:'post',
                url:applyUrl
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    if(companyType != 2){
                        //Todo 保存营业执照关联关系
                        var isChange=$('input[name=businessLicense]',"#addRelateSubmitForm").attr('data-change');
                        if(isChange){
                            // 保存图片关联关系
                            updateRelationShip(X,{
                                data:{
                                    "ids": [id?id:data.data.id],
                                    "list" : [{
                                            "relBelong": id?id:data.data.id,
                                            "fileId": $('input[name=businessLicense]',"#addRelateSubmitForm").val()
                                        }]
                                }
                            });
                        }
                        joinCtrl.request({
                            data:JSON.stringify(bankInfo),
                            type:'post',
                            url:bankUrl
                        }).then(function(bankDate){
                            if(bankDate.statusCode=='2000000'){
                                //Todo 保存银行开户图片关系
                                var isChange=$('input[name=bankLicense]',"#addRelateSubmitForm").attr('data-change');
                                if(isChange){
                                    // 保存图片关联关系
                                    updateRelationShip(X,{
                                        data:{
                                            "ids": [bankId?bankId:bankDate.data.id],
                                            "list" : [{
                                                    "relBelong": bankId?bankId:bankDate.data.id,
                                                    "fileId": $('input[name=bankLicense]',"#addRelateSubmitForm").val()
                                                }]
                                        }
                                    });
                                }
                                joinCtrl.tirgger('setTips','新增入驻提交成功',function(){
                                    gl_hy.router.setHistory('?m=xhr_id_33_58');
                                    gl_hy.router.runCallback();
                                });
                            }else{
                                joinCtrl.tirgger('setTips',X.getErrorName(bankDate.statusCode));
                            }
                        });
                    }else{
                        /*var isChange1=$('input[name=facefile]',"#addRelateSubmitForm").attr('data-change'),
                            isChange2=$('input[name=backfile]',"#addRelateSubmitForm").attr('data-change'),
                            isChange3=$('input[name=handsfile]',"#addRelateSubmitForm").attr('data-change'),
                            isChange4=$('input[name=paperfile]',"#addRelateSubmitForm").attr('data-change');*/
                        //保存图片关联关系
                        updateRelationShip(X,{
                            data:{
                                "ids": [joinId?joinId:data.data.id],
                                "list" : [{
                                    "relBelong": joinId?joinId:data.data.id,
                                    "fileId": $('input[name=facefile]',"#addRelateSubmitForm").val(),
                                    "sort": 2
                                },{
                                    "relBelong": joinId?joinId:data.data.id,
                                    "fileId": $('input[name=backfile]',"#addRelateSubmitForm").val(),
                                    "sort": 3
                                },{
                                    "relBelong": joinId?joinId:data.data.id,
                                    "fileId": $('input[name=handsfile]',"#addRelateSubmitForm").val(),
                                    "sort": 4
                                },{
                                    "relBelong": joinId?joinId:data.data.id,
                                    "fileId": $('input[name=paperfile]',"#addRelateSubmitForm").val(),
                                    "sort": 5
                                }]
                            }
                        });

                        joinCtrl.tirgger('setTips','新增入驻提交成功',function(){
                            gl_hy.router.setHistory('?m=xhr_id_33_58');
                            gl_hy.router.runCallback();
                        });

                    }
                }else{
                    joinCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });

        },{
            validate:function(){
                var companyType = "";
                if($("[name=companyType]").val()){
                    companyType = $("[name=companyType]").val();
                }else{
                    companyType = $("[name=cType]:checked").val();
                }
                if(companyType == 2){
                    var isValid=true;
                    var _val = $('input[name=registeredNo]',"#addRelateSubmitForm").val();
                    //身份证唯一性
                    joinCtrl.request({
                        data:JSON.stringify({id:joinId,registeredNo:_val}),
                        url:jsPath + X.configer[localParm.m].api.verify,
                        type:'post',
                        async:false
                    }).then(function(data){
                        if(data.statusCode=='2000000'){
                            if(!data.data){
                                $('input[name=registeredNo]',"#addRelateSubmitForm").testRemind("该证件号码已申请入驻");
                                isValid=false;
                            }
                        }
                    })
                    return isValid;
                }else{
                    var isValid=true;
                    // 提交商家信息
                    joinCtrl.request({
                        data:JSON.stringify({
                            id:$('[name=id]').val(),
                            companyName:$('[name=companyName]').val()
                        }),
                        type:'post',
                        url:jsPath + X.configer[localParm.m].api.verify,
                        async:false
                    }).then(function(data){
                        if(data.statusCode=='2000000'){
                            if(!data.data){
                                $('[name=companyName]').testRemind("企业名称重名，请重新输入！");
                                isValid=false;
                            }
                        }
                    });
                    if(!isValid){
                        return false;
                    }
                    // 提交商家信息
                    joinCtrl.request({
                        data:JSON.stringify({
                            id:$('[name=id]').val(),
                            registeredNo:$('[name=registeredNo]').val()
                        }),
                        type:'post',
                        url:jsPath + X.configer[localParm.m].api.verify,
                        async:false
                    }).then(function(data){
                        if(data.statusCode=='2000000'){
                            if(!data.data){
                                $('[name=registeredNo]').testRemind("工商注册号重名，请重新输入！");
                                isValid=isValid && false;
                            }
                        }
                    });
                    return isValid;
                }
            }
        });

        // 下拉列表
        sele('.otherSelect');
    });

     // 提示消息弹框方法定义
    joinCtrl.on('setTips',function(msg,callback){
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




