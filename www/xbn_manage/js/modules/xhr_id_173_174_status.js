;
(function (X) {
	
	var gl_xt = X();
	
	var ctrl = gl_xt.ctrl();

	var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;
	
	var dataPath = X.configer.__API_PATH__; 

	var request = gl_xt.utils.getRequest();
	
	var id = request.id;
	
	var upload = X(),
		bankData={};

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
	
	renderData();
	
	//向后台发送数据
	function renderData(){
		ctrl.request({
			url: dataPath+ X.configer[request.m].api.query + id,
			type: "POST"
		}).then(function(data){
			if(data.statusCode == "2000000"){
				// 获取审核人员详情
				if(data.data.reviewer){
					ctrl.request({
						url: dataPath+ X.configer[request.m].api.accoutDetail+data.data.reviewer,
						type: "get"
					}).then(function (userDetail) {
						if(userDetail.statusCode == "2000000"){
							data.data.reviewer=userDetail.data.uname;
						}else{
							ctrl.tirgger('setTips',X.getErrorName(userDetail.statusCode));
						}
					});
				}
				var infoData = data;
				var html = "";
				ctrl.request({
					url: document.location.protocol + "//timage.xbniao.com/file/relation/list",
					type: "POST",
					data: JSON.stringify({
						"list":[infoData.data.bankId]	
					})
				}).then(function(data){
					if(data.statusCode == "2000000"){
						var picData={'0':[],'1':[]};
						$(data.data).each(function(index, element) {
							element.fileOriginalurl= document.location.protocol + "//timage.xbniao.com"+element.fileOriginalurl;
							if(element.type){
								picData[element.type].push(element);
							}														
                        });
						infoData.data.fileData=picData;
						$("#upload").html(html);
						infoData.data.bankData=bankData;
						infoData.data.address=$.fn.citySelect.getAreaVal(infoData.data.accountProvince,infoData.data.accountCity);
						ctrl.render(infoData.data).then(function(){							
							//调用校验
							validates();

							
							$(".js-submit").on("click",function(){		
								$("#financeForm").submit();
							});
						
							if($("[name=status]:checked").val()=="2"){
								$(".rejectReason").hide();
								$("[name=rejectReason]").attr("required", false);
							}else{
								$(".rejectReason").show();
								$("[name=rejectReason]").attr("required", true);
							}
							$("[name=status]").on("click",function(){
								if($("[name=status]:checked").val()=="2"){
									$(".rejectReason").hide();
									$("[name=rejectReason]").attr("required", false);
								}else{
									$(".rejectReason").show();
									$("[name=rejectReason]").attr("required", true);
								}
							});
							
							
							var $_file = $("#uploadImg");
							upload.uploadFile($_file, function (D) {
								if (D.statusCode == "2000000") {
									if($.html5Validate.isAllpass($_file)){
										if($("#setPic img").length >= 5){
											$("#uploadImg").testRemind("最多上传5张图片");
											return false;
										}
									}
									$("#setPic").append('<li class="fL"><img src=' + D.data.fileUrl + ' alt="" width="156" height="112" class="mR10" style="border: 1px solid #e3e3e3" index-id="'+D.data.fileId+'"/></li>');
								}
							});
						
					});
					}else{
						ctrl.tirgger('setTips',X.getErrorName(data.statusCode));
					}
				});
				
				
			}else{
				$("#id_conts").html("<p style='text-align:center'>操作失败</p>");
			}
			
		});
	}
	
	function validates(){
		$("#financeForm").html5Validate(function(){
			ctrl.tirgger('setTips','确定提交吗？',function(){

				ctrl.request({
					url: dataPath+ X.configer[request.m].api.edit,
					type: "POST",
					data: JSON.stringify({
						"bankId": id,
						"status": $("[name=status]:checked").val(),
						"reviewer": $("[name=reviewer]").val(),
						"rejectReason": $("[name=rejectReason]").val(),
						"remark": $("[name=remark]").val()
					})
				}).then(function(data){
					if(data.statusCode=='2000000'){
						
						//保存图片的关联关系
						var arrayList = [];
						var jsons = {};
						// 审核凭证文件
						$("#setPic li").each(function(index, element) {
							jsons = {
								"relBelong": id,
								"fileId": $(element).find("img").attr("index-id"),
								"type":'1'
							}
							arrayList.push(jsons);
						});
						// 授权文件关联
						$('#uploadCentifyFile img').each(function (index,element) {
							arrayList.push({
								"relBelong": id,
								"fileId": $(element).attr("data-fileId"),
								"type":'0'
							});
						});
						updateRelationShip(X , {
							data :{
								"ids": [id], 
								"list" : arrayList
							},
							success: function(data){
								//console.log(data);
							}
						});
						
						$.layer({
							title:'提示消息',
							area: ['500px', '200px'],
							dialog:{
								btn : 1,
								btn : ['确定'],
								type : 8,
								msg:'<div class="tips mB20"><em>您的审核信息已经提交成功！</em></div>',
								yes:function(index){
									layer.close(index);
									gl_xt.router.setHistory("?m=xhr_id_173_174");
									gl_xt.router.runCallback();
								},
								no:function(index){
									layer.close(index);
								}
							}
						})
					}else{
						ctrl.tirgger('setTips','数据操作失败');
					}
				});
			});
		});	
	}
	
})(mXbn);