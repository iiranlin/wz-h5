import request from '@/utils/request'
let VUE_APP_BASE_SERVER = process.env.VUE_APP_BASE_SERVER

// 上传
export const minioUpload = `${VUE_APP_BASE_SERVER}/minio/upload`

// 下载
export function minioDownload(params) {
	return request({
		url: `${VUE_APP_BASE_SERVER}/minio/download`,
		method: 'get',
		responseType: 'blob',
    params
	})
}
