import { flowStop } from '@/api/workflow/stop'

export default {
  filters: {
    orderTypeFilter(val, code) {
      let v = val
      if (val == undefined || code == undefined) {
        return ''
      }
      for (let key of code) {
        if (key.value == val) {
          v = key.label
          break
        } else {
          v = ''
        }
      }
      return v
    },
    filterFiles (files, name) {
      if (!files) return []
      const parseFiles = JSON.parse(files)
      const fileNameArr = parseFiles[name].map(item => item.fileName)
      return fileNameArr.join(' ')
    }
  },
  methods: {
    handleWithdraw(data) {
      this.$dialog.confirm({
        title: '标题',
        message: '是否确认撤回？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        flowStop(data).then(res => {
          this.$toast('撤回成功')
          this.getList()
        })
      })
    },
    filterList (files, name) {
      if (!files) return []
      const parseFiles = JSON.parse(files)
      return parseFiles[name]
    },
    scrollPositionInit(className, finished){
      this.$nextTick(() => {
        const scrollPosition = this.$store.state.public.scrollPosition
        if(scrollPosition > 0){
          document.querySelector(className).scrollTop = scrollPosition // 从Vuex store中恢复滚动位置到列表中
          if(scrollPosition === document.querySelector(className).scrollTop || finished){
            this.$store.dispatch('public/setScrollPosition', 0)
          }
        }
      })
    }
  }
}
