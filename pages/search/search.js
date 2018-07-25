import api from '../../utils/api'
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles: [],
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "文章搜索",
    })
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

  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  toSearch: function(){
    this.query(0, 50, this.data.inputValue);
  },

  //全局关键字查询相关文章
  query: function (page, size, query) {
    let that = this;
    api.query(page, size, query, (res) => {
      console.log(res.data.data)
      that.setData({
        articles: res.data.data,
      })
    });

  },
 
})