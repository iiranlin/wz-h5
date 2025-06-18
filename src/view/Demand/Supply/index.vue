<template>
    <div class="default-container" ref="container">
        <ul class="list-ul" style="margin: 10px;">
            <li>
                <span style="width:330px;">需求名称：</span>
                <span>南京枢纽(江北地区)和南通地区工程2025年5月甲供物资需求计划表-04</span>
            </li>

            <li >
                <span style="width:330px;">需求项目：</span>
                <span>南京枢纽(江北地区)和南通地区工程2025年5月甲供物资需求计划表-04</span>
            </li>
            <li>
                <span style="width: 220px;">需求组织：</span>
                <span>施工单位名称</span>
            </li>
        </ul>
        <div class="title">
            <span>供应信息</span>
        </div>
        <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
             

                    <ul class="list-ul" v-for="(item,index) in 10" :key="index" style="margin: 10px;">
                        <li>
                            <span class="font-weight">物资名称:</span>
                            <span class="font-weight">计算机联锁设备</span>
                        </li>
                        <li>
                            <span>规格型号：</span>
                            <span>2x2取2s10组道岔</span>
                        </li>
                        <li class="li-item-both">
                            <div class="li-item-left">
                                <span>计量单位:</span>
                                <span>套</span>
                            </div>
                            <div class="li-item-right">
                                <span>合同数量:</span>
                                <span>5</span>
                            </div>
                        </li>
                        <li class="li-item-both">
                            <div class="li-item-left">
                                <span>累计计划量(含本次):</span>
                                <span>4</span>
                            </div>
                            <div class="li-item-right">
                                <span>本次计划数量:</span>
                                <span>5</span>
                            </div>
                        </li>
                        <li class="li-item-both">
                            <div class="li-item-left">
                                <span>已发货:</span>
                                <span>4</span>
                            </div>
                            <div class="li-item-right">
                                <span>已验收:</span>
                                <span>2</span>
                            </div>
                        </li>
                        <li class="li-item-both">
                            <div class="li-item-left">
                                <span>已入库:</span>
                                <span>2</span>
                            </div>
                            <div class="li-item-right">
                                <span>已退回:</span>
                                <span>1</span>
                            </div>
                        </li>
                        <li class="li-item-both">
                            <div class="li-item-right" style="color:red;">
                                <span>剩余待发货:</span>
                                <span>1</span>
                            </div>
                        </li>
                    </ul>

              
            </van-list>
        </van-pull-refresh>

    </div>
</template>
<script>
import Vue from 'vue';
import { Form } from 'vant';
import { Field } from 'vant';

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
            result: [],
            list: []
        };
    },
    created() {
        // this.getOrderStatusOptions();
    },
    methods: {
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