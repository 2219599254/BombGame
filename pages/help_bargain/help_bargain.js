// pages/help_bargain/help_bargain.js
var dohelp = require("../../config.js").dohelp;
var dohelppage = require("../../config.js").dohelppage;
var openIdUrl = require("../../config.js").openIdUrl;
var appidOpt = require("../../config.js").appidOpt;
Page({
  data: {
    showModal_cont:'这是初始值',
    custom_showModal:false
  },
  onLoad: function (options) {
    var $mid = options.mid;
    var $shareuid = options.uid;

    wx.setStorageSync('activity_mid', $mid)
    wx.setStorageSync('activity_uid', $shareuid)


    let that = this;
    var dtb_sid = options.dtb_sid;
    var md5_rtime = options.md5_rtime;

    that.setData({
      dtb_sid: options.dtb_sid == undefined ? '' : options.dtb_sid,
      md5_rtime: options.md5_rtime == undefined ? '' : options.md5_rtime
    })
    //类似login
    var newUrl = '';
    if (dtb_sid == '' && md5_rtime == '') {
      newUrl = openIdUrl;
    } else {
      newUrl = openIdUrl + "?dtb_sid=" + dtb_sid + "&md5_rtime=" + md5_rtime;
    }

    if (wx.getStorageSync("uid") == "") {
      wx.login({
        success: function (res) {
          console.log(res.code);
          if (res.code) {
            //发起网络请求
            wx.request({
              url: newUrl,
              data: {
                code: res.code,
                appidOpt: appidOpt
              },
              success: function (res) {
                console.log(res);
                wx.setStorageSync("openid", res.data.msg.openid);
                wx.setStorageSync("uid", res.data.msg.uid);

                wx.request({
                  url: dohelppage + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid") + "&dtb_sid=" + dtb_sid + "&md5_rtime=" + md5_rtime,
                  data: {
                    mid: wx.getStorageSync("activity_mid"),
                    shareuid: wx.getStorageSync("activity_uid")
                  },
                  success: function (res) {

                    that.setData({
                      banner: res.data.msg.banner,
                      introduce: res.data.msg.introduce,
                      product: res.data.msg.product
                    });

                  }
                })
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    } else {
      wx.request({
        url: dohelppage + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid") + "&dtb_sid=" + dtb_sid + "&md5_rtime=" + md5_rtime,
        data: {
          mid: wx.getStorageSync("activity_mid"),
          shareuid: wx.getStorageSync("activity_uid")
        },
        success: function (res) {

          that.setData({
            banner: res.data.msg.banner,
            introduce: res.data.msg.introduce,
            product: res.data.msg.product
          });

        }
      })
    }
    
  },
  help_bargain_fu:function(){
    let that = this;
    wx.request({
      url: dohelp + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      data: {
        mid: wx.getStorageSync('activity_mid'),
        helperuid: wx.getStorageSync('activity_uid')
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if(res.data.code == 0){
          setTimeout(function () {
            wx.hideLoading()
            that.setData({
              username: res.data.msg.username,
              cutprice: res.data.msg.cutprice,
              showModalStatus: true
            });
          }, 800)
        } else if (res.data.code == 10000){
          that.setData({
            showModal_cont: res.data.msg,
            custom_showModal:true
          })
          setTimeout(function () {
            that.setData({
              custom_showModal: false
            })
          }, 2000)
          
        }
        

      }
    })
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
  go_to_activity: function (e) {
    wx.redirectTo({
      url: '/pages/activity/activity'
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
      title: "快来，快来，活动砍价中，我需要你的支援！",
      path: '/pages/help_bargain/help_bargain?dtb_sid=' + wx.getStorageSync("dtb_sid") + "&md5_rtime=" + wx.getStorageSync("md5_rtime") + "&mid=" + wx.getStorageSync("activity_id") + "shareuid=" + wx.getStorageSync("uid"),
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
  }
})