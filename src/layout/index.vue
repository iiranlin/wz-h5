<template>
	<div class="app-wrapper">
		<div :class="isTabbar?'app-container':'default-container'">
			<transition name="fade-transform" mode="out-in">
        <keep-alive :include="keepPages">
          <router-view :key="key" />
        </keep-alive>
			</transition>
		</div>
		<div class="nav-container" v-show="isTabbar">
			<navbar :navMenu="checkNavMenu()"/>
		</div>
	</div>
</template>
<script>
import {Navbar} from './components'
import { getUserInfo } from '@/utils/user-info'

function isAndroid() {
  let userAgent = navigator.userAgent
  return /Android|adr/gi.test(userAgent)
}

export default {
	name: 'Layout',
	components: {
		Navbar
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
      		userInfo: getUserInfo()
		}
	},
	computed: {
    key() {
      return this.$route.fullPath
    },
    keepPages() {
      return this.$store.getters.getKeepPages
    },
    isTabbar() {
      return this.$route.meta.isTabbar
    },
	},
	created() {
		if (isAndroid()) {
			Android.setWaterMark(this.userInfo.nickName);
		}
	},
	methods: {
		//判断角色菜单
		checkNavMenu(){
      const deptCode = this.userInfo.deptCode
      const codeArr = ['FB', 'ZB', 'JL', 'GYS']
      let code = ''
      codeArr.forEach( (item) => {
        if(deptCode.startsWith(item)){
          code = item
        }
      })
      if(code){
        const obj = {
          'FB': () => {
            return this.constructionUnit
          },
          'ZB': () => {
            return this.constructionUnit
          },
          'JL': () => {
            return this.supervisionUnit
          },
          'GYS': () => {
            return this.supplier
          },
          'SN': () => {
            return this.supervisionUnitSN
          }
        }
        return (obj[code] && obj[code]()) || this.constructionUnit
      }
      return this.constructionUnit
		},
	},
}
</script>
