var startPoint;
var deta_degree = 0;
var tempAngle;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startPoint: {},//触摸开始
    dotPoint: {},//圆点坐标
    startAngle: 0,//开始角度
    tempAngle: 0,//移动角度
    // src: "../images/more/forword.png",
    rotate: "0",
    rotate1: "0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '测试',
    })
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth * 0.5;
        that.setData({
          //圆点坐标,x为屏幕一半,y为半径与margin-top之和,px
          //后面获取的触摸坐标是px,所以这里直接用px.
          // dotPoint: { clientX: windowWidth, clientY: res.windowHeight * 0.5 }
          dotPoint: { clientX: 160, clientY: 120 }
        })
      }
    })

    var d1 = new Date('2018/03/15 10:17:22');
    var d2 = new Date('2018/03/15 11:17:22');
    console.log(parseInt(d2 - d1));//两个时间相差的毫秒数
    console.log(parseInt(d2 - d1) / 1000);//两个时间相差的秒数
    console.log(parseInt(d2 - d1) / 1000 / 60);//两个时间相差的分钟数
    console.log(parseInt(d2 - d1) / 1000 / 60);//两个时间相差的小时数
  },

  onShow: function () {
    this.animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
    })
  },

  touchStart: function (e) {
    console.log("++++touchStart",e)
    this.setData({
      startPoint: e.touches[0]
    })
    var angle = this.detaDegree(this.data.dotPoint.clientX, this.data.dotPoint.clientY, this.data.startPoint.clientX, this.data.startPoint.clientY);
    console.log("++++startAngle" + angle)
  },


  touchStart1: function (e) {
    console.log("++++touchStart1", e)
    this.setData({
      startPoint: e.touches[0]
    })
    var angle = this.detaDegree(this.data.dotPoint.clientX, this.data.dotPoint.clientY, this.data.startPoint.clientX, this.data.startPoint.clientY)
    console.log("++++startAngle1" + angle)
  },

  touchMove: function (e) {
    // console.log("触摸移动")
    var that = this;
    var endPoint = e.touches[e.touches.length - 1]
    //根据触摸位置计算角度
    var x = endPoint.clientX - this.data.startPoint.clientX;
    var y = endPoint.clientY - this.data.startPoint.clientY;
    // console.log("clientX:" + endPoint.clientX + "=========dotPoint:" + this.data.dotPoint.clientX)

    var angle = that.detaDegree(this.data.dotPoint.clientX, this.data.dotPoint.clientY, endPoint.clientX, endPoint.clientY);
    console.log("++++angle" + angle)
    var deteAngle = angle - tempAngle;
    console.log("++++deteAngle" + deteAngle)

    this.addDegree(deteAngle);
    tempAngle = angle;
    console.log("tempAngle" + tempAngle)
    this.setData({
      // rotate: tempAngle
      rotate: deta_degree
    })

  },

  touchMove1: function (e) {
    // console.log("触摸移动")
    var that = this;
    var endPoint = e.touches[e.touches.length - 1]
    //根据触摸位置计算角度
    var x = endPoint.clientX - this.data.startPoint.clientX;
    var y = endPoint.clientY - this.data.startPoint.clientY;
    // console.log("clientX:" + endPoint.clientX + "=========dotPoint:" + this.data.dotPoint.clientX)

    var angle = that.detaDegree(this.data.dotPoint.clientX, this.data.dotPoint.clientY, endPoint.clientX, endPoint.clientY)
    console.log("++++angle" + angle)
    var deteAngle = angle - tempAngle;
    console.log("++++deteAngle" + deteAngle)
    // if (deteAngle > 350 || deteAngle < -350){
    //   return;
    //  }
    this.addDegree(deteAngle)
    tempAngle = angle;
    console.log("tempAngle" + tempAngle)
    this.setData({
      // rotate: tempAngle
      rotate1: deta_degree
    })

  },

  touchEnd: function (e) {
    this.setData({
      rotate: 0
    })
    console.log("触摸结束")
    deta_degree = 0;
    tempAngle = 0;
    // this.rotateAni(0);
  },

  touchEnd1: function (e) {
    this.setData({
      rotate1: 0
    })
    console.log("触摸结束")
    deta_degree = 0;
    tempAngle = 0;
    // this.rotateAni(0);
  },


  detaDegree: function (src_x, src_y, target_x, target_y) {
    var detaX = target_x - src_x;
    var detaY = target_y - src_y;
    var d;
    if (detaX != 0) {
      var tan = Math.abs(detaY / detaX);

      if (detaX > 0) {

        if (detaY >= 0) {
          d = Math.atan(tan);

        } else {
          d = 2 * Math.PI - Math.atan(tan);
        }

      } else {
        if (detaY >= 0) {

          d = Math.PI - Math.atan(tan);
        } else {
          d = Math.PI + Math.atan(tan);
        }
      }

    } else {
      if (detaY > 0) {
        d = Math.PI / 2;
      } else {

        d = -Math.PI / 2;
      }
    }
    return ((d * 180) / Math.PI);
  },

  /**
    * 通过此方法来控制旋转度数，如果超过360，让它求余，防止，该值过大造成越界
    * 
    * @param added
    */
  addDegree: function (added) {
    deta_degree += added;
    // if (deta_degree > 360 || deta_degree < -360) {
    //   deta_degree = deta_degree % 360;
    // }
    if (deta_degree > 60) {
      deta_degree = 60;
    } else if (deta_degree < -60) {
      deta_degree = -60;
    }
    console.log("++++++++deta_degree" + deta_degree)
  },

})