import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

//需求计划日志记录列表
export function materialOperateLogGetList(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialOperateLog/getList`,
    method: 'get',
    params
  })
}