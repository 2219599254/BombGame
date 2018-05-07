// pages/video_detail/video_detail.js
var video_detail = require("../../config.js").video_detail;
var join = require("../../config.js").join;
Page({
  data: {
    content:''
  },
  onLoad: function (options) {
    wx.hideShareMenu();
    console.log(options);
    var videoid = options.videoid;
    var videourl = options.videourl;

    wx.setStorageSync('videoid', videoid)
    wx.setStorageSync('videourl', videourl)

    this.detail_onload_fn(videoid);
  },
  detail_onload_fn: function (videoid) {
    let that = this
    wx.request({
      url: video_detail + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      data: {
        id: videoid
      },
      success: function (res) {
        var $video_detail = res.data.msg.detail;
        var $common_list = res.data.msg.list;
        that.setData({
          video_detail: wx.getStorageSync("videourl"),
          list: $common_list
        })
      }
    })
  },
  bindinput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  send_comment: function (e) {
    console.log('我被电击了')
    var that = this;
    var commentype = e.currentTarget.dataset.type;
    if (that.data.content == "") {
      wx.showToast({
        title: '请输入内容',
        image: '/images/rr.png',
        duration: 1000
      })
    } else {
      wx.request({
        url: join + "?uid=" + wx.getStorageSync("uid"),
        data: {
          aa: 'comment',
          type: commentype,
          oid: wx.getStorageSync('videoid'),
          content: that.data.content
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.setData({ receiver_phone: '', content: '' })
          if (res.data.code == 0) {
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 1000
            })
            var videoid = wx.getStorageSync("videoid")
            //请求数据
            that.detail_onload_fn(videoid);

          }

        }
      })

    }

  },
  commet_click_praise2: function (e) {//攻略点赞
    //请求数据
    var that = this;
    var commentid = e.currentTarget.dataset.commentid;
    var commenttype = e.currentTarget.dataset.type;
    wx.request({
      url: join + "?uid=" + wx.getStorageSync("uid"),
      data: {
        aa: 'prize',
        type: commenttype,
        oid: commentid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 1000
          })

          setTimeout(function () {
            that.detail_onload_fn(wx.getStorageSync("videoid"));
          }, 500)

        }

      }
    })
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
  },
  onShareAppMessage: function (res) {
    var that = this;
    console.log(wx.getStorageSync("shareid"))
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
      var aaaa = res.target.dataset.shareid;
    }
    return {
      title: "途沃得教您如何避免违章",
      path: '/pages/video_detail/video_detail?videoid=' + wx.getStorageSync("videoid") + "&videourl=" + wx.getStorageSync("videourl"),
      imageUrl: wx.getStorageSync("share_pic"),
      success: function (res) {
        // 转发成功
        that.setData({ is_sign: false })
      },
      fail: function (res) {
        // 转发失败
      },
      complete: function (res) {
        // 操作完成
      }
    }
  }
})