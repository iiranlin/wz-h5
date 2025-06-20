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
      screenOrientation: 'portrait' // 默认竖屏
    };
  },
  mounted() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      if (window.innerWidth > window.innerHeight) {
        this.screenOrientation = 'landscape'; // 横屏
        document.documentElement.style.fontSize = 50 + 'px'
      }
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