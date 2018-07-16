//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    score: '当前积分 0',
    score_sign_continuous: 0
  },
  
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '我的',
    })
    this.getUserInfo();
  },

  getUserInfo: function (cb) {
    var that = this
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            that.setData({
              userInfo: res.userInfo
            });
          }
        })
      }
    })
  },
})