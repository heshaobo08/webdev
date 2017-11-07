;
(function (X) {

	var gl_xt = X();
	
	var ctrl = gl_xt.ctrl();

	var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;
	
	var dataPath = X.configer.__API_PATH__+ "/" ;

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
            area: ['500px', ''],
            dialog:{
                btns : 2,
				btn : ['确定', '取消'],
				type : 8,
                msg:'<div class="tips">'+msg+'</div>',
                yes:function(index){
					layer.close(index);
                    callback && callback();
                },
				no:function(index){
                    layer.close(index);
                }
            }
        })
    });
	
	ctrl.request({
		url: dataPath+ X.configer[request.m].api.query + id,
		type: "GET"
	}).then(function(data){
		data.data.selectMenu={};
		if (data.data.menuIds) {
			var selectMenu=data.data.menuIds.split('|');
			$.each(selectMenu,function (i,menu) {
				data.data.selectMenu[menu]=1;
			});
		}		
		data.data.userTree = JSON.parse(localStorage.Roles);
		ctrl.render(data.data).then(function(){

			$(".js-submit").on("click",function(){	
				$("#serviceForm").submit();
			});
			// 菜单效果
			$('.js-showMore').off().on('click',function () {
				var oDt=$(this).closest('dt'),
					oDl=$(this).closest('.topTree'),
					index=oDl.index();		
				oDl.siblings('.topTree').find('dd').slideUp();
				oDl.siblings('.topTree').find('.js-showMore').addClass('icon-24').removeClass('icon-57');
				if($(this).hasClass('icon-24')){
					oDt.next('dd').slideDown();
					$(this).addClass('icon-57').removeClass('icon-24');
				}else{
					oDt.next('dd').slideUp();
					$(this).addClass('icon-24').removeClass('icon-57');
				}		
			});
			//业务子级的全选功能
			$('input:checkbox[name=checkAll]').click(function(){
				$(this).parent().siblings('dl').children('dt').children('label').children('input:checkbox').prop('checked',this.checked);
			});
			//判断选中子项之后，全选是否呈现全选的状态
			$('.menuList input:checkbox[id^="treeId_"]').click(function(){
				var dd= $(this).closest('dd'),
					checkbox=dd.children('dl').children('dt').children('label').children('input:checkbox[id^="treeId_"]'),
					checkedbox = dd.children('dl').children('dt').children('label').children('input:checkbox[id^="treeId_"]:checked'),
					checkAll = $(this).closest('dl').siblings('label').children('input:checkbox');

				this.checked? checkAll.prop('checked',checkedbox.length==checkbox.length):checkAll.prop('checked',false);
			});
			//判断选中子项之后，全选是否呈现全选的状态
			$('.menuList dd').each(function(){
				var checkAll=$(this).children('label').children('input:checkbox');
				if(checkAll.length){
					var checkbox=$(this).children('dl').children('dt').children('label').children('input:checkbox[id^="treeId_"]'),
						checkedbox = $(this).children('dl').children('dt').children('label').children('input:checkbox[id^="treeId_"]:checked');
					checkAll.prop('checked',checkedbox.length==checkbox.length);
				}
			});
			// 表单提交
			$("#serviceForm").html5Validate(function(){
				var roleName = $("input[name=roleName]").val();
				var remark = $("textarea[name=remark]").val();
				var menuIds = [];
				$('input[id^=treeId]:checked').each(function (i,tree) {
					menuIds.push($(this).val());
				});
				ctrl.request({
					url: dataPath+ X.configer[request.m].api.edit,
					type: "post",
					data:JSON.stringify({
						"id": id,
						"roleName": roleName,
						"remark":remark,
						"menuIds":menuIds.join('|')
					})
				}).then(function(data){
					if(data.statusCode=='2000000'){
						ctrl.tirgger('setTips','角色编辑成功！',function(){
							gl_xt.router.setHistory("?m=xhr_id_1_2");
							gl_xt.router.runCallback();
						});
					}else{
						ctrl.tirgger('setTips','数据操作失败');
					}
				});
			});
			// 角色唯一性验证
	        $('[name=roleName]').off().on('blur',function () {
	            var value=$(this).val(),
	                that=$(this);
	            if(value!=$(this).attr('data-oldVal')){
	            	ctrl.request({
		                url: dataPath+ X.configer[request.m].api.roleVerify,
		                type: "POST",
		                async:false,
		                data: JSON.stringify({
		                    "roleName": value
		                })
		            }).then(function (data) {
		                if(data.statusCode=='2000000'){
		                    if(!data.data){
		                        that.testRemind("该角色名称已存在，请重新输入");
		                        that.focus();
		                        return;
		                    }
		                }else{
		                    ctrl.tirgger('setTips',X.getErrorName(data.statusCode));
		                }
		            });
	            }
	            
	        });
			
		});
		
	});



})(mXbn);