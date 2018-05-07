// pages/onekey_modular_detail/onekey_modular_detail.js
var select_data = require("../../config.js").select_data;
var WxParse = require('../../wxParse/wxParse.js');
var select_data = require("../../config.js").select_data;
Page({
  data: {
    refresh_box: false,
    my_id: 1
  },
  onLoad: function (options) {
    var that = this;
    var my_id = options.id;
    // var $type = options.type;

    that.setData({
      my_id: my_id
    })

    that.problem_detail(my_id);//问题详情

  },
  problem_detail: function (my_id) {

    var that = this;
    wx.request({
      url: select_data,
      data: {
        aa: 'xcx_education_detail',
        id: my_id
      },
      method: "Get",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ refresh_box: false })//隐藏断网提示

        var problem_detail = res.data.msg;
        that.setData({ problem_detail: problem_detail})
        var article_content = problem_detail.content;

        WxParse.wxParse('article', 'html', article_content, that, 5);

      },
      fail: function () {
        that.setData({ refresh_box: true })//显示断网提示
      },
      complete: function () {
        console.log()
      }
    })
  },
  reloadClick: function (res) {//刷新页面，从新请求接口
    var that = this;
    var my_id = that.data.my_id
    that.problem_detail(my_id)
  },
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync("shareTitle"),
      path: '/pages/index/index?uid=' + wx.getStorageSync("uid"),
      imageUrl: wx.getStorageSync("imageUrl"),
      success: function (res) {
        // wx.showToast({
        //   title: '已发送邀请'
        // })
      },
      fail: function (res) {
        console.log(res)
      }
    }
  }
})