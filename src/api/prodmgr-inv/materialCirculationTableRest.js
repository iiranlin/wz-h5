import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

// 获取供应商发货批次
export const listPc = (id) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/listPc/${id}`,
    method: 'get',
  })
}

/**
 * 保存入库单附件
 * @param {*} params
 * @returns
 */
export const updateFileList = (data) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/updateFileList`,
    method: 'post',
    data
  })
}

// 物流跟踪明细查询
export const detailWlgz = (id) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/detailWlgz/${id}`,
    method: 'get',
  })
}

/**
 * 驳回明细查看
 */
export const getDismissedDetails = (id) => {
    return request({
        url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/getDismissedDetails`,
        method:'get',
        params:{id}
    })
}

/**
 * 入库列表
 * @param {*} params 
 * @returns 
 */
export const listStore = (params) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/listStore`,
    method: 'get',
    params
  })
}

/**
* 入库退货列表
* @param {*} params 
* @returns 
*/
export const listCrRetreat = (params) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/listCrRetreat`,
    method: 'get',
    params
  })
}

/**
 * 入库明细（未入库、已退货、已入库、部分入库）
 * @param {*} params 
 * @returns 
 */
export const detailByStore = (id) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/detailByStore/${id}`,
    method: 'get',
  })
}

/**
 * 收货提交审核
 * @param {*} params 
 * @returns 
 */
export function materialCirculationTableRestSubmit(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialCirculationTableRest/submit`,
    method: 'post',
    data
  })
}