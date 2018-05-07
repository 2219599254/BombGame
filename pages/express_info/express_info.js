// pages/express_info/express_info.js  
var logisticsInformation = require("../../config.js").logisticsInformation;
Page({
  data: {
  
  },
  onLoad: function (options) {
    var orders_id = options.orderid;
    var orders_encode = options.ordercode;
    var that = this;
    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: logisticsInformation + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      data: {
        orders_id: orders_id,
        orders_number: orders_encode
      },
      method: "Get",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var info_list = res.data.msg;

        that.setData({
          info_list: info_list
        })
      },
      complete:function(){
          wx.hideLoading()
      }
    })
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
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