<template>
  <div class="supply-overview">
    <div class="detail-base-info">
      <div class="detail-title-content">
        <img src="/static/icon-xqjh.png">
        <span>需求编号：</span>
        <span>{{detailGyMx.planNumber}}</span>
      </div>
      <ul class="detail-ul">
        <li>
          <span>需求名称：</span>
          <span>{{ detailGyMx.planName }}</span>
        </li>
        <li>
          <span>建设项目：</span>
          <span>{{ detailGyMx.projectName }}</span>
        </li> 
        <li>
          <span>标段项目：</span>
          <span>{{ detailGyMx.sectionName }}</span>
        </li>
        <li>
          <span>需求组织：</span>
          <span>{{ detailGyMx.deptName }}</span>
        </li>
        <li>
          <span>提报人：</span>
          <span>{{ detailGyMx.createUserName }}</span>
        </li>
        <li>
          <span>提报时间：</span>
          <span>{{ parseTime(detailGyMx.createDate, '{y}-{m}-{d} {h}:{i}') }}</span>
        </li>
      </ul>
    </div>
    <div class="detail-base-info detail-base-info-edited" v-if="detailGyMx.fileList[0]?.fileList.length">
      <div class="detail-title-content">
        <img src="/static/icon-file.png" />
        <span>计划附件</span>
      </div>
      <file-download-view :fileList="detailGyMx.fileList[0]?.fileList || []"></file-download-view>
    </div>
    <div class="detail-floor-content">
      <img src="/static/icon-return.png"/>
      <span>供应信息</span>
    </div>
    <div class="box-container" v-for="(item, index) in detailGyMx.demandPlanDetailsGyDTOList" :key="index">
      <div>
        <div class="detail-list-title-content">
          <span>供应商：</span>
          <span>{{item.sellerName}}</span>
        </div>
        <ul class="detail-list-ul detail-ul-mian">
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
          <li class="li-item-overlength">
            <span>累计计划量(含本次)：</span>
            <span class="li-span-click">{{ item.cumulativeAmount }}</span>
          </li>
          <li class="li-item-overlength">
            <span>本次计划数量：</span>
            <span class="li-span-click">{{ item.planAmount }}</span>
          </li>
          <li class="li-item-both">
            <div class="li-item-left li-item-left-num">
              <span>已发货：</span>
              <span class="li-span-click">{{ item.sendTotal }}</span>
            </div>
            <div class="li-item-right">
              <span>已验收：</span>
              <span class="li-span-click">{{ item.putTotal }}</span>
            </div>
          </li>
          <li class="li-item-both">
            <div class="li-item-left li-item-left-num">
              <span>已入库：</span>
              <span class="li-span-click">{{ item.storeTotal }}</span>
            </div>
            <div class="li-item-right">
              <span>已出库：</span>
              <span class="li-span-click">{{ item.outCkTotal }}</span>
            </div>
          </li>
          <li class="li-item-both">
            <div class="li-item-right">
              <span>已退回：</span>
              <span class="li-span-click">{{ item.refundAllTotle }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="box-container" v-if="detailGyMx.demandPlanDetailsGyDTOList && detailGyMx.demandPlanDetailsGyDTOList.length == 0">
      <van-empty image="/empty-image-default.png" description="暂无数据" />
    </div>
  </div>
</template>
<script>
import { materialDemandPlanRestDetailGyMx } from '@/api/prodmgr-inv/materialDemandPlanRest'
import FileDownloadView from "@/components/FileDownloadView.vue"
export default {
  name: 'SupplyOverview',
  components: {FileDownloadView},
  data() {
    return {
      detailGyMx: {}
    }
  },
  created() {
  },
  activated() {
  },
  mounted () {
    const id = this.$route.query.id
    id && this.materialDemandPlanRestDetailGyMx(id)
  },
  methods: {
    materialDemandPlanRestDetailGyMx (id) {
      const params = { pageNum: 1, pageSize: -1, id }
      materialDemandPlanRestDetailGyMx(params).then(({data}) => {
        this.detailGyMx = data
      })
    }
  },
}
</script>
<style lang="less" scoped>
.box-container{
  padding: 0;
}
.supply-overview{
  .li-item-left{
    flex: 1;
    min-width: auto !important;
  }
  .li-item-right{
    flex: 1;
    width: auto !important;
  }
  .select-materials-search{
    display: flex;
    justify-content: space-between;
    .select-materials-search-p{
      font-size: 14px;
      line-height: 30px;
      padding: 0 10px;
    }
  }
  .detail-ul-mian{
    .font-weight{
      width: auto !important;
    }
    .li-item-both-long{
      div{
        span:nth-child(1){
          width: auto !important;
        }
      }
    }
  }
}
  .detail-base-info-edited {
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
    display: flex;
    flex-direction: column;

    .detail-title-content {
      padding-left: 0;
      padding-right: 0;

      img {
        width: 26px;
        height: 26px;
      }

      span {
        line-height: 26px;
        margin-left: 0;
      }
    }

    .detail-title-content-edited {
      margin: 21px;
      text-align: center;
      font-size: 12px;

      .van-button {
        width: 110px;
        height: 28px;
        margin-right: 6px;
        font-size: 12px;
      }

      .detail-title-content-edited-add {
        width: 16px;
        height: 16px;
        vertical-align: sub;
      }
    }

    .detail-title-content-edited-button {
      margin-top: 10px;
      margin-bottom: 12px;
    }

    .detail-list-ul-edited {
      border-bottom: 1px solid #e3e3e3;
    }

    .detail-base-info-edited-all {
      text-align: right;
      font-size: 12px;
      padding-top: 10px;
      padding-right: 16px;

      img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
    }

    .detail-title-content-field {
      padding-left: 20px;
      padding-right: 10px;
      padding-bottom: 5px;

      .detail-base-info-edited-textarea {
        background: #f6f6f6;
        border-radius: 10px;
      }
    }

    .detail-ul-text {
      margin-left: 5px;
      margin-right: 5px;
      margin-bottom: 10px;
      background: #f2f2f2;
      border-radius: 5px;

      .detail-ul {
        padding: 10px 12px;

        li {
          span {
            text-align: left;
          }
        }
      }
    }

    .detail-ul-text2 {
    width: 100%;
    padding-top: 5px;
    background: #ffffff;
    padding: 10px 5px;

    .detail-title-content {
        width: 100%;
        // height: 34px;
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
        // align-items: center;
        // padding-left: 9px;
        // padding-right: 27px;
        box-sizing: border-box;

        img {
            width: 18px;
            height: 18px;
        }
        & span:nth-child(2){
            margin-left: 6px;
            color: #151b3e;
            font-size: 15px;
            font-weight: 600;
            line-height: 20px;
        }
        & span:nth-child(3){
            color: #151b3e;
            font-size: 15px;
            font-weight: 600;
            flex: 1;
            word-break: break-all;
            line-height: 20px;
        }
    }
    }

    .detail-title-edited-p {
      justify-content: space-between;

      p {
        img {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }

        &:nth-child(2) {
          padding-right: 10px;

          span {
            font-weight: 400;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>