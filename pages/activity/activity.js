// pages/activity/activity.js
var activity = require("../../config.js").activity;
var join_activity = require("../../config.js").join_activity;

Page({
  data: {
  
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    var that = this;
    that.is_onShow_fu();
  },
  is_onShow_fu:function(){
    let that = this;
    wx.request({
      url: activity + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      data: {},
      success: function (res) {
        that.setData({
          banner: res.data.msg.banner,
          product: res.data.msg.product
        });
      }
    })
  },
  i_am_join: function (e) {
    wx.showLoading()
    var $aid = e.currentTarget.dataset.id;
    wx.setStorageSync('activity_aid', $aid)
    this.setData({
      kjid:$aid
    });
      let that = this;
      wx.request({
        url: join_activity + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
        data: {
          id: $aid
        },
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          setTimeout(function () {
            wx.hideLoading()
            that.setData({
              username: res.data.msg.username,
              cutprice: res.data.msg.cutprice,
              showModalStatus: true
            });
          }, 800)

        }
      })
      // wx.navigateTo({
      //   url: '/pages/my_activity/my_activity'
      // })
  },
  setModalStatus: function (e) {
    var that = this;
    // vasr aaa = e.currentTarget.dataset.status;

    if (e.currentTarget.dataset.status == 1) {
      that.setData({
        showModalStatus: false,
      });
      that.is_onShow_fu()

    } else if (e.currentTarget.dataset.status == 2) {
      that.setData({
        showModalStatus: true
      });
      that.is_onShow_fu()
    }
  },
  go_to_my_activity: function (e) {
    var $aid = e.currentTarget.dataset.id;
    wx.setStorageSync('activity_aid', $aid)
    
    setTimeout(function(){
      wx.navigateTo({
        url: '/pages/my_activity/my_activity?aid=' + wx.getStorageSync('activity_aid')
      })
    },300)
    
  },
  onShareAppMessage: function () {
  
  }
})