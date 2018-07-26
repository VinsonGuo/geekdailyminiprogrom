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

  static getArticleDetail = (article_id, success, fail) => {
    wx.request({
      url: `${baseUrl}getArticleDetail`,
      method: "POST",
      data: {
        article_id: article_id
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

  static query = (page, size, query, success, fail) => {
    wx.request({
      url: `${baseUrl}query`,
      method: "POST",
      data: {
        page: page,
        size: size,
        query: query
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

  static getArticleComments = (page, article_id, success, fail) => {
    wx.request({
      url: `${baseUrl}getArticleComments`,
      method: "POST",
      data: {
        page: page,
        article_id: article_id
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

  static commentArticle = (article_id, article_type, content, from_uid, from_nick,
    from_avatar, to_uid, to_nick, to_avatar,
  success, fail) => {
    wx.request({
      url: `${baseUrl}commentArticle`,
      method: "POST",
      data: {
        article_id: article_id,
        article_type: article_type,
        content: content,
        from_uid: from_uid,
        from_nick: from_nick,
        from_avatar: from_avatar,
        to_uid: to_uid,
        to_nick: to_nick,
        to_avatar: to_avatar
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
}