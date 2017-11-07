;
(function (X) {

    var gl_xt = X();

    var ctrl = gl_xt.ctrl();

    var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;

    var dataPath = X.configer.__API_PATH__;

    var request = gl_xt.utils.getRequest();

    var id = request.id;

    var userId = request.userId,
        userData={};

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
            url: dataPath+ X.configer[request.m].api.query,
            type: "POST",
            data: JSON.stringify({
                "id":id,
                "userID":userId
            })
        }).then(function(data){
            var queryData = data.data;
            //获取关联的保证金图片
            if(data.statusCode == "2000000"){
                ctrl.request({
                    url:dataPath+ X.configer[request.m].api.userInfo+userId,
                    type:'get'
                }).then(function (userData) {
                    if(userData.statusCode == "2000000"){
                        userData=userData.data;
                        getRelationPicture(X, [queryData.id], function(fileDate){
                            //把保证金图片的数据合并到保证金详情的数据里
                            if(fileDate.length>0){
                                queryData.fileOriginalurl =fileDate[0].fileOriginalurl;
                                queryData.relFileId = fileDate[0].relFileId;
                            }
                            queryData.userData=userData;
                            ctrl.render(queryData).then(function(){
                                //调用校验
                                validates();

                                $(".js-submit").on("click",function(){
                                    $("#financeForm").submit();
                                });

                                // 查看大图
                                $('#upload img').on('click',function () {
                                    var imgUrl=$(this).attr('src');
                                    $.layer({
                                        title:'查看图片',
                                        area: ['1000px', 'auto'],
                                        dialog:{
                                            btn:1,
                                            btn:['返回'],
                                            type:8,
                                            msg:'<div class="tips mB20"><img src="'+imgUrl+'" style="max-width:980px;max-height:980px"/></div>',
                                            yes:function(index){
                                                layer.close(index);
                                            }
                                        }
                                    });
                                });

                            });
                        });
                    }else{
                        ctrl.tirgger('setTips',X.getErrorName(userData.statusCode));
                    }
                });

            }else{
                alert("操作失败");
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
                        "id":$("[name=id]").val(),
                        "userID":$("[name=userId]").val(),
                        "actualPayAmount":$("[name=actualPayAmount]").val()
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
                                    gl_xt.router.setHistory("?m=xhr_id_173_195");
                                    gl_xt.router.runCallback();
                                },
                                no:function(index){
                                    layer.close(index);
                                }
                            }
                        })
                    }

                });
            });
        },{
            validate: function() {
                //不允许0和负数以及非数字
                var _val = $('input[name=actualPayAmount]',"#financeForm").val();
                var reg = /[0-9]+\.?[0-9]{0,2}/;

                if(!reg.test(_val) || _val<0){
                    $('input[name=actualPayAmount]',"#financeForm").testRemind("请输入正整数");
                    return false;
                }
                return true;
            }
        });
    }

})(mXbn);
