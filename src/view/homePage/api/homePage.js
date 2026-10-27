import request from '@/utils/request'
const VUE_APP_PRODMGR_WORKFLOW = process.env.VUE_APP_PRODMGR_WORKFLOW
const VUE_APP_BASE_SERVER = process.env.VUE_APP_BASE_SERVER
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

// 获取施工单位首页收货、质检、出库数量
export const getTakeStoreCount = () => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/takeStoreCount`,
    method: 'get',
  })
}

// 获取审核相关信息
export const getTodoCount = () => {
  return request({
    url: `${VUE_APP_PRODMGR_WORKFLOW}/wf/todoCount`,
    method: 'get',
  })
}

// 修改短信状态
export function updateSmsStatus(params) {
  return request({
    url: `${VUE_APP_BASE_SERVER}/user/updateSmsStatus`,
    method: 'GET',
    params
  })
}
