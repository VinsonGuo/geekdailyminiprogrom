const baseUrl = "https://502tech.com/geekdaily/";
const contentType = 'application/x-www-form-urlencoded';

export default class api {
  static getArticalList = (page, success, fail) => {
    wx.request({
      url: `${baseUrl}getArticleList`,
      method: "POST",
      data: {
        page: page
      },
      header: {
        'content-type': contentType
      },
      success: (res) => {
        success(res)
      },
      fail: (res) => {
        fail(res)
      }
    })
  }

  static viewArticle = (id) => {
    wx.request({
      url: `${baseUrl}viewArticle`,
      method: "POST",
      data: {
        article_id: id
      },
      header: {
        'content-type': contentType
      },
      success: (res) => {
        console.log(res);
      },
      fail: (res) => {
        console.log(res);
      }
    })
  }
}