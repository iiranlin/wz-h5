import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV
//供应商需求计划列表
export function demandManagementList(pageNum,pageSize,orderByColumn,isAsc) {
  return request({
    url: `/materialSupplyPlanRest/list?pageNum=${pageNum}&pageSize=${pageSize}&orderByColumn=&isAsc=`,
    method: 'GET'
  })
}