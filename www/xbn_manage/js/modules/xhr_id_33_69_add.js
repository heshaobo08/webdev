;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var brandCtrl = gl_hy.ctrl();

    var localParm=gl_hy.utils.getRequest();

    // 创建视图
    brandCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    brandCtrl.render().then(function(){
        brandCtrl.tirgger('dom_event_init',"#id_conts");
    });


    // 初始化页面所有dom事件
    brandCtrl.on('dom_event_init',function(ele){

        // 商标类型change
        $('input[type=radio][name=brandType]').on('change',function(){
            var type= $('input[type=radio][name=brandType]:checked').val();
            var explain=$(this).closest('dd').find('.explaintext');
            if(type=='TM'){
                explain.show();
            }else{
                explain.hide();
            }
        });

        // 查看图片
        $('#addBrandForm').undelegate().delegate('img','click',function () {
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
        }).undelegate('.js-delThis','click').delegate('.js-delThis','click',function () {
            // 删除图片
            $(this).parent('a').remove()
        });

        // 名称验证
        $('.js-checkName').off().on('blur',function () {
            var name=$(this).attr('name'),
                userId=$('input[name=userId]',"#addBrandForm").val(),
                _that=$(this);
            if(!userId){
                _that.testRemind('请选择关联账户');
                return false;
            }
            sendData={
                userId:userId
            };
            sendData[name]=$(this).val();
            brandCtrl.request({
                url:jsPath+X.configer[localParm.m].api.nameCheck,
                data:JSON.stringify(sendData),
                type:'post',
                async:false
            }).then(function (data) {
                 if(data.statusCode=='2000000'){
                    if(data.data){
                        _that.testRemind('该品牌名称已存在，请重新输入');
                        _that.focus();
                        return false;
                    }
                 }else{
                    brandCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                 }
            });
        });

        // 下拉列表
        sele('.select','body',function(indexData,val,select){
            // 经营模式change
            if($(this).attr('id')=="jd-businessModel"){
                if(indexData=='own'){
                    $("#businessOwn").show();
                    $("#businessAgent").hide();
                    $(".centifyAgent").hide();
                    $(".centifyOwn").show();
                }else{
                    $("#businessOwn").hide();
                    $("#businessAgent").show();
                    $(".centifyAgent").show();
                    $(".centifyOwn").hide();
                }
            }
        });

        // 上传图片logo
        var $_logofile = $("#js-centifyLogo");
        gl_hy.uploadFile($_logofile, function (logodate) {
            var arr=logodate.data.fileUrl.split(".");
            var type=arr[arr.length-1];
            if (logodate.statusCode == "2000000") {
                if(type=='bmp'){
                    $("#js-centifyLogo").testRemind("不能上传bmp格式图片");
                    return false; 
                }
                $_logofile.closest('a').siblings('[name=centifyLogo]').val(logodate.data.fileId);
                $_logofile.closest('a').siblings('img').attr('src',logodate.data.fileUrl).attr('data-filedId',logodate.data.fileId).show();
            }
        });

        // 上传资质证书
        var $_file = $("#js-uploadImgId");
        gl_hy.uploadFile($_file, function (D) {
            var arr=D.data.fileUrl.split(".");
            var type=arr[arr.length-1];
            if (D.statusCode == "2000000") {
                if($.html5Validate.isAllpass($_file)){
                    if($(".setPic img").length >= 5){
                        $("#js-uploadImgId").testRemind("最多上传5张图片");
                        return false;
                    }
                    if(type=='bmp'){
                        $("#js-uploadImgId").testRemind("不能上传bmp格式图片");
                        return false; 
                    }
                }
                $_file.closest('a').siblings("[name=cnetifyLiencense]").val(D.data.fileId);
                $_file.closest('a').siblings(".setPic").append('<a href="javascript:;" class="imgLink"><img src="' + D.data.fileUrl + '" class="mR20 fL" data-filedId="'+D.data.fileId+'"/><span class="js-delThis">X</span></a>');
            }
        });

        // 表单提交
        $(".js-addBrandSUbmit").off().on('click',function(){
            $("#addBrandForm").submit();
        });

        var onOff = false;

        // 添加关联账号
        $('.js-addRelatedAccount',ele).off().on('click',function(){
            brandCtrl.renderIn('#addRelatedTmpl','.layercon');
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
                        brandCtrl.request({
                            url:jsPath + X.configer[localParm.m].api.userList+$('.orderBySelectField').val()+'/1',
                            type:'get'
                        }).then(function(data){
                            if(data.statusCode=='2000000'){
                                if(data.data.auditStatus == 5){
                                    onOff = true;
                                }else{
                                    onOff = false;
                                }
                                if(!data.data) return;
                                var text='';
                                if(!data.data.id){
                                    text='<tr><td colspan="3">无相应用户存在。</td></tr>'
                                }else if(data.data.isQualificationMax){
                                    text+='<tr><td><input type="radio" class="discountType" required name="discountType_last" disabled></td><td>'+(data.data.name||'')+'</td><td>'+data.data.mobile+'</td><td>到达上限</td></tr>';
                                }else{
                                    text+='<tr><td><input type="radio" class="discountType" required name="discountType_last" value="'+data.data.id+'" data-value="'+(data.data.name||'')+'###'+data.data.mobile+'"></td><td>'+(data.data.name||'')+'</td><td>'+data.data.mobile+'</td><td>未达上限</td></tr>';
                                };
                                $('#selectRelatedUser').html(text);
                                $('.bigTable').show();
                            }else{
                                brandCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
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

        // 表单验证
        $("#addBrandForm").html5Validate(function(){
            var userId=$('input[name=userId]',"#addBrandForm").val(),
                businessModel=$('input[name=businessModel]',"#addBrandForm").attr('index-data'),
                brandType=businessModel=='own'?$('input[name=brandType]:checked',"#addBrandForm").val():$('input[name=brandType]:visible',"#addBrandForm").val(),
                brandExpireTime=$('.showExpireName:visible',"#addBrandForm").html(),
                cnName=$('input[name=cnName]',"#addBrandForm").val(),
                enName=$('input[name=enName]',"#addBrandForm").val(),
                sendData={
                    "userId":userId?userId:null,
                    "businessModel": businessModel?businessModel:null,
                    "brandType": brandType?brandType:null,
                    "brandExpireTime":brandExpireTime?brandExpireTime:null,
                    "cnName":cnName?cnName:null,
                    "enName":enName?enName:null
                };
            if(onOff){

                brandCtrl.request({
                    data:JSON.stringify(sendData),
                    url:jsPath+X.configer[localParm.m].api.brandAdd,
                    type:'post'
                }).then(function(data){
                    if(data.statusCode=='2000000'){
                        var id=data.data.id;
                        // 更新图片
                        var arrayList = [];
                        var jsons = {};
                        // 资质证书
                        $(".setPic img").each(function(index, element) {
                            jsons = {
                                "relBelong": id,
                                "fileId": $(element).attr("data-filedId"),
                                "sort": "",
                                'type':'1'
                            }
                            arrayList.push(jsons);
                        });
                        // logog关联
                        arrayList.push({
                            "relBelong": id,
                            "fileId": $('[name=centifyLogo]').val(),
                            "sort": "",
                            'type':'0'
                        });
                        if(arrayList.length){
                            updateRelationShip(X , {
                                data :{
                                    "ids": [id],
                                    "list" : arrayList
                                }
                            });
                        }
                        brandCtrl.tirgger('setTips','添加品牌成功！',function(){
                            gl_hy.router.setHistory("?m=xhr_id_33_69");
                            gl_hy.router.runCallback();

                        });
                    }else{
                        brandCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                    }
                });
            }else{
                brandCtrl.tirgger('setTips','用户未入住不能添加品牌！');
            }
        },{
            validate:function(){
                var businessModel=$('input[name=businessModel]',"#addBrandForm").attr('index-data');
                // 自有品牌
                if(businessModel=='own' && !$('input[type=radio][name=brandType]:checked',"#addBrandForm").length){
                    $('input[type=radio][name=brandType]:first',"#addBrandForm").testRemind("至少选择一项");
                    return false;
                }else if(businessModel=='agent' && $('input[name=brandType]:visible',"#addBrandForm").val()==''){
                    $('input[name=brandType]:visible',"#addBrandForm").testRemind("请输入内容");
                    return false;
                }
                if($('.showExpireName:visible').html()==''){
                    $('.showExpireName:visible').testRemind("请选择有效期");
                    return false;
                }
                if($('#startTime').html() && GetTimeByTimeStr($('#startTime').html())<new Date()){
                    $('#startTime').testRemind("该时间不能小于当前时间");
                    return false;
                }
                return true;
            }
        });

         // 开始时间
        $(".timeStart,#startTime").on("click",function(){
            laydate({
                istime: true,
                elem : '#startTime',
                event : 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

         // 开始时间
        $(".stimeStart,#sstartTime").on("click",function(){
            laydate({
                istime: true,
                elem : '#sstartTime',
                event : 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });



    });



    // 提示消息弹框方法定义
    brandCtrl.on('setTips',function(msg,callback){
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

    //将字符串转换为时间格式,适用各种浏览器,格式如2011-08-03 09:15:11
    function GetTimeByTimeStr(dateStr) {
        if(dateStr){
            var timeArr=dateStr.split(" ");
            var d=timeArr[0].split("-");
            var t=timeArr[1].split(":");
            return new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);
        }else{
            console.error('GetTimeByTimeStr的参数不能为空')
            return '';
        }
    }


})(mXbn);
