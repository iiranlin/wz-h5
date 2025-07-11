<template>
    <div ref="container" :style="{ paddingBottom: result.status === 6 ? '0' : '1.3rem' }">
         <div class="detail-base-info">
             <div class="detail-title-content">
                <img src="/static/icon-xqjh.png">
                    <span style="font-size: 0.3rem;">供应需求名称：</span>
                    <span style="font-size: 0.3rem;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ result.planName }}</span>
                <div class="detail-title-status">
                    <img :src="checkAuditStatus(result.status)" />
                    <span>{{ checkStatusText(result.status) }}</span>
                </div>
            </div>
            <!-- <div class="detail-title-content">
                <img src="/static/icon-xqjh.png">
                <span style="min-width: 03rem;">供应需求名称：</span>
                <span class="text">{{ result.planName }}</span>
            </div> -->
            <div>
                <ul class="detail-ul">
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
             <div class="detail-title-content" style="display: flex;align-items: center;">
                <img src="/static/icon-xqjh.png">
                <span style="padding-left: 0.2rem;font-weight: 600;">供应信息</span>
            </div>
        </div>
        <van-list>
            <div class="box-container" v-for="(item, index) in result.demandPlanDetailsGyDTOList" :key="index">
                <div class="detail-list-title-content">
                        <span class="font-weight" style="min-width: 1.6rem;">物资名称：</span>
                        <span class="font-weight">{{ item.materialName }}</span>
                    </div>
                   <ul class="detail-list-ul" 
                style="margin: 0.2rem;background: #fff;border-radius: 16px;">
                
                <!-- <li class="save-materials-li" style="display: flex;justify-content:flex-start;">
                    <span class="font-weight dot-before">物资名称：</span>
                    <span class="font-weight">{{ item.materialName }}</span>
                </li> -->
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
                    <span class="li-span-click">{{ item.amount }}</span>
                </li>
                 <li>
                    <span style="min-width: 3.1rem;">累计计划量(含本次):</span>
                    <span class="li-span-click">{{ item.cumulativeAmount }}</span>
                </li>
                 <li>
                    <span style="min-width: 3rem;">本次计划数量:</span>
                    <span class="li-span-click">{{ item.planAmount }}</span>
                </li>
                <li>
                    <span>已发货:</span>
                    <span class="li-span-click">{{ item.sendTotal }}</span>
                </li>
                <li>
                    <span>已验收:</span>
                    <span class="li-span-click">{{ item.putTotal }}</span>
                </li>
                 <li>
                    <span>已入库:</span>
                    <span class="li-span-click">{{ item.storeTotal }}</span>
                </li>
                 <li>
                    <span>已退回:</span>
                    <span class="li-span-click">{{ item.refundAllTotle }}</span>
                </li>
                <li>
                      <span style="color:red;">剩余待发货:</span>
                        <span style="color:red;">{{ item.ssendTotal }}</span>
                </li>
            </ul>
            </div>
         
        </van-list>
        <div class="default-button-container" v-if="result.status == 2 || result.status == 4 || result.status == 3">
            <van-button size="mini" type="info" round class="button-info" v-if="result.status == 2"
                @click="handleConfirmClick(result.id)">确认需求</van-button>
            <van-button size="mini" type="info" round class="button-info"
                v-if="result.status == 4 || result.status == 3"
                @click="handleSendGoodsClick(result.id, 'add')">发货</van-button>
            <!-- 编辑里的选择发货物资传的是planId -->
        </div>
         <back-to-top className=".default-container"></back-to-top>
    </div>
</template>
<script>
import Vue from 'vue';
import BackToTop from '@/components/BackToTop'
import { Form } from 'vant';
import { Field, Toast } from 'vant';
import { supplyDetails } from '@/api/demand/demandManagement'
Vue.use(Form);
Vue.use(Field);
Vue.use(Toast);
export default {
    name: 'MyProcess',
    components:{BackToTop},
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
            id: '',
            statusArr: [
        { text: '全部', value: '' },
        { text: '已驳回', value: '0' },
        { text: '未提交', value: '1' },
        { text: '未确认', value: '2' },
        { text: '已确认', value: '3' },
        { text: '供货中', value: '4' },
        { text: '已撤回', value: '5' },
        { text: '已完成', value: '6' },
        { text: '收货完成', value: '7' },
        { text: '已入库', value: '8' },
        { text: '已完成', value: '9' },
        { text: '已退回', value: '10' },
      ],
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
            checkAuditStatus(status) {
      if (status == '0') {
        return '/static/icon-reject.png'
      } else if (['5', '10'].includes(status)) {
        return '/static/icon-return.png'
      } else {
        return '/static/icon-success.png'
      }
    },
        checkStatusText(status) {
      let name = ''
      this.statusArr.forEach(item => {
        if (item.value === status) {
          name = item.text
        }
      })
      return name
    },
    },
};
</script>
<style lang="less" scoped>
.detail-title-content{

  position: relative;
  .detail-title-status {
    position: absolute;
    right: 10px;
    top: 0;
    display: flex;
    align-items: center;
    height: 100%;

    img {
      width: 16px;
      height: 16px;
    }

    span {
      
      color: #134daa;
      font-size: 11px;
    }
  }

}
.box-container{
    padding: 0px !important;
}
.detail-list-ul{
    margin: 0 !important;
}
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
    height: 0.85rem;
    display: flex;
    align-items: center;
    margin: 10px;
    font-size: 14px;
}
.dot-before::before {
  content: "•";          /* 圆点符号 */
  color: #1890ff;        /* 蓝色（可自定义） */
  margin-right: 5px;     /* 与文字的间距 */
  font-size: 1.2em;      /* 可选：调整圆点大小 */
}
.text{
     white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
}
</style>