import {config} from '../config'

const CryptoJS = require('crypto-js')
const { Buffer } = require('buffer')
const initKey = config.aesKey
const keySize = 128

const fillKey = key => {
  const filledKey = Buffer.alloc(keySize / 8)
  const keys = Buffer.from(key)
  if (keys.length < filledKey.length) {
    filledKey.map((b, i) => filledKey[i] = keys[i])
  }

  return filledKey
}

const aesEncrypt = (data) => {
  const key = CryptoJS.enc.Utf8.parse(fillKey(initKey))
  const cipher = CryptoJS.AES.encrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    iv: ''
  })

  const base64Cipher = cipher.ciphertext.toString(CryptoJS.enc.Base64)
  const resultCipher = base64Cipher.replace(/\+/g, '-').replace(/\//g, '_')

  return resultCipher
}

const aesDecrypt = (encrypted) => {
  const key = CryptoJS.enc.Utf8.parse(fillKey(initKey))
  // 先将 Base64 还原一下, 因为加密的时候做了一些字符的替换
  const restoreBase64 = encrypted.replace(/\-/g, '+').replace(/_/g, '/')
  // 这里 mode, padding, iv 一定要跟加密的时候完全一样
  // 返回的是一个解密后的对象
  const decipher = CryptoJS.AES.decrypt(restoreBase64, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    iv: ''
  })
  // 将解密对象转换成 UTF8 的字符串
  const resultDecipher = CryptoJS.enc.Utf8.stringify(decipher)
  // 返回解密结果
  return resultDecipher
}

export { aesEncrypt, aesDecrypt}