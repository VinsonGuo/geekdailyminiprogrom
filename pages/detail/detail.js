import api from '../../utils/api'
const app = getApp()
let user_id = 0;
let lastScrollTop = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "",
    article: {},
    comments: [],
    star: "like-o",
    isStar: false,
    isScrollUp: true,
    md: "",
    actionSheetHidden: true,
    actionSheetItems: [],
    inputValue: '',
    defaultImg: "/images/defaultImg.jpg", //默认图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    user_id = app.globalData.userId;
    var that = this;
    var article = JSON.parse(options.article);
    console.log(article.article_id)
    that.setData({
      article: article
    });
    console.log(article);
    that.getArticleDetail(article.article_id != null ? article.article_id : article.id);
    api.isStarArticle(article.article_id, user_id, (res)=>{
      let isStar = res.data.data;
      that.setData({
        isStar: isStar,
        star: isStar?"like":"like-o"
      })
    })
    wx.setNavigationBarTitle({
      title: article.title,
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    
  },

  onShareAppMessage: function () {
    let article = JSON.stringify(this.data.article);
    return {
      path: '/pages/index/index?article='+article
    }
  },

  toStar:function(){
    if(user_id != 0){
      this.star(this.data.article.article_id, user_id, 1, 1);
    }
  },

  //收藏（点赞）
  star: function (article_id, user_id, type, status){
    let that = this;
    api.articleStar(article_id, user_id, type, status, (res) => {
      let isStar = !that.data.isStar;
      wx.showToast({
        title: `${isStar?'':'取消'}收藏成功!`,
      })
      that.setData({
        isStar: isStar,
        star:  isStar?"like": "like-o"
      })
    }, (res) => {

    });
  },

  onPageScroll:function(obj) {
    let dy = lastScrollTop - obj.scrollTop;
    this.setData({
      isScrollUp: dy>=0
    })
    lastScrollTop = obj.scrollTop;
  },
  // actionSheetTap: function (e) {
  //   this.setData({
  //     actionSheetHidden: !this.data.actionSheetHidden
  //   });
  //   this.getArticleComments(0, this.data.article.article_id);
  // },
  // actionSheetChange: function (e) {
  //   this.setData({
  //     actionSheetHidden: !this.data.actionSheetHidden
  //   });
  // },
  // bindItemTap: function (e) {
  //   console.log('tap ' + e.currentTarget.dataset.name);
  // },

  // bindKeyInput: function (e) {
  //   this.setData({
  //     inputValue: e.detail.value
  //   })
  // },

  // toComment: function () {
  //   if (this.data.inputValue.replace(/(^s*)|(s*$)/g, "").length == 0){
  //     wx.showToast({
  //       title: '内容不能为空',
  //     })
  //   }
  //   this.commentArticle(this.data.article.article_id, 1, this.data.inputValue,2, "", "",      this.data.article.contributor_id, this.data.article.contributor,"");
  // },

  // //评论文章
  // commentArticle:function (article_id, article_type, content, from_uid, from_nick,
  //   from_avatar, to_uid, to_nick, to_avatar){
  //   let that = this;
  //   api.commentArticle(article_id, article_type, content, from_uid, from_nick,
  //     from_avatar, to_uid, to_nick, to_avatar, (res) => {
  //     console.log(res.data.data)
  //     this.setData({
  //       inputValue: ''
  //     })
  //     wx.showToast({
  //       title: '文章评论成功!',
  //     })
  //   }, (res) => {
  //       wx.showToast({
  //         title: '文章评论失败!',
  //       })
  //   });
  //   },

  //获取文章MD内容详情
  getArticleDetail: function (article_id) {
    let that = this;
    api.getArticleDetail(article_id, (res) => {
      // console.log(res.data.data)
      that.setData({
        md: res.data.data
      })
    }, (res) => {
      
    });

  },

  //获取文章评论列表
  getArticleComments: function(page, article_id) {
    let that = this;
    api.getArticleComments(page, article_id, (res) => {
      console.log(res.data.data)
      that.setData({
        actionSheetItems: res.data.data
      })
    }, (res) => {

    });

  },

 
  
})