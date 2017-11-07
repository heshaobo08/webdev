;
(function (X) {

    var gl_hy = X();

    var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

    // var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

    var jsPath=X.configer.__API_PATH__;

    var messageCtrl = gl_hy.ctrl();

    var localParm=gl_hy.utils.getRequest(),

        platform=localParm.p || "1",  //平台code(默认ebay)

        operateData=X.getRolesObj.apply(null,localParm.m.split('_').slice(2));

    // 创建视图
    messageCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[localParm.m].tpl
    };

    messageCtrl.request({
        data:JSON.stringify({
            platformID:platform,
            pageSize:10,
            toPageNo:localParm.page || 1
        }),
        type:'post',
        url:jsPath + X.configer[localParm.m].api.messageList
    }).then(function(data){
        if(data.statusCode=='2000000'){
            data.data.platformShow=platform;
            data.data.operateData=operateData;
            
            messageCtrl.request({
                type:'get',
                url:jsPath + X.configer[localParm.m].api.siteAll
            }).then(function(site){
                
                $.each(data.data.list,function(i,ele){
                    $.each(site.data,function(j,e){
                        if(ele.siteName == e.id){
                            ele.siteCnName = e.cnName;
                        }
                    })
                    
                });
                
                messageCtrl.render(data.data).then(function(){
                    // page render
                    messageCtrl.tirgger('pageTmplRender',data.data);   

                    //表单验证 
                    messageCtrl.tirgger('formRender'); 

                    // 下拉列表
                    sele();    

                    // 分页渲染
                    messageCtrl.renderIn('#pageListTmpl',".page",data);    

                    // 分页加载
                    messageCtrl.tirgger('pageRender',data.data);   
                });
                
            })
                    
            
        }else{
            messageCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
        }
    });

    // 页面render
    messageCtrl.on('pageTmplRender',function(data){
        $('#searchTotalCount').text(data.totalCount);
        // 消息列表渲染
        messageCtrl.renderIn('#messageListTmpl',"#messageListCon",data);

        // event init
        messageCtrl.tirgger('dom_event_init',"#id_conts");
    });

    // 初始化页面所有dom事件
    messageCtrl.on('dom_event_init',function(ele){
        var pageSize=10,
            toPageNo=localParm.page;

        // 表单提交
        $(".js-messageSearch").off().on('click',function(){
            $("#messageSearchFrom").submit();
        });
        

         // 开始时间
        $(".timeStart,#startTime").off().on("click",function(){
            laydate({
                istime: true,
                elem : '#startTime',
                event : 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        // 结束时间
        $(".timeEnd,#endTime").off().on("click",function(){
            laydate({
                istime: true,
                elem : '#endTime',
                event : 'focus',
                format: 'YYYY-MM-DD hh:mm:ss'
            });
        });

        //旗子等级下拉
        $(".levelSelect i").off().on('click',function(){
            $(".flag").not($(this).next()).hide();
            $(this).next().slideToggle("slow");
            setTimeout("$(this).next().hide()", 1000)//定时关闭有问题
        });
        $(".levelSelect ul li").off().on("click",function(){
            var oPdiv=$(this).parents('div'),
                _that=$(this);
            oPdiv.prev('i').removeClass();
            var colorClass =$(this).find('em').attr('class'),
                colorType=$(this).find('em').attr('index-data');
            messageCtrl.request({
                type:'post',
                url:jsPath + X.configer[localParm.m].api.changeFlag,
                data:JSON.stringify({
                    messageIDs:[oPdiv.attr('data-id')],
                    value:colorType,
                    xbniaoUserID:oPdiv.attr('data-userId')
                })
            }).then(function (data) {
                    if(data.statusCode=='2000000'){
                        
                    }else{
                        messageCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                    }
                });
            _that.parents('div').prev('i').addClass(colorClass);
            $(".flag").slideUp();
            
        })
        
    });

    // 分页加载
    messageCtrl.on('pageRender',function(data){
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
            messageCtrl.tirgger('searchSubmit',p,function(data){
                gl_hy.router.setHistory("?m="+localParm.m+"&page="+p);
                messageCtrl.tirgger("pageTmplRender",data);
                cPageNo=p;
            });
        });
    })

    // 表单验证
    messageCtrl.on('formRender',function(){
        // 表单验证
        $("#messageSearchFrom").html5Validate(function(){
            messageCtrl.tirgger('searchSubmit',1,function(data){
                data.platformShow=platform;
                messageCtrl.tirgger('pageTmplRender',data);
                // 分页渲染
                messageCtrl.renderIn('#pageListTmpl',".page",data);
                // page render
                messageCtrl.tirgger('pageRender',data);
                //显示搜索结果
                $('#searchTotalCount').closest('.addbutton').removeClass('none');
            })
        },{
            validate:function(){
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
    messageCtrl.on('searchSubmit',function(toPageNo,callback){
        var userID=$('input[name=userID]','#messageSearchFrom').val(),
                flag=$('input[name=flag]','#messageSearchFrom').attr('index-data'),
                messageTitle=$('input[name=messageTitle]','#messageSearchFrom').val(),
                receiver=$('input[name=receiver]','#messageSearchFrom').val(),       
                sender=$('input[name=sender]','#messageSearchFrom').val(),       
                startTime=$('[name=startTime]','#messageSearchFrom').html(),          
                endTime=$('[name=endTime]','#messageSearchFrom').html();
            messageCtrl.request({
                data:JSON.stringify({
                    userID:userID?userID:null,
                    flag:flag?flag:null,
                    messageTitle:messageTitle?messageTitle:null,
                    receiver:receiver?receiver:null,
                    sender:sender?sender:null,
                    startTime:startTime?startTime:null,
                    endTime:endTime?endTime:null,
                    platformID:platform,
                    pageSize:10,
                    toPageNo:toPageNo
                }),
                type:'post',
                url:jsPath + X.configer[localParm.m].api.messageList
            }).then(function(data){
                if(data.statusCode=='2000000'){
                    // data.data.platformShow=platform;
                    // // page render
                    // messageCtrl.tirgger('pageRender',data.data);    
                    data.data.operateData=operateData;
                    callback && callback(data.data);            
                }else{
                    messageCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });
    });



    // 提示消息弹框方法定义
    messageCtrl.on('setTips',function(msg,callback){
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
