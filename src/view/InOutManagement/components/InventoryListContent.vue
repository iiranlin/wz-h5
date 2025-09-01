<template>
  <div class="in-out-management-list">
    <van-sticky>
      <div class="list-search-container">
        <van-search v-model="formData.queryField" placeholder="输入关键字搜索" shape="round" left-icon="none" @search="handeSearch()">
          <template slot='right-icon'>
            <van-icon name="search" @click="handeSearch()"/>
          </template>
        </van-search>
      </div>
      <van-tabs sticky v-model="formData.planCompleteStatus" color="#0571ff" title-active-color="#0571ff"
        title-inactive-color="#2e2e2e" @change="tabsChange">
        <van-tab v-for="item in option1" :title="item.text" :name="item.value" :key="item.value">
        </van-tab>
      </van-tabs>
    </van-sticky>
    <div v-if="dataList.length > 0">
    <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
      <van-list v-model="allLoading" :finished="allFinished" finished-text="没有更多了..." :immediate-check="false" @load="getAllList">
        <div v-for="(item, index) in dataList" :key="index" class="box-container">
          <div class="list-title-content">
            <span style="color:#73768b">需求编号：</span>
            <span style="color:#73768b">{{item.planNumber}}</span>
            <div class="li-title-status">
              <img :src="checkAuditStatus(item.planCompleteStatus)"/>
              <span :style="handlerTextColor(option1, 'value', item.planCompleteStatus)">{{item.planCompleteStatus == '1'?'已完成':'未完成'}}</span>
            </div>
          </div>
          <ul class="list-ul" @click="detailsClick(item)">
            <li>
              <span class="list-ul-title">{{item.planName}}</span>
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
              <span>物资名称：</span>
              <span>{{item.materialName}}</span>
            </li>
            <li>
              <span>供应商：</span>
              <span>{{item.sellerName}}</span>
            </li>
            <!-- <li>
              <span>需求组织：</span>
              <span>{{item.deptName}}</span>
            </li> -->
            <li>
              <span>当前库存：</span>
              <span style="color:rgba(19, 77, 170, 1)">{{item.relatedCount == 0?'无':'有'}}</span>
            </li>
            <li>
              <span>提报人：</span>
              <span>{{item.createUserName}}</span>
            </li>
            <li>
              <span>提报时间：</span>
              <span>{{item.createDate && parseTime(item.createDate,'{y}-{m}-{d} {h}:{i}')}}</span>
            </li>
          </ul>
          <div class="list-ul-button" v-if="item.relatedCount == '1'">
            <van-button class="button-info" plain round type="info" @click="outboundClick(item)">出库</van-button>
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
import {materialDemandPlanRestListStock} from '@/api/prodmgr-inv/materialDemandPlanRest'

export default {
  name: 'InventoryListContent',

  data() {
    return {
      formData: {
        queryField: '',
        planCompleteStatus: '',
      },
      dataList:[],
      value1: 0,
      option1: [
        { text: '全部', value: '', color: '' },
        { text: '未完成', value: '0', color: '#134daa' },
        { text: '已完成', value: '1', color: '#51CA40' },
      ],
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
    this.allRefresh();
    if(this.$route.meta.status){
      this.formData.planCompleteStatus = this.$route.meta.status
    }
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
      materialDemandPlanRestListStock(Object.assign({},this.allListQuery,this.formData)).then(({ data }) => {
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
    outboundClick (item) {
      this.$router.push({ name: 'Outbound', query: {type: 'submit',id: item.id} })
    },
    detailsClick (item) {
      this.$router.push({ name: 'InventoryDetails',query: {id: item.id, relatedCount: item.relatedCount} })
    },
    handeSearch(){
      this.allRefresh();
    },
    tabsChange(){
      this.allRefresh();
    },
    checkAuditStatus(status){
      if(status == '1'){
        return '/static/newIcon_done.png'
      }else
        return '/static/newIcon_undone.png'
    },
  },
};
</script>
<style lang="less" scoped>
.in-out-management-list {

  ::v-deep .van-tabs__wrap{
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
  }
  .list-ul{
    .list-ul-title{
      font-size: 0.375rem;
      font-weight: 600;
    }
  }
}
</style>