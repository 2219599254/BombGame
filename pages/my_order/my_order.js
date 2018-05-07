// pages/my_order/my_order.js
var orderTotal = require("../../config.js").orderTotal; 
var common = require("../../common/common.js");
var removeOrders = require("../../config.js").removeOrders; 
var immediatePayment = require("../../config.js").immediatePayment;
var confirm_receipt = require("../../config.js").confirm_receipt;
var order_total_stadus = require("../../config.js").order_total_stadus; 
var collectFormId = require("../../config.js").collectFormId;
var app = getApp();
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    isStatus: 'pay',//10待付款，20待发货，30待收货 40、50已完成
    page: 0,
    refundpage: 0,
    orderList0: [],
    orderList1: [],
    orderList2: [],
    orderList3: [],
    orderList4: []
  },
  onLoad: function (options) {
    var currentTab = parseInt(options.currentTab);

    this.initSystemInfo();
    if (options == '') {
      this.setData({
        currentTab: 0,
        isStatus: 'pay'
      });
    } else {
      this.setData({
        currentTab: parseInt(options.currentTab),
        isStatus: options.otype
      });
    }

    if (this.data.currentTab == 4) {
      this.loadReturnOrderList();

    } else if (this.data.currentTab == 0) {

      console.log(this.data.currentTab)
      this.loadOrderWholeList();

    } else {
      this.loadOrderList(this.data.currentTab);
    }
  },
  onShow: function (options) {
    
  },
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype
      });

      //没有数据就进行加载
      switch (that.data.currentTab) {
        case 0:
          // !that.data.orderList0.length && that.loadOrderList();
          that.loadOrderWholeList();
          break;
        case 1:
          // !that.data.orderList1.length && that.loadOrderList();
          that.loadOrderList(1);
          break;
        case 2:
          // !that.data.orderList2.length && that.loadOrderList();
          that.loadOrderList(2);
          break;
        case 3:
          // !that.data.orderList3.length && that.loadOrderList();
          that.loadOrderList(3);
          break;
        case 4:
          that.data.orderList4.length = 0;
          that.loadReturnOrderList();
          break;
      }
    };
  },
  loadOrderWholeList: function(){
    let that = this

    wx.request({
      url: orderTotal + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      data: {},
      success: function (res) {
        console.log(res.data.msg);
        var orders = res.data.msg.orders;

        for (var i = 0; i < orders.length; i++) {
          if (orders[i].orders_status == '1') {
            that.setData({
              num_one_default: 'none'
            })
          } else if (orders[i].orders_status == '2') {
            that.setData({
              num_two_default: 'none'
            })
          } else if (orders[i].orders_status == '3') {
            that.setData({
              num_three_default: 'none'
            })
          }
        }
        that.setData({
          orders: orders
        })
      },
      complete: function (res) {
        console.log('完成订单渲染')
      }
    })
  },
  //滑动swiper改变相应的currentTab
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    if (this.data.currentTab == 0) {
      that.loadOrderWholeList();
    }else{
      that.loadOrderList(this.data.currentTab)
    }
  },
  loadOrderList: function (currentTab) {
    var that = this;
    wx.request({
      url: order_total_stadus + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      method: 'Get',
      data: {
        orders_status: currentTab
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //--init data        
        var status = res.data.status;
        var orders_list = res.data.msg.orders;

        switch (that.data.currentTab) {
          case 0:
            that.setData({
              orderList0: orders_list,
            });
            break;
          case 1:
            that.setData({
              orderList1: orders_list,
            });
            break;
          case 2:
            that.setData({
              orderList2: orders_list,
            });
            break;
          case 3:
            that.setData({
              orderList3: orders_list,
            });
            break;
          case 4:
            that.setData({
              orderList4: orders_list,
            });
            break;
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  getOrderStatus: function () {
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ? 2 : this.data.currentTab == 3 ? 3 : 0;
  },
  initSystemInfo: function () {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  //取消订单
  cancel_order: function(e){
    let that = this

    var orders_id = e.currentTarget.dataset.orderid;
    var orders_encode = e.currentTarget.dataset.oedercode;
    wx.showModal({
      title: '提示',
      content: '确定取消该订单吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: removeOrders + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
            data: {
              orders_id: orders_id,
              orders_encode: orders_encode
            },
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              // that.loadOrderList(that.data.currentTab)
              if (that.data.currentTab == 0) {
                that.loadOrderWholeList();
              } else {
                that.loadOrderList(that.data.currentTab)
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  //去支付
  go_payment: function (e) {
    let that = this

    var orders_id = e.currentTarget.dataset.orderid;
    var status = parseInt(e.currentTarget.dataset.status) + 1;//支付成功加1
    console.log(status)
    var orders_encode = e.currentTarget.dataset.oedercode;
    wx.request({
      url: immediatePayment + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      data: {
        appidOpt: wx.getStorageSync('appidOpt'),
        orders_id: orders_id,
        orders_encode: orders_encode
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data.msg);
        var $data = res.data.msg;
        wx.requestPayment({
          'timeStamp': $data.timeStamp,
          'nonceStr': $data.nonceStr,
          'package': $data.package,
          'signType': $data.signType,
          'paySign': $data.paySign,
          'success': function (res) {
            wx.showToast({
              title: '购买成功',
              icon: 'success',
              duration: 1000
            });
            wx.navigateTo({
              url: '/pages/order_detail/order_detail?status=' + status +'&orders_number=' + orders_encode
            })
          },
          'fail': function (res) {
            setTimeout(function () {
              wx.showToast({
                title: '您已经取消支付',
                duration: 1000
              })
            }.bind(that), 500)
            
          }
        })
      }
    })
  },
  confirm_receipt:function(e){
    let that = this
    var orders_id = e.currentTarget.dataset.orderid;
    var orders_encode = e.currentTarget.dataset.oedercode;

    wx.showModal({
      title: '提示',
      content: '确定收货？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: confirm_receipt + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
            data: {
              orders_id: orders_id,
              orders_encode: orders_encode
            },
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              //成功刷新页面
              that.loadOrderList(that.data.currentTab)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
    
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value, e.detail.formId)
    let that = this;
    wx.request({
      url: collectFormId + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
      data: {
        formid: e.detail.formId
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)

      },
      fail: function (res) {
        console.log(res)
      }
    })
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
  },
  navigator_classify:function(){
    wx.redirectTo({
      url: '/pages/index/index?jump_id=2',
    });
  }
})