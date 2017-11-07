/**
 * 通用功能库
 * **/
define(['jquery'],function($){
    var returnObj={};

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

 //设置cookie
    returnObj.setCookie = function (name, value) {

        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();

    };

    //获取cookie
    returnObj.getCookie = function (name) {

        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

        if (arr = document.cookie.match(reg))

            return unescape(arr[2]);

        else

            return false;

    };
    //验证身份证方法
    var aCity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };

    returnObj.cidInfo = function (sId) {
        var iSum = 0
        var info = ""
        if (!/^\d{17}(\d|x)$/i.test(sId)) {
            return false;
        }
        sId = sId.replace(/x$/i, "a");
        if (aCity[parseInt(sId.substr(0, 2))] == null) {
            return false;
        }
        var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
        var d = new Date(sBirthday.replace(/-/g, "/"))
        if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
            return false;
        }
        for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
        if (iSum % 11 != 1) {
            return false;
        }
        return true;
    };
	
 return returnObj;

});