<template>
    <div class="default-container" ref="container" :style="{ paddingBottom: result.status === 6 ? '0' : '140px' }">
        <ul class="list-ul" style="margin: 10px;position: relative;">
            <li class="li-item-both">
              <div class="li-item-left">
                <span style="width: 300px;">供应需求名称:</span>
                <span>{{ result.planName }}</span>
              </div>
              <div class="li-item-right">
                <span></span>
                <!-- <span>{{ item.amount }}</span> -->
              </div>
            </li>
            <!-- <li>
                <span>供应需求名称:</span>
                <span>{{ result.planName }}</span>
            </li> -->

            <li>
                <span>需求项目：</span>
                <span>{{ result.sectionName }}</span>
            </li>
            <li>
                <span>需求组织：</span>
                <span>{{ result.deptName }}</span>
            </li>
            <li>
                <span>提报人：</span>
                <span>{{ result.createUserName }}</span>
            </li>
            <li>
                <span>提报时间：</span>
                <span>{{ formattedCreateDate(result.createDate) }}</span>
            </li>
            <li>
                <!-- <span>状态：</span> -->
                <span class="li-status" style="position: absolute;top: 10px;right:10px;">
                     <van-tag type="primary" round size="medium" v-if="result.status == 2">未确认</van-tag>
                      <van-tag type="primary" round size="medium" v-if="result.status == 3">已确认</van-tag>
                      <van-tag type="primary" round size="medium" v-if="result.status == 4">供应中</van-tag>
                      <van-tag type="primary" round size="medium" v-if="result.status == 6"
                        class="li-status-completed">已完成</van-tag>
                </span>
            </li>
        </ul>
        <div class="title">
            <span>供应信息</span>
        </div>
        <van-list>
            <ul class="list-ul" v-for="(item, index) in result.demandPlanDetailsGyDTOList" :key="index"
                style="margin: 10px;">
                <li>
                    <span class="font-weight">物资名称:</span>
                    <span class="font-weight">{{ item.materialName }}</span>
                </li>
                <li>
                    <span>规格型号：</span>
                    <span>{{ item.specModel }}</span>
                </li>
                <li class="li-item-both">
                    <div class="li-item-left">
                        <span>计量单位:</span>
                        <span>{{ item.unit }}</span>
                    </div>
                    <div class="li-item-right">
                        <span>合同数量:</span>
                        <span>{{ item.amount }}</span>
                    </div>
                </li>
                <li class="li-item-both">
                    <div class="li-item-left">
                        <span>累计计划量(含本次):</span>
                        <span>{{ item.cumulativeAmount }}</span>
                    </div>
                    <div class="li-item-right">
                        <span>本次计划数量:</span>
                        <span>{{ item.planAmount }}</span>
                    </div>
                </li>
                <li class="li-item-both">
                    <div class="li-item-left">
                        <span>已发货:</span>
                        <span>{{ item.sendTotal }}</span>
                    </div>
                    <div class="li-item-right">
                        <span>已验收:</span>
                        <span>{{ item.putTotal }}</span>
                    </div>
                </li>
                <li class="li-item-both">
                    <div class="li-item-left">
                        <span>已入库:</span>
                        <span>{{ item.storeTotal }}</span>
                    </div>
                    <div class="li-item-right">
                        <span>已退回:</span>
                        <span>{{ item.refundAllTotle }}</span>
                    </div>
                </li>
                <li class="li-item-both">
                    <div class="li-item-right" style="color:red;">
                        <span>剩余待发货:</span>
                        <span>{{ item.ssendTotal }}</span>
                    </div>
                </li>
            </ul>
        </van-list>
        <div class="default-button-container" v-if="result.status == 2 || result.status == 4 || result.status == 3">
            <van-button size="mini" type="info" round class="button-info" v-if="result.status == 2"
                @click="handleConfirmClick(result.id)">确认需求</van-button>
            <van-button size="mini" type="info" round class="button-info"
                v-if="result.status == 4 || result.status == 3"
                @click="handleSendGoodsClick(result.id, 'add')">发货</van-button>
            <!-- 编辑里的选择发货物资传的是planId -->
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { Form } from 'vant';
import { Field } from 'vant';
import { supplyDetails } from '@/api/demand/demandManagement'
Vue.use(Form);
Vue.use(Field);
export default {
    name: 'MyProcess',

    data() {
        return {
            username: '',
            password: '',
            value: '',
            showCalendar: false,
            showAction: false,
            loading: false,
            finished: false,
            result: {},
            list: [],
            allRefreshLoading: false,
            id: ''
        };
    },
    created() {
        this.id = this.$route.query.id
        this.getList()
    },
    methods: {
        getList() {
            let params = {
                id: this.id
            }
            supplyDetails(params).then((res) => {
                if (res.code == 0) {
                    this.allRefreshLoading = false
                    this.finished = false
                    this.result = res.data
                }
            })
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
        //确认需求
        handleConfirmClick(id) {
            this.$router.push({ path: '/confirm', query: { id: id } })
        },
        //发货
        handleSendGoodsClick(id, title) {
            this.$router.push({ path: '/sendGoods', query: { id: id, title: title } })
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
            if (!timestamp) return ''; // 处理空值
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