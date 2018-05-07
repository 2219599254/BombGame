// pages/withdraw_page/withdraw_page.js
var withdrawCash = require("../../config.js").withdrawCash;
var cardinfo = require('../../config').cardinfo;
Page({
  data: {
    del_province: '省',
    del_city: '市',
    del_area: '区县',
    region: [],
    apply_sum:'',//金额,
    pay_account:'',//账号
    card_name:'',  //银行名称
    array: ['微信支付', '支付宝支付', '银行卡支付'],
    account_number:'微信号',
    account_name:'微信昵称',
    nameShow: false,
    notice_cont:'请输入昵称'
  },
  onLoad: function (options) {
      
  },
  onReady: function () {
      //加载
    // var that=this;
    // wx.request({
    //   url: cardinfo +"?uid="+wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
    //   data: {
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     if (res.data.code==0){
    //       //console.log(res.data.msg.card);
    //       //数组地址
    //       var arr_region=[];
    //       var mun = res.data.msg.card;
    //       arr_region.push(mun.province);
    //       arr_region.push(mun.city);
    //       arr_region.push(mun.area);
    //       that.setData({
    //         //金额
    //         apply_sum: mun.apply_sum,
    //         //账号
    //         pay_account: mun.pay_account,
    //         //卡号地址
    //         del_province: mun.province,
    //         del_city: mun.city,
    //         del_area: mun.area,
    //         region: arr_region,
    //         //支行名称
    //         remarks: mun.remarks,
    //         card_name: mun.card_name
    //       })
         
    //     }
    //   },
    //   fail: function (res) {

    //   }
    // })
  },
  bindPickerChange: function (e) {
    // var that = this;
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var aaaa = e.detail.value
    console.log(e.detail.value)

    this.setData({
      index: e.detail.value
    })
    if (e.detail.value == 2) {
      this.setData({
        nameShow: true,
        account_number: '银行账号',
        account_name: '银行名称',
        notice_cont: '如：中国工商银行'
      })
    } else if (e.detail.value == 1) {
      this.setData({
        nameShow: false,
        account_number: '支付宝账号',
        account_name: '姓名',
        notice_cont: '请输入您的姓名'
      })
    } else if (e.detail.value == 0) {
      this.setData({
        nameShow: false,
        account_number: '微信号',
        account_name: '微信昵称',
        notice_cont: '请输入昵称'
      })
    }
  },
  bindBlur: function (event){
    
    console.log(event.detail.value)
    this.setData({
      currentMoney: event.detail.value
    })
    wx.setStorageSync('currentMoney', event.detail.value)
  },
  formSubmit: function (e) {
    var that = this;
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    RegExp = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
    if (e.detail.value.money == '') {
      wx.showModal({
        title: '请输入金额',
        showCancel: false
      })
    }
    else if (e.detail.value.account == '') {
      wx.showModal({
        title: '请输入账号',
        showCancel: false
      })
    }
    // else if (e.detail.value.card_name == '') {
    //   wx.showModal({
    //     title: '请输入银行名称',
    //     showCancel: false
    //   })
    // }
    // else if (that.data.region.length == 0) {
    //   wx.showModal({
    //     title: '请选择卡号地址',
    //     showCancel: false
    //   })
    // } 
    // else if (e.detail.value.remarks == '') {
    //   wx.showModal({
    //     title: '请输入支行名称',
    //     showCancel: false
    //   })
    // }
    else {
      console.log(e.detail.value.card_name);
      wx.request({
        url: withdrawCash + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"), //仅为示例，并非真实的接口地址
        data: {
           money: e.detail.value.money,
            province: that.data.region[0],
            city:  that.data.region[1],
            area:  that.data.region[2],
            account: e.detail.value.account,//账号
            pay_way:'银行账户',
            card_name:e.detail.value.card_name,
            remarks: e.detail.value.remarks
        },
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          var code_stadus = res.data.code;
           if(res.data.code == 10000) {
          wx.showModal({
            title: res.data.msg,
            showCancel: false,
            confirmColor: "#ff3939"
          })
        }else{
            wx.showToast({
              title: '已提交后台审核！',
              icon: 'success',
              duration: 1000,
              success: function (res) {
                setTimeout(function () {
                  wx.navigateTo({
                    url: '/pages/personal_center/personal_center'
                  })
                }, 1000)

              }

            })
          }
          
        },
        fail: function (res) {
          wx.showToast({
            title: '提现申请失败！',
            icon: 'loading',
            duration: 1000
          })
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
  },
  //编辑卡号地址
  bindRegionChange: function (e) {
    this.data.region=[];
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var regions = e.detail.value;
    this.setData({
      del_province: regions[0],
      del_city: regions[1],
      del_area: regions[2]
    })
    //放到数组中
    this.data.region.push(regions[0]);
    this.data.region.push(regions[1]);
    this.data.region.push(regions[2]);
  }
})