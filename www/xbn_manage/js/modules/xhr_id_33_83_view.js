;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var clientCtrl = gl_hy.ctrl();

    var localParm=gl_hy.utils.getRequest(),

        customerId=localParm.id;

    // 创建视图
    clientCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    // 查看
    if(customerId){
        clientCtrl.request({
            type:'get',
            url:jsPath + X.configer[localParm.m].api.customerDetail+customerId
        }).then(function(data){
            if(data.statusCode=='2000000'){
                clientCtrl.render(data.data);
            }else{
                clientCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
            }
        });
    }


    // 提示消息弹框方法定义
    clientCtrl.on('setTips',function(msg,callback){
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
