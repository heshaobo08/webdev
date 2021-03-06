;
(function (X) {

	var gl_pz = X();

	var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

	// var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

	var jsPath=X.configer.__API_PATH__;
	
	var localParm=gl_pz.utils.getRequest(),
        operateData=X.getRolesObj.apply(null,localParm.m.split('_').slice(2));
        
	var promotionsCtrl = gl_pz.ctrl();

	// 创建视图
	promotionsCtrl.view = {
		elem: "#id_conts",
		tpl: path + X.configer[localParm.m].tpl
	};
	//页面中存在验证提示时，从页面中移除
	if($('#validateRemind').length){
		$('#validateRemind').remove();
	}
	// 发送数据，获取促销列表
	promotionsCtrl.request({
		url:jsPath+ X.configer[localParm.m].api.setPromotList,
		data:JSON.stringify({
		    "start": localParm.page || 1,
		    "pageSize": "10"
		}),
		type:'post'
	}).then(function(data){
		if(data.statusCode=='2000000'){
            data.data.operateData=operateData;
			promotionsCtrl.render(data.data).then(function(){
				//列表渲染和事件触发 
                promotionsCtrl.tirgger('promotionsRender',data.data);
                promotionsCtrl.tirgger('formValid');
                // 渲染分页
                promotionsCtrl.renderIn('#pageListCon','.page');   

                promotionsCtrl.tirgger('pageRender',data.data);
			});
		}else{
			promotionsCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
		}		
	});

	// 促销模板渲染
	promotionsCtrl.on('promotionsRender',function(data){
		$("#searchTotalCount").text(data.totalCount);
		// 渲染商品列表
		promotionsCtrl.renderIn('#promotListTmpl','#promotListCon',data);

		// dom节点event初始化触发
		promotionsCtrl.tirgger('dom_init',"#id_conts");
	});

	// dom节点event初始化
	promotionsCtrl.on('dom_init',function(ele){
		var cPageNo=1,
			pageSize=10;
		// 搜索
		$('.js-promotSearch').off().on('click',function(){			
			
			$("#promotFrom").submit();
		});

		// 开始时间
		$(".timeStart,#startTime").on("click",function(){
			laydate({
				istime: true,
				elem : '#startTime',
				event : 'focus',
				format: 'YYYY-MM-DD hh:mm:ss',
				choose: function(dates){ //选择好日期的回调
					$('#dataStart').val(dates);
      			}
			});
		});
		// 结束时间
		$(".timeEnd,#endTime").on("click",function(){
			laydate({
				istime: true,
				elem : '#endTime',
				event : 'focus',
				format: 'YYYY-MM-DD hh:mm:ss',
				choose: function(dates){ //选择好日期的回调
					$('#dataEnd').val(dates);
      			}
			});
		});
		
		// 下拉列表
		sele();

		$(".bigTable tbody tr,.smallTable tbody tr").hover(function(){
            $(this).css({"background-color":"#ececec"});
        },function(){
            $(this).attr('style','');
        });
	});

	// 搜索表单验证
	promotionsCtrl.on('formValid',function () {		
		$("#promotFrom").html5Validate(function(){
		    promotionsCtrl.tirgger('searchSubmit',1,function(data){
                //列表渲染和事件触发 
                promotionsCtrl.tirgger('promotionsRender',data);
                // 渲染分页
                promotionsCtrl.renderIn('#pageListCon','.page'); 
                promotionsCtrl.tirgger('pageRender',data);
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
    promotionsCtrl.on('searchSubmit',function(toPageNo,callback){
    	var promotionType=$('input[name=promotionType]','#promotFrom').attr('index-data'),
    		isEffective=$('input[name=isEffective]','#promotFrom').attr('index-data'),
    		promotionStatus=$('input[name=promotionStatus]','#promotFrom').attr('index-data'),
    		promotionName=$('input[name=promotionName]','#promotFrom').val(),
    		promotionStartTime=$('#startTime','#promotFrom').val(),
    		promotionEndTime=$('#endTime','#promotFrom').val();
        promotionsCtrl.request({
			url:jsPath+X.configer[localParm.m].api.setPromotList,
			type:'post',
			data:JSON.stringify({
				"promotionType":promotionType?promotionType:null,
				"isEffective":isEffective?isEffective:null,
				"promotionStatus":promotionStatus?promotionStatus:null,
				"start":toPageNo,
				"pageSize":10,
				"promotionName":promotionName?promotionName:null,
				"promotionStartTime":promotionStartTime?promotionStartTime:null,
				"promotionEndTime":promotionEndTime?promotionEndTime:null
			})
		}).then(function(data){
			if(data.statusCode=='2000000'){
                data.data.operateData=operateData;
				callback && callback(data.data);  
	        }else{
	            promotionsCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
	        }
		});
    });

	// 分页加载
    promotionsCtrl.on('pageRender',function(data){
        var cPageNo=localParm.page,
            totalPages=data.totalPage;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            promotionsCtrl.tirgger('searchSubmit',p,function(data){
                gl_pz.router.setHistory("?m="+localParm.m+"&page="+p);
                promotionsCtrl.tirgger("promotionsRender",data);
                cPageNo=p;
            });
        });
    });

    // 提示消息弹框方法定义
    promotionsCtrl.on('setTips',function(msg,callback){
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
