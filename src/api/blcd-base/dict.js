import request from '@/utils/request'
let VUE_APP_BASE_SERVER = process.env.VUE_APP_BASE_SERVER;

export function getListByParentCode(code) {
  return new Promise(async (resolve, reject) => {
      try {
        const res = await request({
          url: `${VUE_APP_BASE_SERVER}/dict/getListByParentCode/${code}`,
          method: 'get',
        })
        resolve({data: res.data})
      }catch(err){
        reject(err)
      }
    })
}