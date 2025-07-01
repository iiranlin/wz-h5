<template>
    <div class="default-container" ref="container">
        <ul class="list-ul" style="margin: 10px;">
            <li>
                <span>供应需求：</span>
                <span>{{ params.planName }}</span>
            </li>

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
            <li class="li-item-both">
                <div class="li-item-left">
                    <span style="width: 150px;">退货环节:</span>
                    <span style="color:red;" v-if="params.backNode==2">收货不通过</span>
                    <span v-else>收货通过</span>
                </div>
                <div class="li-item-right">
                    <span>退货时间:</span>
                    <span>{{ formattedCreateDate(params.backDate) }}</span>
                </div>
            </li>
        </ul>
        <div class="title">
            <span>退货明细</span>
        </div>
        <van-list @load="onLoad">
            <ul class="list-ul" v-for="(item, index) in params.materialCirculationDetailsTableDTOS" :key="index" style="margin: 20px 15px 0 15px;">
                <li>
                    <span class="font-weight">物资名称:</span>
                    <span class="font-weight">{{ item.materialName }}</span>
                </li>
                <li>
                    <span>标段项目: </span>
                    <span>南京枢纽(江北地区)和南通地区工程2025年5月甲供物资需求计划表-04</span>
                </li>
                <li class="li-item-both">
                    <div class="li-item-left">
                        <span>规格型号:</span>
                        <span>{{ item.specModel }}</span>
                    </div>
                    <div class="li-item-right">
                        <span>计量单位:</span>
                        <span>{{ item.unit }}</span>
                    </div>
                </li>
                <li class="li-item-both">
                    <div class="li-item-left">
                        <span>发货数量:</span>
                        <span>{{ item.sendTotal }}</span>
                    </div>
                    <div class="li-item-right">
                        <span>退货数量:</span>
                        <span>{{ item.refundTotal }}</span>
                    </div>
                </li>
                <li>
                    <span>退货附件:</span>
                    <span style="color:#1989fa;">
                         <template>
                        <div v-for="(item1,index1) in item.fileList" :key="index1">
                          <div v-for="(item2,index2) in item1.fileList" :key="index2"> 
                            <a href="javascript:;" @click="imgClick(item2.fileName,item2.filePath)">{{ item2.fileName }}</a>
                          </div>
                        </div>
                      </template>
                    </span>
                </li>
            </ul>


        </van-list>
        <div class="title">
            <span>初验信息</span>
        </div>
        <div class="tabs">
            <van-list>
                <div class="box-container">
                    <ul class="list-ul">
                        <li>
                            <span>自检单:</span>
                            <span style="color:#1989fa;" v-if="params.fileByList.zjd" @click="imgClick(params.fileByList.zjd[0].fileName,params.fileByList.zjd[0].filePath)">{{ params.fileByList.zjd[0].fileName }}</span>
                        </li>
                        <li>
                            <span>其他资料:</span>
                            <span style="color:#1989fa;" v-if="params.fileByList.qtzl" @click="imgClick(params.fileByList.qtzl[0].fileName,params.fileByList.qtzl[0].filePath)">{{ params.fileByList.qtzl[0].fileName }}</span>
                        </li>
                    </ul>
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
import {returnGoodsDetails} from '@/api/demand/returnGoods'
import FilePreview from "@/components/FilePreview.vue";
Vue.use(Toast);
Vue.use(Form);
Vue.use(Field);
export default {
    name: 'MyProcess',
    components: { FilePreview },
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
            orderId:'',
            params:{}
        };
    },
    created() {
        this.orderId = this.$route.query.id
        this.getGoodsOrderDetails();
    },
    methods: { 
        // 时间戳转换成日期格式
         formattedCreateDate(timestamp) {
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
            const day = date.getDate().toString().padStart(2, '0'); // 日期加0
            return `${year}-${month}-${day}`;
            },
        getGoodsOrderDetails(){
             Toast.loading({
                message: '加载中...',
                forbidClick: true,
            });
            returnGoodsDetails(this.orderId).then((res)=>{
                if(res.code==0){
                    Toast.clear()
                    this.params = {
                        ...res.data, // 展开原有属性
                        fileByList: JSON.parse(res.data.fileByList) // 单独解析 fileByList
                    };
                }
                // console.log(res)
            })
        },
        onSubmit(values) {
            console.log('submit', values);
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
         imgClick(fileName,filePath) {
            this.$refs.filePreview.init(fileName, filePath)
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
    },
};
</script>
<style lang="less" scoped>
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
</style>