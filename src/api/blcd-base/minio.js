import request from '@/utils/request'
let VUE_APP_BASE_SERVER = process.env.VUE_APP_BASE_SERVER;


//文件上传
export const minioUpload = (data) => {
  return request({
    url: `${VUE_APP_BASE_SERVER}/minio/upload`,
    method: 'post',
    data,
    minioSm4: true, //上传不需要加密
    timeout: 0, //无超时时间
  })
}

// 下载
export function minioDownload(params) {
	return request({
		url: `${VUE_APP_BASE_SERVER}/minio/download`,
		method: 'get',
		responseType: 'blob',
    params,
    minioSm4: true //下载不需要加密
	})
}


// 上传图片转PDF
export const minioImageToPdf = (data) => {
  return request({
    url: `${VUE_APP_BASE_SERVER}/minio/imageToPdf`,
    method: 'post',
    data,
    minioSm4: true, //上传不需要加密
    timeout: 0, //无超时时间
  })
}