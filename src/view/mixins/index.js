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
  }
}
