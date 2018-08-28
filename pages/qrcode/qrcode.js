// pages/qrcode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    fgColor: 'black',
    canvasId:'wux-qrcode'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let url = options.content;
    this.setData({
      value: url
    })
  },

  drawSuccess() {
    wx.canvasToTempFilePath({
      canvasId: 'wux-qrcode',
      success: res => {
        wx.previewImage({
          urls: [res.tempFilePath]
        })
      },
      fail: res => {
        console.log(res);
      }
    }, this.selectComponent("#qrcode"))
  }

  
})