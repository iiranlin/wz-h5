<template>
  <div class="save-materials">
    <div class="detail-base-info">
      <div class="detail-title-text">
        <p>需求名称：</p>
        <p>{{ sectionInfo.title }}</p>
      </div>
      <div class="detail-ul-text">
        <ul class="detail-ul">
          <li>
            <span>建设项目：</span>
            <span>{{ sectionInfo.projectName }}</span>
          </li>
          <li>
            <span>标段项目：</span>
            <span>{{ sectionInfo.sectionName }}</span>
          </li>
          <li>
            <span>需求组织：</span>
            <span>{{ sectionInfo.deptName }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="box-container box-containerA" v-if="sectionInfo.fileList?.length">
      <div class="detail-title-contentA">
        <img src="/static/icon-file.png">
        <span>附件</span>
      </div>
      <file-upload-view :fileList="sectionInfo.fileList || []" :maxCount="99" :isShowButton="false" businessType="01"></file-upload-view>
    </div>
    <div class="detail-floor-content">
      <div>
        <van-button type="default" :class="{ 'van-button-selected': btnClickIndex == '0' }"
          @click="btnClick('0')">全部物资</van-button>
        <van-button type="default" :class="{ 'van-button-selected': btnClickIndex == '1' }"
          @click="btnClick('1')">未完善物资</van-button>
      </div>
      <span @click="returnClick"><span class="detail-floor-content-add">+</span>添加物资</span>
    </div>
    <div class="box-container" v-for="(item, index) in btnClickIndex == '0' ? materiaList : editMateriaList" :key="item.id"
      :class="item.planAmount && item.supplyDate && item.addr && item.field2 && item.receiver && item.field0 && item.field1 ? '' : 'box-container-unedited'">
      <div class="div-child">
        <ul class="detail-list-ul">
          <li class="detail-list-ul-text">
            <span class="font-weight">{{ index + 1 }}.{{ item.materialName }}</span>
            <img
              :src="item.planAmount && item.supplyDate && item.addr && item.field2 && item.receiver && item.field0 && item.field1 ? editedStatus : editStatus" />
          </li>
          <li>
            <span>供应商：</span>
            <span>{{ item.sellerName }}</span>
          </li>
          <li>
            <span>规格型号：</span>
            <span>{{ item.specModel }}</span>
          </li>
          <li>
            <span>计量单位：</span>
            <span>{{ item.unit }}</span>
          </li>
          <li>
            <span>合同数量：</span>
            <span class="li-span-click">{{ item.amount }}</span>
          </li>
          <li class="li-item-overlength">
            <span>累计计划量（含本次）：</span>
            <span class="li-span-click">
              {{ cumulativeAmount(item) }}
            </span>
          </li>
          <li>
            <span>本次计划数量：</span>
            <span v-if="item.planAmount">{{ item.planAmount }}</span>
            <span v-else class="li-span-grey">填写</span>
          </li>
          <li>
            <span>供应时间：</span>
            <span v-if="item.supplyDate">{{ item.supplyDate }}</span>
            <span v-else class="li-span-grey">填写</span>
          </li>
          <li>
            <span>收货人联系方式：</span>
            <span v-if="item.receiver">{{ item.receiver }}</span>
            <span v-else class="li-span-grey">填写</span>
          </li>
        </ul>
      </div>
      <div class="list-ul-button">
        <van-button class="button-info" plain round type="info" native-type="button"
          @click="editedClick(item, index)">编辑</van-button>
        <van-button class="button-info" plain round native-type="button" @click="deleteClick(index)">删除</van-button>
      </div>
    </div>
    <div class="default-button-container">
      <div class="default-button-container-selected" @click="selectedClick">
        <span>已填写 <span class="li-span-click">{{ editedMateriaList.length }}</span><span>/{{ materiaList.length }}</span>
        </span>
        <img :class="{ 'default-button-container-selected-img': $refs.editedList && $refs.editedList.sheetShow }"
          src="@/assets/img/Icon-slideup.png" />
      </div>
      <div class="default-button-container-button">
        <file-upload-view :fileList="sectionInfo.fileList || []" :maxCount="99" :isFileList="false" businessType="01"></file-upload-view>
        <van-button class="button-info" round type="info" @click="onSubmit">保存</van-button>
      </div>
    </div>
    <history-list ref="historyList" @historyClick="historyClick"></history-list>
    <back-to-top className=".default-container"></back-to-top>
    <edited-list ref="editedList" :editedData="materiaList" :editedMateriaList="editedMateriaList"
      @editedClick="editedClick"></edited-list>
  </div>
</template>
<script>
import editedStatus from '@/assets/img/editedStatus.png'
import editStatus from '@/assets/img/editStatus.png'
import editedList from './components/editedList'
import BackToTop from '@/components/BackToTop'
import keepPages from '@/view/mixins/keepPages'
import historyList from '@/components/historyList'
import { parseTime } from '@/utils/index'
import { getSectionProject } from '@/api/prodmgr-inv/materialSectionProject'
import { materialDemandPlanRestSaveModify, materialDemandPlanRestDetail } from '@/api/prodmgr-inv/materialDemandPlanRest'
import { getUserInfo } from '@/utils/user-info'
import dayjs from 'dayjs'
import FileUploadView from "@/components/FileUploadView.vue"
export default {
  name: 'SaveMaterials',
  mixins: [keepPages],
  components: { historyList, BackToTop, editedList, FileUploadView },
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
      materiaList: [],
      sectionInfo: {},
      contractId: null,
      queryType: '',
      queryId: '',
      editedStatus,
      editStatus,
      editedMateriaList: [],
      editMateriaList: [],
      btnClickIndex: '0',
      materialUsedRatio: ''
    }
  },
  activated() {
    this.materiaList = this.historyCache({ addr: '', field0: '', field1: '' }, 0)
    this.$store.dispatch('public/setMateriaList', this.materiaList)
    if(!this.materiaList.length){
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { id = null, contractId = null, type = '', materialUsedRatio } = this.$route.query
      this.queryId = id
      this.contractId = contractId
      this.queryType = type
      this.materialUsedRatio = materialUsedRatio
      this.materiaList = this.historyCache({ addr: '', field0: '', field1: '' }, 0)
      if (type != 'update') {
        this.getSectionProject()
      } else {
        this.materialDemandPlanRestDetail()
      }
    },
    historyCache(obj, index, isDefault) {
      const data = this.$store.state.public.materiaList || []
      // const historyList = this.$store.state.public.historyList || {}
      // if (historyList) {
      //   for (const key in obj) {
      //     if (historyList[key]) {
      //       obj[key] = obj[key] || historyList[key][index] || ''
      //     }
      //   }
      // }
      // if (isDefault) {
      //   return obj
      // }
      const finallyData = data.map((item) => Object.assign({}, item, {
        supplyDate: item.supplyDate || parseTime(new Date(), '{y}-{m}-{d}'),
        minDate: this.minDate,
        showDatePicker: this.showDatePicker,
        planAmount: item.planAmount || item.amount - item.cumulativeAmount,
        allocationUniqueNumber: item.uniqueNumber || item.allocationUniqueNumber,
        field2: item.field2 || item.deliveryLocation,
        // addr: item.addr || obj.addr, field0: item.field0 || obj.field0, field1: item.field1 || obj.field1
      }))

      this.editedMateriaList = finallyData.filter(item => item.planAmount && item.supplyDate && item.addr && item.field2 && item.receiver && item.field0 && item.field1)
      this.editMateriaList = finallyData.filter(item => !(item.planAmount && item.supplyDate && item.addr && item.field2 && item.receiver && item.field0 && item.field1))

      return finallyData
    },
    async getSectionProject() {
      const res = await getSectionProject()
      this.sectionInfo = {
        sectionName: res.data.sectionName,
        title: dayjs().format('YYYY年MM月') + '甲供物资计划申请表',
        deptName: this.userInfo?.deptName,
        fileList: []
      }
    },
    materialDemandPlanRestDetail() {
      materialDemandPlanRestDetail(this.queryId).then(({ data }) => {
        this.contractId = data.contractId
        this.sectionInfo = {
          sectionName: data.sectionName,
          title: dayjs().format('YYYY年MM月') + '甲供物资计划申请表',
          deptName: data.deptName,
          fileList: data.fileList[0]?.fileList || []
        }
        this.materiaList = data.details.map((item) => {
          return Object.assign({}, item, { supplyDate: item.supplyDate && parseTime(item.supplyDate, '{y}-{m}-{d}'), minDate: item.supplyDate ? new Date(item.supplyDate) : this.minDate, showDatePicker: this.showDatePicker, backPlanAmount: item.planAmount || 0 })
        })
        this.$store.dispatch('public/setMateriaList', this.materiaList)
        this.$store.dispatch('public/setInterfaceMateriaList', this.materiaList)
        this.editedMateriaList = this.materiaList.filter(item => item.planAmount && item.supplyDate && item.addr && item.field2 && item.receiver && item.field0 && item.field1)
        this.editMateriaList = this.materiaList.filter(item => !(item.planAmount && item.supplyDate && item.addr && item.field2 && item.receiver && item.field0 && item.field1))
      })
    },
    cumulativeAmount(item) {
      return this.queryType == 'update' ? Number(item.cumulativeAmount) - Number(item.backPlanAmount || 0) + (Number(item.planAmount) || 0) : Number(item.cumulativeAmount) + (Number(item.planAmount) || 0)
    },
    dateClick(item, index) {
      this.$set(this.materiaList, index, Object.assign({}, item, { showDatePicker: true }))
    },
    onDateConfirm(item, index) {
      this.$set(this.materiaList, index, Object.assign({}, item, { supplyDate: parseTime(item.minDate, '{y}-{m}-{d}'), showDatePicker: false }))
    },
    hideDatePicker(item, index) {
      this.$set(this.materiaList, index, Object.assign({}, item, { showDatePicker: false }))
    },
    deleteClick(index) {
      const row = this.materiaList[index]
      const uniqueNumber = row.uniqueNumber || row.allocationUniqueNumber
      this.editedMateriaList = this.editedMateriaList.filter(item => !(uniqueNumber === item.uniqueNumber || uniqueNumber === item.allocationUniqueNumber))
      this.materiaList.splice(index, 1)
      this.$store.dispatch('public/setMateriaList', this.materiaList)
    },
    onSubmit() {
      let type = 'save', id = null
      if (this.queryType == 'update') {
        type = 'modify'
        id = this.queryId
      }

      const isSection = this.scrollToSection()
      if (!isSection) {
        this.$notify({
          type: 'warning',
          message: '请完善物资!',
        });
        return
      }

      const isValid = this.onCheck(this.materiaList)
      if (!isValid) {
        return
      }
      const data = {
        id,
        contractId: this.contractId,
        fileList: [{ fileList: this.sectionInfo.fileList }],
        detailsModifyParams: this.materiaList.map(item => ({ ...item, id: null, allocationUniqueNumber: item.uniqueNumber || item.allocationUniqueNumber }))
      }
      // let obj = { addr: [], field2: [], field0: [], field1: [] }
      // obj.addr = this.materiaList.map(item => item.addr)
      // obj.field2 = this.materiaList.map(item => item.field2)
      // obj.field0 = this.materiaList.map(item => item.field0)
      // obj.field1 = this.materiaList.map(item => item.field1)

      materialDemandPlanRestSaveModify(data, type).then(({ data, message }) => {
        // this.$store.dispatch('public/setHistoryList', obj)
        id = data || id
        this.$toast(message)
        this.$router.push({ name: 'SaveSuccess', query: { id } })
      })
    },
    returnClick() {
      const query = this.queryType == 'update' ? { contractId: this.contractId, type: this.queryType, id: this.queryId, materialUsedRatio: this.materialUsedRatio } : { contractId: this.contractId, materialUsedRatio: this.materialUsedRatio }
      this.$router.push({ name: 'SelectMaterials', query })
    },
    onCheck(tableData) {
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
        if (!row.field0 || row.field0.trim() === '') {
          errors.push(`第${rowNum}个，投资方未填写 `)
        }
        if (!row.field1 || row.field1.trim() === '') {
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
    },
    // fieldClick($event, name, index) {
    //   this.$refs.historyList.init($event, name, index)
    // },
    historyClick(data, name, index, historyIndex) {
      let obj = { addr: '', field2: '', field0: '', field1: '' }
      let finallyData = this.historyCache(obj, historyIndex, true)
      for (var key in finallyData) {
        if (finallyData[key] == '') {
          delete finallyData[key]
        }
      }
      this.$set(this.materiaList, index, Object.assign({}, this.materiaList[index], finallyData))
    },
    selectedClick() {
      this.$refs.editedList.init()
    },
    editedClick(item, index) {
      const query = this.queryType == 'update' ? { uniqueNumber: item.uniqueNumber || item.allocationUniqueNumber, contractId: this.contractId, type: this.queryType, id: this.queryId } : { uniqueNumber: item.uniqueNumber || item.allocationUniqueNumber, contractId: this.contractId }
      this.$router.push({ name: 'EditedMaterials', query })
    },
    btnClick(code) {
      this.btnClickIndex = code
    },
    scrollToSection() {
      const element = document.getElementsByClassName('box-container-unedited')
      if (element.length) {
        element[0].scrollIntoView({ behavior: 'smooth' })
        return false
      }
      return true
    }
  }
}
</script>
<style lang="less" scoped>
.box-container {
  padding: 0;
}

.save-materials {
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;

  .box-containerA{
    margin-bottom: 0;
    margin-top: 8px;
  }
  
  .detail-title-contentA {
    width: 100%;
    height: 34px;
    display: flex;
    align-items: center;
    padding-left: 2px;
    padding-right: 27px;
    box-sizing: border-box;
    border-top: 1px solid #f1f4f8;

    img {
      width: 25px;
      height: 25px;
    }

    & span:nth-child(2) {
      margin-left: 2px;
      color: #151b3e;
      font-size: 15px;
      font-weight: 600;
    }

    & span:nth-child(3) {
      color: #151b3e;
      font-size: 15px;
      font-weight: 600;
    }
  }

  .detail-title-text {
    padding: 0 12px;

    p {
      &:nth-child(1) {
        font-size: 11px;
        color: #1159cc;
        padding-bottom: 5px;
      }

      &:nth-child(2) {
        padding-left: 5px;
        font-weight: 600;
      }
    }
  }

  .detail-ul-text {
    margin: 10px;
    background: #f2f2f2;
    border-radius: 5px;

    .detail-ul {
      padding: 10px 12px;
    }
  }

  .detail-floor-content {
    justify-content: space-between;
    padding: 5px 12px 2px 12px;

    span {
      color: #151b3e;
      font-weight: 400;
    }

    .van-button {
      border-radius: 5px;
      margin-right: 8px;
      height: 30px;
    }

    .van-button-selected {
      span {
        color: #0861db;
      }
    }

    .detail-floor-content-add {
      color: #1189f6;
      padding-right: 2px;
      font-size: 16px;
      vertical-align: middle;
    }
  }

  .detail-list-ul {
    padding-left: 12px;

    .detail-list-ul-text {
      justify-content: space-between;

      img {
        width: 18px;
        height: 18px;
        flex: none;
        margin-top: 4px;
      }
    }
  }

  .default-button-container {
    justify-content: space-between;
    padding-left: 14px;
    padding-right: 19px;
    box-sizing: border-box;
    box-shadow: 4px 0px 5px rgba(32, 30, 74, 0.1);
    z-index: 10000;

    .default-button-container-selected {
      font-size: 13px;

      span {
        vertical-align: middle;
      }

      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }

      .default-button-container-selected-img {
        transform: rotate(180deg)
      }
    }

    .default-button-container-button{
      display: flex;
      .button-info{
        margin-left: 10px;
      }
    }

    .button-info {
      width: 120px;
      height: 34px;
    }

    ::v-deep .file-add{
      margin: 0;
      padding: 0;
    }
  }
}
</style>