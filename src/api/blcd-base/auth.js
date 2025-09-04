import request from '@/utils/request'
let VUE_APP_BASE_SERVER = process.env.VUE_APP_BASE_SERVER;

const secretKey = '045429c430cf25b13f1890bcd27882d001bfa33d16998356a392a9bc654b37f2daaf36ab336b4ddbd0605e456cbbbcb05b5d7788355c7fe09d0021ae41619a0f0c'

const sm2 = require('sm-crypto').sm2

/**
 * 加密
 * @param publicKey 公钥
 * @param {*} data 需加密的数据 Object|String
 * @param cipherMode 模式
 * @returns 
 */
export function encrypt(data, publicKey, cipherMode = 1) {
    if (typeof data == "object") {
        data = JSON.stringify(data);
    }
    return '04' + sm2.doEncrypt(data, publicKey, cipherMode)
}

// 登出
export function logout() {
  return request({
    url: `${VUE_APP_BASE_SERVER}/auth/logout`,
    method: 'get',
  })
}

// 修改密码
export function changePassword(data) {
  data = { data: encrypt(data, secretKey) }
  return request({
    url: `${VUE_APP_BASE_SERVER}/auth/changePassword`,
    method: 'post',
    data
  })
}