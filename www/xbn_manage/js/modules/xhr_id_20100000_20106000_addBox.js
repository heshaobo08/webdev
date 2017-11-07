;
(function (X) {
    var forecast = X(),
        forecastCtrl = forecast.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = forecast.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var userId = "";
    var perPage = 10;

    document.title="海外仓业务管理-收货预报管理-详情-加箱";

    forecastCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };

    $.when(
        forecastCtrl.request({
            url: dataPath + X.configer[request.m].api.infoAddBox+'?id='+request.id,
            type: 'get'
        }),
        forecastCtrl.request({
            url: dataPath + X.configer[request.m].api.getBoxCode+'?forecastId='+request.id,
            type: 'get'
        })
    ).then(function(d1,d2){
        if (d1[0].statusCode == "2000000" && d2[0].statusCode == "2000000") {
            d1[0].operateData = operateData;
            var box = {
                code: d2[0].data,
                status: false
            };
            forecastCtrl.render(d1[0].data).then(function(){
                userId = d1[0].data.userId;
                //渲染箱子
                forecastCtrl.tirgger('box',box);
                // 修改备注
                forecastCtrl.tirgger('editRemak');
                //添加箱子
                forecastCtrl.tirgger('addBox');
                //添加货品
                forecastCtrl.tirgger('addGoods');
                //增箱保存
                forecastCtrl.tirgger('addSave');
                //查看货品详情
                forecastCtrl.tirgger('info');
            })
        }else{
            forecastCtrl.tirgger('setTips',X.getErrorName(d1[0].statusCode));
        }
    })

    //查看货品详情
    forecastCtrl.on('info',function(box){
        $(".details").off("click",".js-info").on("click",".js-info",function(){
            var id = $(this).closest("tbody").attr("data-id");
            $.layer({
                title: '货品详情',
                area: ['900px', '600px'],
                dialog: {
                    btns: 1,
                    btn: ['确认'],
                    type : 8,
                    msg: '<div class="goodsInfo" style="overflow:auto;height:500px;"></div>'
                },
                success: function(){
                    forecastCtrl.request({
                        url: dataPath + X.configer[request.m].api.goodsInfo + '?id=' + id,
                        type: 'get'
                    }).then(function(data){
                        if(data.statusCode == "2000000"){
                            forecastCtrl.renderIn("#goodsInfoTmpl",".goodsInfo",data.data);
                        }else{
                            forecastCtrl.tirgger('setTips',X.getErrorName(data.statusCode, 'wareErr'));
                        }
                    })
                }
            });
        })
    });

    //渲染箱子
    forecastCtrl.on('box',function(box){
        forecastCtrl.request({
            url: dataPath + X.configer[request.m].api.getBoxOrderCode,
            type: 'get'
        }).then(function(data){
            if(data.statusCode == "2000000"){
                box.orderCode = data.data;
                forecastCtrl.renderTo("#boxTmpl",".tmplBox",box);
                $(".js-addBox").not(":last").hide();
            }else{
                forecastCtrl.tirgger('setTips',X.getErrorName(data.statusCode, 'wareErr'));
            }
        })
    });

    //增箱保存
    forecastCtrl.on('addSave',function(){
        $(".js-addSave").on("click",function(){
            var onoff = false;
            var json = {
                "id": request.id,
                "planId": $("#planId").val(),
                "boxList": []
            }
            $(".boxBlock").each(function(){
                var boxList = {
                    "boxCode": $(this).find(".boxTitle").attr("data-code"),
                    "boxOrderCode": $(this).find(".boxTitle").attr("data-orderCode"),
                    "forecastHeight": $(this).find(".forecastHeight").val(),
                    "forecastLength": $(this).find(".forecastLength").val(),
                    "forecastWeigh": $(this).find(".forecastWeigh").val(),
                    "forecastWidth": $(this).find(".forecastWidth").val(),
                    "boxCommodityList": []
                }
                if($(this).find(".tpmlGoods tbody").not(".firstGoods").length){
                    $(this).find(".tpmlGoods tbody").not(".firstGoods").each(function(){
                        boxList.boxCommodityList.push({
                            "commodityId": $(this).attr("data-id"),
                            "customsCode": $(this).attr("data-info").split(",")[0],
                            "declareName": $(this).attr("data-info").split(",")[1],
                            "declarePrice": $(this).attr("data-info").split(",")[2],
                            "outTime": $(this).find(".timeInp").val(),
                            "fillBoxNum": $(this).find("[name=proNum]").val()
                        })
                    })
                }else{
                    onoff = true;
                    return false;
                }
                json.boxList.push(boxList);
            })
            if(onoff){
                forecastCtrl.tirgger('setTips','有未添加货品的箱子，请添加货品后保存！');
            }else{
                $("#boxForm").html5Validate(function(){
                    forecastCtrl.request({
                        url: dataPath + X.configer[request.m].api.supplyBox,
                        type: 'post',
                        data: JSON.stringify(json)
                    }).then(function(data){
                        if(data.statusCode == "2000000"){
                            //window.history.go(-1);
                            forecastCtrl.tirgger('setTips','增箱成功！',function(){
                                forecast.router.setHistory('?m=xhr_id_20100000_20106000');
                                forecast.router.runCallback();
                            });
                        }else{
                            forecastCtrl.tirgger('setTips',X.getErrorName(data.statusCode, 'wareErr'));
                        }
                    })
                })
                $("#boxForm").submit();
            }
        })
    });

    //添加箱子
    forecastCtrl.on('addBox',function(){
        $(".details").off("click",".js-addBox").on("click",".js-addBox",function(){
            var code = Number($(".boxTitle:last").attr("data-code"))+1;
            //渲染箱子
            forecastCtrl.tirgger('box',{code:addNumWithZero(code),status: true});
            $(".js-delBox").show();
        }).on("click",".js-delBox",function(){
            var that = $(this),
                parent = that.closest(".boxBlock"),
                oldCode = Number($(".boxTitle:first").attr("data-code"));
            parent.remove();
            $(".boxTitle").each(function(){
                var _that = $(this);
                _that.attr("data-code",addNumWithZero(oldCode));
                _that.find("span").html(addNumWithZero(oldCode) + "号箱");
                oldCode++;
            })

        })
    });

    //添加货品
    forecastCtrl.on('addGoods',function(){
        $(".details").off("click",".js-addGoods").on("click",".js-addGoods",function(){
            var tmplList = $(this).closest(".details").find(".tmplList");
            $(".tmplList").html("");
            var page = $(this).closest(".details").find(".page");
            forecastCtrl.request({
                url: dataPath + X.configer[request.m].api.list,
                type: 'post',
                data: JSON.stringify({userId:userId,limit:perPage,cpage:request.page || 1})
            }).then(function(data){
                if(data.statusCode == "2000000"){
                    //加载列表总模版
                    forecastCtrl.renderIn("#listTmpl",tmplList,data.data);
                    //列表数据加载
                    forecastCtrl.tirgger('listRender', data.data);
                    // 表单校验加载
                    forecastCtrl.tirgger("searchFormValid");
                    // 分页渲染
                    forecastCtrl.renderIn('#pageListTmpl', '.page', data);
                    // 分页加载
                    forecastCtrl.tirgger('pageRender', data.data);
                    //调用全选功能
                    checkeBox("r-box");
                    //确认选择货品
                    forecastCtrl.tirgger('goodSave',tmplList);
                    //取消选择货品
                    forecastCtrl.tirgger('goodsCal',tmplList);

                }else{
                    forecastCtrl.tirgger('setTips',X.getErrorName(data.statusCode, 'wareErr'));
                }
            })
        })/*.on("click",".a_remove",function(){
            var inp = $(this).next(),
                val = Number(inp.val());
            if(val > 1){
                inp.val(val-1);
                var proNum = $(this).closest(".details").find(".proNum");
                proNum.html(Number(proNum.text())-1);
            }
        }).on("click",".a_add",function(){
            var inp = $(this).prev(),
                val = Number(inp.val());
            inp.val(val+1);
            var proNum = $(this).closest(".details").find(".proNum");
            proNum.html(Number(proNum.text())+1);
        })*/.on("click",".js-calGoods",function(){
            var that = $(this),
                parent = that.closest(".details"),
                proNum = parent.find(".proNum"),
                skuNum = parent.find(".skuNum");
                skuNum.html(Number(skuNum.text())-1);
                proNum.html(Number(proNum.text())-Number(that.closest("tbody").find("[name=proNum]").val()));
            if(parent.find(".tpmlGoods").find("tbody").length <= 2){
                parent.find(".firstGoods").show();
            }else{
                that.closest("tbody").prev().find(".js-addGoods").show();
            }
            that.closest("tbody").remove();
        }).on('blur','input[name=proNum]',function(){
            //数字的判断
            if(isNaN($(this).val())||parseInt($(this).val())<=0){
                $(this).val(1);
            }
        });
    });

    //确认选择货品
    forecastCtrl.on("goodSave",function(tmplList){
        $(".js-goodSave").on("click",function(){
            var checkbox = tmplList.find("input[type=checkbox]:checked").not("[name=all]");
            var ids = [];
            checkbox.each(function(){
                var id = $(this).attr("data-id");
                ids.push(id);
            })
            forecastCtrl.request({
                url: dataPath + X.configer[request.m].api.listByCommodityIds,
                type: 'post',
                data: JSON.stringify({ids:ids,param:$("#countryCurrencyId").val()})
            }).then(function(data){
                if(data.statusCode == "2000000"){
                    //补充报关信息
                    forecastCtrl.renderIn("#listSeaTmpl",tmplList,data.data);
                    //确认补充报关信息
                    forecastCtrl.tirgger('seaSave',tmplList);
                    //取消补充报关信息
                    forecastCtrl.tirgger('goodsCal',tmplList);
                }else{
                    forecastCtrl.tirgger('setTips',X.getErrorName(data.statusCode, 'wareErr'));
                }
            })
        })
    })

    //取消选择货品 取消补充报关信息
    forecastCtrl.on("goodsCal",function(tmplList){
        tmplList.off("click",".js-goodsCal").on("click",".js-goodsCal",function(){
            tmplList.html("");
        })
    })

    //确认补充报关信息
    forecastCtrl.on("seaSave",function(tmplList){
        tmplList.off("click",".js-seaSave").on("click",".js-seaSave",function(){
            var $that = $(this);
            $("#seaForm").html5Validate(function(){
                var json = [];
                var ids = [];
                $(".seaBlock").each(function(){
                    json.push({
                        "id": $(this).find(".seaCont").attr("data-id"),
                        "commodityId": $(this).attr("data-id"),
                        "customCode": $(this).find("[name=customCode]").val(),
                        "applyName": $(this).find("[name=applyName]").val(),
                        "applyPrice": $(this).find("[name=applyPrice]").val(),
                        "countryCurrencyId": $("#countryCurrencyId").val()
                    })
                    ids.push($(this).attr("data-id"))
                })
                forecastCtrl.request({
                    url: dataPath + X.configer[request.m].api.batchSaveOrUpdate,
                    type: 'post',
                    data: JSON.stringify(json)
                }).then(function(data){
                    if(data.statusCode == "2000000"){
                        forecastCtrl.request({
                            url: dataPath + X.configer[request.m].api.commodityIds,
                            type: 'post',
                            data: JSON.stringify({ids:ids,param:$("#countryCurrencyId").val()})
                        }).then(function(data){
                            if(data.statusCode == "2000000"){
                                //回填货品
                                var parent = $that.closest(".boxBlock");
                                var skuNum = proNum = 0;
                                var datas = data;
                                var arr = [];
                                parent.find("tbody").each(function(){
                                    var that = $(this);
                                    var id = that.attr("data-id");
                                    if(id){
                                        skuNum++;
                                        $.each(datas.data,function(i,e){
                                            if(id == e.commodity.id){
                                                skuNum--;
                                                that.find("[name=proNum]").val(Number(that.find("[name=proNum]").val())+1);
                                                arr.push(e.commodity.id);
                                            }
                                        })
                                        proNum += Number(that.find("[name=proNum]").val());
                                    }
                                })
                                if(arr.length!=0){
                                    var dataArr = {data:[]};
                                    $.each(datas.data,function(i,e){
                                        var on = true;
                                        $.each(arr,function(j,d){
                                            if(d == e.commodity.id){
                                                on=false;
                                                return false;
                                            }
                                        });
                                        if(on){
                                            dataArr.data.push(e);
                                        }
                                    });
                                }else{
                                    dataArr = datas;
                                }
                                forecastCtrl.renderTo("#goodsTmpl",parent.find(".tpmlGoods"),dataArr);
                                parent.find(".firstGoods").hide();
                                parent.find(".tpmlGoods tbody").not(".firstGoods").find(".js-addGoods").not(":last").hide();
                                tmplList.html("");
                                parent.find(".skuNum").html(data.data.length+skuNum);
                                parent.find(".proNum").html(data.data.length+proNum);
                                //选择时间
                                forecastCtrl.tirgger('pickDate');
                                //数量的增减
                                ui.countNumber({
                                    minus: ".js-minus",
                                    plus: ".js-plus",
                                    count: ".js-input",
                                    min: "0",
                                    dataMax:true,
                                    maxSet:true,
                                    countSet: true//允许手动输入
                                });
                                $(".js-input").blur();
                            }else{
                                forecastCtrl.tirgger('setTips',X.getErrorName(data.statusCode, 'wareErr'));
                            }
                        })
                    }else{
                        forecastCtrl.tirgger('setTips',X.getErrorName(data.statusCode, 'wareErr'));
                    }
                })
            });
            $("#seaForm").submit();
        })
        function seaValid(){

        }
    })

    // 修改备注
    forecastCtrl.on('editRemak',function(){
         $('.js-editRemark').off().on('click',function(){
            if($('.textareaBox').hasClass('none')){
                $('.textBox').addClass('none');
                $('.textareaBox').removeClass('none');
            }else{
                $('.textBox').removeClass('none');
                $('.textareaBox').addClass('none');
            }
        });
         //保存备注信息
        $('.js-saveRemark').off().on('click',function(){
            $('#editRemarkForm').submit();
        });
        //表单验证
        $('#editRemarkForm').html5Validate(function () {
            var val=$('.textarea').val().replace(/(^\s+)|(\s+$)/g,'');
            forecastCtrl.request({
                url: dataPath + X.configer[request.m].api.updateRemark,
                type: 'POST',
                data: JSON.stringify({
                    id: request.id,
                    remark: val
                })
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    forecastCtrl.tirgger('setTips', '备注信息修改成功！', function () {
                        $('#editRemarkForm .textarea').val(val);
                        $('.textareaBox').addClass('none');
                        $('.textBox').text(val).removeClass('none');
                    },1);
                } else {
                    forecastCtrl.tirgger('setTips', X.getErrorName(data.statusCode, 'wareErr'),1);
                }
            });
        });
    });

    // 分页加载
    forecastCtrl.on('pageRender', function (data) {
        var cPageNo = request.page,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            forecastCtrl.tirgger('searchSubmit', p, function (data) {
                forecast.router.setHistory("?m=" + request.m + "&id=" + request.id + "&page=" + p);
                forecastCtrl.tirgger("listRender", data);
                cPageNo = p;
            });
        });
    });

    //模板局部渲染
    forecastCtrl.on('listRender', function (data) {
        // 数据列表渲染
        forecastCtrl.renderIn('#conList', '#listCon', data);
        //触发页面dom事件
        forecastCtrl.tirgger('domEvents', "#id_conts");

    });

    forecastCtrl.on('domEvents', function (ele) {
        //搜索提交
        $('.js-search').off().on('click', function () {
            request.page = 1;
            $("#searchForm").submit();
        });
    });

    //表单验证
    forecastCtrl.on('searchFormValid', function () {
        // 表单验证
        $('#searchForm').html5Validate(function () {
            forecastCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发
                forecastCtrl.tirgger('listRender', data);
                // 分页渲染
                forecastCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                forecastCtrl.tirgger('pageRender', data);
            });
        });
    });

    // 列表搜索提交
    forecastCtrl.on('searchSubmit', function (toPageNo, callback) {
        var form = $('#searchForm');
        var sendData = {
            "cpage": toPageNo,
            "limit": perPage,
            "userId": userId,
            "title": $('input[name=title]', form).val(),
            "inventoryCode": $('input[name=inventoryCode]', form).val(),
            "merchantSku": $('input[name=merchantSku]', form).val(),
            "specsModel": $('input[name=specsModel]', form).val()
        }
        forecastCtrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: "post",
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                callback && callback(data.data);
            } else {
                forecastCtrl.tirgger('setTips', X.getErrorName(data.statusCode, 'wareErr'));
            }
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

    function addNumWithZero(num,numLen){
        if(!numLen){
            numLen=4;
        }
        num=String(num);
        return new Array(numLen+1).join('0').substr(0,numLen-num.length).concat(num);
    }

    //获取时间
    forecastCtrl.on('pickDate', function () {
        //加载时间选择器
        $('.icon-54').off('click').on('click', function () {
            var $this = $(this),
                elemId = $this.prev('').attr('id');
            laydate({
                istime: true,
                //min: laydate.now(),
                elem:'#'+elemId,
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });
    });
})(mXbn);
