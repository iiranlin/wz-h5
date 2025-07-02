import request from '@/utils/request'
let VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV;

//撤回
export const recall = (data) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/audit/stop`,
    method: 'post',
    data
  })
}