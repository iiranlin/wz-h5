import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

//获取标段下的所有物资
export function getListBySectionId(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialSectionAllocation/getListBySectionId`,
    method: 'get',
    params
  })
}