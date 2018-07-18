const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "",
    comments:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      url: `https://502tech.com/geekdaily/wxWebView?url=${options.url}`
    })
    console.log(that.data.url);
  },

  
})