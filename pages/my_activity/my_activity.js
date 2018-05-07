// pages/my_activity/my_activity.js
var myactivity = require("../../config.js").myactivity;
var myActivitydetail = require("../../config.js").myActivitydetail;
var shareparams = require("../../config.js").shareparams;
Page({
  data: {
    showModal_cont: '这是初始值',
    custom_showModal: false
  },
  onLoad: function (options) {
    var $aid = options.aid;

    let that = this;
    wx.request({
      url: myActivitydetail + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      data: {
        aid: $aid
      },
      success: function (res) {
        if(res.data.code == 0){
          that.setData({
            banner: res.data.msg.banner,
            detail: res.data.msg.detail
          });
          var $mid = res.data.msg.detail.mid;
          wx.setStorageSync('activity_mid', $mid)
        }else if(res.data.code == 10000){
          that.setData({
            showModal_cont: res.data.msg,
            custom_showModal: true
          })
          setTimeout(function () {
            that.setData({
              custom_showModal: false
            })
          }, 1400)
        }
      }
    })

    if (!wx.getStorageSync("dtb_sid")){
      wx.request({
        url: shareparams + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
        data: {},
        success: function (res) {
          var $info = res.data.msg;
          wx.setStorageSync('dtb_sid', $info.dtb_sid)
          wx.setStorageSync('md5_rtime', $info.md5_rtime)
          wx.setStorageSync('share_title', $info.share_title)
          wx.setStorageSync('share_pic', $info.share_pic)
        }
      })

    }


  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  click_check_more: function (e) {
    var mid = e.currentTarget.dataset.mid;
    wx.navigateTo({
      url: '/pages/cut_down_record/cut_down_record?mid='+mid
    })
  },
  //立即购买
  click_goto_product_detail: function (e) {
    var $gid = e.currentTarget.dataset.gid;
    wx.redirectTo({
      url: '/pages/product_detail/product_detail?gid=' + $gid
    })
  },
  onShareAppMessage: function () {
    return {
      // wx.getStorageSync("share_title")
      title: wx.getStorageSync("share_title"),

      path: '/pages/help_bargain/help_bargain?dtb_sid=' + wx.getStorageSync("dtb_sid") + "&md5_rtime=" + wx.getStorageSync("md5_rtime") + "&mid=" + wx.getStorageSync("activity_mid") + "&uid=" + wx.getStorageSync("uid"),

      imageUrl: wx.getStorageSync("share_pic"),

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