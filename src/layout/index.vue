<template>
	<div class="app-wrapper">
		<div :class="isTabbar && checkNavMenu()?.length > 1?'app-container':'default-container'">
			<transition name="fade-transform" mode="out-in">
        <keep-alive :include="keepPages">
          <router-view :key="routerKey" />
        </keep-alive>
			</transition>
		</div>
		<div class="nav-container" v-show="isTabbar && checkNavMenu()?.length > 1">
			<navbar :navMenu="checkNavMenu()"/>
		</div>

		<selectProject ref="selectProject"></selectProject>
	</div>
</template>
<script>
import {Navbar} from './components'
import { getUserInfo } from '@/utils/user-info'
import { isAndroid } from "@/utils"

import selectProject from '@/view/homePage/components/selectProject.vue';
export default {
	name: 'Layout',
	components: {
		Navbar,
		selectProject
	},
	data() {
		return {
			//施工单位导航菜单
			constructionUnit:[
				{
					title: '我的待办',
					activeIcon: '/static/WDDB_A.png',
					normalIcon: '/static/WDDB_B.png',
					link: '/MyToDoList'
				},
				{
					title: '计划管理',
					activeIcon: '/static/JGGL_A.png',
					normalIcon: '/static/JGGL_B.png',
					link: '/PlannedManagementList'
				},
				{
					title: '验收管理',
					activeIcon: '/static/YSGL_A.png',
					normalIcon: '/static/YSGL_B.png',
					link: '/AcceptanceReturn'
				},
				{
					title: '出入库管理',
					activeIcon: '/static/CRKGL_A.png',
					normalIcon: '/static/CRKGL_B.png',
					link: '/InOutManagementList'
				},
			],
			//监理单位导航菜单
			supervisionUnit:[
				{
					title: '待审核',
					activeIcon: '/static/DSH_A.png',
					normalIcon: '/static/DSH_B.png',
					link: '/WaitExamineList'
				},
				{
					title: '待处理',
					activeIcon: '/static/DCL_A.png',
					normalIcon: '/static/DCL_B.png',
					link: '/WaitHandleList'
				},
				{
					title: '已审核',
					activeIcon: '/static/YSH_A.png',
					normalIcon: '/static/YSH_B.png',
					link: '/OverExamineList'
				},
				{
					title: '计划查询',
					activeIcon: '/static/JGGL_A.png',
					normalIcon: '/static/JGGL_B.png',
					link: '/PlannedManagementList'
				},
			],
			//指挥部
			supervisionUnitSN:[
				{
					title: '待审核',
					activeIcon: '/static/DSH_A.png',
					normalIcon: '/static/DSH_B.png',
					link: '/WaitExamineList'
				},
				{
					title: '已审核',
					activeIcon: '/static/YSH_A.png',
					normalIcon: '/static/YSH_B.png',
					link: '/OverExamineList'
				}
			],
			//供应商导航菜单
			supplier:[
				{
					title: '需求管理',
					activeIcon: '/static/XQGL_A.png',
					normalIcon: '/static/XQGL_B.png',
					link: '/dashboard'
				},
				{
					title: '发货管理',
					activeIcon: '/static/FHGL_A.png',
					normalIcon: '/static/FHGL_B.png',
					link: '/Information'
				},
				{
					title: '退货管理',
					activeIcon: '/static/THGL_A.png',
					normalIcon: '/static/THGL_B.png',
					link: '/MyManager'
				},
			],
			//物代
			materialsAgent:[
				{
					title: '需求供应管理',
					activeIcon: '/static/XQGL_A.png',
					normalIcon: '/static/XQGL_B.png',
					link: '/DemandSupplyManagement'
				}
			],
      userInfo: getUserInfo()
		}
	},
	computed: {
    key() {
      return this.$route.path
    },
		routerKey() {
			return this.$route.fullPath
		},
    keepPages() {
      return this.$store.getters.getKeepPages
    },
    isTabbar() {
      return this.$route.meta.isTabbar
    },
	},
	async created() {
		if (isAndroid()) {
			Android.setWaterMark(this.userInfo.nickName);
		}

		const code = this.checkDeptCode()
		// 跳转到施工单位首页并且有多个标段项目
		const { data } = await this.$store.dispatch("GetSameProjectUser");
		
		if (data?.length > 1) {
			this.$refs.selectProject.dialogShow = true;
			this.$store.commit('SET_SELECT_PROJECT_DIALOG', true)
		}

		this.checkNavMenu();
	},
	methods: {
		//判断角色deptCode
		checkDeptCode(){
			const deptCode = this.userInfo.deptCode  
      const codeArr = ['FB', 'ZB', 'JL', 'GYS', 'SN', 'WZDL', 'WD']

      let code = ''
      codeArr.forEach( (item) => {
        if(deptCode.startsWith(item)){
          code = item
        }
      })

			return code
		},
		//判断角色菜单
		checkNavMenu(){
			const keyMap = ['supplierPage', 'supervisorPage', 'constructionUnitsPage']
			
			const code = this.checkDeptCode()

			if (!keyMap.includes(this.key) && this.key != '/' && code != 'WD' && code != 'WZDL' && code != 'SN') {
				return;
			}

			if (code == 'FB' || code == 'ZB') {
				// 跳转到施工单位首页
				this.$router.push({ path: '/constructionUnitsPage' })
			} else if (code == 'JL') {
				// 跳转到监理单位首页
				if (this.$route.path === '/') {
					this.$router.push({ path: '/supervisorPage' });
				}
				// supervisorPage should not have tabbar
				if (this.$route.path !== '/supervisorPage') {
					return this.supervisionUnit;
				}
			} else if (code == 'GYS') {
			  // 跳转到供应商首页
				this.$router.push({ path: '/supplierPage' })
			} else if (code == 'SN' || code == 'WZDL' || code == 'WD') {
				if (this.$route.path === '/') {
					this.$router.push({ path: '/supervisorPage' });
				}
				// supervisorPage should not have tabbar
				if (this.$route.path !== '/supervisorPage') {
					return this.supervisionUnitSN;
				}
			} else {
			  return this.constructionUnit
			}
		},
	},
}
</script>
