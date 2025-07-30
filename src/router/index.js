import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
import Layout from '@/layout'
// import ItemHead from '@/components/itemHead'


const typeName = {
  submit: '提交',
  update: '修改',
  view: '详情',
  create: '新增',
  update: '编辑',
}

export const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    meta: { base_path: '/' },
    children: [
      {
        path: 'MyToDoList',
        name: 'MyToDoList',
        meta: { title: '我的待办', isTabbar: true },
        component: () => import('@/view/MyToDo/MyToDoList.vue')
      },
      {
        path: '/PlannedManagementList',
        name: 'PlannedManagementList',
        meta: { title: '计划管理', isTabbar: true },
        component: () => import('@/view/PlannedManagement/PlannedManagementList.vue')
      },
      {
        path: '/AcceptanceReturn',
        name: 'AcceptanceReturn',
        meta: { title: '验收管理', isTabbar: true },
        component: () => import('@/view/AcceptanceReturn/AcceptanceReturn.vue')
      },
      {
        path: '/InOutManagementList',
        name: 'InOutManagementList',
        meta: { title: '出入库管理', isTabbar: true },
        component: () => import('@/view/InOutManagement/InOutManagementList.vue')
      },
      {
        path: '/WaitExamineList',
        name: 'WaitExamineList',
        meta: { title: '待审核', isTabbar: true },
        component: () => import('@/view/SupervisionUnit/WaitExamineList.vue')
      },
      {
        path: '/WaitHandleList',
        name: 'WaitHandleList',
        meta: { title: '待处理', isTabbar: true },
        component: () => import('@/view/SupervisionUnit/WaitHandleList.vue')
      },
      {
        path: '/OverExamineList',
        name: 'OverExamineList',
        meta: { title: '已审核', isTabbar: true },
        component: () => import('@/view/SupervisionUnit/OverExamineList.vue')
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: { title: '需求管理', isTabbar: true },
        component: () => import('@/view/Demand/index.vue')
      },
      {
        path: '/Information',
        name: 'Information',
        meta: { title: '发货管理', isTabbar: true },
        component: () => import('@/view/Demand/Delivery.vue')
      },
      {
        path: '/MyManager',
        name: 'MyManager',
        meta: { title: '退货管理', isTabbar: true },
        component: () => import('@/view/Demand/Return.vue')
      },
      {
        path: '/DemandSupplyManagement',
        name: 'DemandSupplyManagement',
        meta: { title: '需求供应管理', isTabbar: true },
        component: () => import('@/view/DemandSupplyManagement/index.vue')
      },
      
    ]
  },
  {
    path: '/MyToDoManager',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'DemandPlanningExamine/:obj/:type',
        name: 'DemandPlanningExamine',
        meta: { title: '需求计划-审核' },
        component: () => import('@/view/MyToDo/MyToDoManager/DemandPlanningExamine.vue')
      },
      {
        path: 'ExamineOpinionEdit/:type',
        name: 'ExamineOpinionEdit',
        meta: { title: '审核意见' },
        component: () => import('@/view/MyToDo/MyToDoManager/ExamineOpinionEdit.vue')
      },
      {
        path: 'ApproverChoice/:obj',
        name: 'ApproverChoice',
        meta: { title: '选择审批人' },
        component: () => import('@/view/MyToDo/MyToDoManager/ApproverChoice.vue')
      },
    ]
  },
  {
    path: '/MyProcess',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/MyProcess/:businessId',
        name: 'MyProcess',
        meta: { title: '查看流程' },
        component: () => import('@/view/MyProcess/index.vue')
      },
       {
        path: '/viewLog/:logId',
        name: 'viewLog',
        meta: { title: '查看日志' },
        component: () => import('@/view/MyProcess/log.vue')
      },
    ]
  },
  {
    path: '/PlannedManagementChild',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'RequirementFilling',
        name: 'RequirementFilling',
        meta: { title: '需求填报' },
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/RequirementFilling.vue')
      },
      {
        path: 'SelectContract',
        name: 'SelectContract',
        meta: { title: '选择合同' },
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/SelectContract.vue')
      },
      {
        path: 'SelectMaterials',
        name: 'SelectMaterials',
        meta: { title: '选择物资' },
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/SelectMaterials.vue')
      },
      {
        path: 'SaveMaterials',
        name: 'SaveMaterials',
        meta: { title: '设置物资需求信息' },
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/SaveMaterials.vue')
      },
      {
        path: 'RequirementDetails',
        name: 'RequirementDetails',
        meta: { title: '需求详情' },
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/RequirementDetails.vue')
      },
      {
        path: 'SupplyOverview',
        name: 'SupplyOverview',
        meta: { title: '供应概览' },
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/SupplyOverview.vue')
      },
      {
        path: 'LogisticsView',
        name: 'LogisticsView',
        meta: { title: '查看物流' },
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/LogisticsView.vue')
      },
      {
        path: 'ReceiptList',
        name: 'ReceiptList',
        meta: { title: '选择收货信息' },
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/ReceiptList.vue')
      },
      {
        path: 'ReceiptOperate',
        name: 'ReceiptOperate',
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/ReceiptOperate.vue'),
        beforeEnter(to, from, next) {
          to.meta.title = `${typeName[to.query.type]}收货信息`,
            next()
        }
      },
      {
        path: 'EditedMaterials',
        name: 'EditedMaterials',
        meta: { title: '编辑物资' },
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/EditedMaterials.vue')
      },
      {
        path: 'ViewMaterials',
        name: 'ViewMaterials',
        meta: { title: '物资详情' },
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/ViewMaterials.vue')
      },
      {
        path: 'SaveSuccess',
        name: 'SaveSuccess',
        meta: { title: '保存成功' },
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/SaveSuccess.vue')
      },
      {
        path: 'MaterialDetailsView',
        name: 'MaterialDetailsView',
        meta: { title: '物资详情' },
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/MaterialDetailsView.vue')
      },
    ]
  },
  {
    path: '/InOutManagementChild',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'SubmitStore',
        name: 'SubmitStore',
        meta: { title: '提交报检材料' },
        component: () => import('@/view/InOutManagement/InOutManagementChild/SubmitStore.vue'),
        beforeEnter(to, from, next) {
          to.meta.title = to.query.type == 'view' ? `报检材料${typeName[to.query.type]}` : `${typeName[to.query.type]}报检材料`
          next()
        }
      },
      {
        path: 'Outbound',
        name: 'Outbound',
        meta: { title: '物资出库' },
        component: () => import('@/view/InOutManagement/InOutManagementChild/Outbound.vue'),
        beforeEnter(to, from, next) {
          to.meta.title = to.query.type == 'view' ? `出库${typeName[to.query.type]}` : `物资出库`
          next()
        }
      },
      {
        path: 'OutboundDetails',
        name: 'OutboundDetails',
        meta: { title: '出库详情' },
        component: () => import('@/view/InOutManagement/InOutManagementChild/OutboundDetails.vue'),
      },
      {
        path: 'InventoryDetails',
        name: 'InventoryDetails',
        meta: { title: '库存详情' },
        component: () => import('@/view/InOutManagement/InOutManagementChild/InventoryDetails.vue'),
      }
    ]
  },
  {
    path: '/AcceptanceReturnChild',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'DoAccept',
        name: 'DoAccept',
        meta: { title: '初验收货' },
        component: () => import('@/view/AcceptanceReturn/AcceptanceReturnChild/DoAccept.vue')
      },
      {
        path: 'DoAcceptDetail',
        name: 'DoAcceptDetail',
        meta: { title: '收货详情' },
        component: () => import('@/view/AcceptanceReturn/AcceptanceReturnChild/DoAcceptDetail.vue')
      },
      {
        path: 'DoReturn',
        name: 'DoReturn',
        meta: { title: '退货详情' },
        component: () => import('@/view/AcceptanceReturn/AcceptanceReturnChild/DoReturn.vue')
      },
    ]
  },
  // 确认需求
  {
    path: '/Demand',
    component: Layout,
    hidden: true,
    children: [
      {

        path: '/confirm',
        component: () => import('@/view/Demand/Confirm/index.vue'),
        hidden: true,
        name: 'confirm',
        meta: { title: '确认需求' },
      },
      {

        path: '/sendGoods',
        component: () => import('@/view/Demand/SendGoods/index.vue'),
        hidden: true,
        name: 'SendGoods',
        meta: { title: '发货' },
      },
      {

        path: '/Modifyfile',
        component: () => import('@/view/Demand/SendGoods/Modifyfile.vue'),
        hidden: true,
        name: 'Modifyfile',
        meta: { title: '修改附件' },
      },
      {

        path: '/selectGoods',
        component: () => import('@/view/Demand/SendGoods/selectGoods.vue'),
        hidden: true,
        name: 'selectGoods',
        meta: { title: '选择发货物资' },
      },
      {

        path: '/finishGoods',
        component: () => import('@/view/Demand/SendGoods/finishGoods.vue'),
        hidden: true,
        name: 'finishGoods',
        meta: { title: '设置发运物资信息' },
      },
      {

        path: '/supplyMsg',
        component: () => import('@/view/Demand/Supply/index.vue'),
        hidden: true,
        name: 'supplyMsg',
        meta: { title: '供应信息' },
      },
      {

        path: '/lookUp',
        component: () => import('@/view/Demand/LookUp/index.vue'),
        hidden: true,
        name: 'lookUp',
        meta: { title: '查看物流' },
      },
      {

        path: '/lookCargo',
        component: () => import('@/view/Demand/Cargo/index.vue'),
        hidden: true,
        name: 'lookCargo',
        meta: { title: '物流查看' },
      },
      {

        path: '/cargoDetails',
        component: () => import('@/view/Demand/Cargo/cargoDetails.vue'),
        hidden: true,
        name: 'cargoDetails',
        meta: { title: '货运详情' },
      },
      {

        path: '/returnDetails',
        component: () => import('@/view/Demand/ReturnGoods/index.vue'),
        hidden: true,
        name: 'returnDetails',
        meta: { title: '退货详情' },
      },
    ]
  }
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.title || '');
});

const router = new Router({
  mode: 'history',
  routes,
  // fallback: true,
  scrollBehavior: function (to, from, savePostion) {
    return savePostion ? savePostion : { y: 0 }
  }

});

//解决重复导航报错
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router;
