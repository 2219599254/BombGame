// pages/upload_raiders/upload_raiders.js
var uploadContent = require("../../config.js").join;
Page({
  data: {
    banner_list: [],
    raidersInput: ''
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  upload_image: function () {
    var that = this;
    // var $banner_length = wx.getStorageSync("banner_list_2").length;
    wx.chooseImage({
      // count: 4 - $banner_length,
      count: 9,
      sizeType: ["compressed"],
      success: function (res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths

        for(var $i=0;$i <tempFilePaths.length;$i++){
          console.log(tempFilePaths[$i]);
          wx.uploadFile({
            url: 'https://wx.toworld-tech.cn/manager/uploadimages', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[$i],
            name: 'banner',
            formData: {
              'fieldname': 'banner'
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              var $img_url = JSON.parse(res.data).msg.img_url[0];
              // var $banner_list = wx.getStorageSync("banner_list_2");
              let $banner_list = that.data.banner_list
              $banner_list.push($img_url);
              that.setData({
                banner_list: $banner_list
              });
              wx.setStorageSync("banner_list_2", $banner_list);
            },
            fail: function (res) {
              //console.log(res);
            },
            complete: function (res) {
              // console.log(res);
            }
          })
        }
        
        // if (i == len - 1) {
        //   wx.hideLoading();
        // }        
        // for (var i = 0, len = tempFilePaths.length; i < len; i++) {
        //   wx.uploadFile({
        //     url: 'https://wx.toworld-tech.cn/manager/uploadimages', //仅为示例，非真实的接口地址
        //     filePath: tempFilePaths[i],
        //     name: 'img',
        //     formData: {
        //       "uid": wx.getStorageSync("uid"),
        //       "types": "2"
        //     },
        //     header: {
        //       'content-type': 'application/json'
        //     },
        //     success: function (res) {
        //       var $img_url = JSON.parse(res.data).msg.url;
        //       var $banner_list = wx.getStorageSync("banner_list_2");
        //       console.log($img_url)
        //       return
        //       $banner_list.push($img_url);
        //       that.setData({
        //         banner_list: $banner_list
        //       });
        //       wx.setStorageSync("banner_list_2", $banner_list);
        //     },
        //     fail: function (res) {
        //       console.log(res);
        //     },
        //     complete: function (res) {
        //       // console.log(res);
        //     }
        //   })
        //   if (i == len - 1) {
        //     wx.hideLoading();
        //   }
        // }
      },
      fail: function () {
        wx.hideLoading();
      }
    })
  },
  preview_image: function (res) {
    console.log(res.target);
    console.log(res.target.dataset.img);
    wx.previewImage({
      current: res.target.dataset.img, // 当前显示图片的http链接
      urls: wx.getStorageSync("banner_list_2") // 需要预览的图片http链接列表
    })
  },
  formSubmit(e) {
    let raidersInput = e.detail.value.raiders

    if (!raidersInput.trim()) {
      wx.showToast({
        title: '请输入分享攻略哦！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var that = this;
    wx.request({
      url: uploadContent + "?uid=" + wx.getStorageSync("uid") , //仅为示例，并非真实的接口地址
      data: {
        aa: 'article',
        banner: JSON.stringify(that.data.banner_list),
        content: raidersInput
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '发布成功！',
            icon: 'success',
            duration: 2000,
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          },1000)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })

  },
  deteleImg(e) {
    console.log(e.currentTarget.dataset.img)
    let $banner_list = this.data.banner_list
    $banner_list.splice(e, 1)
    this.setData({
      banner_list: $banner_list
    })
  },
  onShareAppMessage: function () {

  }
})