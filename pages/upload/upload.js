import api from '../../utils/api'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: '/images/add_image.png',
    categoryArray: ['Android'],
    categoryIndex: 0,
    items: app.globalData.levelItems,
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
      }
    })
  },

  onFormSubmit(e) {
    let param = e.detail.value;
    wx.showLoading({
      title: '上传中',
    })
    if (this.data.imageContent) {
      param.img_url = this.data.imageContent;
      this.upload(param);
    } else {
      if (this.data.imageUrl === '/images/add_image.png') { //默认图片，请求失败
        wx.showToast({
          title: '请上传图片',
          icon: 'none'
        })
        wx.hideLoading();
        return;
      }
      wx.uploadFile({
        url: api.uploadArticleImg,
        filePath: this.data.imageUrl,
        name: 'article_img',
        success: (res) => {
          console.log(res)
          param.img_url = JSON.parse(res.data).data.article_img;
          this.upload(param);
        },
        fail: (res) => {
          console.log(res)
          wx.showToast({
            title: '上传失败!',
            icon: 'none'
          })
          wx.hideLoading();
        }
      })
    }
  },

  upload(param) {
    param.rank = this.data.levelIndex;
    param.category = this.data.categoryArray[this.data.categoryIndex];
    param.contributor_id = app.globalData.userId;
    console.log(param)
    if (!param.title || !param.des || !param.link || !param.img_url) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      wx.hideLoading();
      return;
    }
    api.uploadArticle(param, (res) => {
      console.log(res)
      wx.hideLoading();
      if (res.data.code === 0) {
        wx.showToast({
          title: '上传成功!',
        })
        wx.navigateBack();
      } else {
        wx.showToast({
          title: res.data.message || res.data.msg,
          icon: 'none'
        })
      }
    }, (res) => {
      console.log(res)
      wx.hideLoading();
      wx.showToast({
        title: '上传失败!',
        icon: 'none'
      })
    });
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
    console.log(e.detail.value);
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

  bindKeyInputImage: function(e) {
    this.setData({
      imageContent: e.detail.value,
      imageUrl: e.detail.value
    })
  },

  pasteImage(e) {
    wx.getClipboardData({
      success: (res) => {
        let image = this.data.imageContent;
        this.setData({
          imageContent: image + res.data,
          imageUrl: image + res.data
        })
      }
    })
  },
  radioChangeLevel: function(e) {
    console.log(e.detail.value)
    this.data.items.forEach((item, index) => {
      if (item.value === e.detail.value) {
        this.setData({
          levelIndex: index
        })
      }
    })
  }
})