import {
  Ticket
} from '../../model/ticket'
import {
  aesDecrypt
} from '../../utils/cryptojs'
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify'
const ticketModel = new Ticket
Page({

  /**
   * 页面的初始数据
   */
  data: {
    no: '', // 活动编号
    imgNormalUrl: '../../imgs/seat.png',
    imgForbiddenUrl: '../../imgs/not.png',
    imgSelectedUrl: '../../imgs/seatDown.png',
    imgNoneUrl: '../../imgs/seatNone.jpeg',
    seatNone: '../../imgs/site_none.png',
    seatNormal: '../../imgs/site_normal.png',
    seatSelected: '../../imgs/site_selected.png',
    seatMine: '../../imgs/site_mine.png',
    step: false, // 下一步状态
    detail: {}, // 活动详情
    selected: [], // 选择的座位
    buttonText: '请先选座', // 按钮文字
    form: [], // 输入的额外信息
    map: [] // 座位列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      no: options.no
    })

    this.init()
  },

  // 获取该活动的缓存表单信息
  getStorageForm () {
    const form = wx.getStorageSync(`form_${this.data.no}`)
    if (form) {
      this.setData({
        form: JSON.parse(form)
      })
    }
  },

  // 选座
  selectSite (e) {
    const x = e.currentTarget.dataset.x
    const y = e.currentTarget.dataset.y
    let selected = this.data.selected
    let map = this.data.map
    const originMap = this.data.detail.map
    let flag = false

    // 判断是否已经选
    selected.forEach((item, index) => {
      if (item[0] == x && item[1] == y) {
        // 找到了
        selected.splice(index, 1)
        flag = true
      }
    })
    if (flag) {
      map[x][y].type = originMap[x][y]['no']
    } else {
      selected.unshift([x, y])
      map[x][y].type = 'mine'
    }

    this.setData({
      selected,
      map,
      buttonText: selected.length <= 0 ? '请先选座' : '￥' + (selected.length * this.data.detail.price).toFixed(2) + '确认选座'
    })
  },

  // 提交订单
  submit () {
    const detail = this.data.detail
    let form = this.data.form
    let data = {
      form: {},
      map: this.data.selected,
      uid: aesDecrypt(wx.getStorageSync('uid')),
      order_no: wx.getStorageSync(`order_${this.data.no}`)
    }
    this.data.form.map(item => {
      data.form[item['field']] = item['value']
    })
    // verify selected is empty
    if (this.data.selected.length <= 0) {
      Notify('请选择你需要的座位')
      return false
    }
    Toast.loading({
      mask: true,
      message: '正在为您订座'
    })
    ticketModel.placeOrder({
      no: this.data.no,
      data: data
    }, res => {
      Toast.clear()
      if (res.err_code == 0) {
        if (res.data.order_no) {
          wx.setStorageSync(`order_${this.data.no}`, res.data.order_no)
          const sites = JSON.stringify(res.data.details.hall.sites)
          wx.navigateTo({
            url: `../pay/index?sites=${sites}&orderNo=${res.data.order_no}&price=${detail.price}&startTime=${detail.start_time}&name=${this.data.detail.name}&no=${this.data.detail.no}&form=` + JSON.stringify(form) + '&map=' + JSON.stringify(this.data.selected)
          })
        }
      } else {
        if (res.err_code == 3) {
          this.setData({
            selected: [],
            map: res.data.map
          })
        }
        Notify(res.message)
      }
    })
  },

  // 下一步
  step () {
    const form = this.data.form
    for (let i = 0; i < form.length; i++) {
      if (form[i].required == true && form[i]['value'] == '') {
        Notify(form[i]['name'] + '不能为空')
        return false
      }
    }
    // 保存缓存
    wx.setStorageSync(`form_${this.data.no}`, JSON.stringify(form))
    this.setData({
      step: !this.data.step
    })
  },

  // 输入框变化
  onChange (e) {
    const index = e.currentTarget.dataset.index
    let form = this.data.form
    form[index]['value'] = e.detail
    this.setData({
      form
    })
  },

  // 初始化
  init () {
    const that = this
    ticketModel.getActivityByNo({
      no: this.data.no
    }, res => {
      that.setData({
        map: JSON.parse(JSON.stringify(res.data.map)),
        detail: res.data,
        form: JSON.parse(JSON.stringify(res.data.form)).map(item => {
          item['value'] = ''
          return item
        })
      })

      // this.getStorageForm()
      this.getStorageMap()
    })
  },

  // 获取该项目是否有选座情况
  getStorageMap () {
    const orderNo = wx.getStorageSync(`order_${this.data.no}`)
    if (orderNo) {
      ticketModel.getOrderByNo({
        no: orderNo
      }, res => {
        if (res.err_code == 0) {
          if (res.data.status == 0) {
            const map = this.data.map
            let detail = this.data.detail
            res.data.details.hall.map.map(item => detail.map[item[0]][item[1]]['type'] = detail.map[item[0]][item[1]]['no'])
            res.data.details.hall.map.map(item => map[item[0]][item[1]]['type'] = 'mine')
            this.setData({
              selected: res.data.details.hall.map,
              map,
              detail,
              buttonText: res.data.details.hall.map.length <= 0 ? '请先选座' : '￥' + res.data.details.hall.map.length * this.data.detail.price + '确认选座'
            })
          } else {
            // 移除该订单缓存
            wx.removeStorageSync(`order_${this.data.no}`)
          }
        } else {
          // 移除该订单缓存
          wx.removeStorageSync(`order_${this.data.no}`)
        }
      })
    }
  }
})