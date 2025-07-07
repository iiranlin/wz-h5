<template>
    <div class="default-container" ref="container" :style="{ paddingBottom: result.status === 6 ? '0' : '1.3rem' }">
         <div class="detail-base-info">
            <div class="detail-title-content">
                <img src="/static/icon-xqjh.png">
                <span>供应需求名称：</span>
                <span>{{ result.planName }}</span>
            </div>
            <div>
                <ul class="detail-ul">
                    <li>
                        <span>发货时间：</span>
                        <span>{{ formattedCreateDate(result.shippingDate) }}</span>
                    </li>
                    <li>
                        <span>需求项目：</span>
                        <span>{{  result.sectionName }}</span>
                    </li>
                    <li>
                        <span>需求组织：</span>
                        <span>{{ result.deptName }}</span>
                    </li>
                    <li>
                        <span>提报人：</span>
                        <span>{{ result.createUserName }}</span>
                    </li>
                    <!-- <li class="li-status">
            <template v-for="row in statusArr">
              <van-tag :class="{ 'li-status-completed': row.value == '9' }"
                :type="['0', '5'].includes(row.value) ? 'danger' : 'primary'" round size="medium" :key="row.value"
                v-if="detail.planStatus == row.value">{{ row.text }}</van-tag>
            </template>
</li> -->
                </ul>
            </div>
        </div>
        <div class="title">
            <span>供应信息</span>
        </div>
        <van-list>
            <ul class="list-ul" v-for="(item, index) in result.demandPlanDetailsGyDTOList" :key="index"
                style="margin: 0.2rem;">
                <li>
                    <span class="font-weight">物资名称:</span>
                    <span class="font-weight">{{ item.materialName }}</span>
                </li>
                <li>
                    <span>规格型号：</span>
                    <span>{{ item.specModel }}</span>
                </li>
                <li>
                   <span>计量单位:</span>
                    <span>{{ item.unit }}</span>
                </li>
                <li>
                    <span>合同数量:</span>
                    <span>{{ item.amount }}</span>
                </li>
                 <li>
                    <span>累计计划量(含本次):</span>
                    <span>{{ item.cumulativeAmount }}</span>
                </li>
                 <li>
                    <span>本次计划数量:</span>
                    <span>{{ item.planAmount }}</span>
                </li>
                <li>
                    <span>已发货:</span>
                    <span>{{ item.sendTotal }}</span>
                </li>
                <li>
                    <span>已验收:</span>
                    <span>{{ item.putTotal }}</span>
                </li>
                 <li>
                    <span>已入库:</span>
                    <span>{{ item.storeTotal }}</span>
                </li>
                 <li>
                    <span>已退回:</span>
                    <span>{{ item.refundAllTotle }}</span>
                </li>
                <li>
                      <span style="color:red;">剩余待发货:</span>
                        <span style="color:red;">{{ item.ssendTotal }}</span>
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
import { Field, Toast } from 'vant';
import { supplyDetails } from '@/api/demand/demandManagement'
Vue.use(Form);
Vue.use(Field);
Vue.use(Toast);
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
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
            });
            supplyDetails(params).then((res) => {
                if (res.code == 0) {
                    Toast.clear()
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
    min-width: 0.5rem;
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