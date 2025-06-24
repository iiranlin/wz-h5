import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

export function materialDemandPlanRestList(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/list`,
    method: 'get',
    params
  })
}

export function materialDemandPlanRestDetail(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/detail/${id}`,
    method: 'get',
  })
}

export function materialOperateLogGetList(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialOperateLog/getList`,
    method: 'get',
    params
  })
}

