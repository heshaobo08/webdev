/*!
 * jQuery Validation Plugin v1.13.0
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2014 Jörn Zaefferer
 * Released under the MIT license
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery", "jqueryvalidate"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

(function() {
	var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"} 
	function stripHtml(value) {
		// remove html tags and space chars
		return value.replace(/<.[^<>]*?>/g, " ").replace(/&nbsp;|&#160;/gi, " ")
		// remove punctuation
		.replace(/[.(),;:!?%#$'\"_+=\/\-“”’]*/g, "");
	}

	$.validator.addMethod("maxWords", function(value, element, params) {
		return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length <= params;
	}, $.validator.format("Please enter {0} words or less."));

	$.validator.addMethod("minWords", function(value, element, params) {
		return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length >= params;
	}, $.validator.format("Please enter at least {0} words."));

	$.validator.addMethod("rangeWords", function(value, element, params) {
		var valueStripped = stripHtml(value),
			regex = /\b\w+\b/g;
		return this.optional(element) || valueStripped.match(regex).length >= params[0] && valueStripped.match(regex).length <= params[1];
	}, $.validator.format("Please enter between {0} and {1} words."));
	//中英文
	jQuery.validator.addMethod("isZhOrEng", function(value, element) {   
	    var reg = /^[a-zA-Z\u4E00-\u9FA5\uF900-\uFA2D]+$/;
	    return this.optional(element) || (reg.test(value));
	}, "请输入中英文");
    
    //英文数字
    jQuery.validator.addMethod("isNumOrEng", function(value, element) {   
	    var reg = /^[a-zA-Z0-9]+$/;
	    return this.optional(element) || (reg.test(value));
	}, "请输入英文或数字");
	//中文
	jQuery.validator.addMethod("isZh", function(value, element) {   
	    var reg = /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/;
	    return this.optional(element) || (reg.test(value));
	}, "");
    //不能是特殊字符
	jQuery.validator.addMethod("isSpecial", function(value, element) {   
	    var reg = /^([a-zA-Z0-9\u4E00-\u9FA5\uF900-\uFA2D]+)$/;
	    return this.optional(element) || (reg.test(value));
	}, "");
    //单个电话
    jQuery.validator.addMethod("isSimpleTel", function(value, element) {   
	    var reg = /^[0-9-]{5,20}$/;
	    return this.optional(element) || (reg.test(value));
	}, "号码格式不正确（号码长度最少5位，且仅支持数字和'-'）");
    //多个电话号码
	jQuery.validator.addMethod("isTel", function(value, element) {   
	    var reg = /^[0-9,\uff0c-]{5,100}$/;
	    return this.optional(element) || (reg.test(value));
	}, "号码格式不正确（号码长度最少5位，且仅支持数字和'-'）");
     //多个联系人
	jQuery.validator.addMethod("isConnectPeople", function(value, element) {   
	    //var reg = /^[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z,\uff0c]+$/;
        var reg = /^[\D-,\uff0c]+$/;
	    return this.optional(element) || (reg.test(value));
	}, "联系人不能为数字,多个请用逗号隔开");
    //不能为数字
    jQuery.validator.addMethod("isNotNum", function(value, element) {   
	    var reg = /^[\D]+$/;
	    return this.optional(element) || (reg.test(value));
	}, "");
	//手机号
	jQuery.validator.addMethod("isMobile", function(value, element) {   
	    var reg = /^(13|15|18|14|17)[0-9]{9}$/;
	    return this.optional(element) || (reg.test(value));
	}, "手机号码格式错误");

	//数字
	jQuery.validator.addMethod("isNumber", function(value, element) {   
	    var reg = /^[0-9]+$/;
	    return this.optional(element) || (reg.test(value));
	}, "");
    
    //现金
    jQuery.validator.addMethod("isNumOrPoint", function(value, element) {   
	    var reg = /^[1-9]{1}[0-9]{0,5}(\.\d{1,2})?$/;
	    return this.optional(element) || (reg.test(value));
	}, "");
    
    //积分
    jQuery.validator.addMethod("isNumOrjifen", function(value, element) { 
        //var reg = /^[0-9]{1,7}$/;
        var reg = /^(0|[1-9]{1}[0-9]{0,6})$/;
	    return this.optional(element) || (reg.test(value));
	}, "");
    
    
    //打折0-9.99
    jQuery.validator.addMethod("isDiscount", function(value, element) {   
	    //var reg = /^(([0-9]{1}(\.\d{1})?)|((10){1}(\.0)?)){1}$/;
        var reg = /^[1-9]{1}(\.\d{1})?$/;
	    return this.optional(element) || (reg.test(value));
	}, "");
    //大于1的数字
    jQuery.validator.addMethod("isGtNub", function(value, element) {   
	    var reg = /^[1-9][0-9]{0,9}$/;
	    return this.optional(element) || (reg.test(value));
	}, "");
    
    //1-99数字
	jQuery.validator.addMethod("isNub", function(value, element) {   
	    var reg = /^[1-9][0-9]{0,2}$/;
	    return this.optional(element) || (reg.test(value));
	}, "请输入1-999之间的数字");
	//数字范围
	jQuery.validator.addMethod("isRangeNum", function(value, element,params) { 
	    var reg = /^[1-9][0-9]{0,2}$/;
	    return this.optional(element) || (reg.test(value) && value>=params[0] && value<=params[1]);
	}, "");
	//身份证
	jQuery.validator.addMethod("isCardID", function(sId, element) { 
		if (this.optional(element)) {
			return true;
		} 
		if(sId.length==15){
			if(aCity[parseInt(sId.substr(0,2))]==null){
				return false;//"你的身份证地区非法";
			}
			sBirthday=sId.substr(6,2)+"-"+Number(sId.substr(8,2))+"-"+Number(sId.substr(10,2)); 
			var d=new Date(sBirthday.replace(/-/g,"/")) ;
			if(sBirthday!=(d.getYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())) return false;//"身份证上的出生日期非法";
			return true;
		}else if(sId.length==18){
			var iSum=0 ;
			var info="" ;
			sId=sId.replace(/x$/i,"a"); 
			if(aCity[parseInt(sId.substr(0,2))]==null) return false;//return "你的身份证地区非法"; 
			sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2)); 
			var d=new Date(sBirthday.replace(/-/g,"/")) ;
			if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())) return false;//return "身份证上的出生日期非法"; 
			for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
			if(iSum%11!=1) return false;// "你输入的身份证号非法"; 
			return true;
		}else {
			return false;
		}
	}, "请输入15位或18位合法身份证号");


}());
	
}));