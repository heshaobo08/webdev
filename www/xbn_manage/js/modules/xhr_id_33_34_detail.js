;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var memberCtrl = gl_hy.ctrl();

    var localParm=gl_hy.utils.getRequest(),
        operateData=X.getRolesObj.apply(null,localParm.m.split('_').slice(2)),
        userLogList={};
    // 创建视图
    memberCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };
    
    
    // 获取用户详情
    memberCtrl.request({
        url:jsPath+X.configer[localParm.m].api.userDetail+localParm.id,
        type:'get'
    }).then(function(data){
        if(data.statusCode=='2000000'){           
            // 获取登录日志
            memberCtrl.request({
                url:jsPath+X.configer[localParm.m].api.logList,
                type:'post',
                data:JSON.stringify({
                    pageSize:'20',
                    cPageNo:'1',
                    userId:localParm.id
                })
            }).then(function (logData) {
                if(data.statusCode=='2000000'){
                    data.data.userLogList=logData.data.data;
                    data.data.operateData=operateData;
                    // 获取用户图像
                    getRelationPicture(X,[data.data.id],function (filedata) {
                        if(filedata.length>0){
                            data.data.fileOriginalurl =filedata[0].fileOriginalurl;
                        }else{
                            data.data.fileOriginalurl='images/singimg.png';//默认图像
                        }
                        memberCtrl.render(data.data);
                    });
                }else{
                    memberCtrl.tirgger('setTips',X.getErrorName(logData.statusCode));
                }
            });           
            
        }else{
            memberCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
        }
    });

    // 提示消息弹框方法定义
    memberCtrl.on('setTips',function(msg,callback){
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
