/**
 * @fileoverview utils
 * @author burning (www.cafeinit.com)
 * @version 2017.06.15
 */

const xml2js = require('xml2js')

module.exports = {
  buildXML(json) {
    const builder = new xml2js.Builder()
    return builder.buildObject(json)
  },

  parseXML(xml, callback) {
    const parser = new xml2js.Parser({
      trim: true,
      explicitArray: false,
      explicitRoot: false
    })
    parser.parseString(xml, callback)
  },

  getNonceString(length) {
    length = parseInt(length) || 32

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const maxPos = chars.length
    let noce = []

    for (let i = 0; i < length; i++) {
    	noce.push(chars.charAt(Math.floor(Math.random() * maxPos)))
    }

    return noce.join('')
  }
}
