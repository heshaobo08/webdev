/**
 * 通用功能库
 * **/
define(['jquery'],function($){
    var returnObj={};
    
    //设置cookie
	returnObj.setCookie = function(name,value){
		
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
			
	};
    
    //获取cookie
    returnObj.getCookie = function(name){
	
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	
	if(arr=document.cookie.match(reg))
	
	return unescape(arr[2]);
	
	else
	
	return false;

};

  //弹出删除框函数
    returnObj.appearDiv= function(obj,str){
    /*阻止默认事件*/
    var stopDefault = function(e) {
        e.preventDefault();
    };
		
    $('#cover').show();
    $('#cover').height($(document).height());
    $("."+obj).fadeIn(400).find('h4').text(str);
    $(window).on("touchmove",stopDefault);

    $("."+obj+" p").on("click",function() {
        $("#cover").hide();
        $("."+obj).hide();
        $(window).off("touchmove",stopDefault);
    });
};
	
 return returnObj;

});