import Api from '../../utils/api';
import Log from '../../utils/log';
const app = getApp()
let user_id = 0;
let lastScrollTop = 0;
const log = Log('detail page');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: {},
    comments: [],
    starStatus: 0,
    starProgress: 0,
    isScrollUp: true,
    md: "",
    githubDetail: {},
    actionSheetHidden: true,
    actionSheetItems: [],
    inputValue: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    user_id = app.globalData.userId;
    let that = this;
    log(options)
    let article = JSON.parse(decodeURIComponent(options.article));
    article.rankText = app.globalData.levelItems[article.rank].value;
    article.childCategoryText = app.globalData.childCategoryItems[article.child_category].value;
    let starProgress = (article.stars) / (article.stars + article.un_stars) * 100;
    log("starProgress" + starProgress);
    that.setData({
      article,
      starProgress
    });
    that.getArticleDetail(article.article_id != null ? article.article_id : article.id);
    that.getArticleGithubDetail(article.link);
    Api.isStarArticle(article.article_id, user_id, (res) => {
      let starStatus = res.data.data;
      that.setData({
        starStatus
      })
    })
    Api.relativeArticles(article.title, (res) => {
      log(res);
    })
    wx.setNavigationBarTitle({
      title: article.childCategoryText + '-' + article.title,
    })

  },

  onShareAppMessage() {
    let self = this;
    let article = encodeURIComponent(JSON.stringify(this.data.article));
    log(article);
    return {
      title: self.data.article.childCategoryText + '-' + self.data.article.title,
      path: '/pages/index/index?article=' + article
    }
  },

  toStar() {
    if (user_id != 0) {
      let starStatus = this.data.starStatus;
      this.star(this.data.article.article_id, user_id,
        starStatus == 0 ? 1 : 0);
    }
  },

  likeTap() {
    if (user_id != 0) {
      this.star(this.data.article.article_id, user_id, 1);
    }
  },

  dislikeTap() {
    if (user_id != 0) {
      this.star(this.data.article.article_id, user_id, 2);
    }
  },

  //收藏（点赞）
  star: function(article_id, user_id, status) {
    let that = this;
    Api.articleStar(article_id, user_id, status, (res) => {
      let starStatus = that.data.starStatus == 0 ? 1 : 0;
      wx.showToast({
        title: res.data.data,
      })
      that.setData({
        starStatus
      })
    }, (res) => {

    });
  },

  onPageScroll: function(obj) {
    let dy = lastScrollTop - obj.scrollTop;
    this.setData({
      isScrollUp: dy >= 0
    })
    lastScrollTop = obj.scrollTop;
  },


  //获取文章Github详情
  getArticleGithubDetail: function(github_link) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    Api.getGitHubDetail(github_link, (res) => {
      wx.hideLoading()
      log(res.data.data);
      let detail = JSON.parse(decodeURIComponent(res.data.data));
      that.setData({
        githubDetail: detail,
      })
    }, (res) => {
      wx.hideLoading()
    });

  },

  //获取文章MD内容详情
  getArticleDetail: function(article_id) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    Api.getArticleDetail(article_id, (res) => {
      wx.hideLoading()
      that.setData({
        md: res.data.data
      })
    }, (res) => {
      wx.hideLoading()
    });

  },

  copyText: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '原文链接复制成功'
            })
          }
        })
      }
    })
  },

})