import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV
//供应商需求计划列表
export function demandManagementList(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/listGhs`,
    method: 'GET',
    params
  })
}
//查看pdf
export function demandManagementLookPdf(params) {
  return request({
    url: `/blcd-base/minio/download`,
    method: 'GET',
    params
  })
}
//查看发货信息  /api/blcd-base/minio/upload
export function demandSnedGoods(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/detailWz/`+id,
    method: 'GET',
  })
}

//发货单附件 /materialDemandPlanRest/detailWz/1935557560812425218
export function demandSnedGoodsUpload(data) {
  return request({
    url: `/blcd-base/minio/upload`,
    method: 'post',
    data:data,
    headers: {
          'Content-Type': 'multipart/form-data'
        }
  })
}
//选择发送物资 
export function demandChooseGoods(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialDemandPlanRest/detailWz/${id}`,
    method: 'GET',
  })
}