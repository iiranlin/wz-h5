<template>
  <div class="select-Contract">
    <van-sticky class="select-Contract-search">
      <van-search v-model="searchValue" placeholder="输入关键字搜索" left-icon="none" shape="round" :show-action="showAction"
        @search="onSearch">
        <template slot='right-icon'>
          <van-icon name="search" @click="onSearch" />
        </template>
      </van-search>
    </van-sticky>
    <!-- <div class="detail-floor-content">
      <img src="/static/icon-return.png"/>
      <span>请选择合同</span>
    </div> -->
    <div class="select-Contract-list">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新成功">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
          <!-- <van-radio-group v-model="contractId">
            <van-radio :name="item.id" v-for="item in list" :key="item.id"> -->
              <div class="box-container" v-for="item in list" :key="item.id" @click="contractClick(item.id, item.materialUsedRatio)">
                <div class="detail-list-title-content">
                    <span>{{ item.contractName }}</span>
                </div>
                <ul class="detail-list-ul">
                  <!-- <li>
                    <span class="font-weight">合同名称：</span>
                    <span class="font-weight">{{ item.contractName }}</span>
                  </li> -->
                  <li>
                    <span>合同编号：</span>
                    <span>{{ item.contractNo }}</span>
                  </li>
                  <li>
                    <span>物资名称：</span>
                    <span>{{ item.itemName }}</span>
                  </li>
                  <li>
                    <span>供应商：</span>
                    <span>{{ item.seller }}</span>
                  </li>
                  <li class="select-Contract-money">
                    <span>计划金额比例：</span>
                    <span class="li-span-click">{{ item.materialUsedRatio }}%</span>
                  </li>
                  <li class="li-span-open">
                    <span class="li-span-grey">点击选择<van-icon name="arrow" /></span>
                  </li>
                </ul>
              </div>
            <!-- </van-radio>
          </van-radio-group> -->
        </van-list>
      </van-pull-refresh>
    </div>
    <!-- <div class="default-button-container">
      <van-button class="button-info" type="info" round @click="addClick">确定选择</van-button>
    </div> -->
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import BackToTop from '@/components/BackToTop'
import { getBySectionProject } from '@/api/prodmgr-inv/materialContract'
export default {
  name: 'SelectContract',
  components: { BackToTop },
  data() {
    return {
      searchValue: '',
      showAction: false,
      refreshLoading: false,
      error: false,
      loading: false,
      finished: false,
      // contractId: null,
      list: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
  },
  methods: {
    onSearch() {
      this.refreshLoading = true
      this.listQuery.pageNum = 1
      this.getBySectionProject()
    },
    onLoad() {
      this.getBySectionProject()
    },
    getBySectionProject () {
      this.error = false
      if (this.refreshLoading) {
        this.list = [];
        this.refreshLoading = false;
      }
      const params = {
        queryField: this.searchValue,
        ...this.listQuery
      }
      getBySectionProject(params).then( ({data}) => {
        this.list.push(...(data.list || []))
        // 数据全部加载完成
        if (this.list.length >= data.total) {
          this.finished = true
          return
        } else {
          this.finished = false
        }
        this.listQuery.pageNum++
      }).catch(() => {
        this.finished = true
        this.error = true
      }).finally( (err) => {
        this.loading = false
      })
    },
    //列表刷新
    onRefresh(){
      this.refreshLoading = true
      this.loading = true
      this.finished = false
      this.listQuery.pageNum = 1
      this.onLoad();
    },
    contractClick(contractId, materialUsedRatio) {
      if (!contractId) {
        this.$notify({ type: 'warning', message: '请选择合同' });
        return
      }
      this.$router.push({ name: 'SelectMaterials', query: {contractId, materialUsedRatio} })
    }
  }
}
</script>
<style lang="less" scoped>
.detail-list-title-content{
  height: auto;
  line-height: 20px;
  padding-top: 8px;
}
.box-container{
  padding: 0;
}
.select-Contract {
  display: flex;
  flex-direction: column;
  
  .select-Contract-list{
    height: 100%;
    padding-top: 8px;
  }

  .van-list {
    background: #f8f8f8;

    .van-radio {
      box-sizing: border-box;
      margin-left: 8px;
      margin-right: 8px;
      margin-bottom: 10px;
      background: #ffffff;
      border-radius: 7px;
      box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
      position: relative;
      padding: 10px;
      display: flex;

      ::v-deep .van-radio__label {
        width: calc(100% - 25px);

        .list-ul {
          li {
            span:nth-child(2) {
              width: auto !important;
            }
          }
        }
      }
    }
  }

  .select-Contract-p {
    padding-left: 10px;
    padding-bottom: 8px;
    font-size: 14px;
    background: #f8f8f8;
  }

  .select-Contract-money {
    :nth-child(1) {
      width: auto !important;
    }
  }
}

.van-icon-plus {
  position: fixed;
  right: 20px;
  bottom: 150px;
  z-index: 999;
  width: 30px;
  height: 30px;
  background: #1989fa;
  border-radius: 30px;
  border: 1px solid #1989fa;
  text-align: center;
  line-height: 30px;
  color: #fff;
}
</style>