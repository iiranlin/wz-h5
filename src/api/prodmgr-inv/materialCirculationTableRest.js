import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

// 获取供应商发货批次
export const listPc = (id) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/listPc/${id}`,
    method: 'get',
  })
}

// 物流跟踪明细查询
export const detailWlgz = (id) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/detailWlgz/${id}`,
    method: 'get',
  })
}