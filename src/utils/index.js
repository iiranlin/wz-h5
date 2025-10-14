/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (time == null) {
    return '';
  }
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time) {
  const d = new Date(time)
  const now = Date.now()
  const diff = (now - d) / 1000
  if (parseTime(d, '{y}-{m}-{d}') === parseTime(now, '{y}-{m}-{d}')) { //今天的日子
    if (diff < 30) {
      return '刚刚'
    } else if (diff < 3600) {
      return Math.ceil(diff / 60) + '分钟前'
    } else if (parseTime(d, '{h}') >= 12) {
      return '下午 ' + parseTime(d, '{h}:{s}');
    } else if (parseTime(d, '{h}') < 12) {
      return '上午 ' + parseTime(d, '{h}:{s}');
    }
  } else if (diff < 3600 * 24 * 2) {
    return '昨天'
  }
  if (parseTime(d, '{y}') == new Date().getFullYear()) { // 同一年
    return parseTime(time, '{m}月{d}日');
  } else {
    return parseTime(d, '{y}/{m}/{d}');
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}
/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}


/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

export function jsonp(url, params = null, callback) {
  if (!url) {
    return false;
  }
  let script_id = Math.random().toString().substr(2, 5);
  let callbackName = 'jsonp_callback' + Date.now() + script_id;
  let script = document.createElement('script');
  script.id = script_id;
  let data = params ? ('?' + param(params)) : '?';
  script.src = url + data + '&callback=' + callbackName;

  document.body.appendChild(script);
  window[callbackName] = (response) => {
    delete window[callbackName];
    typeof callback === 'function' && callback(response);
    document.body.removeChild(script);
  };
}



/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * 规范数字输入,整数位默认8,小数位2
 * @param obj 表单项或绑定的对象
 * @param key 对象的属性名
 * @param intLimit 整数位限制,默认为8
 * @param decimal 小数位限制,默认为2
 */
export function handleNumberLimit(obj, key, intLimit = 8, decimal = 2) {
  if (decimal == 0) {
    // 把点替换掉
    obj[key] = obj[key].replace('.', '')
  }
  // 先把非数字的都替换掉，除了数字和 .
  obj[key] = obj[key].replace(/[^\d.]/g, '')
  // 保证只有出现一个 . 而没有多个 .
  obj[key] = obj[key].replace(/\.{2,}/g, '.')
  // 必须保证第一个为数字而不是 .
  obj[key] = obj[key].replace(/^\./g, '')
  // 保证 . 只出现一次，而不能出现两次以上
  obj[key] = obj[key]
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
  // 只能输入 2 位小数
  obj[key] = obj[key].replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
  // 动态生成整数位限制正则
  let intReg = new RegExp(`^\\D*(\\d{0,${intLimit}}(?:\\.\\d{0,${decimal}})?).*$`, 'g')
  obj[key] = obj[key].replace(intReg, '$1')
}

/**
* 格式化数字 千位分隔符
* @param num 数值
* @param decimals 保留小数点后几位
*/
export const formatNumber = (num, decimals) => {
  if (decimals === "0") {
    decimals = 0;
  } else if (decimals === undefined || decimals === null) {
    decimals = 2;
  }
  decimals = isNaN(decimals) ? 2 : +decimals;
  if (!num || isNaN(parseFloat(num))) {
    // 校验num存在且为数值
    return (0).toFixed(decimals);
  }
  num = (+num).toFixed(+decimals);
  num += "";
  const x = num.split(".");
  let x1 = x[0];
  const x2 = x.length > 1 ? "." + x[1] : "";
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
};

export function download(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export function isAndroid() {
  let userAgent = navigator.userAgent
  return /Android|adr/gi.test(userAgent)
}

export function handlerTextColor(statusList, value, status) {
  const textColor = statusList.find(item => item[value] === status)?.color;

  return textColor ? { color: textColor + ' !important' } : {}
}


import imageCompression from 'browser-image-compression';

export async function compressImage (file) {
  const fileSizeMB = file.size / 1024 / 1024;
   let quality = 1; // 默认不压缩

  // 分段压缩策略
  if (fileSizeMB >= 10) {
    quality = 0.15; // 大于等于10MB，压缩到15%
  } else if (fileSizeMB >= 5) {
    quality = 0.3; // 5MB~10MB，压缩到30%
  } else {
    // 小于5MB不压缩
    return file;
  }

  try {
    const compressedBlob = await imageCompression(file, {
      maxSizeMB: fileSizeMB * quality,
      initialQuality: quality,
      useWebWorker: true
    });

    // 转成 File 并保留原始文件名
    return new File([compressedBlob], file.name, { type: file.type });
  } catch (error) {
    console.error("图片压缩失败:", error);
    return file;
  }
}


import { PDFDocument } from 'pdf-lib';

export async function compressPDF (file, { limitSizeMB = 20, quality = 0.8 } = {}) {
  const fileSizeMB = file.size / 1024 / 1024;
  const needCompress = limitSizeMB === 0 || fileSizeMB > limitSizeMB;

  if (!needCompress) return file;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const pages = pdfDoc.getPages();
    for (let page of pages) {
      const { width, height } = page.getSize();
      page.setSize(width * quality, height * quality);
    }

    const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: false });
    return new File([compressedPdfBytes], file.name, { type: 'application/pdf' });
  } catch (error) {
    console.error("PDF 压缩失败:", error);
    return file;
  }
}

// 合并连续 actId 相同且 status 都无值的项，合并 assigneeName，否则不合并
export function mergeByActId(data) {
  if (!Array.isArray(data) || data.length === 0) return [];

  const result = [];
  let group = [];

  const pushGroup = () => {
    if (group.length === 0) return;
    // 检查 group 内 status 是否都无值
    const hasStatus = group.some(item => item.status !== undefined && item.status !== null && item.status !== "");
    if (group.length === 1 || hasStatus) {
      // 只有一个或有 status，不合并，逐个 push
      group.forEach(item => {
        result.push({
          ...item,
          assigneeName: item.assigneeName || ""
        });
      });
    } else {
      // 全部无 status，合并 assigneeName
      const merged = { ...group[0] };
      merged.assigneeName = group
        .map(i => i.assigneeName)
        .filter(Boolean)
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .join("、");
      result.push(merged);
    }
    group = [];
  };

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (group.length === 0 || group[group.length - 1].actId === item.actId) {
      group.push(item);
    } else {
      pushGroup();
      group.push(item);
    }
  }
  pushGroup();

  return result;
}
