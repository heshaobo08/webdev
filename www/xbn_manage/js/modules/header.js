;
(function (X) {
    
    var header = X();
    var headerCtrl = header.ctrl();

    //退出平台操作
    headerCtrl.on("loginOut", function () {

        $.layer({
            title: '退出',
            area: ['550px', ''],
            dialog: {
                btns: 2,
                btn: ['确定', '取消'],
                type: 8,
                msg: '<div class="tips">确定要退出吗？</div>',
                yes: function () {

                    var userID = $.cookie("ID");

                    headerCtrl.request({
                        url: X.configer.__API_PATH__ + X.configer.header["api"]["loginOut"],
                        data: JSON.stringify({
                            id: userID
                        }),
                        type: "POST"
                    }).then(function (D) {

                        if (D.statusCode == "2000000") {
                            window.localStorage.clear();
                            $.cookie("ID", '', {
                                expires: -1
                            });
                            window.location.href = "login.html";
                            layer.close(layer.index);
                        }

                    });


                }
            }
        });
    });

    $(".js-signOut").on("click", function () {
        headerCtrl.tirgger("loginOut");
    });

})(mXbn);