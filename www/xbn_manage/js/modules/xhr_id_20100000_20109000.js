;
(function (X) {
    var suggest = X(),
        suggestCtrl = suggest.ctrl();

    var path = X.configer.__ROOT_PATH__ + X.configer.__FILE_HTML__,//模板地址 "http://tadmin.xbniao.com/template/"
        dataPath = X.configer.__OWMS_PATH__;//请求地址前缀 "http://tadmin.xbniao.com/owms"

    var request = suggest.utils.getRequest(),//{ m:"xhr_id_20100000_20101000",  page:"1"}
        operateData = X.getRolesObj.apply(null, request.m.split('_').slice(2));

    var perPage = 10;//列表每页显示10条记录

    suggestCtrl.view = {
        elem: "#id_conts",
        tpl: path + X.configer[request.m].tpl
    };

    //页面初次加载
    suggestCtrl.request({
        url: dataPath + X.configer[request.m].api.list,
        type: "post",
        data: JSON.stringify({
            limit: perPage,
            cpage: request.page || 1
        })
    }).then(function (data) {
        if (data.statusCode == '2000000') {
            data.data.operateData = operateData;
            suggestCtrl.render(data.data).then(function () {
                //下拉框
                sele();
                //模板局部渲染
                suggestCtrl.tirgger("suggestRender", data.data);
                // 表单校验加载
                suggestCtrl.tirgger("searchFormValid");
                // 分页渲染
                suggestCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                suggestCtrl.tirgger('pageRender', data.data);
            });
        } else {
            $("#listCon").html("<tr><td colspan='7' style='text-align:center'>" + X.getErrorName(data.statusCode, 'wareErr') + "</td></tr>");
        }
    });

    //模板局部渲染
    suggestCtrl.on('suggestRender', function (data) {
        $("#searchTotalCount").text(data.totalCount);
        // 数据列表渲染
        suggestCtrl.renderIn('#listTmpl', '#listCon', data);
        //触发页面dom事件
        suggestCtrl.tirgger('domEvents', "#id_conts");
    });

    suggestCtrl.on('domEvents', function (ele) {
        //搜索提交
        $('.js-search').off().on('click', function () {
            request.page = 1;
            $('#searchForm').submit();
        });
        //选择时间
        suggestCtrl.tirgger('pickDate');
        //等级处理
        var levels = [{color:'#8a8a8a',text: '一般'}, {color: '#f90', text: '重要'}, {color: '#f16161', text: '非常重要'}];

        $('.js-handle').off('click').on('click',function(){
            var gradeDom = $(this).siblings('.grade_show'),
                grades = $('a', gradeDom),
                tdDom = $(this).closest('td'),
                levelDom = $(this);

            gradeDom.removeClass('none');
            //意见处理
            grades.off('click').on('click',function () {
                var $this = $(this);
                if ($(this).hasClass('active')) {
                    suggestCtrl.tirgger('setTipsCommit', '当前已是' + $(this).text() + '级别，无需切换。');
                } else {
                    var levelNum = parseInt($(this).data('level'));
                    var sendData = {
                        id: tdDom.data('id'),
                        suggestLevel: levelNum,
                        dealResult: tdDom.data('dealresult')
                    };
                    suggestCtrl.request({
                        url: dataPath + X.configer[request.m].api.deal,
                        data: JSON.stringify(sendData),
                        type: 'post'
                    }).then(function (data) {
                        if (data.statusCode == '2000000') {
                            suggestCtrl.tirgger('setTipsCommit', '意见处理成功！', function () {
                                //给级别增加标记，避免重复提交
                                grades.removeClass('active');
                                $this.addClass('active');
                                //修改列表中的级别文字及对应的文字颜色
                                levelDom.text(levels[levelNum - 1].text).css('color', levels[levelNum - 1].color);
                            });
                        } else {
                            suggestCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
                        }
                    });
                }
            });
            gradeDom.mouseleave(function(){
                $(this).addClass('none');
            });
            return false;
        });
    });

    //表单验证
    suggestCtrl.on('searchFormValid', function () {
        // 表单验证
        $('#searchForm').html5Validate(function () {
            suggestCtrl.tirgger('searchSubmit', 1, function (data) {
                //列表渲染和事件触发
                suggestCtrl.tirgger('suggestRender', data);
                // 分页渲染
                suggestCtrl.renderIn('#pageListTmpl', '.page', data);
                // 分页加载
                suggestCtrl.tirgger('pageRender', data);
                //显示搜索结果
                $('#searchTotalCount').closest('em').removeClass('none');
            });
        }, {
            validate: function () {
                // 开始时间和结束时间的校验
                if ($('#createTime-start').text() && $('#createTime-end').text() == '') {
                    $('#createTime-end').testRemind("请选择创建结束时间");
                    return false;
                } else if ($('#createTime-start').text() == '' && $('#createTime-end').text()) {
                    $('#createTime-start').testRemind("请选择创建开始时间");
                    return false;
                } else if ($('#createTime-start').text() > $('#createTime-end').text()) {
                    $('#createTime-start').testRemind("开始时间不能大于结束时间");
                    return false;
                }
                return true;
            }
        });
    });

    // 分页加载
    suggestCtrl.on('pageRender', function (data) {
        var cPageNo = request.page,
            totalPages = data.totalPages;
        //分页组件
        Pager({
            topElem: "#topPager",
            elem: "#pager",
            defaultItem: cPageNo, //当前页码
            totalPages: totalPages //总页码
        }).then(function (p) {
            suggestCtrl.tirgger('searchSubmit', p, function (data) {
                suggest.router.setHistory("?m=" + request.m + "&page=" + p);
                suggestCtrl.tirgger("suggestRender", data);
                cPageNo = p;
            });
        });
    });

    // 列表搜索提交
    suggestCtrl.on('searchSubmit', function (toPageNo, callback) {
        var form = $('#searchForm');
        var sendData = {
            cpage: toPageNo,
            limit: perPage,
            callName: $('input[name=callName]', form).val(),
            email: $('input[name=email]', form).val(),
            telephone: $('input[name=telephone]', form).val(),
            isRead: parseInt($('input[name=isRead]', form).attr('index-data')),
            status: parseInt($('input[name=status]', form).attr('index-data')),
            suggestLevel: parseInt($('input[name=suggestLevel]', form).attr('index-data')),
            searchParamList: []
        };
        //创建时间
        if ($('#createTime-start').text().length) {
            sendData.searchParamList.push({
                key: 'createTime',
                operator: 'ge',
                value: $('#createTime-start').text()
            });
        }
        if ($('#createTime-end').text().length) {
            sendData.searchParamList.push({
                key: 'createTime',
                operator: 'le',
                value: $('#createTime-end').text()
            });
        }

        suggestCtrl.request({
            url: dataPath + X.configer[request.m].api.list,
            type: "post",
            data: JSON.stringify(sendData)
        }).then(function (data) {
            if (data.statusCode == '2000000') {
                data.data.operateData = operateData;
                callback && callback(data.data);
            } else {
                suggestCtrl.tirgger('setTipsCommit', X.getErrorName(data.statusCode, 'wareErr'));
            }
        });
    });

    // 提示消息弹框方法定义 ,只有确定按钮
    suggestCtrl.on('setTipsCommit', function (msg, callback) {
        if (!msg) return;
        $.layer({
            title: '提示消息',
            area: ['500px', ''],
            dialog: {
                msg: '<div class="tips">' + msg + '</div>',
                yes: function (index) {
                    layer.close(index);
                    callback && callback();
                }
            }
        })
    });

    // 提示消息弹框方法定义,有确定和取消按钮
    suggestCtrl.on('setTipsAsk', function (msg, callback) {
        if (!msg) return;
        $.layer({
            title: '提示消息',
            area: ['500px', ''],
            dialog: {
                btns: 2,
                btn: ['确定', '取消'],
                type: 8,
                msg: '<div class="tips">' + msg + '</div>',
                yes: function (index) {
                    layer.close(index);
                    callback && callback();
                },
                no: function (index) {
                    layer.close(index);
                }
            }
        })
    });

    //获取时间
    suggestCtrl.on('pickDate', function () {
        $(".timeStart").on("click", function () {
            var $this = $(this),
                elemId = $this.siblings('.dateInput').attr('id');
            //预计到货日期不需要时分秒
            var isTime = elemId.indexOf('expectedArrivalDate') == -1 ? true : false;
            laydate({
                istime: isTime,
                elem: '#' + elemId,
                event: 'focus',
                format: isTime ? 'YYYY-MM-DD hh:mm:ss' : 'YYYY-MM-DD'
            });
        });
        $(".timeEnd").on("click", function () {
            var $this = $(this),
                elemId = $this.siblings('.dateInput').attr('id');
            //预计到货日期不需要时分秒
            var isTime = elemId.indexOf('expectedArrivalDate') == -1 ? true : false;
            laydate({
                istime: isTime,
                elem: '#' + elemId,
                event: 'focus',
                format: isTime ? 'YYYY-MM-DD hh:mm:ss' : 'YYYY-MM-DD'
            });
        });
    });
})(mXbn);
