import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

//需求计划选择合同列表
export function getBySectionProject(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialContract/getBySectionProject`,
    method: 'post',
    data
  })
}

//合同详情
export function materialContractDetail(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialContract/detail/${id}`,
    method: 'get',
  })
}