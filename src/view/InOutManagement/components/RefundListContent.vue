<template>
  <div class="in-out-management-list">
    <van-sticky>
      <div class="list-search-container">
        <van-search v-model="formData.queryField" placeholder="输入关键字搜索" shape="round" left-icon="none"
          @search="handeSearchClick()">
          <template slot='right-icon'>
            <van-icon name="search" @click="handeSearchClick()"/>
          </template>
        </van-search>
      </div>
    </van-sticky>
<div v-if="dataList.length > 0">
    <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
      <van-list v-model="allLoading" :finished="allFinished" finished-text="没有更多了..." :immediate-check="false" @load="getAllList">
        <div v-for="(item, index) in dataList" :key="index" class="box-container" @click="handleWaitItemClick(item)">
           <div class="list-title-content">
            <span>退货单号：</span>
            <span class="font-weight" style="color:#8C8FA0;">{{ item.backQualNumber }}</span>
          </div>
          <ul class="list-ul">
            <li>
              <!-- <span class="li-item-span-auto">供应需求名称：</span> -->
              <span class="font-weight">{{ item.planName }}</span>
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
              <span>收货单号：</span>
              <span @click.stop="detailsClick(item)" class="li-span-click">{{ item.takeNumber }}</span>
            </li>
            <li>
              <span>发货单号：</span>
              <span>{{ item.shipmentBatchNumber }}</span>
            </li>

            <!-- <li>
              <span>需求组织：</span>
              <span>{{ item.deptName }}</span>
            </li> -->
            <li>
              <span>供应商：</span>
              <span>{{ item.sellerName }}</span>
            </li>
            <li>
              <span>退货时间：</span>
              <span>{{  item.backNode == '2'?item.backDate && parseTime(item.backDate, '{y}-{m}-{d} {h}:{i}'):item.backQualDate && parseTime(item.backQualDate, '{y}-{m}-{d} {h}:{i}') }}</span>
            </li>
            <!-- <li>
              <span>操作人：</span>
              <span class="li-span-click">{{ item.createUserName }}</span>
            </li> -->
          </ul>
           <div class="list-ul-button">
                  <van-button class="button-info" round type="info"  @click.stop="handleDonwload(item)">下载</van-button>
                </div>
        </div>
      </van-list>
    </van-pull-refresh>
</div>

<div v-else>
      <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
        <van-empty image="/empty-image-default.png" description="暂无数据" />
      </van-pull-refresh>
</div>
  </div>
</template>
<script>
import {listCrRetreat} from '@/api/prodmgr-inv/materialCirculationTableRest'
import { getUserInfo } from '@/utils/user-info'
import {customDownload} from '@/api/prodmgr-inv/file'
export default {
  name: 'RefundListContent',
  data() {
    return {
      activeIndex: 0,
      formData: {
        queryField: ''
      },
      value1: 0,
      allRefreshLoading: false,
      allLoading: false,
      allFinished: false,
      dataList: [],
      allListQuery: {
        pageNum: 1,
        pageSize: 10,
      },
      userInfo: getUserInfo()
    };
  },
  created() {
    this.allRefresh()
  },
  activated() {
  },
  methods: {
       // 下载入库单-退货
    async handleDonwload({id}) {
      try {
        await customDownload({businessType:9,businessData : id })
      } catch (error) {
      } finally {
      }
    },
    //全部列表刷新
    allRefresh() {
      this.allRefreshLoading = true
      this.allLoading = true
      this.allFinished = false
      this.allListQuery.pageNum = 1;
      this.getAllList()
    },
    getAllList() {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      listCrRetreat(Object.assign({},this.allListQuery,this.formData, {deptId: this.userInfo.deptId})).then(({ data }) => {
        if(this.allRefreshLoading){
          this.dataList = [];
          this.allRefreshLoading = false;
        }
        this.allLoading = false;
        this.dataList = [...this.dataList, ...data.list];

        if (data?.list?.length === 0) {
          this.allFinished = true;
          return;
        }
        this.allListQuery.pageNum = this.allListQuery.pageNum + 1;
      }).catch((error) => {
        this.allLoading = false;
        this.allFinished = true;
      }).finally(() => {
        toast.clear();
      });
    },
    handleWaitItemClick (item) {
      // this.$router.push({ name: 'SubmitStore', query: {type: 'view'} })
      this.$router.push({name: 'DoReturn',query:{id: item.id, backNode: '1'}})
    },
    detailsClick (item) {
      this.$store.dispatch('public/setSelectGoodData', []);
      this.$store.dispatch('public/setGoodsReceiptInfo', {});

      this.$router.push({ name: 'DoAcceptDetail', query: {id: item.id, takeStatus: item.takeStatus}  })
    },
    handeSearchClick () {
      this.allRefresh()
    }
  },
};
</script>
<style lang="less" scoped>
.in-out-management-list {

  .list-search-container {
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    background: #eef6ff;
    margin-bottom: 10px;

    .van-search {
      flex: 1;
    }
  }
}
</style>