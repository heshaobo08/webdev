;
(function (X) {
	
	var gl_xt = X();
	
	var ctrl = gl_xt.ctrl();

	var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;
	
	var dataPath = X.configer.__API_PATH__+'/'; 

	var request = gl_xt.utils.getRequest(),
		groupId='',
		productList={};

	ctrl.view = {
		elem: "#id_conts",
		tpl: path + "/" + X.configer[request.m].tpl
	};
	renderData();
	
	// 提示消息弹框方法定义
    ctrl.on('setTips',function(msg,callback){
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
	//默认html
	function listHtml(list){
		var cloneHtml = '<tr>';
			cloneHtml += '<td>';
				cloneHtml += '<div class="select w190 fL">';
					cloneHtml += '<input index-data="" type="hidden" value="请选择" name="serviceName"/>';
					cloneHtml += '<i>请选择</i>';
					cloneHtml += '<em class="icon-52"></em>';
					cloneHtml += '<ul>';
						cloneHtml += '<li index-data=""><span>请选择</span></li>';
						$.each(list,function(index, element){
							if(element.productStatus=='1'){
								cloneHtml += '<li index-data="'+element.serviceId+'"><span>'+element.serviceName+'</span></li>';
							}	
						});
					cloneHtml +='</ul>';
				cloneHtml += '</div>';
			cloneHtml += '</td>';
			cloneHtml += '<td><span class="price">--</span></td>';
			cloneHtml += '<td><a href="javascript:;" class="js-minus plus">-</a><input type="text" class="input w30 tC" name="count" required/><a href="javascript:;" class="js-plus plus">+</a></td>';
			cloneHtml += '<td><span class="favorableValue">--</span></td>';
			cloneHtml += '<td><span class="gift">--</span></td>';
			cloneHtml += '<td><span class="amount">--</span></td>';
			cloneHtml += '<td><a href="javascript:;" class="blue js-del">删除</a></td>';
		cloneHtml += '</tr>';
		return cloneHtml;
	}
	
	//选择服务
	function selectProduct(){
		sele(".select","body",function(index,val){
            
			var self = this;
			var price = self.closest("td").siblings().find(".price"),
				favorableValue = self.closest("td").siblings().find(".favorableValue"),
				gift = self.closest("td").siblings().find(".gift"),
				money = self.closest("td").siblings().find(".money"),
				count = self.closest("td").siblings().find("[name=count]"),
				amount = self.closest("td").siblings().find(".amount");
			
			ctrl.request({
				url: dataPath+ X.configer[request.m].api.serve,
				type: "post",
				data: JSON.stringify({
					"productName": self.find("[name=serviceName]").val()
				})
			}).then(function(data){
				if(data.statusCode == "2000000"){	
					// 销售类型1--不支持多个购买(不可编辑)
					if(data.data.productType=='1'){
						count.addClass('disabled').data('isEdit',false);
					}else{
						count.removeClass('disabled').data('isEdit',true);
					}
					count.val(1);
					if(data.data != null){
						price.text(data.data.price);
						amount.text(data.data.price);
						gift.text('--');
						// 获取当前选中商品的促销信息
						ctrl.request({
							url: dataPath+ X.configer[request.m].api.promotInfo,
							type: "post",
							data: JSON.stringify({
								"productId": self.find("[name=serviceName]").attr('index-data'),
								'userRoleId':groupId
							})
						}).then(function (promotData) {
							if(promotData.statusCode=='2000000'){
								Interactive(self,promotData.data);//加载交互
                                statisticsAmount(self.closest("tr").index(),promotData.data)
							}else{
								ctrl.tirgger('setTips',X.getErrorName(promotData.statusCode));
							}
						});		
					}else{
						price.text("--");
						gift.text("--");
						favorableValue.text("--");
						amount.text("--");
					}
					
				}else{
					ctrl.tirgger('setTips',X.getErrorName(data.statusCode));
				}
			});
		});
	}
	
	//删除服务
	function del(){
		$(".addOrder").undelegate().delegate('.js-del',"click",function(){
			var pTr=$(this).closest("tr"),
				amount=Number(pTr.find('.amount').html()).toFixed(2),
				totalAmount=Number($('.totalAmount').html().slice(1)).toFixed(2);
            if(isNaN(amount)){
                amount = 0;
            }
			$('.totalAmount').html('￥'+parseInt((totalAmount-amount)*100)/100);
			pTr.remove();
		});	
	}
	
	//新增服务
	function add(list){
		$(".js-add").off().on("click",function(){
			var newList=null,
				hasList=[];			
			$(".addOrder tr [name=serviceName]").each(function(){
				hasList.push($(this).attr("index-data"));
			});
			newList=$.map(list,function(data,i){
						return $.inArray(i,hasList)?data:null
					});			
			var cloneHtml = listHtml(newList);
			if($(".addOrder tbody tr").length > 0){
				$(".addOrder tbody tr:last").after(cloneHtml);
			}else{
				$(".addOrder tbody").append(cloneHtml);
			}
			selectProduct();//选择服务
		});	
		del();//删除服务
		if($(".addOrder tbody tr").length <= 0){
			$(".js-add").click();
		}
	}
	
	//向后台发送数据
	function renderData(){
		ctrl.render().then(function(){
				
			querySearch();//调用搜索
			
		});
	}
	
	//搜索点击事件
	function querySearch(){
		ctrl.on("init_search", function (elem) {
			$(elem).find(".js-search").off().on("click", function () {
				var userName = $("[name=userName]").val();
				if(userName){
					ctrl.request({
						url: dataPath + X.configer[request.m].api.user,
						type: "post",
						data: JSON.stringify({
							"name": userName,
							"cPageNo": 1,
							"pageSize":200,
							"userStatus":'1'
						})
					}).then(function(data){
						if(data.statusCode == "2000000"){
							var list = data.data?(data.data.list ? data.data.list : []): [];
							var html = "";
							
							var searchNum = list.length;
							if(searchNum > 0){
								$(list).each(function(index, element) {
									html +='<span class="mR50">';
										html +='<input type="radio" class="mR10" name="userName" data-name="'+element.name+'" data-id="'+element.id+'" data-groupId="'+(element.levelId||'')+'"/>';
										html +=element.name
									html +='</span>';
								});
								$(".searchNum").text(searchNum);
								$(".result").removeClass("none");
								
							}else{
								$(".searchNum").text(0);
								$(".result").addClass("none");
								$(".productList").hide();
								$(".productList tbody tr").remove();
								
							}
							
							$(".searchMes").removeClass("none");							
							$(".result .searchMain").html(html);
							
							
							$("[name=userName]").off().on("click",function(){
								var userName = $(this).attr("data-name"),
									userId = $(this).attr("data-id");
								groupId=$(this).attr('data-groupid');
								// 获取基础产品信息

								ctrl.request({
									url: dataPath + X.configer[request.m].api.list,
									type: "post",
									data: JSON.stringify({
										'isPage':false
									})
								}).then(function(data){
									if(data.statusCode=='2000000'){
										$(".btnMain").show();
										$(".js-selectOk").off().on("click",function(){
											//获取产品服务的数据
											$.each(data.data.serviceList,function (i,product) {
												productList[product.serviceId]=product;
											});
											add(productList);//新增服务
											
											submitOk();
									
											$(".sellName").show();
											$(".titleText em").text(userName);
											$(".titleText em").attr("data-id",userId);
											$(".productList").show();
										});
									}else{
										ctrl.tirgger('setTips',X.getErrorName(data.statusCode));
									}
								});
								
							});
							
						}
					});	
				}
			});	
		});
		ctrl.tirgger("init_search", "#id_conts");
	}
		
	function submitOk(){
		var subLock = true;	
		$(".js-submit").off().on('click',function(){
			$("#orderForm").submit();
		});
		
		$("#orderForm").html5Validate(function(){
			var encrypt = Math.random().toString().replace(/\.\w/,"_CACHE_");
			$(this)[0][encrypt] = subLock;
			
			if(subLock){
				var serviceParameterList = [];
					serviceList = ""/*,
					productName = "",//产品服务
					price = "",		 //价格
					count = "",		 //数量
					favorable = "",	 //优惠
					product = "",	 //赠品
					amount = "",	 //金额
					totalAmount = "";*/
				
				$(".addOrder tbody tr").each(function(index, element) {
					serviceList = {
						"serviceId":$(element).find("[name=serviceName]").attr("index-data"),
						"serviceName" : $(element).find("[name=serviceName]").val(),
						"price" : $(element).find(".price").text(), 
						"count" : $(element).find("[name=count]").val(), 
						"giftProduct" : $(element).find(".gift").text(), 
						"discount" : $(element).find(".favorableValue").text(),
						"amount" : $(element).find(".amount").text()
					}
					serviceParameterList.push(serviceList);
				});

				ctrl.request({
					url: dataPath+ X.configer[request.m].api.addSave,
					type: "post",
					data: JSON.stringify({
						"serviceParameterList": serviceParameterList,
						"orderAmount": $(".totalAmount").text().replace(/^\D([\d.]+)$/,'$1'),
						"userName": $(".sellName em").text(),
						"userId": $(".sellName em").attr("data-id")
					})
				}).then(function(data){
					if(data.statusCode == "2000000"){
						ctrl.tirgger('setTips','添加成功！',function(){
							gl_xt.router.setHistory("?m=xhr_id_173_190");
							gl_xt.router.runCallback();
						});
					}else{
						$(".contsBox").html("<p style='text-align:center'>操作失败</p>");
					}
					
				});
				
				subLock =false;
			}
		});
	}
	
	function Interactive(self,data){
		var index = self.closest("tr").index();
		var selfTr = $(".addOrder tbody tr:eq("+index+")");
		var count = selfTr.find("input[name=count]");
				
		//选择产品服务后才能向下执行	
		if(!selfTr.find("input[name=serviceName]").attr("index-data")){
			return false;	
		}
		
		//非正整数置为0
		count.blur(function(){
			var countVal = $(this).val();
			var reg = /^[1-9]\d*$/;
			if(!reg.test(countVal)){
				$(this).val("1");
			}
			statisticsAmount($(this).closest("tr").index(),data);
		});
		
		//减少数量
		selfTr.find(".js-minus").mouseenter(function(){
			$(this).siblings("input").addClass("active");
		}).mouseleave(function(){
			$(this).siblings("input").removeClass("active");
		}).off().on("click",function(){	
			var input = $(this).siblings("input"),
				val=input.val();
			// 判断是否可编辑
			if(!input.data('isEdit')){
				return false;
			}
			if(val > 1){
				val--; 
				$(this).siblings("input").val(val);
				statisticsAmount($(this).closest("tr").index(),data);
			}
		});
		
		//增加数量
		selfTr.find(".js-plus").mouseenter(function(){
			$(this).siblings("input").addClass("active");
		}).mouseleave(function(){
			$(this).siblings("input").removeClass("active");
		}).off().on("click",function(){	
			var input = $(this).siblings("input"),
				val=input.val();
			// 判断是否可编辑
			if(!input.data('isEdit')){
				return false;
			}
			val++;
			$(this).siblings("input").val(Number(val));
			statisticsAmount($(this).closest("tr").index(),data);
		});
		
	}
	
	//计算金额
	function statisticsAmount(index,data){
		var self = $(".addOrder tbody tr:eq("+index+")"),
			count = self.find("input[name=count]"),
			price = self.find(".price"),
			serviceId = self.find("[name=serviceName]").attr("index-data"),//服务id
			favorableValue = 0, //优惠金额
			gifts = [];//赠品id
		
		if(count.val() >= 1){
			price = Number(price.text());
			count = Number(count.val());
			//获取优惠金额			
			var totalAmount = 0;
			if(data){
				// 单一折扣
				if(data.type=='0'){
					favorableValue=price*(1-data.discount[0].discountRate/100)*count;
				}else if(data.type=='1'){
					// 阶梯折扣
					$.each(data.discount,function (i,discount) {
						if(price*count>discount.startValue && (price*count<=discount.endValue || !discount.endValue)){
							favorableValue=price*(100-discount.discountRate)*count/100
							return false;
						}
					});
				}else if(data.type=='2'){
					// 买赠活动
					$.each(data.discount,function (i,gift) {
						gifts.push(gift.productName);
					});
				}	
			}					
			self.find(".favorableValue").text(favorableValue); //添加优惠信息
			self.find(".amount").text(Number(price*count-favorableValue).toFixed(2)); //金额（数量*价格-优惠）
			self.find(".gift").html(gifts.join(','));
			//计算总数	
			$(".amount").each(function(index, element) {
				if($(element).text() != "--"){
					totalAmount += Number($(element).text());
				}
			});
			$(".totalAmount").text("￥"+parseInt(totalAmount*100)/100);
			
			$(".js-submit").addClass("button").removeClass("greybutton");
			
			//获取赠品
			/*ctrl.request({
				url: dataPath + X.configer[request.m].api.gift,
				type: "post",
				data: JSON.stringify({
					"id": serviceId
				})
			}).then(function(data){
				if(data.statusCode == "2000000"){
					self.find(".gift").text(data.data.serviceName); //添加赠品
				}
			});	*/
			
		}else{
			
			self.find(".amount").text(1);

		}	
	}
	
})(mXbn);