;
(function (X) {

    var forecast= X(),
        forecastCtrl = forecast.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = forecast.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓业务管理-收货预报管理-扣款';

    forecastCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };

    //获取详情数据
    forecastCtrl.request({
        url: dataPath + X.configer[request.m].api.detail+'?id='+request.id,
        type: 'get'
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            //模板渲染
            data.data.operateData=operateData;
            //渲染页面
            forecastCtrl.render(data.data).then(function(){
                //To Do
                forecastCtrl.tirgger('bindDomEvents',data);
            });
        } else {
            forecastCtrl.tirgger('setTipsCommit',X.getErrorName(data.statusCode, 'wareErr'));
        }
    });

    //To Do
    forecastCtrl.on('bindDomEvents',function(data){
        var totalFreight = data.data.totalFreight;
        var tax = data.data.tax;
        var premium = data.data.premium;
        sele();

        //计算函数
        function compute(e){
            var num = 0;
            forecastCtrl.request({
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

        //点击下拉交互
        $(".select li").on("click",function(){
            var index = $(this).attr("index-data");
            $(".contsBox .details").not(":first").hide();
            $(".contsBox .details").eq(index).show();
        })
        //计算总重量，总运费
        $(".weight").on("keyup",function(){
            var weightTotal = 0,
                unitPrice = $(".unitPrice").val();
            $(".weight").each(function(){
                weightTotal += $(this).val()*1 || 0;
            })
            $(".weightTotal").val(weightTotal);

            //判断单价是否存在存在且logisticsType == 2 进行总运费计算
            if(data.data.logisticsType == 2 && unitPrice){
                var mul = compute(unitPrice +"*"+ weightTotal)*1;
                $(".freightTotal").val(mul.toFixed(2));
            }
        })
        //计算总体积，总运费
        $(".size input").on("keyup",function(){
            var that = $(this),
                onoff = false;
                volumeTotal = 0,
                volume = that.closest(".boxConts").find(".volume"),
                allInp = that.parent().find("input"),
                l = allInp.eq(0).val(),
                w = allInp.eq(1).val(),
                h = allInp.eq(2).val(),
                unitPrice = $(".unitPrice").val();
            //判断长宽高是否有空
            allInp.each(function(){
                if($(this).val()==""){
                    onoff = true;
                    return false;
                }
            });
            //长宽高都存在的情况下进行体积和总体积的计算
            if(!onoff){
                //计算单个箱子体积
                volume.val(compute(l+"*"+w+"*"+h+"/"+1000000));
                //计算所有箱子体积和
                $(".volume").each(function(){
                    volumeTotal += $(this).val()*1 || 0;
                })
                $(".volumeTotal").val(volumeTotal);
            }
            //判断单价是否存在存在且logisticsType == 1 进行总运费计算
            if(data.data.logisticsType == 1 && unitPrice){
                var mul = compute(unitPrice +"*"+ volumeTotal)*1;
                $(".freightTotal").val(mul.toFixed(2));
            }
        })
        //计算总运费
        $(".unitPrice,.weight,.length,.width,.height").on("keyup",function(){
            var volumeTotal = $(".volumeTotal").val();
            var weightTotal = $(".weightTotal").val();
            var unitPrice = $(".unitPrice").val();
            //volumeTotal、unitPrice都存在且logisticsType == 1 的情况下进行计算总运费
            //weightTotal、unitPrice都存在且logisticsType == 2 的情况下进行计算总运费
            if(data.data.logisticsType == 1 && volumeTotal && unitPrice){
                volumeTotal = volumeTotal < 1 ? 1 :volumeTotal;
                var mul = compute(unitPrice +"*"+ volumeTotal)*1;
                $(".freightTotal").val(mul.toFixed(2));
            }else if(data.data.logisticsType == 2 && volumeTotal && weightTotal && unitPrice){
                var volumeWeight = compute(volumeTotal+ "*" + 1000000 +"/"+ 6000)*1;
                if(weightTotal<volumeWeight){
                    weightTotal = volumeWeight;
                }
                var mul = compute(unitPrice +"*"+ weightTotal)*1;
                $(".freightTotal").val(mul.toFixed(2));
            }
        })
        //计算税金
        $("[name=tariff],[name=vatGst]").on("keyup",function(){
            var num1 = $("[name=tariff]").val();
            var num2 = $("[name=vatGst]").val();
            //num1、num2都存在的情况下进行计算税金
            if(num1 && num2){
                $("[name=tax]").val(compute(num1+"+"+num2));
            }
        })
        //计算保费
        $("[name=insuredCoefficient],[name=coverage]").on("keyup",function(){
            var num1 = $("[name=insuredCoefficient]").val();
            var num2 = $("[name=coverage]").val();
            //num1、num2都存在的情况下进行计算保费
            if(num1 && num2){
                var num = compute(num1+"*"+num2)*1;
                $("[name=premium]").val(num.toFixed(2));
            }
        })

        //保存数据事件
        $(".js-save").off('click').on("click",function(){
            var index = $("#select").attr("index-data");
            if(index == 1){//保存头程运费
                //保存json数据拼装
                var json = {
                    "id": request.id,//收货预报ID
                    "paidVolume": parseFloat($(".volumeTotal").val()),//计费体积
                    "paidWeight": parseFloat($(".weightTotal").val()),//计费重量
                    "totalFreight": parseFloat($(".freightTotal").val()),//总运费
                    "freightPrice": parseFloat($(".unitPrice").val()),//计费单价
                    "boxList": []
                }
                //保存boxList数据拼装
                $(".boxList").each(function(){
                    json.boxList.push({
                        "id": $(this).attr("data-id"),
                        "realWidth": parseFloat($(this).find(".size input").eq(1).val()),
                        "realHeight": parseFloat($(this).find(".size input").eq(2).val()),
                        "realLength": parseFloat($(this).find(".size input").eq(0).val()),
                        "realVolumet": parseFloat($(this).find(".volume").eq(0).val()),
                        "realWeigh": parseFloat($(this).find(".weight").val())
                    });
                })
                $("#headCharge").html5Validate(function(){
                    //扣除头程运费
                    forecastCtrl.request({
                        url: dataPath + X.configer[request.m].api.headCharge,
                        type: 'post',
                        data: JSON.stringify(json)
                    }).then(function (data) {
                        if (data.statusCode == '2000000') {
                            forecastCtrl.tirgger('setTipsCommit','头程运费扣款成功！',function(){
                                //判断税金和保费是否扣除，扣除则跳到列表否则返回扣除税金或保费页面
                                if(tax && premium){
                                    forecast.router.setHistory('?m=xhr_id_20100000_20106000');
                                    forecast.router.runCallback();
                                }else{
                                    forecast.router.runCallback();
                                }
                            });
                        }else{
                            forecastCtrl.tirgger('setTipsCommit',X.getErrorName(data.statusCode, 'wareErr'));
                        }
                    })
                })
                $("#headCharge").submit();
            }else if(index == 2){//保存税金
                //保存json数据拼装
                var json = {
                    "id": request.id,
                    "tariff": parseFloat($("[name=tariff]").val()),
                    "tariffRate": parseFloat($("[name=tariffRate]").val()),
                    "tax": parseFloat($("[name=tax]").val()),
                    "vatGst": parseFloat($("[name=vatGst]").val()),
                    "vatGstRate": parseFloat($("[name=vatGstRate]").val())
                }
                $("#taxCharge").html5Validate(function(){
                    //扣除税金
                    forecastCtrl.request({
                        url: dataPath + X.configer[request.m].api.taxCharge,
                        type: 'post',
                        data: JSON.stringify(json)
                    }).then(function (data) {
                        if (data.statusCode == '2000000') {
                            forecastCtrl.tirgger('setTipsCommit','税金扣款成功！',function(){
                                //判断头程运费和保费是否扣除，扣除则跳到列表否则返回扣除头程运费或保费页面
                                if(totalFreight && premium){
                                    forecast.router.setHistory('?m=xhr_id_20100000_20106000');
                                    forecast.router.runCallback();
                                }else{
                                    forecast.router.runCallback();
                                }
                            });
                        }else{
                            forecastCtrl.tirgger('setTipsCommit',X.getErrorName(data.statusCode, 'wareErr'));
                        }
                    })
                })
                $("#taxCharge").submit();
            }else{//保存保费
                //保存json数据拼装
                 var json = {
                    "id": request.id,
                    "premium": parseFloat($("[name=premium]").val()),
                    "coverage": parseFloat($("[name=coverage]").val()),
                    "insuredCoefficient": parseFloat($("[name=insuredCoefficient]").val())
                }

                $("#premiumCharge").html5Validate(function(){
                    //扣除保费
                    forecastCtrl.request({
                        url: dataPath + X.configer[request.m].api.premiumCharge,
                        type: 'post',
                        data: JSON.stringify(json)
                    }).then(function (data) {
                         if (data.statusCode == '2000000') {
                            forecastCtrl.tirgger('setTipsCommit','保费扣款成功！',function(){
                                //判断头程运费和税金是否扣除，扣除则跳到列表否则返回扣除头程运费或税金页面
                                if(totalFreight && tax){
                                    forecast.router.setHistory('?m=xhr_id_20100000_20106000');
                                    forecast.router.runCallback();
                                }else{
                                    forecast.router.runCallback();
                                }
                            });
                        }else{
                            forecastCtrl.tirgger('setTipsCommit',X.getErrorName(data.statusCode, 'wareErr'));
                        }
                    });
                });
                $("#premiumCharge").submit();
            }
        });
    });
    // 提示消息弹框方法定义 ,只有确定按钮
    forecastCtrl.on('setTipsCommit', function (msg, callback) {
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
        })
    });
})(mXbn);
