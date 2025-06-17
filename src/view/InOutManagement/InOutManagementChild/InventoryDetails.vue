<template>
  <div class="outbound">
    <div class="outbound-mian">
      <div class="box-container" style="margin-top: 20px;">
        <div>
          <ul class="detail-ul">
            <li>
              <span>需求名称：</span>
              <span>需求名称需求名称需求名称</span>
            </li>
            <li>
              <span>需求项目：</span>
              <span>需求项目需求项目需求项目</span>
            </li>
            <li>
              <span>需求组织：</span>
              <span>需求组织需求组织需求组织</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="select-materials-search">
        <p class="select-materials-search-p font-weight">物资明细（共7项）</p>
      </div>
      <div class="box-container" v-for="item in 2" :key="item">
        <ul class="detail-ul">
          <li class="li-item-overlength">
            <span>供应商：</span>
            <span>供应商供应商供应商供应商</span>
          </li>
          <li>
            <span>物资名称：</span>
            <span>物资名称物资名称物资名称</span>
          </li>
          <li>
            <span>规格型号：</span>
            <span>规格型号规格型号规格型号</span>
          </li>
          <li class="li-item-both">
            <div class="li-item-left">
              <span>计量单位：</span>
              <span>套</span>
            </div>
            <div class="li-item-right">
              <span>需求数量：</span>
              <span>5</span>
            </div>
          </li>
          <li class="li-item-overlength">
            <span>当前库存数量：</span>
            <span>5</span>
          </li>
          <li class="li-item-both">
            <div class="li-item">
              <span>生产日期：</span>
              <span>2025-6-1</span>
            </div>
            <div class="li-item">
              <span>有效截止日期：</span>
              <span>2026-6-1</span>
            </div>
          </li>
          <li class="li-item-overlength">
            <span>本次出库数量：</span>
            <span>10</span>
          </li>
          <li class="li-item-overlength">
            <span>备注：</span>
            <span>备注备注备注</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InventoryDetails',
  components: {},
  data() {
    return {
    }
  },
  created() {
  },
  activated() {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.outbound {
  width: 100%;
  height: 100%;

  .outbound-mian {
    display: flex;
    flex-direction: column;
  }

  .select-materials-search {
    display: flex;
    justify-content: space-between;

    .select-materials-search-p {
      font-size: 14px;
      line-height: 30px;
      padding: 0 10px;
    }
  }

  .li-item-both {
    .li-item {
      flex: 1;
      width: auto !important;
    }
  }

  .van-cell {
    padding-left: 0;
    padding-right: 0;
  }

  ::v-deep .van-field__label {
    color: #272b31;
  }

  .default-button-container {
    .button-info {
      min-width: 150px;
    }
  }

  .van-cell {
    padding-left: 12px;
    padding-right: 0;
  }

  .van-cell--required::before {
    left: 4px;
  }

  ::v-deep .outbound-field-uploader {
    &:before {
      top: 16px;
    }

    .van-field__label {
      line-height: 35px;
    }
  }

  .van-field__control--custom {
    .outbound-uploader {
      min-width: 80px;
      height: 25px;
    }
  }

  ::v-deep .outbound-field-text {
    padding-left: 0;
  }
}
</style>