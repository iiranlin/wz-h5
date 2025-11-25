<template>
  <div class="in-out-management-list">
    <van-sticky>
      <div class="list-search-container">
        <van-search v-model="formData.queryField" placeholder="输入关键字搜索" shape="round" left-icon="none"
          @search="handeSearch()">
          <template slot='right-icon'>
            <van-icon name="search" @click="handeSearch()"/>
          </template>
        </van-search>
      </div>
    </van-sticky>
    <div v-if="dataList.length > 0">
      <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
      <van-list v-model="allLoading" :finished="allFinished" finished-text="没有更多了..." :immediate-check="false" @load="getAllList">
        <div v-for="(item, index) in dataList" :key="index" class="box-container" @click="outClick(item)">
           <div class="list-title-content">
            <span>出库单号：</span>
            <span class="font-weight" style="color:#8C8FA0;">{{item.outNumber}}</span>
          </div>
          <ul class="list-ul">
            <li>
              <!-- <span>需求名称：</span> -->
              <span class="font-weight">{{item.planName}}</span>
            </li>
            <li>
              <span>需求编号：</span>
              <span>{{item.planNumber}}</span>
            </li>
            <li>
              <span>建设项目：</span>
              <span>{{ item.projectName }}</span>
            </li> 
            <li>
              <span>标段项目：</span>
              <span>{{ item.sectionName }}</span>
            </li>
            <!-- <li>
              <span>需求组织：</span>
              <span>{{item.deptName}}</span>
            </li> -->
            <li>
              <span>领用单位：</span>
              <span>{{item.receiveDeptName}}</span>
            </li>
            <li>
              <span>发料人：</span>
              <span>{{item.issueUserName}}</span>
            </li>
            <li>
              <span>领料人：</span>
              <span class="li-span-click">{{item.pickUserName}}</span>
            </li>
            <li>
              <span>领用日期：</span>
              <span>{{parseTime(item.pickDate,'{y}-{m}-{d}')}}</span>
            </li>
            <!-- <li>
              <span>操作人：</span>
              <span>{{item.createUserName}}</span>
            </li> -->
          </ul>
          <div class="list-ul-button">
            <van-button class="button-info" round type="info" @click.stop="handleDonwload(item)"
              >下载出库单</van-button>
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
import {materialSupplierOutRestList} from '@/api/prodmgr-inv/materialDemandPlanRest'
import {downloadOutOfTheWarehouse} from '@/api/prodmgr-inv/file'
import {customDownload} from '@/api/prodmgr-inv/file'

export default {
  name: 'OutListContent',
  data() {
    return {
      formData: {
        queryField: '',
      },
      dataList:[],

      allRefreshLoading: false,
      allLoading: false,
      allFinished: false,

      allListQuery: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.allRefresh()
  },
  activated() {
  },
  methods: {
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
      materialSupplierOutRestList(Object.assign({},this.allListQuery,this.formData)).then(({ data }) => {
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
    outClick(item) {
      this.$router.push({ name: 'OutboundDetails',query: {id: item.id} })
    },
    handeSearch(){
      this.allRefresh();
    },
    // 下载出库单
    async handleDonwload({id}) {
      try {
        await customDownload({businessType:6, businessData:id })
      } catch (error) {
      } finally {
      }
    },
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
    margin-bottom: 10px;

    .van-search {
      flex: 1;
    }
  }
}
</style>