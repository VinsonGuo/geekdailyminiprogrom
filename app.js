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
      color: 'green'
    }, {
      id: 1,
      icon: '',
      value: '资讯',
      checked: 'true',
      color: 'orange'
    }, {
      id: 2,
      icon: '',
      value: '教程',
      color: 'purple '
    }, {
      id: 3,
      icon: '',
      value: '书籍',
      color: 'grey'
    }, {
      id: 4,
      icon: '',
      value: '工具',
      color: 'pink'
    }, {
      id: 5,
      icon: '',
      value: 'APP',
      color: 'tan'
    }, {
      id: 6,
      icon: '',
      value: '活动',
      color: 'red'
    }, {
      id: 7,
      icon: '',
      value: '招聘',
      color: 'blue'
    }];
  },

  globalData: {
    userInfo: null,
    userId: undefined
  },
})