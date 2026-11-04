import request from '@/utils/request'
let VUE_APP_PRODMGR_WORKFLOW = process.env.VUE_APP_PRODMGR_WORKFLOW;

//提交时获取下级审批人
export function commitNextAssignee(data) {
  return request({
      url: `${VUE_APP_PRODMGR_WORKFLOW}/wf/commitNextAssignee`,
      method: 'post',
      data
  })
}

// 退回上一步，兼容与 PC 相同的后端文字结果。
export function rollbackToPrevious(data) {
  return request({
    url: `${VUE_APP_PRODMGR_WORKFLOW}/wf/rollbackToPrevious/`,
    method: 'post',
    data
  }).then(res => {
    // 后端暂时也会将业务失败包装成 success=true，只认可约定的成功文案。
    if (!res || res.success !== true || typeof res.data !== 'string' || !res.data.startsWith('退回成功')) {
      const message = res && typeof res.data === 'string' && res.data.trim()
        ? res.data : '退回结果异常，请刷新列表核实任务状态'
      const error = new Error(message)
      error.isRollbackResult = true
      throw error
    }
    return { ...res, message: res.data }
  })
}
