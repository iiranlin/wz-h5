<template>
	<div class="app-wrapper">
		<div class="app-container">
			<transition name="fade-transform" mode="out-in">
				<router-view :key="key" />
			</transition>
		</div>
		<div class="nav-container">
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
	computed: {
		key() {
			return this.$route.path
		},
	},
	data() {
		return {
			//施工单位导航菜单
			constructionUnit:[
				{
					title: '我的待办',
					activeIcon: '/static/我的待办A.png',
					normalIcon: '/static/我的待办B.png',
					link: '/MyToDoList'
				},
				{
					title: '计划管理',
					activeIcon: '/static/计划管理A.png',
					normalIcon: '/static/计划管理B.png',
					link: '/PlannedManagementList'
				},
				{
					title: '验收管理',
					activeIcon: '/static/验收管理A.png',
					normalIcon: '/static/验收管理B.png',
					link: '/AcceptanceReturn'
				},
				{
					title: '出入库管理',
					activeIcon: '/static/出入库管理A.png',
					normalIcon: '/static/出入库管理B.png',
					link: '/InOutManagementList'
				},
			],
			//监理单位导航菜单
			supervisionUnit:[
				{
					title: '待审核',
					activeIcon: '/static/icon_home_current.png',
					normalIcon: '/static/icon_home.png',
					link: '/WaitExamineList'
				},
				{
					title: '待处理',
					activeIcon: '/static/icon_home_current.png',
					normalIcon: '/static/icon_home.png',
					link: '/WaitHandleList'
				},
				{
					title: '已审核',
					activeIcon: '/static/icon_home_current.png',
					normalIcon: '/static/icon_home.png',
					link: '/OverExamineList'
				},
			],
			//供应商导航菜单
			supplier:[
				{
					title: '需求管理',
					activeIcon: '/static/icon_home_current.png',
					normalIcon: '/static/icon_home.png',
					link: '/dashboard'
				},
				{
					title: '发货管理',
					activeIcon: '/static/icon_home_current.png',
					normalIcon: '/static/icon_home.png',
					link: '/Information'
				},
				{
					title: '退货管理',
					activeIcon: '/static/icon_home_current.png',
					normalIcon: '/static/icon_home.png',
					link: '/MyManager'
				},
			],
      		userInfo: getUserInfo()
		}
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
          }
        }
        return (obj[code] && obj[code]()) || this.constructionUnit
      }
      return this.constructionUnit
		},
	},
}
</script>
