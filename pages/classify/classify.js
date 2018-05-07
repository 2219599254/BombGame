// pages/classify/classify.js
var classifyNames = require("../../config.js").classifyNames;
var classifyGoodsList = require("../../config.js").classifyGoodsList;
Page({
  data: {
    scrollTo: 0,
    index:0,
    addclass: ["addclass", "", "", "", "", ""],
    loading_stadus:'none',
    classify_name_list:[
      { tid: '1',  classify_name: '休闲食品系列'},
      { tid: '2',  classify_name: '酱料系列' },
      { tid: '3',  classify_name: '休闲系列' },
      { tid: '4',  classify_name: '食品系列' },
      { tid: '5',  classify_name: '猪肉系列' },
      { tid: '6',  classify_name: '牛肉系列' },
      { tid: '7',  classify_name: '木鱼系列' },
      { tid: '8',  classify_name: '休品系列' }
    ],
    currentTid: ''
  },
  onLoad: function (options) {
    let that = this;
    var currentTid = wx.getStorageSync('currentTid');
    //没错(只能请求一次)分类不建议使用

    // for (var i = 0; i < that.data.classify_name_list.length; i++) {
    //   if (that.data.currentTid == that.data.classify_name_list[i].tid) {
    //     var goods_name = that.data.classify_name_list[i].classify_name;
    //   }
    // }
    // that.setData({
    //   classify_name_list: that.data.classify_name_list,
    //   goods_name: goods_name
    // });

  },
  onShow: function (options) {
    //展示默认项（页面一改变就请求）
    let that = this;
    
    if (wx.getStorageSync('index_classify')==true){
        
        var currentTid = wx.getStorageSync('currentTid');
        that.setData({
          currentTid: currentTid
        })

        wx.request({
          url: classifyNames + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid") + '&classify_id=' + currentTid, //仅为示例，并非真实的接口地址
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var $classify_name_list = res.data.msg.classify_name_list;
            var index_classify = false;
            wx.setStorageSync('index_classify', index_classify)

            for (var i = 0; i < $classify_name_list.length; i++){
              if (currentTid === $classify_name_list[i].tid){
                var goods_name  = $classify_name_list[i].classify_name;
              }
            }

            that.setData({
              classify_name_list: $classify_name_list,
              goods_name: goods_name
            });
          }
        })

        wx.request({

          url: classifyGoodsList + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid") + '&classify_id=' + currentTid, //仅为示例，并非真实的接口地址
          data: {
            // classify_id: currentTid
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var $classify_goods_list = res.data.msg.classify_goods_list;

            that.setData({
              classify_goods_list: $classify_goods_list,
              currentTid: currentTid
            });
          },
          complete:function(res){
            // that.setData({
            //   loading_stadus: 'none'
            // })
          }
        })
    }else{

      wx.request({
        url: classifyNames + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var $default_classify = res.data.msg.default_classify;
          var goods_name = res.data.msg.classify_name_list[0].classify_name;

          var $classify_name_list = res.data.msg.classify_name_list;
          var $classify_name_listLength = res.data.msg.classify_name_list.length;
          console.log($classify_name_listLength);

          for (var i = 0; i < $classify_name_listLength; i++) {
            if ($classify_name_list[i].default_classify == 0) {
              var currentTid = $classify_name_list[i].tid;
              console.log(currentTid);
              wx.request({
                url: classifyGoodsList + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid") + '&classify_id=' + currentTid, //仅为示例，并非真实的接口地址
                data: {
                  // classify_id: currentTid
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  var $classify_goods_list = res.data.msg.classify_goods_list;

                  that.setData({
                    classify_goods_list: $classify_goods_list,
                    currentTid: currentTid
                  });
                },
                complete: function (res) {
                  console.log(res)
                }
              })
            }
          }

          that.setData({
            classify_name_list: $classify_name_list,
            goods_name: goods_name
          });
        }
      })
    }

  },
  click_change: function (event) {

    console.log("我被点击了")
    let that = this;

    var currentTid = event.currentTarget.dataset.tid;
    var goods_name = event.currentTarget.dataset.name;

    if (that.data.currentTid === currentTid) {
      return false;
    }else{
      that.setData({
        currentTid: event.currentTarget.dataset.tid
      })

      wx.request({
        url: classifyGoodsList + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid") + '&classify_id=' + currentTid, //仅为示例，并非真实的接口地址
        data: {
          // classify_id: currentTid
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var $classify_goods_list = res.data.msg.classify_goods_list;

          that.setData({
            classify_goods_list: $classify_goods_list,
            goods_name: goods_name
          });

          // wx.hideLoading()//隐藏hide-loading弹窗
        },
        complete: function () {

        }
      })
    }
    
  },
  onReady: function () {
  
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