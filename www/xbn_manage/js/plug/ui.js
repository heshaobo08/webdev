var Ui = function(){};

Ui.prototype = {};

var ui = new Ui();

//交互1：幻灯片
(function (){
	var defaultOptions = {
		index: 0,
		box: '.slideContent',
		imgBox: '.slide',
		prevBtn: '.prevBtn',
		nextBtn: '.nextBtn',
		dotBtn: '.dotBtn',
		circle: false,
		btnType: 'both', //both, dot, triangle
		autoPlay: false,
		time: 0
	};

	var Slide = function (options){
		if (!(this instanceof Slide))
			return new Slide(options);
		this.init(options);
	};

	Slide.prototype = {
		init: function(options){
			this.options = $.extend({}, defaultOptions, options, true);
			this.resize();
			this.num = this.options.index;
			this.box = $(this.options.box);
			this.slide = $(this.options.imgBox);
			this.image = this.slide.children();
			this.dot = $(this.options.dotBtn);
			this.timming = this.options.time;

			var arrayImg = [];
			var self = this;
			this.image.each(function(i,elem){
				arrayImg.push($(elem).children().attr("src"));
			})
			var list = arrayImg,    //此处省略一万个字符
				imgs = [];
			$.when(preloadImg(list, imgs)).done(
				function() {
					//预加载结束
					self.play(this.num);
				}
			);

			var self = this,
				prevBtn = this.box.find(this.options.prevBtn),
				nextBtn = this.box.find(this.options.nextBtn),
				dotBtn = this.box.find(this.options.dotBtn);

			this.dot.eq(this.num).addClass("active");

			eventHandly(prevBtn, "click", function(){
				self.moveLeft();
				self.css();
			});

			eventHandly(nextBtn, "click", function(){
				self.moveRight();
				self.css();
			});

			eventHandly(this.box, "mouseenter", function(){
				clearInterval(self.timming);
			});

			eventHandly(this.box, 'mouseleave', function () {
				self.play();
			});

			eventHandly(dotBtn, "click", function(){
				self.num = $(this).index();

				self.slide.prepend(self.image.eq(self.num));
				self.play(self.num);
				self.css();
			});
		},
		resize: function(){

		},
		moveLeft: function(){
			if (this.num <= 0) {
				this.play(this.image.length-1);
				this.num = this.image.length-1;
			}else{
				--this.num;
				this.play(this.num);
			}
		},
		moveRight: function(){
			if (this.num >= this.image.length - 1) {
				this.num = 0;
				this.play(this.num);
			}else{
				this.play(this.num+1);
				++this.num;
			}
		},
		play:function(index){
			var imgW = this.image.outerWidth();
			var num = index ? index : this.num;

			this.box.width(imgW);
			this.image.eq(num).show();
			this.image.eq(num).siblings().hide();

			if(this.options.autoPlay){
				this.autoPlay(num);
			}

			var self = this;
			this.dot.removeClass("active");
			this.dot.eq(num).addClass("active");


		},
		autoPlay: function(){
			var self = this;

			clearInterval(this.timming);

			this.timming = setInterval(function(){
				if (self.num >= self.image.length - 1) {
					self.num = 0;
					self.play(self.num);
				}else{
					++self.num;
					self.play(self.num);
				}
			}, this.options.time*1000);
		},
		css: function(){
			var self = this;
			var currentImg = self.image.eq(self.num);

			currentImg.stop().animate({"opacity":0.3},300,function(){
				currentImg.stop().animate({"opacity":1},500);
			});
		}
	};


	this.slide = function(options){
		return new Slide(options);
	};

	function preloadImg(list,imgs) {
		var def = $.Deferred(),
			len = list.length;
		$(list).each(function(i,e) {
			var img = new Image();
			img.src = e;
			if(img.complete) {
				imgs[i] = img;
				len--;
				if(len == 0) {
					def.resolve();
				}
			}
			else {
				img.onload = (function(j) {
					return function() {
						imgs[j] = img;
						len--;
						if(len == 0) {
							def.resolve();
						}
					};
				})(i);
				img.onerror = function() {
					len--;
					console.log('fail to load image');
				};
			}
		});
		return def.promise();
	}

}).call(ui);

//交互2：浮层
(function(){
	var defaultOptions = {
		trigger:".trigger",
		objective:".objective",
		event:"click",//click, mouseover mouseout
		playType:"slide" //slide, fade, 默认不传(on-off)
	};
	var Floating = function(options){
		if(!this instanceof Floating)
			new Floating(options);

		this.init(options);
	};

	Floating.prototype = {
		init: function(options){
			var self = this;
			this.options = $.extend({},defaultOptions,options,true);
			this.trigger = $(this.options.trigger);
			this.object = this.options.objective;
			this.animateType = this.options.playType;
			this.event = this.options.event;

			eventHandly(this.trigger,this.event,function(){
				self.animates(self.animateType);
			});


		},
		animates: function(type){
			var obj = $(this.object).stop();
			switch (type){
				case "slide":
					obj.slideToggle();
					break;
				case "fade":
					obj.fadeToggle();
					break;
				default :
					obj.toggle();
					break;
			}
		}
	};

	this.floating = function(options){
		return new Floating(options);
	}

}).call(ui);

//交互3：排序
(function(){
	var defaultOptions = {
		showClass: ".showClass",
		index: "1",
		indexSet: "0"
	};

	var Counts = function(options){
		if(! this instanceof Counts)
			new Counts();

		this.init(options);
	};

	Counts.prototype = {
		init: function(options){
			this.options = $.extend({},defaultOptions,options,true);
			this.showClass = $(this.options.showClass);
			this.index = this.options.index;
			this.defaultIndex = this.options.indexSet;
			this.count();
		},
		count: function(){
			var self = this,
				num = Number(this.index),
				countList = "",
				len = this.defaultIndex.length;

			this.showClass.each(function(index){
				if(num>=1000){
					countList = num;
				}else if(num>=100){
					countList = self.defaultIndex.substr(0,len-2) + num;
				}else if(num>=10){
					countList = self.defaultIndex.substr(0,len-1) + num;
				}else{
					countList = self.defaultIndex + num;
				}

				self.showClass.eq(index).text(countList);
				num ++;
			})
		}
	};

	this.countList = function(options){
		return new Counts(options);
	}
}).call(ui);

//交互4：滑动列表文本
(function(){
	var defaultOptions = {
		defWidth: "18", //默认宽度
		defColor: "#999",//默认背景颜色
		actColor: "#332f2b",//被选中的颜色
		objective: ".slideList li"//要执行交互的对象
	};

	var Slidelist = function(options){
		if(! this instanceof Slidelist)
			new Slidelist(options);

		this.init(options);
	};

	Slidelist.prototype = {
		init: function(options){
			var self = this;
			this.options = $.extend({},defaultOptions,options,true);
			this.object = $(this.options.objective);
			this.width = this.options.defWidth;
			this.defaultColor = this.options.defColor;
			this.activeColor = this.options.actColor;
			this.object.width(this.width);

			eventHandly(self.object,"mouseenter",function(){
				self.closeSlide();
				self.openSlide($(this));
			});

			//点击空白处
			blankEvent(function(_this){
				var _parent = _this.parent();
				if(_this.parents(self.options.objective).length > 0){
					self.animates(self.object.not(_parent),{
						width: self.width,
						backgroundColor: self.defaultColor
					});
				}else{
					self.closeSlide(self.object.not(".disable"));
				}

			});
		},

		checkSlide: function(options){
			var obj = $(options.object);

			if(options.check.is(":checked")){
				this.openSlide(obj);
				obj.addClass("disable");
			}else{
				this.closeSlide();
				obj.removeClass("disable");
			}
		},

		openSlide: function(_this){
			var objW = _this.find("a")[0].scrollWidth+5;
			this.animates(_this,{
				width: objW,
				backgroundColor: this.activeColor
			});
		},

		closeSlide: function(){
			this.animates(this.object.not(".disable"),{
				width: this.width,
				backgroundColor: this.defaultColor
			});
		},

		animates: function(elem,par){
			elem.stop().animate(par);
		}
	};

	this.slideList = function(options){
		return new Slidelist(options);
	};

}).call(ui);

//交互5：模拟radio
(function(){
	var defaultOptions = {
		checkObject: "",
		checkName: "active",
		selected: function(){}
	};

	var Radioselect = function(options){
		if(! this instanceof Radioselect)
			new Radioselect(options);

		this.init(options);
	};

	Radioselect.prototype = {
		init: function(options){
			this.options = $.extend({},defaultOptions,options,true);
			this.object = $(this.options.checkObject);
			this.name = this.options.checkName;
			this.fn = this.options.selected;

			var self = this;

			eventHandly(this.object,"click",function(){
				self.object.removeClass(self.name);
				$(this).addClass(self.name);
				self.fn.call(this);
			});
		}
	};

	this.radioSelect = function(options){
		new Radioselect(options);
	}
}).call(ui);

//交互6：加减法
(function(){
	var defaultOptions = {
		minus: ".js-minus",
		plus: ".js-plus",
		count: ".js-input",
		min:"1",
		max:"10",
		countSet: false,
		maxSet:false
	};

	var CountNumber = function(options){
		if(! this instanceof CountNumber)
			new CountNumber(options);
		this.init(options);
	};

	CountNumber.prototype = {
		init: function(options){
			var self = this;
			this.options = $.extend({},defaultOptions,options,true);
			this.minus = $(this.options.minus);
			this.plus = $(this.options.plus);
			this.count = $(this.options.count);
			this.min = this.options.min;
			this.max = this.options.max;
			this.countSet = this.options.countSet;
			this.maxSet = this.options.maxSet;
			this.dataMax = this.options.dataMax;//是否有数据最大值
			this.stopClass = "noMove";
			this.callback= this.options.callback;
			this.setting();

			this.minus.addClass(this.stopClass);

			eventHandly(this.minus,"click",function(){
				var _total = $(this).siblings(self.options.count);
				self.subtraction(_total);
				//执行回调函数
				self.callback && self.callback();
			});
			eventHandly(this.plus,"click",function(){
				var _total = $(this).siblings(self.options.count);
				self.addition(_total,$(this));
				//执行回调函数
				self.callback && self.callback();
			});

		},

		/*执行减法操作*/
		subtraction: function(_this){
			var num = Number(_this.val());
			var minus = _this.siblings(this.options.minus);

			if(num > this.min)
				_this.val(--num);


			if(num == this.min)
				minus.addClass(this.stopClass);

		},

		/*执行加法操作*/
		addition: function(_this,that){
			var num = Number(_this.val());
			var minus = _this.siblings(this.options.minus);
			if(this.dataMax){//存在数据最大值将最大值赋值为数据最大值
				this.max = that.prev().data("max");
			}
			if(this.maxSet){
				if(num < this.max)
					_this.val(++num);
			}else{
				_this.val(++num);
			}
			minus.removeClass(this.stopClass);
		},

		/*执行默认操作*/
		setting: function(){
			var self = this;
			//对输入框进行默认设置
			this.count.each(function(){
				var onoff=/^[1-9]\d*$/.test($(this).val());
				if(!$(this).val() || !onoff){
					$(this).val(self.min);
				}
			});
			//this.count.val(this.min);

			//开启输入框操作
			if(this.countSet)
				{
					this.count.attr("disabled",false);

					eventHandly(this.count,"blur",function(){
						var num = Number($(this).val());
						if(self.dataMax){//存在数据最大值将最大值赋值为数据最大值
							self.max = $(this).data("max");
						}

						if(num < self.min) //小于最小值
							{
								var minus = self.options.minus;
								var plus = self.options.plus;

								$(this).val(self.min);
								$(minus).addClass(self.stopClass);
								$(plus).addClass(self.stopClass);
							}
						else if(num > self.max && self.maxSet) //开启最大值设置
							{
								$(this).val(self.max);
							}
						else if(num > self.min && !self.maxSet) //禁止最大值设置（无限大）
							{
								var minus = self.options.minus;
								var plus = self.options.plus;
								var onoff=/^[1-9]\d*$/.test($(this).val());
								if(onoff){
									$(this).val(num);
								}else{
									$(this).val($(this).val().split(".")[0]);
								}

								$(minus).removeClass(self.stopClass);

							}
						else
							{
								var minus = self.options.minus;
								var plus = self.options.plus;
								var onoff=/^[1-9]\d*$/.test($(this).val());
								if(onoff){
									$(this).val(num);
								}else{
									$(this).val($(this).val().split(".")[0]);
								}
								//$(this).val(self.min);
								$(minus).addClass(self.stopClass);
								$(plus).addClass(self.stopClass);
							}
					});
				}
			//禁止输入框操作
			else
				{
					this.count.attr("disabled",true);
				}
		}
	};

	this.countNumber = function(options){
		new CountNumber(options);
	}

}).call(ui);

//交互7：滑层
(function(){
	var defaultOptions = {
		text: "	至少选择一条信息！",
		playTo: "0",
		objective: ".divLayer",
		trigger:".js-down",
		time: "3",
		timeSet: true,
		button: ["确定","取消"],
		buttonSet: false,
		ok: function(callback){
			callback();
		},
		no: function(){}
	};

	var SlideLayer = function(options){
		if(! this instanceof SlideLayer)
			new SlideLayer;

		this.init(options);
	};

	SlideLayer.prototype = {
		init : function(options){
			var self = this;
			this.options = $.extend({},defaultOptions,options,true);
			this.text = this.options.text;
			this.to = this.options.playTo;
			this.objective = $(this.options.objective);
			this.trigger = $(this.options.trigger);
			this.time = this.options.time;
			this.timeSet = this.options.timeSet;
			this.button = this.options.button;
			this.buttonSet = this.options.buttonSet;
			this.ok = this.options.ok;
			this.no = this.options.no;

			eventHandly(this.trigger,"click",function(){
				self.addLayer($(this));
			});
		},

		/*新增层*/
		addLayer: function(_this){
			$(".tipLayer").remove();

			var self = this,
				layer = "", //浮层对象
				button = "", //按钮
				layerContent = "", //显示内容区域
				layerHtml = "", //浮层html
				layerParent="", //浮层父级
				css = this.to == "0" ? "tLayer" : "rLayer";


			if(this.buttonSet){
				for(arr in this.button){
					var butClass = arr == 0 ? 'ok' : 'no';
					button += "<a href='javascript:;' class='js-"+butClass+"'>"+this.button[arr]+"</a>";
				}
				button = "<div class='layerBtn'>" + button + "</div>";
			}

			layerContent = "<div class='layerCont'>" + this.text + button + "</div>";
			layerHtml = "<div class='tipLayer none "+ css +"'>" + layerContent + "</div>";
			layerParent = _this.parent(this.objective);
			layerParent.append(layerHtml);
			layer = layerParent.find(".tipLayer");

			this.tipHandle(layer);

			switch (this.to){
				case "0":
					layer.stop().slideDown();
					break;
				case "1":
					layer.show().css("width","0");
					layer.stop().animate({width: layerParent.outerWidth()+50});
					break;
			}



		},

		/*移除层*/
		removeLayer: function(_this,towards){
			switch (towards){
				case "0":
					_this.slideUp();
					break;
				case "1":
					_this.animate({width:0},function(){
						_this.remove();
					});
					break;
				default :
					//删掉一整行的记录（如果刷新页面就没必要这么写了 ）
					_this.closest("tr").remove();
					break;
			}
		},

		/*层交互*/
		tipHandle: function(obj){
			var self = this;
			eventHandly($(".js-ok"),"click",function(){
				self.ok(function(){
					self.removeLayer(obj);
				});
			});
			eventHandly($(".js-no"),"click",function(){
				self.removeLayer(obj,self.to);
				self.no.call(this);
			});
			if(this.timeSet){
				var interval = setInterval(function(){
					self.removeLayer(obj,self.to);
					clearInterval(interval);
				}, self.time*1000);
			}
		}
	};

	this.slideLayler = function(options){
		new SlideLayer(options);
	}
}).call(ui);

//交互8：替换提示信息
(function(){
	var defaultOptions = {
		text: "	至少选择一条信息！",
		objective: ".layerCont",
		trigger:".js-ok",
		time: "3",
		playTo: "1"
	};

	var Changelayler = function(options){
		if(! this instanceof Changelayler)
			new Changelayler;

		this.init(options);
	};

	Changelayler.prototype = {
		init : function(options){

			var self = this;
			this.options = $.extend({},defaultOptions,options,true);
			this.text = this.options.text;
			this.objective = $(this.options.objective);
			this.time = this.options.time;
			this.to = this.options.playTo;
			this.changeText();
		},

		/*替换层*/
		changeText: function(){
			var self = this;

			this.objective.html(this.text);

			var interval = setInterval(function(){
				self.removeLayer(self.to);
				clearInterval(interval);
			}, self.time*1000);

		},

		/*移除层*/
		removeLayer: function(towards){
			switch (towards){
				case "0":
					$(".tipLayer").slideUp();
					break;
				case "1":
					$(".tipLayer").stop().animate({width:0},function(){
						$(".tipLayer").remove();
					});
					break;
			}
		}
	};

	this.changeLayler = function(options){
		new Changelayler(options);
	}
}).call(ui);


/*共用方法*/

//触发事件
function eventHandly(elem,events,fn){
	elem.off().on(events,function(){
		fn.call(this);
	});
}

//空白触发
function blankEvent(fn){
	$(document).off().on("click",function(e){
		fn($(e.target));
	});
}
