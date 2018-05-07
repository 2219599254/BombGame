// pages/picture_detail/picture_detail.js  
var article_detail = require("../../config.js").article_detail;
var join = require("../../config.js").join;
var shareparams = require("../../config.js").shareparams;
Page({
  data: {
    parent:true,
    content:'',
    article_detail_imamgelist:[]
  },
  onLoad: function (options) {
    wx.hideShareMenu();

    var commentid = options.commentid;
    wx.setStorageSync('commentid', commentid)
    this.detail_onload_fn(commentid);

    if (!wx.getStorageSync("dtb_sid")) {
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
  detail_onload_fn: function (commentid){
    let that = this;
    wx.request({
      url: article_detail + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      data: {
        id: commentid
      },
      success: function (res) {
        var $article_detail = res.data.msg.detail;
        var $common_list = res.data.msg.list;
        that.setData({
          article_detail: $article_detail,
          list: $common_list,
          article_detail_imamgelist: $article_detail.banner
        })
      }
    })
  },
  previewImage:function(e){
    var currentImage = e.currentTarget.dataset.img;
    wx.previewImage({
      current: currentImage, // 当前显示图片的http链接
      urls: this.data.article_detail_imamgelist // 需要预览的图片http链接列表
    })
  },
  commet_click_praise: function (e) {//攻略点赞
    //请求数据
    var that = this;
    var commentid = e.currentTarget.dataset.commentid;
    var commentype = e.currentTarget.dataset.type;

    wx.request({
      url: join + "?uid=" + wx.getStorageSync("uid"),
      data: {
        aa: 'prize',
        type: commentype,
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

          //请求数据
          that.detail_onload_fn(commentid);

        }

      }
    })
  },
  bindinput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  send_comment: function (e) {//发送评论
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
          oid: wx.getStorageSync('commentid'),
          content: that.data.content
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.setData({ receiver_phone: '', content:''})
          if (res.data.code == 0) {
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 1000
            })
            var commentid = wx.getStorageSync("commentid")
            //请求数据
            that.detail_onload_fn(commentid);

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
        if (res.data.code == 0){
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 1000
          })
          
          setTimeout(function () {
            that.detail_onload_fn(wx.getStorageSync("commentid"));
          }, 500)

        }

      }
    })
  },
  comment_share_btn: function (e) {
    this.setData({
      shareid: e.currentTarget.dataset.shareid
    })
    console.log(this.data.shareid)

    var shareid = e.currentTarget.dataset.shareid;
    wx.setStorageSync('shareid', shareid)
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
      title: wx.getStorageSync("share_title"),
      path: '/pages/picture_detail/picture_detail?commentid=' + aaaa,
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