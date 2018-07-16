//连接设备界面
var blekey = require("../../utils/blekey.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto:'连接界面',
    states:'未连接',
    device_name:'',
    result:'',
    sendData:'',
    userInfo:{},
    deviceId:'',
    name:'',
    serviceId:'0000fee9-0000-1000-8000-00805f9b34fb',
    serviceBetteyId:'',
    services:[],
    characteristicNotify:'',//通用通知id
    notifyId: 'D44BC439-ABFD-45A2-B575-925416129601',//硬件第一次发送MAC地址  初始化加密库
    notifyId2:'D44BC439-ABFD-45A2-B575-925416129602',//震动数据
    // notifyBetteyId: '00002a19-0000-1000-8000-00805f9b34fb',//电量通知
    writeId:'d44bc439-abfd-45a2-b575-925416129600'
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
    console.log('deviceId='+options.deviceId);
    console.log('name=' + options.name);
    var result = blekey.init("08:7C:BE:11:5F:B0", "42:6A:84:38:25:EE", true);
    that.setData({
      deviceId:options.deviceId,
      device_name:options.name
      });

    //监听设备连接状态
    wx.onBLEConnectionStateChange(function(res){
      console.log(`device ${res.deviceId} state has changed,connected:${res.connected}`);
      that.setData({ states: res.connected });
    })

    //连接设备
    wx.createBLEConnection({
      deviceId: that.data.deviceId,
      success: function(res) {
        console.log(res);
        // that.setData({ states: res.errMsg });
         /**
         * 连接成功，后开始获取设备的服务列表
         */
        wx.getBLEDeviceServices({
          deviceId: that.data.deviceId,
          success: function(res) {
            console.log('device services:',res.services);
            that.setData({
              services: res.services,
              serviceId: res.services[4].uuid,
              serviceBetteyId:res.services[1].uuid
              });

      
              wx.getBLEDeviceCharacteristics({
                deviceId: that.data.deviceId,
                serviceId: that.data.serviceId,
                success: function(res) {
                  console.log('主服务ID' + that.data.serviceId);
                  for (var i = 0; i < res.characteristics.length; i++) {
                    console.log('characteristics' + i, res.characteristics[i].uuid)
                    if (res.characteristics[i].properties.notify == true || res.characteristics[i].properties.indicate == true) {
                      console.log("特性" + res.characteristics[i].uuid + "可以设置通知")
                      that.setData({ characteristicNotify: res.characteristics[i].uuid })
                      wx.notifyBLECharacteristicValueChange({
                        deviceId: that.data.deviceId,
                        serviceId: that.data.serviceId,
                        characteristicId: that.data.characteristicNotify,
                        state: true,
                        success: function (res) {
                          // console.log("开启特征" + that.data.characteristicNotify + "通知成功")
                          console.log('notifyBLECharacteristicValueChange success', res.errMsg)
                        },
                      })
                    }

                    if (res.characteristics[i].properties.write == true) {
                      console.log('写数据特征是' + res.characteristics[i].uuid)
                      that.setData({ writeId: res.characteristics[i].uuid })
                      console.log("可写数据特征是" + that.data.writeId)
                    }

                  }
                },
              })
            
          
           //设置电量通知
            setTimeout(function(){
              wx.getBLEDeviceCharacteristics({
                deviceId: that.data.deviceId,
                serviceId: that.data.serviceBetteyId,
                success: function (res) {
                  console.log('电量服务ID' + that.data.serviceBetteyId);
                  console.log('device getBLEDeviceCharacteristics:', res.characteristics);
                  // that.setData({
                  //   notifyId:res.characteristics[1].uuid,
                  //   notifyId2: res.characteristics[2].uuid,
                  //   writeId:res.characteristics[0].uuid
                  // }); 

                  for (var i = 0; i < res.characteristics.length; i++) 
                  {
                    console.log('characteristics' + i, res.characteristics[i].uuid)
                    if (res.characteristics[i].properties.notify == true || res.characteristics[i].properties.indicate == true) 
                    {
                      console.log("特性" + res.characteristics[i].uuid + "可以设置通知")
                      that.setData({ characteristicNotify: res.characteristics[i].uuid })
                      wx.notifyBLECharacteristicValueChange({
                        deviceId: that.data.deviceId,
                        serviceId: that.data.serviceBetteyId,
                        characteristicId: that.data.characteristicNotify,
                        state: true,
                        success: function (res) {
                          // console.log("开启特征" + that.data.characteristicNotify + "通知成功")
                          console.log('notifyBLECharacteristicValueChange success', res.errMsg)
                        },
                      })
                    }

                    if (res.characteristics[i].properties.write == true) {
                      console.log('写数据特征是' + res.characteristics[i].uuid)
                      that.setData({ writeId: res.characteristics[i].uuid })
                      console.log("可写数据特征是" + that.data.writeId)
                    }

                  }


                },
                fail: function (res) {
                  console.log(res);
                }
              })
              
            },1000);


            //回调获取，设备发送过来的数据
            wx.onBLECharacteristicValueChange(function (characteristics) {
              console.log("收到mcu发送的数据了++++++++")
              console.log('characteristic value comed:' + characteristics.characteristicId);
              // console.log('characteristic value value:' + that.ab2hex(characteristics.value) );
              var value = that.ab2hex(characteristics.value);
              that.setData({ result: value });
              // if (characteristics.characteristicId === that.data.notifyId) {
              //   console.log("硬件第一次发送MAC地址++++++++" + that.ab2hex(characteristics.value))
              //  var addr; 
              //  for(var i =0;i<characteristics.value.length;i++){
              //     addr += characteristics.value[i].toString(16);
              //     addr += ":";
              //  }

              // var isInitialed = blekey.init("61:6E:68:75:61:69", "DE:F0:12:34:56:78", false);
              // console.log("初始化加密库" + isInitialed)
              // //向MCU发送确认
              // that.mcu_decode();

              // } else if (characteristics.characteristicId === that.data.notifyId2) {
              //   console.log("收到震动数据")
              // }

            })


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

  //发送数据
  play:function(){

    var that = this;
    var hex = '';
    let buffer = new ArrayBuffer(13);
    let dataView = new DataView(buffer);

    var sendVar =  [84, 82, 0x16, 0x06, 82, 0x05, 0x03, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00]
    for(var i = 0; i < 13; i++){
      dataView.setInt8(i, sendVar[i]);
    }
    
    console.log("++++++++" + that.ab2hex(buffer) );
    that.setData({
      sendData: that.ab2hex(buffer)
    });
    wx.writeBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: this.data.serviceId,
      characteristicId: this.data.writeId,
      value: buffer,
      success: function(res) {
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

  pause:function(){
    var that = this;
    var hex = '';
    let buffer = new ArrayBuffer(13);
    let dataView = new DataView(buffer);

    var sendVar = [84, 82, 0x16, 0x06, 82, 0x05, 0x03, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00]
    for (var i = 0; i < 13; i++) {
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


  mcu_decode: function () {

    var that = this;
    var hex = '';
    let buffer = new ArrayBuffer(6);
    let dataView = new DataView(buffer);

    var sendVar = [65,68,68,82,79,75]
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

  

  
})