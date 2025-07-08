<template>
    <div class="default-container" ref="container">
        <div class="detail-base-info">
            <div class="detail-title-content">
                <img src="/static/icon-xqjh.png">
                <span>供应需求：</span>
                <span>{{ params.planName }}</span>
            </div>
            <div>
                <ul class="detail-list-ul">
                    <li>
                        <span>需求项目：</span>
                        <span>{{ params.sectionName }}</span>
                    </li>
                    <li>
                        <span>需求组织：</span>
                        <span>{{ params.deptName }}</span>
                    </li>
                    <li>
                        <span>发货单号：</span>
                        <span>{{ params.shipmentBatchNumber }}</span>
                    </li>
                    <li>
                        <span>使用地点：</span>
                        <span>{{ params.addr }}</span>
                    </li>
                    <li>
                        <span>退货环节：</span>
                        <span style="color:red;" v-if="params.backNode == 2">质检不通过</span>
                        <span style="color:red;" v-else>收货不通过</span>
                    </li>
                    <li>
                        <span>退货时间：</span>
                        <span>{{ formattedCreateDate(params.backDate) }}</span>
                    </li>
                </ul>
            </div>
        </div>

       <div class="detail-floor-content">
      <img src="/static/icon-return.png"/>
      <span>退货明细</span>
    </div>
        <van-list>
            <div class="box-container" v-for="(item, index) in params.materialCirculationDetailsTableDTOS"
                    :key="index">
                     <div class="detail-list-title-content">
                        <span class="font-weight">物资名称：</span>
                        <span class="font-weight">{{ item.materialName }}</span>
                    </div>
                <ul class="detail-list-ul" >
                   
                    <li style="color: rgb(224,70,70);">
                        <span>退货数量:</span>
                        <span>{{ item.refundTotal }}</span>
                    </li>
                    <li>
                        <span>规格型号: </span>
                        <span>{{ item.specModel }}</span>
                    </li>
                    <li>
                        <span>计量单位: </span>
                        <span>{{ item.unit }}</span>
                    </li>
                    <li>
                        <span>发货数量:</span>
                        <span>{{ item.sendTotal }}</span>
                    </li>
                        
                </ul>
                 <file-download-view class="outbound-field-uploader"  style="width: 100%;" title="退货附件：" :fileList="filterList(item.fileByList, 'thfj_sh') || []"/>
            </div>
        </van-list>
         <div class="detail-floor-content">
      <img src="/static/icon-return.png"/>
      <span>初验信息</span>
    </div>
        <div class="tabs">
            <van-list>
                <div class="box-container">
                   <file-download-view class="outbound-field-uploader" title="自检单：" :fileList="filterList(params.fileByList, 'zjd') || []"/>
                        <file-download-view class="outbound-field-uploader" title="其他资料：" :fileList="filterList(params.fileByList, 'qtzl') || []"/>
                </div>
            </van-list>
        </div>
        <file-preview ref="filePreview"></file-preview>
    </div>
</template>
<script>
import Vue from 'vue';
import { Form } from 'vant';
import { Field } from 'vant';
import { Toast } from 'vant';
import { returnGoodsDetails } from '@/api/demand/returnGoods'
import indexMixin from '@/view/mixins'
import FilePreview from "@/components/FilePreview.vue";
import FileUploadView from "@/components/FileUploadView.vue";
import FileDownloadView from "@/components/FileDownloadView.vue";
Vue.use(Toast);
Vue.use(Form);
Vue.use(Field);
export default {
    name: 'MyProcess',
      mixins: [indexMixin],
    components: { FilePreview, FileDownloadView,FileUploadView },
    data() {
        return {
            username: '',
            password: '',
            value: '',
            showCalendar: false,
            showAction: false,
            loading: false,
            finished: false,
            result: [],
            list: [],
            orderId: '',
            params: {},
            fileTHList:[],
        };
    },
    created() {
        this.orderId = this.$route.query.id
        this.getGoodsOrderDetails();
    },
    methods: {
        // 时间戳转换成日期格式
        formattedCreateDate(timestamp) {
            if (!timestamp) return ''; // 处理空值
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
            const day = date.getDate().toString().padStart(2, '0'); // 日期加0
            return `${year}-${month}-${day}`;
        },
        getGoodsOrderDetails() {
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
            });
            returnGoodsDetails(this.orderId).then((res) => {
                if (res.code == 0) {
                    Toast.clear()
                    this.params = {
                        ...res.data, // 展开原有属性
                        fileByList: res.data.fileByList
                    };
                }

            })
        },
        onSubmit(values) {

        },
        imgClick(fileName, filePath) {
            this.$refs.filePreview.init(fileName, filePath)
        },
    },
};
</script>
<style lang="less" scoped>
.detail-title {
  font-weight: bold;
  margin: 0.2rem;
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