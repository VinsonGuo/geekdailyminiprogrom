var app = getApp();
var mouseMap = [];
var lastBallTime = 0;
var queue;
var position = 0;
var timeoutBalls = [];//已经过时的小球   就是已经进洞的
var ball;//最前面的小球
var innerAudioContext;
function Ball() {
  this.id = 0;
  this.time = 0;
  this.isShow = false;
  this.src = '/images/more/mouse.png';
  this.tipSrc = '';
  this.deviceId = '';
  this.type = '',
  this.shake = false;
  this.animation = {};
  this.isHit = false;//是否被击中
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    balls:[],
    hiddenmodal:true
  },

  onReady: function () {
    //添加本类模型到app  全局
    app.add(this);
    var animation = wx.createAnimation();
    this.animation = animation;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    mouseMap = app.globalData.connectList;
    wx.setNavigationBarTitle({
      title: '打地鼠',
    })
    queue = new Queue();
    for (var i = 0; i < Point.length; i++) {
      var point = Point[i];
      var b = new Ball();
      if (point.type == 1){
        b.src = '/images/more/ball0.png';
        b.deviceId = mouseMap[0].deviceId;
        b.type = point.type;
      }else if (point.type == 2) {
        b.src = '/images/more/ball1.png';
        b.deviceId = mouseMap[1].deviceId;
        b.type = point.type;
      }else{
        b.src = '/images/more/mouse.png';
        b.deviceId = '0';
        b.type = point.type;
      }
      
      b.time = point.time;
      queue.put(b);
    }
  },

  onUnload: function () {
    position = 0;
  },

  //获取给定范围的随机数  0-8的随机数
  getRandom: function () {
    return Math.floor(Math.random() * 9);
  },

  //app收到mcu数据变化时的回调
  onChanged: function (message) {
    var that = this;
    var dateTime = parseInt(new Date() - lastBallTime);
    lastBallTime = new Date();
    var deviceId = message.deviceId;
    var balls = that.data.balls;
    
    for (var i = timeoutBalls.length; i < balls.length;i++){
      if (balls[i].type === '1' && balls[i].deviceId === deviceId && balls[i].isHit && !balls[i].shake){
        balls[i].shake = true;
        that.playMusic(0);
      } else if (balls[i].type === '2' && balls[i].deviceId === deviceId && balls[i].isHit && !balls[i].shake) {
        balls[i].shake = true;
        that.playMusic(1);
      } else if (balls[i].type === '3' && balls[i].deviceId === '0' && balls[i].isHit && !balls[i].shake){
        console.log("两个一起震动：" + dateTime)
        //两个一起震动
        if (dateTime < 100){
          balls[i].shake = true;
          that.playMusic(2);
        }
      }
    }
    // console.log("执行总时间：" + deteTime)

  },

  //开始游戏
  start:function(){
    timeoutBalls = [];
    // this.playBackMusic();
    this.startNext();
  },

  //开启下一个球
  startNext(){
    var time = 0;
    var that = this;
    var balls = that.data.balls;
    // balls = [];
    //从队列中取出一个ball
    if (!queue.isEmpty()) {
      ball = queue.remove();
    } else {
      console.log("队列中已经没有小球了");
      that.pauseBackMusic();
      return;
    }
    if(position == 0){
      time = ball.time;
    }else{
      time = ball.time - balls[position].time;
    }
    console.log("时间：" + ball.time);
    
    balls.push(ball);
    that.setData({
      balls: balls
    })
    setTimeout(function () {
      that.startBallAnimation(position);
      position++;
    }, time*1000*1)
  },

  //开始球的位移动画
  startBallAnimation: function (position) {
    var that = this;
    //开始下一个小球
    that.startNext();
    //4000ms后设置isHit为true 然后再100ms后再设置为false （说明：在这100ms内摇晃手环则为击中） 
    setTimeout(function () {
      console.log("setTimeout+++:" + position);
      var ball = that.data.balls[position];
      ball.isHit = true;
      that.setData({
        balls: that.data.balls
      })
      setTimeout(function () {
        var balls = that.data.balls;
        var ball = balls[position];
        ball.isHit = false;
        ball.isShow = false;
        ball.shake = false;
        // // //删除该元素
        // balls.splice(position,1);
        // console.log("删除元素+++:" + position);
        //添加到过时小球的集合中
        timeoutBalls.push(ball);
        that.setData({
          balls: that.data.balls
        })
      }, 200)
    }, 1000)

    var ball = that.data.balls[position];
    //先显示
    ball.isShow = true;//
    that.setData({
      balls: that.data.balls
    })
    console.log("startBallAnimation:" + position);
    //开始执行从左到右的动画
    this.animation.translateX(-270).step({ duration: 1000 });
    ball.animation = this.animation.export();
    that.setData({
      balls: that.data.balls
    })
    //开始下一个小球
    // var randomTime = Math.random().toFixed(2) * 100 + 500;
    // that.startNext();
  },

  //重新开始游戏
  restart:function(){
    position = 0;
    for (var i = 0; i < Point.length; i++) {
      var point = Point[i];
      var b = new Ball();
      if (point.type == 1) {
        b.src = '/images/more/ball0.png';
        b.deviceId = mouseMap[0].deviceId;
      } else if (point.type == 2) {
        b.src = '/images/more/ball1.png';
        b.deviceId = mouseMap[1].deviceId;
      } else {
        b.src = '/images/more/mouse.png';
        b.deviceId = '0';
      }
      b.time = point.time;
      queue.put(b);
    }
    this.setData({
      balls:[]
    })
    this.start();
  },

  //结束游戏
  end:function(){
    this.pauseBackMusic();
  },

  //开始播放音乐
  playMusic: function (typeVoice) {
    var tempPath;
    if (typeVoice == 0) {
      //perfect
      tempPath = '/assets/ball.mp3'
    }else if(typeVoice ==1){
      tempPath = '/assets/ball1.mp3'
    }else if(typeVoice == 2){
      tempPath = '/assets/long_ball.mp3'
    }
    // wx.playBackgroundAudio({
    //   dataUrl: tempPath,
    // })

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
    // const innerAudioContext = wx.createInnerAudioContext()
    // innerAudioContext.onStop()
  },

  //播放背景音乐
  playBackMusic(){
    // wx.playBackgroundAudio({
    //   dataUrl: 'http://api.e-toys.cn/resources/upload/files/20180323/8a5b71aac12d0db3a2bc7cf3509094e1.mp3',
    // })
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.loop = true
    innerAudioContext.volume = 0.3
    innerAudioContext.src = 'http://api.e-toys.cn/resources/upload/files/20180323/8a5b71aac12d0db3a2bc7cf3509094e1.mp3'
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  //暂停背景音乐
  pauseBackMusic(){
    // wx.pauseBackgroundAudio();
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.stop()
  }

})

//队列对象   遵循先进先出的原则
function Queue() {
  var items = [];

//进队，向队列尾部添加一个（或多个）新项。
  this.put = function (element) {
    items.push(element);
  }
//移除队列的第一项，并返回被移除的元素。
  this.remove = function () {
    return items.shift();
  }
//返回队列中第一个元素-最先被添加，也会是最先被移除的元素。（只返回，不移除）
  this.front = function () {
    return items[0];
  }
//如果队列为空，返回true，否则，返回false。
  this.isEmpty = function () {
    return items.length === 0;
  }
//清空队列
  this.clear = function () {
    items = [];
  }
//返回队列的长度。
  this.size = function () {
    return items.length;
  }

  this.print = function () {
    console.log(items.toString());
  }
}

//点的时间和属性
var Point = [
  { "type": "1", "time": "0.559" },
  { "type": "1", "time": "1.5" },
  { "type": "1", "time": "2.429" },
  { "type": "2", "time": "2.9" },
  { "type": "3", "time": "3.35" },
  { "type": "3", "time": "3.6" },
  { "type": "3", "time": "3.819" },
  { "type": "1", "time": "4.282" },
  { "type": "1", "time": "5.23" },
  { "type": "1", "time": "6.144" },
  { "type": "3", "time": "6.6" },
  { "type": "3", "time": "6.837" },
  { "type": "3", "time": "7.068" },
  { "type": "2", "time": "8" },
  { "type": "2", "time": "8.931" },
  { "type": "2", "time": "9.859" },
  { "type": "1", "time": "10.324" },
  { "type": "2", "time": "10.8" },
  { "type": "1", "time": "11.259" },
  { "type": "2", "time": "11.725" },
  { "type": "2", "time": "12.656" },
  { "type": "2", "time": "13.58" },
  { "type": "1", "time": "14.046" },
  { "type": "3", "time": "14.518" },
  { "type": "3", "time": "14.749" },
  { "type": "3", "time": "14.98" },
  { "type": "1", "time": "15.446" },
  { "type": "1", "time": "16.37" },
  { "type": "1", "time": "17.3" },
  { "type": "3", "time": "17.767" },
  { "type": "3", "time": "18" },
  { "type": "3", "time": "18.233" },
  { "type": "1", "time": "19.164" },
  { "type": "2", "time": "20.1" },
  { "type": "1", "time": "21.026" },
  { "type": "2", "time": "21.5" },
  { "type": "1", "time": "21.958" },
  { "type": "1", "time": "22.42" },
  { "type": "2", "time": "22.863" },
  { "type": "2", "time": "23.818" },
  { "type": "3", "time": "24.749" },
  { "type": "3", "time": "25.218" },
  { "type": "3", "time": "25.439" },
  { "type": "3", "time": "25.68" },
  { "type": "2", "time": "26.6" },
  { "type": "2", "time": "27.536" },
  { "type": "2", "time": "28.464" },
  { "type": "1", "time": "29.4" },
  { "type": "1", "time": "29.861" },
  { "type": "2", "time": "30.33" },
  { "type": "1", "time": "30.8" },
  { "type": "2", "time": "31.257" },
  { "type": "2", "time": "31.72" },
  { "type": "1", "time": "32.2" },
  { "type": "1", "time": "33.123" },
  { "type": "1", "time": "34.058" },
  { "type": "3", "time": "34.523" },
  { "type": "3", "time": "34.982" },
  { "type": "3", "time": "35.444" },
  { "type": "3", "time": "35.9" },
  { "type": "3", "time": "36.372" },
  { "type": "3", "time": "36.841" },
  { "type": "3", "time": "37.3" },
  { "type": "2", "time": "37.769" },
  { "type": "2", "time": "38.7" },
  { "type": "1", "time": "39.635" },
  { "type": "3", "time": "40.1" },
  { "type": "3", "time": "40.331" },
  { "type": "3", "time": "40.559" },
  { "type": "3", "time": "40.8" },
  { "type": "3", "time": "41.025" },
  { "type": "1", "time": "41.5" },
  { "type": "1", "time": "42.444" },
  { "type": "1", "time": "43.346" },
  { "type": "2", "time": "43.818" },
  { "type": "2", "time": "44.053" },
  { "type": "2", "time": "44.3" },
  { "type": "1", "time": "45.2" },
  { "type": "1", "time": "46.133" },
  { "type": "1", "time": "47.067" },
  { "type": "2", "time": "47.54" },
  { "type": "1", "time": "48" },
  { "type": "1", "time": "48.471" },
  { "type": "2", "time": "48.93" },
  { "type": "2", "time": "49.864" },
  { "type": "2", "time": "50.8" },
  { "type": "3", "time": "51.258" },
  { "type": "3", "time": "51.5" },
  { "type": "3", "time": "51.717" },
  { "type": "1", "time": "52.651" },
  { "type": "2", "time": "53.582" },
  { "type": "1", "time": "54.52" },
  { "type": "2", "time": "55.441" },
  { "type": "2", "time": "55.92" },
  { "type": "1", "time": "56.379" },
  { "type": "2", "time": "56.838" },
  { "type": "1", "time": "57.3" },
  { "type": "1", "time": "57.776" },
  { "type": "2", "time": "58.241" },
  { "type": "2", "time": "59.162" },
  { "type": "2", "time": "60.093" },
  { "type": "2", "time": "60.575" },
  { "type": "1", "time": "61.025" },
  { "type": "1", "time": "61.49" },
  { "type": "2", "time": "61.959" },
  { "type": "2", "time": "62.428" },
  { "type": "2", "time": "62.89" },
  { "type": "2", "time": "63.359" },
  { "type": "1", "time": "63.835" },
  { "type": "1", "time": "64.746" },
  { "type": "2", "time": "65.674" },
  { "type": "3", "time": "66.381" },
  { "type": "3", "time": "66.6" },
  { "type": "3", "time": "66.846" },
  { "type": "3", "time": "67.084" },
  { "type": "2", "time": "67.498" },
  { "type": "2", "time": "68.474" },
  { "type": "1", "time": "69.4" },
  { "type": "2", "time": "69.868" },
  { "type": "2", "time": "70.099" },
  { "type": "2", "time": "70.33" },
  { "type": "1", "time": "71.251" },
  { "type": "2", "time": "72.2" },
  { "type": "2", "time": "73.124" },
  { "type": "2", "time": "73.6" },
  { "type": "1", "time": "74.085" },
  { "type": "1", "time": "74.642" },
  { "type": "2", "time": "75" },
  { "type": "2", "time": "75.91" },
  { "type": "1", "time": "76.838" },
  { "type": "3", "time": "77.307" },
  { "type": "3", "time": "77.538" },
  { "type": "3", "time": "77.776" },
  { "type": "1", "time": "78.694" },
  { "type": "1", "time": "79.632" },
  { "type": "1", "time": "80.556" },
  { "type": "1", "time": "81.029" },
  { "type": "2", "time": "81.497" },
  { "type": "2", "time": "81.95" },
  { "type": "1", "time": "82.419" },
  { "type": "1", "time": "83.346" },
  { "type": "2", "time": "84.295" },
  { "type": "2", "time": "84.75" },
  { "type": "2", "time": "85.219" },
  { "type": "2", "time": "85.678" },
  { "type": "2", "time": "86.143" },
  { "type": "2", "time": "86.6" },
  { "type": "1", "time": "86.84" },
  { "type": "2", "time": "87.075" },
  { "type": "2", "time": "87.537" },
  { "type": "1", "time": "87.778" },
  { "type": "2", "time": "88" },
  { "type": "2", "time": "88.465" },
  { "type": "1", "time": "88.709" },
  { "type": "2", "time": "88.944" },
  { "type": "2", "time": "89.4" },
  { "type": "1", "time": "89.634" },
  { "type": "2", "time": "89.868" },
  { "type": "2", "time": "90.8" },
  { "type": "2", "time": "91.717" },
  { "type": "2", "time": "92.2" },
  { "type": "1", "time": "92.655" },

]