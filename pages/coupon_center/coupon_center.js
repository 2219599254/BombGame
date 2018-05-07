// pages/coupon_center/coupon_center.js
var couponsCenter = require("../../config.js").couponsCenter;
var takeCoupons = require("../../config.js").takeCoupons;
Page({
  data: {
  
  },
  onLoad: function (options) {
    let that = this;

    wx.request({
      url: couponsCenter + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var coupons_list = res.data.msg.coupons_list;

        that.setData({
          coupons_list: coupons_list
        })
      },
      fail: function (res) {
        console.log(res)
      }
    });
  },
  onReady: function () {
    
  },
  onShow: function () {
  
  },
  click_get_coupon: function (res) {
    console.log(res);
    var $scid = res.currentTarget.dataset.scid;
    console.log($scid);
    let that = this;

    wx.request({
      url: takeCoupons + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        scid: $scid
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 1000
          });
          
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '你已经领取了优惠券',
            showCancel: false,
            confirmText: "我知道了",
            confirmColor: "#f10000",
            success: function (res) {

            }
          })
        }
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