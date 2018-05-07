// pages/distri_page/distri_page.js
var distri_status = require("../../config.js").distri_status;
var apply_distri = require("../../config.js").apply_distri; 
Page({
  data: {
    submit: "block",
    text: "我要成为分销人" ,
    default_show_or_hide:"none"
  },
  onLoad: function (options) {
    //初始化default
    wx.setStorageSync('default_dtb', '')
  },
  onReady: function () {
  
  },
  onShow: function () {
    let that = this;
    wx.request({
      url: distri_status + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var my_code = res.data.code;
        if (my_code == 0) {
          var $dtb_status = res.data.msg.dtb_status;
          
          if ($dtb_status == '3') {
            console.log('成功成为分销人！')

          } else if ($dtb_status == '2') {
            if (wx.getStorageSync('default_dtb') == ''){
              wx.showModal({
                title: '提示',
                content: '申请已被拒绝',
                showCancel: false,
                confirmColor: "#f10000",
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }else{

            }
            
          } else if ($dtb_status == '1') {
            console.log('我在申请中！')

          } else if ($dtb_status == '4') {
            console.log('账号被冻结！')
          }
          that.setData({
            my_code: my_code,
            dtb_status: $dtb_status
          })

        } else {
          that.setData({
            my_code: my_code
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  calling: function (e) {
    var phone = e.currentTarget.dataset.phone;
    console.log(phone);
    wx.makePhoneCall({
      phoneNumber: '4008004072', //电话号码
    })
  },
  calling2: function (e) {
    var phone = e.currentTarget.dataset.phone;
    console.log(phone);
    wx.makePhoneCall({
      phoneNumber: '4008004072', //电话号码
    })
  },
  formSubmit: function (e) {
    
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    //固话验证规则：区号 + 号码，区号以0开头，3位或4位号码由7位或8位数字组成;
    // RegExp = /^((0\d{2,3}-\d{7,8})|(1[35874]\d{9}))$/;
    RegExp = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
    if (e.detail.value.name == '') {
      wx.showModal({
        title: '请输入您的姓名',
        showCancel:false,
        confirmColor:"#ff3939"
      })
    } else if (e.detail.value.phone == '') {
      wx.showModal({
        title: '请输入您的手机号码',
        showCancel: false,
        confirmColor: "#ff3939"
      })
    } else if (RegExp.test(e.detail.value.phone) == false) {
      wx.showModal({
        title: '请输入正确的号码格式',
        showCancel: false,
        confirmColor: "#ff3939"
      });
    } else {
      let that = this;
      wx.showModal({
        title: '请确认您的联系电话',
        content: '申请人联系电话：' + e.detail.value.phone,
        // showCancel: false,
        confirmColor: "#ff3939",
        success: function (res) {
          if (res.confirm) {
            // 111111111111111
            wx.request({
              url: apply_distri + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
              data: {
                phone_number: e.detail.value.phone,
                real_name: e.detail.value.name,
                code: e.detail.value.code
              },
              method: "POST",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                // wx.showModal({
                //   title: '提交成功！',
                //   success: function (res) {}
                // })
                if (res.data.code == '10000') {
                  wx.showModal({
                    title: res.data.msg,
                    showCancel: false,
                    confirmColor: "#ff3939"
                  })
                }
                wx.request({
                  url: distri_status + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
                  data: {},
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    var my_code = res.data.code;

                    if (my_code == 0) {
                      var $dtb_status = res.data.msg.dtb_status;
                      if ($dtb_status == '3') {
                        console.log('成功成为分销人！')

                      } else if ($dtb_status == '2') {

                        wx.showModal({
                          title: '提示',
                          content: '申请已被拒绝',
                          showCancel: false,
                          confirmColor: "#ff3939",
                          success: function (res) {
                            if (res.confirm) {
                              console.log('用户点击确定')
                            }
                            // this.setData({
                            //   submit: "none"
                            // })
                          }
                        })

                      } else if ($dtb_status == '1') {
                        console.log('我在申请中！')

                      } else if ($dtb_status == '4') {
                        console.log('账号被冻结！')
                      }
                      that.setData({
                        my_code: my_code,
                        dtb_status: $dtb_status
                      })

                    } else {
                      that.setData({
                        my_code: my_code
                      })
                    }
                  },
                  fail: function (res) {
                    console.log(res)
                  }
                })
              },
              fail: function (res) {

              }
            })
            // 111111111111111
          }
        }
      })
      

    }
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