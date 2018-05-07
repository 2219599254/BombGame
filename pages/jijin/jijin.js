//index.js
//获取应用实例
var openIdUrl = require("../../config.js").openIdUrl;
var shopPage = require("../../config.js").shopPage;
var unionGetUidUrl = require("../../config.js").unionGetUidUrl;
var unionIdUrl = require("../../config.js").unionIdUrl;
var unionIdUrl = require("../../config.js").unionIdUrl;
var takeCoupons = require("../../config.js").takeCoupons;
var index = require("../../config.js").index;
var homePage = require("../../config.js").homePage;
var register_info = require("../../config.js").register_info;
var video_list = require("../../config.js").video_list;
var article_list = require("../../config.js").article_list;
var game_match = require("../../config.js").game_match;
var select_data = require("../../config.js").select_data;
var join = require("../../config.js").join;
var activity_intr = require("../../config.js").activity_intr;
var shareparams = require("../../config.js").shareparams;
var WxParse = require('../../wxParse/wxParse.js');
//商城编号
var appidOpt = require("../../config.js").appidOpt;
var app = getApp()
Page({

  data: {
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    change_img: 'https://shop1.helpmake.cn/upload/images/icon/20170824135555.png',
    dtb_sid: '',
    md5_rtime: '',
    g_name: '',
    g_id: '',
    block1: 'none',
    block2: 'none',
    block3: 'block',
    block4: 'none',
    block5: 'none',
    icon1: "/images/icon2_1.png",
    icon2: "/images/icon5_2.png",
    icon4: "/images/icon4_1.png",
    icon5: "/images/icon1_1.png",
    active1: "",
    active2: "active",
    active4: "",
    active5: "",
    custom_service: 'none',
    my_wallet: 0,
    my_integral: 0,
    my_nickName: '',
    my_avatarUrl: '/images/icon4.png',
    change_type: true,
    change_type1: true,
    change_type2: false,
    change_type3: false,
    change_type_num:1,
    onekey_modular: true,
    camera_story_madul_1: true,
    video: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
  },
  onReachBottom: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    let that = this;
    var $type_num = that.data.change_type_num; //当前是哪个模块显示

    //视屏列表下拉刷新
    if ($type_num==2){
      setTimeout(function () {
        wx.request({
          url: video_list + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
          data: {
            page: wx.getStorageSync("page") + 1,
          },
          success: function (res) {
            if (wx.getStorageSync("page") == res.data.msg.page) {
              return;
            }
            var $video_list = res.data.msg.data;

            var $video_list_result = wx.getStorageSync("video_list");

            wx.setStorageSync("page", wx.getStorageSync("page") + 1);
            wx.setStorageSync("video_list", $video_list_result.concat($video_list));


            that.setData({
              video_list: wx.getStorageSync("video_list")
            });
            wx.hideNavigationBarLoading() //在标题栏中显示加载
          },
          complete: function () {

          }
        })
      }, 800);
    } else if ($type_num == 3){
      //文章列表下拉刷新
      setTimeout(function () {
        wx.request({
          url: article_list + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
          data: {
            page: wx.getStorageSync("page_article")+1,
            limit: 10
          },
          success: function (res) {
            var $article_list = res.data.msg;

            that.data.article_list = $article_list;

            var $video_list_result = wx.getStorageSync("article_list_pull");
            wx.setStorageSync("page_article", wx.getStorageSync("page_article") + 1);
            wx.setStorageSync("article_list_pull", $video_list_result.concat($article_list));
            that.data.article_list = wx.getStorageSync("article_list_pull");
            that.setData({
              $article_list: wx.getStorageSync("article_list_pull")
            })
          }
        })
      }, 800);
    }
    
    
  },
  onLoad: function (options) {
    wx.hideShareMenu()
    var dtb_sid = options.dtb_sid;
    var md5_rtime = options.md5_rtime;
    var from_page = options.from_page;
    wx.setStorageSync('appidOpt', appidOpt)
    var myDate = new Date();
    let that = this;
    console.log(myDate.getMonth());
    that.setData({
      datatime: myDate.getMonth() + 1,
      dtb_sid: options.dtb_sid == undefined ? '' : options.dtb_sid,
      md5_rtime: options.md5_rtime == undefined ? '' : options.md5_rtime
    })
    //login
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
                that.get_index_data();
                that.getShopPage();
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    } else {
      that.getShopPage();
    }
    that.setData({
      zhixing_list_box1: true,
      zhixing_list_box2: false,
      zhixing_list_box3: false,
    })   
    that.get_game_match();
  },
  onReady: function () {

  },
  pull_up: function(){
    
  },
  onShow: function () {
    let that = this;
    that.get_index_data();
    that.setData({
      "nickName": wx.getStorageSync("nickName"),
      "avatarUrl": wx.getStorageSync("avatarUrl"),
    });
    wx.request({
      url: article_list + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      data: {
        page: 1,
        limit: 10
      },
      success: function (res) {
        var $article_list = res.data.msg;
        wx.setStorageSync("article_list_pull", $article_list);
        wx.setStorageSync("page_article", 1);
        that.data.article_list = wx.getStorageSync("article_list_pull");
        that.setData({
          $article_list: $article_list
        })
      }
    })
  },
  get_index_data: function () {
    let that = this;
    wx.request({
      url: index + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      data: {},
      success: function (res) {
        that.setData(res.data.msg);
        wx.setStorageSync("honor_list", res.data.msg.honor_list);
      }
    })
  },
  preview_img: function (e) {
    var pic = e.currentTarget.dataset.pic;

    wx.previewImage({
      current: pic, // 当前显示图片的http链接
      urls: wx.getStorageSync('honor_list') // 需要预览的图片http链接列表
    })
  },
  get_game_match: function () {
    let that = this
    wx.request({
      url: "https://wx.toworld-tech.cn/web/get_maxReportSuccessNumDays",
      data: {

      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          zhixing_list_1: res.data.msg.entity,
          /*my_range: res.data.msg.myself.range,
          my_count: "成功率："+res.data.msg.myself.percent+"%"*/
        })
      }
    })
  },

  get_game_match_2: function () {
    let that = this
    wx.request({
      url: "https://wx.toworld-tech.cn/web/get_maxReportNumDays",
      data: {

      },
      success: function (res) {
        console.log(res.data.msg.entity);
        that.setData({
          zhixing_list_2: res.data.msg.entity,
          /*my_range: res.data.msg.myself.range,
          my_count: "上传数：" + res.data.msg.myself.count*/
        })
      }
    })
  },
  get_game_match_3: function () {
    this.setData({
      nickName: wx.getStorageSync("nickName"),
      avatarUrl: wx.getStorageSync("avatarUrl")
    })
  },
  get_snap_data: function () {
    let that = this
    wx.request({
      url: select_data + "?uid=" + wx.getStorageSync("uid"),
      data: {
        aa: 'xcx_education_list',
        page: 1,
        limit: 10
      },
      success: function (res) {
        console.log(res.data.msg.list);
        that.setData({
          snap_data_list: res.data.msg
        })
      }
    })
  },
  getShopPage: function () {
    let that = this
    wx.request({
      url: shopPage + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid") + "&dtb_sid=" + that.data.dtb_sid + "&md5_rtime=" + that.data.md5_rtime,
      data: {},
      success: function (res) {
        var $home_module = res.data.msg.home_module;
        // if ($home_module.classify) {
        //   that.setData({
        //     g_name: $home_module.classify[0].classify_name,
        //     g_id: $home_module.classify[0].tid,
        //   })
        // }
        that.setData({
          home_module: $home_module
        })
      }
    })
  },
  click_change_tab_color: function (e) {
    var that = this;
    var change_type = e.currentTarget.dataset.type;

    if (change_type == 1) {
      that.setData({
        change_type: true,
        onekey_modular: true
      })
      that.get_snap_data();

    } else if (change_type == 2) {
      that.setData({
        change_type: false,
        onekey_modular: false
      })
      //请求数据
      wx.request({
        url: activity_intr + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
        data: {},
        success: function (res) {
          var $introduce = res.data.msg.introduce;
          that.setData({
            introduce: $introduce
          })
          WxParse.wxParse('article11', 'html', $introduce, that, 5);
        }
      })
    }
  },
  commet_click_praise: function (e) { //攻略点赞
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
        if (res.data.code == 0) {
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 1000
          })

          setTimeout(function () {
            //请求数据
            wx.request({
              url: article_list + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
              data: {
                page: 1,
                limit: 10
              },
              success: function (res) {
                var $article_list = res.data.msg;
                wx.setStorageSync("article_list_pull", $article_list);
                wx.setStorageSync("page_article", 1);
                that.setData({
                  $article_list: $article_list
                })
              }
            })
          }, 500)

        }

      }
    })
  },
  previewImage: function (e) {
    var index = e.currentTarget.dataset.index;
    var indexa = e.currentTarget.dataset.indexa;
    var article_list = this.data.article_list[index].banner;
    console.info(this.data.article_list,"图片列表");
    wx.previewImage({
      current: article_list[indexa], // 当前显示图片的http链接
      urls: article_list // 需要预览的图片http链接列表
    })
  },
  click_change_tab_color2: function (e) {
    var that = this;
    var change_type = e.currentTarget.dataset.type;
    that.data.change_type_num = change_type;
    console.log(change_type,"当前点击的type");
    if (change_type == 1) {
      that.setData({
        change_type1: true,
        change_type2: false,
        change_type3: false,
        camera_story_madul_1: true,
        camera_story_madul_2: false,
        camera_story_madul_3: false
      })
    } else if (change_type == 2) {
      that.setData({
        change_type1: false,
        change_type2: true,
        change_type3: false,
        camera_story_madul_1: false,
        camera_story_madul_2: true,
        camera_story_madul_3: false
      })
      //请求数据
      wx.request({
        url: video_list + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
        data: {
          page: 1
        },
        success: function (res) {
          var $video_list = res.data.msg.data;
          wx.setStorageSync("video_list", $video_list);
          wx.setStorageSync("page", 1);

          that.setData({
            video_list: $video_list
          })

        }
      })
    } else if (change_type == 3) {
      that.page3_function();
    }
  },
  page3_function(){
    let that = this;
    that.setData({
      change_type1: false,
      change_type2: false,
      change_type3: true,
      camera_story_madul_1: false,
      camera_story_madul_2: false,
      camera_story_madul_3: true
    })
    //请求数据
    wx.request({
      url: article_list + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      data: {
        page: 1,
        limit: 10
      },
      success: function (res) {
        var $article_list = res.data.msg;
        wx.setStorageSync("article_list_pull", $article_list);
        wx.setStorageSync("page_article", 1);
        that.setData({
          $article_list: $article_list
        })
      }
    })
  },
  click_change_zhengyi_list: function (e) {
    var that = this;
    var btn = e.currentTarget.dataset.btn;
    if (btn == 1) {
      that.setData({
        zhixing_list_box1: true,
        zhixing_list_box2: false,
        zhixing_list_box3: false,
      })
      that.get_game_match();
    } else if (btn == 2) {
      that.setData({
        zhixing_list_box1: false,
        zhixing_list_box2: true,
        zhixing_list_box3: false,
      });
      that.get_game_match_2();
    } else if (btn == 3) {
      that.setData({
        zhixing_list_box1: false,
        zhixing_list_box2: false,
        zhixing_list_box3: true,
      });
      that.get_game_match_3();
    }

  },
  video_detail_fn: function (e) {
    var videourl = e.currentTarget.dataset.videourl;
    var videoid = e.currentTarget.dataset.videoid;
    wx.navigateTo({
      url: '/pages/video_detail/video_detail?videourl=' + videourl + "&videoid=" + videoid
    })
  },
  picture_detail_fn: function (e) {
    var commentid = e.currentTarget.dataset.commentid;
    wx.navigateTo({
      url: '/pages/picture_detail/picture_detail?commentid=' + commentid
    })
  },
  switchTab: function (e) {
    console.log(e.currentTarget.dataset.n);
    var n = e.currentTarget.dataset.n;
    // var currentGid = e.currentTarget.dataset.gid;
    // var index_classify = true;
    // wx.setStorageSync('currentTid', currentGid);
    // wx.setStorageSync('index_classify', index_classify)
    if (n == 0) {
      wx.navigateTo({
        url: '/pages/official_details/official_details?munber=4'
      })
    } else if (n == 1) {
      wx.navigateTo({
        url: '/pages/problem/problem'
      })
    } else if (n == 3) {
      wx.navigateTo({
        url: '/pages/join/join'
      })
    }

  },
  register_info: function (options) {
    let that = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl

        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        wx.setStorageSync("avatarUrl", avatarUrl);
        wx.setStorageSync("nickName", nickName);
        that.setData({
          avatarUrl: wx.getStorageSync('avatarUrl'),
          nickName: wx.getStorageSync('nickName')
        })

        var $data = {
          nickname: nickName,
          avatarurl: avatarUrl,
          gender: gender,
          province: province,
          city: city,
          country: country
        }
        console.log($data)

        wx.request({
          url: register_info + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
          data: $data,
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res);

          }
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        // console.log(res)
      }
    })
    that.setData({
      avatarUrl: wx.getStorageSync('avatarUrl'),
      nickName: wx.getStorageSync('nickName')
    })
  },
  shop_homepage: function () {
    let that = this;

    wx.request({
      url: homePage + "?uid=" + wx.getStorageSync("uid") + "&openid=" + wx.getStorageSync("openid"),
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {},
      success: function (res) {
        console.log(res)
        var $info = res.data.msg.userinfo;
        var one_num = parseInt($info.orders_pending_pay_row);
        var two_num = parseInt($info.orders_shipment_pending_row);
        var three_num = parseInt($info.orders_waiting_receivced_row);
        that.setData({
          wallet: $info.wallet,
          integral: $info.integral,
          one_num: one_num,
          two_num: two_num,
          three_num: three_num
        })
      }
    })
  },
  //上传攻略
  changToRider: function () {
    wx.navigateTo({
      url: '/pages/upload_raiders/upload_raiders'
    })
  },
  onPullDownRefresh: function (e) {
    wx.stopPullDownRefresh();
  },
  comment_share_btn: function (e) {
    this.setData({
      is_sign: true,
      shareid: e.currentTarget.dataset.shareid
    })
    var shareid = e.currentTarget.dataset.shareid;
    wx.setStorageSync('shareid', shareid)
  },
  onShareAppMessage: function (res) {

    var that = this;
    console.log(wx.getStorageSync("shareid"));
    
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
        that.setData({
          is_sign: false
        })
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