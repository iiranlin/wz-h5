<template>
  <div class="calendar">
    <van-calendar
      ref="calendar"
      :default-date="date"
      v-model="show"
      :show-subtitle="false"
      type="range"
      @confirm="onConfirm"
      :min-date="minDateComp"
      :max-date="maxDateComp"
    >
      <template v-slot:title>
        <div class="timeSelect">
          <img :src="multiArrow" @click="scrollToDate('down','year')" />
          <img :src="signalArrow" @click="scrollToDate('down','month')" class="left" />
          <p>{{titleDate.title}}</p>
          <img :src="signalArrow" @click="scrollToDate('up','month')" />
          <img :src="multiArrow" @click="scrollToDate('up','year')" class="left" />
        </div>
      </template>
    </van-calendar>
  </div>
</template>
  
<script>
import Vue from "vue";
import dayjs from "dayjs";
import { Calendar, Toast } from "vant";
import { defaultDate, maxDateRange, maxDateRange2, dateFormat } from "./config";

import signalArrow from "@/assets/img/Arrow-R.png";
import multiArrow from "@/assets/img/arrow-left.png";
 
Vue.use(Calendar);
Vue.use(Toast);

function getStartOfDefault(d) {
  // 支持传入 Date 或 [Date, Date]
  if (!d) return new Date();
  return Array.isArray(d) ? (d[0] ? new Date(d[0]) : new Date()) : new Date(d);
}

export default {
  name: "demoPage",
  props: {
    unlimited: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const startDate = getStartOfDefault(defaultDate);
    return {
      // 日历副标题：确保 date 为原生 Date
      titleDate: {
        date: startDate,
        title: dayjs(startDate).format("YYYY年M月")
      },
      // 日期格式
      dateFormat,
      // 默认时间范围（可能是 [start,end]）
      defaultDate,
      // 当前选择时间（保持跟 van-calendar 传入/返回一致，range 为数组）
      date: defaultDate,
      // 日期选择范围（组件内会赋值为 [max, min]）
      maxDateRange: [],
      // 日历弹窗是否展示
      show: false,
      signalArrow,
      multiArrow,
      flagNum: 0,
    };
  },
  computed: {
    minDateComp() {
      if (this.unlimited) {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 20);
        return d;
      }
      // 保护：如果没有配置范围，返回一个较小的时间（或者 null 会被 vant 忽略）
      if (!this.maxDateRange || this.maxDateRange.length < 2) {
        // 返回一个很早的时间，避免 undefined 导致 dayjs 之类出错
        const d = new Date();
        d.setFullYear(d.getFullYear() - 100);
        return d;
      }
      // 注意：你的原始逻辑是用 this.maxDateRange[1] 作为 min（保留）
      return new Date(this.maxDateRange[1]);
    },
    maxDateComp() {
      if (this.unlimited) {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 20);
        return d;
      }
      if (!this.maxDateRange || this.maxDateRange.length < 2) {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 100);
        return d;
      }
      return new Date(this.maxDateRange[0]);
    }
  },
  mounted() {
    // 保证 titleDate 在 mounted 时与默认选择一致
    const start = getStartOfDefault(this.date);
    this.titleDate = {
      date: start,
      title: dayjs(start).format("YYYY年M月")
    };
  },
  methods: {
    // 日历弹窗方法
    handleCalendarShow(num = 0) {
      this.flagNum = num;
      // 赋值组件内部范围（确保是数组）
      this.maxDateRange = this.flagNum === 0 ? (Array.isArray(maxDateRange) ? maxDateRange : []) : (Array.isArray(maxDateRange2) ? maxDateRange2 : []);
      // 打开弹窗
      this.show = true;

      // 等待 DOM & 子组件渲染完再滚动到当前标题日期
      this.$nextTick(() => {
        // 以当前 titleDate.date 为基准滚动
        if (this.$refs.calendar && this.titleDate && this.titleDate.date) {
          this.$refs.calendar.scrollToDate(new Date(this.titleDate.date));
        } else {
          this.$refs.calendar && this.$refs.calendar.scrollToDate(new Date());
        }
      });
    },
    // 选择日期触发方法（vant range 返回通常是 [start,end]）
    onConfirm(date) {
      this.show = false;
      this.date = date;
      // 将 titleDate 更新成选择区间的开始日期，以保证标题一致
      const start = Array.isArray(date) ? (date[0] ? new Date(date[0]) : new Date()) : new Date(date);
      this.titleDate = {
        date: start,
        title: dayjs(start).format("YYYY年M月")
      };
      this.$emit("onConfirm", date);
    },
    // 重置时间选择为默认时间
    reset() {
      this.date = this.defaultDate;
      const start = getStartOfDefault(this.defaultDate);
      this.titleDate = {
        date: start,
        title: dayjs(start).format("YYYY年M月")
      };
      // reset 要确保传入的是 defaultDate 的格式（Date 或 [Date,Date]）
      if (this.$refs.calendar && this.$refs.calendar.reset) {
        // vant 的 reset 接口通常接收 date 参数
        this.$refs.calendar.reset(this.defaultDate);
      }
    },
    // 视图滚动到指定日期的视图
    scrollToDate(type, dateType) {
      // 让 transDate 从 titleDate.date（原生 Date）构造 dayjs
      let transDate = dayjs(this.titleDate && this.titleDate.date ? this.titleDate.date : new Date());

      if (type === "up") {
        transDate = transDate.add(1, dateType);
      } else if (type === "down") {
        // 使用 subtract 更直观
        transDate = transDate.subtract(1, dateType);
      }

      // 范围控制逻辑（注意要用 this.maxDateRange）
      if (!this.unlimited && this.maxDateRange && this.maxDateRange.length >= 2) {
        const leftDiffMonths = transDate.diff(dayjs(this.maxDateRange[1]), "months");
        const rightDiffMonths = dayjs(this.maxDateRange[0]).diff(transDate, "months");

        if (this.flagNum === 0) {
          if (leftDiffMonths <= -1 || rightDiffMonths <= -1) {
            Toast.fail("已超出最大可选范围");
            return;
          }
        } else {
          if (leftDiffMonths >= 0 || rightDiffMonths <= 0) {
            Toast.fail("已超出最大可选范围");
            return;
          }
        }
      }

      // 生成新的 titleDate（确保 .toDate() 是原生 Date）
      const yearNum = transDate.year();
      const monthNum = transDate.month() + 1; // month() 返回 0-11

      this.titleDate = {
        date: transDate.toDate(),
        title: `${yearNum}年${monthNum}月`
      };

      // 等待界面更新后再调用 calendar 的 scrollToDate，避免时序问题
      this.$nextTick(() => {
        if (this.$refs.calendar && this.$refs.calendar.scrollToDate) {
          this.$refs.calendar.scrollToDate(this.titleDate.date);
        }
      });
    }
  },
};
</script>
  
<style lang="less" scoped>
.calendar {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-sizing: border-box;
  //   padding: 10.4px 10.4px 10.4px 0;
  color: #989898;
  position: relative;
  .date {
    width: 100%;
    height: 28.6px;
    position: relative;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    display: flex;
    align-items: center;
    span {
      margin-left: 19.5px;
    }
    img {
      position: absolute;
      right: 5px;
      width: 23.4px;
      height: 23.4px;
    }
  }
  .timeSelect {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    img {
      width: 19.5px;
      height: 19.5px;
      touch-action: none;
    }
    .left {
      transform: rotateY(180deg);
    }
  }
  /deep/ .van-calendar__header-title {
    height: auto;
  }

  /deep/ .van-popup__close-icon {
    display: none;
  }

  /deep/.van__popup--bottom {
    height: 70%;
  }
}
</style>