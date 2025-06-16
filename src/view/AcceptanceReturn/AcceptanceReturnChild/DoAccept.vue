<template>
  <div class="save-materials">
    <div class="save-materials-contract">
      <ul class="detail-ul">
        <li>
          <span class="font-weight">供应需求：</span>
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
        <li>
          <span>供应商：</span>
          <span>供应商名称</span>
        </li>
        <li>
          <span>发货时间：</span>
          <span>2025-04-20 15:35</span>
        </li>
      </ul>
    </div>

    <div class="detail-title">发货单附件</div>
    <div class="box-container">
      <ul class="detail-ul">
        <li style="color: #4F8EFF">发货单附件/清单.pdf</li>
      </ul>
    </div>

    <div class="detail-title">收货明细</div>
    <div class="box-container" v-for="item in 2" :key="item">
      <ul class="detail-ul">
        <li class="save-materials-li">
          <span class="font-weight">物资名称：</span>
          <span class="font-weight">计算机联锁设备</span>
        </li>
        <li>
          <span>规格型号：</span>
          <span>2x2取2s10组道岔</span>
        </li>
        <li class="li-item-both">
          <div class="li-item-left">
            <span>计量单位：</span>
            <span>套</span>
          </div>
          <div class="li-item-right">
            <span>包装形式：</span>
            <span>捆包</span>
          </div>
        </li>
        <li class="li-item-both">
          <div class="li-item-left">
            <span>需求数量：</span>
            <span>10</span>
          </div>
          <div class="li-item-right">
            <span>本次发货数量：</span>
            <span>6</span>
          </div>
        </li>
        <li class="li-item-both">
          <div class="li-item-left">
            <span>生产日期：</span>
            <span>2025-07-15</span>
          </div>
          <div class="li-item-right">
            <span>有效期截止日期：</span>
            <span>2030-07-15</span>
          </div>
        </li>
        <li>
          <span>收货地址：</span>
          <span>华庄/永津路/高里东/浦口北</span>
        </li>
        <li>
          <span>供应时间：</span>
          <span>2025-6-12</span>
        </li>
        <li>
          <span>收货时间及联系方式：</span>
          <span>张晓明 17688928166</span>
        </li>
        <li>
          <span>投资方：</span>
          <span>北京道岔责任有限公司</span>
        </li>
        <li>
          <span>投资比例：</span>
          <span>40%; 60%</span>
        </li>

        <van-cell-group>
          <van-field v-model="formData.num1" label="收货数量" placeholder="请输入数量" required clearable :label-width="240"
                     input-align="right"/>
          <van-field v-model="formData.num2" label="退货数量" placeholder="请输入数量" required clearable :label-width="240"
                     input-align="right"/>
        </van-cell-group>

        <li class="li-item-both">
          <div class="li-item-left">
            <span>合格证附件：</span>
            <span>合格证附件/检测合格.pdf</span>
          </div>
          <div class="li-item-right">
            <span>厂检报告附件：</span>
            <span>合格证附件/厂检合格.pdf</span>
          </div>
        </li>

        <li>
          <span>退货附件：</span>
          <van-button class="upload-btn" type="info" round>请上传</van-button>
        </li>

        <van-cell-group>
          <van-field v-model="formData.remark" label="备注" placeholder="请输入备注" required clearable :label-width="240"
                     input-align="right"/>
        </van-cell-group>
      </ul>


    </div>

    <div class="detail-title">初验信息</div>
    <div class="box-container">
      <ul class="detail-ul">
        <van-cell-group>
          <van-field v-model="formData.num1" label="收货时间" placeholder="请输入数量" required clearable :label-width="240"
                     input-align="right"/>
          <van-field v-model="formData.num2" label="自检单" placeholder="请输入数量" required clearable :label-width="240"
                     input-align="right"/>
          <van-field v-model="formData.num2" label="其他资料" placeholder="请输入数量" required clearable :label-width="240"
                     input-align="right"/>
        </van-cell-group>
      </ul>
    </div>

    <van-button class="button-info" round type="info" @click="addClick">确定收货</van-button>
  </div>
</template>
<script>
import {parseTime} from '@/utils'

export default {
  name: 'DoAccept',
  props: {
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      minDate: new Date(),
      formData: {
        name: '',
        password: '',
        currentDate: '',
        num1: '',
        num2: '',
        remark: ''
      },
      showDatePicker: false // 控制日期选择器显示

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
      this.$toast('保存成功')
      this.$router.push({path: '/PlannedManagementList'})
    }
  }
}
</script>
<style lang="less" scoped>
.save-materials {
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;

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
    position: fixed;
    bottom: 10px;
    min-width: 200px;
    height: 30px;
    left: 50%;
    transform: translateX(-50%);
  }

  .van-cell {
    padding-left: 15px;
    padding-right: 0;
  }

  //列表ul
  .detail-ul {

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

.detail-title {
  font-weight: bold;
  margin: 0.2rem;
}

.upload-btn {
  width: 100px;
  height: 30px;
}
</style>
