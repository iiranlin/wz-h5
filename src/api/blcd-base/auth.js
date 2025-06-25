import request from '@/utils/request'
let VUE_APP_BASE_SERVER = process.env.VUE_APP_BASE_SERVER;

// 登出
export function logout() {
  return request({
    url: `${VUE_APP_BASE_SERVER}/auth/logout`,
    method: 'get',
  })
}