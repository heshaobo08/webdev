;
(function (X) {

	var gl_pz = X();

	var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

	// var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

	var jsPath=X.configer.__API_PATH__;
    
    var localParm=gl_pz.utils.getRequest(),
        operateData=X.getRolesObj.apply(null,localParm.m.split('_').slice(2));

	var saleproductCtrl = gl_pz.ctrl();

	// 创建视图
	saleproductCtrl.view = {
		elem: "#id_conts",
		tpl: path + "/" + X.configer[localParm.m].tpl
	};
    //页面中存在验证提示时，从页面中移除
    if($('#validateRemind').length){
        $('#validateRemind').remove();
    }
	saleproductCtrl.request({
		url:jsPath+X.configer[localParm.m].api.productList,
		type:'post',
		data:JSON.stringify({
           "start":localParm.page || 1,
           "pageSize":"10"
		})
	}).then(function(data){
		if(data.statusCode=='2000000'){
            data.data.operateData=operateData;
            saleproductCtrl.render(data.data).then(function(){      
                //列表渲染和事件触发 
                saleproductCtrl.tirgger('productListRender',data.data) ;
                saleproductCtrl.tirgger('formValid');
                // 渲染分页
                saleproductCtrl.renderIn('#pageListCon','.page');   

                saleproductCtrl.tirgger('pageRender',data.data);

            });
        }else{
            saleproductCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
        }
	});

	// 页面渲染初始化
	saleproductCtrl.on('productListRender',function(data){
        $("#searchTotalCount").text(data.totalCount);
		// 渲染商品列表
		saleproductCtrl.renderIn('#productListTmpl','#productListCon',data);

		// dom节点event触发
		saleproductCtrl.tirgger('dom_init',"#id_conts");

	});

	// dom节点event初始化
	saleproductCtrl.on('dom_init',function(ele){
		var cPageNo=1,
			pageSize=10;
		// 搜索
		$('.js-saleProductSearch').off().on('click',function(){
			$("#saleProductForm").submit();

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
		$(".timeEnd,#endTime").off().on("click",function(){
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

		$(".bigTable tbody tr,.smallTable tbody tr").hover(function(){
            $(this).css({"background-color":"#ececec"});
        },function(){
            $(this).attr('style','');
        });
		
	});
    // 列表搜索提交
    saleproductCtrl.on('searchSubmit',function(toPageNo,callback){
        var serviceName=$('input[name=serviceName]').val(),
            dataStart=$('input[name=dataStart]').val(),
            dataEnd=$('input[name=dataEnd]').val(),
            sendData={
                productName:serviceName?serviceName:null,
                dataStart:dataStart?dataStart:null,
                dataEnd:dataEnd?dataEnd:null,
                start:toPageNo,
                pageSize:10
            };
            saleproductCtrl.request({
                url:jsPath+X.configer[localParm.m].api.productList,
                type:'post',
                data:JSON.stringify(sendData)
            }).then(function(data){
                if(data.statusCode=='2000000'){   
                    data.data.operateData=operateData;                 
                    callback && callback(data.data);  
                }else{
                   saleproductCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });
    });
    // 表单验证
    saleproductCtrl.on('formValid',function(){
        // 搜索表单验证
        $("#saleProductForm").html5Validate(function(){
            saleproductCtrl.tirgger('searchSubmit',1,function(data){
                //列表渲染和事件触发 
                saleproductCtrl.tirgger('productListRender',data);
                // 渲染分页
                saleproductCtrl.renderIn('#pageListCon','.page'); 
                saleproductCtrl.tirgger('pageRender',data);
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
    // 分页加载
    saleproductCtrl.on('pageRender',function(data){
        var cPageNo=localParm.page,
            totalPages=data.totalPage;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            saleproductCtrl.tirgger('searchSubmit',p,function(data){
                gl_pz.router.setHistory("?m="+localParm.m+"&page="+p);
                saleproductCtrl.tirgger("productListRender",data);
                cPageNo=p;
            });
        });
    });

    // 提示消息弹框方法定义
    saleproductCtrl.on('setTips',function(msg,callback){
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
