;
(function (X) {

    var gl_xt = X();

    var ctrl = gl_xt.ctrl();

    var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;

    var dataPath = X.configer.__API_PATH__+ "/" ;

    var request = gl_xt.utils.getRequest();

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

    function validates(){
        $("#serviceForm").html5Validate(function(){
            var groupName = $("input[name=groupName]").val(),
                isValid = $("input[type=radio]:checked").val(),
                remark = $("input[name=remark]").val(),
                serviceIds = "",
                interIds = "",
                idServiceIdArray = [],
                idInterIdArray = [];

            $("[name=serviceIds]:checked").each(function(index, element) {
                idServiceIdArray.push($(element).attr("data-id"));
            });

            $("[name=interIds]:checked").each(function(index, element) {
                idInterIdArray.push($(element).attr("data-id"));
            });

            serviceIds = idServiceIdArray.join("|");
            interIds = idInterIdArray.join("|");

            ctrl.request({
                url: dataPath+ X.configer[request.m].api.add,
                type: "POST",
                data:  JSON.stringify({
                    "groupName": groupName,
                    "isValid": isValid,
                    "remark": remark,
                    "serviceIds": serviceIds,
                    "interIds":interIds
                })
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    ctrl.tirgger('setTips','会员添加成功！',function(){
                        gl_xt.router.setHistory("?m=xhr_id_1_19");
                        gl_xt.router.runCallback();
                    });
                }else{
                    ctrl.tirgger('setTips','数据操作失败');
                }
            });
        });

    }

    ctrl.render().then(function(){

        validates();

        // 角色唯一性验证
        $('[name=groupName]').off().on('blur',function () {
            var value=$(this).val(),
                that=$(this);
            ctrl.request({
                url: dataPath+ X.configer[request.m].api.roleVerify,
                type: "POST",
                async:false,
                data: JSON.stringify({
                    "groupName": value
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

        });

        //调用业务权限
        ctrl.request({
            url: dataPath+ X.configer[request.m].api.list,
            type: "POST",
            data: JSON.stringify({
                "isValid": true
            })
        }).then(function(data){
            if(data.statusCode == "2000000"){
                var list = data.data;
                var html = '<p><label><input type="checkbox" name="selectAll">全选</label></p>';
                $(list).each(function(index, element) {
                    html += '<label><input type="checkbox" value="1" name="serviceIds" data-id="'+element.id+'"/>'+element.roleName+'</label>';
                });

                $(".service").html(html);
                selectAll($('.service input[name=selectAll]'),'serviceIds');
            }
        });

        //调用接口权限
        ctrl.request({
            url: dataPath+ X.configer[request.m].api.all,
            data:JSON.stringify({
                "isValid": true
            }),
            type: "POST"
        }).then(function(data){
            if(data.statusCode == "2000000"){
                var list = data.data;
                var html = '<p><label><input type="checkbox" name="selectAll">全选</label></p>';
                $(list).each(function(index1, element1) {
                    html += '<label><input type="checkbox" value="1" name="interIds" data-id="'+element1.id+'"/>'+element1.name+'</label>';
                });

                $(".inter").html(html);
                selectAll($('.inter input[name=selectAll]'),'interIds');
            }
        });


        $(".js-submit").on("click",function(){
            $("#serviceForm").submit();
        });

    });

    function selectAll(target,checkboxName){
        var ddParent = target.closest('dd'),
            checkboxs = ddParent.find('input[name="'+checkboxName+'"]');
        target.click(function(){
            checkboxs.prop('checked',this.checked);
        });
        checkboxs.click(function(){
            ddParent.find('input[name="'+checkboxName+'"]:checked').length==checkboxs.length ? target.prop('checked',true):target.prop('checked',false);
        });
    }

})(mXbn);
