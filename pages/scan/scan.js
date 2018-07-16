//home.js
//获取应用实例
var app = getApp();
var blekey = require("../../utils/blekey.js")
var connecteds = [];//已经连接成功的设备集合
var tempconnectList = [];
var scanTempList = [];//扫描设备的集合
var mouseMap = ['/images/more/mouse.png', '/images/more/mouse2.png', '/images/more/mouse3.png', '/images/more/mouse4.png'];//地鼠图片路径的集合
function Connect() {
  this.id = 0;
  this.src = '/images/more/mouse.png';
  this.deviceId = '';
  this.name = '';
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    logs:[],
    list:[],
    connectList:[],
    hiddenmodal:true,

    //连接属性
    serviceId: '0000fee9-0000-1000-8000-00805f9b34fb',
    services: [],
    notifyId: 'D44BC439-ABFD-45A2-B575-925416129601',//硬件第一次发送MAC地址  初始化加密库
    notifyId2: 'D44BC439-ABFD-45A2-B575-925416129602',//震动数据
    writeId: 'd44bc439-abfd-45a2-b575-925416129600',
  },

  onLoad:function(){
    console.log('onLoad')
    var that = this;

    if(wx.openBluetoothAdapter){
      wx.openBluetoothAdapter({
        success: function (res) {
          //success
          console.log("-----success-------");
          console.log(res);
        },
        fail: function (res) {
          console.log("-----fail----------");
          // fail
          console.log(res);
        },
        complete: function (res) {
          // complete
          console.log("-----complete----------");
          console.log(res);
        }
      })
    }else{
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
      })
    }

    // 扫描到设备的回调
    wx.onBluetoothDeviceFound(function(res){
      console.log('new device list has founded',res.devices)
      var device = res.devices[0];
      for (var i = 0;i < scanTempList.length;i++){
        if (device.deviceId === scanTempList[i].deviceId){
          console.log("onBluetoothDeviceFound:已经存在");
          return;
        }
      }
      scanTempList.push(device)
      that.setData({
        list: scanTempList
      });
    })

    //监听设备连接状态
    wx.onBLEConnectionStateChange(function (res) {
      console.log(`device ${res.deviceId} state has changed,connected:${res.connected}`);
      // that.setData({ states: res.connected });
      if(res.connected){
        connecteds.push(res);
        wx.showToast({
          title: '设备连接成功!',
        })
      }
    })

    //回调获取，设备发送过来的数据
    wx.onBLECharacteristicValueChange(function (characteristics) {
      console.log("收到mcu发送的数据了++++++++")
      console.log('characteristic value comed:' + characteristics.characteristicId);
      // console.log('characteristic value value:' + that.ab2hex(characteristics.value) );
      var value = that.ab2hex(characteristics.value);
      if (characteristics.characteristicId === that.data.notifyId) {
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
        // console.debug(app.get("pages/play/play").getRandom());
        var p = app.get("pages/play/play");
        var p1 = app.get("pages/play1/play1");
        var p2 = app.get("pages/play2/play2");
        if(p != null){
          app.get("pages/play/play").onChanged(characteristics);
        }else if(p1 != null){
          app.get("pages/play1/play1").onChanged(characteristics);
        }else if(p2 != null){
          app.get("pages/play2/play2").onChanged(characteristics);
        }
      }

    })
  },

  //列表item点击事件处理
  itemViewTap:function(e){
    var that = this;
    var deviceId = e.currentTarget.dataset.title;
    that.connect(deviceId)
    // console.log(e.currentTarget.dataset.title);
    // console.log(e.currentTarget.dataset.name);
    // console.log(e.currentTarget.dataset.advertisData);
    // var title = e.currentTarget.dataset.title;
    // var name = e.currentTarget.dataset.name;
    // wx.navigateTo({
    //   url: '../conn/conn?deviceId=' + title + '&name=' + name,
    //   success: function (res) {
    //     //success
    //   },
    //   fail: function (res) {
    //     //fail
    //   },
    //   complete: function (res) {
    //     //complete
    //   }
    // })
  }, 

//开始扫描
  scan:function(){
    console.log("开始扫描");
    var that = this;
    scanTempList = [];
    setTimeout(function(){
      that.stopScan();
    },10000)
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        //success
        console.log("-----startBluetoothDevicesDiscovery--success----------");
        console.log(res);
      },
      fail: function (res) {
        //fail
        console.log(res);
      },
      complete: function (res) {
        //complete
        console.log(res);
      }
    })

    // setTimeout(function(){
    //   wx.getBluetoothDevices({
    //   success: function(res) {
    //     //success
    //     console.log("getBluetoothDevices");
    //     console.log("res");
    //     that.setData({
    //       list:res.devices
    //     });
    //     console.log(that.data.list);
    //   },
    //   fail:function(res){
    //     //fail
    //   },
    //   complete:function(res){
    //     //complete
    //   }
    // })
    // },2000);
  },

  //停止扫描
  stopScan:function(){    
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
        console.log("结束扫描")
      },
    })
  },

  //清空扫描到的数据
  clear:function(){
    this.stopScan();
    this.setData({
      list:[]
    });
  },

  //获取给定范围的随机数  0-3的随机数
  getRandom: function () {
    return Math.floor(Math.random() * 4);
  },

  //绑定设备
  bind:function(){
    var that = this;
    // that.getConnectedDevice();
    if (that.data.connectList.length == 0){
      for (var i = 0; i < connecteds.length;i++){
        var list = new Connect();
        list.id = i;
        list.deviceId = connecteds[i].deviceId;
        list.src = mouseMap[i];
        var name = that.getNameByDeviceId(list.deviceId);
        list.name = name;
        console.debug("src:"+list.src)
        tempconnectList.push(list);
      }
      //赋值给app全局
      app.globalData.connectList = tempconnectList;
      that.setData({
        connectList: tempconnectList,
        hiddenmodal:false
      })
      
    }else{
      // wx.navigateTo({
      //   url: '../play1/play1',
      // })
    }
  },

  //单人模式
  single:function(){
    wx.navigateTo({
      url: '../play/play',
    })
  },

  //加法模式
  sum:function(){
    wx.navigateTo({
      url: '../play1/play1',
    })
  },

  //打鼓模式
  hit:function(){
    wx.navigateTo({
      url: '../play2/play2',
    })
  },

  //重新绑定按钮  
  cancel: function () {
    tempconnectList = [];
    for (var i = 0; i < connecteds.length; i++) {
      var list = new Connect();
      list.id = i;
      list.deviceId = connecteds[i].deviceId;
      list.src = mouseMap[that.getRandom()];
      console.debug("src:" + list.src)
      tempconnectList.push(list);
    }
    //赋值给app全局
    app.globalData.connectList = tempconnectList;
    that.setData({
      connectList: tempconnectList,
    })
  },
  //确认  
  confirm: function () {
    this.setData({
      hiddenmodal: true
    })
    // wx.navigateTo({
    //   url: '../play1/play1',
    // })
  },  

  //获取当前连接成功的设备
  getConnectedDevice:function(){
    var that = this;
    wx.getConnectedBluetoothDevices({
      services: that.data.services,
      success: function(res) {
        console.debug("已经连接设备数量："+res.devices.length)
        connecteds = res.devices;
      },
    })
  },

  //通过deviceId获取对应设备的名称
  getNameByDeviceId:function(deviceId){
    var that = this;
    console.debug("deviceId" + deviceId)
    for (var i = 0; i < scanTempList.length;i++){
      // console.debug("d++++++",d)
      var d = scanTempList[i];
      if (deviceId === d.deviceId){
        return d.localName == null ? d.name : d.localName;
      }
    }
    return "未知设备";
  },

  //连接
  connect: function (deviceId) {
    var that = this;
    that.setData({
      deviceId: deviceId,
    });
    wx.createBLEConnection({
      deviceId: that.data.deviceId,
      success: function (res) {
        console.log(res);
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

  

})