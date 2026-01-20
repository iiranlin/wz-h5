import request, { download } from '@/utils/request'
let VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV;

//撤回
export const recall = (data) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/audit/stop`,
    method: 'post',
    data
  })
}

// 交接验收单下载
export const downloadHandoverAcceptanceForm = (params) => {
  return download(`${VUE_APP_PRODMGR_INV}/materialExport/handoverAcceptanceForm`, params, 'get')
}

// 催办功能
export const urge = (data) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/audit/sendApprovalReminderSMS`,
    method: 'post',
    data
  })
}