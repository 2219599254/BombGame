// pages/my_coupon/my_coupon.js
var myCoupons = require("../../config.js").myCoupons;
Page({
  data: {
    opacity: "0.4",
    change_img: "https://shop1.helpmake.cn/images/icon/20170830174423.png",
    change_img2: "https://wx.helpmake.cn/images/wx/hide.png"
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
  
  },
  onShow: function () {
    let that = this;
    wx.request({
      url: myCoupons + "?openid=" + wx.getStorageSync("openid") + "&uid=" + wx.getStorageSync("uid"), //仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        that.setData({
          "coupons_list": res.data.msg.conpons_list
        })
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
  },
  click_get_coupon: function () {
    let that = this;
    wx.showToast({
      title: '领取成功',
      icon: 'success',
      duration: 2000
    })
  }
})