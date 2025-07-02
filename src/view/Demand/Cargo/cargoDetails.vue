<template>
    <div ref="container">
        <div class="tabs">
            <van-tabs v-model="menuActiveIndex" color="#0571ff" background="#eef6ff" title-active-color="#0571ff"
                @change="tabsChange" title-inactive-color="#2e2e2e">
                <van-tab title="发货基本信息" name="发货基本信息">
                    <div class="tabs"></div>
                      <van-list v-model="allLoading" :finished="allFinished"
                            @load="getAllList">

                            <div class="box-container">
                                <ul class="list-ul">
                                    <li>
                                        <span style="width: 220px;">供应需求名称:</span>
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
                                        <span style="min-width: 180px;">发货单附件:</span>
                                        <span style="color:#1989fa;">
                                            <template>
                                                 <span style="color:#1989fa;" v-if="params.fileByList" @click="imgClick(params.fileByList.fhd[0].fileName,params.fileByList.fhd[0].filePath)">{{ params.fileByList.fhd[0].fileName }}</span>
                                            </template>
                                        </span>
                                    </li>
                                    <li>
                                        <span>发货时间:</span>
                                        <span v-if="params.shippingDate">{{ formattedCreateDate(params.shippingDate)
                                            }}</span>
                                    </li>
                                    <li>
                                        <span style="min-width: 230px;">预计到达时间:</span>
                                        <span v-if="params.arrivalDate">{{ formattedCreateDate(params.arrivalDate)
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
                                        <span>{{ formattedCreateDate(params.shippingDate) }}</span>
                                    </li>
                                    <li>
                                        <span>操作人: </span>
                                        <span>{{ params.createUserName }}</span>
                                    </li>
                                    <li>
                                        <span>操作时间: </span>
                                        <span>{{ formatTimestamp(params.createDate) }}</span>
                                    </li>
                                </ul>
                            </div>
                        </van-list>
                </van-tab>
                <van-tab title="发货物资明细" name="发货物资明细">
                       <van-list v-model="allLoading" :finished="allFinished"
                            @load="getAllList">

                            <div class="box-container"
                                v-for="(item, index) in params.materialCirculationDetailsTableDTOS" :key="index">
                                <ul class="list-ul">
                                    <!-- <li>
                                        <span class="font-weight" style="width: 250px;">需求组织名称:</span>
                                        <span class="font-weight">{{ item.materialName }}</span>
                                    </li> -->
                                    <li>
                                        <span  class="font-weight">物资名称:</span>
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
                                            <span>固装</span>
                                        </div>
                                    </li>
                                    <li class="li-item-both">
                                        <div class="li-item-left">
                                            <span>生产日期:</span>
                                            <span>{{ formattedCreateDate(item.createDate) }}</span>
                                        </div>
                                        <div class="li-item-right">
                                            <span style="width: 250px;padding-right: 40px;">有效期截止日期:</span>
                                            <span>{{ formattedCreateDate(item.updateDate) }}</span>
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
                                        <span>{{ formattedCreateDate(item.supplyDate) }}</span>
                                    </li>
                                    <li>
                                        <span style="width: 335px;">收货人及联系方式:</span>
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
                                    <li class="li-item-both">
                                        <div class="li-item-left">
                                            <span style="min-width: 180px;"> 合格证附件:</span>
                                            <span style="color:#1989fa;" v-if="item.fileByList" @click="imgClick(item.fileByList.hgz[0].fileName,item.fileByList.hgz[0].filePath)">{{ item.fileByList.hgz[0].fileName }}</span>
                                        </div>
                                        <div class="li-item-right">
                                            <span  style="width: 250px;padding-right: 20px;">厂检报告附件:</span>
                                            <span style="color:#1989fa;" v-if="item.fileByList" @click="imgClick(item.fileByList.cjbg[0].fileName,item.fileByList.cjbg[0].filePath)">{{ item.fileByList.cjbg[0].fileName }}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </van-list>
                </van-tab>
            </van-tabs>
        </div>
        <file-preview ref="filePreview"></file-preview>
    </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import { detailBySend } from '@/api/demand/sendGoods'
import FilePreview from "@/components/FilePreview.vue";
export default {
    name: 'MyToDoList',
    mixins: [keepPages],
    components: { FilePreview },
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
            allRefresh: false
        };
    },
    created() {
        this.id = this.$route.query.id
        this.cargoDetails();
        // this.getOrderStatusOptions();
    },
    methods: {
        formattedCreateDate(timestamp) {
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
                    this.params.materialCirculationDetailsTableDTOS = res.data.materialCirculationDetailsTableDTOS.map((item)=>({
                        ...item,
                        fileByList:JSON.parse(item.fileByList)
                    }))
                }
            })
        },
        tabsChange(e) {
            console.log(e)
        },
        //发货
        handleSendGoodsClick() {
            this.$router.push({ path: '/sendGoods' })
        },
        //查看物流
        handleLookClick() {
            this.$router.push({ path: 'lookUp' })
        },
        //供应详情
        handleSupplyClick() {
            this.$router.push({ path: '/supplyMsg' })
        },
        //确认需求
        handleConfirmClick() {
            this.$router.push({ path: '/confirm' })
        },
        //获取全部订单
        getAllList() {
            this.allRefreshLoading = false;
            this.allFinished = true;
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
</style>