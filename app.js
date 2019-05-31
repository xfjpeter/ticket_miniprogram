//app.js
import {
  User
} from './model/user.js'
import {
  aesEncrypt
} from './utils/cryptojs'

const userModel = new User()
App({
  onLaunch() {
    //if (!wx.getStorageSync('uid')) {
      // 微信登录
      wx.login({
        success(res) {
          userModel.login({
            code: res.code
          }, res => {
            wx.setStorageSync('uid', aesEncrypt(res.uid))
          })
        }
      })
    //}
  }
})