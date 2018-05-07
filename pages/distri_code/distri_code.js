// pages/distri_code/distri_code.js
var myWxacode = require("../../config.js").myWxacode;
Page({
  data: {
  
  },
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: myWxacode + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var code_img = res.data.msg.dtb_wxacode_img;
        that.setData({
          code_img: code_img
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
  
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
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
  click_qrimg: function (e) {
    var current = e.currentTarget.dataset.img
    wx.previewImage({
      current: e.currentTarget.dataset.img, // 当前显示图片的http链接
      urls: [current] // 需要预览的图片http链接列表
    })
  }
})