import api from '../../utils/api'
//index.js
//获取应用实例
const app = getApp()
//上拉加载当前页
let currentPage = 1;
let articles = [];
let isLastPage = false;

Page({
  data: {
    isHideLoadMore: true,
    articles: [],
  },
  isSameDay: function (d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  },

  onLoad: function () {
    console.log(app.globalData.userInfo)
    wx.setNavigationBarTitle({
      title: '极客日报',
    })
    this.getArticle(0, false);
  },

  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    currentPage = 0;
    this.getArticle(0, false)
  },

  //上拉加载更多
  onReachBottom: function () {
    var that = this;
    that.setData({
      isHideLoadMore: isLastPage
    })
    currentPage += 1
    that.getArticle(currentPage, true)
  },

  //item点击事件
  itemTap: function (e) {
    var item = e.currentTarget.dataset.article;
    let article = JSON.stringify(item);
    api.viewArticle(item.article_id);
    wx.navigateTo({
      url: '../detail/detail?article=' + article
    })
  },

  //获取article内容
  getArticle: function (page, isLoadMore) {
    let that = this;
    api.getArticalList(page, (res) => {
      isLastPage = (res.data.data.length === 0);
      //完成停止加载
      if (!isLoadMore) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        articles = [];
      }
      // 处理数据
      res.data.data.map((item, index) => {
        if (index == 0) {
          item.isSameDay = false;
        } else {
          item.isSameDay = that.isSameDay(new Date(item.date),
            new Date(res.data.data[index - 1].date))
        }
        let arr = item.date.split(' ');
        item.day = arr[0];
        item.time = arr[1];
      })
      articles.push(...res.data.data);
      console.log(res.data.data)
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