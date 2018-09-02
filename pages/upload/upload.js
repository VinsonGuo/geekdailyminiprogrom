// upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl:'/images/default_upload_img.png',
    categoryArray: ['Android', 'iOS', '前端', '后端'],
    categoryIndex:0,
    levelArray: ['进阶', '大神'],
    levelIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  onImageClick(event) {
    wx.chooseImage({
      success:  (res)=> {
        let tempFilePaths = res.tempFilePaths;
        this.setData({imageUrl:tempFilePaths[0]})
        wx.uploadFile({
          url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = res.data
            //do something
          }
        })
      }
    })
  },

  onFormSubmit(e) {
    console.log(e.detail.value);
  },

  bindCategoryPickerChange(e) {
    this.setData({
      categoryIndex: e.detail.value
    })
  },

  bindLevelPickerChange(e) {
    this.setData({
      levelIndex: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  
})