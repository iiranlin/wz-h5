import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

// 获取当前标段信息
export function getSectionProject() {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialSectionProject/getSectionProject`,
    method: 'get'
  })
}