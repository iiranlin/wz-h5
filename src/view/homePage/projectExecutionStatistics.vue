<template>
  <div class="project-execution-statistics">
    <van-sticky>
      <div class="search-header-panel">
        <div class="list-search-container">
          <van-search
            v-model="formData.queryField"
            placeholder="输入关键字搜索"
            shape="round"
            left-icon="none"
            show-action
            @search="handleSearch"
          >
            <template slot="right-icon">
              <van-icon name="search" @click="handleSearch" />
            </template>
            <template slot="action">
              <van-button class="export-button" type="info" round size="small" @click="handleExport">
                导出
              </van-button>
            </template>
          </van-search>
        </div>

        <div class="date-range-container">
          <div class="date-field" @click="openDatePicker('startDate')">
            <span class="date-field__label">开始日期</span>
            <span class="date-field__value">{{ formData.startDate }}</span>
            <van-icon name="arrow-down" />
          </div>
          <div class="date-range-separator">至</div>
          <div class="date-field" @click="openDatePicker('endDate')">
            <span class="date-field__label">结束日期</span>
            <span class="date-field__value">{{ formData.endDate }}</span>
            <van-icon name="arrow-down" />
          </div>
        </div>

        <div v-if="dataList.length > 0" class="selection-toolbar">
          <!-- <van-checkbox
            :value="isAllCurrentSelected"
            :disabled="selectableIds.length === 0"
            @click="toggleCurrentPageSelection"
          >
            全选已加载
          </van-checkbox> -->
          <span class="selection-toolbar__count">已勾选 {{ selectedIds.length }} 项</span>
          <span
            v-if="selectedIds.length"
            class="selection-toolbar__clear"
            @click="clearSelection"
          >
            清空
          </span>
        </div>
      </div>
    </van-sticky>

    <div v-if="dataList.length > 0">
      <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
        <van-list
          v-model="allLoading"
          :finished="allFinished"
          finished-text="没有更多了..."
          :immediate-check="false"
          @load="getAllList"
        >
          <van-checkbox-group v-model="selectedIds" class="statistics-checkbox-group">
            <div
              v-for="(item, index) in dataList"
              :key="item.id || `${item.contractNo || 'row'}-${index}`"
              class="box-container statistics-card"
            >
              <div class="list-title-content statistics-card__title">
                <van-checkbox
                  class="statistics-card__checkbox"
                  shape="square"
                  :name="item.id"
                  :disabled="!hasSelectableId(item)"
                />
                <span class="font-weight" style="color: #8C8FA0;">{{ formatValue(item.materialName) }}</span>
              </div>

              <ul class="list-ul">
                <li v-for="field in getDisplayFields(index)" :key="field.key">
                  <span>{{ field.label }}：</span>
                  <span>{{ formatValue(item[field.key]) }}</span>
                </li>
              </ul>

              <div class="expand-action" @click.stop="toggleExpand(index)">
                <span>{{ expandedMap[index] ? '收起' : '展开更多' }}</span>
                <van-icon :name="expandedMap[index] ? 'arrow-up' : 'arrow-down'" />
              </div>
            </div>
          </van-checkbox-group>
        </van-list>
      </van-pull-refresh>
    </div>

    <div v-else>
      <van-pull-refresh v-model="allRefreshLoading" @refresh="allRefresh" success-text="刷新成功">
        <van-empty image="/empty-image-default.png" description="暂无数据" />
      </van-pull-refresh>
    </div>

    <van-popup v-model="showDatePicker" position="bottom" round>
      <van-datetime-picker
        v-model="pickerDate"
        type="date"
        @confirm="handleDateConfirm"
        @cancel="hideDatePicker"
      />
    </van-popup>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import * as FileApi from '@/api/prodmgr-inv/file'
import { materialDetailsQueryList } from '@/api/prodmgr-inv/materialsPlans'

const FIELD_LIST = [

  { key: 'contractNo', label: '合同编号' },
  { key: 'contractName', label: '合同名称' },
  { key: 'sellerName', label: '卖方' },
  { key: 'materialName', label: '物资名称' },
  { key: 'specModel', label: '规格型号' },
  { key: 'unit', label: '计量单位' },
  { key: 'amount', label: '合同数量' },
  // { key: 'vatRate', label: '增值税率%' },
  { key: 'cumulativeAmount', label: '累计下达数量' },
  { key: 'newAmount', label: '期间新增下达数量' },
  { key: 'sendTotal', label: '累计发货数量' },
  { key: 'putTotal', label: '累计收货数量' },
  { key: 'storeTotal', label: '累计入库数量' },
  { key: 'outTotal', label: '累计出库数量' },
  { key: 'stockTotal', label: '实时库存' }
]

const DEFAULT_SHOW_COUNT = 7

export default {
  name: 'ProjectExecutionStatistics',
  data() {
    const endDate = new Date()
    const startDate = this.getPrevMonthDate(endDate)

    return {
      formData: {
        queryField: '',
        startDate: this.formatDate(startDate),
        endDate: this.formatDate(endDate)
      },
      dataList: [],
      expandedMap: {},
      showDatePicker: false,
      pickerType: 'startDate',
      pickerDate: startDate,
      selectedIds: [],
      allRefreshLoading: false,
      allLoading: false,
      allFinished: false,
      allListQuery: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    selectableIds() {
      return this.dataList.reduce((ids, item) => {
        if (this.hasSelectableId(item) && !ids.includes(item.id)) {
          ids.push(item.id)
        }
        return ids
      }, [])
    },
    isAllCurrentSelected() {
      return this.selectableIds.length > 0 && this.selectableIds.every(id => this.selectedIds.includes(id))
    }
  },
  created() {
    this.allRefresh()
  },
  methods: {
    getPrevMonthDate(date) {
      return dayjs(date).subtract(1, 'month').toDate()
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD')
    },
    allRefresh() {
      this.allRefreshLoading = true
      this.allLoading = true
      this.allFinished = false
      this.allListQuery.pageNum = 1
      this.expandedMap = {}
      this.selectedIds = []
      this.getAllList()
    },
    getAllList() {
      const toast = this.$toast.loading({
        duration: 0,
        message: '正在加载...',
        forbidClick: true
      })

      materialDetailsQueryList(Object.assign({}, this.allListQuery, this.formData)).then(({ data }) => {
        if (this.allRefreshLoading) {
          this.dataList = []
          this.allRefreshLoading = false
        }

        const list = data?.list || []
        this.allLoading = false
        this.dataList = [...this.dataList, ...list]

        if (list.length === 0) {
          this.allFinished = true
          return
        }

        this.allListQuery.pageNum = this.allListQuery.pageNum + 1
      }).catch(() => {
        this.allLoading = false
        this.allFinished = true
      }).finally(() => {
        toast.clear()
      })
    },
    handleSearch() {
      this.allRefresh()
    },
    async handleExport() {
      const businessData = {
        queryField: this.formData.queryField,
        startDate: this.formData.startDate,
        endDate: this.formData.endDate
      }

      if (this.selectedIds.length) {
        businessData.ids = this.selectedIds
      }

      try {
        await FileApi.customDownload({
          businessType: 15,
          businessData: JSON.stringify(businessData)
        })
      } catch (error) {
        this.$toast('导出失败')
      }
    },
    openDatePicker(type) {
      this.pickerType = type
      this.pickerDate = this.formData[type] ? new Date(this.formData[type]) : new Date()
      this.showDatePicker = true
    },
    handleDateConfirm() {
      const selectedDate = this.formatDate(this.pickerDate)

      if (this.pickerType === 'startDate') {
        this.formData.startDate = selectedDate

        if (dayjs(this.formData.endDate).isBefore(selectedDate)) {
          this.formData.endDate = selectedDate
        }
      } else {
        if (dayjs(selectedDate).isBefore(this.formData.startDate)) {
          this.$toast('结束日期不能早于开始日期')
          return
        }

        this.formData.endDate = selectedDate
      }

      this.showDatePicker = false
      this.allRefresh()
    },
    hideDatePicker() {
      this.showDatePicker = false
    },
    toggleExpand(index) {
      this.$set(this.expandedMap, index, !this.expandedMap[index])
    },
    getDisplayFields(index) {
      return this.expandedMap[index] ? FIELD_LIST : FIELD_LIST.slice(0, DEFAULT_SHOW_COUNT)
    },
    hasSelectableId(item) {
      return item && item.id !== undefined && item.id !== null && item.id !== ''
    },
    toggleCurrentPageSelection() {
      if (this.selectableIds.length === 0) {
        return
      }

      if (this.isAllCurrentSelected) {
        this.selectedIds = this.selectedIds.filter(id => !this.selectableIds.includes(id))
        return
      }

      this.selectedIds = Array.from(new Set([...this.selectedIds, ...this.selectableIds]))
    },
    clearSelection() {
      this.selectedIds = []
    },
    formatValue(value) {
      return value === 0 || value === '0' ? value : (value || '--')
    }
  }
}
</script>

<style lang="less" scoped>
.project-execution-statistics {
  .search-header-panel {
    background: #fff;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .list-search-container {
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }
}

.export-button {
  padding: 0 12px;
  margin-top: 2px;
}

.date-range-container {
  padding: 0 12px;
  display: flex;
  align-items: center;
  background: #fff;
}

.date-field {
  flex: 1;
  height: 36px;
  padding: 0 10px;
  border-radius: 18px;
  background: #f7f8fa;
  display: flex;
  align-items: center;
  color: #323233;
  font-size: 13px;

  .van-icon {
    color: #969799;
    font-size: 14px;
  }
}

.date-field__label {
  color: #646566;
  margin-right: 6px;
}

.date-field__value {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.date-range-separator {
  width: 24px;
  text-align: center;
  color: #969799;
  font-size: 12px;
}

.selection-toolbar {
  height: 34px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  background: #fff;
  color: #646566;
  font-size: 13px;

  ::v-deep .van-checkbox__icon {
    font-size: 16px;

    .van-icon {
      border: 1px solid #1989fa;
    }
  }

  ::v-deep .van-checkbox__label {
    color: #323233;
    margin-left: 6px;
  }
}

.selection-toolbar__count {
  margin-left: 14px;
}

.selection-toolbar__clear {
  margin-left: auto;
  color: #1989fa;
}

.statistics-checkbox-group {
  display: block;
}

.statistics-card {
  padding-bottom: 0;

  .statistics-card__title {
    display: flex;
    align-items: center;
  }

  .statistics-card__checkbox {
    flex: 0 0 auto;
    margin-right: 8px;

    ::v-deep .van-checkbox__icon {
      font-size: 18px;

      .van-icon {
        border: 1px solid #1989fa;
      }
    }
  }

  ::v-deep .list-ul li {
    display: flex;
    align-items: flex-start;
  }

  ::v-deep .list-ul li span:first-child {
    flex: 0 0 auto;
  }

  ::v-deep .list-ul li span:last-child {
    flex: 1;
    white-space: normal;
    word-break: break-all;
    overflow: visible;
    text-overflow: initial;
  }
}

.expand-action {
  height: 44px;
  border-top: 1px solid #f2f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1989fa;
  font-size: 14px;

  span {
    margin-right: 4px;
  }
}
</style>
