;
(function (X) {

    var gl_pz = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var localParm=gl_pz.utils.getRequest();

    var promotionsCtrl = gl_pz.ctrl(),

        userLevelList={};

    // 创建视图
    promotionsCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    var getPromotId=mXbn().utils.getRequest().id;
    // 物流基础信息加载页面
    if(getPromotId){
        // 修改
        promotionsCtrl.request({
            url:jsPath + X.configer[localParm.m].api.getPromotDetail+getPromotId,
            type: "post"
        }).then(function(data){
            if(data.statusCode=='2000000'){
                promotionsCtrl.render(data.data).then(function(){
                    // 渲染产品 下拉列表
                    promotionsCtrl.tirgger('promotionsRender',data.data);
                });
            }else{
                promotionsCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
            }
        });
    }else{
        // 新增
        promotionsCtrl.render().then(function(){
            // 渲染产品 下拉列表
             promotionsCtrl.tirgger('promotionsRender');
        });
    }

    // 获取用户等级列表
    promotionsCtrl.request({
            url:jsPath + X.configer[localParm.m].api.userLevelList,
            type: "post",
            data:JSON.stringify({
                isValid:true
            })
        }).then(function(data){
            if(data.statusCode=='2000000'){
                userLevelList=data.data;
            }else{
                promotionsCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
            }
        });

    // 渲染产品 （模板局部渲染）
    promotionsCtrl.on('promotionsRender',function(pageData){

        // 获取所有产品列表
        promotionsCtrl.request({
            url:jsPath+X.configer["xhr_id_199_222"].api.productList,
            data:JSON.stringify({
                "isPage": false,  //是否分页 不分页
                "productStatus":1,
                isRecommended: "1"
            }),
            type:'post'
        }).then(function(data){
            if(data.statusCode=='2000000'){
                // 编辑
                if(getPromotId){
                    // 选择促销产品关联id
                    data.data.productIds={};
                    if(pageData.productIds){
                        $.each(pageData.productIds,function (i,product) {
                            data.data.productIds[product]=product;
                        });
                    }
                    // 选择促销方式
                    data.data.promotionTypes=pageData.promotionTypes; //Todo 字段变更
                }
                data.data.timeStamp=new Date().getTime();

                data.data.userLevelList=userLevelList;

                // 选择促销产品
                promotionsCtrl.renderIn("#promotProductTmpl","#promotProductCon",data.data);

                // 促销方式加载
                promotionsCtrl.renderIn("#promotTypeTmpl",".promotionWay",data.data);

                // 触发页面dom事件
                promotionsCtrl.tirgger('dom_init',"#id_conts");

                // 促销产品下拉数据渲染
                promotionsCtrl.tirgger('giftDataRender',data.data);

            }else{
                promotionsCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
            }

        })
    })


    // dom节点event初始化
    promotionsCtrl.on('dom_init',function(ele){
        // 删除 删除角色按钮
        $('.js-addPromotRole').siblings('.js-delPromotRole').remove();
        // 新增角色
        $(ele).undelegate('.js-addPromotRole','click').delegate('.js-addPromotRole','click',function(){
            var _that=$(this);
            // 获取或有赠送活动产品
            promotionsCtrl.request({
                url:jsPath+ X.configer["xhr_id_199_222"].api.productList,
                data:JSON.stringify({
                    "isPage": false,  //是否分页 不分页
                    "productStatus":1,
                    isRecommended: "1"
                }),
                type:'post'
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    data.data.timeStamp=new Date().getTime();
                    // 设置等级列表
                    data.data.userLevelList=userLevelList;
                    // 渲染促销方式模板
                    promotionsCtrl.renderTo("#promotTypeTmpl",".promotionWay",data.data);
                    var len=$('dl[data-promotType]').length;
                    // 控制所有新增促销方式里面相关input属性
                    $('dl[data-promotType]:last').attr("data-promotType",len).find('input[name=discountType_last]').attr('name',"discountType_"+len);

                    // 设置促销方式分组
                    $('dl[data-promotType]').find('dt').each(function(i,promot){
                        $(this).html("促销方式 "+(i+1)+":");
                    });

                    // 修改新增角色按钮12-21
                    // _that.remove();
                    $('dl[data-promotType]:last').find('.js-addPromotRole').remove();

                    // 促销产品下拉数据渲染
                    promotionsCtrl.tirgger('giftDataRender',data.data);
                    // 下拉列表
                    sele('.select','dl[data-promotType]:last');
                    // 最多天机10个
                    if($('[data-promottype]').length>=10){
                        $('.js-addPromotRole').hide();
                    }
                }else{
                    promotionsCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            }) ;
        });

        // 删除角色
        $(ele).undelegate('.js-delPromotRole','click').delegate('.js-delPromotRole','click',function(){
            $(this).closest('dl').remove();
        });

        // 新增阶梯折扣
        $(ele).undelegate('.js-addDiscountRate','click').delegate('.js-addDiscountRate','click',function(){
            // 限制10条数据
            if($(this).closest('.stepDis').find('p').length>=10){
                promotionsCtrl.tirgger('setTips','最多添加10条');
                return ;
            }
            var parentP=$(this).closest('p'),
                nextP=parentP.next('p'),
                prevStart=parentP.find('.startValue').html(),
                prevEnd=parentP.find('.endValue').val(),
                nextStart=nextP.find('.startValue').html(),
                nextEnd=nextP.find('.endValue').val();
            if($.html5Validate.isAllpass(parentP.find("input"))){
                if(prevStart>=prevEnd){
                    parentP.find('.endValue').testRemind('阶梯折扣值必须大于前者');
                    return;
                }
                var sendData={startValue:0,endValue:0};
                sendData.startValue=prevEnd?prevEnd:prevStart;
                sendData.endValue=nextEnd?nextStart:'';
                var oP=$('<p class="stepDisSecP"></p>');
                oP.insertAfter($(this).closest('p'));
                $(this).addClass('none');
                // 渲染新增阶梯价模板
                promotionsCtrl.renderTo("#discountRateTmpl",oP[0],sendData);
            }

        });

        // 删除阶梯折扣
        $(ele).undelegate('.js-deleteDiscountRate','click').delegate('.js-deleteDiscountRate','click',function(){
            var parentP=$(this).closest('p'),
                oTepDis=$(this).closest('.stepDis');
                prevP=parentP.prev('p'),
                nextP=parentP.next('p'),
                thisStart=parentP.find('.startValue').html(),
                prevEnd=prevP.find('.endValue').val(),
                prevStart=prevP.find('.startValue').html();
                // 判断下一个start值是多少
                nextP.find('.startValue').html(thisStart?thisStart:(prevEnd?prevEnd:prevStart));
                $(parentP).remove();
                oTepDis.find('.js-deleteDiscountRate').removeClass('none');
                oTepDis.find('.js-addDiscountRate').addClass('none');
                oTepDis.find('.js-addDiscountRate:last').removeClass('none');
        });

        // Todo 校验
        $(ele).undelegate('.endValue','blur').delegate('.endValue','blur',function(){
            var parentP=$(this).closest('p'),
                nextP=parentP.next('p'),
                prevStart=parentP.find('.startValue').html(),
                prevEnd=$(this).val(),
                nextStart=nextP.find('.startValue').html(),
                nextEnd=nextP.find('.endValue').val(),
                thisOldVal=$(this).data('oldVal')||$(this).val();
            if(prevEnd<prevStart){
                $(this).testRemind('阶梯折扣值必须大于前者').val(thisOldVal);
                return;
            }
            if(prevEnd>nextEnd && nextEnd!=''){
                $(this).testRemind('当前阶梯折扣值必须大于后面阶梯折扣值').val(thisOldVal);
                return;
            }
            nextP.find('.startValue').html(prevEnd);
        });

        // 提交按钮
        $('.js-promotSaveSubmit').off().on('click',function(){

            promotionsCtrl.tirgger('formValid');
        });



        // 开始时间
        $(".timeStart,#startTime",ele).on("click",function(){
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
        $(".timeEnd,#endTime",ele).on("click",function(){
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
    });

    // 表单验证
    promotionsCtrl.on('formValid',function(){
        // 表单验证
        if($.html5Validate.isAllpass($('.initBox input')) && $.html5Validate.isAllpass($('.discountType:checked').closest('dd').find('input')) && $.html5Validate.isAllpass($('.promotTypeDd input'))){
            var isValid=true;
            $('dl[data-promottype]').each(function (i,dl) {
                if($(this).find('.discountType:checked').length==0){
                    $(this).find('.discountType:first').testRemind('请选择促销方式');
                    isValid=false;
                }
            });
            if(!isValid) return isValid;
            var url='';
            var sendData={
                "promotionType": $('input[name=promotionType]',"#promotForm").attr('index-data'),
                "promotionName": $('input[name=promotionName]',"#promotForm").val(),
                "promotionStartTime":$('input[name=promotionStartTime]',"#promotForm").val(),
                "promotionEndTime": $('input[name=promotionEndTime]',"#promotForm").val(),
                "promotionStatus": $('input[name=promotionStatus]:checked',"#promotForm").val(),
                "productIds": [],
                "promotionTypes": []
            };
            // 产品id
            $('input[name=productIds]',"#promotForm").each(function(i){
                sendData.productIds.push($(this).attr('index-data'));
            })
            // 促销方式(拼合数据)
            $('dl[data-promottype]').each(function(i){
                var discountType=$('.discountType:checked',this).val(),
                    promot={
                    "userGrade": $('input[name=userGrade]',this).attr('index-data'),
                    "discountType":discountType ,
                    "discount":[]
                };
                // 折扣类型0--单一折扣，1--阶梯折扣，2--买赠活动",
                if(discountType=='0'){
                    promot.discount.push({
                        "startValue":null,
                        "endValue":null,
                        "discountRate":$('[name=discountRate]',this).val()
                    });
                }else if(discountType=='1'){
                    $(".stepDis>p",this).each(function(i){
                        promot.discount.push({
                            "discountRate": $('.discountRate',this).val(),
                            "startValue": $('.startValue',this).html(),
                            "endValue": $('.endValue',this).val()
                        });
                    });
                }else if(discountType=='2'){
                    promot.discount[0]={
                        "giftProductIds":[]
                    }
                    $('input[name=giftProductIds]',this).each(function(i){
                        promot.discount[0].giftProductIds.push($(this).attr('index-data'));
                    })
                }
                sendData.promotionTypes.push(promot);
            });
            //  修改
            if(getPromotId){
                sendData.promotionId=$('input[name=promotionId]').val();
                url=jsPath+X.configer[localParm.m].api.editPromotion;
            }else{
                url=jsPath+X.configer[localParm.m].api.savePromotion;
            }
            // 提交数据
            promotionsCtrl.request({
                data:JSON.stringify(sendData),
                type:'post',
                url:url
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    promotionsCtrl.tirgger('setTips',"促销信息添加成功",function(){
                        gl_pz.router.setHistory("?m=xhr_id_199_226");
                        gl_pz.router.runCallback();
                    });
                }else{
                    promotionsCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });
        }

    })

    // 促销产品下拉数据渲染
    promotionsCtrl.on('giftDataRender',function(data){
        $('.js-addGiftSale').off().on('click',function(){
            data.timeStamp=new Date().getTime();
            // 局部渲染
            promotionsCtrl.renderTo('#giftProductTmpl',$(this).siblings('#giftPromotCon')[0],data);
            // 下拉列表
            sele($(this).siblings('#giftPromotCon').find('.select:last'),$(this).closest('dd'),function(index,val){
                if($(this).closest('span').find('input[data-target^=jd-giftProductIds][index-data='+index+']').length>1){
                    $(this).testRemind('请选择其他赠送产品，该产品已被使用');
                    return;
                }
            });
            // 最多添加五个赠品
            if($('[id^=jd-giftProductIds]').length>=5){
                $(this).hide();
            }
        })
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
