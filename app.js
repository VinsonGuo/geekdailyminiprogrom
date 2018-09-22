//app.js
App({
  onLaunch() {
    //获取内存中的user_id
    this.globalData.userId = wx.getStorageSync('user_id');

    //获取userInfo
    wx.getUserInfo({
      success: (res) => {
        this.globalData.userInfo = res.userInfo;
      }
    })

    this.globalData.levelItems = [{
        value: '所有人',
        checked: 'true'
      },
      {
        value: '入门'
      },
      {
        value: '进阶'
      },
    ];
  },

  globalData: {
    userInfo: null,
    userId: undefined
  },
})