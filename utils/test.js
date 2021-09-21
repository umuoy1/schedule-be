const request = require('request')
const fs = require('fs')
const getJSID = require('./main')
const parse = require('./schedule-parse')
module.exports = async (username, password) => {
    return new Promise((resolve, reject)=>{
    getJSID(username, password)
        .then(JID => {
            request({
                // url: 'http://jwgl.csuft.edu.cn/jsxsd/xxwcqk/xxwcqk_byxfqkcx.do',
                url: 'http://jwgl.csuft.edu.cn/jsxsd/xskb/xskb_list.do',
                method: 'GET',
                headers: {
                    'Cookie': JID
                },
                proxy: 'http://101.35.126.225:8887'
            }, (er, res, body) => {
                if (er) {
                    return reject(er)
                }
                const parsed = parse(body)
                return resolve(parsed)
            })

        })
        .catch(er => {
            return reject(er)
        })

    })

}