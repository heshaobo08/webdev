/**
 * 通用功能库
 * author yangweichao
 * **/
define(['jquery','routeService','timepicker' ],function($,routeService,timepicker){
    var returnObj={};
	//时间插件
	//级联日历控件 HH:mm:ss
    returnObj.relationCal = function (start, end) { //start是起始日历id,end是结束日历id
        //本地化
        var myControl = {
            create: function (tp_inst, obj, unit, val, min, max, step) {
                $('<input class="ui-timepicker-input" value="' + val + '" style="width:50%">')
                    .appendTo(obj)
                    .spinner({
                        min: min,
                        max: max,
                        step: step,
                        numberFormat: "n",
                        change: function (e, ui) { // key events
                            // don't call if api was used and not key press
                            if (e.originalEvent !== undefined)
                                tp_inst._onTimeChange();
                            //tp_inst._onSelectHandler();
                        },
                        spin: function (e, ui) { // spin events
                            tp_inst.control.value(tp_inst, obj, unit, ui.value);
                            tp_inst._onTimeChange();
                            tp_inst._onSelectHandler();
                        }
                    });
                return obj;
            },
            options: function (tp_inst, obj, unit, opts, val) {
                if (typeof (opts) == 'string' && val !== undefined)
                    return obj.find('.ui-timepicker-input').spinner(opts, val);
                return obj.find('.ui-timepicker-input').spinner(opts);
            },
            value: function (tp_inst, obj, unit, val) {
                if (val !== undefined)
                    return obj.find('.ui-timepicker-input').spinner('value', val);
                return obj.find('.ui-timepicker-input').spinner('value');
            }
        };

        $.timepicker.regional['zh-CN'] = {
            timeOnlyTitle: '选择时间',
            timeText: '时间',
            hourText: '时',
            minuteText: '分',
            secondText: '秒',
            millisecText: '毫秒',
            microsecText: '微秒',
            timezoneText: '时区',
            currentText: '现在时间',
            closeText: '关闭',
            timeFormat: 'HH:mm:ss',
            amNames: ['AM', 'A'],
            pmNames: ['PM', 'P'],
            isRTL: false,
            showOn: "both",
            buttonImage: "img/ac_time_ioc.jpg",
            buttonImageOnly: true,
            showAnim: "toggle",
            controlType: myControl
        };
        $.timepicker.setDefaults($.timepicker.regional['zh-CN']);

        //范围
        var argLen = arguments.length;
        if (argLen === 3) {
            var startDateText3 = $('#' + start),
                endDateText3 = $('#' + end);
            startDateText3.datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: function (startDate) {
                    var $startDate = startDateText3;
                    var $endDate = endDateText3;
                    var endDate = $endDate.datepicker('getDate');
                    if (endDate < startDate) {
                        $endDate.datepicker('setDate', startDate - 3600 * 1000 * 24);
                    }
                    $endDate.datepicker("option", "minDate", startDate);
                }
            });
            endDateText3.datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: function (endDate) {
                    var $startDate = startDateText3;
                    var $endDate = endDateText3;
                    var startDate = $startDate.datepicker("getDate");
                    if (endDate < startDate) {
                        $startDate.datepicker('setDate', startDate + 3600 * 1000 * 24);
                    }
                    $startDate.datepicker("option", "maxDate", endDate);
                }
            });
        }
		  if (argLen == 4) {
            if (typeof arguments[1] == "boolean") {
                var startDateTextBox = $('#' + start);
                $.timepicker.regional['zh-CN'] = {
                    maxDateTime: new Date()
                };
                startDateTextBox.datetimepicker($.timepicker.regional['zh-CN']);
            }else {
                var startDateTextBox = $('#' + start),
                    endDateTextBox = $('#' + end);
                startDateTextBox.datetimepicker({
                    timeFormat: 'HH:mm:ss',
					minDate: 0,
                    showMinute: true,
                    showSecond: true,
                    onClose: function (dateText, inst) {

                        if (endDateTextBox.val() != '') {
                            var startDate = startDateTextBox.datetimepicker('getDate');
                            var endDate = endDateTextBox.datetimepicker('getDate');
                            if (startDate > endDate) {
                                endDateTextBox.datetimepicker('setDate', startDate);
                            }
                        } else {
                            endDateTextBox.val(dateText);
                        }

                    },
                    onSelect: function (selectedDateTime) {
                        endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate'));
                    }
                });
                endDateTextBox.datetimepicker({
                    timeFormat: 'HH:mm:ss',
					minDate: 0,
                    showMinute: true,
                    showSecond: true,
                    onClose: function (dateText, inst) {
                        if (startDateTextBox.val() != '') {
                            var startDate = startDateTextBox.datetimepicker('getDate');
                            var endDate = endDateTextBox.datetimepicker('getDate');
                            if (startDate > endDate)
                                startDateTextBox.datetimepicker('setDate', endDate);
                        } else {
                            startDateTextBox.val(dateText);
                        }
                    },
                    onSelect: function (selectedDateTime) {
                        startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate'));
                    }
                });
            }
        }
        if (argLen == 2) {
            if (typeof arguments[1] == "boolean") {
                var startDateTextBox = $('#' + start);
                $.timepicker.regional['zh-CN'] = {
                    maxDateTime: new Date()
                };
                startDateTextBox.datetimepicker($.timepicker.regional['zh-CN']);
            }else {
                var startDateTextBox = $('#' + start),
                    endDateTextBox = $('#' + end);
                startDateTextBox.datetimepicker({
                    timeFormat: 'HH:mm:ss',
                    showMinute: true,
                    showSecond: true,
                    onClose: function (dateText, inst) {

                        if (endDateTextBox.val() != '') {
                            var startDate = startDateTextBox.datetimepicker('getDate');
                            var endDate = endDateTextBox.datetimepicker('getDate');
                            if (startDate > endDate) {
                                endDateTextBox.datetimepicker('setDate', startDate);
                            }
                        } else {
                            endDateTextBox.val(dateText);
                        }

                    },
                    onSelect: function (selectedDateTime) {
                        endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate'));
                    }
                });
                endDateTextBox.datetimepicker({
                    timeFormat: 'HH:mm:ss',
                    showMinute: true,
                    showSecond: true,
                    onClose: function (dateText, inst) {
                        if (startDateTextBox.val() != '') {
                            var startDate = startDateTextBox.datetimepicker('getDate');
                            var endDate = endDateTextBox.datetimepicker('getDate');
                            if (startDate > endDate)
                                startDateTextBox.datetimepicker('setDate', endDate);
                        } else {
                            startDateTextBox.val(dateText);
                        }
                    },
                    onSelect: function (selectedDateTime) {
                        startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate'));
                    }
                });
            }
        } else if (argLen == 1) {
            var startDateTextBox = $('#' + start);
            startDateTextBox.datetimepicker();
        }
	
    };
    
    //产品下拉列表
    returnObj.proSelectList=function(p_id){
    	routeService.getProduct(p_id).then(function(data){
    		var proStr = '<option value="0">全部</option>';
			$.each(data.list, function (key, item) {
                if (p_id == item.id) {
                	proStr += '<option value="'+item.id+'" selected="selected">'+item.name+'</option>';
                } else {
                    proStr += '<option value="'+item.id+'">'+item.name+'</option>';
                }
            });
			$("#pro_select").html("");
			$("#pro_select").append(proStr);
    	});
    }
    
  //弹出删除框函数
    returnObj.detail_end = function(text,fn,h,_index,load,cover){
		
		$('#cover').show();
		$('#cover').height($(document).height());
		$('.coverCon').eq(_index).show();
		$('.coverCon').eq(_index).css('top',($(window).height() -161)/2 + $(window).scrollTop()+'px');
		$('.coverCon').eq(_index).css('left',($(window).width() -437)/2 + $(window).scrollLeft()+'px');
		$('.coverCon').eq(_index).find(".ac_prompt").html(text);
		$(".coverConTitle span").html(h);
		$('.coverCon').eq(_index).find('.coverSure').off('click').on('click',function(){

			$('#cover').hide();
			$('.coverCon').eq(_index).hide();
			fn && fn();

		});
			
		$('.coverCon').eq(_index).find('.coverDel').off('click').on('click',function(){
			if(load != 0){
				location.reload();
			}
			if(cover !=0){
				$('#cover').hide();
			}
			$('.coverCon').eq(_index).hide();
			
		});

	};
	
    return returnObj;

});