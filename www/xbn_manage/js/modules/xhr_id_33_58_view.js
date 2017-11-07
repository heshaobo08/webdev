;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ + '/' + X.configer.__FILE_HTML__ + '/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath = X.configer.__API_PATH__;

    var joinCtrl = gl_hy.ctrl();

    var localParm = gl_hy.utils.getRequest();

    var joinId = localParm.id,
        dictionaryBankList = {};
    // 创建视图
    joinCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };
    // 获取银行基础信息
    joinCtrl.request({
        url: jsPath + X.configer[localParm.m].api.dictionaryList,
        type: 'post',
        data: JSON.stringify({
            types: ['opening_bank']
        })
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            // 设置基础服务银行列表
            $.each(data.data["opening_bank"], function (i, bank) {
                dictionaryBankList[bank.id] = bank;
            });
        } else {
            joinCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
        }
    });
    // 查看
    if (joinId) {
        joinCtrl.request({
            url: jsPath + X.configer[localParm.m].api.settledDetail + joinId,
            type: "GET"
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                var userId = data.data.userId;
                // 设置地址
                data.data.addressData = $.fn.citySelect.getAreaVal(data.data.province, data.data.city, data.data.county);
                // 获取用户详情
                joinCtrl.request({
                    url: jsPath + X.configer[localParm.m].api.userDetail + userId,
                    type: "GET"
                }).then(function (userData) {
                    if (userData.statusCode == '2000000') {
                        data.data.userDetail = userData.data; //用户详情
                        data.data.dictionaryBankList = dictionaryBankList; //基础服务银行列表
                        if(data.data.companyType == 2){
                            // 个人身份证图片
                            getRelationPicture(X, [joinId], function (filedata) {
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
                                // 模板渲染
                                joinCtrl.render(data.data).then(function () {
                                    joinCtrl.tirgger('dom_init');
                                });
                            });
                        }else{
                            // 获取营业执照
                            getRelationPicture(X, [joinId], function (filedata) {
                                if (filedata.length > 0) {
                                    data.data.fileOriginalurl = filedata[0].fileOriginalurl;
                                    data.data.relFileId = filedata[0].relFileId;
                                } else {
                                    data.data.fileOriginalurl = null;//默认图像
                                    data.data.relFileId = null;
                                }
                            });
                            // 获取银行数据信息
                            joinCtrl.request({
                                url: jsPath + X.configer[localParm.m].api.bankDetail + userId,
                                type: "GET"
                            }).then(function (bankData) {
                                if (bankData.statusCode == '2000000') {
                                    data.data.bankdata = bankData.data;    //银行信息
                                    if (bankData.data) {
                                        // 获取银行开户图片
                                        getRelationPicture(X, [bankData.data.id], function (filedata) {
                                            if (filedata.length > 0) {
                                                data.data.bankfileOriginalurl = filedata[0].fileOriginalurl;
                                                data.data.bankrelFileId = filedata[0].relFileId;
                                            } else {
                                                data.data.bankfileOriginalurl = null;//默认图像
                                                data.data.bankrelFileId = null;
                                            }
                                            // 模板渲染
                                            joinCtrl.render(data.data).then(function () {
                                                joinCtrl.tirgger('dom_init');
                                            });
                                        });
                                    } else {
                                        // 模板渲染
                                        joinCtrl.render(data.data).then(function () {
                                            joinCtrl.tirgger('dom_init');
                                        });
                                    }
                                } else {
                                    joinCtrl.tirgger('setTips', X.getErrorName(bankData.statusCode));
                                }
                            });
                        }

                    } else {
                        joinCtrl.tirgger('setTips', X.getErrorName(userData.statusCode));
                    }
                });
            } else {
                joinCtrl.tirgger('setTips', X.getErrorName(data.statusCode));
            }
        });
    }
    // dom init
    joinCtrl.on('dom_init', function () {
        //实名认证
        $(".js-verifyIdCard").off().on("click",function(){
            var _val = $('input[name=registeredNo]').val();
            var _name = $('input[name=companyName]').val();
            joinCtrl.request({
                data:JSON.stringify({companyName:_name,registeredNo:_val}),
                url:jsPath + X.configer[localParm.m].api.verifyIdCard,
                type:'post'
            }).then(function(data){
                if(data.statusCode=='2000000'){
                   if(data.data.status != "false"){
                       $.layer({
                            title:'实名认证',
                            area: ['540px', '540px'],
                            dialog:{
                                btn:1,
                                btn:['返回'],
                                type:8,
                                msg:'<div class="tips mB20">通过</div>',
                                yes:function(index){
                                    history.go(0);
                                }
                            }
                        });
                    }else{
                        joinCtrl.tirgger('setTips', data.data.result);
                    }
                }
            })
        })

        // 查看图片
        $('.details').undelegate().delegate('img', 'click', function () {
            var imgUrl = $(this).attr('src');
            $.layer({
                title: '查看图片',
                area: ['540px', '540px'],
                dialog: {
                    btn: 1,
                    btn: ['返回'],
                    type: 8,
                    msg: '<div class="tips mB20"><img src="' + imgUrl + '" style="max-width:520px;max-height:520px"/></div>',
                    yes: function (index) {
                        layer.close(index);
                    }
                }
            });
        });
        // 审核驳回
        $('.js-UserjoinUnPass').off().on('click',function(){
            var id=$(this).attr('data-id');
            $.layer({
                title:'入驻申请审核驳回',
                area: ['500px', '200px'],
                dialog:{
                    btns:2,
                    btn:['确定','取消'],
                    type:8,
                    msg:'<form id="authForbidForm"><div class="frozen mB20"><p class="frozenTitle">确认驳回该入驻申请吗？</p><textarea name="remark" id="" cols="30" rows="10" class="textadd" placeholder="请输入驳回原因" required></textarea></div></form>',
                    yes:function(index){
                        joinCtrl.request({
                            data:JSON.stringify({id:joinId,idcardstatus:0}),
                            url:jsPath + X.configer[localParm.m].api.updateIdCardStatus,
                            type:'post'
                        }).then(function(data){
                            if(data.statusCode=='2000000'){
                                $('#authForbidForm').submit();
                            }
                        })

                    }
                },
                success:function(){
                     // 控制层级
                    $.testRemind.css.zIndex=$('.xubox_shade').css('zIndex')+1;
                    $('#authForbidForm').html5Validate(function () {
                        joinCtrl.request({
                            url:jsPath + X.configer[localParm.m].api.joinAuth,
                            data:JSON.stringify({
                                id:id,
                                remark:$("[name=remark]","#authForbidForm").val(),
                                auditStatus:'3'
                            }),
                            type:'post'
                        }).then(function(data){
                            if(data.statusCode=='2000000'){
                                joinCtrl.tirgger('setTips','审核驳回成功！',function(){
                                    layer.close(layer.index);
                                    gl_hy.router.setHistory("?m=xhr_id_33_58");
                                    gl_hy.router.runCallback();
                                });
                            }else{
                                joinCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                            }
                        });
                    });
                }
            });
        });

        // 审核通过
        $('.js-UserjoinPass').off().on('click',function(){
            var id=$(this).attr('data-id');
            $.layer({
                title:'入驻申请审核通过',
                area: ['500px', '200px'],
                dialog:{
                    btns:2,
                    btn:['确定','取消'],
                    type:8,
                    msg:'<div class="frozen mB20"><p class="frozenTitle">确认审核通过该商家？</p></div>',
                    yes:function(index){
                        joinCtrl.request({
                            url:jsPath + X.configer[localParm.m].api.joinAuth,
                            data:JSON.stringify({
                                id:id,
                                auditStatus:'2'
                            }),
                            type:'post'
                        }).then(function(data){
                            if(data.statusCode=='2000000'){
                                joinCtrl.tirgger('setTips','审核通过成功！',function(){
                                    layer.close(index);
                                    gl_hy.router.setHistory("?m=xhr_id_33_58");
                                    gl_hy.router.runCallback();
                                });
                            }else{
                                joinCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                            }
                        });
                    }
                }
            });
        });
        //设置平台使用费
        $('.js-setPlatFee').off().on('click',function(){
            $.layer({
                title : '平台使用费设置',
                area : ['550px', '180px'],
                dialog : {
                    btns : 2,
                    btn : ['确认', '取消'],
                    type : 8,
                    msg : '<form id="setUseFeeForm">' +
                    '<p class="lh60 tC">该商家是否收取平台使用费</p>'+
                    '<p class="tC">'+
                    '<label class="mR50"><input class="mR5 vM" type="radio" name="ifCharge" value="1" checked/>收取</label>' +
                    '<label><input class="mR5 vM" type="radio" name="ifCharge" value="2"/>不收取</label>' +
                    '</p>'+
                    '</form>',
                    yes:function(index){
                        $("#setUseFeeForm").submit();
                        layer.close(index);
                    }
                },
                success:function(){
                    $.testRemind.css.zIndex=$('.xubox_shade').css('zIndex')+1;
                    // 表单验证
                    $("#setUseFeeForm").html5Validate(function(){
                           joinCtrl.request({
                            url:jsPath + X.configer[localParm.m].api.setPlatUseFee,
                            type:'post',
                            data:JSON.stringify({id:$('.btnMain').data('uid'),ifCharge:$('#setUseFeeForm input[name=ifCharge]:checked').val()}),
                        }).then(function(data){
                            if(data.statusCode=='2000000'){
                                gl_hy.router.runCallback();
                            }else{
                                joinCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                            }
                        });
                    });
                }                
            });
        });        
        
        
    });

    // 提示消息弹框方法定义
    joinCtrl.on('setTips', function (msg, callback) {
        if (!msg) return;
        $.layer({
            title: '提示消息',
            area: ['500px', '200px'],
            dialog: {
                btns: 1,
                btn: ['返回'],
                type: 8,
                msg: '<div class="tips mB20"><em>' + msg + '</em></div>',
                yes: function (index) {
                    layer.close(index);
                    // 回调
                    callback && callback();
                }
            }
        })
    });
})(mXbn);
