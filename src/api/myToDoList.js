import request from '@/utils/request'
const VUE_APP_PRODMGR_WORKFLOW = process.env.VUE_APP_PRODMGR_WORKFLOW

export function wfTodoList(params) {
    return request({
        url: `${VUE_APP_PRODMGR_WORKFLOW}/wf/todoList`,
        method: 'GET',
        params
    })
}

export function wfHandleList(params) {
    return request({
        url: `${VUE_APP_PRODMGR_WORKFLOW}/wf/handleList`,
        method: 'GET',
        params
    })
}
export function wfHistoryList(businessId) {
    return request({
        url: `${VUE_APP_PRODMGR_WORKFLOW}/wf/historyList/${businessId}`,
        method: 'GET',
    })
}
