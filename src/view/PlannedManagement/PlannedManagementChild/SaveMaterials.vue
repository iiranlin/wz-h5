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
    <van-form @submit="onSubmit">
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
            <span>
              {{ cumulativeAmount(item) }}
            </span>
          </li>
        </ul>
        <van-cell-group>
          <van-field v-model="item.planAmount" type="number" label="本次计划数量" placeholder="请输入数量" required clearable :label-width="240" :rules="rules.planAmount"
            input-align="right" />
          <van-field required readonly is-link v-model="item.supplyDate" label="供应时间" placeholder="请选择日期" :rules="rules.supplyDate"
            @click="dateClick(item, index)" input-align="right" />
          <van-popup v-model="item.showDatePicker" position="bottom" round>
            <van-datetime-picker type="date" v-model="item.minDate" @confirm="onDateConfirm(item, index)" @cancel="hideDatePicker(item, index)" />
          </van-popup>
          <van-field required v-model="item.addr" label="使用地点" placeholder="请输入使用地点" :label-width="240" :rules="rules.addr"
            input-align="right" />
          <van-field required v-model="item.field2" label="收货地址" placeholder="请输入收货地址" :label-width="240" :rules="rules.field2"
            input-align="right" />
          <van-field required v-model="item.receiver" label="收货人联系方式" placeholder="请输入收货人联系方式" :label-width="260" :rules="rules.receiver"
            input-align="right" />
          <van-field required v-model="item.field0" label="投资方" placeholder="请输入投资方" :label-width="240" :rules="rules.field0"
            input-align="right" />
          <van-field required v-model="item.field1" label="投资比例" placeholder="请输入投资比例" :label-width="240" :rules="rules.field1"
            input-align="right" />
          <van-field v-model="item.remark" label="备注" placeholder="请输入备注" :label-width="240" input-align="right" />
        </van-cell-group>
        <div class="list-ul-button">
          <van-button class="button-info" plain round type="danger" native-type="button" @click="deleteClick(index)">删除</van-button>
        </div>
      </div>
      <div class="default-button-container">
        <van-button class="button-info" round type="info" native-type="button" @click="returnClick">上一步</van-button>
        <van-button class="button-info" round type="info" native-type="submit">保存</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import { parseTime } from '@/utils/index'
import { getSectionProject } from '@/api/prodmgr-inv/materialSectionProject'
import { materialDemandPlanRestSaveModify, materialDemandPlanRestDetail } from '@/api/prodmgr-inv/materialDemandPlanRest'
import { getUserInfo } from '@/utils/user-info'
import dayjs from 'dayjs'
export default {
  name: 'SaveMaterials',
  mixins: [keepPages],
  data() {
    return {
      userInfo: getUserInfo(),
      minDate: new Date(),
      showDatePicker: false, // 控制日期选择器显示
      rules: {
        planAmount: [
          { required: true, message: '请输入本次计划数量' },
        ],
        supplyDate: [
          { required: true, message: '请选择供应时间' },
        ],
        addr: [
          { required: true, message: '请输入使用地点' },
        ],
        field2: [
          { required: true, message: '请输入收货地址' },
        ],
        receiver: [
          { required: true, message: '请输入收货人联系方式' },
        ],
        field0: [
          { required: true, message: '请输入投资方' },
        ],
        field1: [
          { required: true, message: '请输入投资比例' },
        ],
      },
      temporarilyList: [],
      materiaList: [],
      sectionInfo: {},
      contractId: null,
      queryType: '',
      queryId: ''
    }
  },
  activated() {
    const data = this.$store.state.public.materiaList || []
    const finallyData = data.map( (item) => Object.assign({}, item, {minDate: this.minDate, showDatePicker: this.showDatePicker, planAmount: item.amount - item.cumulativeAmount, allocationUniqueNumber: item.uniqueNumber || item.allocationUniqueNumber}))
    const materiaList = this.materiaList.concat(finallyData)
    let obj = {}
    this.materiaList = materiaList.reduce((cur, next) => {
        obj[next.uniqueNumber || next.allocationUniqueNumber] ? "" : obj[next.uniqueNumber || next.allocationUniqueNumber] = true && cur.push(next);
        return cur;
    }, [])
    this.$store.dispatch('public/setMateriaList', this.materiaList)
  },
  mounted() {
    this.init()
  },
  methods: {
    init () {
      const data = this.$store.state.public.materiaList || []
      const finallyData = data.map( (item) => Object.assign({}, item, {minDate: this.minDate, showDatePicker: this.showDatePicker, planAmount: item.amount - item.cumulativeAmount, allocationUniqueNumber: item.uniqueNumber || item.allocationUniqueNumber}))
      const {id = null, contractId = null, type = ''} = this.$route.query
      this.queryId = id
      this.contractId = contractId
      this.queryType = type
      this.materiaList.push(...finallyData)
      if(type != 'update'){
        this.getSectionProject()
      }else{
        this.materialDemandPlanRestDetail()
      }
    },
    async getSectionProject() {
      const res = await getSectionProject()
      this.sectionInfo = {
        sectionName: res.data.sectionName,
        title: dayjs().format('YYYY年MM月') + '甲供物资计划申请表',
        deptName: this.userInfo?.deptName
      }
    },
    materialDemandPlanRestDetail () {
      materialDemandPlanRestDetail(this.queryId).then( ({data}) => {
        this.contractId = data.contractId
        this.sectionInfo = {
          sectionName: data.sectionName,
          title: dayjs().format('YYYY年MM月') + '甲供物资计划申请表',
          deptName: data.unitName
        }
        this.materiaList = data.details.map( (item) => {
          return Object.assign({}, item, {supplyDate: item.supplyDate && parseTime(item.supplyDate, '{y}-{m}-{d}'), minDate: item.supplyDate?new Date(item.supplyDate):this.minDate, showDatePicker: this.showDatePicker, backPlanAmount: item.planAmount || 0})
        })
        this.$store.dispatch('public/setMateriaList', this.materiaList)
      })
    },
    cumulativeAmount (item) {
      return this.queryType == 'update'?Number(item.cumulativeAmount) - Number(item.backPlanAmount || 0) + (Number(item.planAmount) || 0) : Number(item.cumulativeAmount) + (Number(item.planAmount) || 0)
    },
    dateClick(item, index) {
      this.$set(this.materiaList, index, Object.assign({}, item, {showDatePicker: true}))
    },
    onDateConfirm(item, index) {
      this.$set(this.materiaList, index, Object.assign({}, item, {supplyDate: parseTime(item.minDate, '{y}-{m}-{d}'), showDatePicker: false}))
    },
    hideDatePicker(item, index) {
      this.$set(this.materiaList, index, Object.assign({}, item, {showDatePicker: false}))
    },
    deleteClick (index) {
      this.materiaList.splice(index, 1)
      this.$store.dispatch('public/setMateriaList', this.materiaList)
    },
    onSubmit() {
      let type = 'save', id = null
      if(this.queryType == 'update'){
        type = 'modify'
        id = this.queryId
      }
      const isValid = this.onCheck(this.materiaList)
      if(!isValid){
        return
      }
      const data = {
        id,
        contractId: this.contractId,
        detailsModifyParams: this.materiaList.map(item => ({...item, id: null, allocationUniqueNumber: item.uniqueNumber || item.allocationUniqueNumber}))
      }
      materialDemandPlanRestSaveModify(data, type).then(({message}) => {
        this.$toast(message)
        this.$router.push({ path: '/PlannedManagementList' })
      })
    },
    returnClick () {
      const query = this.queryType == 'update'?{contractId: this.contractId, type: this.queryType, id: this.queryId}:{contractId: this.contractId}
      this.$router.push({ name: 'SelectMaterials', query })
    },
    onCheck (tableData) {
      let errors = []

      tableData.forEach((row, index) => {
        const rowNum = index + 1;
        if (!row.planAmount && row.planAmount !== 0) {
          errors.push(`第${rowNum}个，本次计划数量未填写 `)
        }

        if (!row.supplyDate) {
          errors.push(`第${rowNum}个，供应时间未填写 `)
        }

        if (!row.addr || row.addr.trim() === '') {
          errors.push(`第${rowNum}个，使用地点未填写 `)
        }
        if (!row.receiver || row.receiver.trim() === '') {
          errors.push(`第${rowNum}个，收货人及联系方式未填写 `)
        }
        if(!row.field0 || row.field0.trim() === ''){
          errors.push(`第${rowNum}个，投资方未填写 `)
        }
        if(!row.field1 || row.field1.trim() === ''){
          errors.push(`第${rowNum}个，投资比例未填写 `)
        }

        const plan = Number(row.planAmount || 0)
        const cumulative = row.cumulativeAmount - (row.backPlanAmount || 0)
        const contract = Number(row.amount || 0)

        if (plan <= 0) {
          errors.push(`第${rowNum}个，本次计划数量必须大于0 `)
        }

        if (plan + cumulative > contract) {
          errors.push(`第${rowNum}个，本次计划数量超出合同数量 `)
        }
      });

      if (errors.length > 0) {
        this.$dialog.alert({
          title: '提示',
          message: errors.join('<br/> <br/>'),
        })
        return false
      }
      return true
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