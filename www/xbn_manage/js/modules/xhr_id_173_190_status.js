;
(function (X) {
	
	var gl_xt = X();
	
	var ctrl = gl_xt.ctrl();

	var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;
	
	var dataPath = X.configer.__API_PATH__+'/'; 

	var request = gl_xt.utils.getRequest();
	
	var id = request.id;

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
        })
    });
	
	renderData();
	
	//向后台发送数据
	function renderData(){
		ctrl.request({
			url: dataPath+ X.configer[request.m].api.order,
			type: "POST",
			data: JSON.stringify({
				"orderId": id
			})
		}).then(function(data){
			
			if(data.statusCode == "2000000"){
				var orderData = data.data;
				// $(orderData.orderProductList).each(function(index, element) {
    //                 element.favorableValue = Number(element.productPrice*element.productCount-element.totalPrice);
    //             });
				ctrl.render(orderData).then(function(){
					interactive();//调用交互				
				});
			}else{
				$(".bigTable tbody").html("<tr><td colspan='5' style='text-align:center'>操作失败</td></tr>");
			}
		});
	}
	
	//付款
	function pay(){
		$(".js-pay").on("click", function () {
			var id = $(this).attr("index-id");
			var html = '<form id="payForm"><div class="payed">';
				html += '<dl><dt>实付金额：</dt><dd><input type="text" class="input w190 mR10" required data-max="10" name="payAmount"/>元</dd></dl>';
				html += '<dl><dt>付款时间：</dt><dd><div class="deadline"><span class="dataInput" id="payTime"></span><a class="icon-54 timeStart" href="javascript:;"></a></div></dd></dl>';
				html += '<dl class=""><dt>付款方式：</dt><dd> <div class="select w190 fL"><input type="hidden" value="请选择" index-data="" name="payType"><i>请选择</i><em class="icon-52"></em>' +
						'<ul style=""> '+
						'<li index-data=""><span>请选择</span></li>' +
						'<li index-data="银行转账"><span>银行转账</span></li>' +
			            '<li index-data="支票"><span>支票</span></li>' +
			            '<li index-data="现金"><span>现金</span></li>' +
			            '<li index-data="支付宝"><span>支付宝</span></li>' +
			            '<li index-data="网银"><span>网银</span></li>' +
						'</ul>'+
						'</div></dd></dl>';
				html += '<dl class=""> <dt>交易流水号：</dt><dd><input type="text" class="w190 input" name="tranCode" required/></dd></dl>';
				html += '</div></form>';
				
			$.layer({
				title : '付款信息',
				area : ['550px', '400px'],
				dialog : {
					btns : 2,
					btn : ['提交', '取消'],
					type : 8,
					msg : html,
					yes:function(index){
						 $("#payForm").submit();
					}
				},
				success: function(){
					// 控制层级
                    $.testRemind.css.zIndex=$('.xubox_shade').css('zIndex')+1;
                    // 表单验证
					$("#payForm").html5Validate(function(){
                        ctrl.request({
							url: dataPath+ X.configer[request.m].api.save,
							type: "POST",
							data:JSON.stringify({
								"orderId":id,
								"payType":$("[name=payType]").val(),
								"payAmount":$("[name=payAmount]").val(),
								"payTime":$("#payTime").text(),
								"tranCode":$("[name=tranCode]").val()	
							})
						}).then(function(data){
                             if(data.statusCode == "2000000"){
								$.layer({
									title:'提示消息',
									area: ['500px', '200px'],
									dialog:{
										btn : 1,
										btn : ['确定'],
										type : 8,
										msg:'<div class="tips mB20"><em>提交成功</em></div>',
										yes:function(index){
                            				layer.close(index);
											// 回调
											gl_xt.router.setHistory("?m=xhr_id_173_190");
											gl_xt.router.runCallback();
										}
									}
								})
							}
                        });
                    },{
						validate: function() {
							//不允许0和负数以及非数字
							var _val = $('input[name=payAmount]').val();
							var reg = /[0-9]+\.?[0-9]{0,2}/;
							
							if(!reg.test(_val) || _val<=0){
								$('input[name=payAmount]').testRemind("请输入大于0的数字");
								return false;
							}
							
							// 开始时间和结束时间的校验
							if($("#payTime").html()==""){
								$("#payTime").testRemind("请选择付款时间");
								return false;
							}
							
							if($("[name=payType]").attr("index-data")==""){
								$(".select").testRemind("请选择付款方式");
								return false;
							}
							return true;							
						}
					});

					sele();


					$(".timeStart").on("click",function(){
						laydate({
							istime: true,
							elem : '#payTime',
							event : 'focus',
							format: 'YYYY-MM-DD hh:mm:ss',
							min:$('#makeOrderTime').text()  //设定最小日期为当前日期
						});
					});
				}	
			});
		});
	}
	
	//开通
	function openServe(){
		$(".js-open").on("click", function () {
			var id = $(this).attr("index-id");
			$.layer({
				title : '服务信息',
				area : ['550px', '400px'],
				dialog : {
					btns : 2,
					btn : ['提交', '取消'],
					type : 8,
					msg : '<form id="financeForm"><div class="servise">' +
							'<dl><dt>开通状态：</dt>' +
								'<dd><span class="mR50"><input type="radio" class="mR10" name="status" value="1" checked="true"/>开通</span><span class="mR50"><input type="radio" class="mR10" name="status" value="0"/>不开通</span></dd>'+
							'</dl>'+
							'<textarea name="openRemark" cols="30" rows="10" required index-data="1"></textarea>'+
							'<textarea name="openRemark" cols="30" rows="10" required index-data="0" class="none"></textarea>'+
						'</div></form>',
					yes: function(index){
						//开通才向下执行
						ctrl.request({
							url: dataPath + X.configer[request.m].api.open,
							type: "post",
							data: JSON.stringify({
								"orderProductId": id,
								"openStatus": $("[name=status]:checked").val(),
								"openRemark": $("textarea:visible[name=openRemark]").val()
							})
						}).then(function(data){
							if(data.statusCode == "2000000"){
								$.layer({
									title:'提示消息',
									area: ['500px', '200px'],
									dialog:{
										btn : 1,
										btn : ['确定'],
										type : 8,
										msg:'<div class="tips mB20"><em>操作成功</em></div>',
										yes:function(index){
											layer.close(index);
											//刷新列表
											renderData();
										}
									}
								})
								
							}else{
								$.layer({
									title:'提示消息',
									area: ['500px', '200px'],
									dialog:{
										btn : 1,
										btn : ['确定'],
										type : 8,
										msg:'<div class="tips mB20"><em>操作失败</em></div>',
										yes:function(index){
											layer.close(index);
										}
									}
								})
							}
						});
					}	
				},
				success: function(){
					$("[name=status]").off().on("click",function(){
						if($(this).val() == "0"){
							$("textarea[index-data=1]").hide();	
							$("textarea[index-data=0]").show();								
						}else{
							$("textarea[index-data=1]").show();	
							$("textarea[index-data=0]").hide();		
						}
					});
				}
			});
		});
	}
	
	//查看服务
	function lookServe(){
		$(".js-view").on("click", function () {
			var openStatus = $(this).siblings("[name=openStatus]").val(),
				openBy = $(this).siblings("[name=openBy]").val(),
				openComment = $(this).siblings("[name=openComment]").val(),
				openTime = $(this).siblings("[name=openTime]").val();
			$.layer({
				title : '服务信息',
				area : ['550px', '400px'],
				dialog : {
					btn : 1,
					btn : ['关闭'],
					type : 8,
					msg : '<div class="servise serviseStatement fix">' +
						'<dl><dt>开通状态：</dt>' +
						'<dd>'+openStatus+'</dd>'+
						'</dl>'+
						'<dl><dt>操作人：</dt>' +
						'<dd>'+openBy+'</dd>'+
						'</dl>'+
						'<dl><dt>操作时间：</dt>' +
						'<dd>'+openTime+'</dd>'+
						'</dl>'+
						'<dl><dt>备注：</dt><dd>'+openComment+'</dd></dl>'+
						'</div>'
				}
			});
		});
	}
		
	//加载交互
	function interactive(){

		//支付订单
		pay();
	
		//开通服务
		openServe();

		//查看服务
		lookServe();
	}
	
})(mXbn);