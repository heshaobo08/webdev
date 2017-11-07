;
(function (X) {
    var forecast = X(),
        forecastCtrl = forecast.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = forecast.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var perPage = 10;//列表每页显示10条记录

    forecastCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };
    var ids = localStorage.updateIds.split(",");
    forecastCtrl.request({
        url: dataPath + X.configer[request.m].api.track,
        type: 'post',
        data: JSON.stringify({ids:ids})
    }).then(function(data){
        if(data.statusCode == '2000000'){
            var datas = data.data;
            $.each(datas,function(i,e){
                var item = [];
                $.each(e.items,function(j,c){
                    if(c.nodeCode == 5 || c.nodeCode == 6 || c.nodeCode == 7 || c.nodeCode == 8){
                        //第一次循环直接加入数组
                        if(item.length==0){
                            item.push(c);
                        }else{
                            //节点重复
                            var iPos = isExitInArr('nodeCode', c.nodeCode, item);
                            //如果不存在直接压入数组
                            if (isExitInArr('nodeCode', c.nodeCode, item) == -1) {
                                item.push(c);
                            }else{
                                //item中已经存在该节点的数据，要比较时间,用最新的数据替换旧数据 handleTime
                                if(c.handleTime>item[iPos].handleTime){
                                    item.push(c);
                                }
                            }
                        }
                    }
                });
                e.item = item;
            });
            forecastCtrl.render(datas).then(function(){
                // 更新
                forecastCtrl.tirgger('updata');
                // 取消
                forecastCtrl.tirgger('cancle');
                // 保存
                forecastCtrl.tirgger('save');
                //选择时间
                forecastCtrl.tirgger('pickDate');
            })
        }else{
            forecastCtrl.tirgger('setTips',X.getErrorName(data.statusCode, 'wareErr'));
        }
    })

    // 更新
    forecastCtrl.on('updata',function(){
        $(".js-updata").on("click",function(){
            var that = $(this);
            that.hide();
            that.closest("td").next().find(".updata").show();
            that.closest("td").next().find(".timeInp").attr("disabled",false);
        })
    });

    // 取消
    forecastCtrl.on('cancle',function(){
        $(".js-cancle").on("click",function(){
            var that = $(this);
            var index = that.closest("td").index();
            that.closest("td").prev().find(".js-updata").show();
            for(var i=index-1;i<=4;i++){
                $(".updata").eq(i).find(".js-updata").show();
                $(".updata").eq(i).hide();
                $(".updata").eq(i).find(".timeInp").attr("disabled",true);
            }
        })
    });

    // 保存
    forecastCtrl.on('save',function(){
        $(".js-save").on("click",function(){
            $("#trakForm").html5Validate(function(){
                var arr = [];
                $(".processTable tbody tr").each(function(){
                    var that = $(this);
                    var forecastId = that.data("id");
                    var json = {
                        "forecastId": forecastId,
                        "siteReceiveBoxNum": parseInt(that.find("[name=receiveBoxNum]").val()),
                        "items": []
                    }
                    that.find("td").not(":first").each(function(){
                        var _that = $(this);
                        var updata = _that.find(".updata");
                        if(_that.find(".dataInput").val()){
                            json.items.push({
                                "id": updata.attr("data-id"),
                                "busynessId": forecastId,
                                "nodeCode": updata.attr("data-code"),
                                "handleTime": _that.find(".dataInput").val()
                            })
                        }
                    })
                    arr.push(json);
                });
                forecastCtrl.request({
                    url: dataPath + X.configer[request.m].api.saveTrack,
                    type: 'post',
                    data: JSON.stringify(arr)
                }).then(function(data){
                    if(data.statusCode == '2000000'){
                        forecastCtrl.tirgger('setTips','进程更新成功！',function(){
                              forecast.router.setHistory('?m=xhr_id_20100000_20106000');
                              forecast.router.runCallback();
                        });
                    }else{
                        forecastCtrl.tirgger('setTips',X.getErrorName(data.statusCode, 'wareErr'));
                    }
                })
            });
            $("#trakForm").submit();
        });
    });

    //获取时间
    forecastCtrl.on('pickDate', function () {
        $(".timeStart").on("click", function () {
            var $this = $(this),
                elemId = $this.siblings('.dataInput').attr('id');
            //预计到货日期不需要时分秒
            var isTime=elemId.indexOf('expectedArrivalDate')==-1?true:false;
            laydate({
                istime: isTime,
                elem:'#'+elemId,
                event: 'focus',
                format: isTime?'YYYY-MM-DD hh:mm:ss':'YYYY-MM-DD'
            });
        });
    });
    // 提示消息弹框方法定义
    forecastCtrl.on('setTips',function(msg,callback,n){
        if(!msg) return;
        var arr = [];
        if(n==2){
            arr =  ['确认','返回'];
        }else{
            arr =  ['确认'];
        }
        $.layer({
            title:'提示消息',
            area: ['500px', '200px'],
            dialog:{
                btns: n || 1,
                btn:arr,
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
    //从数组中找到某一属性在数组中存在的位置
    //prop属性名称，vals属性值 ,arr要查找的数组
    function isExitInArr(prop, vals, arr) {
        var result = -1;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][prop] == vals) {
                result = i;
                break;
            }
        }
        return result;
    }

})(mXbn);
