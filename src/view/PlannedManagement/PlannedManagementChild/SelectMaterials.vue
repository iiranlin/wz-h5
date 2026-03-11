<template>
  <div class="select-materials">
    <div class="detail-base-info">
      <div class="detail-title-content">
        <img src="/static/icon-xqjh.png">
        <span>合同名称：</span>
        <span>{{ contractData.contractName }}</span>
      </div>
      <ul class="detail-list-ul">
        <li>
          <span>合同物资：</span>
          <span>{{ contractData.itemName }}</span>
        </li>
        <li>
          <span>合同编号：</span>
          <span>{{ contractData.contractNo }}</span>
        </li>
        <li>
          <span>供应商：</span>
          <span>{{ contractData.seller }}</span>
        </li>
        <!-- <li class="li-item-overlength">
          <span>计划金额比例：</span>
          <span class="li-span-click">{{ materialUsedRatio }}%</span>
        </li> -->
      </ul>
      <!-- <div class="list-ul-button" v-if="queryType != 'update'">
        <van-tag type="primary" round size="medium" @click="selectClick">选择合同</van-tag>
      </div> -->
    </div>
    <van-sticky class="select-materials-sticky">
      <div class="select-materials-search">
        <p class="select-materials-search-p">
          <van-checkbox v-model="allChecked" @click="allClick">全选</van-checkbox>
          <!-- <img src="/static/icon-return.png"/>
          <span>请选择需求物资</span>
          <span class="select-materials-select">（已选择<span class="select-materials-select-num">{{ materiaId.length }}</span>项）</span> -->
        </p>
        <!-- <van-search v-model="searchValue" placeholder="输入关键字搜索" background="center" :show-action="showAction"
          @search="onSearch" /> -->
        <van-search v-model="searchValue" placeholder="输入关键字搜索" left-icon="none" background="center"
          :show-action="showAction" @search="onSearch">
          <template slot='right-icon'>
            <van-icon name="search" />
          </template>
        </van-search>
      </div>
    </van-sticky>
    <div class="select-materials-list">
      <div class="van-list">
        <van-checkbox-group v-model="materiaId" v-if="filteredList.length" @change="materiaIdChange">
          <van-checkbox :name="item.uniqueNumber || item.allocationUniqueNumber" v-for="(item, index) in filteredList"
            :key="item.uniqueNumber || item.allocationUniqueNumber" :disabled="item.amount === item.cumulativeAmount || item.amount < 0">
            <ul class="list-ul">
              <li>
                <span class="font-weight">{{ index + 1 }}.{{ item.materialName }}</span>
                <!-- <span class="font-weight">{{ item.materialName }}</span> -->
              </li>
              <li>
                <span>规格型号：</span>
                <span>{{ item.specModel }}</span>
              </li>
              <li>
                <span>计量单位：</span>
                <span>{{ item.unit }}</span>
              </li>
              <li>
                <span>合同数量：</span>
                <span>
                  <span class="li-span-click">{{ item.amount }}</span>
                  <span class="negative-warning-trigger" @click.stop="handleNegativeClick(item)">
                        <van-icon
                        v-if="item.negative && item.negative < 0"
                          class="negative-warning-icon"
                          name="warning-o"
                          color="#ee0a24"
                        />
                      </span>
                </span>
              </li>
              <li>
                <span>已累计计划数量：</span>
                <span class="li-span-click">{{ item.cumulativeAmount }}</span>
              </li>
              <!-- <li v-if="item.deliveryDate">
                <span>供应时间：</span>
                <span>{{ item.deliveryDate }}</span>
              </li>
              <li>
                <span>收货人及联系方式：</span>
                <span>{{ item.receiver }}</span>
              </li>
              <li v-if="item.deliveryLocation">
                <span>交货地点：</span>
                <span>{{ item.deliveryLocation }}</span>
              </li> -->
              <li class="li-span-open">
                <span class="li-span-grey" @click.stop="openClick(item)">查看详情<van-icon name="arrow" /></span>
              </li>
            </ul>
          </van-checkbox>
        </van-checkbox-group>
        <van-empty image="/empty-image-default.png" v-else description="暂无数据" />
      </div>
    </div>
    <div class="default-button-container">
      <!-- <van-checkbox v-model="allChecked" shape="square" @click="allClick">全选</van-checkbox> -->
      <div class="default-button-container-selected" @click="selectedClick">
        <img src="@/assets/img/Icon.png" />
        <span>已选择 <span class="li-span-click">{{ materiaId.length }}</span> 项</span>
        <img v-if="materiaId.length"
          :class="{ 'default-button-container-selected-img': $refs.selectedList && $refs.selectedList.sheetShow }"
          src="@/assets/img/Icon-slideup.png" />
      </div>
      <van-button class="button-info" round type="info" @click="addClick">下一步</van-button>
    </div>
    <back-to-top className=".default-container"></back-to-top>
    <selected-list ref="selectedList" :selectedData="materiaList" @deleteCallback="deleteCallback"></selected-list>
    <van-popup
      v-model="negativePopupVisible"
      class="negative-popup"
      round
      position="bottom"
      :style="{ height: '72vh' }"
      @close="handleNegativePopupClose"
    >
      <div class="negative-popup-header">
        <span class="negative-popup-title">补充合同负数物资</span>
        <van-icon name="cross" @click="negativePopupVisible = false" />
      </div>
      <div class="negative-popup-overview" v-if="currentNegativeMaterial">
        <div class="negative-popup-overview-item">
          <span class="negative-popup-overview-label">原合同数</span>
          <span class="negative-popup-overview-value original-amount">{{ getNegativeContractSummary(currentNegativeMaterial).originalAmount }}</span>
        </div>
        <div class="negative-popup-overview-item">
          <span class="negative-popup-overview-label">当前数量</span>
          <span class="negative-popup-overview-value current-amount">{{ getNegativeContractSummary(currentNegativeMaterial).currentAmount }}</span>
        </div>
        <div class="negative-popup-overview-item">
          <span class="negative-popup-overview-label">当前负合同总数</span>
          <span class="negative-popup-overview-value negative-total">{{ currentNegativeMaterial.negative }}</span>
        </div>
      </div>
      <div class="negative-popup-content">
        <div v-if="negativePopupLoading" class="negative-popup-loading">
          <van-loading size="24px" type="spinner" color="#1989fa">加载中...</van-loading>
        </div>
        <div v-else-if="negativeContractList.length" class="negative-contract-list">
          <div
            class="negative-contract-item"
            v-for="(contract, index) in negativeContractList"
            :key="getNegativeContractKey(contract, index)"
          >
            <div class="negative-contract-item-title">{{ index + 1 }}. {{ contract.contractName || '--' }}</div>
            <ul class="negative-contract-item-fields">
              <li><span>标段名称：</span><span>{{ contract.sectionName || '--' }}</span></li>
              <li>
                <span>合同数量：</span>
                <span :class="{ 'negative-amount-text': Number(contract.amount) < 0 }">{{ contract.amount }}</span>
              </li>
              <li><span>物资名称：</span><span>{{ contract.materialName || '--' }}</span></li>
              <li><span>规格型号：</span><span>{{ contract.specModel || '--' }}</span></li>
            </ul>
          </div>
        </div>
        <van-empty v-else image="/empty-image-default.png" description="暂无负数补充合同数据" />
      </div>
    </van-popup>
  </div>
</template>
<script>
import Decimal from 'decimal.js'
import BackToTop from '@/components/BackToTop'
import selectedList from './components/selectedList'
import { materialContractDetail } from '@/api/prodmgr-inv/materialContract'
import { getListBySectionId, mainItemList } from '@/api/prodmgr-inv/materialSectionAllocation'
export default {
  name: 'SelectMaterials',
  components: { BackToTop, selectedList },
  data() {
    return {
      searchValue: '',
      showAction: false,
      loading: false,
      materiaId: [],
      materiaList: [],
      list: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      contractData: {},
      queryType: '',
      allChecked: false,
      materialUsedRatio: '',
      activeNegativeKey: '',
      negativePopupVisible: false,
      negativePopupLoading: false,
      negativeContractList: [],
      currentNegativeMaterial: null
    }
  },
  computed: {
    filteredList() {
      if (!this.searchValue) return this.list; // 如果搜索值为空，返回所有数据
      return this.list.filter(item => item.specModel.includes(this.searchValue) ||
        item.materialName.includes(this.searchValue) ||
        item.unit.includes(this.searchValue) ||
        item.receiver.includes(this.searchValue) ||
        item.deliveryLocation.includes(this.searchValue)
      ); // 过滤匹配的数据项
    }
  },
  activated() {
    this.init()
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { contractId, type, materialUsedRatio } = this.$route.query
      this.queryType = type
      this.materialUsedRatio = materialUsedRatio
      this.materialContractDetail(contractId)
      this.getListBySectionId(contractId)
    },
    onSearch() {

    },
    getItemKey(item) {
      return item.uniqueNumber || item.allocationUniqueNumber
    },
    handleNegativeClick(item) {
      this.activeNegativeKey = this.getItemKey(item)
      this.currentNegativeMaterial = item
      this.negativePopupVisible = true
      this.loadNegativeContracts(item.uniqueNumber || item.allocationUniqueNumber)
    },
    loadNegativeContracts(masterDetailId) {
      if (!masterDetailId) {
        return
      }
      this.negativePopupLoading = true
      this.negativeContractList = []
      mainItemList({ uniqueNumber:masterDetailId }).then((res) => {
        const responseData = res && res.data !== undefined ? res.data : {}
        const list = Array.isArray(responseData.list) ? responseData.list : (Array.isArray(responseData) ? responseData : [])
        this.negativeContractList = list
      }).catch(() => {
      }).finally(() => {
        this.negativePopupLoading = false
      })
    },
    getNegativeContractKey(contract, index) {
      return contract.id || `${index}-${contract.contractName || ''}`
    },
    toNumber(value) {
      const numberValue = Number(value)
      return Number.isFinite(numberValue) ? numberValue : 0
    },
    getNegativeContractSummary(source = {}) {
      const currentAmount = this.toNumber(source.amount)
      const negativeAmount = this.toNumber(source.negative)
      const originalAmount = new Decimal(currentAmount)
        .plus(new Decimal(negativeAmount).abs())
        .toNumber()

      return {
        currentAmount,
        negativeAmount,
        originalAmount
      }
    },
    handleNegativePopupClose() {
      this.negativePopupLoading = false
      this.negativeContractList = []
      this.currentNegativeMaterial = null
    },
    getListBySectionId(contractId) {
      this.loading = true
      getListBySectionId({ contractId }).then(({ data }) => {
        this.materiaId = (this.$store.state.public.materiaList || []).map(item => item.uniqueNumber || item.allocationUniqueNumber)
        this.materiaList = this.$store.state.public.materiaList
        let interfaceMateriaList = (this.$store.state.public.interfaceMateriaList || [])
        let dataList = interfaceMateriaList.concat(data)
        dataList = dataList.filter((item, index, self) => {
          return self.findIndex(t => ((t.uniqueNumber || t.allocationUniqueNumber) === (item.uniqueNumber || item.allocationUniqueNumber))) === index;
        }).map((item) => {
          let Obj = item
          interfaceMateriaList.map((val) => {
            if ((item.uniqueNumber || item.allocationUniqueNumber) == val.allocationUniqueNumber) {
              Obj = Object.assign({}, item, { cumulativeAmount: Number(item.cumulativeAmount) - Number(val.planAmount) || 0 })
            }
          })
          return Obj
        })

        const listDataA = dataList.filter(item => item.amount === item.cumulativeAmount)
        const listDataB = dataList.filter(item => !(item.amount === item.cumulativeAmount))
        this.list = listDataB.concat(listDataA)
        this.allChecked = this.materiaId.length === this.list.filter(item => item.amount > item.cumulativeAmount).map(item => (item.uniqueNumber || item.allocationUniqueNumber)).length
      }).finally((err) => {
        this.loading = false
      })
    },
    materialContractDetail(contractId) {
      materialContractDetail(contractId).then(({ data }) => {
        this.contractData = data
      })
    },
    selectClick() {
      this.$router.push({ name: 'SelectContract' })
    },
    addClick() {
      if (!this.materiaId.length) {
        this.$notify({ type: 'warning', message: '请选择需求物资' });
        return
      }
      this.$store.dispatch('public/setMateriaList', this.materiaList)
      const { contractId, id, materialUsedRatio } = this.$route.query
      const query = this.queryType == 'update' ? { contractId, type: this.queryType, id, materialUsedRatio } : { contractId, materialUsedRatio }
      this.$router.push({ name: 'SaveMaterials', query })
    },
    allClick() {
      if (this.allChecked) {
        this.materiaId = this.filteredList.filter(item => item.amount > item.cumulativeAmount).map(item => item.uniqueNumber || item.allocationUniqueNumber)
      } else {
        this.materiaId = []
      }
    },
    materiaIdChange() {
      this.allChecked = this.materiaId.length === this.filteredList.filter(item => item.amount > item.cumulativeAmount).map(item => (item.uniqueNumber || item.allocationUniqueNumber)).length
      this.$nextTick(() => {
        let materiaList = this.$store.state.public.materiaList.filter(item => this.materiaId.includes(item.uniqueNumber || item.allocationUniqueNumber))
        const list = this.list.filter(item => this.materiaId.includes(item.uniqueNumber || item.allocationUniqueNumber))
        materiaList = materiaList.concat(list)
        let obj = {}
        this.materiaList = materiaList.reduce((cur, next) => {
          obj[next.uniqueNumber || next.allocationUniqueNumber] ? "" : obj[next.uniqueNumber || next.allocationUniqueNumber] = true && cur.push(next);
          return cur;
        }, [])
      })
    },
    selectedClick() {
      if (this.materiaId.length) {
        this.$refs.selectedList.init()
        return
      }
    },
    deleteCallback(index) {
      this.materiaList.splice(index, 1)
      this.materiaId = this.materiaList.map(item => item.uniqueNumber || item.allocationUniqueNumber)
      if (!this.materiaId.length) {
        this.$refs.selectedList.init()
      }
    },
    openClick(item) {
      this.$router.push({ name: 'MaterialDetailsView', query: { item: JSON.stringify(item) } })
    }
  }
}
</script>
<style lang="less" scoped>
.select-materials {
  display: flex;
  flex-direction: column;
  background: #f8f8f8;

  .detail-list-ul {
    padding-left: 33px;
  }

  .select-materials-sticky {
    ::v-deep .van-sticky {
      background: #f8f8f8;
    }
  }


  .select-materials-search {
    display: flex;
    justify-content: space-between;

    .select-materials-search-p {
      font-size: 14px;
      padding-left: 13px;

      .van-checkbox {
        height: 100%;
        margin-left: 2px;

        ::v-deep .van-checkbox__icon {
          font-size: 18px;

          .van-icon {
            border: 1px solid #1989fa;
          }
        }
      }
    }
  }

  .van-search {
    width: 222px;

    .van-search__content {
      border-radius: 50px;
      background: #fff;
    }

    .van-cell {
      border-radius: 50px;
      background: #fff;
    }
  }

  .select-materials-list {
    height: 100%;
  }

  .van-list {
    background: #f8f8f8;
    padding-bottom: 60px;

    .van-checkbox {
      box-sizing: border-box;
      margin-left: 6px;
      margin-right: 6px;
      margin-bottom: 10px;
      background: #ffffff;
      border-radius: 7px;
      box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
      position: relative;
      padding: 10px;
      align-items: baseline;

      ::v-deep .van-checkbox__icon {
        font-size: 18px;

        .van-icon {
          border: 1px solid #1989fa;
        }
      }

      ::v-deep .van-checkbox__label {
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

  .default-button-container {
    justify-content: space-between;
    padding-left: 14px;
    padding-right: 19px;
    box-sizing: border-box;
    box-shadow: 4px 0px 5px rgba(32, 30, 74, 0.1);
    z-index: 10000;

    .default-button-container-selected {
      font-size: 13px;

      &>span {
        vertical-align: middle;
      }

      img {
        width: 28px;
        height: 28px;
        vertical-align: middle;
      }

      .default-button-container-selected-img {
        transform: rotate(180deg)
      }
    }

    .button-info {
      width: 169px;
      height: 34px;
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

.list-ul-button {
  span {
    float: right;
    background-color: #edf2ff;
    border: 1px solid #289fec;
    color: #1d93ff;
  }
}

.contract-amount-wrapper {
  display: inline-flex;
  align-items: flex-end;
  gap: 4px;
}

.negative-warning-icon {
  font-size: 16px;
}

.negative-warning-trigger {
  display: inline-flex;
  align-items: center;
  padding: 4px;
}

.negative-popover-text {
  max-width: 260px;
  word-break: break-all;
  font-size: 12px;
  line-height: 1.5;
}

.negative-popup {
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
}

.negative-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  color: #151b3e;
}

.negative-popup-title {
  font-weight: 600;
}

.negative-popup-overview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px 10px;
  border-bottom: 1px solid #f6f6f6;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.negative-popup-overview-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(21, 27, 62, 0.06);
}

.negative-popup-overview-label {
  font-size: 13px;
  color: #6b7280;
}

.negative-popup-overview-value {
  font-size: 16px;
  font-weight: 600;
}

.original-amount {
  color: #1565d8;
}

.current-amount {
  color: #ed6a0c;
}

.negative-total {
  color: #ee0a24;
}

.negative-popup-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px 16px;
  background: #f8f8f8;
}

.negative-popup-loading {
  display: flex;
  justify-content: center;
  padding-top: 80px;
}

.negative-contract-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.negative-contract-item {
  background: #fff;
  border-radius: 8px;
  padding: 10px 12px;
  box-shadow: 0 2px 5px rgba(32, 30, 74, 0.08);
}

.negative-contract-item-title {
  font-weight: 600;
  color: #151b3e;
  margin-bottom: 8px;
}

.negative-contract-item-fields {
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    line-height: 1.7;
    font-size: 12px;
    color: #666;
  }
}

.negative-amount-text {
  color: #ee0a24;
}
</style>
