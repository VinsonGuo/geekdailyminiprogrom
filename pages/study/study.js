//index.js
//获取应用实例
const app = getApp()
//上拉加载当前页
var currentPage = 1;
var categorys = [];

Page({
  data: {
    isHideLoadMore:true,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    swiperCurrent: 0,  
    selectCurrent: 0,
    activeCategoryId:0,
    activeCategoryName: 'App',
    categorys:[],
    imgUrls:[
      {
        link:'/pages/detail/detail',
        url: 'http://www.subaru-china.cn/impublic/index/img/banner/pfa_38.jpg'
      },{
        link: '/pages/detail/detail',
        url: 'http://www.subaru-china.cn/impublic/index/img/banner/pfa_xv_35.jpg'
      },{
        link: '/pages/detail/detail',
        url: 'http://www.subaru-china.cn/impublic/index/img/banner/pfa_39.jpg'
      }
    ],
    categories:[
      {
        id:0,
        name:'App'
      },{
        id:1,
        name:'Android'
      },{
        id:2,
        name:'iOS'
      },{
        id:3,
        name:'前端'
      },{
        id:4,
        name:'瞎推荐'
      },{
        id:5,
        name:'拓展资源'
      }
    ]
  },
  
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '首页',
    })
    this.getCategory('App',1,false);
  },

  //下拉刷新
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading()
    var that = this;
    setTimeout(function () {
      currentPage = 1;
      that.getCategory(that.data.activeCategoryName, 1, false)
    },1000)
  },

  //上拉加载更多
  onReachBottom:function(){
    var that = this;
    that.setData({
      isHideLoadMore:false
    })
    setTimeout(function(){
      currentPage += 1
      that.getCategory(that.data.activeCategoryName, currentPage, true)
    },1000)
  },

  tabClick:function(e){
    var that = this;
    this.setData({
      activeCategoryId: e.currentTarget.id,
      activeCategoryName: that.data.categories[e.currentTarget.id].name
    });
    this.getCategory(that.data.categories[e.currentTarget.id].name,1,false);
  },

  //事件处理函数
  swiperchanged:function(e){
    this.setData({
      swiperCurrent:e.detail.current
    })
  },

  //轮播图点击事件
  tapBanner:function(){
    wx.navigateTo({
      url: "/pages/detail/detail",
    })
  },

  //item点击事件
  itemTap:function(e){
    var title = e.currentTarget.dataset.title;
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: "/pages/detail/detail?title="+title+"&url="+url,
    })
  },

  bindTypeTap: function (e) {
    this.setData({
      selectCurrent: e.index
    })
  },

  //获取tab内容页
  getCategory: function (categoryName,page,isLoadMore){
    console.log(categoryName)
    var that = this;
    wx.request({
      url: 'http://gank.io/api/data/' + categoryName + '/10/' + page,
      // data: {
      //   category: categoryName,
      //   number: 20,
      //   page: 1
      // },
      success:function(res){
        // console.log(res.data.results)
        //完成停止加载
        if(!isLoadMore){
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
          categorys = []
        }
        // that.setData({
        //   categorys:[],
        //   isHideLoadMore:true
        // });
        for (var i = 0; i < 10;i++){
          categorys.push(res.data.results[i]);
          console.log(res.data.results[i])
        }
        that.setData({
          categorys: categorys,
          isHideLoadMore: true
        })
      },
      fail:function(res){
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })

  }


})
