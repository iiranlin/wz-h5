import { flowStop } from '@/api/workflow/stop'

export default {
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
