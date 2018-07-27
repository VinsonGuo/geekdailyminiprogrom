//index.js
//获取应用实例
const app = getApp()
var size = 10;//返回每页的数量
//用户唯一的id
var user_id = 0;

Page({
  data: {
    articles: [],
    typeId: 0  //0  我的收藏（点赞）  1我的评论  2我的贡献
  },
  
  onLoad: function (options) {
    user_id = app.globalData.userId;
    var that = this;
    that.setData({
      typeId: options.typeId
    })
    var typeId = that.data.typeId;
    console.log("typeId:",typeId)
    var title = "";
    switch(typeId){
      case "0":
        title = "我的收藏";
        that.getMyStarArticles(0, size, user_id);
      break
      case "1":
        title = "我的评论";
        that.getMyCommentArticles(0, size, user_id);
      break
      case "2":
        title = "我的贡献";
        that.getMyContributeArticles(0, size, user_id);
      break
    }
    wx.setNavigationBarTitle({
      title: title,
    })


    
  },

  //获取我的收藏(点赞)文章列表
  getMyStarArticles: function (page, size, user_id) {
    var that = this;
    wx.request({
      url: 'https://502tech.com/geekdaily/getMyStarArticles',
      method: "POST",
      data: {
        page: page,
        size: size,
        user_id: user_id
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


  //获取我的贡献的文章列表
  getMyContributeArticles: function (page, size, user_id) {
    var that = this;
    wx.request({
      url: 'https://502tech.com/geekdaily/getMyContributeArticles',
      method: "POST",
      data: {
        page: page,
        size: size,
        user_id: user_id
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

  //获取我的评论过的文章列表
  getMyCommentArticles: function (page, size, user_id) {
    var that = this;
    wx.request({
      url: 'https://502tech.com/geekdaily/getMyCommentArticles',
      method: "POST",
      data: {
        page: page,
        size: size,
        user_id: user_id
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

  }


})