import request,{ download } from '@/utils/request'
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

//需求库存列表
export function materialDemandPlanRestListStock(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/listStock`,
    method: 'get',
    params
  })
}
//物资出库
export function materialDemandPlanRestDetailOut(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/detailOut/${id}`,
    method: 'get',
  })
}
//物资出库明细-子集
export function materialCirculationDetailsTableRestListByPlanDetailId(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationDetailsTableRest/listByPlanDetailId/${id}`,
    method: 'get',
  })
}
//物资出库-提交
export function materialSupplierOutRestSaveOut(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialSupplierOutRest/saveOut`,
    method: 'post',
    data
  })
}
//出库列表
export function materialSupplierOutRestList(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialSupplierOutRest/list`,
    method: 'get',
    params
  })
}
//出库详情
export function materialSupplierOutRestDetail(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialSupplierOutRest/detail/${id}`,
    method: 'get',
  })
}

// 下载供应商计划表
export const downloadPlan = (data) => {
  return download(`${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/export`, data)
}