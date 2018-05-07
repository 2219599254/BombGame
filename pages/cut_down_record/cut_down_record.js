// pages/cut_down_record/cut_down_record.js
var dohelprecords = require("../../config.js").dohelprecords;
Page({
  data: {},
  onLoad: function (options) {
    var $mid = options.mid
    console.log($mid)
    let that = this;
    wx.request({
      url: dohelprecords + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      data: {
        mid: $mid,
        page: 10,
        limit: 20
      },
      success: function (res) {

        that.setData({
          banner: res.data.msg.banner,
          records: res.data.msg.records
        });

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
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
  },
  onShareAppMessage: function () {
  
  }
})