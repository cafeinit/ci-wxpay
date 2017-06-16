/**
 * @fileoverview jsapi
 * @author burning (www.cafeinit.com)
 * @version 2017.06.15
 */

'use strict';

const fs = require('fs')
const CIWxPay = require('../lib/CIWxPay')
const config = require('./config')

const wxPay = new CIWxPay({
  appid: config.appid,
  mch_id: config.mch_id,
  mch_key: config.mch_key,
  pfx: fs.readFileSync(config.cert)
})
wxPay.isDebug = true

// console.log('wxPay', wxPay)
let params = {
  body: '腾讯充值中心-QQ会员充值',    // [required] 商品描述
  detail: '',     // 商品详情
  attach: '',     // 附加数据, 在查询API和支付通知中原样返回，可作为自定义参数使用
  out_trade_no: '20150806125346',   // [required] 商户订单号
  fee_type: 'CNY', // 标价币种
  total_fee: 88,   // [required] 标价金额 单位为分
  spbill_create_ip: '123.12.12.123',      // [required] 终端IP
  time_start: '20091225091010',     // 交易起始时间 yyyyMMddHHmmss
  time_expire: '20091227091010',    // 交易结束时间 yyyyMMddHHmmss
  goods_tag: '',      // 订单优惠标记
  notify_url: config.notify_url,     // [required] 通知地址
  trade_type: 'JSAPI',    // [required] 交易类型
  product_id: '12235413214070356458058',         // [required] 商品ID
  limit_pay: 'no_credit',   // 指定支付方式
  openid: 'oUpF8uMuAJO_M2pxb1Q9zNjWeS6o',     // 用户标识
}

wxPay.getBrandWCPayRequestParams(params, (err, result) => {
  console.log('wxPay.getBrandWCPayRequestParams.err', err)
  console.log('wxPay.getBrandWCPayRequestParams.result', result)

  // // 同步方式
  // res.render('wxpay/jsapi', { pay_params: result })
  //
  // // 异步方式
  // res.json(result)
})


// // 客户端同步处理
// <script>
// WeixinJSBridge.invoke('getBrandWCPayRequest',
//   <%-JSON.stringify(pay_params)%>,
//   function (res) {
//     if (res.err_msg == 'get_brand_wcpay_request:ok') {
//       // success
//     }
//     else {
//       // error
//     }
//   }
// })
// </script>
//
// // 客户端异步处理
// <script>
// getBrandWCPayRequestParams((err, params) {
//   if (!err) {
//     WeixinJSBridge.invoke('getBrandWCPayRequest', params, function (res) {
//       if (res.err_msg == 'get_brand_wcpay_request:ok') {
//         // success
//       }
//       else {
//         // error
//       }
//     })
//   }
// })
// </script>
