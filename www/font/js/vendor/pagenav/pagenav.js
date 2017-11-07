define([],function(){
	
	var pageNav = {};
	pageNav.fn = null;
	//p为当前页码,pn为总页数
	pageNav.nav = function(p, pn) {
		//只有一页,直接显示1
		if (pn <= 1) {
			this.p = 1;
			this.pn = 1;
			return this.pHtml2(1);
		}
		if (pn < p) {
			p = pn;
		};
		var re = "";
		//第一页
		if (p <= 1) {
			p = 1;
		} else {
			//非第一页
			re += this.pHtml(p - 1, pn, '<img src="img/pag_left.jpg">');
			//总是显示第一页页码
			re += this.pHtml(1, pn, "1");
		}
		//校正页码
		this.p = p;
		this.pn = pn;

		//开始页码
		var start = 2;
		var end = (pn < 9) ? pn: 9;
		//是否显示前置省略号,即大于10的开始页码
		if (p >= 7) {
			re += "...";
			start = p - 4;
			var e = p + 4;
			end = (pn < e) ? pn: e;
		}
		for (var i = start; i < p; i++) {
			re += this.pHtml(i, pn);
		};
		re += this.pHtml2(p);
		for (var i = p + 1; i <= end; i++) {
			re += this.pHtml(i, pn);
		};
		if (end < pn) {
			re += "...";
			//显示最后一页页码,如不需要则去掉下面这一句
			re += this.pHtml(pn, pn);
		};
		if (p < pn) {
			re += this.pHtml(p + 1, pn, '<img src="img/pag_right.jpg">');
		};
		return re;
	};
	//显示非当前页
	pageNav.pHtml = function(pageNo, pn, showPageNo) {
		showPageNo = showPageNo || pageNo;
		var H = " <a href='javascript:pageNav.go(" + pageNo + "," + pn + ");' class='pageNum'>" + showPageNo + "</a> ";
		return H;

	};
	//显示当前页
	pageNav.pHtml2 = function(pageNo) {
		var H = " <span class='cPageNum'>" + pageNo + "</span> ";
		return H;
	};
	//输出页码,可根据需要重写此方法
	pageNav.go = function(p, pn) {
    var firstPage = '<a href="javascript:pageNav.go(1,'+pn+');" data-currpage="1" class="pageNum"><img src="img/pag_home.jpg"></a>';
    var lastPage = '<a href="javascript:pageNav.go('+pn+','+pn+');" data-currpage="'+pn+'" class="pageNum"><img src="img/pag_end.jpg"></a>';
    if(p==1){
        document.getElementById("pageNav").innerHTML = this.nav(p, pn) + lastPage;
    }else if(p==pn){
        document.getElementById("pageNav").innerHTML = firstPage + this.nav(p, pn) ;
    }else{
        document.getElementById("pageNav").innerHTML = firstPage + this.nav(p, pn) + lastPage;
    }
    
    if (this.fn != null) {
        this.fn(this.p, this.pn);
    };
};
	window.pageNav=pageNav;

	//return pageNav;
});


