;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var messageCtrl = gl_hy.ctrl();

    var localParm=gl_hy.utils.getRequest(),

        platform=localParm.p || "1",  //平台code(默认ebay)

        messageId=localParm.id;

    // 创建视图
    messageCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    messageCtrl.render({platformShow:platform,pageStatus:'apply'}).then(function(){
        messageCtrl.tirgger('dom_event_init',"#id_conts");            
    });
    

    // 初始化页面所有dom事件
    messageCtrl.on('dom_event_init',function(ele){

        // 表单提交
        $(".js-messageReplySubmit").off().on('click',function(){
            $("#replyForm").submit();
        });

        // 删除附件
        $('.attachmentBox').delegate('.js-delAttachment','click',function () {
            $(this).parent('a').remove();
        }).delegate('img','click',function () {
            // 图片放大
            var src=$(this).attr('src');
            $.layer({
                title:'查看附件',
                area: ['700px','500px'],
                dialog:{
                    btns:1,
                    btn:['返回'],
                    type:8,
                    msg:'<div class="tips mB20"><img src='+src+' style="max-width:95%"></div>',
                    yes:function(index){
                        layer.close(index);
                    }
                }
            });
        });

        // 查看附件
        $('.messageFileAttachment img').on('click',function () {
            // 图片放大
            var src=$(this).attr('src');
            $.layer({
                title:'查看附件',
                area: ['700px','500px'],
                dialog:{
                    btns:1,
                    btn:['返回'],
                    type:8,
                    msg:'<div class="tips mB20"><img src='+src+' style="max-width:95%"></div>',
                    yes:function(index){
                        layer.close(index);
                    }
                }
            });
        });

        // 上传附件
        var $_file = $("#js-uploadAttachment");
        gl_hy.uploadFile($_file, function (D) {
            if (D.statusCode == "2000000") {
                if($(".bigwidth_left img").length >= 5){
                    $("#js-uploadAttachment").testRemind("最多上传5张图片");
                    return false;
                }
                $(".bigwidth_left").append('<a href="javascript:;" class="annex"><img src=' + D.data.fileUrl + ' data-fieldId="'+D.data.fileId+'">'+D.data.fileIdOriginalName+'</span><em class="icon-34 js-delAttachment"></em></a>');                
            }
        });

        // 表单验证
        $("#replyForm").html5Validate(function(){
            var sendData={};
             messageCtrl.request({
                data:JSON.stringify({
                    "userID": $('input[name=userID]').val(),
                    "messageTitle": $('input[name=messageTitle]').val(),
                    "content": $('[name=content]').val(),
                    "orderID": $('input[name=orderID]').val(),
                    "sender": $('input[name=sender]').val(),
                    "receiver":  $('input[name=receiver]').val(),
                    "siteName": $('input[name=siteName]').val(),
                    "plateformID": platform,
                    "sku":$('input[name=sku]').val(),
                    "fileStatus":$(".bigwidth_left img").length?'1':'0'
                }),
                type:'post',
                url:jsPath + X.configer[localParm.m].api.messageEnter
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    //保存图片的关联关系
                    var arrayList = [];
                    var jsons = {};
                    $(".bigwidth_left img").each(function(index, element) {
                        jsons = {
                            "relBelong": data.data.id,
                            "fileId": $(element).attr("data-fieldId")
                        }
                        arrayList.push(jsons);
                    });
                    if(arrayList.length){
                        updateRelationShip(X , {
                            data :{
                                "ids": [data.data.id], 
                                "list" : arrayList
                            }
                        });
                    }   
                    messageCtrl.tirgger('setTips','录入成功！',function(){
                        gl_hy.router.setHistory("?m=xhr_id_33_78");
                        gl_hy.router.runCallback();
                    });
                }else{
                    messageCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });   
        });
        
    });


    // 提示消息弹框方法定义
    messageCtrl.on('setTips',function(msg,callback){
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
        });
    });


})(mXbn);
