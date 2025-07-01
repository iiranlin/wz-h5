import request from '@/utils/request'
let VUE_APP_BASE_SERVER = process.env.VUE_APP_BASE_SERVER;


//文件上传
export const minioUpload = (data) => {
  return request({
    url: `${VUE_APP_BASE_SERVER}/minio/upload`,
    method: 'post',
    data
  })
}

// 下载
export function minioDownload(params) {
	return request({
		url: `${VUE_APP_BASE_SERVER}/minio/download`,
		method: 'get',
		responseType: 'blob',
    params
	})
}
