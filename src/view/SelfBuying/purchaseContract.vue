<!-- 采购合同核备列表 -->
<template>
  <div class="tab-list in-out-management-list default-scroll">
    <van-sticky>
      <div class="list-search-container">
        <van-search v-model="formData.keywords" placeholder="输入关键字搜索" shape="round" left-icon="none"
          @search="handeSearchClick()">
          <template slot='right-icon'>
            <van-icon name="search" @click="handeSearchClick()" />
          </template>
        </van-search>
      </div>
      <van-tabs sticky v-model="menuActiveIndex" color="#0571ff" title-active-color="#0571ff"
        title-inactive-color="#2e2e2e" @change="tabsChange">
        <van-tab v-for="item in tabList" :title="item.title" :name="item.status" :key="item.status">
        </van-tab>
      </van-tabs>
    </van-sticky>
    <div v-if="dataList.length > 0">
      <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
        <van-list v-model="listLoading" :finished="allFinished" finished-text="没有更多了..." :immediate-check="false"
          @load="onLoad">

          <div v-for="(item, index) in dataList" :key="index" class="box-container" @click="handleDetail(item)">
            <div class="list-title-content">
              <span class="li-span-grey">合同编号：</span>
              <span class="li-span-grey">{{ item.contractNumber }}</span>
              <div class="li-title-status">
                <img :src="checkAuditStatus(item.status)" />
                <span :style="handlerTextColor(tabList, 'status', item.status)" :type="item.status | statusStyleFilter"
                  round size="medium" :class="{ 'li-status-completed': item.status == 0 }">{{
                    item.status | statusFilter(tabList)
                  }}
                </span>
              </div>
            </div>
            <ul class="list-ul">
              <li>
                <span class="font-weight">合同名称：{{ item.contractName
                  }}</span>
              </li>
              <li>
                <span>标段项目：</span>
                <span>{{ item.sectionShortName }}</span>
              </li>
              <!-- <li>
                <span>证书有效期：</span>
                <span>{{ item.licenseTime }}</span>
              </li> -->
              <li>
                <span>供应商：</span>
                <span>{{ item.supplierName }}</span>
              </li>
              <li>
                <span>买方：</span>
                <span>{{ item.unitName }}</span>
              </li>
              <li>
                <span>物资种类：</span>
                <span>{{ item.purchaseTypeName }}</span>
              </li>
              <!-- <li>
                <span>铁路专用产品：</span>
                <span>{{ item.railwaySpecial == '1' ? '是' : '否' }}</span>
              </li> -->
              <li>
                <span>合同金额(万元)：</span>
                <span>{{ item.amount }}</span>
              </li>
              <li>
                <span>提交人：</span>
                <span>{{ item.createUserName }}</span>
              </li>
              <li>
                <span>提交时间：</span>
                <span>{{ item.createDate | formatToDate }}</span>
              </li>
            </ul>
            <div class="list-ul-button">
              <!-- 未提交、已驳回可修改 -->
              <van-button class="button-info" plain round type="info" v-if="[1, 0].includes(item.status)"
                @click.stop="handleSelfBuying(item)">修改</van-button>

              <!-- 未提交、已驳回可提交审核 -->
              <van-button class="button-info" round type="info" v-if="[1, 0].includes(item.status)"
                @click.stop="handleDoAccept(item)">提交审核</van-button>

              <!-- 未提交、已驳回可删除 -->
              <van-button class="button-info" plain round type="danger" v-if="[1, 0].includes(item.status)"
                @click.stop="handleDeleteClick(item)">删除</van-button>

              <!-- 所有状态均可查看详情 -->
              <van-button class="button-info" plain round type="info" @click.stop="handleDetail(item)">详情</van-button>

              <!--  审核中可撤回 -->
              <van-button class="button-info" plain round type="info" v-if="[2].includes(item.status)"
                @click.stop="recallClick(item)">撤回</van-button>

              <!-- 未提交不可查看流程 -->
              <van-button class="button-info" plain round type="info" v-if="item.status != 1"
                @click.stop="handleProcessClick(item)">查看流程</van-button>

              <!--  审核通过并且是铁路专用产品才能更新证书 -->
              <!-- <van-button class="button-info" round type="info"
                v-if="[3].includes(item.status) && item.railwaySpecial == 1"
                @click.stop="handleUpdateFile(item)">证书更新</van-button> -->
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

    <van-icon name="plus" @click="handleSelfBuying()" />
    <back-to-top :className="className"></back-to-top>
    <activiti-assignee ref="activitiAssignee" @optionsSuccess="optionsSuccess"></activiti-assignee>
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
import indexMixin from '@/view/mixins'
import BackToTop from '@/components/BackToTop'
import activitiAssignee from '@/components/activitiAssignee'

import { materialPurchaseContractList, batchRemoveContract, materialPurchaseContractSubmit } from '@/api/prodmgr-inv/SelfBuying'
import { recall } from '@/api/prodmgr-inv/audit'

export default {
  name: 'purchaseContract',
  mixins: [keepPages, indexMixin],
  components: { BackToTop, activitiAssignee },
  data() {
    return {
      className: '.in-out-management',

      menuActiveIndex: '',

      formData: {
        keywords: ''
      },
      tabList: [
        { title: '全部', status: '', color: '' },
        { title: '未提交', status: 1, color: '#134daa' },
        { title: '审核中', status: 2, color: '#134daa' },
        { title: '已通过', status: 3, color: '#51CA40' },
        { title: '已驳回', status: 0, color: '#CE2320' },
      ],
      dataList: [],
      allRefreshLoading: false,
      listLoading: false,
      allFinished: false,
      allListQuery: {
        pageNum: 0,
        pageSize: 10
      },
    }
  },
  computed: {
    activeTab() {
      return this.$store.getters.activeTab
    }
  },
  filters: {
    statusFilter(status, tabList) {
      return tabList.find(item => item.status === status).title
    },
    statusStyleFilter(status) {
      const statusMap = [
        { status: '1', type: 'primary' },
        { status: '2', type: 'success' },
        { status: '3', type: 'danger' },
        { status: '0', type: 'default' },
      ]
      return statusMap.find(item => item.status == status).type
    },
    formatDate(value) {
      if (value) {
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        return `${y}-${m}-${d}`;
      } else {
        return ""
      }
    },
    formatToDate(value) {
      if (value) {
        const dt = new Date(value);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + '').padStart(2, '0');
        const d = (dt.getDate() + '').padStart(2, '0');
        const hh = (dt.getHours() + '').padStart(2, '0');
        const mm = (dt.getMinutes() + '').padStart(2, '0');
        const ss = (dt.getSeconds() + '').padStart(2, '0');
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      } else {
        return ""
      }
    }

  },
  created() {
    this.allRefresh();
  },
  activated() {
    this.allRefresh();
  },
  methods: {
    // 查看流程点击
    handleProcessClick(item) {
      this.$router.push({
        name: "MyProcess",
        params: {
          businessType: "CGHT",
          businessId: item.id
        }
      })
    },
    // 列表
    getList() {
      let params = { pageNum: this.allListQuery.pageNum, pageSize: this.allListQuery.pageSize, queryField: this.formData.keywords, status: this.menuActiveIndex }
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      materialPurchaseContractList(params).then((res) => {
        if (res.success) {
          this.listLoading = false //加载结束
          if (this.allRefreshLoading) {
            this.dataList = [];
            this.allRefreshLoading = false;
          }
          if (this.allListQuery.pageNum === 1) {
            this.dataList = res.data.list
          } else {
            this.dataList = [...this.dataList, ...res.data.list]
          }
          if (this.dataList.length == res.data.total) {
            this.allFinished = true
          } else {
            this.allFinished = false
          }
        }
      }).finally(() => {
        toast.clear();
      });
    },

    // 详情
    handleDetail(item) {
      this.$router.push({ name: 'perfectContractDetail', query: { ...item } });
    },

    // 新增/修改
    handleSelfBuying(item) {
      const query = item ? { id: item.id, type: 'update' } : { type: 'create' };

      this.$router.push({ name: 'perfectContract', query: query })
    },

    // 提交审核点击
    handleDoAccept(item) {
      this.$dialog.confirm({
        message: '确认要提交审核吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.$refs.activitiAssignee.init("CGHT", item)
      })
    },

    // 搜索点击
    handeSearchClick() {
      this.allListQuery.pageNum = 1
      this.getList()
    },
    // 全部列表刷新
    allRefresh() {
      this.allListQuery.pageNum = 1
      this.getList()
    },
    onLoad() {
      this.allListQuery.pageNum++
      this.getList()
    },

    // 审核状态展示图标
    checkAuditStatus(status) {
      if (status == '1') {
        return '/static/newIcon_notfiled.png'
      } else if (status == '2') {
        return '/static/newIcon_audit.png'
      } else if (status == '3') {
        return '/static/newIcon_tookEffect.png'
      } else if (status == '0') {
        return '/static/newIcon_Rejected.png'
      }
    },

    // tab切换
    tabsChange() {
      this.allRefresh();
    },

    // 选择审核人回调
    optionsSuccess(assignee, { id }) {
      materialPurchaseContractSubmit({ ids: [id], assignee }).then(() => {
        this.$toast('提交审核成功')
        this.allRefresh()
      })
    },

    // 去审核点击
    handleExamineClick(item) {
      this.$dialog.confirm({
        message: '确认要提交审核吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.$refs.activitiAssignee.init('CGHT', item)
      })
    },

    // 撤回
    recallClick({ id }) {
      this.$dialog.confirm({
        message: '是否确认撤回?',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        return recall({ businessId: id, businessType: 'CGHT' })
      }).then(() => {
        this.$toast("撤回成功")
        this.getList()
      })
    },

    // 删除
    handleDeleteClick(item) {
      this.$dialog.confirm({
        message: '是否确认删除？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.handleDelete(item);
      })
    },

    handleDelete(item) {
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在加载...",
        forbidClick: true
      });
      batchRemoveContract({ ids: [item.id] }).then(({ message }) => {
        this.$toast(message);

        this.getList();
      }).finally(() => {
        toast.clear();
      });
    },

    // 更新证书
    async handleUpdateFile(item) {
      this.$router.push({ name: 'certificateUpdate', query: { ...item } });
    },
  }
}
</script>
<style lang="less" scoped>
.list-ul-button {
  display: flex;
  flex-wrap: nowrap;
  /* 不换行 */
  overflow-x: auto;
  /* 允许横向滚动 */
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  /* 移动端平滑滚动 */
  gap: 7px;
  /* 按钮之间留点间距 */
}

/* 隐藏滚动条（可选） */
.list-ul-button::-webkit-scrollbar {
  display: none;
}

/* 按钮数量 ≤ 4 时右对齐 */
// .list-ul-button:has(> :nth-child(4):last-child),
.list-ul-button:has(> :nth-child(3):last-child),
.list-ul-button:has(> :nth-child(2):last-child),
.list-ul-button:has(> :nth-child(1):last-child) {
  justify-content: flex-end;
}


.in-out-management-list {

  ::v-deep .van-tabs__wrap {
    margin-bottom: 10px !important;
    height: 44px !important;
  }

  ::v-deep .van-sticky--fixed {
    top: 0px !important;
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
