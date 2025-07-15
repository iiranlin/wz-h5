import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

//收货信息-列表
export function materialReceiverInformationList(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialReceiverInformation/list`,
    method: 'get',
    params
  })
}

//收货信息-新增
export function materialReceiverInformationCreate(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialReceiverInformation/create`,
    method: 'post',
    data
  })
}

//收货信息-删除
export function materialReceiverInformationRemove(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialReceiverInformation/remove/${id}`,
    method: 'post',
  })
}
//收货信息-修改
export function materialReceiverInformationModify(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialReceiverInformation/modify`,
    method: 'post',
    data
  })
}