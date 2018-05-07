// pages/withdraw_record/withdraw_record.js
var cashApplyRecords = require("../../config.js").cashApplyRecords;
Page({
  data: {
      
  },
  onLoad: function (options) {
    let that = this ;

    wx.request({
      url: cashApplyRecords + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        var $apply_records = res.data.msg.apply_records;
        that.setData({
          apply_records: $apply_records
        })
      }
    })
  },
  onReady: function () {
  
  },
  onShow: function () {
  
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