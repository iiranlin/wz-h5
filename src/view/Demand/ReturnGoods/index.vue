<template>
    <div class="default-containers" ref="container">
        <div class="detail-base-info">
            <!-- <div class="detail-title-content">
                <img src="/static/icon-xqjh.png">
                <span>需求名称：</span>
                <span>{{ params.planName }}</span>
            </div> -->

            <div class="detail-title-content-custom">
                <span class="label">需求名称：</span>
                <div class="title-bold">{{ params.planName }}</div>
            </div>


            <div style="padding-left: 50px; margin-bottom: 10px; display: flex; align-items: center;">
                <div>
                    <span style="font-size: 25px; color: #151b3e;">需求编号：</span>
                    <span style="font-size: 25px; color:#0861db;">{{ params.planNumber }}</span>
                </div>
            </div>



            <!-- <div style="padding-left: 50px; margin-bottom: 10px; display: flex; align-items: center;">
  <div>
    <span style="font-size: 25px; color: #151b3e;">需求编号：</span>
    <span style="font-size: 25px; color:#0861db;">{{ params.planNumber }}</span>
  </div>

     <div class="li-title-status">
        <img :src="checkAuditStatus(params.backNode)" />
        <span>{{ checkStatusText(params.issueType) }}</span>
    </div>

</div> -->


            <div class="detail-ul-text">
                <ul class="detail-list-ul">
                    <!-- <li>
                      <span>建设项目：</span>
                      <span>{{ params.projectName }}</span>
                    </li>  -->
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
                    <!-- <li>
                        <span>退货环节：</span>
                        <span style="color:red;" v-if="params.backNode == 2">质检不通过</span>
                        <span style="color:red;" v-else>收货不通过</span>
                    </li> -->
                    <li>
                        <span>退货时间：</span>
                        <span>{{ formattedCreateDate(params.backDate) }}</span>
                    </li>
                </ul>
            </div>


            <div>
                <ul class="detail-list-ul">

                    <li style="font-size: 26px; display: flex; justify-content: space-between; align-items: center;">
                        <span>退货物资项目：</span>
                        <span class="li-span-click">{{ params.materialCirculationDetailsTableDTOS ?
                            params.materialCirculationDetailsTableDTOS.length : 0 }}项</span>
                    </li>
                </ul>
            </div>



        </div>


        <div class="detail-floor-content">
            <img src="/static/icon-return.png" />
            <span>退货明细</span>
        </div>
        <van-list>
            <div class="box-container" v-for="(item, index) in params.materialCirculationDetailsTableDTOS" :key="index">
                <div class="detail-list-title-content">
                    <!-- <span class="font-weight">物资名称：</span> -->
                    <span class="font-weight">{{ index + 1 }}.{{ item.materialName }}</span>
                </div>

                <ul class="detail-list-ul">
                    <li>
                        <span>规格型号: </span>
                        <span>{{ item.specModel }}</span>
                    </li>

                    <li>
                        <span>发货数量:</span>
                        <!-- <span class="li-span-click">{{ item.sendTotal }} 套</span> -->
                        <span>{{ item.sendTotal }} 套</span>
                    </li>


                    <li>
                        <span>退货数量:</span>
                        <span class="li-span-click">{{ item.refundTotal }} 套</span>
                    </li>

                    <li>
                        <span>退货附件（数量）: </span>
                        <span class="li-span-click">{{ }}</span>
                    </li>
                </ul>

            <!-- <file-download-view class="outbound-field-uploader"  style="width: 100%;" title="退货附件：" :fileList="filterList(item.fileByList, 'thfj_sh') || []"/> -->
            </div>
        </van-list>
        <div class="detail-floor-content">
            <img src="/static/icon-firstcheckdata.png" />
            <span>初验信息</span>
        </div>
        <div class="tabs">
            <van-list>
                <div class="box-container">
                    <file-download-view class="outbound-field-uploader" title="自检单："
                        :fileList="filterList(params.fileByList, 'zjd') || []" />
                    <file-download-view class="outbound-field-uploader" title="其他资料："
                        :fileList="filterList(params.fileByList, 'qtzl') || []" />
                </div>
            </van-list>
        </div>
        <file-preview ref="filePreview"></file-preview>
        <back-to-top className=".default-container"></back-to-top>
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
import BackToTop from '@/components/BackToTop'
Vue.use(Toast);
Vue.use(Form);
Vue.use(Field);
export default {
    name: 'MyProcess',
    mixins: [indexMixin],
    components: { FilePreview, FileDownloadView, FileUploadView, BackToTop },
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
            fileTHList: [],


            // statusArr: [
            //     { text: '全部', value: '' },
            //     { text: '质检不通过', value: '2' },
            //     { text: '收货不通过', value: '1' }
            // ],

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

    // checkAuditStatus(status) {
    //   if (status == '0') {
    //     return '/static/icon-reject.png'
    //   } else if (['1', '2'].includes(status)) {
    //     return '/static/icon-return.png'
    //   } else {
    //     return '/static/icon-success.png'
    //   }
    // },
    //     checkStatusText(status) {
    //   let name = ''
    //   this.statusArr.forEach(item => {
    //     if (item.value === status) {
    //       name = item.text
    //     }
    //   })
    //   return name
    // },


    // }


};
</script>
<style lang="less" scoped>
.box-container {
    padding: 0px !important;
}

.detail-list-ul {
    margin: 0 !important;
}

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

.detail-title-content-custom {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
    padding-left: 20px;
}

.label {
    font-size: 13px;
    color: #3b7cff;
    line-height: 1;
}

.title-bold {
    font-size: 18px;
    font-weight: bold;
    color: #1a1a1a;
    margin-top: 4px;
    padding-left: 20px;
}



  .detail-ul-text{
    margin: 10px;
    background: #f2f2f2;
    border-radius: 5px;
    .detail-ul{
      padding: 10px 12px;
    }
  }




</style>