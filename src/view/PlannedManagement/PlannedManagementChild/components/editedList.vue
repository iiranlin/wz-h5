<template>
  <van-action-sheet v-model="sheetShow">
    <p class="action-sheet-p"><span>已填写 <span class="li-span-click">{{ editedMateriaList.length }}</span>/{{ editedData.length }} </span></p>
    <div class="action-sheet-content">
      <ul class="list-ul" v-for="(item, index) in editedData" :key="item.uniqueNumber || item.allocationUniqueNumber">
        <li class="detail-list-ul-text">
          <span class="font-weight">{{ index + 1 }}.{{ item.materialName }}</span>
          <img :src="item.planAmount && item.supplyDate && item.addr && item.field2 && item.receiver && item.field0 && item.field1?editedStatus:editStatus" />
        </li>
        <li>
          <span>规格型号：</span>
          <span>{{ item.specModel }}</span>
        </li>
      </ul>
    </div>
  </van-action-sheet>
</template>
<script>
import editedStatus from '@/assets/img/editedStatus.png'
import editStatus from '@/assets/img/editStatus.png'
export default {
  name: 'editedList',
  props: {
    editedData: {
      type: Array,
      default: () => {
        return []
      }
    },
    editedMateriaList: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  data() {
    return {
      sheetShow: false,
      editedStatus,
      editStatus
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
  padding-top: 10px;
  .list-ul{
    padding-top: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e3e3e3;
    .detail-list-ul-text{
      justify-content: space-between;
      img{
        width: 18px;
        height: 18px;
        flex: none;
        margin-top: 4px;
      }
    }
  }
}
</style>