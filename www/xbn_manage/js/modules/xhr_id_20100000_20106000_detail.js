;
(function (X) {
    var forecast = X(),
        forecastCtrl = forecast.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = forecast.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    //防止从详情退回时，面包屑导航文字错误
    document.title = '海外仓业务管理-收货预报管理-详情';

    forecastCtrl.view = {
        elem: '#id_conts',
        tpl: path + X.configer[request.m].tpl
    };

    forecastCtrl.request({
        url: dataPath + X.configer[request.m].api.detail+'?id='+request.id,
        type: 'get'
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            //模板渲染
            data.data.operateData=operateData;
            forecastCtrl.request({
                url: dataPath + X.configer[request.m].api.track+'?forecastId='+request.id,
                type: 'get'
            }).then(function (track) {
                if (track.statusCode == '2000000') {

                    data.data.track = track.data;

                    forecastCtrl.render(data.data).then(function(){
                        // dom 初始化渲染
                        forecastCtrl.tirgger('dom_event_init',"#id_conts");

                        // 打印条码
                        forecastCtrl.tirgger('print');

                        // 打印箱子条码
                        forecastCtrl.tirgger('printBox');

                          // 更新进程
                        forecastCtrl.tirgger('update');

                        // 修改备注
                        forecastCtrl.tirgger('editRemak',data.data);

                        //展开详情交互
                        $(".js-details").on("click",function(){
                            var _slid = $(".proList");
                            if( _slid.hasClass("switch")){
                                _slid.stop().slideDown();
                                _slid.prev(".blue").text("收起详情");
                                _slid.removeClass("switch");
                            }else{
                                _slid.stop().slideUp();
                                _slid.prev(".blue").text("展开详情");
                                _slid.addClass("switch");
                            }
                        });
                        $('.btnMain a:first').removeClass('buttonText').addClass('button');
                    });
                }else{
                    forecastCtrl.tirgger('setTips',X.getErrorName(data.statusCode, 'wareErr'));
                }
            })

        } else {

        }
    });

    //打印条码
    forecastCtrl.on('print', function () {
        $('.js-printBarCode').off().on('click', function () {
            localStorage.setItem("barIds","");
            localStorage.setItem("barIds",[$("#receId").val()]);
            //window.location.href="?m=xhr_id_20100000_20106000_printBarCode";
        });
    });

    //打印箱子条码
    forecastCtrl.on('printBox', function () {
        $('.js-printBoxCode').off().on('click', function () {
            localStorage.setItem("boxIds","");
            localStorage.setItem("boxIds",[$("#receId").val()]);
            //window.location.href="?m=xhr_id_20100000_20106000_printBoxCode";
        });
    });

    // 审核
    forecastCtrl.on('examine',function(ids){
        forecastCtrl.request({
            url: dataPath + X.configer[request.m].api.batchPass,
            type: 'post',
            data: JSON.stringify({ids:ids})
        }).then(function (track) {
            if (track.statusCode == '2000000') {
                forecastCtrl.tirgger('setTips','您已审核成功！',function(){
                    forecast.router.runCallback();
                },1);
            }else{
                forecastCtrl.tirgger('setTips',X.getErrorName(track.statusCode, 'wareErr'));
            }
        });
    });

    //驳回
    forecastCtrl.on('reject',function(ids,text){
        var text = text ? text : '批量驳回';
        $.layer({
            title: text,
            area: ['550px', '300px'],
            dialog: {
                btns: 2,
                btn: ['确认','取消'],
                type : 8,
                msg: '<form id="frozenForm"><div class="frozen mB20 pT35"><textarea name="remark" id="" cols="30" rows="10" class="textadd" placeholder="请输入驳回原因" required data-cnmax="500"></textarea></div></form>',
                yes: function(index){
                    $("#frozenForm").submit();
                },
                no: function(index){
                    layer.close(index);
                }
            },
            success:function(){
                // 控制层级
                $.testRemind.css.zIndex=$('.xubox_shade').css('zIndex')+1;
                // 表单验证
                $("#frozenForm").html5Validate(function(){
                    forecastCtrl.request({
                        url:dataPath + X.configer[request.m].api.batchReject,
                        data:JSON.stringify({ids:ids,param:$("[name=remark]").val()}),
                        type:'post'
                    }).then(function(data){
                        if(data.statusCode=='2000000'){
                            forecastCtrl.tirgger('setTips','驳回成功！',function(){
                                forecast.router.runCallback();
                            });
                        }else{
                            forecastCtrl.tirgger('setTips',X.getErrorName(data.statusCode, 'wareErr'));
                        }
                    });
                });
            }
        });
    });

    // 更新进程
    forecastCtrl.on('update',function(){
        $('.js-update').off().on('click', function () {
            localStorage.setItem("updateIds","");
            localStorage.setItem("updateIds",[$("#receId").val()]);
        });
    });

    // 修改备注
    forecastCtrl.on('editRemak',function(data){
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
        $('.js-closeRemark').off().on('click',function(){
            $('.textareaBox').addClass('none');
            $('.textBox').removeClass('none');
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

    // dom init
    forecastCtrl.on('dom_event_init',function(ele){
        // 切换
        $('.tabBtn>li',ele).off().on('click',function(){
            var index=$(this).index();
            $('.tabBtn>li',ele).removeClass('this');
            $(this).addClass('this');
            $('.showMainProduct .const').hide();
            $('.showMainProduct .const').eq(index).show();
        });
         //单个驳回
        $('.js-reject').off().on('click',function(){
            forecastCtrl.tirgger('reject',[$('#receId').val()],'驳回');
        });
        //单个审核
        $('.js-examine').off().on('click',function(){
            forecastCtrl.tirgger('examine',[$('#receId').val()]);
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
