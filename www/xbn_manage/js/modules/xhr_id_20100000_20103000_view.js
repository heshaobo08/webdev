;
(function (X) {
    var inventory = X(),
        inventoryCtrl = inventory.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = inventory.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  id:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    inventoryCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };

    //防止面包屑导航文字不对
    document.title = '海外仓业务管理-库存管理-查看库存容量';
    //从库存列表页得到的仓库名称变量
    var storeName = localStorage.inventoryStoreName ? localStorage.inventoryStoreName : '';
    inventoryCtrl.request({
        url: dataPath + X.configer[request.m].api.detail+'?wareHouse='+request.wareHouse,
        type: 'get'
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            //模板渲染
            data.data.operateData = operateData;
            data.data.storeName = storeName;
            //console.log(data.data.dataList);
            var newData = reGenerateArr(data.data.dataList);
            //计算函数
            function compute(e){
                var num = 0;
                inventoryCtrl.request({
                    url: dataPath + X.configer[request.m].api.compute,
                    type: 'get',
                    data: {formula:e},
                    async:false
                }).then(function (data) {
                    if (data.statusCode == '2000000') {
                        num = data.data;
                    }
                })
                return num;
            }

            $.each(data.data.dataList,function(i,e){
                var percentage = (compute(e.itemVolume +"/"+e.totalVolume)*100).toFixed(0);
                e.percentage = percentage>=100?100:percentage;
            })

            data.data.dataList2=newData;

            inventoryCtrl.render(data.data).then(function () {

            });
        } else {
            inventoryCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });

    //提示消息弹框方法定义 ,只有确定按钮
    inventoryCtrl.on('setTipsCommit', function (msg, callback) {
        if (!msg) return;
        $.layer({
            title: '提示消息',
            area: ['500px', ''],
            dialog: {
                msg: '<div class="tips">' + msg + '</div>',
                yes: function (index) {
                    layer.close(index);
                    callback && callback();
                }
            }
        });
    });

    //对数据重组,每一个区域的数据放在一个数组项里
    function reGenerateArr(arr) {
        var json = {};
        var newArr =[];
        for (var i = 0; i < arr.length; i++) {
            if (!json[arr[i]['zone']]) {
                json[arr[i]['zone']] = [arr[i]];
            } else {
                json[arr[i]['zone']].push(arr[i]);
            }
        }
        for(key in json){
            newArr.push(json[key]);
        }
        return newArr;
    };

})(mXbn);
