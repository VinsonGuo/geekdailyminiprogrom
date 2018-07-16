//获取应用实例
const app = getApp()
//连接设备界面
var blekey = require("../../utils/blekey.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '连接界面',
    states: '未连接',
    device_name: '',
    result: '',
    shake:'',
    sendData: '',
    userInfo: {},
    deviceId: '',
    name: '',
    serviceId: '0000fee9-0000-1000-8000-00805f9b34fb',
    services: [],
    notifyId: 'D44BC439-ABFD-45A2-B575-925416129601',//硬件第一次发送MAC地址  初始化加密库
    notifyId2: 'D44BC439-ABFD-45A2-B575-925416129602',//震动数据
    writeId: 'd44bc439-abfd-45a2-b575-925416129600',

    // // 游戏属性
    // score: 0,
    // currentShowIndex: null,
    // animationData: {},
    // routers: [false, false, false, false, false, false, false, false, false]  
  },

  // ArrayBuffer转16进度字符串示例
  ab2hex: function (buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join(':');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log('deviceId=' + options.deviceId);
    console.log('name=' + options.name);
    // var result = blekey.init("08:7C:BE:11:5F:B0", "42:6A:84:38:25:EE", true);
    that.setData({
      deviceId: options.deviceId,
      device_name: options.name
    });

    //监听设备连接状态
    wx.onBLEConnectionStateChange(function (res) {
      console.log(`device ${res.deviceId} state has changed,connected:${res.connected}`);
      that.setData({ states: res.connected });
    })

    //连接设备
    that.connect(options.deviceId);
    // setTimeout(function(){
    //   that.connect('B30F2EE7-D603-2D5D-7938-6291A817BDC5');
    // },4000)
    
  },

  //监听返回键
  onUnload:function(){
    wx.navigateTo({
      url: "../scan/scan",
    })
  },

  //连接
  connect:function(deviceId){
    var that = this;
    // that.setData({
    //   deviceId: deviceId,
    // });
    wx.createBLEConnection({
      deviceId: that.data.deviceId,
      success: function (res) {
        console.log(res);
        // that.setData({ states: res.errMsg });
        /**
        * 连接成功，后开始获取设备的服务列表
        */
        wx.getBLEDeviceServices({
          deviceId: that.data.deviceId,
          success: function (res) {
            console.log('device services:', res.services);
            that.setData({
              services: res.services,
              serviceId: res.services[3].uuid,
            });


            setTimeout(function () {
              wx.getBLEDeviceCharacteristics({
                deviceId: that.data.deviceId,
                serviceId: that.data.serviceId,
                success: function (res) {
                  console.log('主服务ID' + that.data.serviceId);
                  console.log('device getBLEDeviceCharacteristics:', res.characteristics);
                  that.setData({
                    notifyId: res.characteristics[1].uuid,
                    notifyId2: res.characteristics[2].uuid,
                    writeId: res.characteristics[0].uuid
                  });

                  wx.notifyBLECharacteristicValueChange({
                    deviceId: that.data.deviceId,
                    serviceId: that.data.serviceId,
                    characteristicId: that.data.notifyId,
                    state: true,
                    success: function (res) {
                      console.log("开启特征" + that.data.notifyId + "通知成功")
                    },
                  })

                  wx.notifyBLECharacteristicValueChange({
                    deviceId: that.data.deviceId,
                    serviceId: that.data.serviceId,
                    characteristicId: that.data.notifyId2,
                    state: true,
                    success: function (res) {
                      console.log("开启特征" + that.data.notifyId2 + "通知成功")
                    },
                  })

                  //回调获取，设备发送过来的数据
                  wx.onBLECharacteristicValueChange(function (characteristics) {
                    console.log("收到mcu发送的数据了++++++++")
                    console.log('characteristic value comed:' + characteristics.characteristicId);
                    // console.log('characteristic value value:' + that.ab2hex(characteristics.value) );
                    var value = that.ab2hex(characteristics.value);
                    if (characteristics.characteristicId === that.data.notifyId) {
                      //  var addr; 
                      //  for(var i =0;i<characteristics.value.length;i++){
                      //     addr += characteristics.value[i].toString(16);
                      //     addr += ":";
                      //  }
                      that.setData({ result: value });
                      if (value.slice(0, 11) === "41:44:44:52") {
                        console.log("硬件第一次发送MAC地址++++++++" + that.ab2hex(characteristics.value))
                        var appmac = value.slice(12, 29);
                        // var mcumac = value.slice(30, 47);
                        // var mcumac = that.data.deviceId; 
                        var mcumac = '61:6E:68:75:61:69';
                        console.log("appmac:" + appmac)
                        var isInitialed = blekey.init(mcumac, appmac, true);
                        console.log("初始化加密库" + isInitialed)
                        //向MCU发送确认
                        that.mcu_decode();
                      } else {
                        console.log("app收到mcu其他数据++++++++" + that.ab2hex(characteristics.value))
                      }

                    } else if (characteristics.characteristicId === that.data.notifyId2) {
                      console.log("收到震动数据")
                      //通知play界面  数据发生变化
                      console.debug(app.get("pages/play/play").getRandom());
                      app.get("pages/play/play").onChanged(characteristics);
                      that.setData({
                        shake: value
                      })

                    }

                  })


                },
                fail: function (res) {
                  console.log(res);
                }
              })

            }, 100);

          },
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },

  //第一次向mcu发送ADDROK
  mcu_decode: function () {

    var that = this;
    var hex = '';
    let buffer = new ArrayBuffer(6);
    let dataView = new DataView(buffer);

    var sendVar = [65, 68, 68, 82, 79, 75]
    for (var i = 0; i < 6; i++) {
      dataView.setInt8(i, sendVar[i]);
    }

    console.log("++++++++" + that.ab2hex(buffer));
    that.setData({
      sendData: that.ab2hex(buffer)
    });
    wx.writeBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: this.data.serviceId,
      characteristicId: this.data.writeId,
      value: buffer,
      success: function (res) {
        console.log("success  第一次向mcu发送ADDROK成功！");
        console.log(res);
      },
      fail: function (res) {
        // fail
        console.log(res);
      },
      complete: function (res) {
        // complete
      }
    })
  },

  //发送前后左右命令数据
  forward: function () {

    var that = this;
    var hex = '';
    let buffer = new ArrayBuffer(14);
    let dataView = new DataView(buffer);

    var sendVar = [84, 82, 0x16, 0x02, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
    var encode = blekey.write(sendVar);
    console.log("encode===data:" + encode)
    for (var i = 0; i < 14; i++) {
      dataView.setInt8(i, encode[i]);
    }

    console.log("++++++++" + that.ab2hex(buffer));
    that.setData({
      sendData: that.ab2hex(buffer)
    });
    wx.writeBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: this.data.serviceId,
      characteristicId: this.data.writeId,
      value: buffer,
      success: function (res) {
        console.log("success  指令发送成功");
        console.log(res);
      },
      fail: function (res) {
        // fail
        console.log(res);
      },
      complete: function (res) {
        // complete
      }
    })
  },

  //断开
  disconnect:function(){
    var that = this;

    wx.closeBLEConnection({
      deviceId: this.data.deviceId,
      success: function(res) {
        wx.showToast({
          title: '断开设备成功',
          duration:1000
        })
      },
      fail: function (res) {
        // fail
        console.log(res);
      },
      complete: function (res) {
        // complete
      }
    })
  },

  //打地鼠
  toplay:function(){
    wx.navigateTo({
      url: "../play/play",
    })
  }
})