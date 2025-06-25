import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

//需求计划列表
export function materialDemandPlanRestList(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/list`,
    method: 'get',
    params
  })
}

//需求计划详情
export function materialDemandPlanRestDetail(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/detail/${id}`,
    method: 'get',
  })
}

/**
 * 保存
 * @param {*} params 
 * @returns 
 */
export const materialDemandPlanRestSave = (data) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/save`,
    method: 'post',
    data
  })
}