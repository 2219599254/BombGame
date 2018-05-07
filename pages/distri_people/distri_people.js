// pages/distri_people/distri_people.js 
var my_members = require("../../config.js").my_members;
Page({
  data: {
  
  },
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: my_members + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var members = res.data.msg.members;
        that.setData({
          members: members
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