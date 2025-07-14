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
        <li class="li-item-overlength">
          <span style="color: red;">计划金额比例：</span>
          <span style="color: red;">{{ contractData.materialUsedRatio }}%</span>
        </li>
      </ul>
      <div class="list-ul-button" v-if="queryType != 'update'">
        <van-tag type="primary" round size="medium" @click="selectClick">选择合同</van-tag>
      </div>
    </div>
    <van-sticky class="select-materials-sticky">
      <div class="select-materials-search">
        <p class="select-materials-search-p font-weight">
      <img src="/static/icon-return.png"/>
      <span>请选择需求物资</span>
      <span class="select-materials-select">（已选择<span class="select-materials-select-num">{{ materiaId.length }}</span>项）</span></p>
      <van-search v-model="searchValue" placeholder="输入规格型号" background="center" :show-action="showAction"
        @search="onSearch" />
      </div>
    </van-sticky>
    <div class="select-materials-list">
      <div class="van-list">
        <van-checkbox-group v-model="materiaId" v-if="filteredList.length" @change="materiaIdChange">
          <van-checkbox shape="square" :name="item.uniqueNumber" v-for="item in filteredList" :key="item.uniqueNumber || item.allocationUniqueNumber"
            :disabled="item.amount === item.cumulativeAmount">
            <ul class="list-ul">
              <li>
                <span class="font-weight">物资名称：</span>
                <span class="font-weight">{{ item.materialName }}</span>
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
                <span class="li-span-click">{{ item.amount }}</span>
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
                <span>交货地点：</span>
                <span>{{ item.deliveryLocation }}</span>
              </li>
            </ul>
          </van-checkbox>
        </van-checkbox-group>
        <van-empty v-else description="暂无数据" />
      </div>
    </div>
    <div class="default-button-container">
      <van-checkbox v-model="allChecked" shape="square" @click="allClick">全选</van-checkbox>
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
      queryType: '',
      allChecked: false
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
    init() {
      const { contractId, type } = this.$route.query
      this.queryType = type
      this.materialContractDetail(contractId)
      this.getListBySectionId(contractId)
    },
    onSearch() {

    },
    getListBySectionId(contractId) {
      this.loading = true
      getListBySectionId({ contractId }).then(({ data }) => {
        this.materiaId = (this.$store.state.public.materiaList || []).map(item => item.uniqueNumber || item.allocationUniqueNumber)
        this.allChecked = this.materiaId.length === data.length
        this.materiaList = this.$store.state.public.materiaList
        let interfaceMateriaList = (this.$store.state.public.interfaceMateriaList || [])
        
        data = data.map( (item) => {
          let Obj = item
          interfaceMateriaList.map((val) => {
            if(item.uniqueNumber == (val.uniqueNumber || val.allocationUniqueNumber)){
              Obj = Object.assign({}, item, {cumulativeAmount: Number(item.cumulativeAmount) - Number(val.planAmount) || 0})
            }
          })
          return Obj
        })
        
        const listDataA = data.filter(item => item.amount === item.cumulativeAmount)
        const listDataB = data.filter(item => !(item.amount === item.cumulativeAmount))
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
      let materiaList = this.materiaList.filter(item => this.materiaId.includes(item.uniqueNumber || item.allocationUniqueNumber))
      const list = this.list.filter(item => this.materiaId.includes(item.uniqueNumber))
      materiaList = materiaList.concat(list)
      console.log(materiaList)
      let obj = {}
      this.materiaList = materiaList.reduce((cur, next) => {
        obj[next.uniqueNumber || next.allocationUniqueNumber] ? "" : obj[next.uniqueNumber || next.allocationUniqueNumber] = true && cur.push(next);
        return cur;
      }, [])
      this.$store.dispatch('public/setMateriaList', this.materiaList)
      const { contractId, id } = this.$route.query
      const query = this.queryType == 'update' ? { contractId, type: this.queryType, id } : { contractId }
      this.$router.push({ name: 'SaveMaterials', query })
    },
    allClick () {
      if(this.allChecked){
        this.materiaId = this.filteredList.filter(item => item.amount > item.cumulativeAmount).map(item => item.uniqueNumber)
      }else{
        this.materiaId = []
      }
    },
    materiaIdChange () {
      this.allChecked = this.materiaId.length === this.filteredList.filter(item => item.amount > item.cumulativeAmount).map(item => item.uniqueNumber).length
    }
  }
}
</script>
<style lang="less" scoped>
.select-materials {
  display: flex;
  flex-direction: column;
  background: #f8f8f8;

  .select-materials-sticky {
    ::v-deep .van-sticky {
      background: #f8f8f8;
    }
    img{
      width: 0.6rem;
      height: 0.6rem;
      vertical-align: middle;
    }
    span{
      vertical-align: middle;
    }
  }


  .select-materials-search {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;

    .select-materials-search-p {
      font-size: 14px;
      line-height: 35px;
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
    padding-bottom: 60px;

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

.list-ul-button {
  span {
    float: right;
    background-color: #edf2ff;
    border: 1px solid #289fec;
    color: #1d93ff;
  }
}
</style>