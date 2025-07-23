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
export function cargoTransport(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/detailGyMx`,
    method: 'GET',
    params
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
export function detailByUpdateSend(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/detailByUpdateSend/${id}`,
    method: 'get',
  })
}
//增加货运位置
export function addFreightLocations(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialTrackMessageRest/create`,
    method: 'POST',
    data
  })
}
// 货运列表
export function addList(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialTrackMessageRest/list`,
    method: 'get',
    params
  })
}

// 编辑  /materialCirculationTableRest/modifySend
export function detailBySendEdit(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/detailBySend/`+id,
    method: 'get',
  })
}

// 编辑  
export function modifySendGoods(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/modifySend`,
    method: 'post',
    data
  })
}