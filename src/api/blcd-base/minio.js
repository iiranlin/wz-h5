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

//文件下载
export const minioDownload = (fileName) => {
  return request({
    url: `${VUE_APP_BASE_SERVER}/minio/download?fileName=${fileName}`,
    method: 'get',
    responseType: 'blob',
  })
}