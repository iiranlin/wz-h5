<template>
  <div class="edited-materials">
    <div class="detail-base-info">
      <div class="detail-title-content">
        <img src="/static/icon-xqjh.png">
        <span>{{ sectionInfo.materialName }}</span>
      </div>
      <ul class="detail-list-ul">
        <li>
          <span>供应商：</span>
          <span>{{ sectionInfo.sellerName }}</span>
        </li>
        <li>
          <span>规格型号：</span>
          <span>{{ sectionInfo.specModel }}</span>
        </li>
        <li>
          <span>计量单位：</span>
          <span>{{ sectionInfo.unit }}</span>
        </li>
        <li>
          <span >合同数量：</span>
          <span>{{ sectionInfo.amount }}</span>
        </li>
        <li>
          <span >累计计划量（含本次）：</span>
          <span>{{ cumulativeAmount(sectionInfo) }}</span>
        </li>
      </ul>
      <ul class="detail-list-ul-edited">
        <li class="detail-list-ul-input">
          <van-field label="本次计划数量" placeholder="请输入数量" required clearable :label-width="240" :rules="rules.planAmount" input-align="right">
            <template #input>
              <van-stepper v-model="sectionInfo.planAmount" :rules="rules.planAmount"/>
            </template>
          </van-field>
        </li>
      </ul>
    </div>
    <div class="detail-base-info detail-base-info-edited">
      <div class="detail-title-content">
        <img src="/static/icon-address.png"/>
        <span>{{ sectionInfo.materialName }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import keepPages from '@/view/mixins/keepPages'
export default {
  name: 'EditedMaterials',
  mixins: [keepPages],
  components: {},
  data() {
    return {
      sectionInfo: {},
      queryType: '',
      rules: {
        planAmount: [
          { required: true, message: '请输入本次计划数量' },
        ],
      }
    }
  },
  activated() {
  },
  mounted() {
    const { uniqueNumber = null, type = '' } = this.$route.query
    this.queryType = type
    const data = this.$store.state.public.materiaList || []
    this.init(uniqueNumber, data)
  },
  methods: {
    init(uniqueNumber, data) {
      this.sectionInfo = data.filter(item => item.uniqueNumber === uniqueNumber || item.allocationUniqueNumber === uniqueNumber)[0]
    },
    cumulativeAmount(item) {
      return this.queryType == 'update' ? Number(item.cumulativeAmount) - Number(item.backPlanAmount || 0) + (Number(item.planAmount) || 0) : Number(item.cumulativeAmount) + (Number(item.planAmount) || 0)
    },
  }
}
</script>
<style lang="less" scoped>
.edited-materials{

  .detail-list-ul-edited{
    margin: 0 7px;
    border-top: 1px solid #e3e3e3;
    .detail-list-ul-input{
      & :nth-child(2){
        text-align: center;
      }
      ::v-deep .van-cell__title{
        color: #151b3e;
      }
      .van-cell{
        padding-left: 23px;
        padding-right: 10px;
      }
      .van-stepper{
        border: 1px solid #dbdbdb;
        border-radius: 5px;
        ::v-deep .van-stepper__input{
          background: #fff;
          width: 50px;
        }
      }
    }
  }
  .detail-base-info-edited{
    width: auto;
    box-sizing: border-box;
    margin-left: 6px;
    margin-right: 6px;
    margin-bottom: 8px;
    margin-top: 8px;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 2px 5px rgba(32, 30, 74, 0.1);
    position: relative;
    padding: 5px;
  }
}
</style>