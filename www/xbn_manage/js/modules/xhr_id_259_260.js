;
(function (X) {
	
	var gl_xt = X();
	
	var ctrl = gl_xt.ctrl();

	var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;
	
	var dataPath = document.location.protocol + "//timage.xbniao.com/file/image/list"; //获取图片
	
	var delPath = document.location.protocol + "//timage.xbniao.com/file/image/delete"; //删除图片

	var request = gl_xt.utils.getRequest(),
        cpage=1,
        totalPage=1,
        operateData=X.getRolesObj.apply(null,request.m.split('_').slice(2));

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

	//获取图片列表	
	ctrl.request({
		url: dataPath,
		type: "post",
		data: JSON.stringify({
			"page": {
				"pageSize": "20",
				"pageNo": 1,
				"totalCount": "",
				"totalPages": "",
				"currentPageNo": ""
			},
			"query": {
				"orderName": "fileInsertTime",
				"orderBy": "desc"
			},
			"isPage":"true"
		})
	}).then(function(data){
		if(data.statusCode == "2000000"){
            totalPage=data.data.page.totalPages;
            data.data.operateData=operateData;
			//渲染图片列表
			ctrl.render(data.data).then(function(){
				// 模板局部渲染 触发
				ctrl.tirgger("memberRender",data.data);
				// 表单校验加载
				ctrl.tirgger("searchFormValid");
                // 滚动加载
                $(window).scroll(function () {
                    var scrollTop = $(this).scrollTop();
                    var scrollHeight = $(document).height();
                    var windowHeight = $(this).height();
                    if (scrollTop + windowHeight == scrollHeight) {
                        cpage+=1;
                        if(totalPage>=cpage){
                            ctrl.tirgger('searchSubmit',cpage,function (data) {
                                 //列表渲染和事件触发
                                 ctrl.tirgger('memberRender',data);
                            });
                        }else{
                            $(".endTip").html("已加载完成……");
                        }
                        
                    }
                });
			});
		}else{
			
		}
	});
	
	// 模板局部渲染
    ctrl.on('memberRender',function(data,type){
        data.protocol = document.location.protocol;
        $('.endTip').html('');
		if(type=='search'){
            // 数据列表渲染
            ctrl.renderIn("#list",".contsPic",data);
        }else{
            ctrl.renderTo("#list",".contsPic",data);
        }
        
		
        // 触发页面dom事件
        ctrl.tirgger('dom-event-init',"#id_conts");
    });
	
	// 初始化页面所有dom事件
    ctrl.on('dom-event-init',function(elem){
        // 搜索提交
        $('.js-search').off().on('click',function(){
            $("#searchForm").submit();
        });
		
		imgHandle();//删除图片        

	});
	
	ctrl.on('searchFormValid',function(){
        // 表单验证
        $('#searchForm').html5Validate(function(){
            ctrl.tirgger('searchSubmit',1,function(data){
                cpage+=1;
                //列表渲染和事件触发 
                ctrl.tirgger('memberRender',data,'search'); 
            });
        });
	});
	
	// 列表搜索提交
    ctrl.on('searchSubmit',function(toPageNo,callback){
        var sendData={
			"page": {
				"pageSize": "20",
				"pageNo": toPageNo,
				"totalCount": "",
				"totalPages": "",
				"currentPageNo": ""
			},
			"query": {
				"orderName": "fileInsertTime",
				"orderBy": "desc",
				"fileOriginalName": $("[name=fileOriginalName]").val(),
				"fileCreateUserName": $("[name=fileCreateUserName]").val()
			},
			"isPage":"true"
		};
		ctrl.request({
			url:dataPath,
			type: "post",
			data:JSON.stringify(sendData)
		}).then(function(data){
			if(data.statusCode=='2000000'){  
                totalPage=data.data.page.totalPages;
                data.data.operateData=operateData;
				callback && callback(data.data);
			}else{
				$(".contsPic").html("操作失败");
			}
		});
    });
	
	//图片操作（查看，删除）
	function imgHandle(){
		//查看
		$(".js-image").on("click", function () {
			var imgUrl = $(this).attr("src"),
                user=$(this).attr('data-user'),
                title=$(this).attr('data-name'),
                _that=$(this).closest('span'),
                belongImg=$(this);
			$.layer({
                title: false,
				dialog : {
					btn : 0,
					type : 8,
                    fix:true,
					msg : '<div class="layerBox" style="height:620px"><div class="layerTitle" style="line-height:30px;">创建用户：'+user+'&nbsp;&nbsp;&nbsp;&nbsp;'+title+'</div><a class="prevImg" style="z-index:20;"><</a><a class="nextImg" style="z-index:20;">></a><div style="overflow:hidden;"><img src="'+imgUrl+'" id="layerBoxImg" /></div><div id="closeLayer" style="top:4px">X</div></div>'
				},
                success:function (index) {
                    index.find(".xubox_dialog").css({
                        maxHeight : "640px",
                        minHeight : "640px",
                        width:'840px'
                    });

                    index.find("img").css({
                        maxHeight : "600px",
                        maxWidth : "800px"
                        /*position:'absolute',
                        left:'50%',
                        top:'50%',
                        marginLeft:imgWidth+'px',
                        marginTop:imgHeight+'px'*/
                    });
                    var imgHeight = parseInt((600-$('#layerBoxImg').height())/2);
                    if(imgHeight>0) $('#layerBoxImg').parent().css('padding-top',imgHeight+'px');
                    var layeybox=this;
                    $('.xubox_botton').hide();
                    $('.xubox_title').attr('style','background: #fff;color: #fff;height: 20px;');

                    if(_that.index('.contsPic>span')==0 ){
                        $('.prevImg').hide();
                    }
                    if(_that.index('.contsPic>span')==($('.contsPic>span').length-1)){
                        $('.nextImg').hide();
                    }              
                    // 关闭
                    $("#closeLayer").on('click',function () {
                        layer.close(layer.index);
                    });

                    // 上一张
                    $('.prevImg').off().on('click',function () {   
                        if(_that.prev('span').length){
                            _that=_that.prev('span');
                            belongImg=_that.find('img');
                           $("#layerBoxImg").attr('src',belongImg.attr('src'));
                           $('.layerTitle').html('创建用户：'+belongImg.attr('data-user')+'&nbsp;&nbsp;&nbsp;&nbsp;'+belongImg.attr('data-name')); 
                        }
                        var imgHeight = parseInt((600-$('#layerBoxImg').height())/2);
                        $('#layerBoxImg').parent().css('padding-top',imgHeight+'px');
                        if(_that.next('span').length){
                            $('.nextImg').show();
                        }

                    });

                    // 下一张
                    $('.nextImg').off().on('click',function () {
                        if(_that.next('span').length){
                            _that=_that.next('span');
                            belongImg=_that.find('img');                        
                            $("#layerBoxImg").attr('src',belongImg.attr('src'));
                            $('.layerTitle').html('创建用户：'+belongImg.attr('data-user')+'&nbsp;&nbsp;&nbsp;&nbsp;'+belongImg.attr('data-name')); 
                        }else{
                            $(this).hide();
                        }
                        var imgHeight = parseInt((600-$('#layerBoxImg').height())/2);
                        $('#layerBoxImg').parent().css('padding-top',imgHeight+'px');
                        if(_that.prev('span').length){
                            $('.prevImg').show();
                        }                     
                    });
                }
			});
		});
		//批量删除
		checkeBox("r-box");

        // 批量删除
        $(".js-delAll").click(function(){
            var checkedIdArray = [];
            $("input[name=fileId]:checked").each(function(index, element) {
                checkedIdArray.push($(element).val());
            });
            checkedIdText = checkedIdArray.join("|");
            if(checkedIdArray.length){
                ctrl.tirgger('setTips','确定删除吗？',function(){
                    ctrl.request({
                        url: delPath+";jsessionid="+$.cookie('SID'),
                        type: "post",
                        data: JSON.stringify({
                            "ids":checkedIdArray
                        })
                    }).then(function(data){
                        if(data.statusCode=='2000000'){
                            gl_xt.router.runCallback();
                        }else{
                            ctrl.tirgger('setTips',X.getErrorName(data.statusCode));
                        }                        
                    });
                });
            }else{
                ctrl.tirgger('setTips','请至少选中一个图片进行删除');
            }
        });
	}
})(mXbn);