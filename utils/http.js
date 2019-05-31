import {
  config
} from '../config'

const tips = {
  2: '出现了一个未知的错误'
}

class HTTP {
  request(params) {
    if (!params.method) {
      params.method = 'GET'
    }
    wx.request({
      url: config.api_base_url + params.url,
      data: params.data,
      method: params.method,
      dataType: 'json',
      success: res => {
        const code = res.statusCode.toString()
        if (code.startsWith('2')) {
          params.success && params.success(res.data)
        } else {
          this._show_error(res.data.err_code)
        }
      },
      fail: err => {
        this._show_error(2)
      }
    })
  }

  _show_error(show_code) {
    if (!show_code) {
      show_code = 2
    }
    wx.showToast({
      title: tips[show_code],
      icon: 'none',
      duration: 2000
    })
  }
}

export {
  HTTP
}