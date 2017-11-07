/**
 * 应用初始化函数
 * 路由配置
 */
define(['jquery','crossroads','hasher','routeService','pagenav'],function($,crossroads,hasher,routeService,pagenav){
    var init= function(){
        //设置默认首页地址
        var DEFAULT_HASH = "index";
        var DEFAULT_URL = "http://" + window.location.host + "/";

        //添加路由规则
        crossroads.addRoute('/{classify}', function(classify){
            classify='views/'+classify+'.html';
            routeService.getMenuCon(classify).then(function(reqData){
                $('.conRight').html(reqData);
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

        //菜单切换
        $('.conLeft ul li').off('click').on('click',function(e){
            e.stopPropagation();
            var url=$(this).data('href');
            if(url){
				$(this).find("a").addClass('leftActive');
				$(this).siblings().find("a").removeClass('leftActive');	
				//菜单可重复点击
				if (url!= 'javascript:void(0)'){
                var curHash = url.split("#").pop();
                if (hasher.getHash() == curHash) {
                    hasher.replaceHash(curHash + '?time='+(new Date()).getTime());
					return;
					}
				}
                hasher.setHash(url);
            }else{
				$(this).find("ul").toggle();
				$(this).toggleClass(function(){
					if($(this).find(".arcDown").attr("class")=="arcDown"){
						$(this).find(".arcDown").removeClass().addClass('arcLeft');
					}else{
						$(this).find(".arcLeft").removeClass().addClass('arcDown');
					};
					if($(this).find(".arcDown2").attr("class")=="arcDown2"){
						$(this).find(".arcDown2").removeClass().addClass('arcLeft2');
					}else{
						$(this).find(".arcLeft2").removeClass().addClass('arcDown2');
					};
				});
            }

        });
		
    };

    return {
        init:init
    }
});
