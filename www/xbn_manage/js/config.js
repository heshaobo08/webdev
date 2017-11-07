;
(function (X) {

    X.configer = {

        "__ROOT_PATH_HOST__": document.location.protocol + "//tplatform.xbniao.com/",

        "__ROOT_PATH_IMG_HOST__": document.location.protocol + "//timage.xbniao.com/",

        //根目录通常配置为绝对路径
        "__ROOT_PATH__": document.location.protocol + "//tadmin.xbniao.com",


        // api通用配置绝对路径
        "__API_PATH__": document.location.protocol + "//tadmin.xbniao.com/api",

        // owms通用配置绝对路径海外仓
        "__OWMS_PATH__": document.location.protocol + "//tadmin.xbniao.com/owms",

        //目录索引文件夹(html)
        "__FILE_HTML__": "/template",

        //目录索引文件夹(js)
        "__FILE_JS__": "/js",

        /**
         * @description 拼装页面元素 tpl=>静态模板 api=>数据接口 act=>业务处理
         */

        //用户信息
        "user": {
            api: "/user/checkLogin" //验证登陆接口
        },

        //左侧导航
        "menu": {

            //左侧导航图标
            ico: {
                h01: "icon-15",
                h02: "icon-12",
                h03: "icon-4",
                h04: "icon-6",
                h05: "icon-7",
                h06: "icon-14",
                h07: "icon-2",
                QXBN0357:"icon-14",
                HWC20100000:'icon-50',
                HWC20300000:'icon-58',
                HWC20200000:'icon-59'
            },

            tpl: "menu.html",
            api: null
        },

        //头部
        "header": {
            tpl: "header.html",
            api: {
                "loginOut": "/user/logout"
            }
        },

        //系统管理 > 管理员角色
        "xhr_id_1_2": {
            tpl: "gl-xt/0.html",
            api: {
                "pageList": "/system/role/pager",
                "list": "/system/role/list", //管理员角色列表
                "disable": "/system/role/disable/", //管理员角色禁用
                "enable": "/system/role/enable" //管理员角色启用
            }
        },
        //系统管理 > 管理员角色 > 修改
        "gl-xt-0-add": {
            tpl: "gl-xt/0_add.html",
            api: {
                "add": "/system/role/add", //管理员角色新增
                "roleVerify": "/system/role/verify" //角色唯一性验证
            }
        },
        //系统管理 > 管理员角色 > 修改
        "gl-xt-0-edit": {
            tpl: "gl-xt/0_edit.html",
            api: {
                "edit": "/system/role/edit", //管理员角色编辑
                "query": "/system/role/", //管理员角色查询 //菜单树
                "roleVerify": "/system/role/verify" //角色唯一性验证
            }
        },
        //系统管理 > 管理账户
        "xhr_id_1_9": {
            tpl: "gl-xt/1.html",
            api: {
                "pageList": "/system/account/pager",
                "list": "/system/account/list", //管理员角色列表
                "disable": "/system/account/disable", //管理员角色禁用
                "enable": "/system/account/enable/" //管理员角色启用
            }
        },
        //系统管理 > 管理账户 > 新增
        "gl-xt-1-add": {
            tpl: "gl-xt/1_add.html",
            api: {
                "adminList": "/system/role/list", //账户权限配置调用管理员角色列表
                "add": "/system/account/add", //管理账户新增
                "verify": "/system/account/verify" //验证账户是否存在
            }
        },
        //系统管理 > 管理账户 > 修改
        "gl-xt-1-edit": {
            tpl: "gl-xt/1_edit.html",
            api: {
                "power": "/system/role/list", //账户权限配置调用管理员角色列表
                "query": "/system/account/", //管理账户查询
                "edit": "/system/account/edit" //管理账户编辑
            }
        },
        "gl-xt-2": {
            tpl: "gl-xt/2.html",
            api: null
        },
        //会员角色管理
        "xhr_id_1_19": {
            tpl: "gl-xt/3.html",
            api: {
                "pageList": "/authority/role/pager",
                "list": "/authority/role/list", //会员角色列表
                "disable": "/authority/role/disable/", //会员角色禁用
                "enable": "/authority/role/enable/", //会员角色启用
                "user": "/user/count",
                "groupLevel": "/user/switchingGroupLevel"
            }
        },
        "gl-xt-3-add": {
            tpl: "gl-xt/3_add.html",
            api: {
                "list": "/authority/service/list", //业务列表
                "all": "/inter/all", //接口列表
                "add": "/authority/role/add", //会员角色新增
                "roleVerify": "/authority/role/verify" //角色唯一性验证
            }
        },
        "gl-xt-3-edit": {
            tpl: "gl-xt/3_edit.html",
            api: {
                "list": "/authority/service/list", //业务列表
                "all": "/inter/all", //接口列表
                "edit": "/authority/role/edit", //管理账户编辑
                "query": "/authority/role/", //管理账户查询
                "roleVerify": "/authority/role/verify" //角色唯一性验证
            }
        },
        //等级管理
        "xhr_id_1_300": {
            tpl: "gl-xt/4.html",
            api: {
                "pageList": "/authority/level/pager",
                "list": "/authority/level/list", //等级列表
                "disable": "/authority/level/disable/", //等级禁用
                "enable": "/authority/level/enable/", //等级启用
                "user": "/user/count",
                "groupLevel": "/user/switchingGroupLevel"
            }
        },
        "gl-xt-4-add": {
            tpl: "gl-xt/4_add.html",
            api: {
                "add": "/authority/level/add", //等级新增
                "verifyLevel": "/authority/level/verify" //角色唯一性验证
            }
        },
        "gl-xt-4-edit": {
            tpl: "gl-xt/4_edit.html",
            api: {
                "edit": "/authority/level/edit", //等级编辑
                "query": "/authority/level/", //等级查询
                "verifyLevel": "/authority/level/verify" //角色唯一性验证
            }
        },
        "gl-xt-4-detailEdit": {
            tpl: "gl-xt/4_detailEdit.html",
            api: {
                "add": "/authority/level/detail/add", //等级编辑
                "list": "/authority/level/detail/list", //等级编辑
                "edit": "/authority/level/detail/edit", //等级编辑
                "query": "/authority/level/detail/", //等级查询
                "del": "/authority/level/detail/delete/", //等级权限删除
                "type": "/authority/level/type/list" //查询权限类型
            }
        },
        //业务管理
        "xhr_id_1_306": {
            tpl: "gl-xt/5.html",
            api: {
                "pageList": "/authority/service/pager",
                "list": "/authority/service/list", //业务列表
                "service": "/authority/role/count/", //业务列表
                "disable": "/authority/service/disable/", //业务禁用
                "enable": "/authority/service/enable/" //业务启用
            }
        },
        "gl-xt-5-add": {
            tpl: "gl-xt/5_add.html",
            api: {
                "add": "/authority/service/add", //业务新增
                "tree": "/authority/menu/tree",
                "serviceVerify": "/authority/service/verify"
            }
        },
        "gl-xt-5-edit": {
            tpl: "gl-xt/5_edit.html",
            api: {
                "edit": "/authority/service/edit", //业务编辑
                "query": "/authority/service/", //业务查询
                "tree": "/authority/menu/tree",
                "serviceVerify": "/authority/service/verify"
            }
        },
        "gl-xt-6": {
            tpl: "gl-xt/6.html",
            api: null
        },
        //订单管理
        "gl-dd-0": {
            tpl: "gl-dd/0.html",
            api: null
        },
        "gl-dd-1": {
            tpl: "gl-dd/1.html",
            api: null
        },
        //配置管理 > 敏感词管理
        "xhr_id_199_230": {
            tpl: "gl-pz/1.html",
            api: {
                "keywordList": "/config/keyword/list", //'/plug_data/gl-pz/setSensitiveList.json',         //违禁词列表(条件查询)
                "keywordSaves": "/config/keyword/saves", //'/plug_data/gl-pz/keywordSaves.json',     //敏感词 新增违禁词
                "keywordExceptantUsers": "/config/keyword/exceptantUsers", //'/plug_data/gl-pz/keywordSaves.json',     //敏感词 添加例外用户
                "keywordDeleteById": "/config/keyword/deleteById/", //'/plug_data/gl-pz/keywordSaves.json',  //敏感词 根据违禁词ID删除违禁词
                "keywordDeleteByIds": "/config/keyword/deleteByIds", //'/plug_data/gl-pz/keywordSaves.json',  //敏感词 根据违禁词ID，删除多个违禁词
                "keywordGetById": "/config/keyword/getById/", //'/plug_data/gl-pz/keywordGetById.json',   //敏感词 根据违禁词ID获取违禁词详细信息
                "keywordUpdate": "/config/keyword/update", //'/plug_data/gl-pz/keywordGetById.json',   //敏感词 修改违禁词内容
                "keywordDisables": "/config/keyword/disables", //'/plug_data/gl-pz/keywordSaves.json',  //敏感词 批量禁用
                "keywordEnableds": "/config/keyword/enableds" //'/plug_data/gl-pz/keywordSaves.json' ,  //敏感词 批量启用
            }
        },
        // 配置管理 > 物流基础数据
        "xhr_id_199_240": {
            tpl: "gl-pz/2.html",
            api: {
                "logisticsList": "/config/logistics/queryLogistics", //'/plug_data/gl-pz/setlogisticsList.json', //物流管理 列表
                "logisticsDeletes": "/config/logistics/deletes", //'/plug_data/gl-pz/keywordSaves.json',  //物流管理  批量删除
                'baseData': '/dictionary/dict' //基础物流数据
            }
        },
        // 配置管理 > 物流基础数据>新增物流信息
        "xhr_id_199_240_edit": {
            tpl: "gl-pz/2-edit.html",
            api: {
                'viewInfo': "/config/logistics/", //'/plug_data/gl-pz/setlogisticsView.json',//获取物流信息
                'logisticsCreate': "/config/logistics/create", //"/plug_data/gl-pz/keywordSaves.json",  //新增物流基础数据
                'logisticsUpdate': "/config/logistics/update", //"/plug_data/gl-pz/keywordSaves.json",  //修改物流基础数据
                'baseData': '/dictionary/dict' //基础物流数据
            }
        },
        // 配置管理 >销售产品管理
        "xhr_id_199_222": {
            tpl: "gl-pz/4.html",
            api: {
                "productList": "/finance/product/getProducts" //"/finance/product/getProducts",		//全部增值服务展示
            }
        },
        // 配置管理 >销售产品管理 > 新增销售产品
        "xhr_id_199_222_edit": {
            tpl: "gl-pz/4-edit.html",
            api: {
                "productSaveProduct": '/finance/product/saveProduct', //"/plug_data/gl-pz/keywordSaves.json", //新增销售产品
                "editSaveProduct": '/finance/product/editProduct', // "/plug_data/gl-pz/keywordSaves.json", //修改销售产品
                "getProductDetail": '/finance/product/', //"/plug_data/gl-pz/getProductDetail.json" //根据产品id获取产品
                'siteList': "/config/site/all" //获取所有站点
            }
        },

        // 配置管理 > 促销活动管理
        "xhr_id_199_226": {
            tpl: "gl-pz/5.html",
            api: {
                "setPromotList": '/finance/promotion/getPaginationPromotion', //"/plug_data/gl-pz/setPromotList.json", //获取促销分页数据
            }
        },
        // 配置管理 > 促销活动管理 > 新建促销活动
        "xhr_id_199_226_edit": {
            tpl: "gl-pz/5-edit.html",
            api: {
                "getPromotDetail": '/finance/promotion/', //"/plug_data/gl-pz/getPromotDetail.json", //获取促销详情
                "savePromotion": '/finance/promotion/savePromotion', //"/plug_data/gl-pz/keywordSaves.json", //新建促销活动
                "editPromotion": '/finance/promotion/editPromotion', //"/plug_data/gl-pz/keywordSaves.json" //修改促销活动
                'userLevelList': '/authority/level/list' //会员等级列表
            }
        },

        // 配置管理 > 退货政策管理
        "xhr_id_199_244": {
            tpl: {
                'ebay': "gl-pz/6_ebay.html",
                "amazon": "gl-pz/6_Amazon.html",
                "newegg": "gl-pz/6_Newegg.html"
            },
            api: {
                "refundList": "/config/returnPolicy/getReturnPolicys", //"/plug_data/gl-pz/setRefundList.json",
                "siteList": "/config/site/list", //"/plug_data/gl-pz/siteList.json"
                'baseData': '/dictionary/dict', //基础数据
                'getFullPaths': '/category/getCategoryTreePathsByIds' //获取分类路径
            }
        },
        // 配置管理 > 退货政策管理 > 修改退换货
        "xhr_id_199_244_edit": {
            tpl: {
                'ebay': "gl-pz/6_eBay_edit.html",
                "amazon": "gl-pz/6_Amazon_edit.html",
                "newegg": "gl-pz/6_Newegg_edit.html"
            },
            api: {
                "getRefundDetail": "/config/returnPolicy/getReturnPolicyById/", //"/plug_data/gl-pz/getRefundDetail.json",
                "saveRefund": "/config/returnPolicy/update", //"/plug_data/gl-pz/keywordSaves.json"
                'baseData': '/dictionary/dict', //基础数据
                "getFullPaths": '/category/getCategoryTreePathById/' //获取分类路径
            }
        },
        // 会员管理 > 会员管理
        "xhr_id_33_34": {
            tpl: "gl-hy/0.html",
            api: {
                "userList": "/user/list", // 会员列表
                "userFreeze": "/user/freeze", //冻结
                "userUnfreeze": '/user/unfreeze', //解冻
                "userDisable": "/user/disable", //禁用
                "userResetpwd": "/user/resetpwd" //重置密码

            }
        },
        // 会员管理 > 会员管理 >会员新增
        "xhr_id_33_34_add": {
            tpl: "gl-hy/0-edit.html",
            api: {
                "userSave": "/user/add", // 会员新增
                "userVerify": '/user/verify' //信息唯一性验证
            }
        },
        // 会员管理 > 会员管理 > 会员详情
        "xhr_id_33_34_detail": {
            tpl: "gl-hy/0_detail.html",
            api: {
                "userDetail": "/user/detail/",
                'logList': '/user/login/log/getList' //会员日志
            }
        },
        // 会员管理 > 会员管理 > 会员日志
        "xhr_id_33_34_log": {
            tpl: "gl-hy/0_log.html",
            api: {
                'logList': '/user/login/log/getList' //会员日志
            }
        },

        // 会员管理 > 入住商家
        "xhr_id_33_42": {
            tpl: "gl-hy/1.html",
            api: {
                "settledList": "/settled/list", // 商家列表
                "userLevelList": "/authority/level/list", //等级列表
                "userRoleList": "/authority/role/list", //角色列表
                "userUpdateGroupLevel": "/user/updateGroupLevel", //设置角色和等级
                "userUpcAccredit": "/user/upcAccredit/", //upc授权
                "userEbayPublish": "/user/ebayCommodityPublishTotal/", //ebay 刊登授权
                "userDetail": '/user/detail/' //会员详情
            }
        },
        // 会员管理 > 入住商家 > 商家详情
        "xhr_id_33_42_detail": {
            tpl: "gl-hy/1_detail.html",
            api: {
                "userLevelList": "/authority/level/list", //等级列表
                "userRoleList": "/authority/role/list", //角色列表
                "settledDetail": "/settled/", //商家详情
                "userDetail": '/user/detail/', //会员详情
                "bankDetail": "/corp/bank/byUserId/", //银行详情 Todo 确认接口
                "authSite": "/user/site/accredit/getSitesByUserId/" //用户授权站点列表
            }
        },
        // 会员管理 > 入住商家 > 商家详情修改
        "xhr_id_33_42_edit": {
            tpl: "gl-hy/1_edit.html",
            api: {
                "settledDetail": "/settled/", //商家详情
                "settledEdit": "/settled/update", //修改商家详情
                "userDetail": '/user/detail/', //会员详情
                "verify": '/settled/verify' //身份证唯一性
            }
        },
        // 会员管理 > 入住商家 > 站点授权
        "xhr_id_33_42_auth": {
            tpl: "gl-hy/1_auth.html",
            api: {
                "settledDetail": "/settled/", //商家详情
                "userDetail": '/user/detail/', //会员详情
                "userSiteAuthList": "/user/site/accredit/getAccreditSiteAll/", //站点授权列表
                "userSiteCreat": "/user/site/accredit/create" //站点授权
            }
        },
        // 会员管理 > 品牌管理
        "xhr_id_33_47": {
            tpl: "gl-hy/2.html",
            api: {
                "brandList": "/corp/brand/list", //品牌列表
                "brandFreeze": "/corp/brand/freeze", //冻结
                "brandUnfreeze": "/corp/brand/unfreeze/" //解冻
            }
        },
        // 会员管理 > 品牌管理 > 品牌修改
        "xhr_id_33_47_edit": {
            tpl: "gl-hy/2_edit.html",
            api: {
                "brandDetail": "/corp/brand/", //品牌列表
                "brandEdit": "/corp/brand/edit", //品牌编辑
                "brandAuthSite": "/qualification/site/accredit/byQualificationId/", //授权站点列表
                "brandNoAuthSite": "/qualification/site/accredit/unauthorizedSiteList/", //未授权站点列表
                "addBrandAUth": "/qualification/site/accredit/create", //添加站点授权、
                "nameCheck": '/corp/brand/checkName' //名称校验
            }
        },
        // 会员管理 > 品牌管理 > 品牌查看
        "xhr_id_33_47_view": {
            tpl: "gl-hy/2_view.html",
            api: {
                "brandDetail": "/corp/brand/", //品牌列表
                "brandAuthSite": "/qualification/site/accredit/byQualificationId/", //授权站点列表
            }
        },
        // 会员管理 > 入住审核
        "xhr_id_33_58": {
            tpl: "gl-hy/3.html",
            api: {
                "settledList": '/settled/list', //商家入住
                "settledOpen": "/settled/open/", //开通
                "userLevelList": "/authority/level/list", //等级列表
                "userRoleList": "/authority/role/list", //角色列表
                "userUpdateGroupLevel": "/user/updateGroupLevel", //设置角色和等级
                "saveDefult":"file/photo/save/default" //创建默认相册
            }
        },
        // 会员管理 > 入住审核  > 查看
        "xhr_id_33_58_view": {
            tpl: "gl-hy/3_view.html",
            api: {
                "settledDetail": "/settled/", //商家详情
                "userDetail": '/user/detail/', //会员详情
                "dictionaryList": "/dictionary/dict", //获取银行基础数据
                "bankDetail": "/corp/bank/byUserId/", //银行详情 Todo 确认接口
                "verifyIdCard": '/settled/verifyIdCard', //身份证实名认证
                "joinAuth": "/settled/check", //入驻审核
                "updateIdCardStatus": '/settled/updateIdCardStatus', //审核驳回
                "setPlatUseFee":'/user/updateIfCharge'//设置平台使用费
            }
        },
        // 会员管理 > 入住审核  > 审核
        "xhr_id_33_58_audit": {
            tpl: "gl-hy/3_view.html",
            api: {
                "settledDetail": "/settled/", //商家详情
                "userDetail": '/user/detail/', //会员详情
                "bankDetail": "/corp/bank/byUserId/", //银行详情 Todo 确认接口
                "dictionaryList": "/dictionary/dict", //获取银行基础数据
                "joinAuth": "/settled/check", //入驻审核
                "verifyIdCard": '/settled/verifyIdCard', //身份证实名认证
                "updateIdCardStatus": '/settled/updateIdCardStatus',//审核驳回
                "setPlatUseFee":'/user/updateIfCharge'//设置平台使用费
            }
        },
        // 会员管理 > 入住审核  >  新增 修改
        "xhr_id_33_58_edit": {
            tpl: "gl-hy/3_edit.html",
            api: {
                "settledDetail": "/settled/", //商家详情
                "userDetail": '/user/detail/', //会员详情
                "dictionaryList": "/dictionary/dict", //获取银行基础数据
                "bankDetail": "/corp/bank/byUserId/", //银行详情 Todo 确认接口
                "userList": '/user/byAccountName/', //"/user/list",  //获取关联会员
                "settledApply": "/settled/apply", //入驻申请
                "settledUpdate": "/settled/update", //入驻修改
                "bankUpdate": "/corp/bank/update", //编辑银行信息
                "bankApply": "/corp/bank/create", //新增银行信息
                "verify": '/settled/verify' //校验唯一性
            }
        },
        // 会员管理 > 新增品牌审核
        "xhr_id_33_69": {
            tpl: "gl-hy/4.html",
            api: {
                "brandList": "/corp/brand/list" //品牌列表
            }
        },
        // 会员管理 > 新增品牌审核 > 品牌查看
        "xhr_id_33_69_audit": {
            tpl: "gl-hy/2_view.html",
            api: {
                "brandDetail": "/corp/brand/", //品牌列表
                "brandAuthSite": "/qualification/site/accredit/byQualificationId/", //授权站点列表
                "brandAuditCheck": "/corp/brand/check", //品牌审核
                "brandNoAuthSite": "/qualification/site/accredit/unauthorizedSiteList/", //未授权站点列表
                "addBrandAUth": "/qualification/site/accredit/create" //添加站点授权
            }
        },
        // 会员管理 > 新增品牌审核 > 新增品牌
        "xhr_id_33_69_add": {
            tpl: "gl-hy/4_add.html",
            api: {
                "brandAdd": '/corp/brand/create', //品牌新增
                "userList": "/user/byAccountName/", //获取关联会员
                "nameCheck": '/corp/brand/checkName' //名称校验

            }
        },
        // 会员管理 > 消息管理
        "xhr_id_33_78": {
            tpl: "gl-hy/5.html",
            api: {
                "messageList": "/message/backstage/datagrid", //消息列表
                "changeFlag": '/message/change', //旗子修改
                "siteAll": '/config/site/all' //所有站点
            }
        },
        // 会员管理 > 消息管理 > 回复
        "xhr_id_33_78_reply": {
            tpl: "gl-hy/5_reply.html",
            api: {
                "messageDetail": "/message/", //获取消息详情
                "messageEnter": "/message/enter", //录入消息
                "siteAll": '/config/site/all' //所有站点
            }
        },
        // 会员管理 > 消息管理 > 录入
        "xhr_id_33_78_apply": {
            tpl: "gl-hy/5_reply.html",
            api: {
                "messageDetail": "/message/", //获取消息详情
                "messageEnter": "/message/enter", //录入消息
                "siteAll": '/config/site/all' //所有站点
            }
        },
        // 会员管理 > 消息管理 > 查看
        "xhr_id_33_78_view": {
            tpl: "gl-hy/5_reply.html",
            api: {
                "messageDetail": "/message/", //获取消息详情
                "messageEnter": "/message/enter", //录入消息
                "siteAll": '/config/site/all' //所有站点
            }
        },
        // 会员管理 > 客户管理
        "xhr_id_33_83": {
            tpl: "gl-hy/6.html",
            api: {
                "customerList": "/customer/datagrid" //客户列表
            }
        },
        // 会员管理 > 客户管理  > 查看
        "xhr_id_33_83_view": {
            tpl: "gl-hy/6_view.html",
            api: {
                "customerDetail": "/customer/" //客户列表
            }
        },
        //商品管理 > 主商品管理
        "xhr_id_95_160": {
            tpl: "gl-sp/0.html",
            api: {
                "mainProductList": "/commodity/list/page", //主商品列表
                "siteConfigList": "/config/site/list", //获取站点信息
                "userDetailList": "/user/getUsersByIds"//批量查询用户名
            }
        },
        //商品管理 > 主商品管理
        "xhr_id_95_160_view": {
            tpl: "gl-sp/0_view.html",
            api: {
                "mainProductDetail": "/commodity/list/detail", //主商品列表
                "siteDetail": "/commodity/list/site/detail", //站点详情
                "addressInfo": "/template/shippingaddress/showinfo", //发货地址模板详情
                "siteConfigList": "/config/site/all", //获取站点信息
                "catePath": "/category/getCategoryTreePathById/", //获取分类路径
                "getGroupName": "/commodityGroup/getXbnCommodityGroupByGroupId", //获取分组详情
                "userDetail": '/user/detail/',
                "getCategoryCondition": "/commodity/list/ebay/categoryCondition/get",
                'getDict':'/dictionary/dict' //获取字典信息
            }
        },
        //商品管理 > 刊登商品审核
        "xhr_id_95_125": {
            tpl: "gl-sp/1.html",
            api: {
                "ebayList": "/commodity/list/check/ebay/page", //ebay刊登商品审核列表
                "amazonList": "/commodity/list/check/amazon/page", //amazon刊登商品审核列表
                "neweggList": "/commodity/list/check/newegg/page", //newegg刊登商品审核列表
                "ebayDetail": "/commodity/list/check/ebay/detail", //ebay刊登商品审核详情
                "amazonDetail": "/commodity/list/check/amazon/detail", //amazon刊登商品审核详情
                "neweggDetail": "/commodity/list/check/newegg/detail", //newegg刊登商品审核详情
                "siteConfigList": "/config/site/list", //获取站点信息
                "ebaycancelCron": "/commodity/list/check/ebay/cancelCron", //取消定时
                "ebayImmediatePublish": "/commodity/list/check/ebay/immediatePublish", //立即刊登
                "ebayPassed": "/commodity/list/check/ebay/passed", //ebay审核通过
                "ebayReject": "/commodity/list/check/ebay/reject", //ebay审核驳回
                "amazonPassed": "/commodity/list/check/amazon/passed", //amazon审核通过
                "amazonReject": "/commodity/list/check/amazon/reject", //amazon审核驳回
                "neweggPassed": "/commodity/list/check/newegg/passed", //newegg审核通过
                "neweggReject": "/commodity/list/check/newegg/reject", //newegg审核驳回
                "ebayCronRule": "/commodity/list/check/ebay/cronRule/detail", // 获取站点详情
                "cronRuleSave": "/commodity/list/check/ebay/cronRule/save", //添加定时规则
                "cronRuleUpdate": "/commodity/list/check/ebay/cronRule/update", //添加定时规则
                "userDetailList": "/user/getUsersByIds"//批量查询用户名
            }
        },
        //商品管理 > 刊登商品审核
        "xhr_id_95_125_view": {
            tpl: "gl-sp/1_view.html",
            api: {
                "siteDetail": "/commodity/list/site/detail", //站点详情
                "addressInfo": "/template/shippingaddress/showinfo", //发货地址模板详情
                "siteConfigList": "/config/site/all", //获取站点信息
                "ebayDetail": "/commodity/list/check/ebay/detail", //获取ebay详情
                "amazonDetail": "/commodity/list/check/amazon/detail", //获取amazon详情
                "neweggDetail": "/commodity/list/check/newegg/detail", //获取newegg详情
                "catePath": "/category/getCategoryTreePathById/", //获取分类路径
                "shipInfo": "/template/freightrates/showinfo", //获取运费模板信息
                "getReturnPolicyById": "/config/returnPolicy/getReturnPolicys", //获取退货政策
                "getGroupName": "/commodityGroup/getXbnCommodityGroupByGroupId", //获取分组详情
                "ebayCronRule": "/commodity/list/check/ebay/cronRule/detail", // 获取站点详情
                "ebayPassed": "/commodity/list/check/ebay/passed", //ebay审核通过
                "ebayReject": "/commodity/list/check/ebay/reject", //ebay审核驳回
                "amazonPassed": "/commodity/list/check/amazon/passed", //amazon审核通过
                "amazonReject": "/commodity/list/check/amazon/reject", //amazon审核驳回
                "neweggPassed": "/commodity/list/check/newegg/passed", //newegg审核通过
                "neweggReject": "/commodity/list/check/newegg/reject", //newegg审核驳回
                "userDetail": '/user/detail/',
                "getCategoryCondition": "/commodity/list/ebay/categoryCondition/get"
            }
        },
        //商品管理 > 编辑商品审核
        "xhr_id_95_144": {
            tpl: "gl-sp/2.html",
            api: {
                "ebayList": "/commodity/list/edit/ebay/page", //"/commodity/list/check/ebay/page", //ebay刊登商品审核列表
                "amazonList": "/commodity/list/edit/amazon/page", //"/commodity/list/check/amazon/page", //amazon刊登商品审核列表
                "neweggList": "/commodity/list/edit/newegg/page", // "/commodity/list/check/newegg/page", //newegg刊登商品审核列表
                "siteConfigList": "/config/site/list", //获取站点信息
                "ebayPassed": "/commodity/list/edit/ebay/passed", //ebay审核通过
                "ebayReject": "/commodity/list/edit/ebay/reject", //ebay审核驳回
                "amazonPassed": "/commodity/list/edit/amazon/passed", //amazon审核通过
                "amazonReject": "/commodity/list/edit/amazon/reject", //amazon审核驳回
                "neweggPassed": "/commodity/list/edit/newegg/passed", //newegg审核通过
                "neweggReject": "/commodity/list/edit/newegg/reject", //newegg审核驳回
                "ebayDetail": "/commodity/list/edit/ebay/detail", //ebay刊登商品审核详情
                "amazonDetail": "/commodity/list/edit/amazon/detail", //amazon刊登商品审核详情
                "neweggDetail": "/commodity/list/edit/newegg/detail", //newegg刊登商品审核详情
                "userDetailList": "/user/getUsersByIds"//批量查询用户名
            }
        },
        //商品管理 > 编辑商品审核 >审核 Todo
        "xhr_id_95_144_view": {
            tpl: "gl-sp/2_view.html",
            api: {
                "siteDetail": "/commodity/list/site/detail", //站点详情
                "addressInfo": "/template/shippingaddress/showinfo", //发货地址模板详情
                "siteConfigList": "/config/site/all", //获取站点信息
                "ebayDetail": "/commodity/list/edit/ebay/detail", //获取ebay详情
                "amazonDetail": "/commodity/list/edit/amazon/detail", //获取amazon详情
                "neweggDetail": "/commodity/list/edit/newegg/detail", //获取newegg详情
                "catePath": "/category/getCategoryTreePathsByIds", //获取分类路径
                "shipInfo": "/template/freightrates/showinfo", //获取运费模板
                "getReturnPolicyById": "/config/returnPolicy/getReturnPolicyListBySiteIds", //获取退货政策
                "ebayPassed": "/commodity/list/edit/ebay/passed", //ebay审核通过
                "ebayReject": "/commodity/list/edit/ebay/reject", //ebay审核驳回
                "amazonPassed": "/commodity/list/edit/amazon/passed", //amazon审核通过
                "amazonReject": "/commodity/list/edit/amazon/reject", //amazon审核驳回
                "neweggPassed": "/commodity/list/edit/newegg/passed", //newegg审核通过
                "neweggReject": "/commodity/list/edit/newegg/reject", //newegg审核驳回
                "userDetail": '/user/detail/',
                "getCategoryCondition": "/commodity/list/ebay/categoryCondition/get"
            }
        },
        //商品管理 >  在线商品管理
        "xhr_id_95_96": {
            tpl: "gl-sp/3.html",
            api: {
                "ebayList": "/commodity/list/publish/ebay/page", //"/commodity/list/check/ebay/page", //ebay在线商品列表
                "amazonList": "/commodity/list/publish/amazon/page", //"/commodity/list/check/amazon/page", //amazon在线商品列表
                "neweggList": "/commodity/list/publish/newegg/page", // "/commodity/list/check/newegg/page", //newegg在线商品列表
                "siteConfigList": "/config/site/list", //获取站点信息
                "ebayOffline": "commodity/list/publish/ebay/end", //ebay下线操作
                "amazonOffline": "/commodity/list/publish/amazon/end", //amazon下线操作
                "neweggOffline": "/commodity/list/publish/newegg/end", //newegg下线操作
                "userDetailList": "/user/getUsersByIds" //批量查询用户名
            }
        },
        //商品管理 >  在线商品管理 >查看
        "xhr_id_95_96_view": {
            tpl: "gl-sp/3_view.html",
            api: {
                "addressInfo": "/template/shippingaddress/showinfo", //发货地址模板详情
                "siteConfigList": "/config/site/all", //获取站点信息
                "ebayDetail": "/commodity/list/publish/ebay/detail", //获取ebay详情
                "amazonDetail": "/commodity/list/publish/amazon/detail", //获取amazon详情
                "neweggDetail": "/commodity/list/publish/newegg/detail", //获取newegg详情
                "catePath": "/category/getCategoryTreePathById/", //获取分类路径
                "shipInfo": "/template/freightrates/showinfo", //获取运费模板信息
                "getReturnPolicyById": "/config/returnPolicy/getReturnPolicys", //获取退货政策
                "getGroupName": "/commodityGroup/getXbnCommodityGroupByGroupId", //获取分组详情
                "ebayOffline": "commodity/list/publish/ebay/end", //ebay下线操作
                "amazonOffline": "/commodity/list/publish/amazon/end", //amazon下线操作
                "neweggOffline": "/commodity/list/publish/newegg/end", //newegg下线操作
                "userDetail": '/user/detail/',
                "getCategoryCondition": "/commodity/list/ebay/categoryCondition/get"
            }
        },
        //商品管理 >  下线商品管理
        "xhr_id_95_109": {
            tpl: "gl-sp/4.html",
            api: {
                "ebayList": "/commodity/list/end/ebay/page", //"/commodity/list/check/ebay/page", //ebay在线商品列表
                "amazonList": "/commodity/list/end/amazon/page", //"/commodity/list/check/amazon/page", //amazon在线商品列表
                "neweggList": "/commodity/list/end/newegg/page", // "/commodity/list/check/newegg/page", //newegg在线商品列表
                "siteConfigList": "/config/site/list", //获取站点信息
                'offlineReasonType': '/dictionary/dict', //下线原因
                "userDetailList": "/user/getUsersByIds" //批量查询用户名
            }
        },
        //商品管理 >  下线商品管理 >查看
        "xhr_id_95_109_view": {
            tpl: "gl-sp/4_view.html",
            api: {
                "siteDetail": "/commodity/list/site/detail", //站点详情
                "addressInfo": "/template/shippingaddress/showinfo", //发货地址模板详情
                "siteConfigList": "/config/site/all", //获取站点信息
                "ebayDetail": "/commodity/list/end/ebay/detail", //获取ebay详情
                "amazonDetail": "/commodity/list/end/amazon/detail", //获取amazon详情
                "neweggDetail": "/commodity/list/end/newegg/detail", //获取newegg详情
                "catePath": "/category/getCategoryTreePathById/", //获取分类路径
                "shipInfo": "/template/freightrates/showinfo", //获取运费模板信息
                "getReturnPolicyById": "/config/returnPolicy/getReturnPolicys", //获取退货政策
                "getGroupName": "/commodityGroup/getXbnCommodityGroupByGroupId", //获取分组详情
                'offlineReasonType': '/dictionary/dict',
                "userDetail": '/user/detail/',
                "getCategoryCondition": "/commodity/list/ebay/categoryCondition/get"
            }
        },
        //财务管理
        "xhr_id_173_174": {
            tpl: "gl-cw/xhr_id_173_174.html",
            api: {
                "list": "/finance/bank/account/list" //银行列表

            }
        },
        "xhr_id_173_174_status": {
            tpl: "gl-cw/xhr_id_173_174_status.html",
            api: {
                "query": "/finance/bank/",
                "edit": "/finance/bank/review",
                "accoutDetail": '/system/account/' // 账户信息
            }
        },
        "xhr_id_173_178": {
            tpl: "gl-cw/xhr_id_173_178.html",
            api: {
                "list": "/finance/withdrow/list" //提现列表
            }
        },
        "xhr_id_173_178_status": {
            tpl: "gl-cw/xhr_id_173_178_status.html",
            api: {
                "query": "/finance/withdrow/show",
                "edit": "/finance/withdrow/update",
                "user": "/user/detail/",
                "level": "/authority/level/detail/list"
            }
        },
        "xhr_id_173_182": {
            tpl: "gl-cw/xhr_id_173_182.html",
            api: {
                "list": "/finance/bill/list", //账单列表
                "bill": "/finance/bill/",
                "billEdit": "/finance/bill/negative/update",
                "billQuery": "/finance/bill/negative/"
            }
        },
        "xhr_id_173_182_status": {
            tpl: "gl-cw/xhr_id_173_182_status.html",
            api: {
                "queryList": "/finance/bill/detail", //账单详情
                "query": "/finance/bill/"
            }
        },
        "xhr_id_173_186": {
            tpl: "gl-cw/xhr_id_173_186.html",
            api: {
                "list": "/finance/bill/detail", //支付流水列表,
                "site": "/config/site/all" //所有平台（配置管理）
            }
        },
        "xhr_id_173_188": {
            tpl: "gl-cw/xhr_id_173_188.html",
            api: {
                "list": "/finance/bill/getRateList", //汇率列表
                'baseData': '/dictionary/dict' //基础物流数据
            }
        },
        "xhr_id_173_190": {
            tpl: "gl-cw/xhr_id_173_190.html",
            api: {
                "list": "/finance/order/getALLOrderList", //服务购买管理
                "save": "/finance/order/payMoney" //保存付款
            }
        },
        "xhr_id_173_190_add": {
            tpl: "gl-cw/xhr_id_173_190_add.html",
            api: {
                "user": "/user/list",
                "addSave": "/finance/order/saveOrderInfo", //购买服务
                "serveAll": "/finance/product/getProducts", //所有的服务
                "serve": "/finance/product/getProductByName", //服务购买管理
                "favorable": "/finance/order/getProductFavorableValue", //服务购买优惠
                "list": "/finance/product/getProducts",
                "promotInfo": '/finance/order/getProductPromotion'
                    //"gift":"center/finance/product/"此接口已删除（调用产品服务）
            }
        },
        "xhr_id_173_190_serve": {
            tpl: "gl-cw/xhr_id_173_190_serve.html",
            api: {
                "serve": "/finance/product/getProductByName" //服务购买管理
            }
        },
        "xhr_id_173_190_status": {
            tpl: "gl-cw/xhr_id_173_190_status.html",
            api: {
                "favorable": "/finance/order/getProductFavorableValue", //优惠金额
                "order": "/finance/order/getOrderById", //服务购买详情
                "open": "/finance/order/openSingleService", //开通服务
                "save": "/finance/order/payMoney" //保存付款
            }
        },
        "xhr_id_173_195": {
            tpl: "gl-cw/xhr_id_173_195.html",
            api: {
                "list": "/finance/deposit/datagrid",
                "userList": "/system/account/list"
            }
        },
        "xhr_id_173_195_status": {
            tpl: "gl-cw/xhr_id_173_195_status.html",
            api: {
                "query": "/finance/deposit/info",
                "userInfo": '/user/detail/',
                "edit": "/finance/deposit/paymentconfirm"
            }
        },
        "xhr_id_259_260": {
            tpl: "picture/xhr_id_259_260.html",
            api: {
                "list": "api.xbniao.com/file/photo/list"
            }
        },
        //海外仓申请管理
        "xhr_id_20100000_20101000": {
            tpl: "/ware-business/0.html",
            api: {
                list: "/overseaStorageApply/listPage",
                reject: "/overseaStorageApply/reject",
                pass: "/overseaStorageApply/pass",
                userLevelList: "/authority/level/list", //等级列表
                userRoleList: "/authority/role/list", //角色列表
                userUpdateGroupLevel: "/user/updateGroupLevel", //设置角色和等级
                userDetail: '/user/detail/' //会员详情
            }
        },
        //海外仓详情
        "xhr_id_20100000_20101000_view": {
            tpl: "/ware-business/0-view.html",
            api: {
                detail: "/overseaStorageApply/info",
                reject: "/overseaStorageApply/reject",
                pass: "/overseaStorageApply/pass",
                userLevelList: "/authority/level/list", //等级列表
                userRoleList: "/authority/role/list", //角色列表
                userUpdateGroupLevel: "/user/updateGroupLevel", //设置角色和等级
                userDetail: '/user/detail/' //会员详情
            }
        },
        //国家设置
        "xhr_id_20300000_20301000": {
            tpl: '/ware-system/0.html',
            api: {
                list: '/countryCurrency/listPage',
                listNoPage: '/countryCurrency/list',
                delete: '/countryCurrency/delete'
            }
        },
        //新增国家
        "xhr_id_20300000_20301000_add": {
            tpl: '/ware-system/0-add.html',
            api: {
                add: '/countryCurrency/add'
            }
        },
        //修改国家
        "xhr_id_20300000_20301000_edit": {
            tpl: '/ware-system/0-edit.html',
            api: {
                edit: '/countryCurrency/update',
                detail: '/countryCurrency/info'
            }
        },
        //仓库管理
        "xhr_id_20100000_20102000": {
            tpl: '/ware-business/1.html',
            api: {
                list: '/store/listPage',
                delete: '/store/delete',
                listNoPage: '/countryCurrency/list'
            }
        },
        //新增仓库
        "xhr_id_20100000_20102000_add": {
            tpl: '/ware-business/1-add.html',
            api: {
                add: '/store/add',
                listNoPage: '/countryCurrency/list'
            }
        },
        //仓库详情
        "xhr_id_20100000_20102000_view": {
            tpl: '/ware-business/1-view.html',
            api: {
                detail: '/store/info'
            }
        },
        //仓库修改
        "xhr_id_20100000_20102000_edit": {
            tpl: '/ware-business/1-edit.html',
            api: {
                detail: '/store/info',
                edit: '/store/update',
                listNoPage: '/countryCurrency/list'
            }
        }, //物流计划
        "xhr_id_20100000_20104000": {
            tpl: '/ware-business/2.html',
            api: {
                list: '/logisticsPlan/listPage',
                storeList: '/dictionary/storeList',
                delete: '/logisticsPlan/delete',
                imports: '/logisticsPlan/importLogisticsPlan'
            }
        }, //新增物流计划
        "xhr_id_20100000_20104000_add": {
            tpl: '/ware-business/2-add.html',
            api: {
                storeList: '/dictionary/storeList',
                add: '/logisticsPlan/add'
            }
        }, //修改物流计划
        "xhr_id_20100000_20104000_edit": {
            tpl: '/ware-business/2-edit.html',
            api: {
                detail: '/logisticsPlan/info',
                edit: '/logisticsPlan/update',
                storeList: '/dictionary/storeList'
            }
        }, //物流计划详情
        "xhr_id_20100000_20104000_view": {
            tpl: '/ware-business/2-view.html',
            api: {
                detail: '/logisticsPlan/info',
                delete: '/logisticsPlan/delete'
            }
        }, //库存管理
        "xhr_id_20100000_20103000": {
            tpl: '/ware-business/3.html',
            api: {
                list: '/inventory/listPage',
                storeList: '/dictionary/storeList'
            }
        }, //查看库存容量
        "xhr_id_20100000_20103000_view": {
            tpl: '/ware-business/3-view.html',
            api: {
                detail: '/inventory/checkInventoryCapacity',
                compute: '/dictionary/compute'
            }
        }, //意见管理
        "xhr_id_20100000_20109000": {
            tpl: '/ware-business/4.html',
            api: {
                list: '/suggest/listPage',
                deal: '/suggest/deal'
            }
        }, //意见管理详情
        "xhr_id_20100000_20109000_view": {
            tpl: '/ware-business/4-view.html',
            api: {
                detail: '/suggest/info',
                deal: '/suggest/deal'
            }
        }, //客服管理
        "xhr_id_20100000_20108000": {
            tpl: '/ware-business/5.html',
            api: {
                list: '/customerService/listPage',
                delete: '/customerService/delete'
            }
        }, //新增客服
        "xhr_id_20100000_20108000_add": {
            tpl: '/ware-business/5-add.html',
            api: {
                add: '/customerService/add'
            }
        }, //修改客服
        "xhr_id_20100000_20108000_edit": {
            tpl: '/ware-business/5-edit.html',
            api: {
                detail: '/customerService/info',
                edit: '/customerService/update'
            }
        }, //货品管理列表
        "xhr_id_20100000_20105000": {
            tpl: '/ware-business/6.html',
            api: {
                list: '/commodity/listPage',
                export: "/commodity/export"
            }
        }, //货品管理详情
        "xhr_id_20100000_20105000_detail": {
            tpl: '/ware-business/6-detail.html',
            api: {
                detail: '/commodity/info'
            }
        }, //货品管理打印货品条码
        "xhr_id_20100000_20105000_print": {
            tpl: '/ware-business/6-print.html',
            api: {
                printList: '/commodity/getListByIds',
                print: '/commodity/printCommodityBarCodeOnline',
                printBar: "/commodity/getBarCodeTemplateList"
            }
        }, //收货预报管理列表
        "xhr_id_20100000_20106000": {
            tpl: '/ware-business/7.html',
            api: {
                list: '/forecast/listPage',
                batchPass: '/forecast/batchPass',
                batchReject: '/forecast/batchReject',
                supplyBox: '/forecast/supplyBox',
                boxCancel: '/forecast/boxCancel',
                updateRemark: '/forecast/updateRemark',
                storeList:'/dictionary/storeList'
            }
        }, //退款管理列表
        "xhr_id_20200000_20203000": {
            tpl: '/ware-finance/0.html',
            api: {
                list: '/finance/refundApply/getPage',
                dealRefundApply: '/finance/refundApply/dealRefundApply',
                rejectRefundApply: '/finance/refundApply/rejectRefundApply'
            }
        }, //退款管理详情
        "xhr_id_20200000_20203000_view": {
            tpl: '/ware-finance/0-1.html',
            api: {
                detail: '/finance/refundApply/getById',
                dealRefundApply: '/finance/refundApply/dealRefundApply',
                rejectRefundApply: '/finance/refundApply/rejectRefundApply'
            }
        }, //退款管理退款受理
        "xhr_id_20200000_20203000_refund": {
            tpl: '/ware-finance/0-2.html',
            api: {
                detail: '/finance/refundApply/getById',
                refundToBank: '/finance/refundApply/refundToBank',
                account: '/account/getByUserId'
            }
        }, //退款管理未完成的收货预报列表
        "xhr_id_20200000_20203000_detail": {
            tpl: '/ware-finance/0-1-detail.html',
            api: {
                forecast: '/finance/refundApply/getOwmsReceiptForecastPage',
                inventory: '/finance/refundApply/getOwmsInventoryPage',
                invoice: '/finance/refundApply/getOwmsInvoicePage'
            }
        }, //退款管理未完成业务详情
        "xhr_id_20200000_20203000_business": {
            tpl: '/ware-finance/0-business.html',
            api: {
                forecast: '/forecast/info',
                invoice: '/invoice/getById',
                track: '/forecast/getProcessTrack'
            }
        }, //收货预报管理详情
        "xhr_id_20100000_20106000_detail": {
            tpl: '/ware-business/7-detail.html',
            api: {
                detail: '/forecast/info',
                track: '/forecast/getProcessTrack',
                batchPass: '/forecast/batchPass',
                batchReject: '/forecast/batchReject',
                supplyBox: '/forecast/supplyBox',
                boxCancel: '/forecast/boxCancel',
                updateRemark: '/forecast/updateRemark'
            }
        }, //收货预报管理打印条码
        "xhr_id_20100000_20106000_printBarCode": {
            tpl: '/ware-business/7-printBarCode.html',
            api: {
                list: '/forecast/commodityList',
                tempList: '/commodity/getBarCodeTemplateList',
                printBar: '/commodity/printCommodityBarCodeOnline'
            }
        }, //收货预报管理打印箱子编码
        "xhr_id_20100000_20106000_printBoxCode": {
            tpl: '/ware-business/7-printBoxCode.html',
            api: {
                list: '/forecast/boxList',
                tempList: '/dictionary/boxBarCodeTemplateList',
                printBar: '/commodity/printBoxBarCodeOnline'
            }
        }, //收货预报管理更新进程
        "xhr_id_20100000_20106000_updateProcess": {
            tpl: '/ware-business/7-updateProcess.html',
            api: {
                track: '/forecast/getOwmsProcessTrack',
                saveTrack: '/forecast/saveOrUpdateOwmsProcessTrack'
            }
        }, //收货预报管理扣款
        "xhr_id_20100000_20106000_fee": {
            tpl: '/ware-business/7-fee.html',
            api: {
                detail: '/forecast/info',
                headCharge: '/forecast/headCharge',
                taxCharge: '/forecast/taxCharge',
                premiumCharge: '/forecast/premiumCharge',
                compute: '/dictionary/compute'
            }
        }, //收货预报管理增箱
        "xhr_id_20100000_20106000_addBox": {
            tpl: '/ware-business/7-addBox.html',
            api: {
                infoAddBox: '/forecast/infoAddBox',
                supplyBox: '/forecast/supplyBox',
                getBoxCode: '/forecast/getBoxCode',
                getBoxOrderCode: '/forecast/getBoxOrderCode',
                updateRemark: '/forecast/updateRemark',
                list: '/commodity/listPage',
                listByCommodityIds: '/commodityCustom/listByCommodityIds',
                batchSaveOrUpdate: '/commodityCustom/batchSaveOrUpdate',
                commodityIds: '/commodity/listByCommodityIds',
                goodsInfo: '/commodity/info'

            }
        }, //收货预报管理减箱
        "xhr_id_20100000_20106000_minusBox": {
            tpl: '/ware-business/7-minusBox.html',
            api: {
                infoReduceBox: '/forecast/infoReduceBox',
                updateRemark: '/forecast/updateRemark',
                boxCancel: '/forecast/boxCancel',
                goodsInfo: '/commodity/info'
            }
        }, //发货单
        "xhr_id_20100000_20107000": {
            tpl: '/ware-business/8.html',
            api: {
                list: '/invoice/getPage',
                export: '/invoice/export',
                storeList: '/dictionary/storeList',
                cancelSend: '/invoice/batchCancel',
                storeList: '/dictionary/storeList',
                remark: '/invoice/updateRemark'
            }
        }, //发货单详情
        "xhr_id_20100000_20107000_view": {
            tpl: '/ware-business/8-view.html',
            api: {
                detail: '/invoice/getById',
                remark: '/invoice/updateRemark',
                cancelSend: '/invoice/batchCancel'
            }
        },
        //海外仓财务账户管理
        "xhr_id_20200000_20201000": {
            tpl: '/ware-finance/1.html',
            api: {
                list: '/account/getPage'
            }
        },
        //海外仓财务账户管理交易流水
        "xhr_id_20200000_20201000_view": {
            tpl: '/ware-finance/1-1.html',
            api: {
                user: '/finance/accountDetail/getDetailPageByUserId',
                export: '/finance/accountDetail/export',
                addXbniao: '/finance/accountDetail/addXbniao',
                offlineAffirm: '/finance/accountDetail/offlineAffirm',
                getByUserId: '/account/getByUserId',
                getDealCodeByItem: "/finance/accountDetail/getDealCodeByItem",
                detail: '/finance/accountDetail/getByDetailId',
                refundToAccount: '/finance/accountDetail/refundToAccount'
            }
        },
        "xhr_id_20200000_20201000_detail": {
            tpl: '/ware-finance/1-1-detail.html',
            api: {
                detail: '/finance/accountDetail/getByDetailId',
                offlineAffirm: '/finance/accountDetail/offlineAffirm',
                refundToAccount: '/finance/accountDetail/refundToAccount',
                addXbniao: '/finance/accountDetail/addXbniao'
            }
        }, //发票管理
        "xhr_id_20200000_20202000": {
            tpl: '/ware-finance/2.html',
            tplSend: '/ware-finance/2-send.html',
            api: {
                list: '/finance/invoiceApply/getPage',
                audit: '/finance/invoiceApply/dealInvoiceApply',
                reject: '/finance/invoiceApply/rejectInvoiceApply',
                send: '/finance/invoiceApply/sendInvoiceApply'
            }
        }, //发票详情
        "xhr_id_20200000_20202000_view": {
            tpl: '/ware-finance/2-view.html',
            api: {
                detail: '/finance/invoiceApply/getById',
                audit: '/finance/invoiceApply/dealInvoiceApply',
                reject: '/finance/invoiceApply/rejectInvoiceApply',
                send: '/finance/invoiceApply/sendInvoiceApply'
            }
        }, //批量寄出发票
        "xhr_id_20200000_20202000_send": {
            tpl: '/ware-finance/2-send.html',
            api: {
                send: '/finance/invoiceApply/sendInvoiceApply'
            }
        }
    };
})(mXbn);
