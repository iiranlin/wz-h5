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
export const materialDemandPlanRestSaveModify = (data, type) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/${type}`,
    method: 'post',
    data
  })
}

/**
 * 批量删除
 * @param {*} params 
 * @returns 
 */
export const materialDemandPlanRestBatchRemove = (data) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/batchRemove`,
    method: 'post',
    data
  })
}

// 供应概览
export const materialDemandPlanRestDetailGyMx = (params) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/detailGyMx`,
    method: 'get',
    params
  })
}

/**
 * 需求计划列表提交
 * @param {*} params
 * @returns
 */
export const materialDemandPlanRestSubmit = (data) => {
  return request({
      url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/submit`,
      method: 'post',
      data
  })
}