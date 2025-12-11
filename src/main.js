import "amfe-flexible";
import Vue from "vue";
import App from "./App";
import router from "./router/index.js";
import store from "./store/index.js";
import "vant/lib/index.css";
import "./styles/index.less";
import { parseTime } from "@/utils/index.js";
import { handlerTextColor } from "@/utils/index.js";
// import * as echarts from "echarts";
// Vue.prototype.$echarts = echarts;
import "./permission"; // permission control

import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '7ee2b9f23eb1684964e11dd6126b0534', // 替换为你的API Key
   plugin: [
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PlaceSearch',
    "AMap.Autocomplete",
    'AMap.Geolocation',
    'AMap.Geocoder',
    "AMap.AMapUI",// UI组件
  ],

});
window._AMapSecurityConfig = {
  securityJsCode:'7edcf69b8c9474e0c1bee349f2ac3460',
}

import dict from '@/utils/Dict'
Vue.use(dict)


import {
  Row,
  Col,
  Button,
  Tabbar,
  TabbarItem,
  NavBar,
  Form,
  Field,
  Area,
  Popup,
  Picker,
  RadioGroup,
  Radio,
  Tag,
  Step,
  Steps,
  Tabs,
  Tab,
  Badge,
  DatetimePicker,
  Calendar,
  Notify,
  ActionSheet,
  List,
  Dialog,
  NoticeBar,
  PullRefresh,
  Cell,
  CellGroup,
  Sticky,
  Collapse,
  CollapseItem,
  Icon,
  Image as VanImage,
  Panel,
  Switch,
  Cascader,
  Grid,
  GridItem,
  Uploader,
  TreeSelect ,
  Search,
  Popover,
  ImagePreview,
  DropdownMenu,
  DropdownItem,
  Checkbox,
  CheckboxGroup,
  Sidebar,
  SidebarItem,
  Empty,
  Stepper
} from "vant";
Vue.use(Row);
Vue.use(Col);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Sticky);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(PullRefresh);
Vue.use(NoticeBar);
Vue.use(Dialog);
Vue.use(List);
Vue.use(ActionSheet);
Vue.use(Notify);
Vue.use(Calendar);
Vue.use(DatetimePicker);
Vue.use(Badge);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Step);
Vue.use(Steps);
Vue.use(Tag);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Picker);
Vue.use(Popup);
Vue.use(Area);
Vue.use(Field);
Vue.use(Form);
Vue.use(NavBar);
Vue.use(Button);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Icon);
Vue.use(Panel);
Vue.use(Switch);
Vue.use(Cascader);
Vue.use(Uploader);
Vue.use(VanImage);
Vue.use(Grid);
Vue.use(GridItem);
Vue.use(TreeSelect);
Vue.use(Search);
Vue.use(Popover);
Vue.use(ImagePreview);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Sidebar);
Vue.use(SidebarItem);
Vue.use(Empty);
Vue.use(Stepper);

Vue.prototype.parseTime = parseTime;
Vue.prototype.handlerTextColor = handlerTextColor;

Vue.directive('decimal', {
  bind(el, binding, vnode) {
    // 小数位数，默认 2 位
    const decimalLen = typeof binding.value === 'number' ? binding.value : 2

    // 兼容 van-field 这种外层是 div，内部才是 input 的情况
    const inputEl =
      el.tagName.toLowerCase() === 'input' ? el : el.querySelector('input')

    if (!inputEl) return

    const handler = (e) => {
      let val = e.target.value

      if (!val) return

      // 1. 只允许数字和小数点
      val = val.replace(/[^0-9.]/g, '')

      // 2. 不允许第一个字符就是小数点
      val = val.replace(/^\./g, '')

      // 3. 只保留第一个小数点
      val = val.replace(/\.{2,}/g, '.')
      val = val.replace('.', '#').replace(/\./g, '').replace('#', '.')

      // 4. 限制小数位数
      if (decimalLen >= 0 && val.indexOf('.') > -1) {
        const [intPart, decPart] = val.split('.')
        val = intPart + '.' + decPart.slice(0, decimalLen)
      }

      // 有变更才回写并触发 v-model 更新
      if (val !== e.target.value) {
        e.target.value = val

        // 触发原生 input 事件，让 v-model 生效
        const event = document.createEvent('HTMLEvents')
        event.initEvent('input', true, false)
        e.target.dispatchEvent(event)
      }
    }

    // 保存到元素上，unbind 时移除
    inputEl.__decimalHandler__ = handler
    inputEl.addEventListener('input', handler)
  },

  unbind(el) {
    const inputEl =
      el.tagName.toLowerCase() === 'input' ? el : el.querySelector('input')
    if (inputEl && inputEl.__decimalHandler__) {
      inputEl.removeEventListener('input', inputEl.__decimalHandler__)
      delete inputEl.__decimalHandler__
    }
  }
})

import { smartBack } from "@/permission"

Vue.prototype.$smartBack = smartBack;

new Vue({
  store,
  router,
  el: "#app",
  render: (h) => h(App),
});
