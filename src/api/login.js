import request from '@/utils/request'
const VUE_APP_BASE_SERVER = process.env.VUE_APP_BASE_SERVER

// 根据token获取用户信息
export function authInfo() {
	return request({
    url: `${VUE_APP_BASE_SERVER}/auth/info`,
		method: 'GET',
	})
}