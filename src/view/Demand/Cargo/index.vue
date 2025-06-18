<template>
    <div class="default-container" ref="container">
        <ul class="list-ul" style="margin: 10px;">
            <li>
                <span style="width:330px;">需求名称：</span>
                <span>南京枢纽(江北地区)和南通地区工程2025年5月甲供物资需求计划表-04</span>
            </li>

            <li>
                <span style="width:330px;">需求项目：</span>
                <span>南京枢纽(江北地区)和南通地区工程2025年5月甲供物资需求计划表-04</span>
            </li>
            <li>
                <span style="width: 220px;">需求组织：</span>
                <span>施工单位名称</span>
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
                                <span>FH202505310001</span>
                            </li>
                            <li>
                                <span style="width: 210px;">物流单号:</span>
                                <span class="text">XXXxxxxXXXXX</span>
                            </li>
                            <li>
                                <span style="width: 210px;">发货时间:</span>
                                <span>2025年06月01日</span>
                            </li>
                            <li>
                                <span style="width: 210px;">发货地址:</span>
                                <span>XxxxxxXXXXXXXXXX</span>
                            </li>
                            <li>
                                <span style="width: 280px;">预计到达时间为:</span>
                                <span>2025年05月03日</span>
                            </li>
                            <li>
                                <span style="width: 210px;">车牌号为:</span>
                                <span>冀T20874</span>
                            </li>
                            <li>
                                <span style="width: 210px;">联系人:</span>
                                <span>name</span>
                            </li>
                            <li>
                                <span style="width: 210px;">联系电话:</span>
                                <span>17703155555</span>
                            </li>
                        </ul>
                        <van-steps direction="vertical" :active="0">
                            <van-step>
                                <h3>派送中</h3>
                                <p>2016-07-12 12:40</p>
                            </van-step>
                            <van-step>
                                <h3>运输中</h3>
                                <p>2016-07-11 10:00</p>
                            </van-step>
                            <van-step>
                                <h3>发货中</h3>
                                <p>2016-07-10 09:30</p>
                            </van-step>
                             <van-step>
                                <h3>确认下单</h3>
                                <p>2016-07-10 09:30</p>
                            </van-step>
                        </van-steps>
                 

            </div>
        </div>

    </div>
</template>
<script>
import Vue from 'vue';
import { Sidebar, SidebarItem } from 'vant';
import { Tab, Tabs } from 'vant';
import { Step, Steps } from 'vant';

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