// pages/problem_detail/problem_detail.js
var select_data = require("../../config.js").select_data;
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    refresh_box: false,
    my_id: 1
  },
  onLoad: function (options) {
    var that = this;
    var my_id = options.id;
    var $type = options.type;

    that.setData({
      my_id: my_id
    })

    that.problem_detail(my_id,$type);//问题详情

  },
  problem_detail: function (my_id, $type) {
    let that = this;

    switch($type)
    {
      case "1":
        var $aa = "xcx_company_honor_detail"
        break;

      case "2":
        var $aa = "xcx_company_news_detail"
        break;

      case "3":
        var $aa = "xcx_industry_news_detail"
        break;

      case "4":
        var $aa = "xcx_faq_detail"
        break;                


    };
    wx.request({
      url: select_data,
      data: {
        aa: $aa,
        id: my_id
      },
      method: "Get",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ refresh_box: false })//隐藏断网提示

        var problem_detail = res.data.msg;
        that.setData(problem_detail)
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
  onReady: function () {

  },
  onShow: function () {

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