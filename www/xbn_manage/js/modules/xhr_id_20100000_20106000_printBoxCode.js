;
(function (X) {
    var forecast = X(),
        forecastCtrl = forecast.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = forecast.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));


    document.title="海外仓业务管理-收货预报管理-打印箱子标签";
    forecastCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };
    var ids = localStorage.boxIds.split(",");

    $.when(
        forecastCtrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: 'post',
            data: JSON.stringify({ids:ids})
        }),
        forecastCtrl.request({
            url: dataPath + X.configer[request.m].api.tempList,
            type: 'get'
        })
    ).then(function(d1,d2){
        if(d1[0].statusCode == "2000000" && d2[0].statusCode == "2000000"){
            var data = {};
            data.list = d1[0].data;
            data.tempList = d2[0].data;
            forecastCtrl.render(data).then(function(){
                sele();
                //在线打印
                $(".js-onlinePrint").on("click",function(){
                    downloadBarCode("online");
                })
                //保存PDF文件
                $(".js-savePDF").on("click",function(){
                    downloadBarCode("download");
                });

                //数量的增减
                ui.countNumber({
                    minus: '.js-minus',
                    plus: '.js-plus',
                    count: '.js-input',
                    countSet:true,
                    maxSet:true,
                    max:1000,
                    min: 0
                });
                // 打印货品条码  (如修改收货预报管理里的一起修改)
                function downloadBarCode (type) {
                    // 获取所有
                    var allcheckBox=$('[name=num]'),
                        sendBoxData={boxBarCodeList:[],templateCode:$('[name=templateCode]').attr('index-data')};
                    // 拼装数据
                    allcheckBox.each(function(){
                        var arr= $(this).data("cont").split(',');
                        sendBoxData.boxBarCodeList.push({
                            code: $(this).data("id"),
                            num: parseInt($(this).val()),
                            title: $(this).data("title"),
                            ownerName: arr[0],
                            planId: arr[1],
                            carton: arr[2],
                            param: arr[3]
                        })
                    });

                    if(type=='download'){
                        // form提交
                        $("#templateCode").val(sendBoxData.templateCode);
                        $("#barCodeList").val(JSON.stringify(sendBoxData.boxBarCodeList));
                    }else if(type=='online'){
                        // 在线打印
                        forecastCtrl.request({
                            url: dataPath + X.configer[request.m].api.printBar,
                            type: 'post',
                            data:JSON.stringify(sendBoxData)
                        }).then(function (data) {
                            if (data.statusCode == '2000000') {
                                // 打印
                                checkIsCanPrint('打印货品标签',dataPath+data.data);
                            }else{
                                forecastCtrl.tirgger('setTips', X.getErrorName(data.statusCode, 'wareErr'));
                            }
                        });
                    }
                }

                // 验证是否可以在线打印 (如修改收货预报管理里的一起修改)
                function checkIsCanPrint (title,pdfUrl) {
                    //插件安装了，则跳转到指定页面　　
                    if (!isAcrobatInstalled()){
                        //检测到未安装阅读器，则提示用户下载　
                        $.layer({
                            title : title,
                            dialog : {
                                btns : 1,
                                btn: ['确定'],
                                msg : '<p class="tips pL15 pR15" >你可能还没有安装pdf阅读器，为了方便你查看pdf文档，请下载！<a href="http://ardownload.adobe.com/pub/adobe/reader/win/9.x/9.3/chs/AdbeRdr930_zh_CN.exe" target="_blank" class="col_FF6600">点击下载</a></p>'
                            }
                        });
                    }else{
                        // 用户安装阅读插件，弹出框下载
                        $.layer({
                            title : title,
                            dialog : {
                                btns : 1,
                                btn: ['取消'],
                                msg : '<iframe id="print" src="'+pdfUrl+'" width="800" height="450"></iframe>'
                            }/*,
                            yes: function(){
                                try{
                                    // 模拟打印
                                    window.frames[0].print();
                                }catch(err){
                                    // iframe的pdf安全策略，页面无法打印 Todo
                                    txt="页面上发生未知错误，可以尝试使用阅读器的打印功能.\n\n";
                                    txt+="错误描述: " + err.message + "\n\n";
                                    forecastCtrl.tirgger('setTips', txt);
                                }
                            }*/
                        });
                    }
                }
            });
        }
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

})(mXbn);
