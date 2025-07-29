<template>
    <div class="default-containers" ref="container" style="padding-bottom: 1.5rem;">
        <div class="detail-base-info">
        <div class="detail-title-content">
            <img src="/static/icon-xqjh.png">
            <span>发货单号：</span>
            <span>{{params.shipmentBatchNumber}}</span>
        </div>
        <div>
            <ul class="detail-ul">
          <li>
            <span>发货时间：</span>
            <span v-if="params.shippingDate">{{ formattedCreateDate(params.shippingDate)
                }}</span>
          </li>
          <li>
                <span>操作人：</span>
                <span>{{ params.createUserName }}</span>
            </li>
          <li>
                <span>操作时间：</span>
                <span v-if="params.createDate">{{ formatTimestamp(params.createDate) }}</span>
            </li>
          <!-- <li class="li-status">
            <template v-for="row in statusArr">
              <van-tag :class="{ 'li-status-completed': row.value == '9' }"
                :type="['0', '5'].includes(row.value) ? 'danger' : 'primary'" round size="medium" :key="row.value"
                v-if="detail.planStatus == row.value">{{ row.text }}</van-tag>
            </template>
            </li> -->
            </ul>
        </div>
    </div>
        <div class="tabs">
            <van-tabs sticky  v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff"
          title-inactive-color="#2e2e2e">
                <van-tab title="发货基本信息" name="发货基本信息">
                    <van-list>
                        <div class="box-container">
                            <div class="detail-list-title-content">
                                    <span class="font-weight">供应需求名称：</span>
                                    <span class="font-weight" style="min-width: 2.5rem;">{{ params.planName }}</span>
                                </div>
                            <!-- <div>
                                    <span class="font-weight dot-before" style="min-width: 2.5rem;">供应需求名称:</span>
                                        <span class="font-weight">{{ params.planName }}</span>
                                </div> -->
                            <ul class="detail-list-ul">
                                <li>
                                  <span>建设项目：</span>
                                  <span>{{ params.projectName }}</span>
                                </li> 
                                <li>
                                    <span>标段项目：</span>
                                    <span class="text">{{ params.sectionName }}</span>
                                </li>
                                <li>
                                    <span>发货单号:</span>
                                    <span>{{ params.shipmentBatchNumber }}</span>
                                </li>
                                <li>
                                    <span>物流单号:</span>
                                    <span>{{ params.oddNumbers }}</span>
                                </li>
                                <li>
                                    <span>发货地址:</span>
                                    <span>{{ params.shippingAddress }}</span>
                                </li>
                                <li>

                                </li>
                                
                                <li>
                                    <span>发货时间:</span>
                                    <span v-if="params.shippingDate">{{ formattedCreateDate(params.shippingDate)
                                    }}</span>
                                </li>
                                <li>
                                    <span style="min-width: 3rem;">预计到达时间:</span>
                                    <span v-if="params.arrivalDate">{{params.arrivalDate
                                    }}</span>
                                </li>
                                <li>
                                    <span>车牌号:</span>
                                    <span>{{ params.carNumber }}</span>
                                </li>
                                <li>
                                    <span>联系人:</span>
                                    <span>{{ params.contacts }}</span>
                                </li>
                                <li>
                                    <span>联系电话:</span>
                                    <span>{{ params.contactsPhone }}</span>
                                </li>
                                <li>
                                    <span>发货时间: </span>
                                    <span v-if="params.shippingDate">{{ params.shippingDate
                                        }}</span>
                                </li>
                                <li>
                                    <span>操作人: </span>
                                    <span>{{ params.createUserName }}</span>
                                </li>
                                <li>
                                    <span>操作时间: </span>
                                    <span v-if="params.createDate">{{ formatTimestamp(params.createDate) }}</span>
                                </li>
                                
                            </ul>
                            <div style="padding: 0 20px;">
                                 <file-upload-view style="padding-right: 0.5rem;margin-left: 0px;"  title="发货单附件" :fileList="fileList" businessType="01"/>
                            </div>
                            <div style="padding: 0 20px;">
                                 <file-upload-view style="padding-right: 0.5rem;margin-left: 0px;"  title="装车照片" :fileList="zczp" businessType="01" :required="false" accept=".jpg" :maxCount="100"/>
                            </div>
                        </div>
                    </van-list>
                </van-tab>
                <van-tab title="发货物资明细" name="发货物资明细">
                    <div
                        v-if="params.materialCirculationDetailsTableDTOS && params.materialCirculationDetailsTableDTOS.length > 0">
                        <van-list>
                            <div class="box-container"
                               v-for="(item, index) in materialCirculationDetailsTableDTOS" :key="index" >
                                <div class="detail-list-title-content">
                                    <span class="font-weight">物资名称：</span>
                                    <span class="font-weight" style="min-width: 1rem;">{{ item.materialName }}</span>
                                </div>
                                <ul class="detail-list-ul" >
                                   
                                   <!-- <li class="save-materials-li">
                                        <span class="font-weight dot-before">物资名称:</span>
                                        <span class="font-weight">{{ item.materialName }}</span>
                                    </li> -->
                                    <li>
                                        <span>规格型号:</span>
                                        <span>{{ item.specModel }}</span>
                                    </li>
                                     <li>
                                        <span>计量单位:</span>
                                        <span>{{ item.unit }}</span>
                                    </li>
                                     <li>
                                        <span>发货数量:</span>
                                        <span class="li-span-click">{{ item.sendTotal }}</span>
                                    </li>
                                    <li>
                                        <span style="min-width: 3rem;">本次计划数量:</span>
                                        <span class="li-span-click">{{ item.planAmount }}</span>
                                    </li>
                                    <li>
                                        <span>包装形式:</span>
                                        <span>{{ item.packagingFm }}</span>
                                    </li>
                                    <li>
                                        <span>生产日期:</span>
                                        <span v-if="item.createDate">{{ formattedCreateDate(item.manufactureDate)
                                                }}</span>
                                    </li>
                                    <li>
                                        <span style="min-width: 3rem;">有效期截止日期:</span>
                                        <span>{{formattedCreateDate(item.expirationDate) }}</span>
                                    </li>
                                    <li>
                                        <span>收货地址:</span>
                                        <span>{{ item.field2 }}</span>
                                    </li>
                                    <li>
                                        <span>使用地点:</span>
                                        <span>{{ item.addr }}</span>
                                    </li>
                                    <li>
                                        <span>供应时间:</span>
                                        <span v-if="item.supplyDate">{{ formattedCreateDate(item.supplyDate) }}</span>
                                    </li>
                                    <li>
                                        <span style="min-width: 3rem;">收货人及联系方式:</span>
                                        <span>{{ item.receiver }}</span>
                                    </li>
                                    <li>
                                        <span>投资方:</span>
                                        <span>{{ item.field0 }}</span>
                                    </li>
                                    <li>
                                        <span>投资比例:</span>
                                        <span>{{ item.field1 }}</span>
                                    </li> 
                                      <li class="li-item-remark">
                                    <span>备注：</span>
                                    <div class="remark-detail">{{item.remark || '未填写'}}</div>
                                    </li>
                                </ul>
                                  <file-download-view class="outbound-field-uploader" style="width: 100%;" title="合格证附件:" :fileList="filterList(item.fileByList, 'hgz') || []"/>
                                        <file-download-view class="outbound-field-uploader" style="width: 100%;" title="厂检报告附件:" :fileList="filterList(item.fileByList, 'cjbg') || []"/>
                            </div>
                        </van-list>
                    </div>
                    <div v-else>
                        <van-empty description="暂无数据" />
                    </div>
                </van-tab>
            </van-tabs>
        </div>
        <div class="default-button-container">
            <van-button size="mini" type="info" round class="button-info"
                @click="chooseGoods">保存附件</van-button>
            <!-- 编辑里的选择发货物资传的是planId -->
        </div>
        <file-preview ref="filePreview"></file-preview>
        <back-to-top className=".default-container"></back-to-top>
    </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import BackToTop from '@/components/BackToTop'
import { detailBySend } from '@/api/demand/sendGoods'
import { minioUpload } from '@/api/blcd-base/minio'
import FilePreview from "@/components/FilePreview.vue";
import { modifySendGoods } from '@/api/demand/sendGoods'
import FileUploadView from "@/components/FileUploadViewType.vue";
import indexMixin from '@/view/mixins'
import FileDownloadView from "@/components/FileDownloadView.vue";
import Vue from 'vue';
import { Uploader } from 'vant';
import { Toast } from 'vant';
Vue.use(Uploader,Toast);
export default {
    name: 'MyToDoList',
    mixins: [keepPages,indexMixin],
    components: { FilePreview,FileUploadView,FileDownloadView,BackToTop },
    data() {
        return {
            menuActiveIndex: 0,

            formData: {
                keywords: '',
            },
            tabList: [
                {
                    id: 1,
                    title: '需求信息'
                },
                {
                    id: 2,
                    title: '发货物明细',
                },
            ],
            id: '',
            params: {},
            allLoading: false,
            allFinished: false,
            allRefreshLoading: false,
            allRefresh: false,
            fileList: [],
            zczp: [],
            showFile: false,
            materialCirculationDetailsTableDTOS:[]
        };
    },
    created() {
        this.id = this.$route.query.id
        this.cargoDetails();
        // this.getOrderStatusOptions();
    },
    methods: {
        formattedCreateDate(timestamp) {
            if (!timestamp) return ''; // 处理空值
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
            const day = date.getDate().toString().padStart(2, '0'); // 日期加0
            return `${year}-${month}-${day}`;
        },
        cargoDetails() {
            detailBySend(this.id).then((res) => {
                if (res.code == 0) {
                    this.params = res.data
                    this.params.fileByList = JSON.parse(res.data.fileByList)
                    this.params.arrivalDate = this.formattedCreateDate(res.data.arrivalDate)
                    // this.params.createDate = this.formattedCreateDate(res.data.createDate)
                    this.params.shippingDate = this.formattedCreateDate(res.data.shippingDate)
                    this.params.createDate = this.formatTimestamp(res.data.createDate)
                    //  let file = JSON.parse(res.data.fileByList)
                    this.fileList.push({fileName:res.data.fileByList.fhd[0].fileName,filePath:res.data.fileByList.fhd[0].filePath})
                    this.materialCirculationDetailsTableDTOS = res.data.materialCirculationDetailsTableDTOS.map((item) => ({
                        ...item,
                        createDate:this.formatTimestamp(item.createDate),
                        supplyDate:this.formattedCreateDate(item.supplyDate),
                        updateDate:this.formattedCreateDate(item.updateDate),
                        // fileByList: JSON.parse(item.fileByList)
                    }))
                    // 装车照片
                    let { zczp } = res.data.fileByList || {}
                    this.zczp = zczp.map(item => ({ fileName: item.fileName, filePath: item.filePath }))
                }
            })
        },
        tabsChange() {

        },
        imgClick(fileName, filePath) {
            this.$refs.filePreview.init(fileName, filePath)
        },
        formatTimestamp(timestamp) {
            if (!timestamp) return ''; // 处理空值
            const date = new Date(timestamp); // 时间戳可以是毫秒或秒（需 * 1000）

            // 补零函数（确保个位数显示为两位，如 1 → '01'）
            const padZero = (num) => (num < 10 ? `0${num}` : num);

            const year = date.getFullYear();
            const month = padZero(date.getMonth() + 1); // 月份从 0 开始
            const day = padZero(date.getDate());
            const hours = padZero(date.getHours());
            const minutes = padZero(date.getMinutes());
            const seconds = padZero(date.getSeconds());

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
        beforeReadUpload(file) {
            let imgFile = new FormData();
            imgFile.append("businessType", '01');
            imgFile.append("key", file.file.name);
            imgFile.append("file", file.file);
            minioUpload(imgFile).then((res) => {
                if (res.code == 0) {
                    this.$notify({
                        type: 'success',
                        message: "上传成功"
                    });
                    this.params.fileList = [{
                        fileName: res.data.fileName,
                        filePath: res.data.filePath
                    }];
                    this.fileList = res.data.fileName
                    // this.params.fileByList = [{
                    //     name: res.data.fileName,
                    //     url: res.data.filePath
                    // }];
                    // this.showFile = true
                    // 只用作显示
                    // this.fileByList = this.fileList[0].name
                    // this.params = res.data
                    // this.params.fileName = res.data.fileName
                    // this.params.fileName = res.data.fileName
                }
            }).catch((err) => {
                this.$notify({
                    type: 'warning',
                    message: "上传失败"
                });
            })
        },
          chooseGoods(id, text) {
            let fileList = []
                    let fhd = [];
                    if (this.fileList.length > 0) {
                        this.fileList.forEach(item => {
                            fileList.push({ fileName: item.fileName, filePath: item.filePath })
                            fhd.push({ fileName: item.fileName, filePath: item.filePath });
                        })
                    }

                    //装车照片
                    let zczp = this.zczp.map(item => ({ fileName: item.fileName, filePath: item.filePath }))
                    let fileByList = JSON.stringify({ fhd, zczp });
                    
                    let params = {
                        // ...this.params,
                        arrivalDate:this.params.arrivalDate,
                        carNumber: this.params.carNumber,
                        contacts: this.params.contacts,
                        contactsPhone: this.params.contactsPhone,
                        fileList: fileList,
                        zczp: zczp,
                        fileByList: fileByList,
                        sectionName: this.params.sectionName,
                        planName:this.params.planName,
                        planId: this.params.planId,
                        id: this.params.id,
                        contractName: this.params.contractName,
                        oddNumbers:this.params.oddNumbers,
                        shippingAddress:this.params.shippingAddress,
                        shippingDate:this.params.shippingDate,
                        shipmentBatchNumber:this.params.shipmentBatchNumber,
                        materialCirculationDetailsTableParamList: this.params.materialCirculationDetailsTableDTOS
                    }
                      modifySendGoods(params).then((res) => {
                    if (res.code == 0) {
                        Toast.success(res.data);
                        this.$router.push({ path: "/Information" })
                    }

                    })
        },
    },
};
</script>
<style lang="less" scoped>
.box-container{
    padding: 0 0.1rem 0.1rem 0rem;;
}
.detail-list-ul{
    margin: 0 !important;
}

.van-search {

    .van-search__content {
        border-radius: 50px;
        background: #fff;
    }

    .van-cell {
        border-radius: 50px;
        background: #fff;
    }
}

.text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.list-ul-button {
    display: flex;
}

.button-info {
    width: 85px;
    font-size: 12px;
}

.list-ul {
    background: #fff;
    // margin: 0 10px;
    border-radius: 15px;
    padding: 10px;
}
.dot-before::before {
  content: "•";          /* 圆点符号 */
  color: #1890ff;        /* 蓝色（可自定义） */
  margin-right: 5px;     /* 与文字的间距 */
  font-size: 1.2em;      /* 可选：调整圆点大小 */
}
</style>