import api from '../../utils/api';
import util from '../../utils/util';
//index.js
//获取应用实例
const app = getApp()
//上拉加载当前页
let currentPage = 1;
let size = 10;//每页返回数量
let articles = [];
let isLastPage = false;
let format = "yyyy-MM-dd HH:mm:ss"

Page({
  data: {
    isHideLoadMore: true,
    articles: []
  },
  isSameDay: function (d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  },

  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '极客日报',
    })
    this.getArticle(0, size, false);
  },

  onReady: function () {
    //获得dialog组件
    let that = this;
    this.dialog = this.selectComponent("#dialog");
    //如果没登录，显示弹窗引导登录
    if(app.globalData.userId== 0) {
        that.dialog.showDialog();
    }
  },

  confirmEvent: function () {
    this.dialog.hideDialog();
  },

  bindGetUserInfo: function () {
    let that = this;
    wx.getUserInfo({
      success:function(res) {
        app.globalData.userInfo = res.userInfo;
      }
    })
    // 用户点击授权后，这里可以做一些登陆操作
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var userInfo = app.globalData.userInfo;
        api.WxLogin(res.code, userInfo.nickName, userInfo.avatarUrl, (res) => {
          console.log(res.data.data)
          //保存user_id到内存
          let userId = res.data.data.user_id;
          wx.setStorage({
            key: 'user_id',
            data: userId,
            success: function () {
              app.globalData.userId = userId;
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
      fail: res => {
        wx.showToast({
          title: '登录失败!',
        })
        wx.hideLoading();
      }
    })
  },

  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    currentPage = 0;
    this.getArticle(0, size, false)
  },

  //上拉加载更多
  onReachBottom: function () {
    var that = this;
    that.setData({
      isHideLoadMore: isLastPage
    })
    currentPage += 1
    that.getArticle(currentPage, size, true)
  },

  //item点击事件
  itemTap: function (e) {
    var item = e.currentTarget.dataset.article;
    //对象转成json字符串传过去   此处必须把这两个url进行编码  不然json解析会出错（记得接收端将这两个url解码）
    item.img_url = encodeURIComponent(item.img_url);
    item.link = encodeURIComponent(item.link);
    var article = JSON.stringify(item);
    console.log("sss",article)
    api.viewArticle(item.article_id);
    wx.navigateTo({
      url: '../detail/detail?article=' + article
    })
  },

  //获取article内容
  getArticle: function (page, size, isLoadMore) {
    let that = this;
    api.getArticalList(page, size, (res) => {
      isLastPage = (res.data.data.length === 0);
      //完成停止加载
      if (!isLoadMore) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        articles = [];
      }
      // 处理数据
      for (let i = 0; i < res.data.data.length; i++) {
        let item = res.data.data[i];
        if (i == 0) {
          item.isSameDay = false;
        } else {
          item.isSameDay = that.isSameDay(util.parseDate(item.date, format),
            util.parseDate(res.data.data[i - 1].date,format))
        }
        let arr = item.date.split(' ');
        item.day = arr[0];
        item.time = arr[1];
      }
     
      articles.push(...res.data.data);
      // console.log(res.data.data)
      this.setData({
        articles: articles,
        isHideLoadMore: true
      })
    }, (res) => {
      currentPage--;
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    });

  }


})