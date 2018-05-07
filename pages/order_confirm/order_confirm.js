// pages/order_confirm/order_confirm.js
var prepareBuildOrders = require("../../config.js").prepareBuildOrders;
var unifiedOrders = require("../../config.js").unifiedOrders; 
var collectFormId = require("../../config.js").collectFormId;
Page({
  data: {
    address_stadus: true,
    my_account_money:0,
    pre_orders_sum_fare_price:0,
    click_change_tatol_price: 0,
    pre_orders_enable_conpons_num:0,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    change_img: "https://shop1.helpmake.cn/images/icon/20170830174423.png",
    change_img2: "https://wx.helpmake.cn/images/wx/hide.png",
    is_integral:0,//这是积分兑换得的钱
    exchange:2,
    integral_style: false,
  },
  onLoad: function (options) {
    //初始化优惠券id和留言
    wx.setStorageSync('start_ccid', '')
    wx.setStorageSync('remarks', '')
    
  },
  onReady: function () {

  },
  onShow: function () {
    let that = this;
    wx.request({
      url: prepareBuildOrders + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
      data: {
        orders_goods_id_list: wx.getStorageSync("buy_array")
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        var $data = res.data.msg.pretreatment_orders;
        var $pro_list = res.data.msg.pretreatment_orders.pre_orders_goods_list;
        var $address_stadus = res.data.msg.pretreatment_orders.pre_orders_receiver_address;

        var $coupon_defauld_price = $data.pre_orders_discount_price;//优惠券默认总计
        var $coupon_defauld_id = $data.pre_orders_default_couponsid;//优惠券id
        wx.setStorageSync('start_ccid', $coupon_defauld_id);//存储默认优惠券id
        var $coupon_defauld_cut_price = $data.pre_orders_cut_price;//优惠券优惠价格

        var account_money = res.data.msg.pretreatment_orders.pre_orders_sum_price;//总价并保存到本地
        wx.setStorageSync('account_money', account_money)

        var pre_orders_sum_fare_price = res.data.msg.pretreatment_orders.pre_orders_sum_fare_price;//总运费并保存到本地
        wx.setStorageSync('pre_orders_sum_fare_price', pre_orders_sum_fare_price)

        var integral_limit = $data.integral.integral_limit;//商城限制满多少积分兑换
        var user_integral = $data.integral.user_integral;//可兑换的积分
        var integral_cut_price = $data.integral.integral_cut_price//初始保存可兑换积分的钱
        wx.setStorageSync('integral_cut_price', integral_cut_price)

        that.setData({
          $data : $data,//最大数据
          pro_list: $pro_list,//// 用户要购买的商品列表
          address_stadus: $address_stadus,//地址状态
          pre_orders_enable_conpons_num: $data.pre_orders_enable_conpons_num,//优惠券数量

          my_account_money: $data.pre_orders_sum_price,// 该订单商品预计总价格
          
          pre_orders_sum_fare_price: $data.pre_orders_sum_fare_price, // 该订单预计总运费

          orders_goods_id_list: res.data.msg.pretreatment_orders.pre_orders_goods_id_list,// 用户要购买的商品详情Id列表
          pre_orders_enable_conpons_list: $data.pre_orders_enable_conpons_list,// 该订单可用优惠券列表

          //有默认优惠券
          click_change_tatol_price: $coupon_defauld_cut_price,
      
          integral: $data.integral,//积分存web
          user_integral: parseFloat(user_integral),
          integral_limit: parseFloat(integral_limit)
        })
        if (!$coupon_defauld_price){
            that.setData({
              account_money: ($data.pre_orders_sum_price * 100 + pre_orders_sum_fare_price * 100 ) / 100,//初始动态计算的总计和实付
            })
        }else{
          that.setData({
            
            account_money: ($coupon_defauld_price*100 + pre_orders_sum_fare_price*100)/100//优惠券存在的情况下
          })
        }

        if (parseFloat(user_integral) >= parseFloat(integral_limit)) {//判断积分是否达到限制
          that.setData({
            integral_style: true
          })
        } else {
          that.setData({
            integral_style: false
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  onUnload: function () {

  },
  switch2Change: function (e) {
    let that = this;
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    var switch_change = e.detail.value;
    if (that.data.integral_style){

      if (switch_change == true) {//打开按钮

        var account_money = (that.data.my_account_money * 100 + wx.getStorageSync('pre_orders_sum_fare_price') * 100 - wx.getStorageSync("integral_cut_price") * 100 - that.data.click_change_tatol_price * 100) / 100
        wx.setStorageSync('exchange', 1)

        that.setData({
          account_money: account_money,
          is_integral: wx.getStorageSync("integral_cut_price"),
          exchange: 1
        })

      } else { //关闭

        var account_money = (that.data.my_account_money * 100 + wx.getStorageSync('pre_orders_sum_fare_price') * 100 - 0 - that.data.click_change_tatol_price * 100) / 100
        wx.setStorageSync('exchange', 2)
        that.setData({
          account_money: account_money,
          is_integral: 0,
          exchange: 2
        })
      }
    }else{
      that.setData({
        switch_change: false
      })
    }
    
    console.log(that.data.exchange)
  },
  //立即支付
  payMoney: function () {
    let that = this;
    console.log(that);
    if (that.data.address_stadus == ''){
      wx.showToast({
        title: '请填写收货地址',
        icon: 'success',
        duration: 1000
      });
    }else{
      
      wx.request({
        url: unifiedOrders + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
        method: "POST",
        data: {
          appidOpt: wx.getStorageSync('appidOpt'),
          uaid: that.data.address_stadus.aid,
          conpons_id: wx.getStorageSync('start_ccid'),
          orders_goods_id_list: JSON.stringify(that.data.orders_goods_id_list),
          remarks: wx.getStorageSync('remarks'),
          exchange: that.data.exchange
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          var my_code = res.data.code,
            is_msg = res.data.msg;
          if (my_code == 10000){
            wx.showToast({
              title: is_msg,
              icon: 'loading',
              duration: 1500
            })
          }else{

            wx.showLoading({ title: '支付接口调用中' })//提示语
            var $data = res.data.msg;

            setTimeout(function () {
              wx.hideLoading()

              if ($data.integralPayStatus == 'SUCCESS') {

                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 800
                });
                setTimeout(function () {
                  wx.redirectTo({
                    url: "/pages/my_order/my_order?currentTab=2&otype=receive"
                  })
                }, 900)

              } else {
                wx.requestPayment({
                  'timeStamp': $data.timeStamp,
                  'nonceStr': $data.nonceStr,
                  'package': $data.package,
                  'signType': $data.signType,
                  'paySign': $data.paySign,
                  'success': function (res) {
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 800
                    });
                    setTimeout(function () {
                      wx.redirectTo({
                        url: "/pages/my_order/my_order?currentTab=2&otype=receive"
                      })
                    }, 800)
                  },
                  'fail': function (res) {
                    wx.showLoading({ title: '已取消支付' })
                    setTimeout(function () {
                      wx.redirectTo({
                        url: "/pages/my_order/my_order?currentTab=0&otype=pay"
                      })
                    }, 800)
                  }
                })
                
              }
              
            }, 800)
          }
          
        },
        fail: function (res) {
          console.log(res)
        }
      });
    }
  },
  // 弹窗
  chooseCoupons: function (e) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(898).step();

    this.setData({
      animationData: animation.export()
    })

    if (e.currentTarget.dataset.status == 1) {
      this.setData({
        showModalStatus: true,
        buttom_sure_btn1: 'none',
        buttom_sure_btn2: 'block'
      });
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData({
          showModalStatus: false,
        });
      }
    }.bind(this), 200)
  },
  //选择优惠券
  right_off_use: function(e){
    var currentCcid = e.currentTarget.dataset.ccid;
    wx.setStorageSync('start_ccid', currentCcid);
    
    var conpons_type = e.currentTarget.dataset.type;
    var cut_price = e.currentTarget.dataset.cut;

    console.log(currentCcid);
    console.log(conpons_type);
    console.log(this.data.account_money)

    if (conpons_type == 'mr') {

      var pre_orders_sum_fare_price = wx.getStorageSync('pre_orders_sum_fare_price');//运费
      var click_change_tatol_price = (cut_price*100)/100;//优惠十元
      if (this.data.exchange == 1){
        var account_money = wx.getStorageSync('account_money') + pre_orders_sum_fare_price - wx.getStorageSync("integral_cut_price") - cut_price
      } else if (this.data.exchange == 2){
        var account_money = wx.getStorageSync('account_money') + pre_orders_sum_fare_price - 0 - cut_price
      }

      console.log(account_money)

      this.setData({
        showModalStatus: false,
        account_money: account_money.toFixed(2),
        click_change_tatol_price: parseFloat(click_change_tatol_price.toFixed(2))
      });

    } else if (conpons_type == 'dc') {

      var pre_orders_sum_fare_price = wx.getStorageSync('pre_orders_sum_fare_price');//运费
      var click_change_tatol_price = (wx.getStorageSync('account_money')*100 - (wx.getStorageSync('account_money')*cut_price*100))/ 100;//优惠8折

      if (this.data.exchange == 1){
        var account_money = pre_orders_sum_fare_price + wx.getStorageSync('account_money')*cut_price - wx.getStorageSync("integral_cut_price")
      } else if(this.data.exchange == 2){
        var account_money = pre_orders_sum_fare_price + wx.getStorageSync('account_money') * cut_price
      }
      console.log(account_money)

      this.setData({
        showModalStatus: false,
        account_money: account_money.toFixed(2),
        click_change_tatol_price: parseFloat(click_change_tatol_price.toFixed(2))
      });

    }

    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(898).step();

    this.setData({
      animationData: animation.export()
    })

    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
    }.bind(this), 200)
  },
  //输入框改变
  remarksValueInput: function (event) {
    var that = this;
    var value = event.detail.value;
    wx.setStorageSync('remarks', event.detail.value)
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
  }
})