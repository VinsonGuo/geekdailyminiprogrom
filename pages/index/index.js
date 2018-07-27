import api from '../../utils/api'
//index.js
//获取应用实例
const app = getApp()
//上拉加载当前页
let currentPage = 1;
let size = 10;//每页返回数量
let articles = [];
let isLastPage = false;

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
    console.log(app.globalData.userInfo)
    wx.setNavigationBarTitle({
      title: '极客日报',
    })
    this.getArticle(0, size, false);
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