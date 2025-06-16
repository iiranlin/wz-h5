import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
import Layout from '@/layout'

export const routes = [
	{
		path: '/',
		name: 'Layout',
		component: Layout,
		meta: {base_path: '/'},
		children: [
			{
				path: 'MyToDoList',
				name: 'MyToDoList',
				meta: {title: '我的待办'},
				component: () => import('@/view/MyToDo/MyToDoList.vue')
			},
			{
				path: '/WaitExamineList',
				name: 'WaitExamineList',
				meta: {title: '待审核'},
				component: () => import('@/view/SupervisionUnit/WaitExamineList.vue')
			},
			{
				path: '/WaitHandleList',
				name: 'WaitHandleList',
				meta: {title: '待处理'},
				component: () => import('@/view/SupervisionUnit/WaitHandleList.vue')
			},
			{
				path: '/OverExamineList',
				name: 'OverExamineList',
				meta: {title: '已审核'},
				component: () => import('@/view/SupervisionUnit/OverExamineList.vue')
			},
			{
				path: 'PlannedManagementList',
				name: 'PlannedManagementList',
				meta: {title: '计划管理'},
				component: () => import('@/view/PlannedManagement/PlannedManagementList.vue')
			},
			{
				path: 'AcceptanceReturn',
				name: 'AcceptanceReturn',
				meta: {title: '验收管理'},
				component: () => import('@/view/AcceptanceReturn/AcceptanceReturn.vue')
			},
			{
				path: 'InOutManagementList',
				name: 'InOutManagementList',
				meta: {title: '出入库管理'},
				component: () => import('@/view/InOutManagement/InOutManagementList.vue')
			},
		]
	},
	{
		path: '/MyToDoManager',
		component: () => import('@/view/MyToDo/MyToDoManager/index.vue'),
		redirect: '/MyToDoManager/MyToDoDetail',
		hidden: true,
		children: [
			{
				path: 'MyToDoDetail/:type',
				name: 'MyToDoDetail',
				meta: {title: '我的待办-详情'},
				component: () => import('@/view/MyToDo/MyToDoManager/MyToDoDetail.vue')
			},
			{
				path: 'MyToDoExamineEdit/:type',
                name: 'MyToDoExamineEdit',
				meta: {title: '审核意见'},
				component: () => import('@/view/MyToDo/MyToDoManager/MyToDoExamineEdit.vue')
			},
			{
				path: 'MyToDoExamineChoice',
                name: 'MyToDoExamineChoice',
				meta: {title: '选择审批人'},
				component: () => import('@/view/MyToDo/MyToDoManager/MyToDoExamineChoice.vue')
			},
			{
				path: 'MyToDoSearch',
                name: 'MyToDoSearch',
				meta: {title: '搜索'},
				component: () => import('@/view/MyToDo/MyToDoManager/MyToDoSearch.vue')
			},
		]
	},
	{
		path: '/SupervisionUnitManager',
		component: () => import('@/view/SupervisionUnit/SupervisionUnitManager/index.vue'),
		redirect: '/SupervisionUnitManager/SupervisionUnitDetail',
		hidden: true,
		children: [
			{
				path: '/SupervisionUnitDetail/:type',
				name: 'SupervisionUnitDetail',
				meta: {title: '单据详情'},
				component: () => import('@/view/SupervisionUnit/SupervisionUnitManager/SupervisionUnitDetail.vue')
			},
			{
				path: '/SupervisionUnitExamineEdit/:type',
                name: 'SupervisionUnitExamineEdit',
				meta: {title: '审核意见'},
				component: () => import('@/view/SupervisionUnit/SupervisionUnitManager/SupervisionUnitExamineEdit.vue')
			},
			{
				path: '/SupervisionUnitExamineChoice',
                name: 'SupervisionUnitExamineChoice',
				meta: {title: '选择审批人'},
				component: () => import('@/view/SupervisionUnit/SupervisionUnitManager/SupervisionUnitExamineChoice.vue')
			},
		]
	},
	{
		path: '/MyProcess',
		name: 'MyProcess',
		meta: {title: '查看流程'},
		component: () => import('@/view/MyProcess/index.vue')
	},
  // {
	// 	path: '/PlannedManagement',
	// 	component: Layout,
	// 	redirect: '/PlannedManagement/PlannedManagementList',
	// 	meta: {title: '计划管理'},
	// 	hidden: true,
	// 	children: [
	// 		{
	// 			path: 'PlannedManagementList',
	// 			name: 'PlannedManagementList',
	// 			meta: {title: '计划管理'},
	// 			component: () => import('@/view/PlannedManagement/PlannedManagementList.vue')
	// 		},
	// 	]
	// },
  {
		path: '/PlannedManagementChild',
    component: () => import('@/view/PlannedManagement/PlannedManagementChild/index.vue'),
		hidden: true,
		children: [
      {
        path: 'RequirementFilling',
        name: 'RequirementFilling',
        meta: {title: '需求填报'},
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/RequirementFilling.vue')
      },
      {
        path: 'SelectContract',
        name: 'SelectContract',
        meta: {title: '选择合同'},
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/SelectContract.vue')
      },
      {
        path: 'SelectMaterials',
        name: 'SelectMaterials',
        meta: {title: '选择物资'},
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/SelectMaterials.vue')
      },
      {
        path: 'SaveMaterials',
        name: 'SaveMaterials',
        meta: {title: '保存物资'},
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/SaveMaterials.vue')
      },
      {
        path: 'RequirementDetails',
        name: 'RequirementDetails',
        meta: {title: '需求详情'},
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/RequirementDetails.vue')
      },
      {
        path: 'SupplyOverview',
        name: 'SupplyOverview',
        meta: {title: '供应概览'},
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/SupplyOverview.vue')
      },
      {
        path: 'LogisticsView',
        name: 'LogisticsView',
        meta: {title: '查看物流'},
        component: () => import('@/view/PlannedManagement/PlannedManagementChild/LogisticsView.vue')
      },
		]
	},
  {
		path: '/InOutManagementChild',
    component: () => import('@/view/InOutManagement/InOutManagementChild/index.vue'),
		hidden: true,
		children: [
      {
        path: 'SubmitStore',
        name: 'SubmitStore',
        meta: {title: '提交入库'},
        component: () => import('@/view/InOutManagement/InOutManagementChild/SubmitStore.vue')
      },
    ]
  },
	{
		path: '/AcceptanceReturnChild',
		component: () => import('@/view/AcceptanceReturn/AcceptanceReturnChild/index.vue'),
		hidden: true,
		children: [
			{
				path: 'DoAccept',
				name: 'DoAccept',
				meta: {title: '初验收货'},
				component: () => import('@/view/AcceptanceReturn/AcceptanceReturnChild/DoAccept.vue')
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
		return savePostion ? savePostion:{y:0}
	}

});

//解决重复导航报错
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router;
