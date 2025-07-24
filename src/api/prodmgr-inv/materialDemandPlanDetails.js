import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

//计划物资需求详情
export function materialDemandPlanDetailsDetail(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanDetails/detail/${id}`,
    method: 'get',
  })
}