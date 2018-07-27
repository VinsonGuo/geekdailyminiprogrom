
//app.js
App({
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //获取内存中的user_id
    this.globalData.userId = wx.getStorageSync('user_id') || 0

    // //测试多线程
    // var worker = wx.createWorker('workers/request/index.js'); // 文件名指定 worker 的入口文件路径，绝对路径
    // worker.postMessage({
    //   msg: 'hello worker'
    // })

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.log(res.code)
    //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    if (this.globalData.userId == 0) {
      //弹框登录
      wx.showModal({
        title: '提示',
        content: '请先登录!',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            //微信登陆获取微信临时登陆code
            wx.login({
              success: res => {
                console.log(res.code)
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                var userInfo = that.globalData.userInfo;
                that.wxLogin(res.code, userInfo.nickName, userInfo.avatarUrl);
              },
              fail: res => {
                wx.showToast({
                  title: '登录失败!',
                })
                wx.hideLoading();
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  wxLogin: function (code, nickName, avatarUrl) {
    var that = this;
    wx.request({
      url: 'https://502tech.com/geekdaily/WxLogin',
      method: "POST",
      data: {
        code: code,
        nickName: nickName,
        avatarUrl: avatarUrl
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 
      },
      success: function (res) {
        //保存user_id到内存
        var userId = res.data.data.user_id;
        wx.setStorage({
          key: 'user_id',
          data: userId,
          success: function () {
            that.globalData.userId = userId;
          }
        })
        wx.showToast({
          title: '登录成功!',
        })
        wx.hideLoading();
      },
      fail: function (res) {
        wx.showToast({
          title: '登录失败!',
        })
        wx.hideLoading();
      }
    })

  },


  globalData: {
    userInfo: null,
    userId: 0,
    connectList: []
  },
  //------------------------------
  $$cache :{}, 
  
  add(pageModel) {
      let pagePath = this._getPageModelPath(pageModel);
      console.debug("pagePath:" ,pagePath);
      console.debug("pageModel:", pageModel);
      this.$$cache[pagePath] = pageModel;
    },
  
  get(pagePath) {
      return this.$$cache[pagePath];
    },
    
  delete(pageModel) {
      try {
        delete this.$$cache[this._getPageModelPath(pageModel)];
      } catch (e) {
      }
    },
  
  _getPageModelPath(page) {
      // 关键点
      return page.__route__;
    }
})