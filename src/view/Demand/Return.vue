<template>
  <div ref="container">
    <div class="list-search-container">
    <van-search v-model="params.shipmentBatchNumber" placeholder="输入关键字搜索" left-icon="none" shape="round" :show-action="showAction"
          @search="onSearch">
          <template slot='right-icon'>
            <van-icon name="search" @click="statusChange()" />
          </template>
        </van-search>
      <!-- <van-search v-model="params.shipmentBatchNumber" placeholder="输入关键字搜索" shape="round" background="#eef6ff" @search="onSearch">
      </van-search> -->
    </div>
    <div class="tabs" v-if="returnList.length > 0">
      <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了..." @load="onLoad" :offset="10"
          :immediate-check="false">
          <div class="detail-base-info">
                <div v-for="(item, index) in returnList" :key="index" class="box-container"
            @click="handleDetailsItemClick(item.id)">
            <div class="list-title-content">
                    <span>退货单号：</span>
                    <span class="font-weight" style="color:#134daa;">{{ item.backNumber }}</span>
                    <div class="li-title-status">
                      <img :src="checkAuditStatus(item.backNode)" />
                      <span>{{ checkStatusText(item.backNode) }}</span>
                    </div>
                  </div>
            <ul class="list-ul">

              <!-- <li>
                <span class="font-weight">退货单号:</span>
                <span class="font-weight" style="color:#1989fa;">{{ item.backNumber }}</span>
              </li> -->
              <li>
                <span style="min-width: 3rem;">供应需求ID：</span>
                <span class="text" style="color:#1989fa;" @click.stop="handleSupplyClick(item.planId)">{{ item.planNumber }}</span>
              </li>
              <li>
                <span>发货单号:</span>
                <span class="text" style="color:#1989fa;" @click.stop="handleCarGoClick(item.id)">{{ item.shipmentBatchNumber }}</span>
              </li>
              <li>
                <span style="min-width: 2.4rem;">供应需求名称:</span>
                <span>{{ item.planName }}</span>
              </li>
              <li>
                <span>需求项目:</span>
                <span>{{ item.sectionName }}</span>
              </li>
              <li>
                <span>退货时间:</span>
                <span v-if="item.backDate != ''">{{ formattedCreateDate(item.backDate) }}</span>
              </li>
              <!-- <li class="li-status">
                <van-tag type="primary" round size="medium" v-if="item.backNode==2">收货不通过</van-tag>
                <van-tag type="primary" round size="medium" v-else>收货通过</van-tag>
              </li> -->
            </ul>
          </div>
          </div>
      
        </van-list>
      </van-pull-refresh>

    </div>
    <div v-else>
      <van-empty description="暂无数据" />
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import keepPages from '@/view/mixins/keepPages'
import { returnGoodsList } from '@/api/demand/returnGoods'
import { getUserInfo } from '@/utils/user-info'
import { Toast } from 'vant';
Vue.use(Toast);
export default {
  name: 'MyToDoList',
  mixins: [keepPages],

  data() {
    return {
      menuActiveIndex: 0,
      userInfo: getUserInfo(),
      formData: {
        keywords: '',
      },
      showAction: false,
      allRefreshLoading: false,
      finished: false,
      loading: false,
      params: {
        sellerId: "",
        pageNum: 1,
        pageSize: 10,
        isAsc: "",
        orderByColumn: "",
        shipmentBatchNumber: ""
      },
      returnList: [],
      total: 0,
      statusArr: [
        { text: '全部', value: '' },
        { text: '质检不通过', value: '2' },
        { text: '收货不通过', value: '1' }
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      let params = {
        sellerId: this.userInfo.id,
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize,
        isAsc: this.params.isAsc,
        orderByColumn: this.params.orderByColumn,
        shipmentBatchNumber: this.params.shipmentBatchNumber,
      }
      returnGoodsList(params).then((res) => {
        if (res.code == 0) {
          Toast.clear()
          this.total = res.data.total
          if (this.allRefreshLoading) {
            this.returnList = [];
            this.allRefreshLoading = false;
          }
          if (res.data.list.length < 1) {
            this.returnList = res.data.list
          } else {

            this.returnList = this.returnList.concat(res.data.list)
          }
          if (this.returnList.length >= res.data.total) {
            this.finished = true
          }
          this.loading = false
        }
      })
    },
    formattedCreateDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份加0
      const day = date.getDate().toString().padStart(2, '0'); // 日期加0
      return `${year}-${month}-${day}`;
    },
    //全部列表条目点击
    handleDetailsItemClick(id) {
      this.$router.push({ path: '/returnDetails', query: { id: id } })
    },
    //全部列表刷新
    allRefresh() {
      this.params.pageNum = 1
      this.finished = false
      this.allRefreshLoading = true
      this.getList();
    },
    onLoad() {
      this.params.pageNum++;
      this.getList()
    },
    onSearch() {
      this.allRefreshLoading = true
      this.params.pageNum = 1
      this.getList();
    },
      statusChange() {
      this.allRefreshLoading = true
      this.params.pageNum = 1
     this.getList()
     },
     //供应详情
    handleSupplyClick(id) {
      this.$router.push({ path: '/supplyMsg', query: { id: id } })
    },
     //货运详情
    handleCarGoClick(id) {
      this.$router.push({ path: '/cargoDetails', query: { id: id } })
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
    //待审核列表刷新

  },
};
</script>
<style lang="less" scoped>
.detail-title-content{
  padding: 0;
  position: relative;
  border-bottom: 0.025rem solid #e3e3e3;
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
      margin-left: 3px;
      color: #134daa;
      font-size: 11px;
    }
  }

}
/deep/ .van-tag--primary{
  background: #ffffff;
}
/deep/ .arrow {
  min-width: 0.2rem !important;
}

::v-deep .van-tabs__content {
  height: calc(100vh - 162px);
  overflow-y: scroll;
}

.tabs {
  height: calc(100vh - 62px);
  overflow: scroll;
}

.van-search {

  .van-search__content {
    border-radius: 50px;
  }

  .van-cell {
    border-radius: 50px;
  }
}

.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-ul-button {
  display: flex;
}

.button-info {
  width: 85px;
  font-size: 12px;
}

.li-status {
  .van-tag--primary {
    color: #028bff;
    background: #edf4ff;
  }

  .van-tag--danger {
    color: #f83738;
    background: #ffe2e2;
  }

  .li-status-completed {
    color: #6f6f6f;
    background: #ededed;
  }
}
</style>