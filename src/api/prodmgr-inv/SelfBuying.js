import request from '@/utils/request'
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV
const VUE_APP_BASE_SERVER = process.env.VUE_APP_BASE_SERVER

// 自购文件核备列表
export function materialPurchaseFileList(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialPurchaseFile/list`,
    method: 'get',
    params
  })
}

// 自购文件核备详情
export function materialPurchaseFiledetail(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialPurchaseFile/detail/${id}`,
    method: 'get'
  })
}

/**
 * 自购文件提交审核
 * @param {*} params 
 * @returns 
 */
export function materialPurchaseFileSubmit(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialPurchaseFile/submit`,
    method: 'post',
    data
  })
}

// 自购文件新增
export function materialPurchaseFilecreate(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialPurchaseFile/create`,
    method: 'post',
    data
  })
}

// 自购文件修改
export function materialPurchaseFilemodify(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialPurchaseFile/modify`,
    method: 'post',
    data
  })
}

// 物资大类
export function materialCategoryList(params) {
  return request({
    url: `${VUE_APP_BASE_SERVER}/dict/getListByParentCode/purchase_code`,
    method: 'get',
    params
  })
}

// 类别
export function purchasefindAllList(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/purchase/item/findAllList`,
    method: 'get',
    params
  })
}
// 物资种类
export function purchasefindAllListType(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/purchase/type/findAllList`,
    method: 'get',
    params
  })
}
// 物资细目
export function purchasefindAllListDetail(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/purchase/detail/findAllList`,
    method: 'get',
    params
  })
}
// 获取基本信息
export function materialSectionProject(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialSectionProject/getSectionProject`,
    method: 'get',
    params
  })
}
// 删除自购文件
export function batchRemove(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialPurchaseFile/batchRemove`,
    method: 'post',
    data
  })
}

// 自购合同列表
export function materialPurchaseContractList(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialPurchaseContract/list`,
    method: 'get',
    params
  })
}

/**
 * 自购合同提交审核
 * @param {*} params 
 * @returns 
 */
export function materialPurchaseContractSubmit(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialPurchaseContract/submit`,
    method: 'post',
    data
  })
}

// 自购合同新增
export function materialPurchaseContractcreate(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialPurchaseContract/create`,
    method: 'post',
    data
  })
}

// 自购合同修改
export function materialPurchaseContractmodify(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialPurchaseContract/modify`,
    method: 'post',
    data
  })
}
// 更新证书
export function materialPurchaseContractLicensecreate(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialPurchaseContractLicense/create`,
    method: 'post',
    data
  })
}

// 删除自购合同
export function batchRemoveContract(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialPurchaseContract/batchRemove`,
    method: 'post',
    data
  })
}

// 自购合同核备详情
export function materialPurchaseContractdetail(id) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialPurchaseContract/detail/${id}`,
    method: 'get'
  })
}

// 批量导入
export function batchImport(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/materialPurchaseContract/importExcel`,
    method: "post",
    data,
    minioSm4: true, //上传不需要加密
  });
}

// 添加证书
export function addCertificate(data){
   return request({
    url: `${VUE_APP_PRODMGR_INV}/materialPurchaseContractDetails/modify`,
    method: "post",
    data,
  });
}