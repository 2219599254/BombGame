// pages/share_page/share_page.js
var shareparams = require("../../config.js").shareparams;
Page({

  data: {
    mask_show_or_hide: true
  },
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: shareparams + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var my_msg =  res.data.msg;

        if (res.data.code == 0 && res.data.msg){//能进这里肯定是分销人/多余的一步
          var dtb_sid = res.data.msg.dtb_sid, 
            md5_rtime = res.data.msg.md5_rtime,
            share_title = res.data.msg.share_title,
            share_img = res.data.msg.share_pic;

          wx.setStorageSync('dtb_sid', dtb_sid)
          wx.setStorageSync('md5_rtime', md5_rtime)
          wx.setStorageSync('share_title', share_title)
          wx.setStorageSync('share_img', share_img)
        }else{

        }
        
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  yesIDo(res) {
    var that = this;
    that.setData({
      mask_show_or_hide : false
    })
  },
  shareToFriend() {
    var that = this;
    that.setData({
      mask_show_or_hide: true
    })
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