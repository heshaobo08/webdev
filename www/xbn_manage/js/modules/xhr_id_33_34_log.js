;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var memberCtrl = gl_hy.ctrl();

    var localParm=gl_hy.utils.getRequest();

    // 创建视图
    memberCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    // 获取登录日志
    memberCtrl.request({
        url:jsPath+X.configer[localParm.m].api.logList,
        type:'post',
        data:JSON.stringify({
            pageSize:'20',
            cPageNo:'1',
            userId:localParm.id
        })
    }).then(function (data) {
        if(data.statusCode=='2000000'){
            data.data.userId=localParm.id;
            memberCtrl.render(data.data).then(function () {
                memberCtrl.renderIn("#logListTmpl","#logListCon",data.data);
                memberCtrl.renderIn("#pageListCon","#topPager",data.data);
                // 分页加载
                memberCtrl.tirgger('pageRender',data.data);
            });
            
        }else{
            memberCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
        }
    });
    // 分页加载
    memberCtrl.on('pageRender',function(data){
        var cPageNo=1,
            totalPages=data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            memberCtrl.tirgger('searchSubmit',p,function(data){
                memberCtrl.tirgger("memberRender",data);
                cPageNo=p;
            });
        });
    });

    // 列表搜索提交
    memberCtrl.on('searchSubmit',function(toPageNo,callback){
        var sendData={
                cPageNo:toPageNo,
                pageSize:20,
                userId:localParm.id
            };
        memberCtrl.request({
            url:jsPath + X.configer[localParm.m].api.logList,
            type: "post",
            data:JSON.stringify(sendData)
        }).then(function(data){
            if(data.statusCode=='2000000'){                
                 memberCtrl.renderIn("#logListTmpl","#logListCon",data.data)
                // 分页加载
                memberCtrl.tirgger('pageRender',data.data);
            }else{
                memberCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
            }
        });
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
