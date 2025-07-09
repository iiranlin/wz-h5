<template>
	<div id="app">
		<transition name="van-fade">
			<router-view />
		</transition>
	</div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  mounted() {
    if(this.isTablet()){
      this.handleResize()
      window.addEventListener('resize', this.handleResize)
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      if (window.innerWidth > window.innerHeight) {
        document.documentElement.style.fontSize = 50 + 'px'
      }else{
        document.documentElement.style.fontSize = 60 + 'px'
      }
    },
    isTablet() {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|windows phone|phone|webos/i.test(userAgent)
      const isTabletUA = /ipad|tablet/i.test(userAgent)
      const screenWidth = window.innerWidth;
      return isTabletUA || (isMobileUA && screenWidth > 768)
    }
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