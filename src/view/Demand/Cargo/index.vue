<template>
    <div class="default-container" ref="container">
        <ul class="list-ul" style="margin: 10px;">
            <li>
                <span style="width: 250px;">供应商需求名称：</span>
                <span>{{ params.planName }}</span>
            </li>

            <li>
                <span>供应需求ID：</span>
                <span>{{ params.planNumber }}</span>
            </li>
            <li>
                <span>需求项目：</span>
                <span>{{ params.sectionName }}</span>
            </li>
            <li>
                <span>填报人：</span>
                <span>{{ params.createUserName }}</span>
            </li>
            <li>
                <span>填报时间：</span>
                <span>{{ formattedCreateDate(params.createDate) }}</span>
            </li>
        </ul>
        <div class="title">
            <span>物流信息</span>
        </div>
        <div class="sidebar" style="margin: 10px;">
            <div class="content">
               
                        <ul class="list-ul">
                            <li>
                                <span style="width: 210px;">发货单号:</span>
                                <span>{{ logistics.shipmentBatchNumber }}</span>
                            </li>
                            <li>
                                <span style="width: 210px;">物流单号:</span>
                                <span class="text">{{ logistics.oddNumbers }}</span>
                            </li>
                            <li>
                                <span style="width: 210px;">发货时间:</span>
                                <span v-if="logistics.shippingDate">{{ formattedCreateDate(logistics.shippingDate) }}</span>
                            </li>
                            <li>
                                <span style="width: 210px;">发货地址:</span>
                                <span>{{ logistics.shippingAddress }}</span>
                            </li>
                            <li>
                                <span style="width: 280px;">预计到达时间为:</span>
                                <span v-if="logistics.arrivalDate">{{ formattedCreateDate(logistics.arrivalDate) }}</span>
                            </li>
                            <li>
                                <span style="width: 210px;">车牌号为:</span>
                                <span>{{ logistics.carNumber }}</span>
                            </li>
                            <li>
                                <span style="width: 210px;">联系人:</span>
                                <span>{{ logistics.contacts }}</span>
                            </li>
                            <li>
                                <span style="width: 210px;">联系电话:</span>
                                <span>{{ logistics.contactsPhone }}</span>
                            </li>
                        </ul>
                         <div class="Logistics-Information-dt">
        <img :src="dt" />
      </div>
                       <van-steps direction="vertical" active-color="#0086ff" :active="0">
                        <van-step>
                        <div>
                            <p>派送中</p>
                            <p class="Logistics-Information-text">货物派送中</p>
                        </div>
                        <div class="Logistics-Information-text">2016-07-12 12:40</div>
                        </van-step>
                        <van-step>
                        <div>
                            <p>运输中</p>
                            <p class="Logistics-Information-text">货物运输中</p>
                        </div>
                        <div class="Logistics-Information-text">2016-07-12 12:40</div>
                        <div></div>
                        </van-step>
                        <van-step>
                        <div>
                            <p>发货中</p>
                            <p class="Logistics-Information-text">货物正在发货</p>
                        </div>
                        <div class="Logistics-Information-text">2016-07-12 12:40</div>
                        <div></div>
                        </van-step>
                        <van-step>
                        <div>
                            <p>确认下单</p>
                            <p class="Logistics-Information-text">订单确认中</p>
                        </div>
                        <div class="Logistics-Information-text">2016-07-12 12:40</div>
                        </van-step>
                    </van-steps>
                 

            </div>
        </div>
        <van-list @load="onLoad">
            <ul class="list-ul" v-for="(item,index) in logistics.materialCirculationDetailsTableDTOS" :key="index" style="margin: 20px 15px 0 15px;">
                <li>
                    <span class="font-weight">物资名称:</span>
                    <span class="font-weight">{{ item.createUserName }}</span>
                </li>
                <li>
                    <span>标段项目: </span>
                    <span>南京枢纽(江北地区)和南通地区工程2025年5月甲供物资需求计划表-04</span>
                </li>
                <li class="li-item-both">
                    <div class="li-item-left">
                        <span>规格型号:</span>
                        <span>22</span>
                    </div>
                    <div class="li-item-right">
                        <span>计量单位:</span>
                        <span>33</span>
                    </div>
                </li>
                <li class="li-item-both">
                    <div class="li-item-left">
                        <span>发货数量:</span>
                        <span>44</span>
                    </div>
                    <div class="li-item-right">
                        <span>退货数量:</span>
                        <span>3</span>
                    </div>
                </li>
                <li>
                    <span>退货附件:</span>
                    <span style="color:#1989fa;">
                        11
                    </span>
                </li>
            </ul>


        </van-list>
    </div>
</template>
<script>
import Vue from 'vue';
import { Sidebar, SidebarItem } from 'vant';
import { Tab, Tabs } from 'vant';
import { Step, Steps } from 'vant';
import dt from '@/assets/img/dt.png';
import {lookGoodsDetails,shippingOrderNumber} from '@/api/demand/returnGoods'
Vue.use(Step);
Vue.use(Steps);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Sidebar);
Vue.use(SidebarItem);
export default {
    name: 'MyProcess',

    data() {
        return {
            dt,
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
            params:{},
            logistics:{}
        };
    },
    created() {
         this.wuLiuId = this.$route.query.id
         this.wuLiuNumber = this.$route.query.number
        this.getDetails();
    },
    methods: {
          getDetails(){
            //需求信息
            lookGoodsDetails(this.wuLiuId).then((res)=>{
                if(res.code==0){
                    this.params=res.data
                }
            })
            //物流信息
            shippingOrderNumber(this.wuLiuNumber).then((res)=>{
                if(res.code==0){
                    this.logistics = res.data
                }
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
/deep/.van-sidebar-item__text{
width: 200px !important;
}
</style>