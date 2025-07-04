<template>
  <div class="select-materials">
    <van-sticky class="select-materials-sticky">
      <div class="select-materials-contract">
        <ul class="list-ul">
          <li>
            <span class="font-weight">合同名称：</span>
            <span class="font-weight">{{ contractData.contractName }}</span>
          </li>
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
          <li class="select-Contract-money">
            <span style="color: red;">计划金额比例：</span>
            <span style="color: red;">{{ contractData.materialUsedRatio }}%</span>
          </li>
          <li class="li-status" v-if="queryType != 'update'">
            <van-tag type="primary" round size="medium" @click="selectClick">选择合同</van-tag>
          </li>
        </ul>
      </div>
      <div class="select-materials-search">
        <p class="select-materials-search-p font-weight">请选择需求物资<span class="select-materials-select">（已选择<span
              class="select-materials-select-num">{{ materiaId.length }}</span>项）</span></p>
        <van-search v-model="searchValue" placeholder="输入规格型号" background="center" :show-action="showAction"
          @search="onSearch" />
      </div>
    </van-sticky>
    <div class="select-materials-list">
      <div class="van-list">
        <van-checkbox-group v-model="materiaId" v-if="filteredList.length">
          <van-checkbox shape="square" :name="item.uniqueNumber" v-for="item in filteredList" :key="item.uniqueNumber" :disabled="item.amount === item.cumulativeAmount">
            <ul class="list-ul">
              <li>
                <span class="font-weight">物资名称：</span>
                <span class="font-weight">{{ item.materialName }}</span>
              </li>
              <li>
                <span>规格型号：</span>
                <span>{{ item.specModel }}</span>
              </li>
              <li class="li-item-both">
                <div class="li-item-left">
                  <span>计量单位：</span>
                  <span>{{ item.unit }}</span>
                </div>
                <div class="li-item-right">
                  <span>合同数量：</span>
                  <span>{{ item.amount }}</span>
                </div>
              </li>
              <li>
                <span style="color: red;">已累计计划数量：</span>
                <span style="color: red;">{{ item.cumulativeAmount }}</span>
              </li>
              <li>
                <span>供应时间：</span>
                <span>{{ item.deliveryDate }}</span>
              </li>
              <li>
                <span>收货人及联系方式：</span>
                <span>{{ item.receiver }}</span>
              </li>
              <li>
                <span>使用地点：</span>
                <span>{{ item.deliveryLocation }}</span>
              </li>
            </ul>
          </van-checkbox>
        </van-checkbox-group>
        <van-empty v-else description="暂无数据" />
      </div>
    </div>
    <div class="default-button-container">
      <van-button class="button-info" round type="info" @click="addClick">下一步</van-button>
    </div>
    <back-to-top className=".default-container"></back-to-top>
  </div>
</template>
<script>
import BackToTop from '@/components/BackToTop'
import { materialContractDetail } from '@/api/prodmgr-inv/materialContract'
import { getListBySectionId } from '@/api/prodmgr-inv/materialSectionAllocation'
export default {
  name: 'SelectMaterials',
  components: { BackToTop },
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
      queryType: ''
    }
  }, 
  computed: {
    filteredList() {
      if (!this.searchValue) return this.list; // 如果搜索值为空，返回所有数据
      return this.list.filter(item => item.specModel.includes(this.searchValue)); // 过滤匹配的数据项
    }
  },
  activated() {
    this.init()
  },
  mounted() {
    this.init()
  },
  methods: {
    init () {
      const {contractId, type} = this.$route.query
      this.queryType = type
      this.materialContractDetail(contractId)
      this.getListBySectionId(contractId)
    },
    onSearch() {

    },
    getListBySectionId(contractId) {
      this.loading = true
      getListBySectionId({ contractId }).then(({ data }) => {
        // this.list = data //.filter( (row) => Number(row.cumulativeAmount) < Number(row.amount)) || []
        this.materiaId = (this.$store.state.public.materiaList || []).map(item => item.uniqueNumber || item.allocationUniqueNumber)
        this.materiaList = this.$store.state.public.materiaList
        const listDataA = data.filter( item => item.amount === item.cumulativeAmount)
        const listDataB = data.filter( item => !(item.amount === item.cumulativeAmount))
        this.list = listDataB.concat(listDataA)
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
      this.materiaList = this.list.filter(item => this.materiaId.includes(item.uniqueNumber))
      this.$store.dispatch('public/setMateriaList', this.materiaList)
      const {contractId, id} = this.$route.query
      const query = this.queryType == 'update'?{contractId, type: this.queryType, id }:{contractId}
      this.$router.push({ name: 'SaveMaterials', query })
    }
  }
}
</script>
<style lang="less" scoped>
.select-materials {
  display: flex;
  flex-direction: column;

  .select-materials-sticky {
    ::v-deep .van-sticky {
      background: #f8f8f8;
    }
  }

  .select-materials-contract {
    margin-top: 10px;
    box-sizing: border-box;
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 10px;

    .li-status {
      top: auto;
      bottom: 12px;

      span {
        background-color: #edf2ff;
        border: 1px solid #289fec;
        color: #1d93ff;
      }
    }
  }

  .select-materials-search {
    display: flex;
    justify-content: space-between;

    .select-materials-search-p {
      font-size: 14px;
      line-height: 38px;
      padding: 0 10px;
    }

    .select-materials-select {
      font-size: 12px;
    }

    .select-materials-select-num {
      color: #1d93ff;
    }
  }

  .van-search {
    padding-top: 0;
    width: 165px;

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
    padding-bottom: 40px;

    .van-checkbox {
      box-sizing: border-box;
      margin-left: 8px;
      margin-right: 8px;
      margin-bottom: 10px;
      background: #ffffff;
      border-radius: 7px;
      box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
      position: relative;
      padding: 10px;

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

  .select-Contract-p {
    padding-left: 10px;
    padding-bottom: 8px;
    font-size: 14px;
  }

  .button-info {
    // min-width: 150px;
  }

  .select-Contract-money {
    :nth-child(1) {
      width: auto !important;
    }
    :nth-child(2) {
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