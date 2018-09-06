import api from '../../utils/api'
//index.js
//获取应用实例
const app = getApp()
//用户唯一的id
var user_id = 0;
let page = 0;

Page({
  data: {
    loginOrLogout: "登录",
    score: '当前积分 0',
    score_sign_continuous: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tab: {
      list: [{
        id: 1,
        title: '我的收藏'
      }, {
        id: 2,
        title: '我的贡献'
      }],
      selectedId: 1
    },
    articles:[]
  },
  
  onLoad: function () {
    var that = this;
    user_id = app.globalData.userId;
    if(user_id != 0){//已登录
      that.setData({
        loginOrLogout: "退出",
      })
    }
    
    wx.setNavigationBarTitle({
      title: '我的',
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.getMyStarArticles(page);
  },

  //登录或登出
  loginOrLogout:function(){
    var that = this;
    if(user_id != 0){//存在user_id
      //登出
      wx.removeStorage({
        key: 'user_id',
        success: function (res) {
          console.log(res.data)
          user_id = 0;
          app.globalData.userId = 0;
          that.setData({
            loginOrLogout: "登录",
          })
        }
      })
    } else {//不存在user_id
      wx.showLoading({
        title: '登录中...',
      })
      //微信登陆获取微信临时登陆code
      wx.login({
        success: res => {
          console.log(res.code)
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(that.data.userInfo)
          var userInfo = that.data.userInfo;
          that.wxLogin(res.code, userInfo.nickName, userInfo.avatarUrl);
        },
        fail: res => {
          wx.showToast({
            title: '登录失败!',
          })
          wx.hideLoading();
        }
      })
    }
  },

  wxLogin: function (code, nickName, avatarUrl) {
    let that = this;
    api.WxLogin(code, nickName, avatarUrl, (res) => {
      console.log(res.data.data)
      //保存user_id到内存
      var userId = res.data.data.user_id;
      wx.setStorage({
        key: 'user_id',
        data: userId,
        success:function(){
          user_id = userId;
          app.globalData.userId = userId;
          that.setData({
            loginOrLogout: "退出",
          })
        }
      })
      wx.showToast({
        title: '登录成功!',
      })
      wx.hideLoading();
    }, (res) => {
      wx.showToast({
        title: '登录失败!',
      })
      wx.hideLoading();
    });
    
  },

  tabChange(e) {
    let id = e.detail;
    console.log(e)
    this.setData({
      articles: [],
    })
    page = 0;
    if(id == 1) {
      this.getMyStarArticles(page);
    }else{
      this.getMyContributeArticles(page);
    }
  },

  //获取我的收藏(点赞)文章列表
  getMyStarArticles: function (page, size = 10) {
    var that = this;
    wx.request({
      url: 'https://502tech.com/geekdaily/getMyStarArticles',
      method: "POST",
      data: {
        page: page,
        size: size,
        user_id: user_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          articles: res.data.data,
        })
      },
      fail: function (res) {

      }
    })

  },


  //获取我的贡献的文章列表
  getMyContributeArticles: function (page, size = 10) {
    var that = this;
    wx.request({
      url: 'https://502tech.com/geekdaily/getMyContributeArticles',
      method: "POST",
      data: {
        page: page,
        size: size,
        user_id: user_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          articles: res.data.data,
        })
      },
      fail: function (res) {

      }
    })

  },


  itemTap: function (e) {
    var item = e.currentTarget.dataset.article;
    //对象转成json字符串传过去   此处必须把这两个url进行编码  不然json解析会出错（记得接收端将这两个url解码）
    // item.img_url = encodeURIComponent(item.img_url);
    // item.link = encodeURIComponent(item.link);
    var article = JSON.stringify(item);
    api.viewArticle(item.article_id);
    wx.navigateTo({
      url: '../detail/detail?article=' + article
    })
  },

})