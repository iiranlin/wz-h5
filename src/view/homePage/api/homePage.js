import request from '@/utils/request'
const VUE_APP_PRODMGR_WORKFLOW = process.env.VUE_APP_PRODMGR_WORKFLOW

// 获取审核相关信息
export const getTodoCount = () => {
  return request({
    url: `${VUE_APP_PRODMGR_WORKFLOW}/wf/todoCount`,
    method: 'get',
  })
}