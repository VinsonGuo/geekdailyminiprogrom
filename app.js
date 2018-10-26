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
    }, {
      value: '入门'
    }, {
      value: '进阶'
    }, ];

    this.globalData.childCategoryItems = [{
      id: 0,
      icon: '',
      value: '开源库',
    }, {
      id: 1,
      icon: '',
      value: '资讯',
      checked: 'true'
    }, {
      id: 2,
      icon: '',
      value: '教程',
    }, {
      id: 3,
      icon: '',
      value: '书籍',
    }, {
      id: 4,
      icon: '',
      value: '工具',
    }, {
      id: 5,
      icon: '',
      value: 'APP',
    }, {
      id: 6,
      icon: '',
      value: '活动',
    }, {
      id: 7,
      icon: '',
      value: '招聘',
    }];
  },

  globalData: {
    userInfo: null,
    userId: undefined
  },
})