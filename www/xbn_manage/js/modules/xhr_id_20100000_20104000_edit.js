;
(function (X) {
    var logisticsPlan = X(),
        logisticsPlanCtrl = logisticsPlan.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = logisticsPlan.utils.getRequest();//{ m:"xhr_id_20100000_20101000",  id:"1"}

    logisticsPlanCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };

    var storeList = [];
    logisticsPlanCtrl.request({
        url: dataPath + X.configer[request.m].api.detail+'?id='+request.id,
        type:'get'
    }).then(function (planData) {
        if (planData.statusCode == '2000000') {
            logisticsPlanCtrl.request({
                url: dataPath + X.configer[request.m].api.storeList,
                type: "get"
            }).then(function (storeData) {
                if(storeData.statusCode='2000000'){
                    storeList = storeData.data;
                    planData.data.stores=storeData.data;
                    logisticsPlanCtrl.render(planData.data).then(function(){
                        //下拉框ele, parentEle, callback 目的仓库
                        sele('.select', '#selectStore', function (id, text) {
                            if (id) {
                                //从仓库列表中找到对应的仓库
                                var iPos = getPos(storeList, 'id', id);
                                $('input[name=destinationStoreCode]').val(iPos != -1 ? storeList[iPos].storeCode : '');
                                var endCode = $("#endCode"),
                                    endCountry = $("#endCountry"),
                                    endCurrency = $("#endCurrency");
                                endCode.html(iPos != -1 ? storeList[iPos].storeCode : '');
                                endCountry.html(iPos != -1 ? storeList[iPos].country : '');
                                endCurrency.html(iPos != -1 ? storeList[iPos].currencyUnit : '');
                            } else {
                                $('input[name=destinationStoreCode]').val('');
                            }
                        });
                        sele('.select', '#selectType');//物流方式
                        sele('.select', '#selectSite');//处理地点
                        logisticsPlanCtrl.tirgger('domEvents', '#id_conts');
                    });
                }else{
                    logisticsPlanCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        }else{
            logisticsPlanCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
        }
    });

    logisticsPlanCtrl.on('domEvents', function (elem) {
        //提交添加
        $('.js-submit').off().on('click', function () {
            $("#addPlanForm").submit();
        });
        logisticsPlanCtrl.tirgger('addPlanFormRender');
        //选择时间
        logisticsPlanCtrl.tirgger('pickDate');
    });

    // 表单验证
    logisticsPlanCtrl.on('addPlanFormRender', function () {
        $('#addPlanForm').html5Validate(function () {
            var sendData = {
                id:$('input[name=planId]').val(),
                logisticsCode: $('input[name=logisticsCode]').val(),
                disposalSite: parseInt($('input[name=disposalSite]').attr('index-data')),
                logisticsType: parseInt($('input[name=logisticsType]').attr('index-data')),
                destinationStoreId: $('input[name=destinationStoreId]').attr('index-data'),
                destinationStoreCode: $('input[name=destinationStoreCode]').val(),
                sendTimeLimit: $('#sendTimeLimit').text(),
                receiveTimeLimit: $('#receiveTimeLimit').text(),
                expectedArrivalDate: $('#expectedArrivalDate').text() + " 00:00:00",
                startStation: $('input[name=startStation]').val(),
                lastStation: $('input[name=lastStation]').val()
            };
            logisticsPlanCtrl.request({
                url: dataPath + X.configer[request.m].api.edit,
                data: JSON.stringify(sendData),
                type: 'post'
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    logisticsPlanCtrl.tirgger('setTipsCommit', '物流计划修改成功！', function () {
                        logisticsPlan.router.setHistory("?m=xhr_id_20100000_20104000");
                        logisticsPlan.router.runCallback();
                        //防止面包屑导航文字不对
                        document.title = '海外仓业务管理-物流计划管理';
                    });
                } else {
                    logisticsPlanCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                }
            });
        }, {
            validate: function () {
                if (!$('#sendTimeLimit').text().length) {
                    $('#sendTimeLimit').testRemind("请选择截至下单时间");
                    return false;
                }
                if (!$('#receiveTimeLimit').text().length) {
                    $('#receiveTimeLimit').testRemind("请选择截至收货时间");
                    return false;
                }
                if (!$('#expectedArrivalDate').text().length) {
                    $('#expectedArrivalDate').testRemind("请选择预计到货日期");
                    return false;
                }
                return true;
            }
        });
    });

    logisticsPlanCtrl.on('pickDate', function () {
        $('.pickDate').click(function () {
            var $this = $(this),
                elemId = $this.siblings('.dataInput').attr('id');
            //截至到货日期不需要选择时间
            var isNeedTime = elemId != 'expectedArrivalDate' ? true : false;
            laydate({
                istime: isNeedTime,
                elem: '#' + elemId,
                event: 'focus',
                format: isNeedTime?'YYYY-MM-DD hh:mm:ss':'YYYY-MM-DD',
                min: laydate.now()
            });
        });
    });
    // 提示消息弹框方法定义 ,只有确定按钮
    logisticsPlanCtrl.on('setTipsCommit', function (msg, callback) {
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

    // 提示消息弹框方法定义,有确定和取消按钮
    logisticsPlanCtrl.on('setTipsAsk', function (msg, callback) {
        if (!msg) return;
        $.layer({
            title: '提示消息',
            area: ['500px', ''],
            dialog: {
                btns: 2,
                btn: ['确定', '取消'],
                type: 8,
                msg: '<div class="tips">' + msg + '</div>',
                yes: function (index) {
                    layer.close(index);
                    callback && callback();
                },
                no: function (index) {
                    layer.close(index);
                }
            }
        })
    });

    //从数组中找到元素索引
    function getPos(arr, prop, val) {
        var result = -1;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][prop] == val) {
                result = i;
                break;
            }
        }
        return result;
    }
})(mXbn);
