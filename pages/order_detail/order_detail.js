// pages/order_detail/order_detail.js
var ordersDetails = require("../../config.js").ordersDetails;
var removeOrders = require("../../config.js").removeOrders;
var immediatePayment = require("../../config.js").immediatePayment;
var wxTimer = require('../../common/wxTimer.js'); 
var collectFormId = require("../../config.js").collectFormId;
var confirm_receipt = require("../../config.js").confirm_receipt; 
Page({
  data: {
  
  },
  onLoad: function (options) {
    var status = options.status;
    var orders_number = options.orders_number;
    console.log(status)
    console.log(orders_number)

    let that = this;

    wx.request({
      url: ordersDetails + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
      data: {
        status: status,
        orders_number: orders_number
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var code_stadus = res.data.code;
        var $orders_info = res.data.msg.orders_info;//存data的全部数据
        var orders_status = $orders_info.orders_status;//订单状态
        var orders_payment_surplus_time = $orders_info.orders_payment_surplus_time;

        if (code_stadus == 0){
          // 计时器插件
          if (orders_payment_surplus_time) {
            wxTimer.wxTimer.call(that, orders_payment_surplus_time, function () {
              wx.navigateBack({
                delta: 1
              });
            });
          }

          that.setData({
            orders_info: $orders_info,
            orders_status: orders_status
          })
        }else{
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      },
      fail: function (res) {
        console.log(res)
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    });

  },
  onShow: function () {
  
  },
  cancel_order: function (e) {
    let that = this

    var orders_id = e.currentTarget.dataset.orderid;
    var orders_encode = e.currentTarget.dataset.oedercode;
    wx.showModal({
      title: '提示',
      content: '确定取消该订单吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: removeOrders + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
            data: {
              orders_id: orders_id,
              orders_encode: orders_encode
            },
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              wx.navigateBack({
                delta: 1
              });
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  go_payment: function (e) {
    let that = this

    var orders_id = e.currentTarget.dataset.orderid;
    var orders_encode = e.currentTarget.dataset.oedercode;
    wx.request({
      url: immediatePayment + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      data: {
        appidOpt: wx.getStorageSync('appidOpt'),
        orders_id: orders_id,
        orders_encode: orders_encode
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data.msg);
        var $data = res.data.msg;
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
              duration: 1000
            });
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/my_order/my_order?currentTab=2&otype=receive'
              });
            }.bind(that), 1000)
            
          },
          'fail': function (res) { }
        })
      }
    })
  },
  confirm_receipt: function (e) {
    let that = this
    var orders_id = e.currentTarget.dataset.orderid;
    var orders_encode = e.currentTarget.dataset.ordercode;

    wx.showModal({
      title: '提示',
      content: '确定收货？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: confirm_receipt + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
            data: {
              orders_id: orders_id,
              orders_encode: orders_encode
            },
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              //成功刷新页面
              
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/my_order/my_order?currentTab=0&otype=pay'
                });
              }.bind(that), 500)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });

  },
  copy: function (res) {
    wx.setClipboardData({
      data: res.currentTarget.dataset.account,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })
  },
  calling: function (e) {
    var phone = e.currentTarget.dataset.phone;
    console.log(phone);
    wx.makePhoneCall({
      phoneNumber: '4008004072', //电话号码
    })
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
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
  onShareAppMessage: function () {
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