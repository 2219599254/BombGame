var join = require("../../config.js").join;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    submit: "提交",
    submit1: "block",
    imgUrls: [
      'https://wx.helpmake.cn/images/shops/56/lian_xi.jpg'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000

  },
  banner_preview: function (e) {
    wx.previewImage({
      current: e.target.dataset.img, // 当前显示图片的http链接
      urls: [
        'https://wx.helpmake.cn/images/shops/56/lian_xi.jpg'
      ] // 需要预览的图片http链接列表
    })
  },
  phone: function () {
    wx.makePhoneCall({
      phoneNumber: '4008004072', //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

  navigation: function (res) {
    var $id = res.currentTarget.dataset.id;
    var $name = "葆德公司";
    var $address = "宝安区沙井后亭地铁B出口厚德群文化创意园二楼";
    var $lng = 113.826010;
    var $lat = 22.752260;
    wx.openLocation({
      latitude: $lat,
      longitude: $lng,
      scale: 16,
      name: $name,
      address: $address
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.removeStorageSync('index')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    RegExp = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
    if (e.detail.value.name == '') {
      wx.showModal({
        title: '请输入您的姓名',
      })
    }
    else if (e.detail.value.phone == '') {
      wx.showModal({
        title: '请输入您的电话号码',
      })
    } else if (e.detail.value.city == '') {
      wx.showModal({
        title: '请输入您所在的城市',
      })
    }
     else if (RegExp.test(e.detail.value.phone) == false) {
      wx.showModal({
        title: '请输入正确的号码格式',
      });
    } 
    else {
      this.setData({
        submit1: "none",
        submit: "提交中..."
      })
      wx.request({
        url: join, //仅为示例，并非真实的接口地址
        data: {
          aa:"join",
          city: e.detail.value.city,
          name: e.detail.value.name,
          phone: e.detail.value.phone,
          remark: e.detail.value.message,
        },
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          wx.showModal({
            title: '提交成功！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.reLaunch({
                  url: '/pages/index/index'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.reLaunch({
                  url: '/pages/index/index'
                })
              }
            }
          })
        },
        fail: function (res) {

        }, complete: function () {
          console.log('接口调用结束');
        }
      })


    }
  },

})