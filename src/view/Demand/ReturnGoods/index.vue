<template>
    <div class="default-container" ref="container">
        <ul class="list-ul" style="margin: 10px;">
            <li>
                <span style="width:330px;">供应需求：</span>
                <span>南京枢纽(江北地区)和南通地区工程2025年5月甲供物资需求计划表-04</span>
            </li>

            <li>
                <span style="width:220px;">需求项目：</span>
                <span>标段项目名称</span>
            </li>
            <li>
                <span style="width: 220px;">需求组织：</span>
                <span>施工单位名称</span>
            </li>
            <li>
                <span style="width: 220px;">发货单号：</span>
                <span>FH65889602032336</span>
            </li>
            <li class="li-item-both">
                <div class="li-item-left">
                    <span style="width: 220px;">退货环节:</span>
                    <span style="color:red;">报检不通过</span>
                </div>
                <div class="li-item-right">
                    <span>退货时间:</span>
                    <span>2025-04-02 18:20</span>
                </div>
            </li>
        </ul>
        <div class="title">
            <span>退货明细</span>
        </div>
        <van-list @load="onLoad">
            <ul class="list-ul" v-for="(item, index) in 10" :key="index" style="margin: 20px 15px 0 15px;">
                <li>
                    <span class="font-weight">物资名称:</span>
                    <span class="font-weight">计算机联锁设备</span>
                </li>
                <li>
                    <span>标段项目: </span>
                    <span>南京枢纽(江北地区)和南通地区工程2025年5月甲供物资需求计划表-04</span>
                </li>
                <li class="li-item-both">
                    <div class="li-item-left">
                        <span>规格型号:</span>
                        <span>2x2取2s10组道岔</span>
                    </div>
                    <div class="li-item-right">
                        <span>计量单位:</span>
                        <span>套</span>
                    </div>
                </li>
                <li class="li-item-both">
                    <div class="li-item-left">
                        <span>发货数量:</span>
                        <span>10</span>
                    </div>
                    <div class="li-item-right">
                        <span>退货数量:</span>
                        <span>6</span>
                    </div>
                </li>
                <li>
                    <span>退货附件:</span>
                    <span style="color:#1989fa;">附件/xxxxx.pdf</span>
                </li>
            </ul>


        </van-list>
        <div class="title">
            <span>初验信息</span>
        </div>
        <div class="tabs">
            <van-list @load="getAllList">

                <div class="box-container">
                    <ul class="list-ul">
                        <li>
                            <span>自检单:</span>
                            <span style="color:#1989fa;">自检单附件/xxxxx.pdf</span>
                        </li>
                        <li>
                            <span>其他资料:</span>
                            <span style="color:#1989fa;">其他资料/xxxxx.pdf</span>
                        </li>
                    </ul>
                </div>
            </van-list>
        </div>
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