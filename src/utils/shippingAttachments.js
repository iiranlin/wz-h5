export const shippingFields = [
  { key: 'zczp', label: '装车照片1(车牌)' },
  { key: 'zczp2', label: '装车照片2(车尾)' },
  { key: 'zczp3', label: '装车照片3(货位)' },
  { key: 'hgz', label: '合格证' },
  { key: 'zjbg', label: '自检报告' },
  { key: 'xssybg', label: '型式实验报告' },
  { key: 'zlzmwj', label: '其他质量文件', optional: true }
];
export function readShippingFiles(value) {
  const files = typeof value === 'string' ? JSON.parse(value || '{}') : (value || {});
  return Object.fromEntries(shippingFields.map(({ key }) => [key, files[key] || (key === 'zlzmwj' ? files.zlzm : null) || []]));
}
export const shippingMixin = {
  data() { return { shippingFields, ...readShippingFiles(null) }; },
  methods: {
    shippingFiles() { return Object.fromEntries(shippingFields.map(({ key }) => [key, this[key]])); },
    restoreShippingFiles(files, cache = {}) {
      const data = readShippingFiles(files);
      shippingFields.forEach(({ key }) => { this[key] = Object.prototype.hasOwnProperty.call(cache, key) ? cache[key] : data[key]; });
    },
    validateShippingFiles() {
      const missing = shippingFields.find(field => !field.optional && !this[field.key]?.length);
      if (missing) { this.$toast('请上传' + missing.label); return false; }
      return true;
    }
  }
};

export function readOriginalFiles(value) { return typeof value === 'string' ? JSON.parse(value || '{}') : (value || {}); }
