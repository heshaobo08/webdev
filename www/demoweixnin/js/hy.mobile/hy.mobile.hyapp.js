/// <reference path="hy.mobile.js" />

/*
    轻应用接口
*/

; (function (app) {
    app.showMsg = function (level, msg) {
        /// <summary>输出消息</summary>
        /// <param name="level" type="String">消息级别</param>
        /// <param name="msg" type="String">消息</param>

        this.callAPP({ cmd: "showLog", param: { level: level, message: msg } })
    };

    app.showDebugMsg = function () {
        /// <summary>启用显示调试消息</summary>

        this.callAPP({ cmd: "setting", param: { key: "debugMsg", value: "open" } });
    };

    app.closeDebugMsg = function () {
        /// <summary>关闭显示调试消息</summary>

        this.callAPP({ cmd: "setting", param: { key: "debugMsg", value: "close" } });
    };
})(hm.hyapp);