import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog'
import { Ticket } from '../../model/ticket'
import { aesDecrypt } from '../../utils/cryptojs'
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify'
const ticketModel = new Ticket()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: []
  },

  payment (e) {
    const index = e.currentTarget.dataset.index
    const data = this.data.data[index]
    const params = [
      'sites=' + JSON.stringify(data.details.hall.sites),
      `orderNo=${data.order_no}`,
      `price=${data.details.activity.price}`,
      `startTime=${data.details.activity.start_time}`,
      `name=${data.details.activity.name}`,
      `no=${data.details.activity.no}`,
      'form=' + JSON.stringify(data.details.form),
      'map=' + JSON.stringify(data.details.hall.map)
    ]
    // 跳转到pay那个页面
    wx.navigateTo({
      url: '../pay/index?' + params.join('&')
    })
  },

  // 取消订单
  cancel (e) {
    const uid = aesDecrypt(wx.getStorageSync('uid'))
    const orderNo = e.currentTarget.dataset.no
    Dialog.confirm({
      message: '确认取消订单么，将不再订单列表显示',
      asyncClose: true
    })
      .then(() => {
        // 请求取消订单
        ticketModel.cancelOrder({ uid, order_no: orderNo }, res => {
          Dialog.close()
          // 重新拉取订单信息
          this.init()
          if (res.err_code !== 0) {
            Notify(res.message)
          }
        })
      })
      .catch(() => {
        Dialog.close()
      })
  },

  init () {
    const uid = aesDecrypt(wx.getStorageSync('uid'))
    ticketModel.listOrder({ uid }, res => {
      wx.stopPullDownRefresh()
      if (res.err_code == 0) {
        this.setData({
          data: res.data
        })
      }
    })
  },

  onShow () {
    this.init()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.init()
  },

  onPullDownRefresh () {
    this.init()
  }
})