<template>
  <div class="save-materials">
    <div class="save-materials-contract">
      <ul class="detail-ul">
        <li>
          <span class="font-weight">需求名称：</span>
          <span class="font-weight">新建南京至淮安城泳铁路第二批建管甲</span>
        </li>
        <li>
          <span>需求项目：</span>
          <span>需求项目名称</span>
        </li>
        <li>
          <span>需求组织：</span>
          <span>需求组织名称</span>
        </li>
      </ul>
    </div>
    <div class="box-container" v-for="item in 2" :key="item">
      <ul class="detail-ul">
        <li class="save-materials-li">
          <span class="font-weight">物资名称：</span>
          <span class="font-weight">计算机联锁设备</span>
        </li>
        <li>
          <span>供应商：</span>
          <span>供应商名称供应商名称供应商名称供应</span>
        </li>
        <li>
          <span>规格型号：</span>
          <span>特殊桥梁支庄</span>
        </li>
        <li class="li-item-both">
            <div class="li-item-left">
                <span>计量单位：</span>
                <span>套</span>
            </div>
            <div class="li-item-right">
                <span>合同数量：</span>
                <span>5</span>
            </div>
        </li>
        <li class="li-item-overlength">
          <span>累计计划量（含本次）：</span>
          <span>5</span>
        </li>
      </ul>
      <van-cell-group>
        <van-field v-model="formData.name" label="本次计划数量" placeholder="请输入数量" required clearable :label-width="240"
          input-align="right" />
        <van-field required readonly is-link v-model="formData.currentDate" label="供应时间" placeholder="请选择日期"
          @click="dateClick" input-align="right" />
        <van-popup v-model="showDatePicker" position="bottom" round>
          <van-datetime-picker type="date" :value="minDate" @confirm="onDateConfirm"
            @cancel="hideDatePicker" />
        </van-popup>
        <van-field required v-model="formData.password" label="收货人" placeholder="请输入收货人" :label-width="240"
          input-align="right" />
        <van-field required v-model="formData.password" label="收货人联系方式" placeholder="请输入收货人联系方式" :label-width="240"
          input-align="right" />
        <van-field required v-model="formData.password" label="投资方" placeholder="请输入投资方" :label-width="240"
          input-align="right" />
        <van-field required v-model="formData.password" label="投资比例" placeholder="请输入投资比例" :label-width="240"
          input-align="right" />
        <van-field v-model="formData.password" label="备注" placeholder="请输入备注" :label-width="240" input-align="right" />
      </van-cell-group>
    </div>
    <div class="default-button-container">
      <van-button class="button-info" round type="info" @click="addClick">保存</van-button>
    </div>
  </div>
</template>
<script>
import {parseTime} from '@/utils/index'
export default {
  name: 'SaveMaterials',
  data() {
    return {
      minDate: new Date(),
      formData: {
        name: '',
        password: '',
        currentDate: ''
      },
      showDatePicker: false, // 控制日期选择器显示

    }
  },
  mounted() {
  },
  methods: {
    dateClick() {
      this.showDatePicker = true
    },
    onDateConfirm() {
      this.formData.currentDate = parseTime(this.minDate, '{y}-{m}-{d}')
      this.showDatePicker = false
    },
    hideDatePicker() {
      this.showDatePicker = false
    },
    addClick() {
      this.$toast('保存成功');
      this.$router.push({ path: '/PlannedManagementList' })
    }
  }
}
</script>
<style lang="less" scoped>
.save-materials {
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;

  .save-materials-contract {
    margin-top: 10px;
    box-sizing: border-box;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 10px;

    .li-status {
      top: auto;
      bottom: 12px;

      span {
        background-color: #edf2ff;
        border: 1px solid #289fec;
        color: #1d93ff;
      }
    }
  }

  .button-info {
    min-width: 150px;
  }

  .van-cell {
    padding-left: 15px;
    padding-right: 0;
  }

  //列表ul
  .detail-ul {
    .save-materials-li:before {
      content: "";
      width: 6px;
      height: 6px;
      display: inline-block;
      border-radius: 50%;
      background: #4F8EFF;
      vertical-align: middle;
      margin-right: 8px;
      margin-top: 10px;
    }

    li {
      & :nth-child(2) {
        width: calc(100% - 40px);
        overflow: inherit;
        text-overflow: inherit;
        white-space: inherit;
      }
    }
  }
}
</style>