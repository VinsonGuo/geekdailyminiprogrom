Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 弹窗标题
    title: {
      type: String,
      value: '标题' // 默认值
    },
    // 弹窗内容
    content: {
      type: String,
      value: '弹窗内容'
    },

    // 弹窗确认按钮文字
    confirmText: {
      type: String,
      value: '确定'
    }
  },

  /**
   * 组件内私有数据
   */
  data: {
    // 弹窗显示控制
    isShow: false
  },

  /**
   * 组件的公有方法列表
   */
  methods: {

    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //展示弹框
    showDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    /**
    * triggerEvent 组件之间通信
    */
    confirmEvent() {
      this.triggerEvent("confirmEvent");
    },

    bindGetUserInfo() {
      this.triggerEvent("bindGetUserInfo");
    }

  }
})