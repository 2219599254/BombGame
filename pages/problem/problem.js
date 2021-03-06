// pages/official_details/official_details.js
var select_data = require("../../config.js").select_data;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    interval: 5000,
    duration: 1000,
    banner_list: "/images/13.jpg"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this;
    wx.request({
      url: select_data, //仅为示例，并非真实的接口地址
      data: {
        aa:"xcx_faq",
        page:1,
        limit:20
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          "new_list":res.data.msg
        });
      }
    });
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
  //预览图片
  img: function (e) {
    //console.log(e);
    var arr = e.target.dataset.arr;
    var img = e.target.dataset.img;
    wx.previewImage({
      current: img, // 当前显示图片的http链接  
      urls: arr  // 需要预览的图片http链接列表  
    })
  }
})