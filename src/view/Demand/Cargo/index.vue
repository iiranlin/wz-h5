<template>
    <div class="default-container" ref="container">
        <div class="detail-base-info">
            <div class="detail-title-content">
                <img src="/static/icon-xqjh.png">
                <span>需求名称：</span>
                <span>{{ params.planName }}</span>
            </div>
            <div>
                <ul class="detail-ul">
                    <li>
                        <span>标段项目名称：</span>
                        <span>{{ params.sectionName }}</span>
                    </li>
                    <li>
                        <span>需求编号：</span>
                        <span>{{ params.planNumber }}</span>
                    </li>
                    <li>
                        <span>填报组织：</span>
                        <span>{{ params.deptName }}</span>
                    </li>
                    <li>
                        <span>填报人：</span>
                        <span>{{ params.createUserName }}</span>
                    </li>
                    <li>
                        <span>填报时间：</span>
                        <span v-if="params.createDate">{{ formattedCreateDate(params.createDate) }}</span>
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
            <van-tabs v-model="menuActiveIndex" color="#0571ff" background="#eef6ff" title-active-color="#0571ff"
                @change="tabsChange" title-inactive-color="#2e2e2e">
                <van-tab title="物流信息" name="物流信息">
                    <van-list>
                        <div class="box-container">
                            <ul class="detail-list-ul">
                                <li style="display: flex;justify-content:flex-start;">
                                    <span class="font-weight dot-before">发货单号：</span>
                                    <span class="font-weight">{{ logistics.shipmentBatchNumber }}</span>
                                </li>
                                <li>
                                    <span>物流单号：</span>
                                    <span class="text">{{ logistics.oddNumbers }}</span>
                                </li>
                                <li>
                                    <span>发货时间：</span>
                                    <span v-if="logistics.shippingDate">{{ formattedCreateDate(logistics.shippingDate)
                                        }}</span>
                                </li>
                                <li>
                                    <span>发货地址：</span>
                                    <span>{{ logistics.shippingAddress }}</span>
                                </li>
                                <li>
                                    <span>预计到达时间为：</span>
                                    <span v-if="logistics.arrivalDate">{{ formattedCreateDate(logistics.arrivalDate)
                                        }}</span>
                                </li>
                                <li>
                                    <span>车牌号：</span>
                                    <span>{{ logistics.carNumber }}</span>
                                </li>
                                <li>
                                    <span>联系人：</span>
                                    <span>{{ logistics.contacts }}</span>
                                </li>
                                <li>
                                    <span>联系电话：</span>
                                    <span>{{ logistics.contactsPhone }}</span>
                                </li>
                            </ul>
                            <div v-if="!logistics.oddNumbers">
                                <div class="tab-div">
                                    <van-row class="th-row">
                                        <van-col>操作人</van-col>
                                        <van-col>货运位置</van-col>
                                        <van-col>填写时间</van-col>
                                    </van-row>
                                    <van-row class="th-rows" v-for="item in logistics.materialTrackMessageDTOS"
                                        :key="item.id">
                                        <van-col>{{ item.createUserName }}</van-col>
                                        <van-col>{{ item.positionInformation }}</van-col>
                                        <van-col>{{ formattedCreateDate(item.createDate) }}</van-col>
                                    </van-row>
                                </div>
                                <!-- <van-list @load="onLoad">
                        <ul class="list-ul" v-for="(item, index) in logistics.materialTrackMessageDTOS" :key="index"
                            style="margin: 20px 15px 0 15px;">
                            <li>
                                <span class="font-weight">操作人:</span>
                                <span class="font-weight">{{ item.createUserName }}</span>
                            </li>
                            <li>
                                <span>货运位置: </span>
                                <span>{{ item.positionInformation }}</span>
                            </li>
                            <li>
                                <span>填写时间: </span>
                                <span>{{ formattedCreateDate(item.createDate) }}</span>
                            </li>
                        </ul>
                    </van-list> -->
                            </div>
                            <div v-else>
                                <div class="Logistics-Information-dt">
                                    <wuliu :courierNumber="logistics.oddNumbers" @expressDataFun="cargoList" />
                                </div>
                                <van-steps direction="vertical" active-color="#0086ff" :active="0">
                                    <van-step v-for="(item, index) in cargoList" :key="index">
                                        <div>
                                            <p>{{ item.positionInformation }}</p>
                                            <p class="Logistics-Information-text">{{ item.createUserName }}</p>
                                        </div>
                                        <div class="Logistics-Information-text">{{ formattedCreateDate(item.createDate)
                                            }}</div>
                                    </van-step>
                                </van-steps>
                            </div>
                        </div>
                    </van-list>
                </van-tab>
                <van-tab title="发货物资明细" name="发货物资明细">
                    <div
                        v-if="logistics.materialCirculationDetailsTableDTOS && logistics.materialCirculationDetailsTableDTOS.length > 0">
                        <van-list>
                            <div class="box-container">
                                <ul class="detail-list-ul"
                                    v-for="(item, index) in logistics.materialCirculationDetailsTableDTOS" :key="index">
                                    <!-- <li>
                                        <span class="font-weight" style="width: 250px;">需求组织名称:</span>
                                        <span class="font-weight">{{ item.materialName }}</span>
                                    </li> -->
                                    <li class="save-materials-li" style="display: flex;justify-content:flex-start;">
                                        <span class="font-weight dot-before">物资名称:</span>
                                        <span class="font-weight">{{ item.materialName }}</span>
                                    </li>
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
                                        <span>{{ item.sendTotal }}</span>
                                    </li>
                                    <li>
                                        <span style="min-width: 3rem;">本次计划数量:</span>
                                        <span>{{ item.planAmount }}</span>
                                    </li>
                                    <li>
                                        <span>包装形式:</span>
                                        <span>{{ item.packagingFm }}</span>
                                    </li>
                                    <li>
                                        <span>生产日期:</span>
                                        <span v-if="item.createDate">{{ formattedCreateDate(item.createDate)
                                        }}</span>
                                    </li>
                                    <li>
                                        <span style="min-width: 3rem;">有效期截止日期:</span>
                                        <span>{{ formattedCreateDate(item.updateDate) }}</span>
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
                                    <li>
                                        <span>备注:</span>
                                        <span>{{ item.remark }}</span>
                                    </li>
                                    <li>
                                        <file-download-view class="outbound-field-uploader" style="width: 100% !important;" title="合格证附件：" :fileList="filterList(item.fileByList, 'hgz') || []"/>
                                        <!-- <span>合格证附件:</span>
                                        <span style="color:#1989fa;"
                                            v-if="item.fileByList && item.fileByList.hgz && item.fileByList.hgz.length > 0"
                                            @click="imgClick(item.fileByList.hgz[0].fileName, item.fileByList.hgz[0].filePath)">{{
                                                item.fileByList.hgz[0].fileName }}</span> -->
                                    </li>
                                    <li>
                                        <file-download-view class="outbound-field-uploader" style="width: 100% !important;" title="厂检报告附件：" :fileList="filterList(item.fileByList, 'cjbg') || []"/>
                                        <!-- <span style="min-width: 3rem;">厂检报告附件:</span>
                                        <span style="color:#1989fa;"
                                            v-if="item.fileByList && item.fileByList.cjbg && item.fileByList.cjbg.length > 0"
                                            @click="imgClick(item.fileByList.cjbg[0].fileName, item.fileByList.cjbg[0].filePath)">{{
                                                item.fileByList.cjbg[0].fileName }}</span> -->
                                    </li>
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
        <file-preview ref="filePreview"></file-preview>
    </div>
</template>
<script>
import Vue from 'vue';
import { Sidebar, SidebarItem } from 'vant';
import { Tab, Tabs } from 'vant';
import { Step, Steps } from 'vant';
import { lookGoodsDetails, shippingOrderNumber } from '@/api/demand/returnGoods'
import { addList } from '@/api/demand/sendGoods'
import wuliu from '@/components/wuliu'
import FilePreview from "@/components/FilePreview.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";
import indexMixin from '@/view/mixins'
Vue.use(Step);
Vue.use(Steps);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Sidebar);
Vue.use(SidebarItem);
export default {
    name: 'MyProcess',
     mixins: [indexMixin],
    components: { wuliu, FilePreview,FileDownloadView },
    data() {
        return {
            menuActiveIndex: 0,
            active: 2,
            activeKey: 0,
            username: '',
            password: '',
            value: '',
            showCalendar: false,
            showAction: false,
            loading: false,
            finished: false,
            result: [],
            list: [],
            params: {},
            logistics: {},
            cargoList: [],
            expressData: {},
            listPageQuery: {
                pageName: 1,
                pageSize: 10

            }
            // logisticsNumber:""
        };
    },
    created() {
        this.wuLiuId = this.$route.query.id
        this.wuLiuNumber = this.$route.query.number
        //  this.logisticsNumber = this.$route.query.logisticsNumber //物流单号
        this.getDetails();
    },
    methods: {
        getDetails() {
            //需求信息
            lookGoodsDetails(this.wuLiuId).then((res) => {
                if (res.code == 0) {
                    this.params = res.data
                    // this.params.fileByList = JSON.parse(res.data.fileByList)
                    // this.params.materialCirculationDetailsTableDTOS = res.data.materialCirculationDetailsTableDTOS.map((item)=>({
                    //     ...item,
                    //     fileByList:JSON.parse(item.fileByList) 
                    // }))
                }
            })
            //物流信息
            shippingOrderNumber(this.wuLiuNumber).then((res) => {
                if (res.code == 0) {
                    this.logistics = res.data
                    this.logistics.materialCirculationDetailsTableDTOS = res.data.materialCirculationDetailsTableDTOS.map((item) => ({
                        ...item,
                        // fileByList: JSON.parse(item.fileByList)
                    }))
                }
            })
            let params = {
                // pageName:this.listPageQuery.pageName,
                // pageSize:this.listPageQuery.pageSize,
                shipmentBatchNumber: this.wuLiuNumber
            }
            //有单号就显示位置列表
            addList(params).then((res) => {
                if (res.code == 0) {
                    this.cargoList = res.data.list
                }
            })

            //  detailBySend(this.wuLiuId).then((res) => {
            //     if (res.code == 0) {
            //         this.params = res.data
            //         this.params.fileByList = JSON.parse(res.data.fileByList)
            //         this.params.materialCirculationDetailsTableDTOS = res.data.materialCirculationDetailsTableDTOS.map((item)=>({
            //             ...item,
            //             fileByList:JSON.parse(item.fileByList) 
            //         }))
            //     }
            // })
        },
        onSubmit(values) {

        },
        onConfirm(date) {
            this.value = `${date.getMonth() + 1}/${date.getDate()}`;
            this.showCalendar = false;
        },
        chooseGoods() {
            this.$router.push({ path: '/selectGoods' })
        },
        lookGoods() {

        },
        tabsChange() {

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
        onLoad() {
            // 异步更新数据
            setTimeout(() => {
                for (let i = 0; i < 10; i++) {
                    this.list.push(this.list.length + 1);
                }
                // 加载状态结束
                this.loading = false;

                // 数据全部加载完成
                if (this.list.length >= 40) {
                    this.finished = true;
                }
            }, 500);
        },
        formattedCreateDate(timestamp) {
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
            const day = date.getDate().toString().padStart(2, '0'); // 日期加0
            return `${year}-${month}-${day}`;
        },
        expressDataFun(expressData) {
            this.expressData = expressData
        },
        imgClick(fileName, filePath) {
            this.$refs.filePreview.init(fileName, filePath)
        },
    },
};
</script>
<style lang="less" scoped>
.Logistics-Information-dt {
    width: 100%;

    img {
        width: 100%;
    }
}

.default-container {
    padding-top: 10px;
}

li :nth-child(1) {
    min-width: 60px
}

li :nth-child(2) {
    width: initial;
}

.li-item-both {
    .li-item-right {
        flex: initial;
    }
}

.list-ul {
    background: #fff;
    // margin: 0 10px;
    border-radius: 15px;
    padding: 10px;
}

.title {
    margin: 10px;
    font-size: 14px;
}

.sidebar {
    display: flex;
    justify-content: space-between;

    .sidebar-left {
        width: 20%;
        padding: 5px;
        background-color: #fff;
        // height: 0 auto;
        border-radius: 2px solid #f5f5f5;
    }

    .content {
        flex: 1;
        background-color: #fff;
        border-radius: 6px;
        margin-left: 10px;
    }
}

/deep/.van-sidebar-item__text {
    width: 200px !important;
}

.tab-div {
    border: 1px solid #e9e9e9;
    border-bottom: 0;
    border-right: 0;

    .th-row,
    .th-rows {
        display: flex;
        justify-content: space-between;
        background: #f1f8ff;
        border-bottom: 1px solid #e9e9e9;

        .van-col {
            line-height: 40px;
            width: 90px;
            padding: 0 10px;
            border-right: 1px solid #e9e9e9;
            font-size: 12px;

            &:nth-child(1) {
                width: 60px;
            }
        }
    }

    .th-rows {
        background: #fff;
    }
}

.dot-before::before {
    content: "•";
    /* 圆点符号 */
    color: #1890ff;
    /* 蓝色（可自定义） */
    margin-right: 5px;
    /* 与文字的间距 */
    font-size: 1.2em;
    /* 可选：调整圆点大小 */
}
</style>