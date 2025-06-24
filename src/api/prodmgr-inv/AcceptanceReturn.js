import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

export function ListTake(params) {
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

