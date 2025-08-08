<template>
  <div class="submit-store-view">
    <van-form @submit="onSubmit" label-align="left">
      <div class="submit-store-view-mian">
        <div class="detail-base-info">
          <div class="detail-title-content">
            <img src="/static/icon-xqjh.png">
            <span>入库单号：</span>
            <span>{{ formData.storeNumber }}</span>
            <div class="detail-title-status">
              <img :src="checkAuditStatus(formData.storeStatus)" />
              <span>{{ checkStatusText(formData.storeStatus) }}</span>
            </div>
          </div>
          <ul class="detail-ul">
            <li>
              <span>需求名称：</span>
              <span>{{ formData.planName }}</span>
            </li>
            <li>
              <span>建设项目：</span>
              <span>{{ formData.projectName }}</span>
            </li> 
            <li>
              <span>标段项目：</span>
              <span>{{ formData.sectionName }}</span>
            </li>
            <li>
              <span>需求组织：</span>
              <span>{{ formData.deptName }}</span>
            </li>
            <li v-if="formData.storeDate">
              <span>入库时间：</span>
              <span>{{ formData.storeDate ? parseTime(formData.storeDate, '{y}-{m}-{d} {h}:{i}') : '' }}</span>
            </li>
            <li v-if="formData.storeOperator">
              <span>操作人：</span>
              <span>{{ formData.storeOperator }}</span>
            </li>
            <!-- <li class="li-status">
              <template v-for="row in statusArr">
                <van-tag :class="{ 'li-status-completed': ['2', '3'].includes(row.value) }"
                  :type="['6'].includes(row.value) ? 'danger' : 'primary'" round size="medium" :key="row.value"
                  v-if="formData.storeStatus == row.value">{{ row.text }}</van-tag>
              </template>
</li> -->
          </ul>
        </div>
        <!-- <div class="select-materials-search">
          <p class="select-materials-search-p font-weight">收货明细（共{{ tableData.length }}项）
          </p>
        </div> -->
        <van-tabs sticky v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff"
          title-inactive-color="#2e2e2e">
          <van-tab :title="`收货明细（共${tableData.length}项）`" name="0" key="0">
            <div class="box-container" v-for="(item, index) in tableData" :key="index">
              <div class="div-child">
                <div class="detail-list-title-content">
                  <span>物资名称：</span>
                  <span>{{ item.materialName }}</span>
                </div>
                <ul class="detail-list-ul">
                  <li>
                    <span>规格型号：</span>
                    <span>{{ item.specModel }}</span>
                  </li>
                  <li>
                    <span>计量单位：</span>
                    <span>{{ item.unit }}</span>
                  </li>
                  <li>
                    <span>需求数量：</span>
                    <span class="li-span-click">{{ item.planAmount }}</span>
                  </li>
                  <li class="li-item-overlength">
                    <span>本次实收数量：</span>
                    <span class="li-span-click">{{ item.putTotal }}</span>
                  </li>
                  <li class="li-item-overlength">
                    <span>生产日期：</span>
                    <span>{{ item.manufactureDate ? parseTime(item.manufactureDate, '{y}-{m}-{d}') : '' }}</span>
                  </li>
                  <li class="li-item-overlength">
                    <span>有效截止日期：</span>
                    <span class="li-span-red">{{ item.expirationDate ? parseTime(item.expirationDate, '{y}-{m}-{d}') :
      ''
                      }}</span>
                  </li>
                  <li>
                    <span>包装方式：</span>
                    <span>{{ item.packagingFm }}</span>
                  </li>
                  <li>
                    <span>使用地点：</span>
                    <span>{{ item.addr }}</span>
                  </li>
                  <li>
                    <span>收货地址：</span>
                    <span>{{ item.field2 }}</span>
                  </li>
                  <li class="li-item-overlength">
                    <span>收货人及联系方式：</span>
                    <span>{{ item.receiver }}</span>
                  </li>
                  <li>
                    <span>供应时间：</span>
                    <span>{{ item.supplyDate ? parseTime(item.supplyDate, '{y}-{m}-{d}') : '' }}</span>
                  </li>
                  <li>
                    <span>投资方：</span>
                    <span>{{ item.field0 }}</span>
                  </li>
                  <li>
                    <span>投资比例：</span>
                    <span>{{ item.field1 }}</span>
                  </li>
                  <!-- <li class="li-item-overlength">
                    <span>合格证附件：</span>
                    <span @click="imgClick(val)" class="li-span-click" v-for="val in filterList(item.fileByList, 'hgz')"
                      :key="val.filePath">{{ val.fileName }}</span>
                  </li> -->
                  <!-- <li class="li-item-overlength">
                    <span>厂检报告附件：</span>
                    <span @click="imgClick(val)" class="li-span-click" v-for="val in filterList(item.fileByList, 'cjbg')"
                      :key="val.filePath">{{ val.fileName }}</span>
                  </li> -->
                  <template v-if="queryType === 'submit'">
                    <li class="detail-list-li-input">
                      <van-field label="入库数量" placeholder="请输入入库数量" required clearable input-align="right">
                        <template #input>
                          <van-stepper v-model="item.storeTotal" :min="0" @change="putChange(item, index)" />
                        </template>
                      </van-field>
                    </li>
                    <li class="detail-list-li-input">
                      <van-field label="退货数量" placeholder="请输入退货数量" required clearable input-align="right">
                        <template #input>
                          <van-stepper v-model="item.refundZjTotal" :min="0" @change="changeRefund(item, index)" />
                        </template>
                      </van-field>
                    </li>
                    <!-- <van-field v-model="item.storeTotal" type="number" name="入库数量" label="入库数量" placeholder="请输入入库数量"
                      @blur="putChange(item, index)" input-align="right" required :rules="rules.storeTotal" />
                    <van-field v-model="item.refundZjTotal" type="number" name="退货数量" label="退货数量" placeholder="请输入退货数量"
                      @blur="changeRefund(item, index)" input-align="right" required :rules="rules.refundZjTotal" /> -->
                  </template>
                  <template v-else>
                    <li>
                      <span>入库数量：</span>
                      <span class="li-span-click">{{ item.storeTotal }}</span>
                    </li>
                    <li>
                      <span>退货数量：</span>
                      <span class="li-span-red">{{ item.refundZjTotal }}</span>
                    </li>
                  </template>
                  <li class="li-item-remark">
                    <span>备注：</span>
                    <div class="remark-detail">{{ item.remark || '未填写' }}</div>
                  </li>
                </ul>
                <div class="detail-title-contentA">
                  <img src="/static/icon-file.png">
                  <span>附件</span>
                </div>
                <file-download-view class="outbound-field-uploader" title="合格证附件"
                  :fileList="filterList(item.fileByList, 'hgz') || []" />
                <file-download-view class="outbound-field-uploader" title="厂检报告附件"
                  :fileList="filterList(item.fileByList, 'cjbg') || []" />
                <file-upload-view class="outbound-field-uploader" v-if="queryType === 'submit'" title="退货附件"
                  :fileList="item.fileList03 || []" businessType="01" />
                <file-download-view class="outbound-field-uploader" v-else title="退货附件"
                  :fileList="item.fileList03 || []" />
              </div>
            </div>
          </van-tab>
          <van-tab title="报检信息" name="1" key="1">
            <div class="box-container">
              <file-upload-view :maxCount="5" v-if="queryType === 'submit'" title="报检材料上传（支持多个）"
                :fileList="formData.fileList01 || []" businessType="01" />
              <file-download-view v-else title="报检材料上传（支持多个）" :fileList="formData.fileList01 || []" />
            </div>
          </van-tab>
        </van-tabs>
      </div>
      <div class="default-button-container" v-if="queryType === 'submit'">
        <van-button class="button-info" round type="info" native-type="submit">提交报检审核</van-button>
      </div>
    </van-form>
    <!-- 附件预览 -->
    <file-preview ref="filePreview"></file-preview>
    <activiti-assignee ref="activitiAssignee" @optionsSuccess="optionsSuccess"></activiti-assignee>
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import indexMixin from '@/view/mixins'
import { detailByStore } from '@/api/prodmgr-inv/materialCirculationTableRest'
import { materialStoreTableRestSubmit } from '@/api/prodmgr-inv/materialStoreTableRest'
import FilePreview from "@/components/FilePreview.vue";
import activitiAssignee from '@/components/activitiAssignee'
import FileUploadView from "@/components/FileUploadView.vue"
import FileDownloadView from "@/components/FileDownloadView.vue"
import BackToTop from '@/components/BackToTop'
export default {
  name: 'SubmitStore',
  mixins: [indexMixin],
  components: { FilePreview, activitiAssignee, FileUploadView, FileDownloadView, BackToTop },
  data() {
    return {
      queryType: '',
      formData: {},
      tableData: [],
      rules: {
        storeTotal: [
          { required: true, message: '请输入入库数量' },
        ],
        refundZjTotal: [
          { required: true, message: '请输入退货数量' },
        ],
      },
      supplyId: null,
      id: null,
      statusArr: [
        { value: '', text: '全部' },
        { value: "1", text: "待检测" },
        { value: "2", text: "部分退货" },
        { value: "3", text: "已入库" },
        { value: "4", text: "已退货" },
        { value: "5", text: "审核中" },
        { value: "6", text: "已驳回" }
      ],
      menuActiveIndex: '0'
    }
  },
  activated() {
  },
  mounted() {
    const { type, id, storeStatus, supplyId } = this.$route.query
    this.supplyId = supplyId
    this.queryType = type
    this.id = id
    this.detailByStore(id, storeStatus)
  },
  methods: {
    checkStatusText(status) {
      let name = ''
      this.statusArr.forEach(item => {
        if (item.value === status) {
          name = item.text
        }
      })
      return name
    },
    checkAuditStatus(status) {
      if (status == '6') {
        return '/static/icon-reject.png'
      } else if (['2', '4'].includes(status)) {
        return '/static/icon-return.png'
      } else if (['1'].includes(status)) {
        return '/static/icon-xqjh.png'
      } else {
        return '/static/icon-success.png'
      }
    },
    detailByStore(id, storeStatus) {
      const url = storeStatus == "5" || storeStatus == "6" ? detailStoreBack : detailByStore
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      url(id).then(({ data }) => {
        this.formData = {
          ...data,
          fileList01: data.fileByList ? JSON.parse(data.fileByList).jcbg || [] : [], //检测报告
          fileList02: data.fileByList ? JSON.parse(data.fileByList).zlzm || [] : [], //证明文件
          fileList03: data.fileByList ? JSON.parse(data.fileByList).byjg || [] : [], //报验结果
        }
        this.tableData = data.materialCirculationDetailsTableDTOS.map((item) => ({
          ...item,
          storeTotal: this.queryType == "submit" ? item.putTotal : item.storeTotal, //新增默认入库数量=收货数量
          fileList01: item.fileByList ? JSON.parse(item.fileByList).hgz || [] : [], //合格证
          fileList02: item.fileByList ? JSON.parse(item.fileByList).cjbg || [] : [], //厂检报告
          fileList03: item.fileByList ? JSON.parse(item.fileByList).thfj_im || [] : [], //退货附件
        }))
      }).finally((err) => {
        toast.clear()
      })
    },
    //附件上传前
    beforeRead(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      const isFileName = file.name.length < 90;

      if (!isLt10M) {
        this.$notify({
          type: 'warning',
          message: '上传文件大小不能超过 10MB!',
        });
        return false;
      }
      if (!isFileName) {
        this.$notify({
          type: 'warning',
          message: '上传文件名过长!',
        });
        return false;
      }
      return true;
    },
    putChange(item, index) {
      //入库不能超过收货，最终算出退货
      this.$nextTick( () => {
        if(Number(item.storeTotal) > 0){
          this.tableData[index].storeTotal = item.putTotal
          this.tableData[index].refundZjTotal = 0
        }else{
          this.tableData[index].refundZjTotal = item.putTotal
        }
        // if (Number(item.storeTotal) > Number(item.putTotal)) {
        //   this.$toast('入库数量不能大于收货数量！')
        //   this.tableData[index].storeTotal = item.putTotal
        // } else {
        //   this.tableData[index].refundZjTotal = Number(item.putTotal) - Number(item.storeTotal)
        // }
      })
    },
    //填写退货数量
    changeRefund(item, index) {
      //退货不能超过收货，最终算出入库
      this.$nextTick( () => {
        if(Number(item.refundZjTotal) > 0){
          this.tableData[index].refundZjTotal = item.putTotal
          this.tableData[index].storeTotal = 0
        }else{
          this.tableData[index].storeTotal = item.putTotal
        }
        // if (Number(item.refundZjTotal) > Number(item.putTotal)) {
        //   this.$toast('退货数量不能大于收货数量！')
        //   this.tableData[index].refundZjTotal = Number(item.putTotal) - Number(item.storeTotal);
        // } else {
        //   this.tableData[index].storeTotal = Number(item.putTotal) - Number(item.refundZjTotal);
        // }
      })
    },
    onCheck(tableData) {
      const errors = [];
      tableData.forEach((row, index) => {
        const rowNum = index + 1;
        if (Number(row.refundZjTotal) > 0 && row.fileList03.length == 0) {
          errors.push(`第${rowNum}个，有退货数量，请上传退货附件 `);
        }
      });

      if (errors.length > 0) {
        this.$toast({
          type: 'html',
          message: errors.join("<br/>")
        })
        return false;
      }
      return true;
    },
    onSubmit() {
      const isValid = this.onCheck(this.tableData);
      if (!isValid) {
        return;
      }
      for (let i in this.tableData) {
        let fileByList = this.tableData[i].fileByList
          ? JSON.parse(this.tableData[i].fileByList)
          : {};
        //退货附件
        if (this.tableData[i].fileList03.length > 0) {
          this.$set(fileByList, "thfj_im", this.tableData[i].fileList03);
        }
        this.tableData[i].fileByList = JSON.stringify(fileByList);
      }
      //组装附件
      let fileByList = this.formData.fileByList ? JSON.parse(this.formData.fileByList) : {};
      //检测报告
      if (this.formData.fileList01.length > 0) {
        this.$set(fileByList, "jcbg", this.formData.fileList01);
      } else {
        this.$notify({
          type: 'warning',
          message: "请上传报检材料附件"
        });
        return
      }
      //质量证明文件
      if (this.formData.fileList02.length > 0) {
        this.$set(fileByList, "zlzm", this.formData.fileList02);
      }
      //报验结果
      if (this.formData.fileList03.length > 0) {
        this.$set(fileByList, "byjg", this.formData.fileList03);
      }
      this.formData.fileByList = JSON.stringify(fileByList);

      this.$dialog.confirm({
        title: '标题',
        message: '是否确认提交入库审核?',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.$refs.activitiAssignee.init('RKLC', this.formData)
      })
    },
    //选择审核人回调
    optionsSuccess(assignee, { id, planType }) {
      const params = Object.assign({ supplyId: this.supplyId, id: this.id, planType: planType, assignee }, this.formData, { materialCirculationDetailsTableParamList: this.tableData })
      materialStoreTableRestSubmit(params).then(() => {
        this.$toast('提交入库审核成功')
        this.$router.push({ path: '/InOutManagementList' })
      })
    },
    imgClick({ fileName, filePath }) {
      this.$refs.filePreview.init(fileName, filePath)
    }
  }
}
</script>
<style lang="less" scoped>
.detail-list-li-input {

  & :nth-child(2) {
    text-align: center;
  }

  ::v-deep .van-cell__title {
    color: #151b3e;
  }

  .van-stepper {
    border: 1px solid #dbdbdb;
    border-radius: 5px;

    ::v-deep .van-stepper__input {
      background: #fff;
      width: 50px;
    }
  }
}

.submit-store-view-mian {
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;
}

.detail-title-content {
  position: relative;

  .detail-title-status {
    position: absolute;
    right: 10px;
    top: 0;
    display: flex;
    align-items: center;
    height: 100%;

    img {
      width: 16px;
      height: 16px;
    }

    span {
      margin-left: 3px;
      color: #134daa;
      font-size: 11px;
    }
  }

}

.box-container {
  padding: 0;
}

.outbound-field-uploader {
  ::v-deep li {
    display: block;
  }

  ::v-deep .file-info {
    width: auto !important;

    img {
      min-width: auto !important;
    }
  }
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
    margin-left: 6px;
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
</style>