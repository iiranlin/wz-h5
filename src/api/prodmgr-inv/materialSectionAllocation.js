import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

//获取标段下的所有物资
export function getListBySectionId(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialSectionAllocation/getListBySectionId`,
    method: 'get',
    params
  })
}

/**
 * 查询主合同物资明细列表
 * @param {*} params 
 * @returns 
 */
export const mainItemList = (params) => {
    return request({
        url: `${VUE_APP_PRODMGR_INV}/materialSectionAllocation/getNegativeByUniqueNumber`,
        method: 'get',
        params
    })
}
