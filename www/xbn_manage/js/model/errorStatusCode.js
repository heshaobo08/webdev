;
(function (X) {

    X.errorStauts = {
        '2000000': '请求成功',
        '1000500': '后台发生异常',
        '3000403': '请求被拒绝，无权限或者未登录',
        '2010000': '会员中心业务请求参数错误',
        '2010001': '会员基础信息异常',
        '2010002': '会员登录错误',
        '2010003': '禁用会员失败（只能禁用已冻结的会员）',
        '2010004': '用户角色等级错误',
        '2010005': '用户不存在',
        '2010006': '用户已存在',
        '2010101': '企业基础信息接口错误',
        '2010102': '更新会员状态失败',
        '2010103': '发送短信提醒失败',
        '2010104': '企业信息已经存在',
        '2010105': '企业银行信息接口错误',
        '2010106': '企业信息审核失败',
        '2010107': '企业目前状态不允许被修改',
        '2010108': '企业创建商品默认分组失败',
        '2010109': '获取企业信息失败',
        '2010301': '品牌资质接口错误',
        '2010302': '获取品牌资质信息失败',
        '2010303': '操作的品牌资质审核状态不正确，只能是通过/驳回（2/3）',
        '2010304': '当前品牌状态不允许操作',
        '2010305': '审核失败',
        '2010306': '冻结失败',
        '2010307': '解冻失败',
        '2010401': '其他资质接口错误',
        '20201': '商品服务-商品批量导入',
        '20202': '商品服务-商品刊登',
        '20203': '商品服务-商品列表',
        '2020101': '商品批量导入校验数据错误',
        '2020102': '商品批量导入下载Excel表格错误',
        '2020103': '商品批量导入上传表格错误',
        '2020104': '商品批量导入上传表格表格结构被修改',
        '2020105': '商品批量导入上传表格表格数据为空',
        '2020201': '商品数据错误',
        '2020202': '商品数据不完整',
        '2020203': '商品主规格重复',
        '2020204': '商品规格组合重复',
        '2020205': '商品规格数据有误',
        '2020206': '商品规格所有库存为0',
        '2020207': '商品从数据错误',
        '2020208': '商品操作类型错误',
        '2020209': '商品禁止操作',
        '2020210': '商品获取异常',
        '2020211': '商品审核定时数据错误',
        '2020212': '商品草稿超限',
        '2020231': '商品分组名称重复',
        '2020251': '商品定时规则数据错误',
        '2020314': '主商品列表异常',
        '2020314': '主商品列表异常',
        '2020315': 'ebay下线商品列表异常',
        '2020316': 'ebay在线商品列表异常',
        '2020317': 'ebay刊登审核商品列表异常',
        '2020318': 'ebay编辑审核商品列表异常',
        '2020315': 'ebay下线商品详情异常',
        '2020316': 'ebay在线商品详情异常',
        '2020317': 'ebay刊登审核商品详情异常',
        '2020318': 'ebay编辑审核商品详情异常',
        '2020319': 'AMAZON下线商品列表异常',
        '2020320': 'AMAZON在线商品列表异常',
        '2020321': 'AMAZON刊登审核商品列表异常',
        '2020322': 'AMAZON编辑审核商品列表异常',
        '2020323': 'AMAZON下线商品详情异常',
        '2020324': 'AMAZON在线商品详情异常',
        '2020325': 'AMAZON刊登审核商品详情异常',
        '2020326': 'AMAZON编辑审核商品详情异常',
        '2020327': 'NEWEGG下线商品列表异常',
        '2020328': 'NEWEGG在线商品列表异常',
        '2020329': 'NEWEGG刊登审核商品列表',
        '2020330': 'NEWEGG编辑审核商品列表异常',
        '2020331': 'NEWEGG下线商品详情异常',
        '2020332': 'NEWEGG在线商品详情异常',
        '2020333': 'NEWEGG刊登审核商品详情异常',
        '2020334': 'NEWEGG编辑审核商品详情异常',
        '2020335': '小笨鸟用户名查询条件（精确查询）输入错误',
        '2020336': '小笨鸟id输入错误',
        '2020340': '站点商品列表状态异常',
        '2050101': '参数异常，我的银行卡，银行账户状态错误',
        '2050102': '当前新增的银行卡已经存在于系统中',
        '2050103': '最多只能新增5张银行卡',
        '2050104': '新增银行卡发生异常',
        '2050105': '更新银行卡发生异常',
        '2050106': '删除银行卡发生异常',
        '2050107': '获取账单列表发生异常',
        '2050108': '获取提现历史记录发生异常',
        '2050109': '获取账单流水详情发生异常',
        '2050110': '获取我购买的服务历史记录发生异常',
        '2050111': '获取增值服务列表发生异常',
        '2050112': '保存订单信息发生异常',
        '2050113': '保存提现信息发生异常',
        '2050114': '新增促销商品名称重复',
        '2050115': '新增促销每个角色在同一时间只可以添加一种折扣率',
        '2030001': '参数异常，参数超出限定长度，具体可查看data信息',
        '2030002': '参数异常，订单号不合法',
        '2030003': '参数异常，订单商品ID不合法',
        '2030004': '参数异常，日期格式不合法',
        '2030101': '立即发货，未选择要发货订单商品',
        '2030103': '参数异常，未选择物流服务商',
        '2030104': '参数异常，参数不能为空（具体参数可见返回值）',
        '2030105': '订单导出异常，导出的列表为空',
        '2030106': '参数异常，上传请求中未包含文件（该请求可能需要一个文件流）',
        '2030201': '订单不符合合并发货条件，无法进行合并发货',
        '2030301': '与之前发货申请跟踪号相同返回状态',
        '2030302': '部分申请过跟踪号返回状态',
        '2030303': '有该订单的该商品没有申请',
        '2030304': '没有该订单得申请',
        '2030305': '确认发货失败',
        '2030306': '确认发货调订单发货异常',
        '2030307': 'apac发货国家异',
        '2030308': 'apac发货地地区异常',
        '2030309': 'apac揽收地区异常',
        '2030310': '合并发货sellerId不同',
        '2030311': '合并发货订单所属平台不同',
        '2040101': '上传图片发生异常',
        '2040102': '上传图片超出最大限制异常',
        '2040103': '图片类型异常',
        '2040201': '上传发生异常',
        '2040202': '上传文件超出最大限制异常',
        '2040203': '文件类型异常',
        '2040203': '未找到删除文件',
        '2040204': '文件ID 不合法',
        '2040205': '网络上传URL不合法',
        '2040206': '参数不能为空',
        '2040207': '默认相册不能删除',
        '2040208': '相册ID 不合法',
        '2040209': '图片存在关联，无法删除',
        '2080101': '创建发送地址模板异常',
        '2080102': '编辑发送地址模板异常',
        '2080103': '显示发送地址模板列表异常',
        '2080104': '删除发送地址模板异常',
        '2080105': '显示发送地址模板信息异常',
        '2080106': '创建消息模板异常',
        '2080107': '编辑消息模板异常',
        '2080108': '显示消息模板列表异常',
        '2080109': '删除消息模板异常',
        '2080110': '显示消息模板信息异常',
        '2080111': '创建运费模板异常',
        '2080112': '编辑运费模板异常',
        '2080113': '显示运费模板列表异常',
        '2080114': '删除运费模板异常',
        '2080115': '显示运费模板信息异常',
        '2080116': '创建消息模板同名异常',
        '2080117': '模板关联商品异常',
        '2090001': '创建站点失败',
        '2090002': '获取站点信息失败',
        '2090003': '更新站点信息失败',
        '2090004': '禁用站点失败',
        '2090005': '启用站点失败',
        '2090006': '获取站点列表失败',
        '2090101': '品牌资质接口错误',
        '2090102': '获取站点授权列表失败',
        '2090103': '删除站点授权失败',
        '2090201': '保存违禁词失败',
        '2090202': '编辑例外用户失败',
        '2090203': '获取违禁词失败',
        '2090204': '更新失败',
        '2090205': '删除违禁词失败',
        '2090301': '增加物流公司管理失败',
        '2090302': '更新物流公司管理失败',
        '2090203': '删除物流公司管理失败',
        '2090304': '获取物流公司管理失败',
        '2090401': '获取退货政策失败',
        '2090402': '更新退货政策失败',
        '2100101': '获取在线商品站点分布失败',
        '2100102': '获取在线商品参数错误',
        '2100103': '获取在线商品参数不能为空',
        '2100201': '获取订单统计信息失败',
        '2100301': '获取商品统计信息失败',
        '2100401': '获取用户购买服务失败',
        '2100501': '获取用户财务信息失败',
        '2100601': '获取用户消息列表服务失败',
        '20203189': '商品分组不允许删除',
        '20203190': '商品分组参数传递错误',
        '20203191': '商品分组未找到',
        '20203193': '另一商品id未找到',
        '20203192': '商品分组处理出现异常',
        '20203194': '商品分组添加出现异常',
        '20203195': '获取默认分组出现异常',
        '20203196': '商品分组名称不能重复',
        '203010101': '站内信查询参数错误',
        '203010102': '站内信处理失败',
        '204010101': 'UPC检测失败'
    };

    //海外仓错误代码集合
    X.errorStauts.wareErr = {
        "-1":"海外仓业务暂未开通",
        "3000403":"登录超时，请重新登录",
        "-3":"验证失败",
        "0000000":"操作成功",
        "1111111":"系统繁忙",
        "2222222":"非空为空",
        "3333333":"格式错误",
        "4444444":"未知的导入错误",
        "5555555":"文件重复导入",
        "6666666":"文件格式错误",
        "7777777":"申报名称不能包含如下词汇：gift,accessory,accessories,part,cloths,tools,toy,stationery",
        "0000001":"货品增加成功",
        "0000002":"货品信息为空",
        "0000003":"货品sku已经存在",
        "0000004":"不能删除已加入收货预报或发货单的货品",
        "0000005":"不能删除已加入收货预报或发货单的货品",
        "0000006":"货品库存编码已存在",
        "0000007":"货品SKU不允许修改",
        "0000008":"货品库存编码不允许修改",
        "0000009":"货品长度不能超过9999.9",
        "0000010":"货品宽度不能超过9999.9",
        "0000011":"货品高度不能超过9999.9",
        "0000012":"货品重量不能超过9999.999千克",
        "0000013":"货品不存在，请核对您添加的货品",
        "1000001":"条码数据格式错误",
        "1000002":"无条码数据",
        "1000003":"获取条码模板失败",
        "1000004":"打印条码总数量不能超过1000个",
        "1400002":"累计的退款总额不能超过交易金额",
        "2000001":"物流计划已删除或不存在",
        "2000002":"选中的物流计划已被加入收货预报，不能删除",
        "2000003":"截止下单时间已过",
        "2000004":"物流计划编码已存在",
        "2000005":"物流计划编码已变更，请重新选择物流计划",
        "2000006":"物流计划始发站、终点站必须为2个大写字符",
        "3000001":"发货单不存在",
        "3000002":"调用WMS订单取消接口失败",
        "3000003":"调用XBN订单取消接口失败",
        "3000004":"新建、已发货、已取消的发货单无法取消发货",
        "3000005":"单据为空，请增加货品信息",
        "3000006":"只有新建、取消，库存不足状态可以编辑",
        "3000007":"只有新建状态可以发货",
        "4000001":"可售库存不足",
        "4000002":"货品列表不能为空",
        "4000003":"只有新建状态发货单可以删除",
        "4000004":"货品列表中有发货单中不存在原始订单号",
        "4000005":"库存不存在",
        "4000006":"查询库存总数未知错误",
        "4000007":"库存编码为空",
        "5000001":"只有新建状、驳回态收货预报可以删除",
        "5000002":"只有审核通过的收货预报可以发货",
        "5000003":"只有新建状、驳回态收货预报可以提审",
        "5000004":"只有待审核、审核通过状态收货预报可以审核、驳回",
        "5000005":"当前状态不能收取头程费用",
        "5000006":"收取头程费用失败",
        "5000007":"收取税金失败",
        "5000008":"收取保费失败",
        "5000009":"设置箱子状态失败",
        "5000010":"当前收货预报状态不可以增箱或收货预报已经收取费用",
        "5000011":"收货预报更新进程装太只能在5~8之间",
        "5000012":"箱号必须为4位的整数",
        "5000013":"箱内货品数量必须大于0",
        "5000014":"箱子货品库存编码为空",
        "5000015":"箱子重量不能超过9999999999.999",
        "5000016":"箱子长度不能超过9999.9",
        "5000017":"箱子宽度不能超过9999.9",
        "5000018":"箱子高度不能超过9999.9",
        "5000019":"海关编码不能超过20个字符",
        "5000020":"申报名称不能超过50个字符",
        "5000021":"申报价格不能超过99999999999.99",
        "5000022":"装箱数量不能超过99999999999",
        "5000023":"箱子信息为空",
        "5000024":"收货预报信息为空",
        "5000025":"收货预报编码已经存在",
        "5000026":"收货预报编码不允许修改",
        "5000027":"装箱单号（箱子编码）已经存在",
        "5000028":"装箱单号（箱子编码）不允许修改",
        "5000029":"收货预报状态不确定！",
        "5000030":"收货预报总货值不能大于9999999999.99,请检查您所填写的箱子货品装箱数量、申报价值是否过大！",
        "5000031":"单个箱子总货值不能大于9999999999.99，请减少装箱数量，或者检查您的货品申报价值！",
        "5000032":"您填写的'小笨鸟备注'长度不能大于500个字符，中文占2个字符",
        "5000033":"您填写的'商家备注'长度不能大于500个字符，中文占2个字符",
        "5000034":"物流计划已更改，请重新选择物流计划",
        "5000035":"您填写的'驳回原因信息'长度不能大于500个字符，中文占2个字符",
        "5000036":"您填写的'处理点实收数量'必须是大于0的小于9位的整数",
        "5000037":"收货预报货品总数不能超过999999999",
        "5000038":"箱内货品装箱数量不能大于999999999",
        "6000001":"仓库不存在",
        "6000002":"仓库已被物流计划使用，不能删除",
        "6000003":"TTX查询入库单，仓库编码为空",
        "6000004":"仓库新增和修改，仓库编码为空",
        "6000005":"仓库编码已经存在",
        "6000006":"仓库编码不允许做修改",
        "7000001":"海外仓服务申请已经通过，不能重复申请",
        "8000001":"用户余额不足",
        "9000001":"当前会员存在未完成的业务，不能受理退款",
        "1100001":"当前国家设置数据已被使用，不能删除",
        "1100002":"国家信息不存在",
        "1100003":"国家信息已经存在",
        "1200001":"推送TTX数据，地址找不到",
        "1200002":"出库单确认出现异常",
        "1200003":"本地入库单信息(ReceiptRequest)为空",
        "1200004":"TTX服务调用出错",
        "1200005":"TTX服务连接超时",
        "1200006":"增箱入库单推送出现异常",
        "1200007":"减箱入库单取消出现异常",
        "1200008":"减箱入库单恢复，推送入库单出现异常",
        "1400001":"退款金额不能大于交易金额"

    };

    X.getErrorName = function (code,module) {
        var returnObj=X.errorStauts;
        //设置默认模块错误码
        if(module){
            returnObj=returnObj[module];
        }
        if (code == '3000403') {
            // 提示+退出
            $.layer({
                title: '提示消息',
                area: ['500px', '200px'],
                dialog: {
                    btns: 1,
                    btn: ['返回'],
                    type: 8,
                    msg: '<div class="tips mB20"><em>请求被拒绝，无权限或者未登录</em></div>',
                    yes: function (index) {
                        // 退出
                        $.cookie("ID", '', {
                            expires: -1
                        });
                        $.cookie("SID", '', {
                            expires: -1
                        });
                        window.localStorage.clear();
                        window.location.href = "login.html";
                        layer.close(index);
                    }
                }
            });
            return false;
        } else if (returnObj[code] && code) {
            return returnObj[code];
        } else {
            return '未知异常'
        }
    }

    // 获取权限(页面权限)
    X.getRolesObj = function (module, action) {
        var pageRoleData = {
            '_module_': module,
            '_action_': action
        };
        var roles = JSON.parse(localStorage.Roles);
        // 设置module
        $.each(roles, function (i, role) {
            if (role.id == module) {
                pageRoleData.moduleData = role;
                return false;
            }
        });
        // 设置action
        pageRoleData.actionData = {};
        if (pageRoleData.moduleData.childs) {
            $.each(pageRoleData.moduleData.childs, function (i, role) {
                if (role.id == action) {
                    pageRoleData.actionData = role;
                    return false;
                }
            });
        }
        // 设置页面operate
        pageRoleData.operate = {};
        if (pageRoleData.actionData.childs) {
            $.each(pageRoleData.actionData.childs, function (i, role) {
                if (typeof pageRoleData.operate[role.code] == 'undefined') {
                    pageRoleData.operate[role.code] = role;
                    // 三级菜单
                    if (role.childs.length) {
                        role.childOpt = {};
                        $.each(role.childs, function (m, srole) {
                            if (typeof role.childOpt[srole.code] == 'undefined') {
                                role.childOpt[srole.code] = srole;
                            }
                        })
                    }
                }
            });
        }
        return pageRoleData;
    }

})(mXbn);

// 设置所有常量值
var constantValue = {
    // 商品状态枚举
    "OwmsCommodityEnum": {
        "1": "可用",
        "2": "待完善"
    },
    // 箱子来源枚举
    "OwmsBoxSourceEnum": {
        "1": "原单",
        "2": "新增"
    },
    // 箱子状态枚举
    "OwmsBoxStatusEnum": {
        "1": "未入库",
        "2": "已入库",
        "3": "已取消"
    },
    // 银行卡类别枚举
    "OwmsCardTypeEnum": {
        "1": "储蓄卡",
        "2": "信用卡"
    },
    // 数据来源枚举
    "OwmsDataSourceEnum": {
        "1": "站外",
        "2": "小笨鸟"
    },
    // 流水子项枚举
    "OwmsDealItemEnum": {
        "1": "线上充值",
        "2": "线下充值",
        "3": "小笨鸟充值",
        "4": "头程运费",
        "5": "保费",
        "6": "税费",
        "7": "仓租",
        "8": "出入库操作费",
        "9": "海外快递费",
        "10": "退款到银行卡",
        "11": "退款到余额"
    },
    // 交易状态枚举
    "OwmsDealStatusEnum": {
        "1": "待确认",
        "2": "已完成",
        "3": "已申请退款",
        "4": "已部分退款",
        "5": "已全部退款"
    },
    // 交易类别枚举
    "OwmsDealTypeEnum": {
        "1": "充值",
        "2": "消费",
        "3": "退款"
    },
    // 处理地点枚举
    "OwmsDisposalSiteEnum": {
        "1": "天津",
        "2": "上海",
        "3": "深圳",
        "4": "广州"
    },
    // 发票申请枚举
    "OwmsInvoiceApplyStatusEnum": {
        "1": "待受理",
        "2": "已受理",
        "3": "已寄出",
        "4": "已驳回"
    },
    //发票类型枚举
    "OwmsInvoiceApplyTypesEnum": {
        "1": "普通",
        "2": "增值税"
    },
    // 发货单状态枚举
    "OwmsInvoiceStatusEnum": {
        "1": "新建",
        "2": "已提交",
        "3": "已发往海外仓",
        "4": "已开始拣货",
        "5": "已打包",
        "6": "已发货",
        "7": "已取消",
        "8": "库存不足"
    },
    // 物流服务类型枚举
    "OwmsLogisticsServerTypeEnum": {
        "1": "海运",
        "2": "空运"
    },
    // 仓储业务申请状态枚举
    "OwmsOverseaStorageApplyEnum": {
        "1": "待审核",
        "2": "已审核",
        "3": "已驳回"
    },
    "OwmsPlatformEnum": {
        "1": "支付宝",
        "2": "网银"
    },
    // 收货预报状态枚举
    "OwmsReceiptForecastStatusEnum": {
        "1": "新建",
        "2": "待审核",
        "3": "审核通过",
        "4": "商家已发货",
        "5": "码头已收货",
        "6": "发往海外",
        "7": "到达目的港",
        "8": "送往海外仓",
        "9": "已部分入库",
        "10": "已全部入库",
        "11": "已驳回"//,
        //"21": "数据中心处理-箱子转入库单"
    },
    // 退款申请状态枚举
    "OwmsRefundApplyStatusEnum": {
        "1": "待受理",
        "2": "已受理",
        "3": "已退款",
        "4": "已驳回"
    },
    // 建议是否已读枚举
    "OwmsSuggectIsReadStatusEnum": {
        "1": "已读",
        "0": "未读"
    },
    // 建议等级枚举
    "OwmsSuggectLevelEnum": {
        "1": "一般",
        "2": "重要",
        "3": "非常重要"
    },
    // 建议状态枚举
    "OwmsSuggectStatusEnum": {
        "1": "新建",
        "2": "已处理"
    },
    //收款人帐号信息
    "OwmsReceiptBankInfo":{
        receiptBankAccount:'6228 4800 1816 0066 997',
        receiptBankName:'交通银行北京兴华大街支行',
        receiptUserFullName:'北京汇商融通信息技术有限公司'
    },
    //扣款情况
    "OwmsChargebackSituationEnum":{
        "1":"未扣款",
        "2":"未扣除头程运费",
        "3":"未扣除税金",
        "4":"未扣除保费",
        "5":"已扣除头程运费和税金",
        "6":"已扣除全部费用"
    }
}

// 返回常量
function getConstName(name, code) {
    var returnObj = null;
    if (name) {
        returnObj = constantValue[name];
    }
    if (code) {
        returnObj = returnObj[code];
    }
    return returnObj ? returnObj : '';
}
