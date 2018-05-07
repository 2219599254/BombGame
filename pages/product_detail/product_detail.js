// pages/product_detail/product_detail.js
var productDetail = require("../../config.js").productDetail;
var addItem = require("../../config.js").addItem; 
var collectFormId = require("../../config.js").collectFormId;
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    unit:'件',
    freight_style:'none',
    munber:1,
    select:0,
    buy_num:1,
    currentIndex1:0,
    currentIndex2:0,
    choosed_goods:[],
    $info_sold_num:0,
    mun_rmb:'',
    rmb_min_max:[]
  },
  banner_preview: function (e) {
    wx.previewImage({
      current: e.target.dataset.img, // 当前显示图片的http链接
      urls: wx.getStorageSync('$banner_list') // 需要预览的图片http链接列表
    })
  },
  banner_preview2: function (e) {
    wx.previewImage({
      current: e.target.dataset.img, // 当前显示图片的http链接
      urls: wx.getStorageSync('$img_info_list') // 需要预览的图片http链接列表
    })
  },
  onLoad: function (options) {
    let that = this;
    var request_gid = options.gid;
    console.log(request_gid);
    wx.setStorageSync('goods_id', request_gid)//加入购物车或立即购买第一参数
    wx.setStorageSync('buy_num', 1)//初始化购买数量

    if (wx.getStorageSync("openid") == ''){
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: newUrl,
              data: {
                code: res.code,
                appidOpt: 1014
              },
              success: function (res) {
                console.log(res);
                wx.setStorageSync("openid", res.data.msg.openid);
                wx.setStorageSync("uid", res.data.msg.uid);
                that.detailInfo();
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }else {
      that.detailInfo();
    }

    
  },
  detailInfo:function(){
    let that = this;
    wx.request({
      url: productDetail + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid") + "&request_gid=" + wx.getStorageSync("goods_id"), //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        var $info = res.data.msg;
        var $info_sold_num = $info.sold_num;//已售数量
        var $banner_list = $info.banner_list;
        var $img_info_list = $info.img_info_list;
        var $goods_detail_title = $info.goods_title;
        wx.setStorageSync('goods_detail_title', $goods_detail_title)//用于转发分享时，提供的标题
        wx.setStorageSync('$banner_list', $banner_list)//为图片预览用
        wx.setStorageSync('$img_info_list', $img_info_list)//为图片预览用2

        var $main_style_options = $info.main_style_options
        wx.setStorageSync('$main_style_options', $main_style_options)
        wx.setStorageSync('main_style_id', $main_style_options[0].msid)//加入购物车或立即购买第二参数（默认）

        var $sub_style_options = $info.sub_style_options
        wx.setStorageSync('$sub_style_options', $sub_style_options)
        wx.setStorageSync('sub_style_id', $sub_style_options[0].ssid)//加入购物车或立即购买第三参数（默认）
        
       
        if ($info.main_style_options.length>1){
          //获取最低价格和最高价格
        //新建一个数组，用于存放价格
          var arr_rmb = [];
          console.log($info.main_style_options);
          for (var i = 0; i < $info.main_style_options.length; i++) {
            arr_rmb.push($info.main_style_options[i].discount_price);
          }
          console.log(arr_rmb);
          //获取最小值和最大值
         // console.log(Math.max.apply(null, arr_rmb));
          //console.log(Math.min.apply(null, arr_rmb));
          var m_max = Math.max.apply(null, arr_rmb);
          var m_min = Math.min.apply(null, arr_rmb);
          var arr = [];
          if (m_max == m_min){
            arr=[];
          }else{
            arr.push(m_min);
            arr.push(m_max);
          }
          console.log(arr);
          that.setData({
            rmb_min_max: arr
          })
        }
        

        that.setData({
          $info: $info,
          $info_sold_num: $info_sold_num,
          $discount_price: $main_style_options[0].discount_price,
          $pro_num: res.data.msg.repertory,
          activity: res.data.msg.activity
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  onReady: function () {
  
  },
  onShow: function () {
    let that = this;
    if (wx.getStorageSync('shopping_join_cart') !== '') {
      var shopping_join_cart = wx.getStorageSync('shopping_join_cart');
      that.setData({
        shopping_join_cart: shopping_join_cart
      })
    }else{
      wx.setStorageSync('shopping_join_cart', false)
      that.setData({
        shopping_join_cart: false
      })
    }
    
  },
  onReachBottom: function () {
  
  },
  jump_to_index:function(){
    wx.redirectTo({
      url: '/pages/index/index?jump_id=2'
    })
  },
  // 弹窗
  setModalStatus: function (e) {
    console.log("我被点击了")
    var choosed_goods = [];
    console.log("我被点击了")
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    var $main = wx.getStorageSync('$main_style_options');
    var $sub = wx.getStorageSync('$sub_style_options');

    choosed_goods[0] = $main[0].main_style_tags;
    choosed_goods[1]= $sub[0].sub_style_tags;
    console.log(choosed_goods)
    //对初始数组进行-排空值处理
    for (var i = 0, len = choosed_goods.length; i<len;i++){
      if (choosed_goods[i]==''){
        choosed_goods.splice(i,1);
        len--;
      }
    }
    console.log(choosed_goods)
    wx.setStorageSync('choosed_goods', choosed_goods)

    this.animation = animation
    animation.translateY(898).step();

    this.setData({
      animationData: animation.export(),
      choosed_goods: choosed_goods
    })

    if (e.currentTarget.dataset.status == 1) {
      this.setData({
          showModalStatus: true,
          buttom_sure_btn1: 'none',
          buttom_sure_btn2: 'block'
      });
    } else if (e.currentTarget.dataset.status == 2){
      this.setData({
        showModalStatus: true,
        buttom_sure_btn1: 'block',
        buttom_sure_btn2: 'none'
      });
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData({
            showModalStatus: false
          });
      }
    }.bind(this), 200)
  },
  setModalStatus2:function(e){
    var stadus = e.currentTarget.dataset.status;
    var $aid = e.currentTarget.dataset.aid;//商家发布的活动id
    if (stadus == 1){
      wx.navigateTo({
        url: '/pages/activity/activity',
      })
    } else if (stadus == 2){
      wx.navigateTo({
        url: '/pages/my_activity/my_activity?aid=' + $aid,
      })
    }
    
  },
  //点击商品属性一
  click_choose1:function(e){
    var that = this;
    var Index = e.currentTarget.dataset.index;
   
    var $main = wx.getStorageSync('$main_style_options')
    
    for (var i = 0; i<$main.length; i++){
      if (i == Index ){
          wx.setStorageSync('$main_style', $main[i].main_style_tags);
          wx.setStorageSync('main_style_id', $main[i].msid);//加入购物车或立即购买第二参数（点击本地的改变）
          that.setData({
            $discount_price: $main[i].discount_price,
            // $pro_num: $main[i].repertory
            $pro_num: that.data.$info.repertory
          })
        }
    }
   // console.log(this.data.$discount_price);

    var choosed_goods = wx.getStorageSync('choosed_goods');
        
    choosed_goods[0] = wx.getStorageSync('$main_style');
   // console.log(wx.getStorageSync('$main_style'));

    //重组数组,改变计算金额
    wx.setStorageSync('choosed_goods', choosed_goods);
    wx.setStorageSync('buy_num', 1);
    that.setData({
      buy_num:1,
      mun_rmb: (wx.getStorageSync('buy_num') * this.data.$discount_price).toFixed(2),
      currentIndex1: Index,
      choosed_goods: choosed_goods
    });
  },
  //点击商品属性二
  click_choose2: function (e) {
    var that = this;
    var Index = e.currentTarget.dataset.index;
    console.log(Index);

    var $sub = wx.getStorageSync('$sub_style_options')
    for (var i = 0; i < $sub.length; i++) {
      if (i == Index) {
        wx.setStorageSync('$sub_style', $sub[i].sub_style_tags);
        wx.setStorageSync('sub_style_id', $sub[i].ssid);//加入购物车或立即购买第三参数（点击本地的改变）
      }
    }

    var choosed_goods = wx.getStorageSync('choosed_goods');
    choosed_goods[1] = wx.getStorageSync('$sub_style');
    //重组数组
    wx.setStorageSync('choosed_goods', choosed_goods);

    that.setData({
      currentIndex2: Index,
      choosed_goods: choosed_goods
    });
  },
  // 加减
  changeNum: function (e) {
    // var that = this;
    if (e.target.dataset.alphaBeta == 0) {
      if (parseInt(this.data.buy_num) <= 1) {
        this.setData({
          buy_num: 1
        })
      } else {
        this.setData({
          buy_num: parseInt(this.data.buy_num) - 1
        })
        wx.setStorageSync('buy_num', this.data.buy_num)//加入购物车或立即购买第四参数（点击改变初始）
      };
      
    } else {
      this.setData({
          buy_num: parseInt(this.data.buy_num) + 1
      })
      wx.setStorageSync('buy_num', this.data.buy_num)//加入购物车或立即购买第四参数（点击改变初始）
  
    };
    // console.log( wx.getStorageSync('buy_num'));
    // console.log(this.data.$discount_price);
    // console.log(wx.getStorageSync('buy_num') * this.data.$discount_price);
    //改变价格
    this.setData({
      mun_rmb: (wx.getStorageSync('buy_num') * this.data.$discount_price).toFixed(2)
    })
  },
  //输入框改变
  bindManual: function (event){
    var that = this ;
    that.setData({
      buy_num: event.detail.value
    })
    wx.setStorageSync('buy_num', this.data.buy_num)//加入购物车或立即购买第四参数（点击改变初始）
    // console.log(wx.getStorageSync('buy_num') * this.data.$discount_price);
    //改变价格
    this.setData({
      mun_rmb: (wx.getStorageSync('buy_num') * this.data.$discount_price).toFixed(2)
    })
  },
  //确定加入购物车
  add_item_cart:function(e){
    var that = this;
    wx.request({
      url: addItem + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
      data: {
        goods_id: wx.getStorageSync('goods_id'),
        main_style_id: wx.getStorageSync('main_style_id'),
        sub_style_id: wx.getStorageSync('sub_style_id'),
        buy_num: wx.getStorageSync('buy_num')
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var my_code = res.data.code,
            is_msg = res.data.msg;

        if(my_code == 10000){
          wx.showToast({
            title: is_msg,
            icon: 'loading',
            duration: 1500
          })
        }else{
          wx.showToast({
            title: '成功加入购物车！',
            icon: 'success',
            duration: 2000,
            success: function (res) {
              that.setData({
                showModalStatus: false
              });
            }
          })

          that.setData({
            shopping_join_cart: true
          })
          wx.setStorageSync('shopping_join_cart', true)
        }

      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  //跳转到订单详情页面--
  sure_build_orders:function(e){
    var $array = [{
      gid: wx.getStorageSync('goods_id'),
      msid: wx.getStorageSync('main_style_id'),
      ssid: wx.getStorageSync('sub_style_id'),
      buy_num: wx.getStorageSync('buy_num')
    }];

    wx.setStorageSync("buy_array",$array);

    wx.navigateTo({
      url: '/pages/order_confirm/order_confirm'
    });

  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value, e.detail.formId)
    let that = this;
    wx.request({
      url: collectFormId + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
      data: {
        formid: e.detail.formId
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)

      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  onShareAppMessage: function (res) {

    if (wx.getStorageSync("dtb_sid")) {
      return {
        title: wx.getStorageSync("share_title"),
        path: '/pages/index/index?dtb_sid=' + wx.getStorageSync("dtb_sid") + "&md5_rtime=" + wx.getStorageSync("md5_rtime"),
        imageUrl: wx.getStorageSync("share_img"),
        success: function (res) {
          // wx.showToast({
          //   title: '已发送邀请'
          // })
        },
        fail: function (res) {
          console.log(res)
        }
      }
    } else {
      return {
        title: '快来吧，快来吧，这里好多惊喜！',
        path: '/pages/index/index',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  },
  //运费详情
  freight_icon:function(e){
    // console.log(e.currentTarget.dataset.number);
    var munber = e.currentTarget.dataset.number;
    if (munber==1){
      this.setData({
        freight_style:'block',
        munber:2,
        right_icon: '/images/up.png'
      });
    } else if (munber == 2){
      this.setData({
        freight_style: 'none',
        munber: 1,
        right_icon: '/images/down.png'
      });
    }
  }

})