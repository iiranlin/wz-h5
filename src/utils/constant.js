
// 审批类型对应的路由
export const FLOW_ROUTE = {
    RKLC:'InboundDetails', // 入库
    SHLC:'DoAcceptDetail', // 收货
    FHLC:'cargoDetails', // 发货
    CGHT:'perfectContractDetail',// 采购合同
    CGWJ:'perfectFileDetail',// 采购文件
}

// 点击安卓返回键时需要直接返回首页的路由名称列表
export const BACK_TO_HOME_ROUTES = [
  'PlannedManagementList',  // 计划管理
  'Acceptance',              // 收货管理
  'InListContent',           // 质检管理
  'InventoryListContent',    // 出库管理
  'purchaseFile',            // 采购文件核备
  'purchaseContract',        // 采购合同核备
  'WaitExamineList',         // 待审核
  'ByMeList',                // 我发起的
  'WaitHandleList',          // 待处理
  'OverExamineList'          // 已审核
]
