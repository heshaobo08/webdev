;
(function (X) {
    var wraeGoods = X(),
        goodsCtrl = wraeGoods.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = wraeGoods.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var perPage = 10;//列表每页显示10条记录
    
    
    goodsCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };

    goodsCtrl.request({
        url: dataPath + X.configer[request.m].api.detail+'?id='+request.id,
        type: 'get'
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            //模板渲染
            data.data.operateData=operateData;
            goodsCtrl.render(data.data);
        } else {
            
        }
    });
    

})(mXbn);