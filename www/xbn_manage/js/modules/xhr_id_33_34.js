;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';
    var jsPath=X.configer.__API_PATH__;

    var memberCtrl = gl_hy.ctrl();

    var localParm=gl_hy.utils.getRequest(),
        operateData=X.getRolesObj.apply(null,localParm.m.split('_').slice(2));

    // 创建视图
    memberCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };
    //页面中存在验证提示时，从页面中移除
    if($('#validateRemind').length){
        $('#validateRemind').remove();
    }
    // 会员管理列表加载
    memberCtrl.request({
        url:jsPath + X.configer[localParm.m].api.userList,
        type: "post",
        data:JSON.stringify({
            "pageSize":'10',
            "cPageNo":localParm.page || 1
        })
    }).then(function(data){
        if(data.statusCode=='2000000'){
            data.data.operateData=operateData;
            memberCtrl.render(data.data).then(function(){
                // 模板局部渲染 触发
                memberCtrl.tirgger("memberRender",data.data);
                // 表单校验加载
                memberCtrl.tirgger("searchFormValid");
                // 分页渲染
                memberCtrl.renderIn('#pageListCon','.page',data);
                // 分页加载
                memberCtrl.tirgger('pageRender',data.data);
                // 全选框
                sele();

            });
        }else{
            memberCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
        }
    });

    // 模板局部渲染
    memberCtrl.on('memberRender',function(data){
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        memberCtrl.renderIn('#userListTmpl','#userListCon',data);

        // 触发页面dom事件
        memberCtrl.tirgger('dom-event-init',"#id_conts");
    });

    // 初始化页面所有dom事件
    memberCtrl.on('dom-event-init',function(elem){

        // 搜索提交
        $('.js-userListSearch').off().on('click',function(){
            $("#userSearchForm").submit();
        });


        // 会员解冻
        $(".js-userStatusreFrozen",elem).off().on("click", function () {
            var id=$(this).attr('data-id');
            $.layer({
                title : '提示信息',
                area : ['550px', '180px'],
                dialog : {
                    btns : 2,
                    btn : ['确认', '取消'],
                    type : 8,
                    msg : '<div class="frozen"><p class="frozenTitle">确定要解冻该会员吗？</p></div>',
                    yes:function(index){
                        memberCtrl.request({
                            url:jsPath + X.configer[localParm.m].api.userUnfreeze,
                            data:JSON.stringify({
                                id:id
                            }),
                            type:'post'
                        }).then(function(data){
                            if(data.statusCode=='2000000'){
                                memberCtrl.tirgger('setTips','会员解冻成功！',function(){
                                    gl_hy.router.runCallback();
                                });
                            }else{
                                memberCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                            }
                        });
                    }
                }
            });
        });

        // 会员冻结
        $(".js-userStatusFrozen",elem).off().on("click",function(){
            var id=$(this).attr('data-id');
            $.layer({
                title: '提示信息',
                area: ['550px', '300px'],
                dialog: {
                    btns: 2,
                    btn: ['确认','取消'],
                    type : 8,
                    msg: '<form id="frozenForm"><div class="frozen mB20"><p class="frozenTitle">确认冻结该会员？</p><textarea name="remark" id="" cols="30" rows="10" class="textadd" placeholder="请输入冻结原因" required></textarea><p class="isgray mT20" style="text-align:center">提醒：冻结后会员将无法登录网站，请确保该会员无待处理的业务。</p></div></form>',
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
                        memberCtrl.request({
                            url:jsPath + X.configer[localParm.m].api.userFreeze,
                            data:JSON.stringify({
                                id:id,
                                remark:$("[name=remark]","#frozenForm").val()
                            }),
                            type:'post'
                        }).then(function(data){
                            if(data.statusCode=='2000000'){
                                layer.close(layer.index);
                                gl_hy.router.runCallback();
                            }else{
                                memberCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                            }
                        });
                    });
                }
            });
        });

        // 会员禁用
        $('.js-userStatusForbid').off().on('click',function(){
            var id=$(this).attr('data-id');
            $.layer({
                title : '提示信息',
                area : ['550px', '300px'],
                dialog : {
                    btns : 2,
                    btn : ['确认', '取消'],
                    type : 8,
                    msg : '<form id="forbidForm"><div class="frozen mB20"><p class="frozenTitle">确认禁用该会员？</p><textarea name="reason" id="" cols="30" rows="10" class="textadd" placeholder="请输入冻结原因" required></textarea></div></form>',
                    yes:function(index){
                        $("#forbidForm").submit();
                    },
                    no: function(index){
                        layer.close(index);
                    }
                },
                success:function(){
                    // 控制层级
                    $.testRemind.css.zIndex=$('.xubox_shade').css('zIndex')+1;
                    // 表单验证
                    $("#forbidForm").html5Validate(function(){
                        memberCtrl.request({
                            url:jsPath + X.configer[localParm.m].api.userDisable,
                            data:JSON.stringify({
                                id:id,
                                remark:$("[name=reason]","#forbidForm").val()
                            }),
                            type:'post'
                        }).then(function(data){
                            if(data.statusCode=='2000000'){
                                memberCtrl.tirgger('setTips','会员禁用成功！',function(){
                                    gl_hy.router.runCallback();
                                });
                            }else{
                                memberCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                            }
                        });
                    });
                }
            });
        });


        // 开始时间
        $(".timeStart,#startTime").on("click",function(){
            laydate({
                istime: true,
                elem : '#startTime',
                event : 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        // 重置密码
        $(".js-userStatusReset",elem).off().on("click", function () {
            var id=$(this).attr('data-id');
            $.layer({
                title : '提示信息',
                area : ['550px', ''],
                dialog : {
                    btns : 2,
                    btn : ['确认', '取消'],
                    type : 8,
                    msg : '<div class="frozen"><p class="frozenTitle">确定要重置该会员密码吗？</p></div>',
                    yes:function(index){
                        memberCtrl.request({
                            url:jsPath + X.configer[localParm.m].api.userResetpwd,
                            type:'post',
                            data:JSON.stringify({
                                id:id
                            })
                        }).then(function(data){
                            if(data.statusCode=='2000000'){
                                memberCtrl.tirgger('setTips','密码重置成功！',function(){
                                    gl_hy.router.runCallback();
                                });
                            }else{
                                memberCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                            }
                        });
                    }
                }
            });
        });

        // 结束时间
        $(".timeEnd,#endTime").on("click",function(){
            laydate({
                istime: true,
                elem : '#endTime',
                event : 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        $(".bigTable tbody tr,.smallTable tbody tr").hover(function(){
            $(this).css({"background-color":"#ececec"});
        },function(){
            $(this).attr('style','');
        });

    });

    memberCtrl.on('searchFormValid',function(){
        // 表单验证
        $('#userSearchForm').html5Validate(function(){
            memberCtrl.tirgger('searchSubmit',1,function(data){
                //列表渲染和事件触发
                memberCtrl.tirgger('memberRender',data);
                // 分页渲染
                memberCtrl.renderIn('#pageListCon','.page',data);
                // 分页加载
                memberCtrl.tirgger('pageRender',data);
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            });
        },{
            validate: function() {
                // 开始时间和结束时间的校验
                if($("#startTime").html() && $('#endTime').html()==""){
                    $("#endTime").testRemind("请选择结束时间");
                    return false;
                }else if($("#startTime").html()=="" && $('#endTime').html()){
                    $("#startTime").testRemind("请选择开始时间");
                    return false;
                }else if($("#startTime").html()>$('#endTime').html()){
                    $("#startTime").testRemind("开始时间不能大于结束时间");
                    return false;
                }
                return true;
            }
        });
    });

    // 分页加载
    memberCtrl.on('pageRender',function(data){
        var cPageNo=localParm.page,
            pageSize=10,
            totalPages=data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            memberCtrl.tirgger('searchSubmit',p,function(data){
                gl_hy.router.setHistory("?m="+localParm.m+"&page="+p);
                memberCtrl.tirgger("memberRender",data);
                cPageNo=p;
            });
        });
    });

    // 列表搜索提交
    memberCtrl.on('searchSubmit',function(toPageNo,callback){
        var mobile=$('input[name=mobile]','#userSearchForm').val(),
            name=$('input[name=name]','#userSearchForm').val(),
            userStatus=$('input[name=userStatus]','#userSearchForm').attr('index-data'),
            beginRegisterTime=$('[name=beginRegisterTime]','#userSearchForm').html(),
            endRegisterTime=$('[name=endRegisterTime]','#userSearchForm').html(),
            sendData={
                mobile:mobile?mobile:null,
                name:name?name:null,
                userStatus:userStatus?userStatus:null,
                registerTime_start:beginRegisterTime?beginRegisterTime:null,
                registerTime_end:endRegisterTime?endRegisterTime:null,
                cPageNo:toPageNo,
                pageSize:10
            };
            memberCtrl.request({
                url:jsPath + X.configer[localParm.m].api.userList,
                type: "post",
                data:JSON.stringify(sendData)
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    data.data.operateData=operateData;
                    callback && callback(data.data);
                }else{
                    memberCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });
    });


    // 提示消息弹框方法定义
    memberCtrl.on('setTips',function(msg,callback){
        if(!msg) return;
        $.layer({
            title:'提示消息',
            area: ['500px', '200px'],
            dialog:{
                btn:1,
                btn:['返回'],
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
