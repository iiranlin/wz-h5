<template>
  <div class="save-materials">
    <div class="save-materials-contract">
      <ul class="detail-ul">
        <li>
          <span class="font-weight">需求名称：</span>
          <span class="font-weight">{{ sectionInfo.title }}</span>
        </li>
        <li>
          <span>需求项目：</span>
          <span>{{ sectionInfo.sectionName }}</span>
        </li>
        <li>
          <span>需求组织：</span>
          <span>{{ sectionInfo.deptName }}</span>
        </li>
      </ul>
    </div>
    <van-form @submit="onSubmit" :rules="rules">
      <div class="box-container" v-for="(item, index) in materiaList" :key="item.id">
        <ul class="detail-ul">
          <li class="save-materials-li">
            <span class="font-weight">物资名称：</span>
            <span class="font-weight">{{ item.materialName }}</span>
          </li>
          <li>
            <span>供应商：</span>
            <span>{{ item.sellerName }}</span>
          </li>
          <li>
            <span>规格型号：</span>
            <span>{{ item.specModel }}</span>
          </li>
          <li class="li-item-both li-item-overlength">
            <div class="li-item-left">
              <span>计量单位：</span>
              <span>{{ item.unit }}</span>
            </div>
            <div class="li-item-right">
              <span>合同数量：</span>
              <span>{{ item.amount }}</span>
            </div>
          </li>
          <li class="li-item-overlength">
            <span>累计计划量（含本次）：</span>
            <span>{{ +item.cumulativeAmount + (+item.planAmount || 0)}}</span>
          </li>
        </ul>
        <van-cell-group>
          <van-field v-model="item.planAmount" type="number" label="本次计划数量" placeholder="请输入数量" required clearable :label-width="240"
            input-align="right" />
          <van-field required readonly is-link v-model="item.supplyDate" label="供应时间" placeholder="请选择日期"
            @click="dateClick(item, index)" input-align="right" />
          <van-popup v-model="item.showDatePicker" position="bottom" round>
            <van-datetime-picker type="date" :value="item.minDate" @confirm="onDateConfirm(item, index)" @cancel="hideDatePicker(item, index)" />
          </van-popup>
          <van-field required v-model="item.deliveryLocation" label="使用地点" placeholder="请输入使用地点" :label-width="240"
            input-align="right" />
          <van-field required v-model="item.field2" label="收货地址" placeholder="请输入收货地址" :label-width="240"
            input-align="right" />
          <van-field required v-model="item.receiver" label="收货人联系方式" placeholder="请输入收货人联系方式" :label-width="260"
            input-align="right" />
          <van-field required v-model="item.field0" label="投资方" placeholder="请输入投资方" :label-width="240"
            input-align="right" />
          <van-field required v-model="item.field1" label="投资比例" placeholder="请输入投资比例" :label-width="240"
            input-align="right" />
          <van-field v-model="item.remark" label="备注" placeholder="请输入备注" :label-width="240" input-align="right" />
        </van-cell-group>
      </div>
      <div class="default-button-container">
        <van-button class="button-info" round type="info" native-type="button" @click="returnClick">上一步</van-button>
        <van-button class="button-info" round type="info" native-type="submit">设置物资需求信息</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { parseTime } from '@/utils/index'
import { getSectionProject } from '@/api/prodmgr-inv/materialSectionProject'
import { materialDemandPlanRestSave } from '@/api/prodmgr-inv/materialDemandPlanRest'
import { getUserInfo } from '@/utils/user-info'
import dayjs from 'dayjs'
export default {
  name: 'SaveMaterials',
  data() {
    return {
      userInfo: getUserInfo(),
      minDate: new Date(),
      showDatePicker: false, // 控制日期选择器显示
      rules: {
        planAmount: [
          { required: true, message: '请输入本次计划数量', trigger: 'onChange' }, // 触发时机为值变化时校验（可选）
        ],
        supplyDate: [
          { required: true, message: '请选择供应时间', trigger: 'onChange' }, // 触发时机为值变化时校验（可选）
        ],
      },
      materiaList: [],
      sectionInfo: {}
    }
  },
  mounted() {
    this.materiaList = this.$store.state.public.materiaList || []
    // 合同数量 - 累计数量
    this.materiaList = this.materiaList.length && this.materiaList.map( (item) => Object.assign({}, item, {minDate: this.minDate, showDatePicker: this.showDatePicker, planAmount: item.amount - item.cumulativeAmount}))
    this.getSectionProject()
  },
  methods: {
    async getSectionProject() {
      const res = await getSectionProject()
      this.sectionInfo = {
        sectionName: res.data.sectionName,
        title: dayjs().format('YYYY年MM月') + '甲供物资计划申请表',
        deptName: this.userInfo?.unitName
      }
    },
    dateClick(item, index) {
      this.$set(this.materiaList, index, Object.assign({}, item, {showDatePicker: true}))
    },
    onDateConfirm(item, index) {
      this.$set(this.materiaList, index, Object.assign({}, item, {supplyDate: parseTime(this.minDate, '{y}-{m}-{d}'), showDatePicker: false}))
    },
    hideDatePicker(item, index) {
      this.$set(this.materiaList, index, Object.assign({}, item, {showDatePicker: false}))
    },
    onSubmit() {
      // this.$toast('保存成功');
      const data = {
        contractId: this.$route.query.contractId,
        detailsModifyParams: this.materiaList.map(item => ({...item, id: null, allocationUniqueNumber: item.uniqueNumber}))
      }
      materialDemandPlanRestSave(data).then(({message}) => {
        this.$toast(message)
        this.$router.push({ path: '/PlannedManagementList' })
      })
    },
    returnClick () {
      console.log(1)
      this.$router.go(-1)
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