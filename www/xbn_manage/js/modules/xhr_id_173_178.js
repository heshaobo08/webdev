;
(function (X) {
	
	var gl_xt = X();
	
	var ctrl = gl_xt.ctrl();

	var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;
	
	var dataPath = X.configer.__API_PATH__; 

	var request = gl_xt.utils.getRequest(),

        operateData=X.getRolesObj.apply(null,request.m.split('_').slice(2));	
        
	var totalPages = "";//后台返回的总页码数
	
	var cPageNO = "";//当前页码

	ctrl.view = {
		elem: "#id_conts",
		tpl: path + "/" + X.configer[request.m].tpl
	};
			
	//向后台发送数据
	ctrl.request({
		url: dataPath+ X.configer[request.m].api.list,
		type: "post",
		data: JSON.stringify({
			"start":request.page || 1,
			"pageSize":50
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
				// 全选框
				sele();
			});
			
		}else{
			$("#listCon").html("<tr><td colspan='8' style='text-align:center'>操作失败</td></tr>");
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
				$('#searchTotalCount').closest('.addbutton').removeClass('none');
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
        var userName = $("[name=userName]").val(),
			cardNo = $("[name=cardNo]").val(),
			statTime = $("[data-startime=createTime_start]").text(),
			endTime = $("[data-endtime=createTime_end]").text(),
			status = $("[name=status]").attr("index-data"),
			sendData={
				userName:userName ? userName : "",
				cardNo:cardNo ? cardNo : "",
				startTime:statTime ? statTime : "",
				endTime:endTime ? endTime : "",
				status:status ? status : "",
				start:toPageNo,
				pageSize:50
			};
		ctrl.request({
			url:dataPath+ X.configer[request.m].api.list,
			type: "post",
			data:JSON.stringify(sendData)
		}).then(function(data){
			if(data.statusCode=='2000000'){  
                data.data.operateData=operateData;
				callback && callback(data.data);
			}else{
				$("#listCon").html("<tr><td colspan='8' style='text-align:center'>数据加载失败</td></tr>");
			}
		});
    });
	
})(mXbn);