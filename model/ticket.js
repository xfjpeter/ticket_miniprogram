import {
  aesDecrypt
} from '../utils/cryptojs'
import {
  HTTP
} from '../utils/http.js'

class Ticket extends HTTP {

  // 获取活动列表
  getActivity(sCallback) {
    return this.request({
      method: 'get',
      url: '/activity',
      success: res => {
        if (res.err_code == 0 && typeof sCallback === 'function') {
          if (res.data) {
            res.data = JSON.parse(aesDecrypt(res.data))
          }
          sCallback(res)
        }
      }
    })
  }

  // 获取活动详情
  getActivityByNo({
    no
  }, sCallback) {
    this.request({
      mehtod: 'get',
      url: `/activity/${no}`,
      success(res) {
        if (typeof sCallback === 'function') {
          if (res.data) {
            res.data = JSON.parse(aesDecrypt(res.data))
          }
          sCallback(res)
        }
      }
    })
  }

  // 订座
  placeOrder({
    no,
    data
  }, sCallback) {
    this.request({
      method: 'post',
      url: `/activity/order/${no}`,
      data,
      success(res) {
        if (typeof sCallback === 'function') {
          if (res.data) {
            res.data = JSON.parse(aesDecrypt(res.data))
          }
          sCallback(res)
        }
      }
    })
  }

  // 获取指定订单
  getOrderByNo({
    no
  }, sCallback) {
    this.request({
      url: `/order/${no}`,
      method: 'get',
      success: res => {
        if (typeof sCallback === 'function') {
          if (res.data) {
            res.data = JSON.parse(aesDecrypt(res.data))
          }
          sCallback(res)
        }
      }
    })
  }

  // 获取订单列表
  listOrder({ uid }, sCallback) {
    this.request({
      url: `/orders/${uid}`,
      method: 'get',
      success: res => {
        if (res.data) {
          res.data = JSON.parse(aesDecrypt(res.data))
        }

        if (typeof sCallback === 'function') {
          sCallback(res)
        }
      }
    })
  }

  // 取消订单
  cancelOrder({ order_no, uid }, sCallback) {
    this.request({
      url: '/order/cancel',
      data: { order_no, uid },
      method: 'post',
      success: res => {
        if (typeof sCallback === 'function') {
          if (res.data) {
            res.data = JSON.parse(aesDecrypt(res.data))
          }
          sCallback(res)
        }
      }
    })
  }

  pay({ order_no, uid }, sCallback) {
    this.request({
      url: '/pay',
      data: { order_no, uid },
      method: 'post',
      success: res => {
        if (typeof sCallback === 'function') {
          if (res.data) {
            res.data = JSON.parse(aesDecrypt(res.data))
          }
          sCallback(res)
        }
      }
    })
  }
}

export {
  Ticket
}