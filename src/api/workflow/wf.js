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