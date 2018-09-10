const baseUrl = "https://502tech.com/geekdaily/";
const contentType = 'application/x-www-form-urlencoded';

export default class api {
  //微信登陆
  static WxLogin = (code, nickName, avatarUrl, success, fail) => {
    wx.request({
      url: `${baseUrl}WxLogin`,
      method: "POST",
      data: {
        code: code,
        nickName: nickName,
        avatarUrl: avatarUrl
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

  //获取文章列表
  static getArticalList = (page, size, success, fail) => {
    wx.request({
      url: `${baseUrl}getArticleList`,
      method: "POST",
      data: {
        page: page,
        size: size
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

  //浏览文章（增加浏览量）
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

  //收藏或取消（点赞或取消点赞）
  static articleStar = (article_id, user_id, status, success, fail) => {
    wx.request({
      url: `${baseUrl}starArticle`,
      method: "POST",
      data: {
        article_id: article_id,
        user_id: user_id,
        type: 1,
        status: status,
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

  static isStarArticle = (article_id, user_id, success, fail = (res)=>{}) => {
    wx.request({
      url: `${baseUrl}getStarStatus`,
      method: "POST",
      data: {
        article_id: article_id,
        user_id: user_id
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

  //获取我  点赞的文章列表
  static getMyStarArticles = (page, size, user_id, success, fail) => {
    wx.request({
      url: `${baseUrl}getMyStarArticles`,
      method: "POST",
      data: {
        page: page,
        size: size,
        user_id: user_id,
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


  //获取文章详情
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

  //关键字查询文章
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

  //获取文章评论列表
  static getArticleComments = (page, size, article_id, success, fail) => {
    wx.request({
      url: `${baseUrl}getArticleComments`,
      method: "POST",
      data: {
        page: page,
        size: size,
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

  //评论文章
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

//上传文章
  static uploadArticle = (param, success, fail) => {
    wx.request({
      url: `${baseUrl}uploadArticle`,
      method: "POST",
      data: param,
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

/**
 * 相关文章
 */
  static relativeArticles = (key, success, fail = (res)=>{}) => {
    wx.request({
      url: `${baseUrl}like`,
      method: "POST",
      data: {key},
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

api.baseUrl = baseUrl;
api.uploadArticleImg = baseUrl +'uploadArticleImg';