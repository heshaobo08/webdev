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

    // 回复
    if(messageId){
        messageCtrl.request({
            type:'post',
            url:jsPath + X.configer[localParm.m].api.messageDetail+messageId
        }).then(function(data){
            if(data.statusCode=='2000000'){
                data.data.pageStatus='view';
                data.data.platform=platform;
                
                messageCtrl.request({
                    type:'get',
                    url:jsPath + X.configer[localParm.m].api.siteAll
                }).then(function(site){

                    $.each(site.data,function(j,e){
                        if(data.data.siteName == e.id){
                            data.data.siteCnName = e.cnName;
                        }
                    })
                    
                    // 获取关联图片
                    getRelationPicture(X,[messageId],function (filedata) {
                        if(filedata.length>0){
                            data.data.filedata=filedata;
                        }
                        messageCtrl.render(data.data).then(function (data) {
                            messageCtrl.tirgger('dom_event_init','#id_conts');
                        });
                    });
                })
                
            }else{
                messageCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
            }
        });
    }

    // 初始化页面所有dom事件
    messageCtrl.on('dom_event_init',function(ele){
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
        })
    });


})(mXbn);
