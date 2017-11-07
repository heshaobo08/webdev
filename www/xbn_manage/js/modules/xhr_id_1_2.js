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
		type: "post",
		data : JSON.stringify({
			"pageSize": 10,
			"cPageNO": request.page || 1
		})
	}).then(function(data){
		if(data.statusCode == "2000000"){
            data.data.operateData=operateData;
			ctrl.render(data.data).then(function(){
				// 模板局部渲染 触发
				ctrl.tirgger("memberRender",data.data);
				// 表单校验加载
				ctrl.tirgger("searchFormValid");
				// 分页渲染
				ctrl.renderIn('#pageListCon','.page',data);
				// 分页加载
				ctrl.tirgger('pageRender',data.data);
				sele();
			});
		}else{
			$("#listCon").html("<tr><td colspan='4' style='text-align:center'>操作失败</td></tr>");
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
		
		$(".timeStart").on("click",function(){
			laydate({
				istime: true,
				elem : '#startTime',
				event : 'focus',
				format: 'YYYY-MM-DD hh:mm:ss'
			});
		});
		$(".timeEnd").on("click",function(){
			laydate({
				istime: true,
				elem : '#endTime',
				event : 'focus',
				format: 'YYYY-MM-DD hh:mm:ss'
			});
		});
		subStatus();//调用启用||禁用
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
        },{
            validate: function() {
                // 开始时间和结束时间的校验
                if($("#startTime").html() && $('#endTime').html()==""){
					$("#endTime").testRemind("请选择结束时间");
                    return false;
                }else if($("#startTime").html()=="" && $('#endTime').html() ){
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
    ctrl.on('pageRender',function(data){
        var toPageNo=request.page,
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
        var roleName = $("[name=roleName]").val(),
			statTime = $("[data-startime=createTime_start]").text(),
			endTime = $("[data-endtime=createTime_end]").text(),
			isValid = $("[name=isValid]").attr("index-data"),
			sendData={
				roleName:roleName ? roleName : "",
				createTime_start:statTime ? statTime : "",
				createTime_end:endTime ? endTime : "",
				isValid:isValid ? isValid : "",
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
				$("#listCon").html("<tr><td colspan='4' style='text-align:center'>数据加载失败</td></tr>");
			}
		});
    });
	
	//启用||禁用
	function subStatus(){
		ctrl.on("init_isValid", function (elem) {
			$(elem).find(".js-isValid").off().on("click", function () {
				var idStr = $(this).attr("data-id");
				var idText = $(this).text();
				if(idText.indexOf("禁用") != -1){
					ctrl.tirgger('setTips','确定禁用该角色？',function(){
						ctrl.request({
							url: dataPath+ X.configer[request.m].api.disable,
							type: "Post",
							data: JSON.stringify({
								"batchIds":idStr
							})
						}).then(function(data){
							if(data.statusCode=='2000000'){
								gl_xt.router.runCallback();
							}else{
								ctrl.tirgger('setTips','数据操作失败');
							}
						});	
					});
					
				}else{
					ctrl.tirgger('setTips','确定启用该角色？',function(){
						ctrl.request({
							url: dataPath+ X.configer[request.m].api.enable,
							type: "Post",
							data: JSON.stringify({
								"batchIds":idStr
							})
						}).then(function(data){
							if(data.statusCode=='2000000'){
								gl_xt.router.runCallback();
							}else{
								ctrl.tirgger('setTips','数据操作失败');
							}
						});		
					});
				}
			});
		});
		ctrl.tirgger("init_isValid", "#id_conts");
	}

})(mXbn);