var app = getApp()
var mouseMap = [];
var temp = [];
var bestScore;
var timer;
var playing = false;
var showCurrentTime;//老鼠刚出现的时间
function Mouse() {
  this.id = 0;
  this.isShow = false;
  this.src = '/images/more/mouse.png';
  this.tipSrc = '';
  this.deviceId = '';
  this.shake = false;
  this.animation = {}
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    time: 20,//倒计时
    currentShowIndex: null,
    routers: [],
    bestScore:0,
    record:0,
    hiddenmodal:true
  },

  onReady: function () {
    var animation = wx.createAnimation()
    this.animation = animation
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //添加本类模型到app  全局
    app.add(this);
    mouseMap = app.globalData.connectList;
    //从内存获取最高纪录
    bestScore = wx.getStorageSync('bestScore') || 0;
    wx.setNavigationBarTitle({
      title: '打地鼠',
    })

    for (var i = 0; i < 9; i++) {
      var mouse = new Mouse();
      mouse.id = i;
      temp.push(mouse)
    }
    this.setData({
      routers: temp,
      bestScore: bestScore
    })
    console.debug("routers====", this.data.routers)
    console.debug("temp====" + temp.length) 
  },

  onUnload: function () {
    timer = null;
    temp = [];
    playing = false;
  },

  //获取给定范围的随机数  0-8的随机数
  getRandom: function () {
    return Math.floor(Math.random() * 9);
  },

  //运动操作 
  moveUpAndDown: function () {
    var that = this;
    //定时器随机定义老鼠的位置
    timer = setInterval(function () {
      var time = that.data.time - 1;
      if (time < 0) {
        //gameover
        that.end()
        //判断当前分数是否大于历史纪录  大于则更新最高纪录  否则不做任何处理
        if (that.data.score > bestScore){
          //播放最高纪录音效
          that.playMusic(4)
          //更新
          bestScore = that.data.score;
          //保存到本地
          wx.setStorageSync('bestScore', bestScore)
          that.setData({
            bestScore: bestScore,
            record: bestScore,
            hiddenmodal:false
          })
          
        }else{
          wx.showModal({
            title: '游戏结束！',
            content: '本次得分:' + that.data.score + "分",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {

              }
            }
          })
        }
        return;
      } else {
        that.setData({
          time: time
        })
      }
      //随机产生的位置
      var index = that.getRandom();
      console.log("sssss" + index)
      var mouse = that.data.routers[index];

      // 700s后自动消失
      setTimeout(function(){
        if (mouse.isShow){
          //隐藏地鼠动画
          that.cancleAnimation(mouse.id)
          setTimeout(function(){
            mouse.isShow = false;
            that.setData({
              routers: that.data.routers,
              // score: that.data.score - 1
            })
          },300) 
        }
      },700)

      for (var i = 0; i < 9; i++) {
        if (index == i) {
          that.data.currentShowIndex = index;
          mouse.isShow = true;
          var num = mouseMap.length;
          console.log("num" + num)
          var random;
          if (num > 1) {
            random = Math.floor(Math.random() * num);//生成0-(num-1)随机整数
          } else if (num == 1) {
            random = 0;
          }
          console.log("random" + random)
          mouse.deviceId = mouseMap[random].deviceId;
          mouse.src = mouseMap[random].src;
          //地鼠出现的当前时间
          showCurrentTime = new Date();
          console.log("currentShowIndex" + that.data.currentShowIndex)
          that.setData({
            routers: that.data.routers
          })

          setTimeout(function(){
            //开始动画
            that.startAnimation(that.data.currentShowIndex)
          },10)
          
        }
      }
    }, 1500);
  },

  //点击地鼠事件
  // click:function(e){
  //   var that = this;
  //   var id = e.currentTarget.dataset.id;
  //   if (id == that.data.currentShowIndex){
  //     var mouse = that.data.routers[id];
  //     //当前是显示的
  //     console.log("id" + id)
  //     mouse.isShow = false;
  //     that.setData({
  //       routers: that.data.routers,
  //       score: that.data.score + 2
  //     })
  //     //隐藏地鼠动画
  //     that.cancleAnimation()
  //   }

  // },

  //地鼠出现的上升动画
  startAnimation: function (i) {
    var that = this;
    this.animation.translateY(-20).step({ duration: 500 });
    var mouse = that.data.routers[i];
    mouse.animation = this.animation.export();
    this.setData({
      routers: that.data.routers
    })
  },

  //地鼠消失的下降动画
  cancleAnimation: function (i) {
    var that = this;
    this.animation.translateY(0).step({ duration: 300 })
    var mouse = that.data.routers[i];
    mouse.animation = this.animation.export();
    this.setData({
      routers: that.data.routers,
    })

    // this.setData({
    //   animationData: this.animation.export(),
    // })
  },

  //确认  
  confirm: function () {
    this.setData({
      hiddenmodal: true
    })
  },  

  //开始游戏
  start: function () {
    var that = this;
    if (!playing) {
      that.setData({
        score: 0,
        time: 20
      })
      playing = true;
      that.moveUpAndDown();
    }
  },

  //结束游戏
  end: function () {
    var that = this;
    if (playing) {
      playing = false;
      clearInterval(timer);
    }
  },

  //重新开始
  restart: function () {
    var that = this;
    if (playing) {
      that.end()
    }
    that.start()
  },

  //重置纪录
  clear_record:function(){
    wx.removeStorageSync('bestScore')
    //从内存获取最高纪录
    bestScore = wx.getStorageSync('bestScore') || 0;
    this.setData({
      bestScore: bestScore
    })
  },

  //app收到mcu数据变化时的回调
  onChanged: function (message) {
    var that = this;
    var deviceId = message.deviceId;
    var position = that.data.currentShowIndex;
    console.debug("play界面收到conn界面发送来的数据")
    var mouse = that.data.routers[position];
    //手环震动时的时间
    var shakeTime = new Date();
    var deteTime = parseInt(shakeTime - showCurrentTime);
    if (mouse.isShow && !mouse.shake && deviceId === mouse.deviceId) {
      mouse.shake = true;
      var tempScore;
      if(deteTime >= 0 && deteTime <= 500){
        tempScore = 3;
        mouse.tipSrc = '/images/more/amazing.png';
        that.playMusic(0);
      } else if (deteTime > 500 && deteTime <= 800){
        tempScore = 2;
        mouse.tipSrc = '/images/more/excellent.png';
        that.playMusic(1);
      } else if (deteTime > 800 && deteTime < 1500) {
        tempScore = 1;
        mouse.tipSrc = '/images/more/good.png';
        that.playMusic(2);
      }
      that.setData({
        routers: that.data.routers,
      })
      //隐藏地鼠动画
      that.cancleAnimation()
      setTimeout(function () {
        mouse.shake = false;
        mouse.isShow = false;
        that.setData({
          routers: that.data.routers,
          score: that.data.score + tempScore
        })
      }, 300)
    } else if (mouse.isShow && !mouse.shake && deviceId != mouse.deviceId) {
      that.playMusic(3);
      mouse.shake = true;
      mouse.tipSrc = '/images/more/miss.png';
      that.setData({
        routers: that.data.routers,
      })
      //隐藏地鼠动画
      that.cancleAnimation()
      setTimeout(function () {
        mouse.shake = false;
        mouse.isShow = false;
        that.setData({
          routers: that.data.routers,
          score: that.data.score - 1
        })
      }, 300)
    } else {

    }
  },

  //开始播放音乐
  playMusic: function (typeVoice) {
    var tempPath;
    if (typeVoice == 0) {
      //perfect
      tempPath = '/assets/amazing.mp3'
    }else if(typeVoice == 1){
      //great
      tempPath = '/assets/excellent.mp3'
    } else if (typeVoice == 2) {
      //great
      tempPath = '/assets/good.mp3'
    }
     else if (typeVoice == 3) {
      //miss
      tempPath = '/assets/miss.mp3'
    }else if(typeVoice == 4){
      //最高纪录
      tempPath = '/assets/bestscore.mp3'
    }
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = tempPath
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  //结束播放音乐
  stopMusic: function (typeVoice) {
    var tempPath;
    if (typeVoice == 0) {
      //great
      tempPath = '/assets/great.mp3'
    } else if (typeVoice == 1) {
      //miss
      tempPath = '/assets/miss.mp3'
    }
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.onStop()
  }

})