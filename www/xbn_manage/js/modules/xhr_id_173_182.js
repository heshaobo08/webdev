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

	ctrl.view = {
		elem: "#id_conts",
		tpl: path + "/" + X.configer[request.m].tpl
	};
	
	// 提示消息弹框方法定义
    ctrl.on('setTips',function(msg,callback){
        if(!msg) return;
        $.layer({
            title:'提示消息',
            area: ['500px', '200px'],
            dialog:{
                btns : 2,
				btn : ['确定', '取消'],
				type : 8,
                msg:'<div class="tips mB20"><em>'+msg+'</em></div>',
                yes:function(index){
                    layer.close(index);
                    // 回调
                    callback && callback();
                },
				no:function(index){
                    layer.close(index);
                }
            }
        });
    });
	
		
	//向后台发送数据
	ctrl.request({
		url: dataPath+ X.configer[request.m].api.list,
		type: "post",
		data: JSON.stringify({
			"toPageNo":request.page || 1,
			"pageSize": 50
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
			$("#listCon").html("<tr><td colspan='9' style='text-align:center'>操作失败</td></tr>");
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
	
		$(".js-pay").on("click", function () {
			var orderId = $(this).attr("data-index");
			ctrl.request({
				url: dataPath+ X.configer[request.m].api.billQuery + orderId,
				type: "Post",
				data: JSON.stringify({
					"billId": orderId
				})
			}).then(function(data){

				$.layer({
					title : '已补缴',
					area : ['550px', ''],
					dialog : {
						btn : 1,
						btn : ['关闭'],
						type : 8,
						msg : '<div class="initBox" data-id="'+data.data.billId+'"><dl class="textDl"><dt>应缴美金金额：</dt><dd>'+data.data.USDMoney+'</dd></dl><dl class="textDl"><dt>应缴人民币金额：</dt><dd>'+data.data.CNYMoney+'</dd></dl><dl class="textDl"><dt>实收人民币金额：</dt><dd>'+data.data.payCNYMoney+'</dd></dl><dl class="textDl"><dt>备注：</dt><dd>'+data.data.remark+'</dd></dl><dl class="textDl"><dt>处理人员：</dt><dd>'+data.data.operator+'</dd></dl><dl class="textDl"><dt>操作时间：</dt><dd>'+data.data.payTime+'</dd></dl></div>'
					}
				});
			});
			
		});
		
		$(".js-notReflect").on("click", function () {
			var orderId = $(this).attr("data-index");
			ctrl.request({
				url: dataPath+ X.configer[request.m].api.billQuery + orderId,
				type: "post",
				data: JSON.stringify({
					"billId": orderId
				})
			}).then(function(data){
				$.layer({
					title : '未提现',
					area : ['550px', ''],
					dialog : {
						btns : 2,
						btn : ['提交', '取消'],
						type : 8,
						msg : '<form id="financeForm"><div class="initBox" data-id="'+data.data.billId+'"><dl class="editDl"><dt><font></font>应缴美金金额：</dt><dd>'+data.data.USDMoney+'</dd></dl><dl class="editDl"><dt><font></font>应缴人民币金额：</dt><dd>'+data.data.CNYMoney+'</dd></dl><dl class="editDl"><dt><font>*</font>实收人民币金额：</dt><dd><input type="text" name="money" required class="input w190 mR10" data-max="10" value="'+Math.abs(data.data.CNYMoney)+'" disabled>元</dd></dl><dl class="editDl"><dt><font></font>备注：</dt><dd><textarea class="w240 h70 textedit" name="remark" data-max="200"></textarea></dd></dl></div></form>',
						yes: function(){	
							$.testRemind.css.zIndex=$('.xubox_shade').css('zIndex')+1;
								$("#financeForm").html5Validate(function(){
									ctrl.request({
										url: dataPath+ X.configer[request.m].api.billEdit,
										type: "post",
										data: JSON.stringify({
											"billId": orderId,
											"money": $("input[name=money]").val(),
											"remark": $("[name=remark]").val()
										})
									}).then(function(){
										if(data.statusCode == "2000000"){
											$.layer({
												title:'提示消息',
												area: ['500px', '200px'],
												dialog:{
													btn : 1,
													btn : ['确定'],
													type : 8,
													msg:'<div class="tips mB20"><em>您的信息已经修改成功！</em></div>',
													yes:function(index){
														layer.close(index);
                                                        gl_xt.router.runCallback();
													}
												}
											});
										}else{
											ctrl.tirgger('setTips','数据操作失败');
										}
									});
								},{
									validate: function() {
										//不允许0和负数以及非数字
										var _val = $('input[name=money]').val();
										var reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
										
										if(!reg.test(_val) || _val<=0){
											$("[name=money]").testRemind("请输入大于0的数字");
											return false;
										}
										
										return true;
										$(".js-search").click();
									}
								});
							$("#financeForm").submit();
						},	
						success: function(layero, index){
							
							
						}		
					}
				});
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
        var userName = $("[name=userName]").val(),
			billStatus = $("[name=status]").attr("index-data"),
			commitTimeStart = $("[data-startime=createTime_start]").text(),
			commitTimeEnd = $("[data-endtime=createTime_end]").text();
			sendData={
				userName:userName ? userName : "",
				status:billStatus ? billStatus : "",
				startTime:commitTimeStart ? commitTimeStart : "",
				endTime:commitTimeEnd ? commitTimeEnd : "",
				toPageNo:toPageNo,
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