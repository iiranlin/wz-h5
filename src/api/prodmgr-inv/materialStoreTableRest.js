import request from '@/utils/request'
let VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV;

/**
 * 入库审核
 * @param {*} params
 * @returns
 */
export const materialStoreTableRestSubmit = (data) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialStoreTableRest/submit`,
    method: 'post',
    data
  })
}

/**
 * 入库明细（审核中、已驳回）
 * @param {*} params 
 * @returns 
 */
export const detailStoreBack = (id) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialStoreTableRest/detailByStore/${id}`,
    method: 'get',
  })
}