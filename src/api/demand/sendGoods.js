import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV
//供应商需求计划列表
export function snedGoodsList(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/listBySend`,
    method: 'GET',
    params
  })
}

//确认发货
export function snedGoodsSure(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/modifyQrfh`,
    method: 'post',
    data
  })
}

//货运详情  
export function cargoTransport(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/detailGyMx?id=${id}`,
    method: 'GET',
  })
}
// 删除   
export function deleteGoods(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/batchRemove`,
    method: 'post',
    data
  })
}

export function detailBySend(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/detailBySend/${id}`,
    method: 'get',
  })
}