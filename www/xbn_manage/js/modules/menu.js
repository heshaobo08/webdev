;
(function (X) {

    var menu = X(),
        navsCtrl = menu.ctrl();

    //初始化导航点击事件
    navsCtrl.on("init_navigation", function (elem) {

        $(elem).find("dt a").on("click", function () {
        	if ($(this).closest("dl").hasClass("active")) {
        		$(".navItem dd").slideUp("slow");
        		$(".navItem dl").removeClass("active");
        	} else {
        		$(".navItem dl").removeClass("active");
        		$(this).closest("dl").addClass("active");
        		$(".navItem dd").slideUp("slow");
        		$(".active dd").slideDown("slow");
        	};
        });

        $(elem).find("dd a").on("click", function () {
            $(".navItem dd a").removeClass("active");
            $(this).addClass("active");
            menu.hashHistory(this);
        });

    });

    navsCtrl.tirgger("init_navigation", "#id_menu");

})(mXbn);