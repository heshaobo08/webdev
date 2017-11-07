/**
 * Description: 获得菜单服务模块
 * 这是数据层，只负责接口数据请求和返回，不能进行dom操作。
 */
define(['jquery'], function ($) {
    var req = {};
    //获取菜单列表
    req.getMenuCon = function (filename) {
        var deferred = $.Deferred();
        $.ajax({
            type: 'get',
            url: filename,
            data: {},
            dataType: 'html',
            success: function (data) {
                deferred.resolve(data);
            },
            error: function () {
                deferred.reject('请求失败');
            }

        });
        return deferred.promise();

    };

    //	AJAX获取列表数据
    req.getListData = function (url, type, data) {
        var deferred = $.Deferred();
        $.ajax({
            type: type,
            url: url,
            data: data,
            dataType: 'html',
            success: function (data) {
                deferred.resolve(data);
            },
            error: function () {
                deferred.reject('请求失败');
            }

        });
        return deferred.promise();
    };

    //	AJAX获取产品
    req.getProduct = function (p_id) {
        var deferred = $.Deferred();
        $.ajax({
            type: "POST",
            url: "/admin/index.php/shared/getProduct",
            dataType: "JSON",
            success: function (data) {
                //	        	proStr = '<option value="0">全部</option>';
                //				$.each(data.list, function (key, item) {
                //	                if (p_id == item.id) {
                //	                	proStr += '<option value="'+item.id+'" selected="selected">'+item.name+'</option>';
                //	                } else {
                //	                    proStr += '<option value="'+item.id+'">'+item.name+'</option>';
                //	                }
                //	            });
                //				$("#pro_select").html("");
                //				$("#pro_select").append(proStr);
                deferred.resolve(data);
            },
            error: function () {
                deferred.reject('请求失败');
            }

        });
        return deferred.promise();
    };

    //	发送请求，返回JSON格式
    req.sendPost = function (url, type, data) {
        var deferred = $.Deferred();
        $.ajax({
            type: type,
            url: url,
            data: data,
            dataType: "JSON",
            success: function (data) {
                deferred.resolve(data);
            },
            error: function () {
                deferred.reject('请求失败');
            }

        });
        return deferred.promise();
    };

    //	发送请求，返回HTML格式
    req.getHtml = function (url, type, data) {
        var deferred = $.Deferred();
        $.ajax({
            type: type,
            url: url,
            data: data,
            dataType: "html",
            success: function (data) {
                deferred.resolve(data);
            },
            error: function () {
                deferred.reject('请求失败');
            }

        });
        return deferred.promise();
    };

    //发送JSONP请求，返回JSON数据
    req.sendJSONP = function (url, data, callbackname, error) {
        $.ajax({
            url: url,
            dataType: "jsonp",
            data: data,
            success: function (data) {
                if (callbackname != null) {
                    callbackname(data);
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (error != null) {
                    error();
                }

            }
        });
    };
    return req;
});