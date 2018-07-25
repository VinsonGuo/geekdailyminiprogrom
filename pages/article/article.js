//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    articles: [],
    typeId: 0  //0  我的点赞  1我的评论  2我的贡献
  },
  
  onLoad: function (options) {
    var that = this;
    that.setData({
      typeId: options.typeId
    })
    var typeId = that.data.typeId;
    console.log("typeId:",typeId)
    var title = "";
    switch(typeId){
      case "0":
        title = "我的点赞";
        that.getMyStarArticles(0, 1);
      break
      case "1":
        title = "我的评论";
        that.getMyCommentArticles(0, 1);
      break
      case "2":
        title = "我的贡献";
        that.getMyContributeArticles(0, 1);
      break
    }
    wx.setNavigationBarTitle({
      title: title,
    })


    
  },

  //获取我的点赞文章列表
  getMyStarArticles: function (page, user_id) {
    var that = this;
    wx.request({
      url: 'https://502tech.com/geekdaily/getMyStarArticles',
      method: "POST",
      data: {
        page: page,
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
  getMyContributeArticles: function (page, user_id) {
    var that = this;
    wx.request({
      url: 'https://502tech.com/geekdaily/getMyContributeArticles',
      method: "POST",
      data: {
        page: page,
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
  getMyCommentArticles: function (page, user_id) {
    var that = this;
    wx.request({
      url: 'https://502tech.com/geekdaily/getMyCommentArticles',
      method: "POST",
      data: {
        page: page,
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