;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var brandCtrl = gl_hy.ctrl();

    var localParm=gl_hy.utils.getRequest();

    var brandId=localParm.id,

        returnUrl=localParm.r;
    // 创建视图
    brandCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    // 修改
    if(brandId){
        brandCtrl.request({
            url:jsPath+X.configer[localParm.m].api.brandDetail+brandId,
            type:'get'
        }).then(function(data){
            // 获取授权站点
            if(data.statusCode=='2000000'){
                brandCtrl.request({
                    url:jsPath+X.configer[localParm.m].api.brandAuthSite+brandId,
                    type:'get'
                }).then(function(siteData){
                    if(siteData.statusCode=='2000000'){
                        if(siteData.data){
                            data.data.siteAuthList=siteData.data; //授权站点
                        }
                        data.data.returnUrl=returnUrl;
                        // 获取品牌关联图片
                        getRelationPicture(X,[brandId],function (filedata) {

                            /*data.data.filedata={};
                            if(filedata.length>0){
                                $.each(filedata,function (i,img) {
                                    if(!data.data.filedata[img.type]){
                                        data.data.filedata[img.type]=[];
                                    }
                                    if(img.type=='0'){
                                        data.data.filedata[img.type]=img;
                                    }else{
                                        data.data.filedata[img.type].push(img);
                                    }
                                });
                            }*/


                            data.data.filedata = {};
                            //0为品牌图片，1为资质证书图片
                            var imgType = '0';
                            $.each(filedata, function (i, img) {
                                imgType = img.type != '0' ? '1' : '0';
                                if (!data.data.filedata[imgType]) {
                                    data.data.filedata[imgType] = [];
                                }
                                data.data.filedata[imgType].push(img);
                            });

                            // 模板渲染
                            brandCtrl.render(data.data).then(function(){
                                brandCtrl.tirgger('brandListRender',data.data);
                            });
                        });

                    }else{
                        brandCtrl.tirgger('setTips',X.getErrorName(siteData.statusCode));
                    }
                });

            }else{
                brandCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
            }
        });
    }

    // 初始化模板渲染
    brandCtrl.on('brandListRender',function(data){
        // dom event初始化
        brandCtrl.tirgger('dom-event-init',"#id_conts",data);
    });

    // 初始化页面所有dom事件
    brandCtrl.on('dom-event-init',function(ele,getBrandData){
        var addAuthSiteList=[], //要返回的授权站点数据
            selectData=null,
            id=brandId;

        // 获取未授权站点数据
        brandCtrl.request({
            url:jsPath+X.configer[localParm.m].api.brandNoAuthSite+id,
            type:'get'
        }).then(function(unAuthdata){
            if(unAuthdata.statusCode=='2000000'){
                getBrandData.unAuthList=unAuthdata.data;//设置未授权数据
            }else{
                brandCtrl.tirgger('setTips',X.getErrorName(unAuthdata.statusCode));
            }
        });

        // 名称验证
        $('.js-checkName').off().on('blur',function () {
            var name=$(this).attr('name'),
                _that=$(this),
                sendData={
                    id:$('input[name=id]',"#brandAuthFrom").val(),
                    userId:$('input[name=userId]',"#brandAuthFrom").val()
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

        // 表单验证
        $("#brandAuthFrom").html5Validate(function(){
            var businessModel=$('input[name=businessModel]:checked',"#brandAuthFrom").val(),
                id=$('input[name=id]',"#brandAuthFrom").val();
            var sendData={
                "id": id,
                "cnName":$('input[name=cnName]',"#brandAuthFrom").val(),
                "enName":$('input[name=enName]',"#brandAuthFrom").val(),
                "companyId":$('input[name=companyId]',"#brandAuthFrom").val(),
                "userId": $('input[name=userId]',"#brandAuthFrom").val(),
                "businessModel":businessModel ,
                "brandType": businessModel=='agent'?$('input[name=brandType]',"#brandAuthFrom").val():$('input[name=brandType]:checked',"#brandAuthFrom").val(),
                "brandExpireTime":$('[name=brandExpireTime]',"#brandAuthFrom").html()
            };
            brandCtrl.request({
                data:JSON.stringify(sendData),
                url:jsPath+X.configer[localParm.m].api.brandEdit,
                type:'post'
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    // 是否提交授权站点
                    if(addAuthSiteList.length){
                        //提交授权站点
                        brandCtrl.request({
                            data:JSON.stringify(addAuthSiteList),
                            url:jsPath+X.configer[localParm.m].api.addBrandAUth,
                            type:'post'
                        }).then(function(data){
                            if(data.statusCode=='2000000'){

                            }else{
                                brandCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                            }
                        });
                    }

                    // 更新图片
                    var arrayList = [];
                    var jsons = {};
                    // 资质证书
                    if($('.setPic').attr('data-change') || $('[name=centifyLogo]').attr('data-change')){
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
                    }
                    if(arrayList.length){
                        updateRelationShip(X , {
                            data :{
                                "ids": [id],
                                "list" : arrayList
                            }
                        });
                    }

                    brandCtrl.tirgger('setTips',"品牌修改成功！",function(){
                        if(returnUrl){
                            gl_hy.router.setHistory('?m='+returnUrl);
                        }else{
                            gl_hy.router.setHistory('?m=xhr_id_33_47');
                        }
                        gl_hy.router.runCallback();
                    });
                }else{
                    brandCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });
        },{
            validate:function(){
                var businessModel=$('input[name=businessModel]:checked').val();
                if(businessModel=='own' && !$('input[name=brandType]:checked').length){
                    $('input[type=radio][name=brandType]').testRemind("请至少选择一项");
                    return false;
                }else if(businessModel=='agent' && !$('input[type=text][name=brandType]').val()){
                    $('input[type=text][name=brandType]').testRemind("该内容不能为空");
                    return false;
                }
                if(GetTimeByTimeStr($('#startTime').html())<new Date()){
                    $('#startTime').testRemind("该时间不能小于当前时间");
                    return false;
                }
                if(!$('.setPic img').length){
                    $("#jd-uploadImgId").testRemind("资质证书不能为空");
                    return false;
                }
                return true;
            }
        });



        // 上传图片
        var $_file = $("#jd-uploadImgId");
        gl_hy.uploadFile($_file, function (D) {
            var arr=D.data.fileUrl.split(".");
            var type=arr[arr.length-1];
            if (D.statusCode == "2000000") {
                if($.html5Validate.isAllpass($_file)){
                    if($(".setPic img").length >= 5){
                        $("#jd-uploadImgId").testRemind("最多上传5张图片");
                        return false;
                    }
                    if(type=='bmp'){
                        $("#jd-uploadImgId").testRemind("不能上传bmp格式图片");
                        return false; 
                    }
                }
                $_file.closest('a').siblings("[name=cnetifyLiencense]").val(D.data.fileId);
                $(".setPic").attr('data-change','1').append('<a href="javascript:;" class="imgLink"><img src="' + D.data.fileUrl + '" class="mR20 fL" data-filedId="'+D.data.fileId+'"/><span class="js-delThis">X</span></a>');
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
                $_logofile.closest('a').siblings('[name=centifyLogo]').val(logodate.data.fileId).attr('data-change','1');
                $_logofile.closest('a').siblings('img').attr('src',logodate.data.fileUrl).attr('data-filedId',logodate.data.fileId).show();
            }
        });

        // 查看图片
        $('#brandAuthFrom').undelegate('img','click').delegate('img','click',function () {
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

        // 提交
        $('.js-brandAuthSubmit').off().on('click',function(){
            $("#brandAuthFrom").submit();


            var id = $('[name=id]').val();
            var arrayList = $.map($(".setPic img"),function(ele,i){
                return {
                    "relBelong": id,
                    "fileId": $(ele).attr("data-filedId"),
                    "sort": "",
                    'type':'1'
                }
            });
            arrayList.push({
                "relBelong": id,
                "fileId": $('#logoItem img').attr("data-filedId"),
                "sort": "",
                'type':'0'
            })

             updateRelationShip(X , {
                data :{
                    "ids": [id],
                    "list" : arrayList
                }
            });


        });

        // 经营模式change
        $('input[name=businessModel]',ele).off().on('click',function(){
            var type= $('input[name=businessModel]:checked',ele).val();
            // 自有商品
            if(type=='agent'){
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
        });

        // 商标类型change
        $(ele).undelegate('input[name=brandType]','change').delegate('input[name=brandType]','change',function(){
            var type= $('input[name=brandType]:checked',ele).val();
            var explain=$(this).closest('dd').find('.explainText');
            if(type=='TM'){
                explain.show();
            }else{
                explain.hide();
            }
        });

        //编辑授权站点
        $(".js-editBrandSite").off().on("click", function () {
            getBrandData.hasSelectData=selectData;
            brandCtrl.renderIn('#allSiteTmpl',".layercon",getBrandData);
            $.layer({
                title : '授权站点',
                area : ['550px', '360px'],
                dialog : {
                    btns : 2,
                    btn : ['确认', '取消'],
                    type : 8,
                    msg : $(".layercon").html(),
                    yes:function(index){
                        // 提交
                        $('#siteAuthEditForm').submit();
                        var text='';
                        $.each(addAuthSiteList,function(i,site){
                            text+="<a href='javascript:;' data-siteId='"+site.siteId+"'>"+site.siteName+"</a>";
                        });
                        $('.siteShow').html(text);
                        layer.close(index);
                    }
                },
                success:function(){
                    $(".layercon").html("");
                    // 修改index
                    $.testRemind.css.zIndex=$('.xubox_shade').css('zIndex')+1;
                    $('#siteAuthEditForm').html5Validate(function(){
                        var authSite=[];
                            selectData={};
                        $('input[name=siteId]:checked','#siteAuthEditForm').each(function(i,site){
                            authSite.push({
                                "userId":$('input[name=userId]','#siteAuthEditForm').val(),
                                "siteId": $(this).val(),
                                "siteName": $(this).attr('data-name'),
                                "qualificationId": $('input[name=qualificationId]','#siteAuthEditForm').val()
                            });
                            selectData[$(this).val()]='checked';
                        });

                        addAuthSiteList=authSite;
                    });
                }
            });

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

    //将字符串转换为时间格式,适用各种浏览器,格式如2011-08-03 09:15:11
    function GetTimeByTimeStr(dateStr) {
        var timeArr=dateStr.split(" ");
        var d=timeArr[0].split("-");
        var t=timeArr[1].split(":");
        return new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);
    }


})(mXbn);
