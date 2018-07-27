
//app.js
App({
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //获取内存中的user_id
    this.globalData.userId = wx.getStorageSync('user_id') || 0;

    //获取userInfo
    wx.getUserInfo({
      success: function (res) {
        that.globalData.userInfo = res.userInfo;
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