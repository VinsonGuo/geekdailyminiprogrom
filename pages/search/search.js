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
    var url = e.currentTarget.dataset.link;
    var article_id = e.currentTarget.dataset.id;
    api.viewArticle(article_id);
    wx.navigateTo({
      url: '../detail/detail?url=' + url
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
    var that = this;
    wx.request({
      url: 'https://502tech.com/geekdaily/query',
      method: "POST",
      data: {
        page: page,
        size: size,
        query: query
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          articles: res.data.data,
        })
      },
      fail: function (res) {

      }
    })

  },

 
})