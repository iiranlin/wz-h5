<template>
    <div class="default-container" ref="container" :style="{ paddingBottom: params.status === 1 ? '0' : '1.3rem' }">
        <div class="detail-base-info">
            <div class="detail-title-content">
                <img src="/static/icon-xqjh.png">
                <span>发货单号：</span>
                <span>{{ params.shipmentBatchNumber }}</span>
            </div>
            <div>
                <ul class="detail-ul">
                    <li>
                        <span>发货时间：</span>
                        <span>{{ formattedCreateDate(params.shippingDate) }}</span>
                    </li>
                    <li>
                        <span>操作人：</span>
                        <span>{{ params.sectionName }}</span>
                    </li>
                    <li>
                        <span>操作时间：</span>
                        <span>{{ formatTimestamp(params.createDate) }}</span>
                    </li>
                    <li>
                        <span>提报时间：</span>
                        <span>{{ formattedCreateDate(params.backDate) }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="tabs">
            <van-tabs v-model="menuActiveIndex" color="#0571ff" background="#eef6ff" title-active-color="#0571ff"
                @change="tabsChange" title-inactive-color="#2e2e2e">
                <van-tab title="发货基本信息" name="发货基本信息">
                    <van-list>
                        <div class="box-container">
                            <div class="detail-list-title-content">
                                    <span class="font-weight">供应需求名称：</span>
                                    <span class="font-weight" >{{ params.planName }}</span>
                                </div>
                            <ul class="list-ul">
                                 
                                <!-- <li>
                                        <span class="font-weight dot-before" style="min-width: 2.5rem;">供应需求名称:</span>
                                        <span class="font-weight" style="text-align: left;">{{ params.planName }}</span>
                                    </li> -->
                                <!-- <li>
                                    <span style="width: 250px;">供应需求名称:</span>
                                    <span>{{ params.planName }}</span>
                                </li> -->
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
                                    <span v-if="params.shippingDate">{{ formattedCreateDate(params.shippingDate)
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
                                 <file-download-view class="outbound-field-uploader" style="width: 100%;" title="发货单：" :fileList="filterList(params.fileByList, 'fhd') || []"/>
                            </ul>
                        </div>
                    </van-list>
                </van-tab>
                <van-tab title="发货物资明细" name="发货物资明细">
                    <div
                        v-if="params.materialCirculationDetailsTableDTOS && params.materialCirculationDetailsTableDTOS.length > 0">
                        <van-list>
                            <div class="box-container"
                               v-for="(item, index) in params.materialCirculationDetailsTableDTOS" :key="index">
                               <div class="detail-list-title-content">
                                    <span class="font-weight">物资名称：</span>
                                    <span class="font-weight">{{ item.materialName }}</span>
                                </div>
                                <ul class="detail-list-ul"  >
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
                                        <span>{{formattedCreateDate(item.updateDate) }}</span>
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
                                 
                                    <file-download-view class="outbound-field-uploader" style="width: 100% !important;" title="合格证附件：" :fileList="filterList(item.fileByList, 'hgz') || []"/>
                                    <file-download-view class="outbound-field-uploader" style="width: 100% !important;" title="厂检报告附件：" :fileList="filterList(item.fileByList, 'cjbg') || []"/>
                                
                                    <!-- <li>
                                        <span>合格证附件:</span>
                                        <span style="color:#1989fa;"
                                            v-if="item.fileByList && item.fileByList.hgz && item.fileByList.hgz.length > 0"
                                            @click="imgClick(item.fileByList.hgz[0].fileName, item.fileByList.hgz[0].filePath)">{{
                                            item.fileByList.hgz[0].fileName }}</span>
                                    </li>
                                    <li>
                                        <span style="min-width: 3rem;">厂检报告附件:</span>
                                        <span style="color:#1989fa;"
                                            v-if="item.fileByList && item.fileByList.cjbg && item.fileByList.cjbg.length > 0"
                                            @click="imgClick(item.fileByList.cjbg[0].fileName, item.fileByList.cjbg[0].filePath)">{{
                                            item.fileByList.cjbg[0].fileName }}</span>
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
        <div class="default-button-container" v-if="params.status == 1">
            <van-button size="mini" type="info" round class="button-info"
                @click="handleSendGoodsClick(params.id)">确认发货</van-button>
        </div>
        <file-preview ref="filePreview"></file-preview>
    </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import { detailBySend,snedGoodsSure } from '@/api/demand/sendGoods'
import FilePreview from "@/components/FilePreview.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";
import indexMixin from '@/view/mixins'
import Vue from 'vue';
import { Dialog } from 'vant';
Vue.use(Dialog);
export default {
    name: 'MyToDoList',
    mixins: [keepPages,indexMixin],
    components: { FilePreview,FileDownloadView},
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

                    this.params.materialCirculationDetailsTableDTOS = res.data.materialCirculationDetailsTableDTOS.map((item) => ({
                        ...item,
                        // fileByList: JSON.parse(item.fileByList)
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
           //确定已经发货
    handleSendGoodsClick(id) {
      Dialog.confirm({
        title: '',
        message: '确定已经发货？',
        confirmButtonColor: '#1989fa'
      })
        .then(() => {
          let params = {
            id: id,
            status: 2
          }
          snedGoodsSure(params).then((res) => {
            if (res.code == 0) {
              Toast.success(res.data);
              this.$router.push({path:'/Information'})
            //   window.history.back()
            //   this.params.pageNum = 1
            //   this.allRefreshLoading = true
            //   this.getList()
            }
          })
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
      // this.$router.push({path:'/sendGoods'})
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
.dot-before::before {
  content: "•";          /* 圆点符号 */
  color: #1890ff;        /* 蓝色（可自定义） */
  margin-right: 5px;     /* 与文字的间距 */
  font-size: 1.2em;      /* 可选：调整圆点大小 */
}
</style>