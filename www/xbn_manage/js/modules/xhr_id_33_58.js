;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    var opath = X.configer.__ROOT_PATH_IMG_HOST__;

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var joinCtrl = gl_hy.ctrl();

    var localParm=gl_hy.utils.getRequest(),

        levelList={},

        roleList={},

        operateData=X.getRolesObj.apply(null,localParm.m.split('_').slice(2));

    // 创建视图
    joinCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };
    //页面中存在验证提示时，从页面中移除
    if($('#validateRemind').length){
        $('#validateRemind').remove();
    }
    // 获取等级数据
    joinCtrl.request({
        url:jsPath + X.configer[localParm.m].api.userLevelList,
        type:"post",
        data:JSON.stringify({
            "isValid": true
        })
    }).then(function(data){
        if(data.statusCode=='2000000'){
            $.each(data.data,function(i,val){
                levelList[val.id]=val;
            })
        }else{
            joinCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
        }
    });

    // 获取角色数据
    joinCtrl.request({
        url:jsPath + X.configer[localParm.m].api.userRoleList,
        type:"post",
        data:JSON.stringify({
            "isValid": true
        })
    }).then(function(data){
        if(data.statusCode=='2000000'){
            $.each(data.data,function(i,val){
                roleList[val.id]=val;
            })
        }else{
            joinCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
        }
    });


    // 会员管理列表加载
    joinCtrl.request({
        url:jsPath + X.configer[localParm.m].api.settledList,
        type: "post",
        data:JSON.stringify({
            "pageSize":'10',
            "cPageNo":localParm.page || 1,
            "listType":'0'
        })
    }).then(function(data){
        if(data.statusCode=='2000000'){
            data.data.operateData=operateData;
            joinCtrl.render(data.data).then(function(){
                // 模板局部渲染 触发
                joinCtrl.tirgger("joinRender",data.data);
                // 表单校验加载
                joinCtrl.tirgger("searchFormValid");

                // 分页渲染
                joinCtrl.renderIn('#pageListCon','.page',data.data);

                // 全选框
                sele();
                // 分页加载
                joinCtrl.tirgger('pageRender',data.data);

            });
        }else{
            joinCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
        }
    });

    // 模板局部渲染
    joinCtrl.on('joinRender',function(data){
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        joinCtrl.renderIn('#joinListTmpl','#joinListCon',data);

        // 触发页面dom事件
        joinCtrl.tirgger('dom-event-init',"#id_conts");
    });

    // 初始化页面所有dom事件
    joinCtrl.on('dom-event-init',function(elem){
        var cPageNo=1,
            pageSize=10;

        // 搜索提交
        $('.js-joinSearch').off().on('click',function(){
            $("#joinSearchForm").submit();
        });

        // 开通（Todo）
        $(".js-settledLock").off().on('click',function(){
            var id=$(this).attr('data-id'),
                userId=$(this).attr('data-userId');
            var sendData={
                    roleList:roleList,
                    levelList:levelList,
                    userId:userId
                };

            // 角色等级弹框渲染
            joinCtrl.renderIn('#settledUserRoleTmpl',".layerCon",sendData);
            // 弹框
            $.layer({
                title : '提示信息',
                area : ['550px', '180px'],
                dialog : {
                    btns : 2,
                    btn : ['确认', '取消'],
                    type : 8,
                    msg : $(".layerCon").html(),
                    yes:function(index){
                        $("#settledUserRoleForm").submit();
                    }
                },
                success:function(){
                    //创建默认相册
                    $.ajax({
                        url: mXbn.configer.__ROOT_PATH__ + "/api/service/sessid",
                        type: "get",
                        success: function (data) {
                            if (data.statusCode == "2000000") {
                                var sesseionID = data.data;
                                crossDomain(X, {
                                    url: opath + X.configer[localParm.m].api.saveDefult,
                                    sesseionID: sesseionID,
                                    data: {
                                        typeCreateuser: userId
                                    },
                                    type: "post",
                                    success: function (data) {
                                        if(data.statusCode=='2000000'){
                                            $(".layerCon").html("");

                                            // 下拉列表
                                            sele('.select',"#settledUserRoleForm");

                                            $.testRemind.css.zIndex=$('.xubox_shade').css('zIndex')+1;
                                            // 表单验证
                                            $("#settledUserRoleForm").html5Validate(function(){
                                                // 提交开通接口
                                                joinCtrl.request({
                                                    url:jsPath+X.configer[localParm.m].api.settledOpen+id,
                                                    type:'get'
                                                }).then(function(data){
                                                    if(data.statusCode=='2000000'){
                                                        // 设置角色和等级
                                                        joinCtrl.request({
                                                            url:jsPath+X.configer[localParm.m].api.userUpdateGroupLevel,
                                                            type:'post',
                                                            data:JSON.stringify({
                                                                id:$('input[name=id]',"#settledUserRoleForm").val(),
                                                                groupId:$('input[name=groupId]',"#settledUserRoleForm").attr('index-data'),
                                                                levelId:$('input[name=levelId]',"#settledUserRoleForm").attr('index-data')
                                                            })
                                                        }).then(function(userdata){
                                                            if(userdata.statusCode=='2000000'){
                                                                joinCtrl.tirgger('setTips','开通成功',function(){
                                                                    layer.close(layer.index);
                                                                    gl_hy.router.runCallback();
                                                                });
                                                            }else{
                                                                joinCtrl.tirgger('setTips',X.getErrorName(userdata.statusCode));
                                                            }
                                                        });

                                                    }else{
                                                        joinCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                                                    }
                                                });
                                            });
                                        }else{
                                            $.alert('创建默认相册失败请重试')
                                        }
                                    },
                                    error: function (error) {
                                        errorFn && errorFn(error);
                                    }
                                });

                            }
                        }
                    })

                }
            });

        });


        // 开始时间
        $(".timeStart,#startTime").off().on("click",function(){
            laydate({
                istime: true,
                elem : '#startTime',
                event : 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        // 结束时间
        $(".timeEnd,#endTime").off().on("click",function(){
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

    // 表单验证
    joinCtrl.on('searchFormValid',function(){

        $('#joinSearchForm').html5Validate(function(){
            joinCtrl.tirgger('searchSubmit',1,function(data){
                // 模板局部渲染 触发
                joinCtrl.tirgger("joinRender",data);
                // 分页加载
                joinCtrl.tirgger('pageRender',data);
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

    // 列表搜索提交
    joinCtrl.on('searchSubmit',function(toPageNo,callback){
        var userMobile=$('input[name=userMobile]','#joinSearchForm').val(),
                companyName=$('input[name=companyName]','#joinSearchForm').val(),
                startChkTime=$('[name=startChkTime]','#joinSearchForm').html(),
                endChkTime=$('[name=endChkTime]','#joinSearchForm').html(),
                companyType=$('[name=companyType]','#joinSearchForm').attr('index-data'),
                auditStatus=$('input[name=auditStatus]','#joinSearchForm').attr('index-data'),
                sendData={
                    userMobile:userMobile?userMobile:null,
                    companyName:companyName?companyName:null,
                    companyType:companyType?companyType:null,
                    startCreateTime:startChkTime?startChkTime:null,
                    endCreateTime:endChkTime?endChkTime:null,
                    auditStatus:auditStatus?auditStatus:null,
                    pageSize:10,
                    cPageNo:toPageNo,
                    listType:'0'
                };
            // 发送请求
            joinCtrl.request({
                data:JSON.stringify(sendData),
                url:jsPath + X.configer[localParm.m].api.settledList,
                type: "post"
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    data.data.operateData=operateData;
                    callback && callback(data.data);
                }else{
                     joinCtrl.tirgger('setTips','数据加载失败');
                }

            });
    });

    // 分页加载
    joinCtrl.on('pageRender',function(data){
        var cPageNo=localParm.page,
            totalPages=data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            joinCtrl.tirgger('searchSubmit',p,function(data){
                gl_hy.router.setHistory("?m="+localParm.m+"&page="+p);
                joinCtrl.tirgger("joinRender",data);
                cPageNo=p;
            });
        });
    });


    // 提示消息弹框方法定义
    joinCtrl.on('setTips',function(msg,callback){
        if(!msg) return;
        $.layer({
            title:'提示消息',
            area: ['500px', '200px'],
            dialog:{
                btns:1,
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
