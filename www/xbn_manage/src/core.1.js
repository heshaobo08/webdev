/** 
 * @description 框架自身方法扩展
 */

;
(function (X) {

    $.extend(X.prototype, {

        //写入url地址到浏览器前进后退按钮
        hashHistory: function (that) {

            var _this = $(that);

            var url = _this.data("href"),
                title = _this.data("title");

            this.router.setHistory(url, title);
            this.router.runCallback();
        },

        //权限关联关系ID对照数据解析
        authority: function (data) {

            var _orm = {
                init: function (source) {

                    this.source = {};
                    this.splitStructure(source);
                    return this;
                },

                splitStructure: function (source) {
                    for (var i = 0; i < source.length; i++) {
                        var childs = source[i].childs;
                        if (!childs.length) {
                            continue;
                        }
                        this.source[source[i].id] = childs;
                        this.splitStructure(childs);
                    }
                }
            };

            return _orm.init(data).source;
        },

        //图片上传服务
        uploadFile: function (elem, callback) {
            // 默认2M
            var size='2M',
                maxTotal=0;
            if(arguments[2]){
                size=arguments[2].toLocaleUpperCase();
            }
            // 不匹配既默认
            if(!size.match(/^(([1-9][\d]{0,7}|0)(\.[\d]{1,2})?)(M|KB|B)$/)){
                size='2M';
            }
                        
            if(size.indexOf('M')>-1){
                maxTotal=parseFloat(size)*1024*1024;
            }else if(size.indexOf('KB')>-1){
                maxTotal=parseFloat(size)*1024;
            }else{
                maxTotal=parseFloat(size);
            }

            var _private = {

                requestUri: document.location.protocol + "//timage.xbniao.com/file/image.upload;jsessionid=" + $.cookie("SID"),

                //获取本地文件地址
                readURL: function (input, tmpimg) {
                    if(input.files[0].size>maxTotal){
                        $.layer({
                            title:'提示消息',
                            area: ['500px', ''],
                            dialog:{
                                btns : 1,
                                btn : ['返回'],
                                type : 8,
                                msg:'<div class="tips"><em>文件太大，已超过最大限制大小'+size+'</em></div>'
                            }
                        });
                        return false;
                    }
                    if (input.files && input.files[0]) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            if (!/image/.test(e.target.result)) {
                                alert('请上传图片格式...');
                                return false;
                            }
                            //tmpimg.attr('src', e.target.result);
                        }
                        reader.readAsDataURL(input.files[0]);
                    }
                    return true;
                }
            };

            $(elem).change(function () {

                var $me = $(this);
                var $img = $me.parent().find('img');
                var isLoad=_private.readURL(this, $img);
                if(!isLoad) return;
                var file = this.files[0];
                var formData = new FormData();
                formData.append('img1', file);
                $.ajax({
                    type: "POST",
                    url: _private.requestUri,
                    crossDomain: true,
                    jsonp: "jsoncallback",
                    data: formData,
                    contentType: false,
                    processData: false,
                    complete: function (data) {
                        callback && callback(JSON.parse(data.responseText));
                    }
                });
            });

        }

    });


    X.create = function () {};

})(mXbn);