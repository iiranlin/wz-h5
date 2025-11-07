import request from '@/utils/request'
const VUE_APP_PRODMGR_WORKFLOW = process.env.VUE_APP_PRODMGR_WORKFLOW
const VUE_APP_BASE_SERVER = process.env.VUE_APP_BASE_SERVER

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