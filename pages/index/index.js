import api from '../../utils/api';
import util from '../../utils/util';
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'
//index.js
//获取应用实例
const app = getApp()
//上拉加载当前页
let currentPage = 0;
let size = 10; //每页返回数量
let isLastPage = false;
let format = "yyyy-MM-dd HH:mm:ss"

Page({
  data: {
    isHideLoadMore: true,
    articles: [],
    buttons: [{
      label: '我的',
      icon: 'contact',
    }, {
      label: '投稿',
      icon: 'add',
    }],
    tab: {
      list: [{
        id: 1,
        title: 'Android'
      }, {
        id: 2,
        title: 'iOS'
      }, {
        id: 3,
        title: 'Web'
      }],
      selectedId: 1
    },
    searchText: ''
  },

  isSameDay: function(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  },
  buttonClicked(e) {
    const {
      index
    } = e.detail

    index === 0 && wx.navigateTo({
      url: '/pages/my/my'
    })

    index === 1 && wx.navigateTo({
      url: '/pages/upload/upload'
    })
  },

  async onLoad(options) {
    if (options.article) { // 如果是转发过来的，直接跳转到详情页
      wx.navigateTo({
        url: '/pages/detail/detail?article=' + options.article
      })
    }
    wx.setNavigationBarTitle({
      title: 'GitClub - Android',
    })
    this.getArticle(0, size, false);
    let count = await api.getArticleTotalViews();
    this.setData({
      searchText: `点击搜索，已收录${count}个Android开源项目`
    })

    wx.showShareMenu({
      withShareTicket: true
    })
  },

  onReady: function() {
    //获得dialog组件
    let that = this;
    this.dialog = this.selectComponent("#dialog");
    //如果没登录，显示弹窗引导登录
    if (!app.globalData.userId || typeof(app.globalData.userId) === 'object') {
      that.dialog.showDialog();
    }
  },

  confirmEvent: function() {
    this.dialog.hideDialog();
  },

  toSearch(e) {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  async bindGetUserInfo() {
    await api.login();
  },

  //下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    currentPage = 0;
    this.getArticle(0, size, false)
  },

  //上拉加载更多
  onReachBottom() {
    this.setData({
      isHideLoadMore: isLastPage
    })
    currentPage += 1
    this.getArticle(currentPage, size, true)
  },

  //item点击事件
  itemTap: function(e) {
    let item = e.currentTarget.dataset.article;
    //对象转成json字符串传过去   此处必须把这两个url进行编码  不然json解析会出错（记得接收端将这两个url解码）;
    let article = encodeURIComponent(JSON.stringify(item));
    api.viewArticle(item.articleId);
    wx.navigateTo({
      url: '../detail/detail?article=' + article
    })
  },

  //获取article内容
  getArticle(page, size, isLoadMore) {
    let that = this;
    api.getArticalList(page, size, (res) => {
      isLastPage = (res.data.data.length === 0);
      //完成停止加载
      if (!isLoadMore) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        that.setData({
          articles: []
        });
      }

      that.data.articles.push(...res.data.data);
      // 处理数据
      for (let i = 0; i < that.data.articles.length; i++) {
        let item = that.data.articles[i];
        if (i == 0) {
          item.isSameDay = true;
        } else {
          item.isSameDay = that.isSameDay(util.parseDate(item.date, format),
            util.parseDate(that.data.articles[i - 1].date, format))
        }
        let arr = item.date.split(' ');
        if (util.isToday(util.parseDate(item.date, format))) {
          item.day = '今日更新';
        } else if (util.isYesterday(util.parseDate(item.date, format))) {
          item.day = '昨天'
        } else {
          item.day = arr[0]
        }

        item.time = arr[1];
        item.childCategoryText = app.globalData.childCategoryItems[that.data.articles[i].childCategory].value;
        item.childCategorycolor = app.globalData.childCategoryItems[that.data.articles[i].childCategory].color;
      }
      this.setData({
        articles: that.data.articles,
        isHideLoadMore: true
      })
    }, (res) => {
      currentPage--;
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    });

  },
  onShareAppMessage: function() {
    return {
      title: '极客的开源世界 -- Android',
      path: '/pages/index/index'
    }
  },
  tabChange(e) {
    let id = e.detail;
    console.log("tab id " + id);
    if (id == this.data.tab.selectedId) {
      return;
    }
    let tab = this.data.tab;
    tab.selectedId = id;
    this.setData({
      // articles: [],
      tab
    });
    let category = tab.list.filter((item) => {
      return item.id === id;
    })[0].title;
    console.log(category)
  },

})