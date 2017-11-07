;
(function (X) {

    var gl_xt = X();

    var ctrl = gl_xt.ctrl();

    var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;

    var dataPath = X.configer.__API_PATH__+ "/" ;

    var request = gl_xt.utils.getRequest(),
        operateData=X.getRolesObj.apply(null,request.m.split('_').slice(2));

    ctrl.view = {
        elem: "#id_conts",
        tpl: path + "/" + X.configer[request.m].tpl
    };
    //页面中存在验证提示时，从页面中移除
    if($('#validateRemind').length){
        $('#validateRemind').remove();
    }
    // 提示消息弹框方法定义
    ctrl.on('setTips',function(msg,callback){
        if(!msg) return;
        $.layer({
            title:'提示消息',
            area: ['500px', ''],
            dialog:{
                btns : 2,
                btn : ['确定', '取消'],
                type : 8,
                msg:'<div class="tips">'+msg+'</div>',
                yes:function(index){
                    layer.close(index);
                    // 回调
                    callback && callback();
                },
                no:function(index){
                    layer.close(index);
                }
            }
        })
    });

    ctrl.request({
        url: dataPath+ X.configer[request.m].api.pageList,
        type: "POST",
        data: JSON.stringify({
            "pageSize": 10,
            "cPageNO":request.page || 1
        })
    }).then(function(data){

        if(data.statusCode == "2000000"){
            data.data.operateData=operateData;
            ctrl.render(data.data).then(function(){
                // 表单校验加载
                ctrl.tirgger("searchFormValid");
                // 模板局部渲染 触发
                ctrl.tirgger("memberRender",data.data);
                // 分页渲染
                ctrl.renderIn('#pageListCon','.page',data);
                // 分页加载
                ctrl.tirgger('pageRender',data.data);
            });
        }else{
            $("#listCon").html("<tr><td colspan='6' style='text-align:center'>操作失败</td></tr>");
        }
    });

    // 模板局部渲染
    ctrl.on('memberRender',function(data){
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        ctrl.renderIn("#list","#listCon",data);

        // 触发页面dom事件
        ctrl.tirgger('dom-event-init',"#id_conts");
    });

    // 初始化页面所有dom事件
    ctrl.on('dom-event-init',function(elem){

        // 搜索提交
        $('.js-search').off().on('click',function(){
            $("#searchForm").submit();
        });

        //操作按钮禁用||启用
        $(".js-subStatus").on("click",function(){
            var idStr = $(this).attr("data-id");
            var idText = $(this).text();
            var html = '<li index-data=""><span>请选择</span></li>';
            if(idText.indexOf("禁用") != -1){
                /*1.判断角色是否关联会员
                 *2.加载角色列表
                 *3.设置角色级别
                 */
                //判断角色是否关联会员
                ctrl.request({
                    url: dataPath+ X.configer[request.m].api.user,
                    type: "POST",
                    data: JSON.stringify({
                        "levelId":idStr,
                        "isValid": true
                    })
                }).then(function(data){
                    if(data.statusCode == "2000000" && data.data > 0){//如果关联了，那就不能直接禁用
                        //加载等级列表
                        ctrl.request({
                            url: dataPath+ X.configer[request.m].api.list,
                            type: "POST",
                            data: JSON.stringify({
                                "isValid": true
                            })
                        }).then(function(data){
                            if(data.statusCode == "2000000"){
                                data.data=$.grep(data.data,function (role) {
                                    if(role.id==idStr){
                                        return false;
                                    }else{
                                        return true;
                                    }
                                });
                                $(data.data).each(function(index, element) {
                                    html += '<li index-data="'+element.id+'"><span>'+element.levelName+'</span></li>';
                                });
                                $("#levelList").html(html);
                                sele();
                            }

                        });

                        $.layer({
                            title : '提示信息',
                            area : ['550px', '240px'],
                            dialog : {
                                btns : 2,
                                btn : ['确认', '取消'],
                                type : 8,
                                msg : '<div class="selectRole"><p>该等级存在已关联的会员。请为该类会员指定相应的等级。</p><dl class="fix"><dt>请选择角色：</dt><dd><div class="select w190 fL"><input index-data="" type="hidden" value="请选择" name="levelId"/><i>请选择</i><em class="icon-52"></em><ul id="levelList"></ul></div></dd></dl></div>',
                                yes : function(layerIndex){
                                    //禁用成功设置角色级别
                                    ctrl.request({
                                        url: dataPath+ X.configer[request.m].api.groupLevel,
                                        type: "POST",
                                        data: JSON.stringify({
                                            "sourceId":idStr,
                                            "targetId": $("[name=levelId]").attr("index-data"),
                                            "type": 1
                                        })
                                    }).then(function(data){
                                        if(data.statusCode=='2000000'){
                                            //禁用
                                            ctrl.request({
                                                url: dataPath+ X.configer[request.m].api.disable + idStr,
                                                type: "PUT",
                                                data: JSON.stringify({
                                                    "id":idStr
                                                })
                                            }).then(function(data){
                                                if(data.statusCode=='2000000'){
                                                    layer.close(layerIndex);
                                                    //禁用后刷新
                                                    gl_xt.router.runCallback();
                                                }else{
                                                    ctrl.tirgger('setTips',X.getErrorName(data.statusCode));
                                                }
                                            });

                                        }else{
                                            ctrl.tirgger('setTips',X.getErrorName(data.statusCode));
                                        }
                                    });

                                }
                            }
                        });
                    }else{//如果没有关联直接禁用
                        ctrl.tirgger('setTips','确定禁用该等级？',function(){
                            ctrl.request({
                                url: dataPath+ X.configer[request.m].api.disable + idStr,
                                type: "PUT",
                                data: JSON.stringify({
                                    "id":idStr
                                })
                            }).then(function(data){
                                if(data.statusCode=='2000000'){
                                    //禁用后刷新
                                    gl_xt.router.runCallback();
                                }else{
                                    ctrl.tirgger('setTips',X.getErrorName(data.statusCode));
                                }
                            });
                        });
                    }

                });
            }else{
                ctrl.tirgger('setTips','确定启用该等级？',function(){
                    ctrl.request({
                        url: dataPath+ X.configer[request.m].api.enable + idStr,
                        type: "PUT",
                        data: JSON.stringify({
                            "id":idStr
                        })
                    }).then(function(data){
                        if(data.statusCode=='2000000'){
                            //ctrl.tirgger('setTips','成功！',function(){
                                gl_xt.router.runCallback();
                            //});
                        }else{
                            ctrl.tirgger('setTips',X.getErrorName(data.statusCode));
                        }
                    });
                });
            }
        });

    });
        // 分页加载
    ctrl.on('pageRender',function(data){
        var toPageNo=request.page,
            pageSize=50,
            totalPages=data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: toPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            ctrl.tirgger('searchSubmit',p,function(data){
                gl_xt.router.setHistory("?m="+request.m+"&page="+p);
                ctrl.tirgger("memberRender",data);
                toPageNo=p;
            });
        });
    });

    // 列表搜索提交
    ctrl.on('searchSubmit',function(toPageNo,callback){
        var levelName = $("[name=levelName]").val(),
            sendData={
                levelName:levelName ? levelName : "",
                cPageNO:toPageNo,
                pageSize:10
            };
        ctrl.request({
            url:dataPath+ X.configer[request.m].api.pageList,
            type: "post",
            data:JSON.stringify(sendData)
        }).then(function(data){
            if(data.statusCode=='2000000'){
                data.data.operateData=operateData;
                callback && callback(data.data);
            }else{
                $("#listCon").html("<tr><td colspan='6' style='text-align:center'>数据加载失败</td></tr>");
            }
        });
    });

    ctrl.on('searchFormValid',function(){
        // 表单验证
        $('#searchForm').html5Validate(function(){
            ctrl.tirgger('searchSubmit',1,function(data){
                //列表渲染和事件触发
                ctrl.tirgger('memberRender',data);
                // 分页渲染
                ctrl.renderIn('#pageListCon','.page',data);
                // 分页加载
                ctrl.tirgger('pageRender',data);
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            })
        });
    });

})(mXbn);
