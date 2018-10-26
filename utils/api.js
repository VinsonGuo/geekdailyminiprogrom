
import regeneratorRuntime from './regenerator-runtime/runtime'

const baseUrl = "https://502tech.com/geekdaily/";
const contentType = 'application/x-www-form-urlencoded';

const app = getApp();

export default class Api {

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

  static isStarArticle = (article_id, user_id, success, fail = (res) => { }) => {
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

  //获取文章GitHub详情
  static getGitHubDetail = (github_link, success, fail = (res) => { }) => {
    wx.request({
      url: `${baseUrl}getGitHubDetail`,
      method: "POST",
      data: {
        link: github_link
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
  static getArticleDetail = (article_id, success, fail = (res) => { }) => {
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
  static relativeArticles = (key, success, fail = (res) => { }) => {
    wx.request({
      url: `${baseUrl}like`,
      method: "POST",
      data: { key },
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

  static request = async (data, path) => {
    return await new Promise((resolve, reject) => {
      wx.request({
        url: `${baseUrl}${path}`,
        method: "POST",
        data: data,
        header: {
          'content-type': contentType
        },
        success: (res) => {
          resolve(res)
        },
        fail: (res) => {
          reject(res)
        }
      })
    }).then((res) => res.data.data);
  }

  static getArticleTotalViews = async () => {
    return Api.request(null, "getArticleTotals");
  }

  static getMyStarArticles = async (data) => {
    return Api.request(data, "getMyStarArticles");
  }

  static getMyContributeArticles = async (data) => {
    return Api.request(data, "getMyContributeArticles");
  }

  static wxLogin = async (code, nickName, avatarUrl) => {
    return Api.request({code, nickName, avatarUrl}, 'WxLogin');
  }

  static login = async () => {
    // 1先获取userInfo
    let userInfo = await new Promise((resolve, reject) => wx.getUserInfo({
      success: (res) => resolve(res),
      fail: (res) => reject(res)
    })).then(res => {
      return res.userInfo
    });
    app.globalData.userInfo = userInfo;

    // 2进行微信登录，获取code
    let code = await new Promise((resolve, reject) => {
      wx.login({
        success: (res) => resolve(res),
        fail: (res) => reject(res)
      })
    }).then(res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId;
      return res.code;
    }).catch(err => {
      wx.showToast({
        title: '登录失败!',
      })
      wx.hideLoading();
    });

    let userId = await Api.wxLogin(code, userInfo.nickName, userInfo.avatarUrl);
    wx.setStorage({
      key: 'user_id',
      data: userId,
      success: () => {
        app.globalData.userId = userId;
      }
    })
    wx.showToast({
      title: '登录成功!',
    })
    wx.hideLoading();

    // 3.后台登录
    // Api.wxLogin(code, userInfo.nickName, userInfo.avatarUrl, (res) => {
    //   console.log(res.data.data)
    //   //保存user_id到内存
    //   let userId = res.data.data.user_id;
    //   wx.setStorage({
    //     key: 'user_id',
    //     data: userId,
    //     success: () => {
    //       app.globalData.userId = userId;
    //     }
    //   })
    //   wx.showToast({
    //     title: '登录成功!',
    //   })
    //   wx.hideLoading();
    // });
  }
}

Api.baseUrl = baseUrl;
Api.uploadArticleImg = baseUrl + 'uploadArticleImg';