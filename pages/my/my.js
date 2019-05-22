import api from '../../utils/api'
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'
//index.js
//获取应用实例
const app = getApp()
let page = 0;

Page({
  data: {
    loginOrLogout: "登录",
    score: '当前积分 0',
    score_sign_continuous: 0,
    userInfo: {},
    tab: {
      list: [{
        id: 1,
        title: '收藏'
      }, {
        id: 2,
        title: '贡献'
      }],
      selectedId: 1
    },
    articles: []
  },

  onLoad() {
    if (app.globalData.userId) { //已登录
      this.setData({
        loginOrLogout: "退出",
      })
    }

    wx.setNavigationBarTitle({
      title: '我的',
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } 
    this.getMyStarArticles(1);
  },

  //登录或登出
  async loginOrLogout() {
    if (app.globalData.userId) { //存在user_id
      //登出
      wx.removeStorage({
        key: 'user_id',
        success: (res)=> {
          app.globalData.userId = undefined;
          this.setData({
            loginOrLogout: "登录",
          })
        }
      })
    } else { //不存在user_id
      await api.login();
      this.setData({
        loginOrLogout: "退出",
      })
    }
  },

  tabChange(e) {
    let id = e.detail;
    if (id == this.data.tab.selectedId) {
      return;
    }
    let tab = this.data.tab;
    tab.selectedId = id;
    this.setData({
      articles: [],
      tab
    })
    page = 0;
    this.getMyStarArticles(id);
  },

  //获取我的收藏(点赞)文章列表
  async getMyStarArticles(selectId, size = 10) {
    let param = {
      page: page,
      size: size,
      userId: app.globalData.userId
    }
    let data = selectId == 1 ? await api.getMyStarArticles(param) :
      await api.getMyContributeArticles(param);
    if (data) {
      if (page == 0) {
        this.data.articles.push(...data)
        // 处理数据
        for (let i = 0; i < this.data.articles.length; i++) {
          let item = this.data.articles[i];
          item.childCategoryText = app.globalData.childCategoryItems[this.data.articles[i].childCategory].value;
          item.childCategorycolor = app.globalData.childCategoryItems[this.data.articles[i].childCategory].color;
        }
        this.setData({
          articles: this.data.articles,
        })
      } else {
        this.data.articles.push(...data)
        // 处理数据
        for (let i = 0; i < this.data.articles.length; i++) {
          let item = this.data.articles[i];
          item.childCategoryText = app.globalData.childCategoryItems[this.data.articles[i].childCategory].value;
          item.childCategorycolor = app.globalData.childCategoryItems[this.data.articles[i].childCategory].color;
        }
        this.setData({
          articles: this.data.articles,
        })
      }
    } else {
      page--;
    }

  },



  onReachBottom() {
    page += 1
    this.getMyStarArticles(this.data.tab.selectedId);
  },

  itemTap(e) {
    let item = e.currentTarget.dataset.article;
    let article = encodeURIComponent(JSON.stringify(item));
    api.viewArticle(item.articleId);
    wx.navigateTo({
      url: '../detail/detail?article=' + article
    })
  },

})