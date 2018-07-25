import api from '../../utils/api'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "",
    comments:[],
    md: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let article = JSON.parse(options.article);
    console.log(article);
    that.getArticleDetail(article.article_id != null ? article.article_id : article.id);
    wx.setNavigationBarTitle({
      title: article.title,
    })
  },


  //获取文章MD内容详情
  getArticleDetail: function (article_id) {
    let that = this;
    api.getArticleDetail(article_id, (res) => {
      console.log(res.data.data)
      that.setData({
        md: res.data.data
      })
    }, (res) => {
      
    });

  }

  
})