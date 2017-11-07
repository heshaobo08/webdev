/**
 * 应用初始化函数
 * 路由配置
 */
define(['jquery','crossroads','hasher','routeService'],function($,crossroads,hasher,routeService){
    var init= function(){
        //设置默认首页地址
        var DEFAULT_HASH = "payment";
        var DEFAULT_URL = "http://" + window.location.host + "/";

        //添加路由规则
        crossroads.addRoute('/{classify}', function(classify){
            classify=classify+'.html';
            routeService.getMenuCon(classify).then(function(reqData){
                $('#wapper').html(reqData);
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

        //可重复点击问题
        //if (hasher.getHash() == curHash) {
        //    hasher.replaceHash(curHash + '?time=new Date()');
        //}

		
    };

    return {
        init:init
    }
});
