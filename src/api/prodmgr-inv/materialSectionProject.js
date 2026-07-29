import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV

// 获取当前标段信息
export function getSectionProject() {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialSectionProject/getSectionProject`,
    method: 'get'
  })
}

// 校验当前日期是否允许新增或提交计划
export function isCreate() {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialSectionProject/isCreate`,
    method: 'get'
  })
}
