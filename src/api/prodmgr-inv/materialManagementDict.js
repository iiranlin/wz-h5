import request from '@/utils/request'
let VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV;

/**
 * 物资详情
 * @param {*} params 
 * @returns 
 */
export const materialManagementDictDetail = (id) => {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialManagementDict/detail/${id}`,
    method: 'get',
  })
}