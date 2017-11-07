;
(function (win, X) {



	var pro = X.prototype;


	var Router = function (uri) {

		this.init = function () {

			this.runCallback();

			//初始Histor变化监听器
			this.onPopstate();
		};

		this.setHistory = function (uri, title) {

			var doc_title = document.title;

			title ? document.title = title : document.title = doc_title;

			win.history.pushState(null, "", uri);
		};

		this.onPopstate = function () {

			var _that = this;

			$(win).on("popstate", function (event) {

				var event = event.originalEvent.state;

				_that.callback(pro.utils.getRequest());

			});
		};

		this.runCallback = function () {
			//外部回调函数，调用时需要为Router类动态添加实例属性Callback
			(this.callback && this.callback(pro.utils.getRequest()));
		};
	};

	Router.prototype = pro.utils.inhert(pro);

	pro.router = new Router(pro.utils.getRequest());

})(window, mXbn);
