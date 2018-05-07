// pages/my_address/my_address.js
var deliveryAddress = require("../../config.js").deliveryAddress;
var addDelAddress = require("../../config.js").addDelAddress;
Page({
  data: {
    submit: "block",
    text: "保存",
    del_province: '省',
    del_city: '市',
    del_area: '区县',
    customItem: '全部',
    region: ['广东省', '广州市', '海珠区']
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var regions = e.detail.value;

    wx.setStorageSync('receiver_province', regions[0])
    wx.setStorageSync('receiver_city', regions[1])
    wx.setStorageSync('receiver_area', regions[2])
    this.setData({
      del_province: regions[0],
      del_city: regions[1],
      del_area: regions[2]
    })
  },
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: deliveryAddress + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var $userInfo = res.data.msg.userinfo.user_del_address;
        console.log($userInfo);
        if ($userInfo){
          wx.setStorageSync('receiver_province', $userInfo.del_province)
          wx.setStorageSync('receiver_city', $userInfo.del_city)
          wx.setStorageSync('receiver_area', $userInfo.del_area)
          console.log(res)
          that.setData({
            receiver_username: $userInfo.del_name,
            receiver_phone: $userInfo.del_phone,
            del_province: $userInfo.del_province,
            del_city: $userInfo.del_city,
            del_area: $userInfo.del_area,
            receiver_address_detail: $userInfo.del_detail
          });
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  onReady: function () {
  
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    RegExp = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
    if (e.detail.value.name == '') {
      wx.showModal({
        title: '请输入姓名',
      })
    } else if (e.detail.value.phone == '') {
      wx.showModal({
        title: '请输入手机号码',
      })
    } else if (e.detail.value.phone.length !== 11) {
      wx.showModal({
        title: '手机号码输入错误',
      })
    } else if ((wx.getStorageSync('receiver_province')) == '') {
      wx.showModal({
        title: '请选择收货地址',
      })
    }else if (e.detail.value.del_detail == '') {
      wx.showModal({
        title: '请输入地址详情',
      })
    } else {
      this.setData({
        submit: "none",
        text: "保存中..."
      })
      wx.request({
        url: addDelAddress + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
        data: {
          receiver_username: e.detail.value.name,
          receiver_phone: e.detail.value.phone,
          receiver_province: wx.getStorageSync('receiver_province'),
          receiver_city: wx.getStorageSync('receiver_city'),
          receiver_area: wx.getStorageSync('receiver_area'),
          receiver_address_detail: e.detail.value.del_detail
        },
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          wx.showToast({
            title: '保存成功！',
            icon: 'success',
            duration: 2000,
            success: function (res) {
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1
                })
              },1000)
              
            }
          })
        },
        fail: function (res) {

        }
      })
    }
  },
  onShow: function () {
  
  },
  onHide: function () {
  
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