<template>
  <div class="calendar">
    <van-calendar
      ref="calendar"
      :default-date="date"
      v-model="show"
      :show-subtitle="false"
      type="single"
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

export default {
  name: "demoPage",
  props: {
    unlimited: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 日历副标题
      titleDate: {
        date: defaultDate,
        title: `${new Date().getFullYear()}年${new Date().getMonth() + 1}月`
      },
      // 日期格式
      dateFormat,
      //默认时间范围
      defaultDate,
      //当前选择时间
      date: defaultDate,
      // 日期选择范围
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
      return this.maxDateRange[1];
    },
    maxDateComp() {
      if (this.unlimited) {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 20);
        return d;
      }
      return this.maxDateRange[0];
    }
  },
  mounted() {

  },
  methods: {
    //日历弹窗方法
    handleCalendarShow(num = 0) {
      this.flagNum = num;
      this.maxDateRange = this.flagNum == 0 ? maxDateRange : maxDateRange2;
      this.show = true;
      setTimeout(() => {
        //设置日历转到最新日期的展示界面
      }, 300);
      this.$refs.calendar.scrollToDate(new Date());
    },
    //选择日期触发方法
    onConfirm(date) {
      this.show = false;
      this.date = date;
      this.$emit("onConfirm", date);
    // console.log(date, "date");
    },
    //重置时间选择为默认时间
    reset() {
      this.date = this.defaultDate;
      this.$refs.calendar.reset(this.defaultDate);
    },
    //视图滚动到指定日期的视图
    scrollToDate(type, dateType) {
      let transDate = "";
      if (type == "up") {
        transDate = dayjs(this.titleDate.date).add(1, dateType);
      }
      if (type == "down") {
        transDate = dayjs(this.titleDate.date).add(-1, dateType);
      }
      if (!this.unlimited) {
        const leftDiffMonths = dayjs(transDate).diff(dayjs(maxDateRange[1]), "months");
        const rightDiffMonths = dayjs(maxDateRange[0]).diff(
          dayjs(transDate),
          "months"
        );
        console.log(leftDiffMonths, rightDiffMonths, "leftDiffMonths");
        // 控制翻页范围，超出就提示
        if (this.flagNum == 0) {
          if (leftDiffMonths <= -1 || rightDiffMonths <= -1) {
              Toast.fail("已超出最大可选范围");
              return null;
          }
        } else {
          if (leftDiffMonths >= 0 || rightDiffMonths <= 0) {
              Toast.fail("已超出最大可选范围");
              return null;
          }
        }
      }

      const yearNum = transDate.format("YYYY");
      const monthNum = parseInt(transDate.format("MM"));
      const newDate = {
        date: new Date(transDate.format()),
        title: yearNum + "年" + monthNum + "月"
      };
      this.titleDate = newDate;
      this.$refs.calendar.scrollToDate(new Date(newDate.date));
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