;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var userCtrl = gl_hy.ctrl();

    var localParm=gl_hy.utils.getRequest();

    var roleList={},

        levelList={};


    // 创建视图
    userCtrl.view = {
        elem: "#id_conts",
        tpl: path + "/" + X.configer[localParm.m].tpl
    };

    var companyId=localParm.id;

    // 获取等级数据
    userCtrl.request({
        url:jsPath + X.configer[localParm.m].api.userLevelList,
        type:"post",
        data:JSON.stringify({
           "isValid": true
        })
    }).then(function(data){
        if(data.statusCode=='2000000'){
            $.each(data.data,function(i,val){
                levelList[val.id]=val;
            })
        }else{
            userCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
        }
    });

    // 获取角色数据
    userCtrl.request({
        url:jsPath + X.configer[localParm.m].api.userRoleList,
        type:"post",
        data:JSON.stringify({
            "isValid": true
        })
    }).then(function(data){
        if(data.statusCode=='2000000'){
            console.log(data)
            $.each(data.data,function(i,val){
                roleList[val.id]=val;
            })
        }else{
            userCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
        }
    });



    // 获取商家详情
    if(companyId){
        // 修改
        userCtrl.request({
            url:jsPath + X.configer[localParm.m].api.settledDetail+companyId,
            type: "GET"
        }).then(function(data){
            if(data.statusCode=='2000000'){
                var userId=data.data.userId;
                // 设置地址
                data.data.addressData=$.fn.citySelect.getAreaVal(data.data.province,data.data.city,data.data.county);
                // 获取用户详情
                userCtrl.request({
                    url:jsPath + X.configer[localParm.m].api.userDetail+userId,
                    type: "GET",
                }).then(function(userData){
                    if(userData.statusCode=='2000000'){
                        if(data.data.companyType == 2){
                            // 个人身份证图片
                            getRelationPicture(X, [companyId], function (filedata) {
                                if (filedata.length > 0) {
                                    $.each(filedata,function(i,e){
                                        if(e.sort == 2){
                                            data.data.fileOriginalurl0 = e.fileOriginalurl;
                                            data.data.relFileId0 = e.relFileId;
                                        }else if(e.sort == 3){
                                            data.data.fileOriginalurl1 = e.fileOriginalurl;
                                            data.data.relFileId1 = e.relFileId;
                                        }else if(e.sort == 4){
                                            data.data.fileOriginalurl2 = e.fileOriginalurl;
                                            data.data.relFileId2 = e.relFileId;
                                        }else if(e.sort == 5){
                                            data.data.fileOriginalurl3 = e.fileOriginalurl;
                                            data.data.relFileId3 = e.relFileId;
                                        }
                                    })
                                } else {
                                    data.data.fileOriginalurl = null;//默认图像
                                    data.data.relFileId = null;
                                }
                                // 授权站点数据详情
                                 userCtrl.request({
                                    url:jsPath + X.configer[localParm.m].api.authSite+userId,
                                    type: "GET",
                                }).then(function(authData){
                                    if(authData.statusCode=='2000000'){
                                        data.data.userDetail=userData.data; //用户详情
                                        data.data.authdata=authData.data;  //授权站点
                                        data.data.roleList=roleList;    //银行信息
                                        data.data.levelList=levelList;  //授权站点
                                        userCtrl.render(data.data).then(function(){
                                            // 触发页面dom事件
                                            userCtrl.tirgger('dom_init',"#id_conts");
                                        });
                                    }else{
                                        userCtrl.tirgger('setTips',X.getErrorName(authData.statusCode));
                                    }
                                });
                            });
                        }else{
                            // 获取营业执照
                            getRelationPicture(X,[companyId],function (filedata) {
                                if(filedata.length>0){
                                    data.data.fileOriginalurl =filedata[0].fileOriginalurl;
                                    data.data.relFileId=filedata[0].relFileId;
                                }else{
                                    data.data.fileOriginalurl=null;//默认图像
                                    data.data.relFileId=null;
                                }
                            });
                            // 获取银行数据信息
                            userCtrl.request({
                                url:jsPath + X.configer[localParm.m].api.bankDetail+userId,
                                type: "GET",
                            }).then(function(bankData){
                                if(bankData.statusCode=='2000000'){
                                    if(bankData.data){
                                        // 获取银行开户图片
                                        getRelationPicture(X,[bankData.data.id],function (filedata) {
                                            if(filedata.length>0){
                                                data.data.bankfileOriginalurl =filedata[0].fileOriginalurl;
                                                data.data.bankrelFileId=filedata[0].relFileId;
                                            }else{
                                                data.data.bankfileOriginalurl=null;//默认图像
                                                data.data.bankrelFileId=null;
                                            }
                                        });
                                    }

                                    // 授权站点数据详情
                                     userCtrl.request({
                                        url:jsPath + X.configer[localParm.m].api.authSite+userId,
                                        type: "GET",
                                    }).then(function(authData){
                                        if(bankData.statusCode=='2000000'){
                                            data.data.userDetail=userData.data; //用户详情
                                            data.data.bankdata=bankData.data;    //银行信息
                                            data.data.authdata=authData.data;  //授权站点
                                            data.data.roleList=roleList;    //银行信息
                                            data.data.levelList=levelList;  //授权站点
                                            userCtrl.render(data.data).then(function(){
                                                // 触发页面dom事件
                                                userCtrl.tirgger('dom_init',"#id_conts");
                                            });
                                        }else{
                                            userCtrl.tirgger('setTips',X.getErrorName(authData.statusCode));
                                        }
                                    });

                                }else{
                                    userCtrl.tirgger('setTips',X.getErrorName(bankData.statusCode));
                                }
                            });
                        }


                    }else{
                        userCtrl.tirgger('setTips',X.getErrorName(userData.statusCode));
                    }
                });
            }else{
                userCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
            }
        });
    }

    // dom init
    userCtrl.on('dom_init',function (ele) {
        // 查看图片
        $('.details img').off().on('click',function () {
            var imgUrl=$(this).attr('src');
            $.layer({
                title:'查看图片',
                area: ['540px', '540px'],
                dialog:{
                    btn:1,
                    btn:['返回'],
                    type:8,
                    msg:'<div class="tips mB20"><img src="'+imgUrl+'" style="max-width:520px;max-height:520px"/></div>',
                    yes:function(index){
                        layer.close(index);
                    }
                }
            });
        });
    });

     // 提示消息弹框方法定义
    userCtrl.on('setTips',function(msg,callback){
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
