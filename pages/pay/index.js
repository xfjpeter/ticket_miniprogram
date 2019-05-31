import { Ticket } from '../../model/ticket.js'
const ticketModel = new Ticket()
import { aesDecrypt } from '../../utils/cryptojs'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: [],
    map: [],
    sites: [],
    name: '',
    no: '',
    order_no: '',
    startTime: '',
    price: 0.00
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      form: JSON.parse(options.form),
      map: JSON.parse(options.map),
      name: options.name,
      no: options.no,
      order_no: options.orderNo,
      startTime: options.startTime,
      price: options.price,
      sites: JSON.parse(options.sites)
    })
  },

  payment () {
    const uid = aesDecrypt(wx.getStorageSync('uid'))
    wx.showLoading({
      title: '支付中...',
      mask: true
    })

    ticketModel.pay({order_no: this.data.order_no, uid}, res => {
      console.log(res)
      if (res.err_code == 0) {
        // 调用小程序支付
        wx.requestPayment({
          timeStamp: res.data.timeStamp.toString(),
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: resp => {
            console.log(resp)
            // 返回到我的页面
            wx.removeStorageSync(`order_${this.no}`)
            wx.hideLoading()
            wx.navigateBack({
              delta: 3
            })
          },
          fail: error => {
            wx.hideLoading()
            console.log(error)
          }
        })
      } else {
        wx.navigateBack({
          delta: 3
        })
        wx.showToast({
          title: res.message,
        })
      }
    })
    // wx.requestPayment({
    //   timeStamp: '',
    //   nonceStr: '',
    //   package: '',
    //   signType: '',
    //   paySign: '',
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})