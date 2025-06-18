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
            <div class="sidebar-left">
                <van-sidebar v-model="activeKey">
                    <van-sidebar-item title="发货批次1" />
                    <van-sidebar-item title="发货批次2" />
                    <van-sidebar-item title="发货批次3" />
                    <van-sidebar-item title="发货批次4" />
                    <van-sidebar-item title="发货批次5" />
                </van-sidebar>
            </div>
            <div class="content">
                <van-tabs v-model="active" color="#0571ff" title-active-color="#0571ff">
                    <van-tab title="物流信息">
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
                        </van-steps>
                    </van-tab>
                    <van-tab title="发货物资明细">
                        <ul class="list-ul">
                            <li>
                                <span style="width: 230px;">需求组织名称:</span>
                                <span>施工单位名称</span>
                            </li>
                            <li>
                                <span style="width: 210px;">物资名称:</span>
                                <span class="text">计算机联锁设备</span>
                            </li>
                            <li>
                                <span style="width: 210px;">规格型号:</span>
                                <span>2x2取2s10组道岔</span>
                            </li>
                            <li class="li-item-both">
                                <div class="li-item-left">
                                    <span>计量单位:</span>
                                    <span>套</span>
                                </div>
                                <div class="li-item-right">
                                    <span>发货数量:</span>
                                    <span>5</span>
                                </div>
                            </li>
                            <li class="li-item-both">
                                <div class="li-item-left">
                                    <span>本次计划数量:</span>
                                    <span>5</span>
                                </div>
                                <div class="li-item-right">
                                    <span>包装形式:</span>
                                    <span>固装</span>
                                </div>
                            </li>
                            <li class="li-item-both">
                                <div class="li-item-left">
                                    <span>生产日期:</span>
                                    <span>2025年06月01日</span>
                                </div>
                            </li>
                            <li class="li-item-both">
                                <div class="li-item-left">
                                    <span>有效期截止日期:</span>
                                    <span>2025年05月03日</span>
                                </div>
                            </li>
                            <li>
                                <span style="width: 210px;">收货地址:</span>
                                <span class="text">收货地址收货地址收货地址收货地址</span>
                            </li>
                            <li>
                                <span style="width: 210px;">供应时间:</span>
                                <span>2025年06月01日</span>
                            </li>
                            <li>
                                <span style="width: 300px;">收货人及联系方式:</span>
                                <span>张晓明 13865444566</span>
                            </li>
                            <li>
                                <span style="width: 210px;">投资方:</span>
                                <span class="text">投资方名称投资方名称投资方名称投资方名称投资方名称投资方名称</span>
                            </li>
                            <li>
                                <span style="width: 210px;">投资比例:</span>
                                <span>40%;60%</span>
                            </li>
                           
                            <li>
                                <span>合格证附件:</span>
                                    <span style="color:#1989fa;">合格证附件.pdf</span>
                               
                            </li>
                            <li>
                                  <span>厂检报告附件:</span>
                                    <span style="color:#1989fa;">厂检报告.pdf</span>
                            </li>
                             <li>
                                <span style="width: 210px;">备注:</span>
                                <span class="text">备注内容备注内容备注内容备注内容备注内容</span>
                            </li>
                        </ul>
                    </van-tab>
                </van-tabs>

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
/deep/.van-sidebar-item--select::before{
    background-color: blue;
}
  ::v-deep .van-step__title {
    color: #272b31 !important;
    display: flex;
    justify-content: space-between;

    div:nth-child(1) {
      flex: 1;
    }

    .Logistics-Information-text {
      color: #999999 !important;
    }
  }
.li-item-both {
    .li-item-right {
        flex: initial;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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

.text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
</style>