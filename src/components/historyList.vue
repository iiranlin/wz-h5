<template>
  <div class="van-popover-history" v-if="showPopover && historyList.length" :style="divStyle">
    <ul>
      <li v-for="(item, index) in historyList" :key="index" @click.stop="onSelect(item)">{{ item }}</li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showPopover: false,
      historyList: [],
      divStyle: {
        left: '0px',
        top: '0px',
      },
      names: '',
      indexs: 0
    }
  },
  mounted() {
    document.body.addEventListener('click', this.handleBodyClick)
    document.addEventListener('touchmove', this.handleBodyClick)
    document.addEventListener('wheel', this.handleBodyClick)
  },
  methods: {
    init($event, name, index) {
      this.names = name
      this.indexs = index
      const historyList = this.$store.state.public.historyList || {}
      this.historyList = historyList[name] || []
      this.showPopover = true
      this.divStyle.left = `${$event.clientX / 100 - 2}rem`
      this.divStyle.top = `${$event.clientY / 100 + 0.3}rem`
    },
    onSelect(item) {
      this.$emit('historyClick', item, this.names, this.indexs)
      this.showPopover = false
    },
    handleBodyClick() {
      this.showPopover = false
    },
    beforeDestroy() {
      document.body.removeEventListener('click', this.handleBodyClick)
      document.body.removeEventListener('touchmove', this.handleBodyClick)
      document.body.removeEventListener('wheel', this.handleBodyClick)
    },
  },
}
</script>
<style lang="less" scoped>
.van-popover-history {
  position: fixed;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;

  li {
    padding: 5px 10px;
    border-bottom: 1px solid #ccc;
  }
}
</style>