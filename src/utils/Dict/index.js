import Dict from "./Dict";

//install 函数是 Vue.js 插件的标准入口。当你在 Vue 应用中使用 Vue.use(plugin) 时，Vue 会自动调用这个 install 函数。
//Vue.mixin 用于全局混入一些选项（如 data、created 等生命周期钩子），这样所有的 Vue 组件都会继承这些选项
//当前的dict响应数据会继承到所有的Vue组件中，所有的Vue组件也会触发当前的created方法
const install = function (Vue) {
  Vue.mixin({
    data() {
      if (this.$options.dicts instanceof Array) {
        const dict = {
          dict: {},
          dictLabel: {},
        }
        return {
          dict
        }
      }
      return {}
    },
    created() {
      if (this.$options.dicts instanceof Array) {
        //Dict类方法中的initiate方法调用，接收两个参数
        //第一个参数为组件的dicts配置项（dicts: ['myDicts']）；
        //第二个参数为回调函数，处理完字典数据时调用，使用 this.$nextTick 确保 DOM 更新完成后，再触发 dictReady 事件，通知父组件字典数据已经准备好。
        new Dict(this.dict).init(this.$options.dicts, () => {
          this.$nextTick(() => {
            this.$emit('dictReady')
          })
        })
      }
    }
  })
}

export default { install }
