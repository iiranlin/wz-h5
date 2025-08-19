import request from '@/utils/request'
const VUE_APP_PRODMGR_WORKFLOW = process.env.VUE_APP_PRODMGR_WORKFLOW
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

//待审核/已审核列表
export function wfTodoList(params) {
    return request({
        url: `${VUE_APP_PRODMGR_WORKFLOW}/wf/todoList`,
        method: 'GET',
        params
    })
}
//待处理列表
export function wfHandleList(params) {
    return request({
        url: `${VUE_APP_PRODMGR_WORKFLOW}/wf/handleList`,
        method: 'GET',
        params
    })
}

//获取审批日志
export function wfHistoryList(businessId) {
    return request({
        url: `${VUE_APP_PRODMGR_WORKFLOW}/wf/historyList/${businessId}`,
        method: 'GET',
    })
}
//获取下一级审批人
export function wfNextAssignee(taskId) {
    return request({
        url: `${VUE_APP_PRODMGR_WORKFLOW}/wf/nextAssignee/${taskId}`,
        method: 'GET',
    })
}

//需求计划审批详情
export function materialDemandPlanRestDetail(businessId) {
    return request({
        url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/detail/${businessId}`,
        method: 'GET',
    })
}
//需求计划审批-驳回
export function auditReject(data) {
    return request({
        url: `${VUE_APP_PRODMGR_INV}/audit/reject`,
        method: 'POST',
        data
    })
}
//需求计划审批-通过
export function auditApprove(data) {
    return request({
        url: `${VUE_APP_PRODMGR_INV}/audit/approve`,
        method: 'POST',
        data
    })
}
//需求计划审批-修改后通过
export function auditEditApprove(data) {
    return request({
        url: `${VUE_APP_PRODMGR_INV}/audit/modify/approve`,
        method: 'POST',
        data
    })
}
