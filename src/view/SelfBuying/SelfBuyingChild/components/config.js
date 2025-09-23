import dayjs from 'dayjs';
//时间格式
export const dateFormat ="YYYY-MM-DD";
//当前时间
const today = new Date();
//默认起始时间
const defaultStartDay = dayjs().add(40, "years");
//默认结束时间
const defaultEndDay = dayjs().add(-40, "years");
//时间筛选框默认时间
const defaultTime = dayjs().add(1, "days")

export const defaultDate = [today, new Date(defaultTime)];
//日期选择限制
export const maxDateRange = [new Date(defaultStartDay), today];
//日期选择限制
export const maxDateRange2 = [today, new Date(defaultEndDay)];