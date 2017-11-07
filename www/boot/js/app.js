/**
 * 应用初始化函数
 * 路由配置
 */
define(['jquery','crossroads','hasher','routeService','bootstrap'],function($,crossroads,hasher,routeService,bootstrap){
    var init= function(){
        //设置默认首页地址
        var DEFAULT_HASH = "home";
        var DEFAULT_URL = "http://" + window.location.host + "/";

        //添加路由规则
        crossroads.addRoute('/{classify}', function(classify){
            classify='views/'+classify+'.html';
            routeService.getMenuCon(classify).then(function(reqData){
                $('.contRight').html(reqData);
            },function(reason){
                //console.log(reason);
            });
        });

        crossroads.bypassed.add(function(request){ //匹配不上时
            hasher.setHash(DEFAULT_HASH);
        });

        //设置hasher
        function parseHash(newHash, oldHash){
            //hasher.changed.active = true; 可以禁止hashchange事件执行
            if (newHash == "") {
                newHash = DEFAULT_HASH;
            }
            crossroads.parse(newHash);
        }
        hasher.initialized.add(parseHash); // parse initial hash
        hasher.changed.add(parseHash); //parse hash changes
        hasher.init(); //start listening for history change
        if (!hasher.getHash() && hasher.getURL() == DEFAULT_URL) {
            hasher.setHash(DEFAULT_HASH);
        }

        $(".menuList .functionItem a").off().on('click', function (e) {
            e.stopPropagation();
            var url=$(this).data('href');
            if(url){
                hasher.setHash(url);
               /*//菜单可重复点击
                var curHash = window.location.href.split("#").pop().toString().substring(1);
                if (hasher.getHash() == curHash) {
                hasher.replaceHash(curHash + '?time='+(new Date()).getTime());
                return false;
                }*/  
            }else{
                if ($(this).parent('h3').next('ul').css('display') == 'block') {
                    $(this).parent('h3').next('ul').slideUp(300);
                } else {
                    $(".menuList").find("ul").slideUp(300);
                    $(this).parent('h3').next('ul').slideDown(300);
                }
            }

        });
		
    };

    return {
        init:init
    }
});
