<template>
  <van-action-sheet v-model="sheetShow">
    <p class="action-sheet-p"><span>已选择 <span class="li-span-click">{{ selectedData.length }}</span> 项</span></p>
    <div class="action-sheet-content">
      <ul class="list-ul" v-for="(item, index) in selectedData" :key="item.uniqueNumber || item.allocationUniqueNumber">
        <li>
          <span class="font-weight">{{ index + 1 }}.{{ item.materialName }}</span>
        </li>
        <li>
          <span>规格型号：</span>
          <span>{{ item.specModel }}</span>
        </li>
        <!-- <li>
          <span>计量单位：</span>
          <span>{{ item.unit }}</span>
        </li> -->
        <li>
          <span>合同数量：</span>
          <span >{{ item.amount }}</span>
        </li>
        <li>
          <span>已累计计划数量：</span>
          <span class="li-span-click">{{ item.cumulativeAmount }}</span>
        </li>
        <li class="list-li-delete">
          <p @click="deleteClick(index)"><img src="@/assets/img/Icon-delete.png"/><span>删除</span></p>
        </li>
      </ul>
    </div>
  </van-action-sheet>
</template>
<script>
export default {
  name: 'selectedList',
  props: {
    selectedData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      sheetShow: false
    }
  },
  methods: {
    init() {
      this.sheetShow = !this.sheetShow
    },
    deleteClick (index) {
      this.$emit('deleteCallback', index)
    }
  },
}
</script>
<style lang="less" scoped>
.action-sheet-p{
  position: fixed;
  width: 100%;
  font-weight: 600;
  font-size: 16px;
  height: 54px;
  line-height: 54px;
  padding-left: 20px;
  background: linear-gradient(to bottom, #e6efff 20%, #f2f4f8, #ffffff);
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  box-sizing: border-box;
}
.action-sheet-content {
  padding: 20px;
  padding-bottom: 60px;
  margin-top: 54px;
  .list-ul{
    border-bottom: 1px solid #e3e3e3;
    .list-li-delete{
      justify-content: end;
      padding-bottom: 9px;
      img{
        width: 24px;
        height: 24px;
        vertical-align: middle;
      }
      span{
        vertical-align: middle;
      }
    }
  }
}
</style>