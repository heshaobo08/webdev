;
(function (X) {
    var forecast = X(),
        forecastCtrl = forecast.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = forecast.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));


    document.title='海外仓业务管理-收货预报管理-详情-减箱';

    forecastCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };
    forecastCtrl.request({
        url: dataPath + X.configer[request.m].api.infoReduceBox+'?id='+request.id,
        type: 'get'
    }).then(function(data){
        if (data.statusCode == "2000000") {
            data.data.operateData = operateData;
            forecastCtrl.render(data.data).then(function(){
                // 减箱取消和恢复
                forecastCtrl.tirgger('calReplyBox');
                // 修改备注
                forecastCtrl.tirgger('editRemak');
                //减箱保存
                forecastCtrl.tirgger('save');
                //查看货品详情
                forecastCtrl.tirgger('info');
            })
        }else{
            forecastCtrl.tirgger('setTips',X.getErrorName(data.statusCode, 'wareErr'));
        }
    })

    //查看货品详情
    forecastCtrl.on('info',function(box){
        $(".details").off("click",".js-info").on("click",".js-info",function(){
            var id = $(this).closest("tr").attr("data-id");
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

    // 减箱取消和恢复
    forecastCtrl.on("calReplyBox",function(){
        $(".js-calBox,.js-replyBox").on("click",function(){
            //箱子状态（取消-3、恢复-1）
            var $this = $(this),
                status = $this.hasClass('js-calBox') ? 3 : 1;

            if(status==3){
                $this.closest(".details").addClass("allGray");
                $this.next().show();
            }else{
                $this.closest(".details").removeClass("allGray");
                $this.prev().show();
            }
            $this.hide();

        })
    })

    // 减箱保存
    forecastCtrl.on("calReplyBox",function(){
        $(".js-save").on("click",function(){
            var arr = [];
            $(".bordertTop").each(function(){
                var that = $(this).find(".js-calBox:visible,.js-replyBox:visible"),
                    boxId = that.data("id"),
                    forecastId = $("#forecastId").val(),
                    status = that.hasClass("js-calBox")? 1 : 3;
                arr.push({
                    "boxId": boxId,
                    "status": status,
                    "forecastId": forecastId
                })
            })

            forecastCtrl.request({
                url: dataPath + X.configer[request.m].api.boxCancel,
                type: 'post',
                data: JSON.stringify(arr)
            }).then(function(data){
                if (data.statusCode == "2000000") {

                    forecastCtrl.tirgger('setTips','保存成功！',function(){
                        forecast.router.setHistory('?m=xhr_id_20100000_20106000');
                        forecast.router.runCallback();
                    });
                }else{
                    var errText =data.errorData.message || data.errorData;
                    forecastCtrl.tirgger('setTips',errText/*X.getErrorName(data.statusCode, 'wareErr')*/);
                }
            })
        })
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
        //取消保存备注信息
        $('.js-closeRemark').off().on('click',function(){
            $('.textBox').removeClass('none');
            $('.textareaBox').addClass('none');
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
