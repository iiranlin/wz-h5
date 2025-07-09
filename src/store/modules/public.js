const state = {
  materiaList: null,
  interfaceMateriaList: JSON.parse(localStorage.getItem('interfaceMateriaList')) || [],
  sendGoods:{},
  historyList: JSON.parse(localStorage.getItem('historyList')) || {}
};

const mutations = {
  SET_MATERIA_LIST: (state, materiaList) => {
    state.materiaList = materiaList;
  },
  SET_GOODS_LIST:(state,goodsList)=>{
    state.sendGoods = goodsList
  },
  SET_HISTORY_LIST:(state, historyList)=>{
    let object = JSON.parse(localStorage.getItem('historyList')) || historyList
    if(object){
      for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
          object[key].push(...(historyList[key] || []))
          object[key] = Array.from(new Set(object[key]))
          if(object[key].length > 4){
            object[key] = object[key].slice(-5)
          }
        }
      }
    }
    localStorage.setItem('historyList', JSON.stringify(object))
    state.historyList = object
  },
  SET_INTERFACE_MATERIA_LIST:(state, interfaceMateriaList)=>{
    localStorage.setItem('interfaceMateriaList', JSON.stringify(interfaceMateriaList))
    state.interfaceMateriaList = interfaceMateriaList
  }
};

const actions = {
  setMateriaList({ commit }, data) {
    commit('SET_MATERIA_LIST', data)
  },
  setInterfaceMateriaList({ commit }, data) {
    commit('SET_INTERFACE_MATERIA_LIST', data)
  },
  setGoodsList({commit},data){
    commit('SET_GOODS_LIST', data)
  },
  setHistoryList({commit}, data){
    commit('SET_HISTORY_LIST', data)
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
