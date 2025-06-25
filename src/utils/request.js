import axios from "axios";
import store from "@/store";
import { Dialog, Notify } from "vant";
import { getToken, setToken } from "@/utils/auth";
import { tansParams } from "@/utils/publicMethods";
import cache from '@/plugins/cache'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false,
  timeout: 5 * 60 * 1000,
});
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    if (getToken() && !isToken) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime()
      }
      const sessionObj = cache.session.getJSON('sessionObj')
      if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
        cache.session.setJSON('sessionObj', requestObj)
      } else {
        const s_url = sessionObj.url;                  // 请求地址
        const s_data = sessionObj.data;                // 请求数据
        const s_time = sessionObj.time;                // 请求时间
        const interval = 1000;                         // 间隔时间(ms)，小于此时间视为重复提交
        if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
          const message = '数据正在处理，请勿重复提交';
          console.warn(`[${s_url}]: ` + message)
          return Promise.reject({ message: message })
        } else {
          cache.session.setJSON('sessionObj', requestObj)
        }
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  (response) => {
    // 二进制数据则直接返回
    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
      return response.data
    }
    const res = response.data;
    if (res.code === 10000) {
      cache.session.remove('sessionObj')
      setToken(res.data)
      var backoff = new Promise(resolve => {
        resolve();
      });
      return backoff.then(r => {
        return service(res.config);
      });
    } else if (res.code === 401 || res.code === -10006) {
      Dialog.alert({
        title: "提示",
        message: res.message || JSON.stringify(res),
        theme: "round-button",
        confirmButtonText: '重新登录'
      }).then(() => {
        store.dispatch('LogOut')
      });
      return Promise.reject(res.message);
    }  else if (res.code !== 0) {
      Dialog.alert({
        title: "提示",
        message: res.message || JSON.stringify(res),
        theme: "round-button",
      });
      return Promise.reject(res.message);
    } else {
      return res || {};
    }
  },
  (error) => {

    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统异常，请稍后再试"
    } else if (message.includes("数据正在处理")) {

    } else {
      message = "系统异常，请稍后再试"
    }
    if (!message.includes("数据正在处理")) {
      Notify({
        message: message,
        type: 'danger',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
);

export default service;
