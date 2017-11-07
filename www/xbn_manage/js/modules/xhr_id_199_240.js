;
(function (X) {

	var gl_pz = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

	var setLogisticCtrl = gl_pz.ctrl();

    var localParm=gl_pz.utils.getRequest(),
        logisticsData={},
        operateData=X.getRolesObj.apply(null,localParm.m.split('_').slice(2));

	// 创建视图
	setLogisticCtrl.view = {
		elem: "#id_conts",
		tpl: path + X.configer[localParm.m].tpl
	};
    //页面中存在验证提示时，从页面中移除
    if($('#validateRemind').length){
        $('#validateRemind').remove();
    }
    // 物流基础信息加载页面
    setLogisticCtrl.request({
        url:jsPath + X.configer[localParm.m].api.logisticsList,
        type: "post",
        data:JSON.stringify({
        	"pageSize":'10',
        	"cPageNo":localParm.page || 1
        })
    }).then(function(data){
        if(data.statusCode=='2000000'){
            // 基础物流公司数据
            setLogisticCtrl.request({
                url:jsPath + X.configer[localParm.m].api.baseData,
                data:JSON.stringify({
                    types:['logistics_company']
                }),
                type:'post'
            }).then(function(companyData){
                if(companyData.statusCode=="2000000"){
                    //设置基础物流公司数据
                    $.each(companyData.data['logistics_company'],function (i,company) {
                        logisticsData[company.id]=company;
                    });
                    data.data.logisticsData=logisticsData;
                    data.data.operateData=operateData;
                    setLogisticCtrl.render(data.data).then(function(){
                        // 模板局部渲染 触发
                        setLogisticCtrl.tirgger("logisticRender",data.data);

                        // 分页渲染
                        setLogisticCtrl.renderIn('#pageListCon','.page',data);

                        // 分页加载
                        setLogisticCtrl.tirgger('pageRender',data.data);
                    });           
                }else{
                    setLogisticCtrl.tirgger('setTips',X.getErrorName(companyData.statusCode));
                }
            });
            
        }else{
            setLogisticCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
        }        
    });

    // 模板局部渲染
    setLogisticCtrl.on('logisticRender',function(data){
    	// 数据列表渲染
    	setLogisticCtrl.renderIn('#logisticsTmpl','#logisticsList',data);

    	// 触发页面dom事件
        setLogisticCtrl.tirgger('dom-event-init',"#id_conts");
    });

	// 初始化页面所有dom事件
	setLogisticCtrl.on('dom-event-init',function(elem){
		// 删除
		$(".js-logisticDelete",elem).off().on("click", function () {
			// 判断未选中的checkbox
			if(!$('input[data-id]:checked',elem).length){
				// 消息提示
				setLogisticCtrl.tirgger('setTips',"至少选择一个物流信息进行操作");
				return;
			}
			var ids=[];
			// 添加选中id
			$('input[data-id]:checked',elem).each(function(i){
				ids.push($(this).attr('data-id'));
			})
			ids=ids.join(',');            
	    	$.layer({
	    		title : '提示信息',
	    		area : ['550px', '190px'],
	    		dialog : {
	    			btns : 2,
	    			btn : ['确认', '取消'],
	    			type : 8,
	    			msg : '<div class="tips">确认删除？</div>',
	    			yes : function (index) {
	    				// 发送批量删除请求
	                	setLogisticCtrl.request({
	                		data:JSON.stringify({ids:ids}), //Todo check
	                		type:'post',
	                		url:jsPath +X.configer[localParm.m].api.logisticsDeletes,
	                	}).then(function(data){


	                			if(data.statusCode=='2000000'){
	                				// 弹层关闭
	                    			layer.close(index);
	                    			gl_pz.router.runCallback();
	                			}else{
	                				setLogisticCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
	                			}
	                		})
	    			}
	    		}
	    	});
	    });

		// 全选框
	    checkeBox();

	    $(".bigTable tbody tr,.smallTable tbody tr").hover(function(){
            $(this).css({"background-color":"#ececec"});
        },function(){
            $(this).attr('style','');
        });

	});

    // 分页加载
    setLogisticCtrl.on('pageRender',function(data){
        var cPageNo=localParm.page,
            pageSize=10,
            totalPages=data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            setLogisticCtrl.tirgger('searchSubmit',p,function(data){
                
                gl_pz.router.setHistory("?m="+localParm.m+"&page="+p);
                setLogisticCtrl.tirgger("logisticRender",data);
                cPageNo=p;
            });
        });
    });


    // 列表搜索提交
    setLogisticCtrl.on('searchSubmit',function(toPageNo,callback){
        setLogisticCtrl.request({
            url:jsPath + X.configer[localParm.m].api.logisticsList,
            type: "post",
            data:JSON.stringify({
                "pageSize":'10',
                "cPageNo":toPageNo
            })
        }).then(function(data){
            if(data.statusCode=='2000000'){
                data.data.logisticsData=logisticsData;
                data.data.operateData=operateData;
                callback && callback(data.data);               
            }else{
                setLogisticCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
            }        
        });
    });
	
	// 提示消息弹框方法定义
	setLogisticCtrl.on('setTips',function(msg,callback){
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
