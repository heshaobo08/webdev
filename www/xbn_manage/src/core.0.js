;
(function (win) {


    var version = "1.0",

        mXbn = win.mXbn,

        mark = "mX";

    /** 
     * @description 框架版本控制对象【保存版本更新实例对象】
     */
    var VERSIONS = {};

    /** 
     * @description 框架模块控制对象
     */
    var MODULES = {};

    /** 
     * @description 核心构造函数默认原型对象
     */
    var _prototype = {

        version: version,

        init: function () {
            this.constructor = mXbn;
        },

        utils: {

            instanceOf: function (o, type) {
                return (o && o.hasOwnProperty && (o instanceof type));
            },

            isObject: function (o) {
                return Object.prototype.toString.call(o) === "[object Object]";
            },

            //返回值: 如果传入的参数对象是字符串类型, 则返回true, 否则返回false
            isString: function (str) {
                return Object.prototype.toString.call(str) === "[object String]";
            },

            //返回值: 如果传入的参数对象是数组类型, 则返回true, 否则返回false
            isArray: function (arr) {
                return Object.prototype.toString.call(arr) === "[object Array]";
            },

            //路径替换，将自定义占位符替换为实际地址
            replacePath: function (arr) {

                if (!this.isArray(arr)) {
                    return;
                }

                var str = arr.join("|");

                return str.replace(/{\w+}/g, function (s) {

                    switch (s) {
                    case "{root}":
                        return mXbn.configer.__ROOT_PATH__;
                    case "{file}":
                        return mXbn.configer.__FILE_JS__;
                    }

                });

            }
        }
    };


    /** 
     * @description 加载外部js文件，采用同步get加载机制,有效的解决加载文件依赖问题
     * @param {config} config 对象类型参数
     * @param {config-file} file 加载外部文件路径字符串 注意：字符串开头都要添加前缀（{root}主路径，根目录，子目录{file}）并且每一个路径采用竖线（|）分隔符
     *  @param {config-callback} !暂时停用 callback 加载外部文件后的回调函数
     * @return 无
     */
    var loadScript = function (config) {

        if (!_prototype.utils.isObject(config)) {
            return;
        }

        var _file = config.file ? _prototype.utils.replacePath(config.file).split("|") : [],
            _callback = config.callback || function () {};

        return $LAB.script(_file);

    };


    /** 
     * @description 核心构造函数（采用工厂模式）
     * @param {ver} ver 版本号
     * @param {isNewOne} isNewOne 是否第一次加载 true | false
     * @return {self} result 返回以当前版本号的实例对象
     */
    var Main = function (ver, isNewOne) {

        var self = this;

        this._mI = MODULES;

        if (isNewOne) {

            if (!(_prototype.utils.instanceOf(self, mXbn))) {
                self = new mXbn(ver);
            } else {
                self.init();
            }
        } else {

            if (ver) {

                var ver = String(ver);

                try {

                    if (!mXbn.VERSIONS[ver]) {
                        mXbn.VERSIONS[ver] = new mXbn(ver, true);
                    }

                    //返回默认版本的实例对象
                    self = mXbn.VERSIONS[ver];

                } catch (e) {
                    throw (new Error(e.message));
                }
            } else {

                if (!mXbn.VERSIONS[mXbn.DEFAULT_VERSION]) {
                    mXbn.VERSIONS[mXbn.DEFAULT_VERSION] = new mXbn(mXbn.DEFAULT_VERSION, true);
                }

                self = mXbn.VERSIONS[mXbn.DEFAULT_VERSION];
            }
        }


        return self;

    };


    /**
     * @description 初始化核心组件
     */
    try {

        if (typeof (mXbn) === "undefined" || (mXbn.mark && mXbn.mark === mark)) {

            if (mXbn) {

                VERSIONS = mXbn.VERSIONS;
            }

            mXbn = Main;

            mXbn.prototype = _prototype;

            mXbn.mark = mark;

            mXbn.require = loadScript;

            mXbn.VERSIONS = VERSIONS;

            mXbn.DEFAULT_VERSION = version;

            win.mXbn = mXbn;
        } else {
            throw (new Error("框架库对象命名空间已被其他库使用!"));
        }


    } catch (e) {
        throw (new Error(e.message));
    }

})(window);