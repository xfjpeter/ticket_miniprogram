// pages/index/index.js
import { Ticket } from '../../model/ticket.js'
const ticketModel = new Ticket()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    activity: [],
    total: 0
  },

  // 加载数据
  init() {
    wx.showLoading({
      title: '数据加载中...',
    })
    ticketModel.getActivity(res => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      this.activity = res.data.list
      this.setData({
        activity: res.data.list,
        total: res.data.total
      })
    })
  },

  // 跳转到选座购买页面
  buy (event) {
    const that = this
    that.setData({
      loading: true
    })
    const no = event.currentTarget.dataset.no
    wx.navigateTo({
      url: `../hall/index?no=${no}`,
      success: function () {
        setTimeout(() => {
          that.setData({
            loading: false
          })
        }, 500)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },

  onPullDownRefresh () {
    this.init()
  }
})