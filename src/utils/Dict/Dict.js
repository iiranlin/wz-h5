import Vue from 'vue';
import { getListByParentCode } from '@/api/blcd-base/dict';
export default class Dict {
  constructor(dict) {
    this.dict = dict;
  }
  async init(names, callback) {
    if (names === undefined || name === null) {
      throw new Error('need Dict names')
    }
    names.forEach(n => {
      Vue.set(this.dict.dictLabel, n, {})
      Vue.set(this.dict, n, [])
      getListByParentCode(n).then(res => {
        this.dict[n].splice(0, 0, ...res.data)
        res.data.forEach(d => {
          Vue.set(this.dict.dictLabel[n], d.dictCode, d.dictLabel)
        })
      })
    });
    callback()
  }
}