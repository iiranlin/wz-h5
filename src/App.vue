<template>
	<div id="app">
		<transition name="van-fade">
			<router-view />
		</transition>
    <!-- 设置字体入口 -->
    <editIcon></editIcon>
	</div>
</template>
<script>
import { getUserInfo } from '@/utils/user-info'
import editIcon from './view/homePage/components/editIcon.vue';

export default {
  components: {
    editIcon
  },
  data() {
    return {
      size:42
    };
  },
  computed: {
    fontSizeNum() {
      return this.$store.state.public.fontSizeSum
    }
  },
  watch: {
    fontSizeNum: {
      handler(size) {
        this.size = size
        this.handleResize()
      }
    },
    deep: true
  },
  mounted() {
    if(this.isTablet()){
      setTimeout(() => {
        this.handleResize()
        window.addEventListener('resize', this.handleResize)
      }, 500)
    }

    window.backToHomeClick = () => {
      this.checkHomePage()
    }
  },
  methods: {
    //判断角色deptCode
		checkDeptCode(){
			const deptCode = getUserInfo().deptCode

      const codeArr = ['FB', 'ZB', 'JL', 'GYS', 'SN', 'WZDL', 'WD']

      let code = ''
      codeArr.forEach( (item) => {
        if(deptCode.startsWith(item)){
          code = item
        }
      })

			return code
		},
    //判断角色首页
		checkHomePage(){
			
			const code = this.checkDeptCode()

			if (code == 'FB' || code == 'ZB') {
				// 跳转到施工单位首页
				this.$router.push({ path: '/constructionUnitsPage' })
			} else if (code == 'JL') {
			  // 跳转到监理单位首页
				this.$router.push({ path: '/supervisorPage' })
			} else if (code == 'GYS') {
			  // 跳转到供应商首页
				this.$router.push({ path: '/supplierPage' })
			} else {
        this.$notify({
          type: 'warning',
          message: '您的账号暂无首页，请联系管理员',
        });
      }
		},
    handleResize() {
      document.documentElement.style.fontSize = (this.size + 'px')
      // if (window.innerWidth > window.innerHeight) {
      //   document.documentElement.style.fontSize = 42 + 'px'
      // }else{
      //   document.documentElement.style.fontSize = 42 + 'px'
      // }
    },
    isTablet() {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|windows phone|phone|webos|HarmonyOS/i.test(userAgent)
      const isTabletUA = /ipad|tablet/i.test(userAgent)
      const screenWidth = window.innerWidth;
      return isTabletUA || (isMobileUA && screenWidth > 768)
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>
<style>
	body {
		font-size: 16px;
		background-color: #f8f8f8;
		-webkit-font-smoothing: antialiased;
		margin: 0;
		padding: 0;
	}
</style>