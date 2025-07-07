<template>
    <div class="default-container" ref="container" style="padding-bottom: 120px;">
        <ul class="list-ul" style="margin: 10px;">
            <li>
                <span>发货单号：</span>
                <span>{{ params.shipmentBatchNumber }}</span>
            </li>

            <li>
                <span>货运状态：</span>
                <span v-if="params.status == 1">未发货</span>
                <span v-if="params.status == 2">货运中</span>
                <span v-if="params.status == 3">已完成</span>
            </li>


            <!-- <van-tag type="primary" round size="medium" v-if="item.status == 1">未发货</van-tag>
                    <van-tag type="primary" round size="medium" v-if="item.status == 2">货运中</van-tag>
                    <van-tag type="primary" round size="medium" v-if="item.status == 3" class="li-status-completed">已完成</van-tag> -->
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
            <li class="li-item-both">
                <div class="li-item-left">
                    <span style="width: 150px;">退货环节:</span>
                    <span style="color:red;" v-if="params.backNode == 2">收货不通过</span>
                    <span v-else>收货通过</span>
                </div>
                <div class="li-item-right">
                    <span>退货时间:</span>
                    <span>{{ formattedCreateDate(params.backDate) }}</span>
                </div>
            </li>
        </ul>
        <div class="tabs">
            <van-tabs v-model="menuActiveIndex" color="#0571ff" background="#eef6ff" title-active-color="#0571ff"
                @change="tabsChange" title-inactive-color="#2e2e2e">
                <van-tab title="发货基本信息" name="发货基本信息">
                    <van-list>
                        <div class="box-container">
                            <ul class="list-ul">
                                <li>
                                    <span style="width: 250px;">供应需求名称:</span>
                                    <span>{{ params.planName }}</span>
                                </li>
                                <li>
                                    <span>需求项目：</span>
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
                                 <file-upload-view title="发货单附件" :fileList="fileList" businessType="01"/>
                                <!-- <li style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="min-width: 210px;">发货单附件:</span>
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                       
                                         <div v-if="fileList ==''">
                                             <span v-if="params.fileByList" style="color: #1989fa;">
                                                {{ params.fileByList.fhd[0].fileName }}
                                            </span>
                                         </div>
                                        <div v-else>
                                             <span style="color: #1989fa;">
                                                {{ fileList }}
                                            </span>
                                         </div>

                                        
                                        <van-uploader ref="uploaderRef" :after-read="beforeReadUpload"
                                            :preview-image="false" style="display: none;" />
                                        <van-button type="info" size="mini" round style="min-width: 70px;"
                                            @click="$refs.uploaderRef.chooseFile()">
                                            上传文件
                                        </van-button>
                                    </div>
                                </li> -->
                                <li>
                                    <span>发货时间:</span>
                                    <span v-if="params.shippingDate">{{ formattedCreateDate(params.shippingDate)
                                    }}</span>
                                </li>
                                <li>
                                    <span style="min-width: 230px;">预计到达时间:</span>
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
                        </div>
                    </van-list>
                </van-tab>
                <van-tab title="发货物资明细" name="发货物资明细">
                    <div
                        v-if="params.materialCirculationDetailsTableDTOS && params.materialCirculationDetailsTableDTOS.length > 0">
                        <van-list>
                            <div class="box-container"
                                v-for="(item, index) in materialCirculationDetailsTableDTOS" :key="index">
                                <ul class="list-ul">
                                    <!-- <li>
                                        <span class="font-weight" style="width: 250px;">需求组织名称:</span>
                                        <span class="font-weight">{{ item.materialName }}</span>
                                    </li> -->
                                    <li>
                                        <span class="font-weight">物资名称:</span>
                                        <span class="font-weight">{{ item.materialName }}</span>
                                    </li>
                                    <li>
                                        <span>规格型号:</span>
                                        <span>{{ item.specModel }}</span>
                                    </li>
                                    <li class="li-item-both">
                                        <div class="li-item-left">
                                            <span>计量单位:</span>
                                            <span>{{ item.unit }}</span>
                                        </div>
                                        <div class="li-item-right">
                                            <span>发货数量:</span>
                                            <span>{{ item.sendTotal }}</span>
                                        </div>
                                    </li>
                                    <li class="li-item-both">
                                        <div class="li-item-left">
                                            <span style="width: 300px;">本次计划数量:</span>
                                            <span>{{ item.planAmount }}</span>
                                        </div>
                                        <div class="li-item-right">
                                            <span>包装形式:</span>
                                            <span>{{ item.packagingFm }}</span>
                                        </div>
                                    </li>
                                    <li class="li-item-both">
                                        <div class="li-item-left">
                                            <span>生产日期:</span>
                                            <span v-if="item.createDate">{{ formattedCreateDate(item.createDate)
                                                }}</span>
                                        </div>
                                        <div class="li-item-right"
                                            style="display: flex;justify-content: space-between;">
                                            <span>有效期截止日期：</span>
                                            <span v-if="item.updateDate" style="margin-left: 60px;">{{
                                                formattedCreateDate(item.updateDate) }}</span>
                                        </div>
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
                                        <span style="width: 360px;">收货人及联系方式:</span>
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
                                    <li>
                                        <span>备注:</span>
                                        <span>{{ item.remark }}</span>
                                    </li>
                                    <li>
                                        <span style="min-width: 200px;">合格证附件:</span>
                                        <span style="color:#1989fa;" v-if="item.fileByList"
                                            @click="imgClick(item.fileByList.hgz[0].fileName, item.fileByList.hgz[0].filePath)">{{
                                            item.fileByList.hgz[0].fileName }}</span>
                                    </li>
                                    <li>
                                        <span style="min-width: 250px;">厂检报告附件:</span>
                                        <span style="color:#1989fa;" v-if="item.fileByList"
                                            @click="imgClick(item.fileByList.cjbg[0].fileName, item.fileByList.cjbg[0].filePath)">{{
                                            item.fileByList.cjbg[0].fileName }}</span>
                                    </li>
                                    <!-- <li class="li-item-both">
                                        <div class="li-item-left">
                                            <span style="min-width: 200px;"> 合格证附件:</span>
                                            <span style="color:#1989fa;" v-if="item.fileByList" @click="imgClick(item.fileByList.hgz[0].fileName,item.fileByList.hgz[0].filePath)">{{ item.fileByList.hgz[0].fileName }}</span>
                                        </div>
                                        <div class="li-item-right">
                                            <span  style="width: 250px;padding-right: 20px;">厂检报告附件:</span>
                                            <span style="color:#1989fa;" v-if="item.fileByList" @click="imgClick(item.fileByList.cjbg[0].fileName,item.fileByList.cjbg[0].filePath)">{{ item.fileByList.cjbg[0].fileName }}</span>
                                        </div>
                                    </li> -->
                                </ul>
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
    </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import { detailBySend } from '@/api/demand/sendGoods'
import { minioUpload } from '@/api/blcd-base/minio'
import FilePreview from "@/components/FilePreview.vue";
import { modifySendGoods } from '@/api/demand/sendGoods'
import FileUploadView from "@/components/FileUploadViewType.vue";
import Vue from 'vue';
import { Uploader } from 'vant';
import { Toast } from 'vant';
Vue.use(Uploader,Toast);
export default {
    name: 'MyToDoList',
    mixins: [keepPages],
    components: { FilePreview,FileUploadView },
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
                        fileByList: JSON.parse(item.fileByList)
                    }))
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
                    let fileByList = JSON.stringify({ fhd });
                    
                    let params = {
                        // ...this.params,
                        arrivalDate:this.params.arrivalDate,
                        carNumber: this.params.carNumber,
                        contacts: this.params.contacts,
                        contactsPhone: this.params.contactsPhone,
                        fileList: fileList,
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
// .box-container{
//     width: 100%;
//     height: calc(100vh - 60px);
//     overflow: scroll;
// }
// ::v-deep .van-tabs__content {
//     height: calc(100vh - 162px);
//     overflow-y: scroll;
// }

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
</style>