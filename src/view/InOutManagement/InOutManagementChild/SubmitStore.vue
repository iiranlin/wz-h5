<template>
  <div class="submit-store-view">
    <van-form @submit="onSubmit" label-align="left" label-width="180px">
      <div class="submit-store-view-mian">
        <div class="box-container" style="margin-top: 20px;">
          <div>
            <ul class="detail-ul">
              <li v-if="formData.storeNumber">
                <span>入库单号：</span>
                <span>{{ formData.storeNumber }}</span>
              </li>
              <li>
                <span>需求名称：</span>
                <span>{{ formData.planName }}</span>
              </li>
              <li>
                <span>需求项目：</span>
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
              <li class="li-status">
                <template v-for="row in statusArr">
                  <van-tag :class="{ 'li-status-completed': ['2', '3'].includes(row.value) }"
                    :type="['6'].includes(row.value) ? 'danger' : 'primary'" round size="medium" :key="row.value"
                    v-if="formData.storeStatus == row.value">{{ row.text }}</van-tag>
                </template>
              </li>
            </ul>
          </div>
        </div>
        <div class="select-materials-search">
          <p class="select-materials-search-p font-weight">收货明细（共{{ tableData.length }}项）
          </p>
        </div>
        <div class="box-container" v-for="(item, index) in tableData" :key="index">
          <div>
            <ul class="detail-ul">
              <li>
                <span>物资名称：</span>
                <span>{{ item.materialName }}</span>
              </li>
              <li>
                <span>规格型号：</span>
                <span>{{ item.specModel }}</span>
              </li>
              <li class="li-item-both">
                <div class="li-item-left">
                  <span>计量单位：</span>
                  <span>{{ item.unit }}</span>
                </div>
                <div class="li-item-right">
                  <span>需求数量：</span>
                  <span>{{ item.planAmount }}</span>
                </div>
              </li>
              <li class="li-item-overlength">
                <span>本次收货数量：</span>
                <span>{{ item.putTotal }}</span>
              </li>
              <li class="li-item-both">
                <div class="li-item">
                  <span>生产日期：</span>
                  <span>{{ item.manufactureDate ? parseTime(item.manufactureDate, '{y}-{m}-{d}') : '' }}</span>
                </div>
                <div class="li-item">
                  <span>有效截止日期：</span>
                  <span class="li-span-red">{{ item.expirationDate ? parseTime(item.expirationDate, '{y}-{m}-{d}') : ''
                    }}</span>
                </div>
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
              <file-download-view class="outbound-field-uploader" title="合格证附件" :fileList="filterList(item.fileByList, 'hgz') || []"/>
              <!-- <li class="li-item-overlength">
                <span>厂检报告附件：</span>
                <span @click="imgClick(val)" class="li-span-click" v-for="val in filterList(item.fileByList, 'cjbg')"
                  :key="val.filePath">{{ val.fileName }}</span>
              </li> -->
              <file-download-view class="outbound-field-uploader" title="厂检报告附件" :fileList="filterList(item.fileByList, 'cjbg') || []"/>
              <template v-if="queryType === 'submit'">
                <van-field v-model="item.storeTotal" type="number" name="入库数量" label="入库数量" placeholder="请输入入库数量"
                  @blur="putChange(item, index)" input-align="right" required :rules="rules.storeTotal" />
                <van-field v-model="item.refundZjTotal" type="number" name="退货数量" label="退货数量" placeholder="请输入退货数量"
                  @blur="changeRefund(item, index)" input-align="right" required :rules="rules.refundZjTotal" />
              </template>
              <template v-else>
                <li class="li-item-both">
                  <div class="li-item-left">
                    <span class="font-weight">入库数量：</span>
                    <span class="font-weight">{{ item.storeTotal }}</span>
                  </div>
                  <div class="li-item-right">
                    <span class="font-weight">退货数量：</span>
                    <span class="font-weight">{{ item.refundZjTotal }}</span>
                  </div>
                </li>
              </template>
              <file-upload-view class="outbound-field-uploader" v-if="queryType === 'submit'" title="退货附件" :fileList="item.fileList03 || []" businessType="01"/>
              <file-download-view class="outbound-field-uploader" v-else title="退货附件" :fileList="item.fileList03 || []"/>
              <!-- <van-field name="uploader" label="退货附件：" class="outbound-field-uploader" required
                v-if="queryType != 'view'">
                <template #input>
                  <van-uploader v-if="item.fileList03 && item.fileList03.length == 0" :preview-imag='false'
                    :after-read="(file) => afterReadTransfer(file, item, 'fileList03')" :before-read="beforeRead"
                    accept="">
                    <van-button round type="info" class="outbound-uploader" native-type="button">上传</van-button>
                  </van-uploader>
                  <van-button round type="danger" class="outbound-uploader-delete" v-else native-type="button"
                    @click="handleFileDelete(item, 'fileList03')">删除</van-button>
                </template>
              </van-field> -->
              <!-- <span class="li-span-click" v-if="item.fileList03 && item.fileList03.length > 0 && queryType != 'view'"
                @click="imgClick(item.fileList03[0])">{{ item.fileList03[0].fileName }}</span> -->
              <!-- <li v-if="queryType === 'view'">
                <span>退货附件：</span>
                <span @click="imgClick(val)" class="li-span-click" v-for="val in filterList(item.fileByList, 'thfj_im')"
                  :key="val.filePath">{{ val.fileName }}</span>
              </li> -->
              <li class="li-item-overlength">
                <span>备注：</span>
                <span>{{ item.remark }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- <div class="select-materials-search">
          <p class="select-materials-search-p font-weight">报检信息</p>
        </div>
        <div class="box-container">
          <div class="box-container-uploader">
            <ul class="detail-ul">
              <van-field name="uploader" label="报检材料上传（支持多个）：" class="outbound-field-uploader" required>
                <template #input>
                  <van-uploader :preview-imag='false' v-if="queryType != 'view'"
                    :after-read="(file) => afterReadTransfer(file, formData, 'fileList01')" :before-read="beforeRead"
                    accept="">
                    <van-button round type="info" class="outbound-uploader" native-type="button">上传</van-button>
                  </van-uploader>
                </template>
              </van-field>
              <li v-for="(item, index) in formData.fileList01" :key="item.fileName" class="detail-ul-uploader-li">
                <span class="li-span-click" @click="imgClick(item)">{{ item.fileName }}</span>
                <van-button round type="danger" class="outbound-uploader-delete" native-type="button"
                  @click="handleFileDelete(item, 'fileList01', index)" v-if="queryType != 'view'">删除</van-button>
              </li>
            </ul>
          </div>
        </div> -->
        <div class="box-container">
          <div class="detail-title-info">
            <img src="/static/icon-file.png"/>
            <span class="info-title">报检信息</span>
          </div>
          <file-upload-view :maxCount="5" v-if="queryType === 'submit'" title="报检材料上传（支持多个）" :fileList="formData.fileList01 || []" businessType="01"/>
          <file-download-view v-else title="报检材料上传（支持多个）" :fileList="formData.fileList01 || []"/>
        </div>
      </div>
      <div class="default-button-container" v-if="queryType === 'submit'">
        <van-button class="button-info" round type="info" native-type="submit">提交入库审核</van-button>
      </div>
    </van-form>
    <!-- 附件预览 -->
    <file-preview ref="filePreview"></file-preview>
    <activiti-assignee ref="activitiAssignee" @optionsSuccess="optionsSuccess"></activiti-assignee>
  </div>
</template>
<script>
import indexMixin from '@/view/mixins'
import { detailByStore } from '@/api/prodmgr-inv/materialCirculationTableRest'
import { materialStoreTableRestSubmit } from '@/api/prodmgr-inv/materialStoreTableRest'
import FilePreview from "@/components/FilePreview.vue";
// import { minioUpload } from '@/api/blcd-base/minio'
import activitiAssignee from '@/components/activitiAssignee'
import FileUploadView from "@/components/FileUploadView.vue"
import FileDownloadView from "@/components/FileDownloadView.vue"
export default {
  name: 'SubmitStore',
  mixins: [indexMixin],
  components: { FilePreview, activitiAssignee, FileUploadView, FileDownloadView },
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
        { value: "1", text: "未入库" },
        { value: "2", text: "部分退货" },
        { value: "3", text: "已入库" },
        { value: "4", text: "已退货" },
        { value: "5", text: "审核中" },
        { value: "6", text: "已驳回" }
      ],
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
    //校验附件上传
    // afterReadTransfer(file, item, name) {
    //   let formData = new FormData();
    //   formData.append("file", file.file);
    //   formData.append("businessType", "01");
    //   formData.append("key", file.file.name);

    //   file.status = 'uploading';
    //   file.message = '上传中...';
    //   const fileNameArr = item[name].map(val => val.fileName)
    //   if (fileNameArr.includes(file.file.name)) {
    //     this.$notify({
    //       type: 'warning',
    //       message: "请不要上传重复的附件"
    //     });
    //     return
    //   }

    //   minioUpload(formData).then(({ data }) => {
    //     this.$notify({
    //       type: 'success',
    //       message: "上传成功"
    //     });
    //     let file = {
    //       fileName: data.fileName,
    //       filePath: data.filePath,
    //     }
    //     item[name].push(file);
    //   }).catch((err) => {
    //     this.$notify({
    //       type: 'warning',
    //       message: "上传失败"
    //     });
    //   })
    // },
    putChange(item, index) {
      //入库不能超过收货，最终算出退货
      if (Number(item.storeTotal) > Number(item.putTotal)) {
        this.$toast('入库数量不能大于收货数量！')
        this.tableData[index].storeTotal = item.putTotal
      } else {
        this.tableData[index].refundZjTotal = Number(item.putTotal) - Number(item.storeTotal)
      }
    },
    //填写退货数量
    changeRefund(item, index) {
      //退货不能超过收货，最终算出入库
      if (Number(item.refundZjTotal) > Number(item.putTotal)) {
        this.$toast('退货数量不能大于收货数量！')
        this.tableData[index].refundZjTotal = Number(item.putTotal) - Number(item.storeTotal);
      } else {
        this.tableData[index].storeTotal = Number(item.putTotal) - Number(item.refundZjTotal);
      }
    },
    //附件删除
    // handleFileDelete(item, name, index) {
    //   if (name === 'fileList01') {
    //     this.formData.fileList01.splice(index, 1)
    //   } else {
    //     item[name] = []
    //   }
    // },
    onCheck(tableData) {
      const errors = [];
      tableData.forEach((row, index) => {
        const rowNum = index + 1;
        if (Number(row.refundZjTotal) > 0 && row.fileList03.length == 0) {
          errors.push(`第${rowNum}行，有退货数量，请上传退货附件 `);
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
        this.$refs.activitiAssignee.init('RK', this.formData)
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
.submit-store-view {
  width: 100%;
  height: 100%;

  .box-container-uploader{
    ::v-deep .van-cell__title{
      width: 190px !important;
    }
  }

  .submit-store-view-mian {
    display: flex;
    flex-direction: column;
    padding-bottom: 50px;
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
    padding-left: 12px;
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

  .van-cell--required::before {
    left: 4px;
  }

  // ::v-deep .outbound-field-uploader {
  //   &:before {
  //     top: 16px;
  //     left: 4px;
  //   }

  //   .van-field__label {
  //     line-height: 35px;
  //   }
  // }

  .van-field__control--custom {
    .outbound-uploader {
      min-width: 80px;
      height: 25px;
    }
  }

  ::v-deep .outbound-field-text {
    padding-left: 0;
  }

  ::v-deep .van-field__body {
    float: right;
  }

  .div-child {
    margin-top: 5px;
    padding-top: 5px;
    border-top: 1px solid #f3f5f7;
  }

  .li-span-click {
    word-wrap: break-word;
  }

  // .outbound-uploader-delete {
  //   width: 80px !important;
  //   height: 25px;
  //   transform: translateY(5px);

  //   span {
  //     color: #fff;
  //   }

  //   .van-button__content {
  //     width: auto;
  //   }
  // }

  // .detail-ul-uploader-li {
  //   display: block;
  //   line-height: 30px;

  //   .outbound-uploader-delete {
  //     float: right;
  //     transform: translateY(0px);
  //   }
  // }

  .li-status {
    position: absolute;
    right: 15px;
    top: 15px;
    span {
      font-size: 12px;
      width: inherit !important;
      padding: 2px 6px;
      line-height: 16px;
    }

    & :nth-child(1) {
      min-width: initial;
    }

    & :nth-child(2) {
      width: initial;
    }
  }
}
.outbound-field-uploader{
  ::v-deep li{
    display: block;
  }
  ::v-deep .file-info{
    width: auto !important;
  }
}
</style>