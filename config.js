/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

var host = "wx.toworld-tech.cn";


var config = {

    // 下面的地址配合云端 Server 工作
    host,

    // 登录地址，用于建立会话
    loginUrl: `https://${host}/signature/wx_xcx_get_info?`,

    // 测试的请求地址，用于测试会话
    requestUrl: `https://${host}/testRequest`,

    // 用code换取openId
    openIdUrl: `https://${host}/signature/wx_xcx_get_info`,

    // 获取openid
    unionIdUrl: `https://${host}/wx_xcx_jm/demo.php`,

    // unionId 获取uid
    unionGetUidUrl: `https://${host}/user/unionid_get_uid`,

    //商城首页
    shopPage: `https://${host}/home/shop_page`,

    //商城顶部搜索
    search: `https://${host}/home/search`,

    //拿收货地址
    deliveryAddress: `https://${host}/users/delivery_address`,

    //增添或修改地址
    addDelAddress: `https://${host}/users/add_del_address`,

    //商品分类名称列表
    classifyNames: `https://${host}/home/classify_names`,

    //分类商品列表
    classifyGoodsList: `https://${host}/home/classify_goods_list`,

    //产品详情
    productDetail: `https://${host}/home/product_detail`,

    //添加产品到购物车
    addItem: `https://${host}/cart/add_item`,

    //购物车处理
    arr_shop: `https://${host}/orders/arr_shop`,

    //删除购物车产品
    removeItem: `https://${host}/cart/remove_item`,

    //显示购物车商品
    userShoppingCart: `https://${host}/cart/user_shopping_cart`,

    //预处理订单
    prepareBuildOrders: `https://${host}/orders/prepare_build_orders`,

    //修改购物车单个商品数量
    changeGoodsNum: `https://${host}/cart/change_goods_num`,

    //领取优惠券
    takeCoupons: `https://${host}/users/take_conpons`,

    //订单显示全部
    orderTotal: `https://${host}/orders/total`,

    //优惠券列表
    myCoupons: `https://${host}/users/my_conpons`,

    //下订单
    unifiedOrders: `https://${host}/orders/unifiedOrders`,

    //分销页面
    distri_status: `https://${host}/distributor/status`,

    //申请分销
    apply_distri: `https://${host}/distributor/apply`,

    //删除订单或取消订单
    removeOrders: `https://${host}/orders/remove_orders` ,

    //未付款订单立即支付
    immediatePayment: `https://${host}/orders/immediate_payment`,

    //确认收货
    confirm_receipt: `https://${host}/orders/confirm`,

    //分销码
    myWxacode: `https://${host}/distributor/my_wxacode`,

    //分销记录
    distriRecords: `https://${host}/distributor/record`,

    //钱包提现
    withdrawCash: `https://${host}/users/withdraw_cash`,

    //提现记录
    cashApplyRecords: `https://${host}/users/cash_apply_records`,

    //个人中心请求路径
    homePage: `https://${host}/users/homepage`,
    
    //订单详情
    ordersDetails: `https://${host}/orders/details`,
    
    //更多优惠券、优惠券中心
    couponsCenter: `https://${host}/users/coupons_center`,

    //收集formid 
    collectFormId: `https://${host}/users/collect_form_id`,
    
    //用户注册信息保存
    register_info: `https://${host}/users/register`,
    
    //获取物流信息
    logisticsInformation: `https://${host}/orders/logistics_information`,

    //单个订单状态获取
    order_total_stadus: `https://${host}/orders/total/status`,

    //我的分销成员
    my_members: `https://${host}/distributor/members`,

    //首页
    index: `https://${host}/web/index`,

    select_data: `https://${host}/web/select_data`,

    get_text_config: `https://${host}/web/get_text_config`,

    join: `https://${host}/web/insert_data`,

    activity: `https://${host}/bargain/products`,

    // 砍价活动-我要参与  
    join_activity: `https://${host}/bargain/join`,

    //我的活动
    myactivity: `https://${host}/bargain/myactivity`,

    //帮砍记录
    dohelprecords: `https://${host}/bargain/dohelprecords`,

    //砍价活动详情
    myActivitydetail: `https://${host}/bargain/myActivitydetail`,

    //砍价活动详情
    dohelppage: `https://${host}/bargain/dohelppage`,

    //帮他砍价
    dohelp: `https://${host}/bargain/dohelp`,

    //绑定设备
    binddevice: `https://${host}/users/binddevice`,
    //我的和编辑设备
    mydevice: `https://${host}/users/mydevice`,
    //视频详情
    video_detail: `https://${host}/web/video_detail`,
    //视频列表
    video_list: `https://${host}/web/get_video_list`,
    //评论列表
    article_list: `https://${host}/web/article_list`,

    //文章详情
    article_detail: `https://${host}/web/article_detail`,

    //文章详情
    game_match: `https://${host}/web/game_match`,

    //我的分销链接接口
    shareparams: `https://${host}/distributor/shareparams`, 

    //抓拍活动介绍
    activity_intr: `https://${host}/web/activity_intr`,
      
    //商城编号
    appidOpt:`1014`

};

module.exports = config