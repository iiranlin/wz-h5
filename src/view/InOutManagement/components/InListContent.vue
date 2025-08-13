<template>
  <div class="in-out-management-list">
    <van-sticky>
      <div class="list-search-container">
        <van-search v-model="formData.queryField" placeholder="输入关键字搜索" left-icon="none" shape="round"
          @search="handeSearch()">
          <template slot='right-icon'>
            <van-icon name="search" @click="handeSearch()" />
          </template>
        </van-search>
        <!-- <van-dropdown-menu active-color="#028bff">
          <van-dropdown-item v-model="formData.storeStatus" :options="statusArr" @change="statusChange" />
        </van-dropdown-menu> -->
      </div>
      <van-tabs sticky v-model="formData.storeStatus" color="#0571ff" background="#ffffff" title-active-color="#0571ff"
        title-inactive-color="#2e2e2e" @change="tabsChange">
        <van-tab v-for="item in statusArr" :title="item.text" :name="item.value" :key="item.value">
        </van-tab>
      </van-tabs>
    </van-sticky>
    <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了..." @load="onLoad">

        <div v-for="(item, index) in dataList" :key="index" class="box-container">
          <div class="list-title-content">
            <span>入库单号：</span>
            <span class="font-weight" style="color:#8C8FA0;">{{ item.storeNumber }}</span>
            <div class="li-title-status">
              <img :src="checkAuditStatus(item.storeStatus)" />
              <span>{{ checkStatusText(item.storeStatus) }}</span>
            </div>
          </div>
          <ul class="list-ul" @click="detailsClick('1', item)">
            <li>
              <span>收货单号：</span>
              <span @click.stop="detailsClick('2', item)" class="li-span-click">{{ item.takeNumber }}</span>
            </li>
            <li>
              <span>需求名称：</span>
              <span>{{ item.planName }}</span>
            </li>
            <li>
              <span>建设项目：</span>
              <span>{{ item.projectName }}</span>
            </li> 
            <li>
              <span>标段项目：</span>
              <span>{{ item.sectionName }}</span>
            </li>
            <li>
              <span>需求组织：</span>
              <span>{{ item.deptName }}</span>
            </li>
            <li>
              <span>供应商：</span>
              <span>{{ item.sellerName }}</span>
            </li>
            <li>
              <span>收货时间：</span>
              <span>{{ parseTime(item.takeDate, '{y}-{m}-{d} {h}:{i}') }}</span>
            </li>
            <li>
              <span>入库时间：</span>
              <span>{{ item.storeDate ? parseTime(item.storeDate, '{y}-{m}-{d} {h}:{i}') : '' }}</span>
            </li>
            <!-- <li class="li-status">
              <template v-for="row in statusArr">
                <van-tag :class="{ 'li-status-completed': ['2', '3'].includes(row.value) }"
                  :type="['6'].includes(row.value) ? 'danger' : 'primary'" round size="medium" :key="row.value"
                  v-if="item.storeStatus == row.value">{{ row.text }}</van-tag>
              </template>
            </li> -->
            <!-- <li class="li-status">
              <template v-for="items in statusArr">
                <van-tag plain round size="medium" :key="items.value" v-if="item.storeStatus == items.value">{{ items.text }}</van-tag>
              </template>
            </li> -->
          </ul>
          <div class="list-ul-button">
            <van-button class="button-info" plain round type="info" @click="handleProcessClick(item)"
              v-if="item.storeStatus != '1'">查看流程</van-button>
            <van-button class="button-info" plain round type="info" @click="withdrawClick(item)"
              v-if="item.storeStatus == '5'">撤回</van-button>
            <van-button class="button-info" round type="info" @click="submitStore(item)"
              v-if="item.storeStatus == '1' || item.storeStatus == '6'">提交报检材料</van-button>
            <van-button class="button-info" round type="info" @click="handleDonwload(item)"
              v-if="item.storeStatus == '3' || item.storeStatus == '2'">下载入库单</van-button>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import indexMixin from '@/view/mixins'
import { listStore } from '@/api/prodmgr-inv/materialCirculationTableRest'
import { recall } from '@/api/prodmgr-inv/audit'
import { downloadStorageList } from '@/api/prodmgr-inv/file'

export default {
  name: 'InListContent',
  mixins: [indexMixin],
  beforeRouteLeave (to, from, next) {
    from.meta.storeStatus = this.formData.storeStatus
    next();
  },
  data() {
    return {
      className: '.in-out-management',
      formData: {
        queryField: '',
        storeStatus: ''
      },
      statusArr: [
        { value: '', text: '全部', imgPath: '' },
        { value: "1", text: "待检测", imgPath: '/static/Icon_checkPending.png' },
        { value: "2", text: "部分退货", imgPath: '/static/Icon_PartialReturn.png' },
        { value: "3", text: "已入库", imgPath: '/static/Icon_Storage.png' },
        { value: "4", text: "已退货", imgPath: '/static/Icon_Returned.png' },
        { value: "5", text: "审核中", imgPath: '/static/Icon_audit.png' },
        { value: "6", text: "已驳回", imgPath: '/static/Icon_reject.png' }
      ],
      refreshLoading: false,
      loading: false,
      finished: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      dataList: []
    };
  },
  created() {
    if(this.$route.meta.storeStatus){
      this.formData.storeStatus = this.$route.meta.storeStatus
    }
  },
  activated() {
  },
  methods: {
    checkStatusText(status) {
      let name = ''
      this.statusArr.forEach(item => {
        if (item.value === status) {
          name = item.text
        }
      })
      return name
    },
    checkAuditStatus(status) {
      // 获取状态对应图片路径
      let imgPath = this.statusArr.find(el => {
        return el.value === status
      })?.imgPath || "";

      return imgPath;
    },
    handeSearch() {
      this.onRefresh()
    },
    // statusChange() {
    //   this.onRefresh()
    // },
    tabsChange() {
      this.onRefresh()
    },
    //列表刷新
    onRefresh() {
      this.refreshLoading = true
      this.loading = true
      this.finished = false
      this.listQuery.pageNum = 1
      this.listStore()
    },
    onLoad() {
      this.listStore()
    },
    listStore() {
      this.error = false
      if (this.refreshLoading) {
        this.dataList = []
        this.refreshLoading = false
      }
      const params = {
        ...this.listQuery,
        ...this.formData
      }
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      })
      listStore(params).then(({ data }) => {
        this.dataList.push(...(data.list || []))
        // 数据全部加载完成
        if (this.dataList.length >= data.total) {
          this.finished = true
          return
        }
        this.listQuery.pageNum++
      }).catch(() => {
        this.finished = true
        this.error = true
      }).finally((err) => {
        this.loading = false
        toast.clear()
        this.scrollPositionInit(this.className, this.finished)
      })
    },
    submitStore(item) {
      this.$store.dispatch('public/setInboundInformation', {});
      this.$store.dispatch('public/setSelectStoreData', []);

      this.$router.push({ name: 'SubmitStore', query: { type: 'submit', id: item.id, supplyId: item.planId, storeStatus: item.storeStatus } })
    },
    // 下载入库单
    async handleDonwload({id}) {
      try {
        await downloadStorageList({id});
      } catch (error) {
      } finally {
      }
    },
    withdrawClick(item) {
      this.$dialog.confirm({
        title: '标题',
        message: '确认要撤回吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        return recall({ businessId: item.id, businessType: 'RKLC' });
      }).then(() => {
        this.$toast('撤回成功');
      })
    },
    //查看流程点击
    handleProcessClick(item) {
      this.$router.push({ 
        name: "MyProcess", 
        params: { 
          businessId: item.id, 
          workflowId: item.storeMiddleId,
          businessType: 'RKLC',
        } 
      })
    },
    detailsClick(key, item) {
      const objKey = {
        '1': () => {
          if (item.storeNumber) {
            this.$store.dispatch('public/setInboundInformation', {});
            
            this.$store.dispatch('public/setSelectStoreData', []);

            this.$router.push({ name: 'SubmitStore', query: { type: 'view', id: item.id, supplyId: item.planId, storeStatus: item.storeStatus } })
          } else {
            this.$toast('入库完成才能查看详情');
          }
        },
        '2': () => {
          this.$store.dispatch('public/setGoodsReceiptInfo', {});
          
          this.$store.dispatch('public/setSelectGoodData', []);
          
          this.$router.push({ name: 'DoAcceptDetail', query: { id: item.id, takeStatus: item.takeStatus } })
        }
      }
      objKey && objKey[key]()
    }
  },
};
</script>
<style lang="less" scoped>
.in-out-management-list {
  ::v-deep .van-tabs__wrap {
    margin-bottom: 10px !important;
    height: 44px !important;
  }

  .list-search-container {
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    background: #eef6ff;

    .van-search {
      flex: 1;
    }

    ::v-deep .van-dropdown-menu__bar {
      border-radius: 50px;
      width: 90px;
      height: 32px;
      margin-top: 10px;
      margin-right: 15px;
      font-size: 12px;
      box-shadow: inherit;

      .van-dropdown-menu__title {
        font-size: 12px;
      }

    }
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
}
</style>