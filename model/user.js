import {HTTP} from '../utils/http'
import { aesDecrypt } from '../utils/cryptojs'

class User extends HTTP {
  login ({code}, sCallback) {
    this.request({
      method: 'post',
      url: '/login',
      data: {code},
      success (res) {
        if (res.err_code === 0 && typeof sCallback === 'function') {
          sCallback(JSON.parse(aesDecrypt(res.data)))
        }
      }
    })
  }
}

export {User}