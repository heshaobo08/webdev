;
(function (X) {
	
	var gl_xt = X();
	
	var ctrl = gl_xt.ctrl();

	var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;
	
	var dataPath = X.configer.__API_PATH__+'/'; 

	var request = gl_xt.utils.getRequest(),
    
        operateData=X.getRolesObj.apply(null,request.m.split('_').slice(2));
	
	var totalPages = "";//后台返回的总页码数
	
	var cPageNO = "";//当前页码
    var bankData={};

	ctrl.view = {
		elem: "#id_conts",
		tpl: path + "/" + X.configer[request.m].tpl
	};
	//加载银行基本数据
	ctrl.request({
		url: dataPath+"/dictionary/dict",
		type: "post",
		data: JSON.stringify({
			"types" : ["opening_bank"]
		}),
        async:false
	}).then(function(data){
        if(data.statusCode == "2000000"){
            $.each(data.data.opening_bank,function  (i,bank) {
                bankData[bank.id]=bank;
            });
        }else{
            ctrl.tirgger('setTips',X.getErrorName(siteConfigDate.statusCode));
        }			
	});	
	
	//向后台发送数据
	ctrl.request({
		url: dataPath+"/"+X.configer[request.m].api.list,
		type: "post",
		data: JSON.stringify({
			"start":request.page || 1,
			"pageSize":50
		})
	}).then(function(data){
		
		if(data.statusCode == "2000000"){
            data.data.operateData=operateData;
            data.data.bankData=bankData;
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
        var userName = $("[name=name]").val(),
			cardNo = $("[name=cardNo]").val(),
			holderType = $("[name=holderType]").attr("index-data"),
			banks = $("[name=banks]").attr("index-data"),
			status = $("[name=status]").attr("index-data"),
			statTime = $("[data-startime=createTime_start]").text(),
			endTime = $("[data-endtime=createTime_end]").text(),
			sendData={
				userName:userName ? userName : "",
				cardNo:cardNo ? cardNo : "",
				holderType:holderType ? holderType : "",
				bankName:banks ? banks : "",
				status:status ? status : "",
				createTimeStart:statTime ? statTime : "",
				createTimeEnd:endTime ? endTime : "",
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
                data.data.bankData=bankData;
				callback && callback(data.data);
			}else{
				$("#listCon").html("<tr><td colspan='8' style='text-align:center'>数据加载失败</td></tr>");
			}
		});
    });
	// 提示消息弹框方法定义
    ctrl.on('setTips',function(msg,callback){
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