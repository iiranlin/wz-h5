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
					activeIcon: '/static/icon_mine_current.png',
					normalIcon: '/static/icon_mine.png',
					link: '/MyToDoList'
				},
				{
					title: '计划管理',
					activeIcon: '/static/icon_home_current.png',
					normalIcon: '/static/icon_home.png',
					link: '/PlannedManagementList'
				},
				{
					title: '验收管理',
					activeIcon: '/static/icon_home_current.png',
					normalIcon: '/static/icon_home.png',
					link: '/AcceptanceReturn'
				},
				{
					title: '出入库管理',
					activeIcon: '/static/icon_message_current.png',
					normalIcon: '/static/icon_message.png',
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
			]
		}
	},
	created() {

	},
	methods: {
		//判断角色菜单
		checkNavMenu(){
      console.log(getUserInfo())
      const username = this.$route.query.username || window.sessionStorage.getItem("username")
      if(username){
        window.sessionStorage.setItem("username", username)
        const obj = {
          '001': () => {
            return this.constructionUnit
          },
          '002': () => {
            return this.supervisionUnit
          },
          '003': () => {
            return this.supplier
          }
        }
        return (obj[username] && obj[username]()) || this.constructionUnit
      }
			return this.constructionUnit;
		},
	},
}
</script>
