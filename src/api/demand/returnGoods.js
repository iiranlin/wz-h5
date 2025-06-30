import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV
//供应商需求计划列表  /materialCirculationTableRest/detailByBack/1937781772949094402
export function returnGoodsList(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/listGysRetreat`,
    method: 'GET',
    params
  })
}

//供应商需求计划列表
export function returnGoodsDetails(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/detailByBack/${id}`,
    method: 'GET',
  })
}

//查看需求信息 /materialCirculationTableRest/detailWlgz/FH202506260007
export function lookGoodsDetails(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/detail/${id}`,
    method: 'GET',
  })
}

//查看需求信息
export function shippingOrderNumber(number) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/detailWlgz/${number}`,
    method: 'GET',
  })
}