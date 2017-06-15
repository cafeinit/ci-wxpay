/**
 * @fileoverview CIWxPay
 * @author burning (www.cafeinit.com)
 * @version 2017.06.15
 */

const crypto = require('crypto')
const request = require('request')
const utils = require('./utils')

const SIGN_TYPE = 'MD5'

class CIWxPay {
  /**
   * @param {String} appid  公众账号ID
   * @param {String} mch_id  商户号
   * @param {String} mch_key  微信商户平台API密钥
   * @param {String} pfx  微信商户平台证书
   */
  constructor({ appid, mch_id, mch_key, pfx }) {
    this.appid = appid
    this.mch_id = mch_id
    this.mch_key = mch_key
    this.pfx = pfx

    this.api_url = {
      unified_order: 'https://api.mch.weixin.qq.com/pay/unifiedorder'
    }

    this.isDebug = false
  }

  getBrandWCPayRequestParams(params, callback) {
    params = params || {}
    params.trade_type = 'JSAPI'

    this.unifiedOrder(params, (err, result) => {
      if (err) {
        callback(err)
        return
      }

      let reqRarams = {
        appId: result.appid,
        nonceStr: result.nonce_str,
        signType: result.trade_type,
        package: 'prepay_id=' + result.prepay_id,
        timeStamp: parseInt(Date.now() / 1000)
      }
      reqRarams.paySign = getSign(reqRarams, result.sign_type, this.mch_key)

      callback(null, reqRarams)
    })
  }

  unifiedOrder(params, callback) {
    params = params || {}
    // 添加公共参数
    params.appid = this.appid
    params.mch_id = this.mch_id

    // 添加签名
    params.nonce_str = utils.getNonceString()
    params.sign_type = params.sign_type || SIGN_TYPE
    params.sign = getSign(params, params.sign_type, this.mch_key)

    this.log('CIWxPay.unifiedOrder.params', params)
    request({
      url: this.api_url.unified_order,
      method: 'POST',
      body: utils.buildXML(params),
      // agentOptions: {
      //   pfx: this.pfx,
      //   passphrase: this.mch_id
      // }
    }, (err, response, body) => {
      this.log('CIWxPay.unifiedOrder.request', err, response.statusCode, body)
      if (err) {
        callback(err)
        return
      }

      if (response.statusCode !== 200) {
        callback({
          statusCode: response.statusCode
        })
        return
      }

      utils.parseXML(body, (err, result) => {
        if (err) {
          callback(err)
          return
        }

        if (result.return_code === 'SUCCESS') {
          callback(null, result)
        }
        else {
          callback(result)
        }
      })
    })
  }

  log() {
    if (this.isDebug) {
      console.log.apply(this, arguments)
    }
  }
}

function getSign(params, sign_type, key) {
  let query_string = Object.keys(params).filter((key) => {
    const filterKeys = ['mch_key', 'pfx', 'key', 'sign']
    return (params[key] !== undefined && params[key] !== '' && filterKeys.indexOf(key) < 0)
  }).sort().map((key) => {
    return key + '=' + params[key]
  }).join('&') + '&key=' + key


  const hash = crypto.createHash(sign_type)
  hash.update(query_string)

  return hash.digest('hex').toUpperCase()
}

module.exports = CIWxPay
