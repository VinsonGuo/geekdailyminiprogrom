import api from '../../utils/api'
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles: [],
    inputValue: '',
    showTag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "搜索",
    })
  },

  //item点击事件
  itemTap: function (e) {
    let item = e.currentTarget.dataset.article;
    let article = encodeURIComponent(JSON.stringify(item));
    api.viewArticle(item.article_id);
    wx.navigateTo({
      url: '../detail/detail?article=' + article
    })
  },

  searchChange(e) {
    this.setData({
      inputValue: e.detail.value,
    });
    if(!e.detail.value) { // 输入框为空，显示tag
      this.setData({
        showTag:true
      })
    }
  },

  onTagTap(e) {
    this.setData({
      inputValue: e.target.dataset.value,
    });
    this.toSearch();
  },

  toSearch: function(){
    this.query(0, 50, this.data.inputValue);
  },

  //全局关键字查询相关文章
  query: function (page, size, query) {
    let that = this;
    api.query(page, size, query, (res) => {
      if(res.data.data.length===0) {
        wx.showToast({
          title: '暂无搜索结果',
          icon:'none'
        })
        return
      }
      that.data.articles.push(...res.data.data);
      // 处理数据
      for (let i = 0; i < that.data.articles.length; i++) {
        let item = that.data.articles[i];
        item.childCategoryText = app.globalData.childCategoryItems[that.data.articles[i].child_category].value;
        item.childCategorycolor = app.globalData.childCategoryItems[that.data.articles[i].child_category].color;
      }
      that.setData({
        articles: that.data.articles,
        showTag:false
      })
    });

  },
 
})