var app = getApp()
var mouseMap = [];//绑定进来的地鼠数组
var temp = [];//临时数组  9个地鼠洞
var tempMouseMap = [];//每次随机产生两个地鼠的组合
var bestScore;//最高分
var timer;//定时器对象
var playing = false;
var showCurrentTime;//老鼠刚出现的时间
var sum = 0;//当前的和
var sumX = 0;//当前错误的干扰项和
function Mouse() {
  this.id = 0;
  this.isShow = false;
  this.src = '/images/more/mouse.png';
  this.tipSrc = '';
  this.deviceId = '';
  this.shake = false;
  this.isAllTag = false;//如果出现一个  则其他出现的地鼠也将会被标记该属性  保证同时摇动两个设备，只进入onChanged中一个
  this.animation = {};
  this.isCanceling = false;//是否正在自动消失（如果是则 不再触发onChanged）
  this.num = ''
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    time: 20,//倒计时
    routers: [],
    bestScore:0,
    record:0,
    hiddenmodal:true,
    firstNum:'',
    secondNum:'',
    sum:''
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

  //获取第二个老鼠的随机数  不能与第一个老鼠重复
  getOtherRandom:function(i){
    while(true){
      var r = this.getRandom()
      if(r == i){
        continue;
      }else{
        return r;
      }
    }
  },

  //运动操作 
  moveUpAndDown: function () {
    var that = this;
    //定时器随机定义老鼠的位置
    timer = setInterval(function () {
      //倒计时功能
      var t = that.startTimer();
      if(t < 0){
        return;
      }
      //随机生成两个数字(0-9)  进行运算
      that.generateTwoNum();
      //随机产生的两个地鼠位置
      var index1 = that.getRandom();
      var index2 = that.getOtherRandom(index1);
      tempMouseMap = [];
      console.log("index1:" + index1 + "====" + "index2:" + index2)
      var mouse1 = that.data.routers[index1];
      var mouse2 = that.data.routers[index2];
      tempMouseMap.push(mouse1);
      tempMouseMap.push(mouse2);
      // 1200ms后自动消失
      setTimeout(function(){
        if (tempMouseMap[0].isShow && !tempMouseMap[0].isAllTag){
          //设置正在消失的属性
          tempMouseMap[0].isCanceling = true;
          tempMouseMap[1].isCanceling = true;
          that.setData({
            routers: that.data.routers
          })
          //同时隐藏两个地鼠动画
          that.cancleAnimation(tempMouseMap[0].id);
          that.cancleAnimation(tempMouseMap[1].id);
          setTimeout(function(){
            tempMouseMap[0].isShow = false;
            tempMouseMap[1].isShow = false;
            tempMouseMap[0].isCanceling = false;
            tempMouseMap[1].isCanceling = false;
            that.setData({
              routers: that.data.routers,
              score: that.data.score - 1
            })
          },500) 
        }
      },3500)

      for (var i = 0; i < tempMouseMap.length;i++){
        tempMouseMap[i].isShow = true;
        tempMouseMap[i].deviceId = mouseMap[i].deviceId;
        tempMouseMap[i].src = mouseMap[i].src;
      }
      var numRandom = Math.round(Math.random() * 1);
      if(numRandom == 0){
        mouse1.num = sum;
        mouse2.num = sumX;
      }else{
        mouse1.num = sumX;
        mouse2.num = sum;
      }
      that.setData({
        routers: that.data.routers
      })
      setTimeout(function(){
        //开始动画
        that.startAnimation(index1)
        that.startAnimation(index2)
      },10)
    }, 4000);
  },

  //随机生成两个数字(0-9)  进行运算
  generateTwoNum:function(){
    var n1 = Math.floor(Math.random() * 10);
    var n2 = Math.floor(Math.random() * 10);
    sum = n1 + n2;
    //生成一个干扰项
    var g = Math.round(Math.random() * 1);
    if(g == 0){
      //干扰项1
      sumX = Math.floor(sum/10*9);
    }else{
      //干扰项2
      sumX = Math.ceil(sum/10*11);
    }
    //刷新提示数据
    this.setData({
      firstNum: n1,
      secondNum:n2,
      sum:'?'
    })

  },

  //倒计时开始
  startTimer:function(){
    var that = this;
    var time = that.data.time - 1;
    if (time < 0) {
      //gameover
      that.end()
      //判断当前分数是否大于历史纪录  大于则更新最高纪录  否则不做任何处理
      if (that.data.score > bestScore) {
        //播放最高纪录音效
        that.playMusic(4)
        //更新
        bestScore = that.data.score;
        //保存到本地
        wx.setStorageSync('bestScore', bestScore)
        that.setData({
          bestScore: bestScore,
          record: bestScore,
          hiddenmodal: false
        })
      } else {
        wx.showModal({
          title: '游戏结束！',
          content: '本次得分:' + that.data.score + "分",
          showCancel: false,
          success: function (res) {
          }
        })
      }
      return -1;
    } else {
      that.setData({
        time: time
      })
      return time;
    }
  },

  //地鼠出现的上升动画
  startAnimation: function (i) {
    var that = this;
    this.animation.translateY(-8).step({ duration: 500 });
    var mouse = that.data.routers[i];
    mouse.animation = this.animation.export();
    this.setData({
      routers: that.data.routers
    })
  },

  //地鼠消失的下降动画
  cancleAnimation: function (i) {
    var that = this;
    this.animation.translateY(8).step({ duration: 500 })
    var mouse = that.data.routers[i];
    mouse.animation = this.animation.export();
    this.setData({
      routers: that.data.routers,
    })
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
    console.debug("play界面收到conn界面发送来的数据")
    for(var i = 0;i < 9;i++){
      var mouse = that.data.routers[i];
      if (deviceId === that.data.routers[i].deviceId && mouse.isShow 
      && !mouse.isAllTag && !mouse.isCanceling && !mouse.shake){
        if (mouse.num === sum){
          //回答正确  加分
          mouse.shake = true;
          tempMouseMap[0].isAllTag = true;
          tempMouseMap[1].isAllTag = true;
          mouse.tipSrc = '/images/more/amazing.png';
          that.playMusic(0);
          that.setData({
            routers: that.data.routers,
          })
          console.log("回答正确："+i)
          //隐藏两个地鼠的动画
          that.cancleAnimation(tempMouseMap[0].id);
          that.cancleAnimation(tempMouseMap[1].id);
          setTimeout(function () {
            for (var i = 0; i < tempMouseMap.length; i++) {
              tempMouseMap[i].isShow = false;
              tempMouseMap[i].shake = false;
              tempMouseMap[i].isAllTag = false;
            }
            that.setData({
              routers: that.data.routers,
              score: that.data.score + 2
            })
          }, 500)
        } else if (mouse.num === sumX){
          //回答错误  扣分
          mouse.shake = true;
          tempMouseMap[0].isAllTag = true;
          tempMouseMap[1].isAllTag = true;
          mouse.tipSrc = '/images/more/miss.png';
          that.playMusic(3);
          that.setData({
            routers: that.data.routers,
          })
          console.log("回答错误：" + i)
          //隐藏两个地鼠的动画
          that.cancleAnimation(tempMouseMap[0].id);
          that.cancleAnimation(tempMouseMap[1].id);
          setTimeout(function () {
            for (var i = 0; i < tempMouseMap.length; i++) {
              tempMouseMap[i].isShow = false;
              tempMouseMap[i].shake = false;
              tempMouseMap[i].isAllTag = false;
            }
            that.setData({
              routers: that.data.routers,
              score: that.data.score - 1
            })
          }, 500)
        } else {

        }
        return;
      }
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