;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ + '/' + X.configer.__FILE_HTML__ + '/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath = X.configer.__API_PATH__;

    var userCtrl = gl_hy.ctrl();

    var localParm = gl_hy.utils.getRequest();

    // 创建视图
    userCtrl.view = {
        elem: "#id_conts",
        tpl: path + "/" + X.configer[localParm.m].tpl
    };

    var companyId = localParm.id;
    // 获取商家详情
    if (companyId) {
        userCtrl.request({
            url: jsPath + X.configer[localParm.m].api.settledDetail + companyId,
            type: "GET"
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                var userId = data.data.userId;
                // 获取用户详情
                userCtrl.request({
                    url: jsPath + X.configer[localParm.m].api.userDetail + userId,
                    type: "GET",
                }).then(function (userdata) {
                    if (userdata.statusCode == '2000000') {
                        // 获取站点信息
                        userCtrl.request({
                            url: jsPath + X.configer[localParm.m].api.userSiteAuthList + userId,
                            type: "GET"
                        }).then(function (sitedata) {
                            if (sitedata.statusCode == '2000000') {
                                data.data.userList = userdata.data; //用户详情
                                data.data.siteList = sitedata.data; //授权站点
                                // 模板渲染
                                userCtrl.render(data.data).then(function () {
                                    userCtrl.tirgger('dom_init', "#id_conts");
                                });
                            } else {
                                userCtrl.tirgger('setTips', X.getErrorName(sitedata.statusCode));
                            }
                        });
                    } else {
                        userCtrl.tirgger('setTips', X.getErrorName(userdata.statusCode));
                    }
                });
            } else {
                userCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
            }
        });
    }


    // 初始化dom事件
    userCtrl.on('dom_init', function (ele) {
        // 确认授权
        $('.js-authSiteSubmit', ele).off().on('click', function () {
            $('#authSiteForm').submit();
        });

        // 表单验证
        $("#authSiteForm").html5Validate(function () {
            var userId = $('input[name=userId]', "#authSiteForm").val(),
                companyId = $('input[name=companyId]', "#authSiteForm").val(),
                sendData = [];
            $("input[name=siteId]:checked").each(function (i, site) {
                var pTr = $(this).closest('tr'),
                    startTime = pTr.find('.startTime').val(),
                    endTime = pTr.find('.endTime').val();
                sendData.push({
                    userId: userId,
                    companyId: companyId,
                    siteId: pTr.find('input[name=siteId]').val(),
                    siteName: pTr.find('input[name=siteId]').attr('data-name'),
                    accreditBeginTime: startTime,
                    accreditEndTime: endTime
                });
            });
            //console.log(sendData); //Todo 验证
            // 创建用户授权
            userCtrl.request({
                url: jsPath + X.configer[localParm.m].api.userSiteCreat,
                type: 'post',
                data: JSON.stringify(sendData)
            }).then(function (data) {
                if (data.statusCode == '2000000') {
                    userCtrl.tirgger('setTips', '用户授权站点成功！', function () {
                        gl_hy.router.setHistory("?m=xhr_id_33_42");
                        gl_hy.router.runCallback();
                    });
                } else {
                    userCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
                }
            });

        }, {
            validate: function () {
                var status = true,
                    checkedInput=$("input[name=siteId]:checked");
                if(!checkedInput.length){
                    $("input[name=siteId]").eq(0).testRemind('至少选择一个要授权的站点').focus();
                    return false;
                }
                $("input[name=siteId]:checked").each(function (i, dom) {
                    var pTr = $(this).closest('tr'),
                        startTime = pTr.find('.startTime'),
                        endTime = pTr.find('.endTime');
                    // 选中状态
                    if ($(this).prop('checked')) {
                        if (!startTime.val()) {
                            startTime.testRemind("请选择开始时间");
                            status = false;
                            return false;
                        }
                        if (!endTime.val()) {
                            endTime.testRemind("请选择结束时间");
                            status = false;
                            return false;
                        }
                        if (startTime.val() >= endTime.val()) {
                            endTime.testRemind("结束时间必须大于开始时间");
                            status = false;
                            return false;
                        }
                    }
                });
                return status;
            }
        });

        // 开始时间
        $(".timeStart").on("click", function () {
            var ele = $(this).siblings('.startTime')[0];
            laydate({
                istime: true,
                elem: ele,
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });
        // 结束时间
        $(".timeEnd").on("click", function () {
            var ele = $(this).siblings('.endTime')[0];
            laydate({
                istime: true,
                elem: ele,
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });
        //批量设置开始和结束时间
        $('.js-batchStart,.js-batchEnd').click(function () {
            var _this = $(this),
                isStart=true;
            if(_this.attr('class').indexOf('Start')==-1){
                isStart=false;
            }
            if (!$('#authSiteForm tbody input:checkbox[name=siteId]:checked').length) {
                userCtrl.tirgger('setTips', '至少选择一个要授权的站点');
                return;
            }
            var iPos = _this.closest('th').index();
            var tr = $('input:checkbox[name=siteId]:checked').closest('tr');
            laydate({
                istime: true,
                format: 'YYYY-MM-DD hh:mm:ss',
                choose: function (datas) { //选择日期完毕的回调
                    _this.text('').data('time',datas);
                    //判断是否授权结束时间
                    if($('.js-batchStart').data('time') && $('.js-batchEnd').data('time') && $('.js-batchStart').data('time')>=$('.js-batchEnd').data('time')){
                        userCtrl.tirgger('setTips', '结束时间必须大于开始时间');
                        _this.data('time','');
                        return false;
                    }
                    tr.each(function () {
                        isStart ? $(this).children('td').eq(iPos).children('.startTime').val(datas) : $(this).children('td').eq(iPos).children('.endTime').val(datas);
                    });
                },
                empty:function  () {
                    tr.each(function () {
                        _this.data('time','');
                        isStart ? $(this).children('td').eq(iPos).children('.startTime').val('') : $(this).children('td').eq(iPos).children('.endTime').val('');
                    });
                }
            });
        });
        // 按平台选择eBay&Amazon
        $(".js-platform").on("click", function () {
            var platform = $(this).val();
            var allbox = $("#authSiteForm input[type=checkbox][name=all]");
            var checkList = $("#authSiteForm").find('input[type=checkbox][platform='+platform+']');
            if($(this).is(':checked')){
                checkList.prop("checked",true);
            }else{
                checkList.prop('checked', false);
            }
            var len = $("#authSiteForm").find('input[type=checkbox]:checked').length;
            var totalLength = $("#authSiteForm").find('input[type=checkbox]:not(:first)').length;
            if(len === totalLength){
                allbox.prop("checked",true);
            }else{
                allbox.prop('checked', false);
            }
        });
        $("#authSiteForm input[type=checkbox]:not(:first)").on("click", function () {
            var platform = $(this).attr("platform");
            var checkedLength = $("#authSiteForm").find('input[type=checkbox][platform='+platform+']:checked').length;
            var totalLength = $("#authSiteForm").find('input[type=checkbox][platform='+platform+']').length;
            if(totalLength === checkedLength){
                $(".js-platform[value="+platform+"]").prop("checked",true);
            }else{
                $(".js-platform[value="+platform+"]").prop("checked",false);
            }
        });
        $("#authSiteForm input[type=checkbox][name=all]").on("click",function(){
            if($(this).is(':checked')){
                $(".js-platform").prop("checked",true);
            }else{
                $(".js-platform").prop("checked",false);
            }
        })
        // 全选框
        checkeBox();
    })

    // 提示消息弹框方法定义
    userCtrl.on('setTips', function (msg, callback) {
        if (!msg) return;
        $.layer({
            title: '提示消息',
            area: ['500px', '200px'],
            dialog: {
                btns: 1,
                btn: ['返回'],
                type: 8,
                msg: '<div class="tips mB20"><em>' + msg + '</em></div>',
                yes: function (index) {
                    layer.close(index);
                    // 回调
                    callback && callback();
                }
            }
        })
    });


})(mXbn);
