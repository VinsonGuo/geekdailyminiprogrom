// upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: '/images/default_upload_img.png',
    categoryArray: ['Android', 'iOS', '微信小程序', '后端'],
    categoryIndex: 0,
    items: [{
        value: '所有人',
        checked: 'true'
      },
      {
        value: '入门'
      },
      {
        value: '进阶'
      },
    ],
    levelIndex: 0,
    titleContent: '',
    desContent: '',
    linkContent: '',
    imageContent: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '投稿',
    })
  },

  onImageClick(event) {
    wx.chooseImage({
      success: (res) => {
        let tempFilePaths = res.tempFilePaths;
        this.setData({
          imageUrl: tempFilePaths[0]
        })
        wx.uploadFile({
          url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function(res) {
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
  onReady: function() {

  },

  bindKeyInputTitle: function(e) {
    this.setData({
      titleContent: e.detail.value
    })
  },

  pasteTitle(e) {
    wx.getClipboardData({
      success: (res) => {
        let title = this.data.titleContent;
        this.setData({
          titleContent: title + res.data
        })
      }
    })
  },

  bindKeyInputDes: function(e) {
    this.setData({
      desContent: e.detail.value
    })
  },

  pasteDes(e) {
    wx.getClipboardData({
      success: (res) => {
        let des = this.data.desContent;
        this.setData({
          desContent: des + res.data
        })
      }
    })
  },

  bindKeyInputLink: function(e) {
    this.setData({
      linkContent: e.detail.value
    })
  },

  pasteLink(e) {
    wx.getClipboardData({
      success: (res) => {
        let link = this.data.linkContent;
        this.setData({
          linkContent: link + res.data
        })
      }
    })
  },

  bindKeyInputImage: function (e) {
    this.setData({
      imageContent: e.detail.value
    })
  },

  pasteImage(e) {
    wx.getClipboardData({
      success: (res) => {
        let image = this.data.imageContent;
        this.setData({
          imageContent: image + res.data
        })
      }
    })
  },
  radioChangeLevel: function(e) {
    console.log('radioChangeLevel发生change事件，携带value值为：', e.detail.value)
  }
})