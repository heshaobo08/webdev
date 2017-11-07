;
(function (X) {

    var win = window,
        main = X(),
        utils = main.utils,
        hashHistory = "";


    var navsCtrl = main.ctrl(), //初始化左侧导航控制器
        headerCtrl = main.ctrl(); //初始化头部控制器

    var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;

    //设置全局AJAX请求
    $.ajaxSetup({
        cache: false,
        contentType: "application/json;charset=utf-8" //如果不设置会出现415错误
    });

    //全局设置ajax所有请求完成后的回调函数
    $(document).ajaxStop(function () {
        //清除全局加载动画效果
        $(".load_animation").fadeOut();
    });

    //面包屑
    headerCtrl.on("crumbs", function (m, t) {

        headerCtrl.renderIn(m, t, {
            crumbs: document.title.split("-")
        });

    });

    //退出平台
    headerCtrl.on("out", function () {

        $.cookie("ID", '', {
            expires: -1
        });

        win.localStorage.clear();
        win.location.href = "login.html";
    });

    //导航路由响应事件回调函数
    main.router.callback = function (P) {
        if (!P.m) {

            //默认模块地址写入路由 基础配置内
            //main.router.setHistory("?m=xhr_id_1_2", "系统管理");
            //根据权限设置默认页面
            var roles=JSON.parse(win.localStorage.Roles)[0];
            main.router.setHistory("?m=xhr_id_"+roles.id+"_"+roles.childs[0].id, roles.menuName+'>'+roles.childs[0].menuName);
            main.router.init();
        } else {


            var userID = $.cookie("ID") || 0;

            //强力验证登陆状态
            headerCtrl.request({
                url: X.configer.__API_PATH__ + X.configer.user.api,//修改验证登陆接口
                type: "GET",
                dataType: "json",
                error: function (xhr, code) {
                    //恶意刷新保护
                    //headerCtrl.tirgger("out");
                }
            }).then(function (D) {

                if (D.statusCode == "2505000" || D.statusCode == "3000403") {
                    headerCtrl.tirgger("out");
                }

                //加载外部模块
                var xhr = $.ajax({
                    url: utils.replacePath(["{root}/{file}/modules/" + P.m + ".js"]),
                    type: "GET",
                    error: function (xhr) {

                        if (xhr.status == 404) {
                            main.router.setHistory(hashHistory); //跳出404闭环
                            win.location.href = "template/404.html";
                        }
                    }
                });

                //数据请求成功后的执行函数
                xhr.then(function (text, status, xhr) {
                    hashHistory = "?m=" + P.m;
                    $.each(P,function(i,hash){
                        if(i!='m'){
                            hashHistory+='&'+i+'='+hash;
                        }
                    });
                    var localPath=P.m.split('_');
                    //操作主列表(Todo 暂时兼容主列表，详情暂时不兼容)
                    if(localPath.length<=4 && !isNaN(localPath[2]) && !isNaN(localPath[3])){
                        var roles=X.getRolesObj(localPath[2],localPath[3]);
                        main.router.setHistory(hashHistory, roles.moduleData.menuName+'>'+roles.actionData.menuName);
                    }
                    headerCtrl.tirgger("crumbs", "#crumbs", ".crumbs");
                });
            });
        }
    };


    try {

        //初始化路由分发器
        main.router.init();

        navsCtrl.view = {
            elem: "#id_menu",
            tpl: path + "/" + X.configer.menu.tpl
        };

        headerCtrl.view = {
            elem: "#id_header",
            tpl: path + "/" + X.configer.header.tpl
        };

        //导航渲染
        var menus = $.each(JSON.parse(localStorage.Roles), function (i, elem) {
            var code = elem.code;
            elem["className"] = X.configer.menu.ico[code];
        });
        navsCtrl.render(menus);

        //解析数据并渲染至页面(面包屑)
        headerCtrl.render(JSON.parse(win.localStorage.User)).then(function () {
            headerCtrl.tirgger("crumbs", "#crumbs", ".crumbs");
        });

        //全局点击事件绑定
        $(document).on("click", "*[data-href]", function () {
            var that = $(this);
            if (!that.closest("#id_menu").length) {
                main.hashHistory(that);
            }
        });
    } catch (e) {
        headerCtrl.tirgger("out");
    }


})(mXbn);
