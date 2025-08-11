import request from "@/utils/request";
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

export function listTake(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/listTake`,
    method: 'GET',
    params
  })
}

export function defaultTake(id){
    return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/detailTake/${id}`,
    method: 'GET',
  })
}

/**
 * 收货备份明细详情
 * @param {*} params 
 * @returns 
 */
export const detailTakeBack = (id) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialBackTableRest/detailByBack/${id}`,
    method: 'get',
  })
}

export function saveTake(data){
    return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/saveTake`,
    method: 'POST',
    data
  })
}

export function listCyRetreat(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/listCyRetreat`,
    method: 'GET',
    params
  })
}
export function detailByBack(id){
    return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/detailByBack/${id}`,
    method: 'GET',
  })
}

export function detailBySBack(id){
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/detailBySBack/${id}`,
    method: 'GET',
  })
}

